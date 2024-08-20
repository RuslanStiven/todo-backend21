"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const typeorm_1 = require("typeorm");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const UserController_1 = require("./controller/UserController");
const ProjectController_1 = require("./controller/ProjectController");
const ColumnController_1 = require("./controller/ColumnController");
const TaskController_1 = require("./controller/TaskController");
require(".types/express");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
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
const swaggerDocs = (0, swagger_jsdoc_1.default)(swaggerOptions);
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocs));
app.use('/users', UserController_1.UserController);
app.use('/projects', ProjectController_1.ProjectController);
app.use('/columns', ColumnController_1.ColumnController);
app.use('/tasks', TaskController_1.TaskController);
(0, typeorm_1.createConnection)().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch(error => console.log(error));
