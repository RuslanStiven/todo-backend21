// /auth-service/src/app.ts

import 'reflect-metadata';
import express from 'express';
import { createConnection } from 'typeorm';
import { UserController } from './controller/UserController';

const app = express();

app.use(express.json());
app.use('/auth', UserController);

createConnection().then(() => {
    app.listen(3000, () => {
        console.log('Сервер запущен на 3000 порту');
    });
}).catch(error => console.log(error));