// Импортируем необходимые модули и типы из библиотеки Express и TypeORM
import { Router, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { TaskColumn } from '../entity/TaskColumn';
import { Project } from '../entity/Project';
import { authMiddleware } from '../../../auth-service/src/middleware/authMiddleware';
import { AuthenticatedRequest } from '../types';

// Создаем экземпляр Router для обработки маршрутов, связанных с колонками задач
const router = Router();

// Применяем middleware аутентификации ко всем маршрутам в этом контроллере
router.use(authMiddleware);

// Обрабатываем POST-запрос на создание новой колонки
router.post('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        // Извлекаем необходимые данные из тела запроса
        const { name, projectId } = req.body;

        // Получаем репозитории для работы с сущностями TaskColumn и Project
        const columnRepository = getRepository(TaskColumn);
        const projectRepository = getRepository(Project);

        // Извлекаем идентификатор пользователя из запроса и проверяем его
        const userId = parseInt(req.userId as string, 10);
        if (isNaN(userId)) {
            return res.status(400).send('Invalid User ID');
        }

        // Ищем проект, принадлежащий данному пользователю, по его идентификатору
        const project = await projectRepository.findOne({ where: { id: projectId, user: { id: userId } } });
        if (!project) {
            return res.status(404).send('Project not found or user does not have access');
        }

        // Создаем новую колонку и связываем ее с найденным проектом
        const column = new TaskColumn();
        column.name = name;
        //column.project = project;

        // Сохраняем колонку в базе данных
        await columnRepository.save(column);
        res.status(201).send(column);
    } catch (error) {
        // Обработка ошибок
        next(error);
    }
});

// Обрабатываем GET-запрос на получение всех колонок пользователя
router.get('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        // Получаем репозиторий для работы с сущностью TaskColumn
        const columnRepository = getRepository(TaskColumn);

        // Извлекаем идентификатор пользователя из запроса
        const userId = parseInt(req.userId as string, 10);

        // Выполняем запрос к базе данных для получения всех колонок, связанных с проектами пользователя
        const columns = await columnRepository
            .createQueryBuilder('column')
            .innerJoinAndSelect('column.project', 'project')
            .where('project.userId = :userId', { userId })
            .getMany();

        // Отправляем найденные колонки в ответе
        res.send(columns);
    } catch (error) {
        // Обработка ошибок
        next(error);
    }
});

// Обрабатываем GET-запрос на получение конкретной колонки по ее идентификатору
router.get('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        // Извлекаем идентификатор колонки из параметров запроса
        const { id } = req.params;

        // Получаем репозиторий для работы с сущностью TaskColumn
        const columnRepository = getRepository(TaskColumn);

        // Извлекаем идентификатор пользователя из запроса
        const userId = parseInt(req.userId as string, 10);

        // Преобразуем идентификатор колонки в целое число
        const columnId = parseInt(id, 10);

        // Выполняем запрос к базе данных для поиска колонки, принадлежащей пользователю
        const column = await columnRepository
            .createQueryBuilder('column')
            .innerJoinAndSelect('column.project', 'project')
            .where('column.id = :columnId', { columnId })
            .andWhere('project.userId = :userId', { userId })
            .getOne();

        // Если колонка не найдена, возвращаем ошибку
        if (!column) {
            return res.status(404).send('Column not found or user does not have access');
        }

// Отправляем найденную колонку в ответе
        res.send(column);
    } catch (error) {
        // Обработка ошибок
        next(error);
    }
});

// Обрабатываем PUT-запрос на обновление колонки по ее идентификатору
router.put('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        // Извлекаем идентификатор колонки из параметров запроса и новые данные из тела запроса
        const { id } = req.params;
        const { name } = req.body;

        // Получаем репозиторий для работы с сущностью TaskColumn
        const columnRepository = getRepository(TaskColumn);

        // Извлекаем идентификатор пользователя из запроса
        const userId = parseInt(req.userId as string, 10);

        // Преобразуем идентификатор колонки в целое число
        const columnId = parseInt(id, 10);

        // Ищем колонку, принадлежащую пользователю, для обновления
        let column = await columnRepository
            .createQueryBuilder('column')
            .innerJoinAndSelect('column.project', 'project')
            .where('column.id = :columnId', { columnId })
            .andWhere('project.userId = :userId', { userId })
            .getOne();

        // Если колонка не найдена, возвращаем ошибку
        if (!column) {
            return res.status(404).send('Column not found or user does not have access');
        }

        // Обновляем имя колонки
        column.name = name;

        // Сохраняем изменения в базе данных
        await columnRepository.save(column);
        res.send(column);
    } catch (error) {
        // Обработка ошибок
        next(error);
    }
});

// Обрабатываем DELETE-запрос на удаление колонки по ее идентификатору
router.delete('/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
        // Извлекаем идентификатор колонки из параметров запроса
        const { id } = req.params;

        // Получаем репозиторий для работы с сущностью TaskColumn
        const columnRepository = getRepository(TaskColumn);

        // Извлекаем идентификатор пользователя из запроса
        const userId = parseInt(req.userId as string, 10);

        // Преобразуем идентификатор колонки в целое число
        const columnId = parseInt(id, 10);

        // Ищем колонку, принадлежащую пользователю, для удаления
        let column = await columnRepository
            .createQueryBuilder('column')
            .innerJoinAndSelect('column.project', 'project')
            .where('column.id = :columnId', { columnId })
            .andWhere('project.userId = :userId', { userId })
            .getOne();

        // Если колонка не найдена, возвращаем ошибку
        if (!column) {
            return res.status(404).send('Column not found or user does not have access');
        }

        // Удаляем колонку из базы данных
        await columnRepository.remove(column);
        res.status(204).send(); // Отправляем ответ с кодом 204 (No Content)
    } catch (error) {
        // Обработка ошибок
        next(error);
    }
});

// Экспортируем созданный контроллер для использования в других частях приложения
export const ColumnController = router;