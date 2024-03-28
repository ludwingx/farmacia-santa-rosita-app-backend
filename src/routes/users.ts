import { Router } from 'express';

import {getUsers, getUser, updateUser, createUser, updateUserStatus,uploadProfileImage} from '../controllers/users';

import usersController from '../controllers/users';

import upload from '../libs/multer';
const router = Router();


// Ruta para subir imágenes

// Otras rutas de usuarios
router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.put('/:id', updateUser);
router.put('/:id/status', updateUserStatus);

router.post('/:id/profile-image', upload.single('image'), usersController.uploadProfileImage);
// Obtener imagen de perfil de usuario
router.get('/:id/profile-image', usersController.getProfileImage);
export default router;