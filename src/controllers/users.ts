import { Request, Response } from 'express';
import prisma from '../db/prisma';
import path from 'path';
import fs from 'fs';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const listUsers = await prisma.user.findMany({
            include: {
                role: true,
                status: true,
            },
            orderBy: { id: 'asc' },
        });
        res.json(listUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
};

export const getUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(id) },
            include: {
                role: true,
                status: true,
            },
        });

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: `Usuario con id ${id} no encontrado` });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el usuario' });
    }
};

export const createUser = async (req: Request, res: Response) => {
    const { body } = req;
    try {
        const newUser = await prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                image: body.image || null,
                ci: Number(body.ci) || 0,
                username: body.username,
                password: body.password,
                role_id: Number(body.role_id) || 1,
                status_id: Number(body.status_id) || 1,
            },
        });
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear usuario' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { body } = req;
    try {
        const dataToUpdate: any = {};
        if (body.name) dataToUpdate.name = body.name;
        if (body.email) dataToUpdate.email = body.email;
        if (body.image !== undefined) dataToUpdate.image = body.image;
        if (body.ci) dataToUpdate.ci = Number(body.ci);
        if (body.username) dataToUpdate.username = body.username;
        if (body.password) dataToUpdate.password = body.password;
        if (body.role_id) dataToUpdate.role_id = Number(body.role_id);
        if (body.status_id) dataToUpdate.status_id = Number(body.status_id);

        await prisma.user.update({
            where: { id: Number(id) },
            data: dataToUpdate,
        });
        res.json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar usuario' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.user.delete({
            where: { id: Number(id) },
        });
        res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar usuario' });
    }
};

export const updateUserStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status_id } = req.body;

    try {
        const updatedUser = await prisma.user.update({
            where: { id: Number(id) },
            data: { status_id: Number(status_id) },
        });
        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ocurrió un error al actualizar el usuario'
        });
    }
};

export const uploadProfileImage = async (req: Request, res: Response) => {
    const { id } = req.params;
    const file = req.file;

    try {
        if (!file || !file.path) {
            return res.status(400).json({ message: 'Debe proporcionar una imagen de perfil' });
        }

        const user = await prisma.user.findUnique({
            where: { id: Number(id) }
        });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        if (user.image) {
            const imagePath = path.join(__dirname, '../uploads/', user.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await prisma.user.update({
            where: { id: Number(id) },
            data: { image: file.path }
        });

        res.json({ message: 'Imagen de perfil actualizada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al subir la imagen de perfil' });
    }
};

export const getProfileImage = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user = await prisma.user.findUnique({
            where: { id: Number(id) }
        });
        if (!user || !user.image) {
            return res.status(404).json({ message: 'Imagen de perfil no encontrada' });
        }
        res.sendFile(path.join(__dirname, '../uploads/', user.image));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener la imagen de perfil' });
    }
};

export default {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    updateUserStatus,
    uploadProfileImage,
    getProfileImage
};