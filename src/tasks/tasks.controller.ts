import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';

import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // ---------------- CREATE ----------------
  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  // ---------------- GET ALL ----------------
  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  // ---------------- GET ONE ----------------
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  // ---------------- UPDATE ----------------
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  // ---------------- DELETE ----------------
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }

  // ---------------- METRICS (CLAVE DEL CHALLENGE) ----------------

  @Get(':id/metrics')
  async getMetrics(@Param('id', ParseIntPipe) id: number) {
    const task = await this.tasksService.findTree(id);

    const metrics = this.tasksService.calculateMetrics(task);

    return {
      taskId: task.id,
      title: task.title,
      ...metrics,
    };
  }

  @Get(':id/tree')
  getTree(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.findTree(id);
  }

  @Post(':id/subtasks')
  createSubtask(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: CreateTaskDto,
  ) {
    return this.tasksService.create({
      ...dto,
      parentTaskId: id,
    });
  }
}
