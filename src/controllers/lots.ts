import { Request, Response } from 'express';
import prisma from '../db/prisma';

export const getLots = async (req: Request, res: Response) => {
    try {
        const listLots = await prisma.lot.findMany({
            include: {
                product: true,
            },
            orderBy: { expiration_date: 'asc' },
        });
        res.json(listLots);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener lotes' });
    }
};

export const getLot = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const lot = await prisma.lot.findUnique({
            where: { id: Number(id) },
            include: {
                product: true,
            },
        });
        if (lot) {
            res.json(lot);
        } else {
            res.status(404).json({ msg: `No existe un lote con el id ${id}` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener el lote' });
    }
};

export const postLot = async (req: Request, res: Response) => {
    const { body } = req;
    try {
        const newLot = await prisma.lot.create({
            data: {
                product_id: Number(body.product_id),
                lot_number: body.lot_number || null,
                quantity: Number(body.quantity || 0),
                initial_quantity: Number(body.initial_quantity || body.quantity || 0),
                expiration_date: new Date(body.expiration_date),
                create_by_user_id: body.create_by_user_id ? Number(body.create_by_user_id) : null,
            },
        });
        res.status(201).json({ msg: 'El lote fue agregado con éxito!', lot: newLot });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Upps ocurrió un error al crear el lote' });
    }
};

export const updateLot = async (req: Request, res: Response) => {
    const { body } = req;
    const { id } = req.params;

    try {
        const updateData: any = {};
        if (body.quantity !== undefined) updateData.quantity = Number(body.quantity);
        if (body.initial_quantity !== undefined) updateData.initial_quantity = Number(body.initial_quantity);
        if (body.expiration_date) updateData.expiration_date = new Date(body.expiration_date);
        if (body.lot_number !== undefined) updateData.lot_number = body.lot_number;
        if (body.last_update_by_user_id) updateData.last_update_by_user_id = Number(body.last_update_by_user_id);

        const updated = await prisma.lot.update({
            where: { id: Number(id) },
            data: updateData,
        });

        res.json({ msg: 'El lote fue actualizado con éxito', lot: updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Upps ocurrió un error al actualizar el lote' });
    }
};

export const deleteLot = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.lot.delete({
            where: { id: Number(id) },
        });
        res.json({ msg: 'El lote fue eliminado con éxito' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Upps ocurrió un error al eliminar el lote' });
    }
};