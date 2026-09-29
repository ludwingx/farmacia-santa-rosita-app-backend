import dotenv from 'dotenv';
// Configuramos las variables de ambiente antes de cualquier importación de módulos
dotenv.config();

import Server from "./models/server";

const server = new Server();
