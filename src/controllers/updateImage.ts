// controllers/image.ts

import { Request, Response } from 'express';
import Users from '../models/users';

// Controlador para obtener la foto de un usuario por su ID
export const getPhoto = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const user = await Users.findByPk(id);
    if (user) {
      res.json({ image: user.get('image') }); // Accedemos a la propiedad 'image' del usuario usando el método get()
    } else {
      res.status(404).json({ msg: `No existe un usuario con el id ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ocurrió un error al obtener la imagen del usuario' });
  }
}

// Controlador para actualizar la foto de un usuario por su ID
export const updatePhoto = async (req: Request, res: Response) => {
  const { id } = req.params;
  const imageFile = req.file;

  try {
    if (!imageFile) {
      return res.status(400).json({ msg: 'No se ha proporcionado ninguna imagen' });
    }

    const user = await Users.findByPk(id);

    if (user) {
      // Guardar la imagen en el directorio de imágenes del servidor
      const imagePath = imageFile.path;
      // Actualizar la ruta de la imagen en la base de datos
      await user.update({ image: imagePath });
      res.json({ msg: 'Imagen actualizada exitosamente' });
    } else {
      res.status(404).json({ msg: `No existe un usuario con el id ${id}` });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Ocurrió un error al actualizar la imagen del usuario' });
  }
}