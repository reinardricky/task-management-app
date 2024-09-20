import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto {
  @ApiProperty({ description: 'Task title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ description: 'Task description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Due date of the task', example: '2021-12-31' })
  @IsOptional()
  dueDate?: Date;

  @ApiProperty({ description: 'Task status', example: 'To Do' })
  @IsOptional()
  @IsString()
  status?: string;  // Could be 'To Do', 'In Progress', 'Done', etc.
}
