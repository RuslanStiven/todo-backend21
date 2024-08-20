import 'reflect-metadata';
import express from 'express';
import { createConnection } from 'typeorm';
import { UserController } from './controller/UserController';


createConnection().then(async () => {
    const app = express();
    app.use(express.json());

    app.use('/auth', UserController);

    app.listen(3000, () => {
        console.log(`Сервер запущен на http://localhost:${3000}`);
    });
}).catch(error => console.log(error));
