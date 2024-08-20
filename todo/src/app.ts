import 'reflect-metadata';
import express from 'express';
import { createConnection } from 'typeorm';
import { ProjectController } from './controller/ProjectController';
import { authMiddleware } from '../../auth-service/src/middleware/authMiddleware';

const app = express();

app.use(express.json());

// Защищенные маршруты
app.use('/projects', authMiddleware, ProjectController);

createConnection().then(() => {
    app.listen(4000, () => {
        console.log('Main service is running on port 4000');
    });
}).catch(error => console.log(error));