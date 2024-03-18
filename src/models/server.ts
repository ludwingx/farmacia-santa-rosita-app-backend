import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import routesProducto from '../routes/producto';
import db from '../db/connection';
import routesSuppliers from '../routes/suppliers';
import routesCategories from '../routes/categories';
import routeStorageLocation from '../routes/storage_location';
import routesUsers from '../routes/users';
import routeRoles from '../routes/roles';
class Server {
    private app: Application;
    private port: string;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '3001'; //
        this.listen();
        this.midlewares();
        this.routes();
        this.dbConnect();

    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Aplicacion corriendo en el puerto ${this.port}`)
        })
    }

    routes() {
        this.app.get('/', (req: Request, res: Response) => {
            res.json({
                msg: 'API Working'
            })
        })
        this.app.use('/api/productos', routesProducto)
        this.app.use('/api/suppliers', routesSuppliers)
        this.app.use('/api/categories', routesCategories)
        this.app.use('/api/storage_location', routeStorageLocation)

        this.app.use('/api/users', routesUsers)
        this.app.use('/api/roles', routeRoles)
    }

    midlewares() {

        // Parseamos el body
        this.app.use(express.json());

        // Cors
        this.app.use(cors({
            origin: '*',  // Reemplaza con la URL de tu frontend
            methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
            credentials: true, 
        }));
    }

    async dbConnect() {

        try {
            await db.authenticate();
            console.log('Base de datos conectada')
        } catch (error) {
            console.log(error);
            console.log('Error al conectarse a la base de datos')
        }

       
    }


}

export default Server;