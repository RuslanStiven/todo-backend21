"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
const express_1 = require("express");
const typeorm_1 = require("typeorm");
const Project_1 = require("../entity/Project");
const User_1 = require("../entity/User");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.use(authMiddleware_1.authMiddleware);
router.post('/', async (req, res) => {
    const { name, description } = req.body;
    const projectRepository = (0, typeorm_1.getRepository)(Project_1.Project);
    const userRepository = (0, typeorm_1.getRepository)(User_1.User);
    const userId = parseInt(req.userId, 10);
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
        return res.status(404).send('User not found');
    }
    const project = new Project_1.Project();
    project.name = name;
    project.description = description;
    project.user = user;
    await projectRepository.save(project);
    res.status(201).send(project);
});
router.get('/', async (req, res) => {
    const projectRepository = (0, typeorm_1.getRepository)(Project_1.Project);
    const userId = parseInt(req.userId, 10);
    const projects = await projectRepository.find({ where: { user: { id: userId } } });
    res.send(projects);
});
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const projectRepository = (0, typeorm_1.getRepository)(Project_1.Project);
    const userId = parseInt(req.userId, 10);
    const projectId = parseInt(id, 10);
    const project = await projectRepository.findOne({ where: { id: projectId }, relations: ['columns', 'columns.tasks', 'user'] });
    if (!project || project.user.id !== userId) {
        return res.status(404).send('Project not found');
    }
    res.send(project);
});
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const projectRepository = (0, typeorm_1.getRepository)(Project_1.Project);
    const userId = parseInt(req.userId, 10);
    const projectId = parseInt(id, 10);
    let project = await projectRepository.findOne({ where: { id: projectId }, relations: ['user'] });
    if (!project || project.user.id !== userId) {
        return res.status(404).send('Project not found');
    }
    project.name = name;
    project.description = description;
    await projectRepository.save(project);
    res.send(project);
});
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const projectRepository = (0, typeorm_1.getRepository)(Project_1.Project);
    const userId = parseInt(req.userId, 10);
    const projectId = parseInt(id, 10);
    let project = await projectRepository.findOne({ where: { id: projectId }, relations: ['user'] });
    if (!project || project.user.id !== userId) {
        return res.status(404).send('Project not found');
    }
    await projectRepository.remove(project);
    res.status(204).send();
});
exports.ProjectController = router;
