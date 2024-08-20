import { Router, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validate } from 'class-validator';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const userRepository = getRepository(User);

    const user = new User();
    user.email = email;
    user.password = await bcrypt.hash(password, 10);

    const errors = await validate(user);
    if (errors.length > 0) {
        return res.status(400).send(errors);
    }

    await userRepository.save(user);
    res.status(201).send('User created');
});

router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const userRepository = getRepository(User);

    const user = await userRepository.findOne({ where: { email } });
    if (!user || !await bcrypt.compare(password, user.password)) {
        return res.status(401).send('Invalid credentials');
    }


    const token = jwt.sign({ userId: user.id }, 'secret', { expiresIn: '1h' });
    res.send({ token });
});

export const UserController = router;
