import 'reflect-metadata';
import express from 'express';
import { createConnection } from 'typeorm';
import * as swaggerUi from 'swagger-ui-express' ;
import swaggerJsDoc from 'swagger-jsdoc' ;
//import { UserController } from './controller/UserController';
import { ProjectController } from './controller/ProjectController';
import { ColumnController } from './controller/ColumnController';
import { TaskController } from './controller/TaskController';
import ormconfig = require('../ormconfig.json');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Todo List API',
            version: '1.0.0',
            description: 'API for managing todo lists',
        },
        servers: [{ url: `http://localhost:${PORT}` }],
    },
    apis: ['./src/controller/*.ts'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//app.use('/users', UserController);
app.use('/projects', ProjectController);
app.use('/columns', ColumnController);
app.use('/tasks', TaskController);

createConnection().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch(error => console.log(error));
