// src/entity/Task.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Project } from './Project';
import { TaskColumn } from './TaskColumn';

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @ManyToOne(() => Project, (project) => project.tasks)
    project!: Project;

    @ManyToOne(() => TaskColumn, (taskColumn) => taskColumn.tasks)
    column!: Project;
}