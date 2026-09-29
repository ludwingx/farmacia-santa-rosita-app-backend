import { Request, Response } from 'express';
import prisma from '../db/prisma';

export const getRoles = async (req: Request, res: Response) => {
    try {
        const listRoles = await prisma.role.findMany({
            orderBy: { id: 'asc' },
        });
        res.json(listRoles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener roles' });
    }
};

export const getRole = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const role = await prisma.role.findUnique({
            where: { id: Number(id) },
        });
        if (role) {
            res.json(role);
        } else {
            res.status(404).json({ msg: `No existe un rol con el id ${id}` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener el rol' });
    }
};

export const postRole = async (req: Request, res: Response) => {
    const { body } = req;
    try {
        const newRole = await prisma.role.create({
            data: { name: body.name },
        });
        res.status(201).json({ msg: 'El rol fue agregado con éxito!', role: newRole });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Upps ocurrió un error al crear el rol' });
    }
};

export const updateRole = async (req: Request, res: Response) => {
    const { body } = req;
    const { id } = req.params;
    try {
        const updated = await prisma.role.update({
            where: { id: Number(id) },
            data: { name: body.name },
        });
        res.json({ msg: 'El rol fue actualizado con éxito', role: updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Upps ocurrió un error al actualizar el rol' });
    }
};

    