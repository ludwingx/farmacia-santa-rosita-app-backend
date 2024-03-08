import { Request, Response } from 'express';
import products from '../models/producto';

export const getProducts = async (req: Request, res: Response) => {
    const listProducto = await products.findAll()
    res.json(listProducto)




}

export const getProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await products.findByPk(id);

    if (product) {
        res.json(product)
    } else {
        res.status(404).json({
            msg: `No existe un products con el id ${id}`
        })
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const product = await products.findByPk(id);

    if (!product) {
        res.status(404).json({
            msg: `No existe un products con el id ${id}`
        })
    } else {
        await product.destroy();
        res.json({
            msg: 'El products fue eliminado con exito!'
        })
    }

}

export const postProduct = async (req: Request, res: Response) => {
    const { body } = req;

    try {
        await products.create(body);

        res.json({
            msg: `El products fue agregado con exito!`
        })
    } catch (error) {
        console.log(error);
        res.json({
            msg: `Upps ocurrio un error, comuniquese con soporte`
        })
    }
}

export const updateProduct = async (req: Request, res: Response) => {
    const { body } = req;
    const { id } = req.params;

    try {

        const product = await products.findByPk(id);

    if(product) {
        await product.update(body);
        res.json({
            msg: 'El products fue actualziado con exito'
        })

    } else {
        res.status(404).json({
            msg: `No existe un products con el id ${id}`
        })
    }
        
    } catch (error) {
        console.log(error);
        res.json({
            msg: `Upps ocurrio un error, comuniquese con soporte`
        })
    }

    
}

    