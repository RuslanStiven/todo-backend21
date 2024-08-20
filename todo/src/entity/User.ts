/*import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { IsEmail, Length } from 'class-validator';
import { Project } from './Project';

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

    @CreateDateColumn()
    createdAt!: Date;

    @OneToMany(() => Project, project => project.user)
    projects!: Project[];
}*/