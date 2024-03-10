import { Request, Response } from 'express';
import categories from '../models/categories';

export const getCategorys = async (req: Request, res: Response) => {
    const listCategories = await categories.findAll()
    res.json(listCategories)
}

export const getCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    const categorie = await categories.findByPk(id);

    if (categorie) {
        res.json(categorie)
    } else {
        res.status(404).json({
            msg: `No existe un categories con el id ${id}`
        })
    }
}

export const deleteCategory = async (req: Request, res: Response) => {
    const { id } = req.params;
    const categorie = await categories.findByPk(id);

    if (!categorie) {
        res.status(404).json({
            msg: `No existe un categories con el id ${id}`
        })
    } else {
        await categorie.destroy();
        res.json({
            msg: 'El categories fue eliminado con exito!'
        })
    }

}

export const postCategory = async (req: Request, res: Response) => {
    const { body } = req;

    try {
        await categories.create(body);

        res.json({
            msg: `El categories fue agregado con exito!`
        })
    } catch (error) {
        console.log(error);
        res.json({
            msg: `Upps ocurrio un error, comuniquese con soporte`
        })
    }
}

export const updateCategory = async (req: Request, res: Response) => {
    const { body } = req;
    const { id } = req.params;

    try {

        const categorie = await categories.findByPk(id);

    if(categorie) {
        await categorie.update(body);
        res.json({
            msg: 'El categories fue actualziado con exito'
        })

    } else {
        res.status(404).json({
            msg: `No existe un categories con el id ${id}`
        })
    }
        
    } catch (error) {
        console.log(error);
        res.json({
            msg: `Upps ocurrio un error, comuniquese con soporte`
        })
    }

    
}

    