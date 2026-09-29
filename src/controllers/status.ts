import { Request, Response } from 'express';
import prisma from '../db/prisma';

export const getStatuses = async (req: Request, res: Response) => {
    try {
        const listStatuses = await prisma.status.findMany({
            orderBy: { id: 'asc' },
        });
        res.json(listStatuses);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener estados' });
    }
};

export const getStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const status = await prisma.status.findUnique({
            where: { id: Number(id) },
        });
        if (status) {
            res.json(status);
        } else {
            res.status(404).json({ msg: `No existe un estado con el id ${id}` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener el estado' });
    }
};

export const postStatus = async (req: Request, res: Response) => {
    const { body } = req;
    try {
        const newStatus = await prisma.status.create({
            data: { name: body.name },
        });
        res.status(201).json({ msg: 'El estado fue agregado con éxito!', status: newStatus });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Upps ocurrió un error al crear el estado' });
    }
};

export const updateStatus = async (req: Request, res: Response) => {
    const { body } = req;
    const { id } = req.params;
    try {
        const updated = await prisma.status.update({
            where: { id: Number(id) },
            data: { name: body.name },
        });
        res.json({ msg: 'El estado fue actualizado con éxito', status: updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Upps ocurrió un error al actualizar el estado' });
    }
};

    