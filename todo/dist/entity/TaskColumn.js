"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskColumn = void 0;
const typeorm_1 = require("typeorm");
const Project_1 = require("./Project");
const Task_1 = require("./Task");
let TaskColumn = class TaskColumn {
};
exports.TaskColumn = TaskColumn;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], TaskColumn.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], TaskColumn.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], TaskColumn.prototype, "order", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Project_1.Project, project => project.columns),
    __metadata("design:type", Project_1.Project)
], TaskColumn.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Task_1.Task, task => task.column),
    __metadata("design:type", Array)
], TaskColumn.prototype, "tasks", void 0);
exports.TaskColumn = TaskColumn = __decorate([
    (0, typeorm_1.Entity)()
], TaskColumn);
