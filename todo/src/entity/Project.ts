// src/entity/Project.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { TaskColumn } from './TaskColumn';
import { User } from '../../../auth-service/src/entity/User';


@Entity()
export class Project {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    description!: string;

    @OneToMany(() => TaskColumn, (task) => task.project)
    tasks!: TaskColumn[];

    @ManyToOne(() => User, (user) => user.projects)
    user!: User;

    @OneToMany(() => TaskColumn, (taskColumn) => taskColumn.project)
    columns!: TaskColumn[];
}