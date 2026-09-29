import { Request, Response } from 'express';
import prisma from '../db/prisma';
import path from 'path';
import fs from 'fs';

export const getProducts = async (req: Request, res: Response) => {
    try {
        const listProducts = await prisma.product.findMany({
            include: {
                supplier: true,
                category: true,
                storage_location: true,
                lots: true,
            },
            orderBy: { id: 'asc' },
        });

        // Convert Decimal to number for JSON response
        const formatted = listProducts.map(p => ({
            ...p,
            purchase_price: Number(p.purchase_price),
            selling_price: Number(p.selling_price),
        }));

        res.json(formatted);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({ msg: 'Error al obtener productos' });
    }
};

export const getProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const product = await prisma.product.findUnique({
            where: { id: Number(id) },
            include: {
                supplier: true,
                category: true,
                storage_location: true,
                lots: true,
            },
        });

        if (product) {
            res.json({
                ...product,
                purchase_price: Number(product.purchase_price),
                selling_price: Number(product.selling_price),
            });
        } else {
            res.status(404).json({ msg: `No existe un producto con el id ${id}` });
        }
    } catch (error) {
        console.error('Error al obtener producto:', error);
        res.status(500).json({ msg: 'Error al obtener producto' });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await prisma.product.delete({
            where: { id: Number(id) },
        });
        res.json({ msg: 'El producto fue eliminado con éxito!' });
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).json({ msg: 'Error al eliminar producto' });
    }
};

export const postProduct = async (req: Request, res: Response) => {
    const { body } = req;

    try {
        const selling_price = Number(body.selling_price || body.price || 0);
        const purchase_price = Number(body.purchase_price || (selling_price * 0.7));
        const initial_stock = Number(body.initial_stock || 0);
        const current_stock = Number(body.current_stock || initial_stock);

        const newProd = await prisma.product.create({
            data: {
                name: body.name,
                product_code: body.product_code || null,
                description: body.description || null,
                purchase_price,
                selling_price,
                initial_stock,
                current_stock,
                image: body.image || null,
                supplier_id: body.supplier_id ? Number(body.supplier_id) : null,
                category_id: body.category_id ? Number(body.category_id) : null,
                storage_location_id: body.storage_location_id ? Number(body.storage_location_id) : null,
                nutritional_information: body.nutritional_information || null,
                notes: body.notes || null,
                status_id: body.status_id ? Number(body.status_id) : 1,
                expiration_status: body.expiration_status ? Number(body.expiration_status) : 0,
                create_by_user_id: body.create_by_user_id || body.user_id ? Number(body.create_by_user_id || body.user_id) : null,
            },
        });

        // Si se envió lote o fecha de expiración inicial, crear lote automáticamente
        if (body.lot_number || body.expiration_date) {
            await prisma.lot.create({
                data: {
                    product_id: newProd.id,
                    lot_number: body.lot_number || 'LOTE-INICIAL',
                    quantity: initial_stock,
                    initial_quantity: initial_stock,
                    expiration_date: body.expiration_date ? new Date(body.expiration_date) : new Date(Date.now() + 365 * 24 * 3600 * 1000),
                    create_by_user_id: newProd.create_by_user_id,
                }
            });
        }

        res.status(201).json({
            msg: 'El producto fue agregado con éxito!',
            product: newProd
        });
    } catch (error) {
        console.error('Error al registrar producto:', error);
        res.status(500).json({ msg: 'Upps ocurrió un error al registrar el producto' });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    const { body } = req;
    const { id } = req.params;

    try {
        const updateData: any = {};
        if (body.name) updateData.name = body.name;
        if (body.product_code !== undefined) updateData.product_code = body.product_code;
        if (body.description !== undefined) updateData.description = body.description;
        if (body.selling_price || body.price) updateData.selling_price = Number(body.selling_price || body.price);
        if (body.purchase_price) updateData.purchase_price = Number(body.purchase_price);
        if (body.initial_stock !== undefined) updateData.initial_stock = Number(body.initial_stock);
        if (body.current_stock !== undefined) updateData.current_stock = Number(body.current_stock);
        if (body.supplier_id) updateData.supplier_id = Number(body.supplier_id);
        if (body.category_id) updateData.category_id = Number(body.category_id);
        if (body.storage_location_id) updateData.storage_location_id = Number(body.storage_location_id);
        if (body.image !== undefined) updateData.image = body.image;
        if (body.notes !== undefined) updateData.notes = body.notes;
        if (body.nutritional_information !== undefined) updateData.nutritional_information = body.nutritional_information;
        if (body.status_id) updateData.status_id = Number(body.status_id);
        if (body.expiration_status !== undefined) updateData.expiration_status = Number(body.expiration_status);

        const updated = await prisma.product.update({
            where: { id: Number(id) },
            data: updateData,
        });

        res.json({
            msg: 'El producto fue actualizado con éxito',
            product: updated
        });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ msg: 'Upps ocurrió un error al actualizar el producto' });
    }
};

export const updateProductStatus = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status_id } = req.body;

    try {
        const updated = await prisma.product.update({
            where: { id: Number(id) },
            data: { status_id: Number(status_id) },
        });
        res.json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Ocurrió un error al actualizar el estado del producto' });
    }
};

export const uploadImageProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    const file = req.file;

    try {
        if (!file || !file.path) {
            return res.status(400).json({ message: 'Debe proporcionar una imagen de producto' });
        }

        const product = await prisma.product.findUnique({
            where: { id: Number(id) }
        });
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }

        if (product.image) {
            const imagePath = path.join(__dirname, '../uploads/', product.image);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await prisma.product.update({
            where: { id: Number(id) },
            data: { image: file.path }
        });

        res.json({ message: 'Imagen de producto actualizada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al subir la imagen de producto' });
    }
};

export const getImageProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const product = await prisma.product.findUnique({
            where: { id: Number(id) }
        });
        if (!product || !product.image) {
            return res.status(404).json({ message: 'Imagen de producto no encontrada' });
        }
        res.sendFile(path.join(__dirname, '../uploads/', product.image));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener la imagen de producto' });
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
};