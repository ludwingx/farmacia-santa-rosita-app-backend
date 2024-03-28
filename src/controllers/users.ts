import { NextFunction, Request, Response } from 'express';
import Users from '../models/users';
import Roles from '../models/roles';
import Status from '../models/status';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const listUsers = await Users.findAll({
            include: [{ model: Roles, as: 'role' }, { model: Status, as: 'status' }]
        });
        res.json(listUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los usuarios' });
    }
};

// Obtener un usuario por su ID
export const getUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user = await Users.findByPk(id, {
            include: [{ model: Roles, as: 'role' }, { model: Status, as: 'status' }]
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

// Crear un nuevo usuario
export const createUser = async (req: Request, res: Response) => {
    const { body } = req;
    try {
        const newUser = await Users.create(body);
        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear usuario' });
    }
};

// Actualizar un usuario por su ID
export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { body } = req;
    try {
        const user = await Users.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: `Usuario con id ${id} no encontrado` });
        }
        await user.update(body);
        res.json({ message: 'Usuario actualizado correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar usuario' });
    }
};

// Eliminar un usuario por su ID
export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user = await Users.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: `Usuario con id ${id} no encontrado` });
        }
        await user.destroy();
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
        const user = await Users.findByPk(id);

        if (user) {
            const updatedUser = await user.update({ status_id });
            res.json(updatedUser);
        } else {
            res.status(404).json({
                msg: `No existe un usuario con el id ${id}`
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ocurrió un error al actualizar el usuario'
        });
    }   
}
// Subir imagen de perfil de usuario
export const uploadProfileImage = async (req: Request, res: Response) => {
    const { id } = req.params;
    const file = req.file; // Acceder al objeto de archivo

    try {
        if (!file) {
            return res.status(400).json({ message: 'Debe proporcionar una imagen de perfil' });
        }

        // Verificar que el objeto de archivo tenga la propiedad 'path'
        if (!file.path) {
            return res.status(500).json({ message: 'Error al obtener la ruta del archivo' });
        }

        const user = await Users.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Eliminar imagen anterior si existe
        if (user.image) {
            const imagePath = path.join(__dirname, '../uploads/', user.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        user.image = file.path; // Acceder a la propiedad 'path' del objeto de archivo
        await user.save();

        res.json({ message: 'Imagen de perfil actualizada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al subir la imagen de perfil' });
    }
};
// Obtener imagen de perfil de usuario
export const getProfileImage = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user = await Users.findByPk(id);
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