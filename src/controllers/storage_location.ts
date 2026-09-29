import { Request, Response } from 'express';
import prisma from '../db/prisma';

export const getStorageLocations = async (req: Request, res: Response) => {
    try {
        const listStorageLocations = await prisma.storageLocation.findMany({
            orderBy: { id: 'asc' },
        });
        res.json(listStorageLocations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener ubicaciones' });
    }
};

export const getStorageLocation = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const storage_location = await prisma.storageLocation.findUnique({
            where: { id: Number(id) },
        });
        if (storage_location) {
            res.json(storage_location);
        } else {
            res.status(404).json({ msg: `No existe una ubicación con el id ${id}` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener la ubicación' });
    }
};

export const deleteStorageLocation = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.storageLocation.delete({
            where: { id: Number(id) },
        });
        res.json({ msg: 'La ubicación fue eliminada con éxito!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al eliminar la ubicación' });
    }
};

export const postStorageLocation = async (req: Request, res: Response) => {
    const { body } = req;
    try {
        const created = await prisma.storageLocation.create({
            data: {
                location: body.location,
                description: body.description || null,
            },
        });
        res.status(201).json({ msg: 'La ubicación fue agregada con éxito!', storage_location: created });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Upps ocurrió un error al crear la ubicación' });
    }
};

export const updateStorageLocation = async (req: Request, res: Response) => {
    const { body } = req;
    const { id } = req.params;
    try {
        const updated = await prisma.storageLocation.update({
            where: { id: Number(id) },
            data: {
                location: body.location,
                description: body.description !== undefined ? body.description : undefined,
            },
        });
        res.json({ msg: 'La ubicación fue actualizada con éxito', storage_location: updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Upps ocurrió un error al actualizar la ubicación' });
    }
};

    