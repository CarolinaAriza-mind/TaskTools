import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { TaskPriority, TaskStatus } from '../enums/task.enum';

export class CreateTaskDto {
  @IsString()
  title!: string;

  @IsString()
  description!: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @IsEnum(TaskPriority)
  priority?: TaskPriority;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  estimate?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  parentTaskId?: number;
}
