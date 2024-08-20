// src/entity/TaskColumn.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Project } from './Project';
import { Task } from './Task';

@Entity()
export class TaskColumn {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @ManyToOne(() => Project, (project) => project.columns)
    project!: Project;

    @OneToMany(() => Task, (task) => task.column)
    tasks!: Task[];
}