import { Request, Response } from 'express';
import suppliers from '../models/suppliers';

export const getSuppliers = async (req: Request, res: Response) => {
    const listSuppliers = await suppliers.findAll()
    res.json(listSuppliers)


}

export const getSupplier = async (req: Request, res: Response) => {
    const { id } = req.params;
    const supplier = await suppliers.findByPk(id);

    if (supplier) {
        res.json(supplier)
    } else {
        res.status(404).json({
            msg: `No existe un suppliers con el id ${id}`
        })
    }
}

export const deleteSupplier = async (req: Request, res: Response) => {
    const { id } = req.params;
    const supplier = await suppliers.findByPk(id);

    if (!supplier) {
        res.status(404).json({
            msg: `No existe un suppliers con el id ${id}`
        })
    } else {
        await supplier.destroy();
        res.json({
            msg: 'El suppliers fue eliminado con exito!'
        })
    }

}

export const postSupplier = async (req: Request, res: Response) => {
    const { body } = req;

    try {
        await suppliers.create(body);

        res.json({
            msg: `El suppliers fue agregado con exito!`
        })
    } catch (error) {
        console.log(error);
        res.json({
            msg: `Upps ocurrio un error, comuniquese con soporte`
        })
    }
}

export const updateSupplier = async (req: Request, res: Response) => {
    const { body } = req;
    const { id } = req.params;

    try {

        const supplier = await suppliers.findByPk(id);

    if(supplier) {
        await supplier.update(body);
        res.json({
            msg: 'El suppliers fue actualziado con exito'
        })

    } else {
        res.status(404).json({
            msg: `No existe un suppliers con el id ${id}`
        })
    }
        
    } catch (error) {
        console.log(error);
        res.json({
            msg: `Upps ocurrio un error, comuniquese con soporte`
        })
    }

    
}

    