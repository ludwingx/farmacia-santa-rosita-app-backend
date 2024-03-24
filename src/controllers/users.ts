import { Request, Response } from 'express';
import Users from '../models/users';
import Roles from '../models/roles';
import Status from '../models/status';

export const getUsers = async (req: Request, res: Response) => {
   try{
    const listUser = await Users.findAll({
        include: [{ model: Roles, as: 'role' }, {model: Status, as :'status'}]

    });
    res.json(listUser)
   }
    catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ocurrió un error al obtener los usuarios'
        });
    }
}
export const getUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const user = await Users.findByPk(id, {
            include: [{ model: Roles, as: 'role' }, {model: Status, as :'status'}]
        });

        if (user) {
            res.json(user);
        } else {
            res.status(404).json({
                msg: `No existe un usuario con el id ${id}`
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ocurrió un error al obtener el usuario'
        });
    }
}

export const updateUserStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status_id } = req.body; // Suponiendo que 'status_id' es el campo en el cuerpo de la solicitud que representa el nuevo estado

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
            msg: 'Ocurrio un error al actualizar el usuario'
        });
    }   
};

export const postUser = async (req: Request, res: Response) => {
    const { body } = req;

    try {
        await Users.create(body);

        res.json({
            msg: `El users fue agregado con exito!`
        })
    } catch (error) {
        console.log(error);
        res.json({
            msg: `Upps ocurrio un error, comuniquese con soporte`
        })
    }
}

export const updateUser = async (req: Request, res: Response) => {
    const { body } = req;
    const { id } = req.params;

    try {

        const user = await Users.findByPk(id);

    if(user) {
        await user.update(body);
        res.json({
            msg: 'El users fue actualziado con exito'
        })

    } else {
        res.status(404).json({
            msg: `No existe un users con el id ${id}`
        })
    }
        
    } catch (error) {
        console.log(error);
        res.json({
            msg: `Upps ocurrio un error, comuniquese con soporte`
        })
    }

    
}

export const updateUserImage = async (req: any, res: Response) => { // Cambia 'req: any' para aceptar 'req.file'
    const { id } = req.params;
    const { image } = req.file; // Utiliza 'req.file' en lugar de 'req.files'
  
    try {
      const user = await Users.findByPk(id);
  
      if (user) {
        // Guardar la imagen en el directorio de imágenes del servidor
        const imagePath = image.path;
        // Actualizar la ruta de la imagen en la base de datos
        user.update({ image: imagePath }).then(() => {
          res.json({ msg: 'Imagen actualizada exitosamente' });
        }).catch((err: any) => {
          console.error(err);
          return res.status(500).json({ msg: 'Error al actualizar la ruta de la imagen en la base de datos' });
        });
      } else {
        res.status(404).json({
          msg: `No existe un usuario con el id ${id}`
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        msg: 'Ocurrió un error al actualizar la imagen del usuario'
      });
    }
  };

    