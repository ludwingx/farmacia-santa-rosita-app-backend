import { Request, Response } from 'express';
import products from '../models/producto';
import Suppliers from '../models/suppliers';
import path from 'path';
import fs from 'fs';
import Categories from '../models/categories';
import Storage_locations from '../models/storage_locations';
export const getProducts = async (req: Request, res: Response) => {
    try {
        const listProducts = await products.findAll({
            include: [
                { model: Suppliers, as: 'supplier'},
                { model: Categories, as: 'categories'},
                { model: Storage_locations, as: 'storage_location'}
                ]
        });
        res.json(listProducts);
    } catch (error) {
        console.log(error);
        res.json({
            msg: `Upps ocurrio un error, comuniquese con soporte`
        })
    }
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
export const updateProductStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status_id } = req.body;

    try {
        const product = await products.findByPk(id);

        if (product) {
            const updatedUser = await product.update({ status_id });
            res.json(updatedUser);
        } else {
            res.status(404).json({
                msg: `No existe un usuario con el id ${id}`
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({
            msg: 'Ocurrió un error al actualizar el usuario'
        });
    }   
}
// Subir imagen de perfil de usuario
export const uploadImageProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const file = req.file; // Acceder al objeto de archivo

    try {
        if (!file) {
            return res.status(400).json({ message: 'Debe proporcionar una imagen de perfil' });
        }

        // Verificar que el objeto de archivo tenga la propiedad 'path'
        if (!file.path) {
            return res.status(500).json({ message: 'Error al obtener la ruta del archivo' });
        }

        const product = await products.findByPk(id);
        if (!product) {
            return res.status(404).json({ message: 'product no encontrado' });
        }

        // Eliminar imagen anterior si existe
        if (product.image) {
            const imagePath = path.join(__dirname, '../uploads/', product.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        product.image = file.path; // Acceder a la propiedad 'path' del objeto de archivo
        await product.save();

        res.json({ message: 'Imagen de perfil actualizada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al subir la imagen de perfil' });
    }
};
// Obtener imagen de perfil de usuario
export const getImageProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const product = await products.findByPk(id);
        if (!product || !product.image) {
            return res.status(404).json({ message: 'Imagen de perfil no encontrada' });
        }
        res.sendFile(path.join(__dirname, '../uploads/', product.image));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener la imagen de perfil' });
    }
};

export default {
    getProducts,
    getProduct,
    postProduct,
    updateProduct,
    deleteProduct,
    updateProductStatus,
    uploadImageProduct,
    getImageProduct
}