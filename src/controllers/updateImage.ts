// controllers/image.ts

import { Request, Response } from 'express';
import prisma from '../db/prisma';

// Controlador para obtener la foto de un usuario por su ID
export const getPhoto = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: { image: true }
    });
    if (user) {
      res.json({ image: user.image });
    } else {
      res.status(404).json({ msg: `No existe un usuario con el id ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ocurrió un error al obtener la imagen del usuario' });
  }
};

// Controlador para actualizar la foto de un usuario por su ID
export const updatePhoto = async (req: Request, res: Response) => {
  const { id } = req.params;
  const imageFile = req.file;

  try {
    if (!imageFile) {
      return res.status(400).json({ msg: 'No se ha proporcionado ninguna imagen' });
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(id) }
    });

    if (user) {
      const imagePath = imageFile.path;
      await prisma.user.update({
        where: { id: Number(id) },
        data: { image: imagePath }
      });
      res.json({ msg: 'Imagen actualizada exitosamente' });
    } else {
      res.status(404).json({ msg: `No existe un usuario con el id ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ocurrió un error al actualizar la imagen del usuario' });
  }
};