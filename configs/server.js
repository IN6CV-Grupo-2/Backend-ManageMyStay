import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import limiter from '../src/middlewares/validar-cant-peticiones.js';
import reservationRoutes from '../src/reservations/reservation.routes.js';

const middlewares = (app) =>{
    app.use(express.urlencoded({extended: false}));
    app.use(cors());
    app.use(express.json());
    app.use(helmet());
    app.use(morgan('dev'));
    app.use(limiter);
}

const routes = (app) => {
    app.use("/manageMyStay/v1/reservation", reservationRoutes);
}

const connectarDB = async () => {
    try {
        await dbConnection();
        console.log('Database connecting successfully')
    } catch (error) {
        console.log('Error connecting to the database', error)
        process.exit(1);
    }
}

export const initServer = async () => {
    const app = express();
    const port = process.env.PORT || 3000;
    try {
        middlewares(app);
        connectarDB();
        routes(app);
        app.listen(port);
        console.log(`Server running on port ${port}`);
    } catch (err) {
        console.log(`Server init failerd ${err}`)
    }
}