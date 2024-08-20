import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { IsEmail, Length } from 'class-validator';
import { Project } from '../../../todo/src/entity/Project';
import bcrypt from 'bcryptjs';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    @IsEmail()
    email!: string;

    @Column()
    @Length(4, 20)
    password!: string;

    @OneToMany(() => Project, (project) => project.user)
    projects!: Project[];
}