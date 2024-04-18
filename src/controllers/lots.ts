import { Request, Response } from 'express';
import lots from '../models/lots';

export const getLots = async (req: Request, res: Response) => {
    const listLots = await lots.findAll()
    res.json(listLots)
}
export const getLot = async (req: Request, res: Response) => {
    const { id } = req.params;
    const lot = await lots.findByPk(id);
    if (lot) {
        res.json(lot)
    } else {
        res.status(404).json({
            msg: `No existe un lots con el id ${id}`
        })
    }
}
export const postLot = async (req: Request, res: Response) => {
    const { body } = req;

    try {
        await lots.create(body);

        res.json({
            msg: `El lots fue agregado con exito!`
        })
    } catch (error) {
        console.log(error);
        res.json({
            msg: `Upps ocurrio un error, comuniquese con soporte`
        })
    }
}

export const updateLot = async (req: Request, res: Response) => {
    const { body } = req;
    const { id } = req.params;

    try {

        const lot = await lots.findByPk(id);

    if(lot) {
        await lot.update(body);
        res.json({
            msg: 'El lots fue actualziado con exito'
        })

    } else {
        res.status(404).json({
            msg: `No existe un lots con el id ${id}`
        })
    }
        
    } catch (error) {
        console.log(error);
        res.json({
            msg: `Upps ocurrio un error, comuniquese con soporte`
        })
    }

    
}

    