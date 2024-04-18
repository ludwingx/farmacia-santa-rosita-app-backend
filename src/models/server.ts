import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import routesProducto from '../routes/producto';
import db from '../db/connection';
import routesSuppliers from '../routes/suppliers';
import routesCategories from '../routes/categories';
import routeStorageLocation from '../routes/storage_location';
import routesUsers from '../routes/users';
import routeRoles from '../routes/roles';
import routeStatus from '../routes/status';

import routesAuth from '../routes/auth';
import routesLots from '../routes/lots';

class Server {
    private app: Application;
    private port: string | number;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3001; // Usando el puerto 3001 si no está definido en las variables de entorno
        this.listen();
        this.middlewares();
        this.routes();
        this.dbConnect();
    }
    
    private listen() {
        this.app.listen(this.port, () => {
            console.log(`Aplicación corriendo en el puerto ${this.port}`);
        });
    }

    private routes() {
        this.app.get('/', (req: Request, res: Response) => {
            res.json({ msg: 'API Working' });
        });

        this.app.use('/api/productos', routesProducto);
        this.app.use('/api/suppliers', routesSuppliers);
        this.app.use('/api/categories', routesCategories);
        this.app.use('/api/storage_location', routeStorageLocation);
        this.app.use('/api/lots', routesLots)
        this.app.use('/api/users', routesUsers);
        this.app.use('/api/auth', routesAuth);

        this.app.use('/uploads/profiles', express.static('uploads/profiles'));
        this.app.use('uploads/products', express.static('uploads/products'));
        
        this.app.use('/api/roles', routeRoles);
        this.app.use('/api/statuses', routeStatus);

        
    }

    private middlewares() {
        // Parseamos el body
        this.app.use(express.json());

        // CORS
        this.app.use(cors({
            origin: '*',  // Reemplaza con la URL de tu frontend en producción
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            credentials: true,
        }));
    }

    private async dbConnect() {
        try {
            await db.authenticate();
            console.log('Base de datos conectada');
        } catch (error) {
            console.error('Error al conectarse a la base de datos:', error);
        }
    }
}

export default Server;
