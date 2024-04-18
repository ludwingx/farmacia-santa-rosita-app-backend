import { Router } from 'express';
import { deleteProduct, getProduct, getProducts, postProduct, updateProduct,  } from '../controllers/producto';
import productoController from '../controllers/producto';
import upload from '../libs/multer';
const router = Router();

router.get('/', getProducts);
router.get('/:id', getProduct);
router.delete('/:id', deleteProduct);
router.post('/', postProduct);
router.put('/:id', updateProduct);

router.post('/:id/image-product', upload.single('image'), productoController.uploadImageProduct);
// Obtener imagen de perfil de producto
router.get('/:id/image-product', productoController.getImageProduct);
export default router;