"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const express_1 = require("express");
const typeorm_1 = require("typeorm");
const User_1 = require("../entity/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const class_validator_1 = require("class-validator");
const router = (0, express_1.Router)();
router.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const userRepository = (0, typeorm_1.getRepository)(User_1.User);
    const user = new User_1.User();
    user.email = email;
    user.password = await bcryptjs_1.default.hash(password, 10);
    const errors = await (0, class_validator_1.validate)(user);
    if (errors.length > 0) {
        return res.status(400).send(errors);
    }
    await userRepository.save(user);
    res.status(201).send('User created');
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const userRepository = (0, typeorm_1.getRepository)(User_1.User);
    const user = await userRepository.findOne({ where: { email } });
    if (!user || !await bcryptjs_1.default.compare(password, user.password)) {
        return res.status(401).send('Invalid credentials');
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id }, 'secret', { expiresIn: '1h' });
    res.send({ token });
});
exports.UserController = router;
