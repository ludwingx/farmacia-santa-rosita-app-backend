import { Request, Response } from 'express';
import prisma from '../db/prisma';

export const getDashboardSummary = async (req: Request, res: Response) => {
    try {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);

        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        // 1. Total de productos registrados
        const totalProducts = await prisma.product.count();

        // 2. Ventas del día de hoy
        const todaySales = await prisma.sale.findMany({
            where: {
                created_at: {
                    gte: todayStart,
                    lte: todayEnd
                },
                status: {
                    in: ['completada', 'Completada']
                }
            }
        });

        const todaySalesCount = todaySales.length;
        const todaySalesTotal = todaySales.reduce((acc, sale) => acc + Number(sale.total_amount), 0);

        // 3. Productos con stock crítico (<= 10 unidades)
        const criticalStockCount = await prisma.product.count({
            where: {
                current_stock: { lte: 10 }
            }
        });

        // 4. Lotes y productos próximos a vencer (dentro de 90 días o vencidos)
        const in90Days = new Date();
        in90Days.setDate(in90Days.getDate() + 90);

        const expiringLots = await prisma.lot.findMany({
            where: {
                expiration_date: {
                    lte: in90Days
                },
                quantity: {
                    gt: 0
                }
            },
            include: {
                product: {
                    include: {
                        supplier: true,
                        category: true
                    }
                }
            },
            orderBy: {
                expiration_date: 'asc'
            }
        });

        const expiringProducts = expiringLots.map(lot => ({
            id: lot.product.id,
            lot_id: lot.id,
            name: lot.product.name,
            product_code: lot.product.product_code,
            lot_number: lot.lot_number,
            expiration_date: lot.expiration_date,
            current_stock: Math.round(lot.quantity),
            selling_price: Number(lot.product.selling_price),
            purchase_price: Number(lot.product.purchase_price),
            supplier: lot.product.supplier ? {
                id: lot.product.supplier.id,
                name: lot.product.supplier.name,
                phone: lot.product.supplier.phone,
                phone_number: lot.product.supplier.phone
            } : null,
            category: lot.product.category ? {
                id: lot.product.category.id,
                name: lot.product.category.name
            } : null,
            categories: lot.product.category ? {
                id: lot.product.category.id,
                name: lot.product.category.name
            } : null
        }));

        res.json({
            totalProducts,
            todaySalesCount,
            todaySalesTotal,
            criticalStockCount,
            expiringCount: expiringProducts.length,
            expiringProducts
        });
    } catch (error) {
        console.error('Error al generar resumen de dashboard:', error);
        res.status(500).json({ msg: 'Error al generar resumen', error });
    }
};

export const getCriticalStock = async (req: Request, res: Response) => {
    try {
        const criticalList = await prisma.product.findMany({
            where: {
                current_stock: { lte: 10 }
            },
            include: {
                category: true,
                supplier: true,
                storage_location: true
            },
            orderBy: {
                current_stock: 'asc'
            }
        });

        const formattedList = criticalList.map(p => ({
            ...p,
            purchase_price: Number(p.purchase_price),
            selling_price: Number(p.selling_price),
            categories: p.category,
            supplier: p.supplier ? {
                ...p.supplier,
                phone_number: p.supplier.phone
            } : null
        }));

        res.json(formattedList);
    } catch (error) {
        console.error('Error al obtener productos con stock crítico:', error);
        res.status(500).json({ msg: 'Error al consultar stock crítico' });
    }
};
