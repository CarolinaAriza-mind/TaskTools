import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from '../enums/task.enum';

Entity();
export class Task {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  title!: string;

  @Column({ nullable: true, type: 'text' })
  description!: string;

  @Column({
    type: 'enum',
    enum: ['TODO', 'IN_PROGRESS', 'DONE'],
    default: 'TODO',
  })
  status!: TaskStatus;
}
