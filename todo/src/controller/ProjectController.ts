import { Router, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { Project } from '../entity/Project';
import { authMiddleware } from '../../../auth-service/src/middleware/authMiddleware';
import { Request } from 'express';
import { User } from '../../../auth-service/src/entity/User';

export interface AuthenticatedRequest extends Request {
    userId?: string;  // или number, если userId будет числом
}

const router = Router();

router.use(authMiddleware);

router.post('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { name, description } = req.body;
        const projectRepository = getRepository(Project);
        const userRepository = getRepository(User);
        const userId = parseInt(req.userId as string, 10);

        const user = await userRepository.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).send('User not found');
        }

        const project = new Project();
        project.name = name;
        project.description = description;
        //project.user = user;

        await projectRepository.save(project);
        res.status(201).send(project);
    } catch (error) {
        next(error);
    }
});

router.get('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const projectRepository = getRepository(Project);
        const userId = parseInt(req.userId as string, 10);
        const projects = await projectRepository.find({ where: { user: { id: userId } } });
        res.send(projects);
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const projectRepository = getRepository(Project);
        const userId = parseInt(req.userId as string, 10);
        const projectId = parseInt(id, 10);

        const project = await projectRepository.findOne({ where: { id: projectId }, relations: ['columns', 'columns.tasks', 'user'] });
        /*if (!project || project.user.id !== userId) {
            return res.status(404).send('Project not found');
        }*/

        res.send(project);
    } catch (error) {
        next(error);
    }
});

router.put('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const projectRepository = getRepository(Project);
        const userId = parseInt(req.userId as string, 10);
        const projectId = parseInt(id, 10);

        let project = await projectRepository.findOne({ where: { id: projectId }, relations: ['user'] });
        if (!project || project.user.id !== userId) {
            return res.status(404).send('Project not found');
        }

        project.name = name;
        project.description = description;

        await projectRepository.save(project);
        res.send(project);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const projectRepository = getRepository(Project);
        const userId = parseInt(req.userId as string, 10);
        const projectId = parseInt(id, 10);

        let project = await projectRepository.findOne({ where: { id: projectId }, relations: ['user'] });
        if (!project || project.user.id !== userId) {
            return res.status(404).send('Project not found');
        }

        await projectRepository.remove(project);
        res.status(204).send();
    } catch (error) {
        next(error);
    }
});

export const ProjectController = router;