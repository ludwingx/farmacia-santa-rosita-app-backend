import { Request, Response } from 'express';
import prisma from '../db/prisma';

export const getSales = async (req: Request, res: Response) => {
    try {
        const salesList = await prisma.sale.findMany({
            include: {
                user: {
                    select: { id: true, name: true, username: true }
                },
                details: {
                    include: {
                        product: {
                            select: { id: true, name: true, product_code: true }
                        },
                        lot: true,
                    }
                }
            },
            orderBy: { created_at: 'desc' }
        });

        // Format for frontend compatibility
        const formatted = salesList.map(s => ({
            ...s,
            customer_name: s.client_name,
            customer_nit: s.client_nit,
            cash_change: s.change_returned ? Number(s.change_returned) : 0,
            cash_received: s.cash_received ? Number(s.cash_received) : 0,
            total_amount: Number(s.total_amount),
            date: s.created_at,
            items: s.details.map(d => ({
                ...d,
                unit_price: Number(d.unit_price),
                subtotal: Number(d.subtotal),
                product_name: d.product?.name
            }))
        }));

        res.json(formatted);
    } catch (error) {
        console.error('Error al obtener ventas:', error);
        res.status(500).json({ msg: 'Ocurrió un error al obtener las ventas' });
    }
};

export const getSaleById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const sale = await prisma.sale.findUnique({
            where: { id: Number(id) },
            include: {
                user: {
                    select: { id: true, name: true, username: true }
                },
                details: {
                    include: {
                        product: true,
                        lot: true,
                    }
                }
            }
        });

        if (!sale) {
            return res.status(404).json({ msg: `Venta con id ${id} no encontrada` });
        }

        const formatted = {
            ...sale,
            customer_name: sale.client_name,
            customer_nit: sale.client_nit,
            cash_change: sale.change_returned ? Number(sale.change_returned) : 0,
            cash_received: sale.cash_received ? Number(sale.cash_received) : 0,
            total_amount: Number(sale.total_amount),
            date: sale.created_at,
            items: sale.details.map(d => ({
                ...d,
                unit_price: Number(d.unit_price),
                subtotal: Number(d.subtotal),
                product_name: d.product?.name
            }))
        };

        res.json(formatted);
    } catch (error) {
        console.error('Error al obtener venta:', error);
        res.status(500).json({ msg: 'Ocurrió un error al obtener la venta' });
    }
};

export const postSale = async (req: Request, res: Response) => {
    const {
        customer_name,
        client_name,
        customer_nit,
        client_nit,
        total_amount,
        payment_method,
        cash_received,
        cash_change,
        change_returned,
        user_id,
        items
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ msg: 'Debe incluir al menos un producto en la venta' });
    }

    try {
        const result = await prisma.$transaction(async (tx) => {
            // 1. Validar disponibilidad y descontar stock
            for (const item of items) {
                const prod = await tx.product.findUnique({
                    where: { id: Number(item.product_id) }
                });

                if (!prod) {
                    throw new Error(`Producto con id ${item.product_id} no existe`);
                }

                const currentStock = prod.current_stock || 0;
                const requestedQty = Number(item.quantity);

                if (currentStock < requestedQty) {
                    throw new Error(`Stock insuficiente para ${prod.name}. Disponible: ${currentStock}, Solicitado: ${requestedQty}`);
                }

                await tx.product.update({
                    where: { id: prod.id },
                    data: { current_stock: currentStock - requestedQty }
                });

                // Si se especificó lote, descontar del lote también
                if (item.lot_id) {
                    const lot = await tx.lot.findUnique({ where: { id: Number(item.lot_id) } });
                    if (lot && lot.quantity >= requestedQty) {
                        await tx.lot.update({
                            where: { id: lot.id },
                            data: { quantity: lot.quantity - requestedQty }
                        });
                    }
                }
            }

            // 2. Crear venta
            const saleCode = `VTA-${Date.now().toString().slice(-6)}`;
            const createdSale = await tx.sale.create({
                data: {
                    sale_code: saleCode,
                    client_name: client_name || customer_name || 'Cliente General',
                    client_nit: client_nit || customer_nit || '0',
                    total_amount: Number(total_amount),
                    payment_method: payment_method || 'Efectivo',
                    cash_received: cash_received ? Number(cash_received) : null,
                    change_returned: change_returned || cash_change ? Number(change_returned || cash_change) : null,
                    status: 'Completada',
                    user_id: user_id ? Number(user_id) : null,
                    details: {
                        create: items.map(item => ({
                            product_id: Number(item.product_id),
                            lot_id: item.lot_id ? Number(item.lot_id) : null,
                            quantity: Number(item.quantity),
                            unit_price: Number(item.unit_price),
                            subtotal: Number(item.subtotal || (item.quantity * item.unit_price))
                        }))
                    }
                },
                include: {
                    details: true
                }
            });

            return createdSale;
        });

        res.status(201).json({
            msg: 'Venta registrada con éxito',
            sale_id: result.id,
            sale_code: result.sale_code,
            sale: result
        });
    } catch (error: any) {
        console.error('Error al registrar venta:', error);
        res.status(400).json({ msg: error.message || 'Ocurrió un error al procesar la venta' });
    }
};

export const cancelSale = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        await prisma.$transaction(async (tx) => {
            const sale = await tx.sale.findUnique({
                where: { id: Number(id) },
                include: { details: true }
            });

            if (!sale) {
                throw new Error(`Venta con id ${id} no encontrada`);
            }

            if (sale.status === 'Anulada') {
                throw new Error('Esta venta ya se encuentra anulada');
            }

            // Devolver stock al inventario
            for (const item of sale.details) {
                const prod = await tx.product.findUnique({
                    where: { id: item.product_id }
                });

                if (prod) {
                    await tx.product.update({
                        where: { id: prod.id },
                        data: { current_stock: (prod.current_stock || 0) + item.quantity }
                    });
                }

                if (item.lot_id) {
                    const lot = await tx.lot.findUnique({ where: { id: item.lot_id } });
                    if (lot) {
                        await tx.lot.update({
                            where: { id: lot.id },
                            data: { quantity: lot.quantity + item.quantity }
                        });
                    }
                }
            }

            await tx.sale.update({
                where: { id: sale.id },
                data: { status: 'Anulada' }
            });
        });

        res.json({ msg: 'Venta anulada y stock devuelto exitosamente' });
    } catch (error: any) {
        console.error('Error al anular venta:', error);
        res.status(400).json({ msg: error.message || 'Error al anular la venta' });
    }
};
