"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const express_1 = require("express");
const typeorm_1 = require("typeorm");
const Task_1 = require("../entity/Task");
const TaskColumn_1 = require("../entity/TaskColumn");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authMiddleware);
router.post('/', async (req, res) => {
    const { name, description, columnId, order } = req.body;
    const taskRepository = (0, typeorm_1.getRepository)(Task_1.Task);
    const columnRepository = (0, typeorm_1.getRepository)(TaskColumn_1.TaskColumn);
    const userId = parseInt(req.userId, 10);
    // Преобразование columnId в число
    const columnIdNumber = parseInt(columnId, 10);
    if (isNaN(columnIdNumber)) {
        return res.status(400).send('Invalid column ID');
    }
    const column = await columnRepository.findOne({ where: { id: columnIdNumber }, relations: ['project', 'project.user'] });
    if (!column) {
        return res.status(404).send('Column not found');
    }
    const project = column.project;
    if (!project || project.user.id !== userId) {
        return res.status(403).send('Access denied');
    }
    const task = new Task_1.Task();
    task.name = name;
    task.description = description;
    task.column = column;
    task.order = order;
    await taskRepository.save(task);
    res.status(201).send(task);
});
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description, columnId, order } = req.body;
    const taskRepository = (0, typeorm_1.getRepository)(Task_1.Task);
    const columnRepository = (0, typeorm_1.getRepository)(TaskColumn_1.TaskColumn);
    const userId = parseInt(req.userId, 10);
    // Преобразование id и columnId в числа
    const taskIdNumber = parseInt(id, 10);
    if (isNaN(taskIdNumber)) {
        return res.status(400).send('Invalid task ID');
    }
    const columnIdNumber = parseInt(columnId, 10);
    if (isNaN(columnIdNumber)) {
        return res.status(400).send('Invalid column ID');
    }
    let task = await taskRepository.findOne({ where: { id: taskIdNumber }, relations: ['column', 'column.project', 'column.project.user'] });
    if (!task) {
        return res.status(404).send('Task not found');
    }
    let column = await columnRepository.findOne({ where: { id: columnIdNumber }, relations: ['project', 'project.user'] });
    if (!column) {
        return res.status(404).send('Column not found');
    }
    const project = column.project;
    if (!project || project.user.id !== userId) {
        return res.status(403).send('Access denied');
    }
    task.name = name;
    task.description = description;
    task.column = column;
    task.order = order;
    await taskRepository.save(task);
    res.send(task);
});
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const taskRepository = (0, typeorm_1.getRepository)(Task_1.Task);
    const userId = parseInt(req.userId, 10);
    // Преобразование id в число
    const taskIdNumber = parseInt(id, 10);
    if (isNaN(taskIdNumber)) {
        return res.status(400).send('Invalid task ID');
    }
    let task = await taskRepository.findOne({ where: { id: taskIdNumber }, relations: ['column', 'column.project', 'column.project.user'] });
    if (!task) {
        return res.status(404).send('Task not found');
    }
    const column = task.column;
    const project = column?.project;
    if (!project || project.user.id !== userId) {
        return res.status(403).send('Access denied');
    }
    await taskRepository.remove(task);
    res.status(204).send();
});
exports.TaskController = router;
