import { Request, Response } from 'express';
import prisma from '../db/prisma';

export const getPurchases = async (req: Request, res: Response) => {
    try {
        const purchaseList = await prisma.purchase.findMany({
            include: {
                supplier: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        email: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        username: true
                    }
                },
                details: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                product_code: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                created_at: 'desc'
            }
        });

        const formattedPurchases = purchaseList.map(p => {
            const formattedItems = p.details.map(d => ({
                id: d.id,
                purchase_id: d.purchase_id,
                product_id: d.product_id,
                lot_number: d.lot_number,
                expiration_date: d.expiration_date,
                quantity: d.quantity,
                purchase_price: Number(d.purchase_price),
                subtotal: Number(d.subtotal),
                product: d.product ? {
                    id: d.product.id,
                    name: d.product.name,
                    product_code: d.product.product_code
                } : null
            }));

            return {
                id: p.id,
                supplier_id: p.supplier_id,
                user_id: p.user_id,
                invoice_number: p.invoice_number,
                total_amount: Number(p.total_amount),
                date: p.created_at,
                created_at: p.created_at,
                notes: p.notes,
                supplier: p.supplier ? {
                    id: p.supplier.id,
                    name: p.supplier.name,
                    phone: p.supplier.phone,
                    phone_number: p.supplier.phone,
                    email: p.supplier.email
                } : null,
                user: p.user ? {
                    id: p.user.id,
                    name: p.user.name,
                    username: p.user.username
                } : null,
                items: formattedItems,
                details: formattedItems
            };
        });

        res.json(formattedPurchases);
    } catch (error) {
        console.error('Error al obtener compras:', error);
        res.status(500).json({ msg: 'Ocurrió un error al obtener las compras' });
    }
};

export const getPurchaseById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const purchase = await prisma.purchase.findUnique({
            where: { id: Number(id) },
            include: {
                supplier: {
                    select: {
                        id: true,
                        name: true,
                        phone: true,
                        email: true
                    }
                },
                user: {
                    select: {
                        id: true,
                        name: true,
                        username: true
                    }
                },
                details: {
                    include: {
                        product: {
                            select: {
                                id: true,
                                name: true,
                                product_code: true
                            }
                        }
                    }
                }
            }
        });

        if (!purchase) {
            return res.status(404).json({ msg: `Compra con id ${id} no encontrada` });
        }

        const formattedItems = purchase.details.map(d => ({
            id: d.id,
            purchase_id: d.purchase_id,
            product_id: d.product_id,
            lot_number: d.lot_number,
            expiration_date: d.expiration_date,
            quantity: d.quantity,
            purchase_price: Number(d.purchase_price),
            subtotal: Number(d.subtotal),
            product: d.product ? {
                id: d.product.id,
                name: d.product.name,
                product_code: d.product.product_code
            } : null
        }));

        res.json({
            id: purchase.id,
            supplier_id: purchase.supplier_id,
            user_id: purchase.user_id,
            invoice_number: purchase.invoice_number,
            total_amount: Number(purchase.total_amount),
            date: purchase.created_at,
            created_at: purchase.created_at,
            notes: purchase.notes,
            supplier: purchase.supplier ? {
                id: purchase.supplier.id,
                name: purchase.supplier.name,
                phone: purchase.supplier.phone,
                phone_number: purchase.supplier.phone,
                email: purchase.supplier.email
            } : null,
            user: purchase.user ? {
                id: purchase.user.id,
                name: purchase.user.name,
                username: purchase.user.username
            } : null,
            items: formattedItems,
            details: formattedItems
        });
    } catch (error) {
        console.error('Error al obtener compra:', error);
        res.status(500).json({ msg: 'Error al obtener la compra' });
    }
};

export const postPurchase = async (req: Request, res: Response) => {
    const {
        supplier_id,
        user_id,
        invoice_number,
        total_amount,
        notes,
        items
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ msg: 'Debe incluir al menos un producto en la compra' });
    }

    try {
        const purchase = await prisma.$transaction(async (tx) => {
            // 1. Crear registro cabecera de compra
            const newPurchase = await tx.purchase.create({
                data: {
                    supplier_id: Number(supplier_id),
                    user_id: user_id ? Number(user_id) : null,
                    invoice_number: invoice_number || '',
                    total_amount: Number(total_amount),
                    notes: notes || ''
                }
            });

            // 2. Procesar cada ítem
            for (const item of items) {
                // Actualizar stock del producto e historial de precio de compra
                await tx.product.update({
                    where: { id: Number(item.product_id) },
                    data: {
                        current_stock: { increment: Math.round(Number(item.quantity)) },
                        purchase_price: Number(item.purchase_price)
                    }
                });

                // Registrar detalle de compra
                await tx.purchaseDetail.create({
                    data: {
                        purchase_id: newPurchase.id,
                        product_id: Number(item.product_id),
                        lot_number: item.lot_number || null,
                        expiration_date: item.expiration_date ? new Date(item.expiration_date) : null,
                        quantity: Number(item.quantity),
                        purchase_price: Number(item.purchase_price),
                        subtotal: Number(item.subtotal || (Number(item.quantity) * Number(item.purchase_price)))
                    }
                });

                // Si se suministró fecha de expiración, crear registro en lots
                if (item.expiration_date) {
                    await tx.lot.create({
                        data: {
                            product_id: Number(item.product_id),
                            lot_number: item.lot_number || null,
                            quantity: Number(item.quantity),
                            initial_quantity: Number(item.quantity),
                            expiration_date: new Date(item.expiration_date),
                            create_by_user_id: user_id ? Number(user_id) : null
                        }
                    });
                }
            }

            return newPurchase;
        });

        res.status(201).json({
            msg: 'Compra registrada exitosamente y stock actualizado',
            purchase_id: purchase.id
        });
    } catch (error) {
        console.error('Error al registrar compra:', error);
        res.status(500).json({ msg: 'Error al registrar la compra', error });
    }
};
