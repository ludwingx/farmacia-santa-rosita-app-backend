import { Request, Response } from 'express';
import prisma from '../db/prisma';

export const getCategorys = async (req: Request, res: Response) => {
    try {
        const listCategories = await prisma.category.findMany({
            orderBy: { id: 'asc' },
        });
        res.json(listCategories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener categorías' });
    }
};

export const getCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const category = await prisma.category.findUnique({
            where: { id: Number(id) },
        });
        if (category) {
            res.json(category);
        } else {
            res.status(404).json({ msg: `No existe una categoría con el id ${id}` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener la categoría' });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.category.delete({
            where: { id: Number(id) },
        });
        res.json({ msg: 'La categoría fue eliminada con éxito!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al eliminar la categoría' });
    }
};

export const postCategory = async (req: Request, res: Response) => {
    const { body } = req;
    try {
        const created = await prisma.category.create({
            data: {
                name: body.name,
                description: body.description || null,
            },
        });
        res.status(201).json({ msg: 'La categoría fue agregada con éxito!', category: created });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Upps ocurrió un error al crear la categoría' });
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    const { body } = req;
    const { id } = req.params;
    try {
        const updated = await prisma.category.update({
            where: { id: Number(id) },
            data: {
                name: body.name,
                description: body.description || null,
            },
        });
        res.json({ msg: 'La categoría fue actualizada con éxito', category: updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Upps ocurrió un error al actualizar la categoría' });
    }
};

    