// auth.controller.ts
import { Request, Response } from 'express';
import Users from '../models/users';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = "daojwdkwakd" ;

export const loginUser = async (req: Request, res: Response) => {
  const { username, password } = req.body; // Obtiene el nombre de usuario y contraseña del cuerpo de la solicitud

  try {
    // Verifica las credenciales del usuario en la base de datos
    const user = await Users.findOne({ where: { username, password } });

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas' }); // Si las credenciales no son válidas, devuelve un error 401
    }

    // Genera un token JWT con el ID del usuario y la clave secreta JWT
    const token = jwt.sign({ id: user.id }, JWT_SECRET!, { expiresIn: '1h' });

    // Devuelve el token JWT y los detalles del usuario en la respuesta
    res.status(200).json({ token, user }); // Devuelve un objeto JSON con el token generado y los detalles del usuario
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error interno del servidor' }); // Devuelve un error 500 en caso de error interno
  }
  };
  export const logoutUser = async (req: Request, res: Response): Promise<void> => {
    try {
      // Realiza cualquier operación necesaria para cerrar la sesión del usuario
      res.status(200).json({ message: 'Sesión cerrada correctamente' }); // Devuelve un objeto JSON con el mensaje
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };