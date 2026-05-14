import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Task } from './entities/task.entity';
import { TaskStatus } from './enums/task.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  // ---------------- CREATE ----------------
  async create(createTaskDto: CreateTaskDto) {
    const { parentTaskId, ...taskData } = createTaskDto;

    let parentTask: Task | undefined;

    if (parentTaskId) {
      const foundParent = await this.taskRepository.findOne({
        where: { id: parentTaskId },
      });

      if (!foundParent) {
        throw new NotFoundException('Parent task not found');
      }

      parentTask = foundParent;
    }

    const task = this.taskRepository.create({
      ...taskData,
      parentTask,
    });

    return this.taskRepository.save(task);
  }

  // ---------------- FIND ALL ----------------
  async findAll(page = 1, limit = 2, status?: string) {
    const query = this.taskRepository
      .createQueryBuilder('task')
      .leftJoinAndSelect('task.subtasks', 'subtasks')
      .leftJoinAndSelect('task.parentTask', 'parentTask')
      .where('task.parentTaskId IS NULL');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    query.skip((page - 1) * limit).take(limit);

    const [tasks, total] = await query.getManyAndCount();

    return {
      data: tasks,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }

  // ---------------- FIND ONE ----------------
  async findOne(id: number) {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['subtasks', 'parentTask'],
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  // ---------------- UPDATE ----------------
  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.findOne(id);

    const { parentTaskId, ...taskData } = updateTaskDto;

    Object.assign(task, taskData);

    if (parentTaskId !== undefined) {
      if (parentTaskId === null) {
        task.parentTask = undefined;
      } else {
        const parent = await this.taskRepository.findOne({
          where: { id: parentTaskId },
        });
        if (!parent) throw new NotFoundException('Parent task not found');
        task.parentTask = parent;
      }
    }

    if (taskData.status === TaskStatus.DONE && !task.completedAt) {
      task.completedAt = new Date();
    } else if (taskData.status && taskData.status !== TaskStatus.DONE) {
      task.completedAt = undefined;
    }

    return this.taskRepository.save(task);
  }

  // ---------------- DELETE ----------------
  async remove(id: number) {
    const task = await this.findOne(id);

    await this.taskRepository.remove(task);

    return { message: 'Task deleted successfully' };
  }

  // ---------------- METRICS ----------------
  calculateTotalEstimate(task: Task): number {
    let total = task.estimate || 0;

    for (const subtask of task.subtasks || []) {
      total += this.calculateTotalEstimate(subtask);
    }

    return total;
  }

  calculateTodoEstimate(task: Task): number {
    let total = 0;

    if (task.status === TaskStatus.TODO) {
      total += task.estimate || 0;
    }

    for (const subtask of task.subtasks || []) {
      total += this.calculateTodoEstimate(subtask);
    }

    return total;
  }

  calculateInProgressEstimate(task: Task): number {
    let total = 0;

    if (task.status === TaskStatus.IN_PROGRESS) {
      total += task.estimate || 0;
    }

    for (const subtask of task.subtasks || []) {
      total += this.calculateInProgressEstimate(subtask);
    }

    return total;
  }

  calculateMetrics(task: Task) {
    let total = 0;
    let todo = 0;
    let inProgress = 0;

    const walk = (t: Task) => {
      const est = t.estimate || 0;

      total += est;

      if (t.status === TaskStatus.TODO) todo += est;
      if (t.status === TaskStatus.IN_PROGRESS) inProgress += est;

      for (const st of t.subtasks || []) {
        walk(st);
      }
    };

    walk(task);

    return { total, todo, inProgress };
  }

  async findTree(id: number) {
    const tasks = await this.taskRepository.find({
      relations: ['subtasks'],
    });

    const map = new Map<number, Task>();
    tasks.forEach((t) => map.set(t.id, t));

    const root = map.get(id);

    if (!root) {
      throw new NotFoundException('Task not found');
    }

    return this.buildTree(root, map);
  }

  private buildTree(task: Task, map: Map<number, Task>): Task {
    const children = (task.subtasks || [])
      .map((st) => map.get(st.id))
      .filter(Boolean) as Task[];

    return {
      ...task,
      subtasks: children.map((c) => this.buildTree(c, map)),
    };
  }

  async getTaskForMetrics(id: number) {
    return this.findTree(id);
  }
}
