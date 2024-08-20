// src/controller/TaskController.ts
import { Router, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { Task } from '../entity/Task';
import { Project } from '../entity/Project';
import { authMiddleware } from '../../../auth-service/src/middleware/authMiddleware'
import { AuthenticatedRequest } from '../types'; // Убедитесь, что путь правильный

const router = Router();

router.use(authMiddleware);

router.post('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { name, projectId } = req.body;
        const taskRepository = getRepository(Task);
        const projectRepository = getRepository(Project);
        const userId = parseInt(req.userId as string, 10);

        if (isNaN(userId)) {
            return res.status(400).send('Invalid User ID');
        }

        const project = await projectRepository.findOne({ where: { id: projectId, user: { id: userId } } });
        if (!project) {
            return res.status(404).send('Project not found or user does not have access');
        }

        const task = new Task();
        task.name = name;
        task.project = project;

        await taskRepository.save(task);
        res.status(201).send(task);
    } catch (error) {
        next(error);
    }
});

router.get('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const taskRepository = getRepository(Task);
        const userId = parseInt(req.userId as string, 10);

        const tasks = await taskRepository
            .createQueryBuilder('task')
            .innerJoinAndSelect('task.project', 'project')
            .where('project.userId = :userId', { userId })
            .getMany();

        res.send(tasks);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const taskRepository = getRepository(Task);
        const userId = parseInt(req.userId as string, 10);
        const taskId = parseInt(id, 10);

        const task = await taskRepository
            .createQueryBuilder('task')
            .innerJoinAndSelect('task.project', 'project')
            .where('task.id = :taskId', { taskId })
            .andWhere('project.userId = :userId', { userId })
            .getOne();

        if (!task) {
            return res.status(404).send('Task not found or user does not have access');
        }

        res.send(task);
    } catch (error) {
        next(error);
    }
});

router.put('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const taskRepository = getRepository(Task);
        const userId = parseInt(req.userId as string, 10);
        const taskId = parseInt(id, 10);

        let task = await taskRepository
            .createQueryBuilder('task')
            .innerJoinAndSelect('task.project', 'project')
            .where('task.id = :taskId', { taskId })
            .andWhere('project.userId = :userId', { userId })
            .getOne();

        if (!task) {
            return res.status(404).send('Task not found or user does not have access');
        }

        task.name = name;

        await taskRepository.save(task);
        res.send(task);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const taskRepository = getRepository(Task);
        const userId = parseInt(req.userId as string, 10);
        const taskId = parseInt(id, 10);

        let task = await taskRepository
            .createQueryBuilder('task')
            .innerJoinAndSelect('task.project', 'project')
            .where('task.id = :taskId', { taskId })
            .andWhere('project.userId = :userId', { userId })
            .getOne();

        if (!task) {
            return res.status(404).send('Task not found or user does not have access');
        }

        await taskRepository.remove(task);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

export const TaskController = router;