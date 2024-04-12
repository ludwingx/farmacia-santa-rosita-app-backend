import { Request, Response } from 'express';
import storage_locations from '../models/lots';

export const getStorageLocations = async (req: Request, res: Response) => {
    const listStorageLocationo = await storage_locations.findAll()
    res.json(listStorageLocationo)

}

export const getStorageLocation = async (req: Request, res: Response) => {
    const { id } = req.params;
    const storage_location = await storage_locations.findByPk(id);

    if (storage_location) {
        res.json(storage_location)
    } else {
        res.status(404).json({
            msg: `No existe un storage_locations con el id ${id}`
        })
    }
}

export const deleteStorageLocation = async (req: Request, res: Response) => {
    const { id } = req.params;
    const storage_location = await storage_locations.findByPk(id);

    if (!storage_location) {
        res.status(404).json({
            msg: `No existe un storage_locations con el id ${id}`
        })
    } else {
        await storage_location.destroy();
        res.json({
            msg: 'El storage_locations fue eliminado con exito!'
        })
    }

}

export const postStorageLocation = async (req: Request, res: Response) => {
    const { body } = req;

    try {
        await storage_locations.create(body);

        res.json({
            msg: `El storage_locations fue agregado con exito!`
        })
    } catch (error) {
        console.log(error);
        res.json({
            msg: `Upps ocurrio un error, comuniquese con soporte`
        })
    }
}

export const updateStorageLocation = async (req: Request, res: Response) => {
    const { body } = req;
    const { id } = req.params;

    try {

        const storage_location = await storage_locations.findByPk(id);

    if(storage_location) {
        await storage_location.update(body);
        res.json({
            msg: 'El storage_locations fue actualziado con exito'
        })

    } else {
        res.status(404).json({
            msg: `No existe un storage_locations con el id ${id}`
        })
    }
        
    } catch (error) {
        console.log(error);
        res.json({
            msg: `Upps ocurrio un error, comuniquese con soporte`
        })
    }

    
}

    