import { Request, Response } from 'express';
import roles from '../models/roles';

export const getRoles = async (req: Request, res: Response) => {
    const listRoles = await roles.findAll()
    res.json(listRoles)
}
export const getRole = async (req: Request, res: Response) => {
    const { id } = req.params;
    const role = await roles.findByPk(id);
    if (role) {
        res.json(role)
    } else {
        res.status(404).json({
            msg: `No existe un roles con el id ${id}`
        })
    }
}
export const postRole = async (req: Request, res: Response) => {
    const { body } = req;

    try {
        await roles.create(body);

        res.json({
            msg: `El roles fue agregado con exito!`
        })
    } catch (error) {
        console.log(error);
        res.json({
            msg: `Upps ocurrio un error, comuniquese con soporte`
        })
    }
}

export const updateRole = async (req: Request, res: Response) => {
    const { body } = req;
    const { id } = req.params;

    try {

        const role = await roles.findByPk(id);

    if(role) {
        await role.update(body);
        res.json({
            msg: 'El roles fue actualziado con exito'
        })

    } else {
        res.status(404).json({
            msg: `No existe un roles con el id ${id}`
        })
    }
        
    } catch (error) {
        console.log(error);
        res.json({
            msg: `Upps ocurrio un error, comuniquese con soporte`
        })
    }

    
}

    