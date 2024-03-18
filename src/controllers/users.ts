import { Request, Response } from 'express';
import users from '../models/users';
import Roles from '../models/roles';
export const getUsers = async (req: Request, res: Response) => {
   try{
    const listUser = await users.findAll({
        include: [{ model: Roles, as: 'role' }] 
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
        const user = await users.findByPk(id, {
            include: Roles // Incluye la información del rol asociado al usuario
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

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await users.findByPk(id);

    if (!user) {
        res.status(404).json({
            msg: `No existe un users con el id ${id}`
        })
    } else {
        await user.destroy();
        res.json({
            msg: 'El users fue eliminado con exito!'
        })
    }

}

export const postUser = async (req: Request, res: Response) => {
    const { body } = req;

    try {
        await users.create(body);

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

        const user = await users.findByPk(id);

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

    