import { Request, Response } from 'express';
import statuses from '../models/status';

export const getStatuses = async (req: Request, res: Response) => {
    const listStatuses = await statuses.findAll()
    res.json(listStatuses)
}
export const getStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const status = await statuses.findByPk(id);
    if (status) {
        res.json(status)
    } else {
        res.status(404).json({
            msg: `No existe un statuses con el id ${id}`
        })
    }
}
export const postStatus = async (req: Request, res: Response) => {
    const { body } = req;

    try {
        await statuses.create(body);

        res.json({
            msg: `El statuses fue agregado con exito!`
        })
    } catch (error) {
        console.log(error);
        res.json({
            msg: `Upps ocurrio un error, comuniquese con soporte`
        })
    }
}

export const updateStatus = async (req: Request, res: Response) => {
    const { body } = req;
    const { id } = req.params;

    try {

        const status = await statuses.findByPk(id);

    if(status) {
        await status.update(body);
        res.json({
            msg: 'El statuses fue actualziado con exito'
        })

    } else {
        res.status(404).json({
            msg: `No existe un statuses con el id ${id}`
        })
    }
        
    } catch (error) {
        console.log(error);
        res.json({
            msg: `Upps ocurrio un error, comuniquese con soporte`
        })
    }

    
}

    