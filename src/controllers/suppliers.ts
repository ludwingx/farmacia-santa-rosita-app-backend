import { Request, Response } from 'express';
import prisma from '../db/prisma';

export const getSuppliers = async (req: Request, res: Response) => {
    try {
        const listSuppliers = await prisma.supplier.findMany({
            orderBy: { id: 'asc' },
        });
        res.json(listSuppliers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener proveedores' });
    }
};

export const getSupplier = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const supplier = await prisma.supplier.findUnique({
            where: { id: Number(id) },
        });
        if (supplier) {
            res.json(supplier);
        } else {
            res.status(404).json({ msg: `No existe un proveedor con el id ${id}` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al obtener proveedor' });
    }
};

export const deleteSupplier = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.supplier.delete({
            where: { id: Number(id) },
        });
        res.json({ msg: 'El proveedor fue eliminado con éxito!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al eliminar proveedor' });
    }
};

export const postSupplier = async (req: Request, res: Response) => {
    const { body } = req;
    try {
        const created = await prisma.supplier.create({
            data: {
                name: body.name,
                phone: body.phone || null,
                email: body.email || null,
                address: body.address || null,
                contact_person: body.contact_person || null,
            },
        });
        res.status(201).json({ msg: 'El proveedor fue agregado con éxito!', supplier: created });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Upps ocurrió un error al crear proveedor' });
    }
};

export const updateSupplier = async (req: Request, res: Response) => {
    const { body } = req;
    const { id } = req.params;
    try {
        const updated = await prisma.supplier.update({
            where: { id: Number(id) },
            data: {
                name: body.name,
                phone: body.phone !== undefined ? body.phone : undefined,
                email: body.email !== undefined ? body.email : undefined,
                address: body.address !== undefined ? body.address : undefined,
                contact_person: body.contact_person !== undefined ? body.contact_person : undefined,
            },
        });
        res.json({ msg: 'El proveedor fue actualizado con éxito', supplier: updated });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Upps ocurrió un error al actualizar proveedor' });
    }
};

    