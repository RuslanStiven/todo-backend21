"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColumnController = void 0;
const express_1 = require("express");
const typeorm_1 = require("typeorm");
const TaskColumn_1 = require("../entity/TaskColumn");
const Project_1 = require("../entity/Project");
const User_1 = require("../entity/User");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authMiddleware);
router.post('/', async (req, res) => {
    const { name, projectId, order } = req.body;
    const columnRepository = (0, typeorm_1.getRepository)(TaskColumn_1.TaskColumn);
    const projectRepository = (0, typeorm_1.getRepository)(Project_1.Project);
    const userRepository = (0, typeorm_1.getRepository)(User_1.User);
    // Преобразование req.userId в number
    const userId = parseInt(req.userId, 10);
    if (isNaN(userId)) {
        return res.status(400).send('Invalid user ID');
    }
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
        return res.status(404).send('User not found');
    }
    const project = await projectRepository.findOne({ where: { id: projectId }, relations: ['user'] });
    if (!project) {
        return res.status(404).send('Project not found');
    }
    if (project.user.id !== user.id) {
        return res.status(403).send('Access denied');
    }
    const column = new TaskColumn_1.TaskColumn();
    column.name = name;
    column.order = order;
    column.project = project;
    await columnRepository.save(column);
    res.status(201).send(column);
});
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, order } = req.body;
    const columnRepository = (0, typeorm_1.getRepository)(TaskColumn_1.TaskColumn);
    const userRepository = (0, typeorm_1.getRepository)(User_1.User);
    // Преобразование req.userId в number
    const userId = parseInt(req.userId, 10);
    if (isNaN(userId)) {
        return res.status(400).send('Invalid user ID');
    }
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
        return res.status(404).send('User not found');
    }
    // Преобразование id в number
    const columnId = parseInt(id, 10);
    if (isNaN(columnId)) {
        return res.status(400).send('Invalid column ID');
    }
    let column = await columnRepository.findOne({ where: { id: columnId }, relations: ['project', 'project.user'] });
    if (!column) {
        return res.status(404).send('Column not found');
    }
    if (column.project.user.id !== user.id) {
        return res.status(403).send('Access denied');
    }
    column.name = name;
    column.order = order;
    await columnRepository.save(column);
    res.send(column);
});
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const columnRepository = (0, typeorm_1.getRepository)(TaskColumn_1.TaskColumn);
    const userRepository = (0, typeorm_1.getRepository)(User_1.User);
    // Преобразование req.userId в number
    const userId = parseInt(req.userId, 10);
    if (isNaN(userId)) {
        return res.status(400).send('Invalid user ID');
    }
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
        return res.status(404).send('User not found');
    }
    // Преобразование id в number
    const columnId = parseInt(id, 10);
    if (isNaN(columnId)) {
        return res.status(400).send('Invalid column ID');
    }
    let column = await columnRepository.findOne({ where: { id: columnId }, relations: ['project', 'project.user', 'tasks'] });
    if (!column) {
        return res.status(404).send('Column not found');
    }
    if (column.project.user.id !== user.id) {
        return res.status(403).send('Access denied');
    }
    await columnRepository.remove(column);
    res.status(204).send();
});
exports.ColumnController = router;
