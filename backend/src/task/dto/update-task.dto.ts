import { IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  dueDate?: Date;

  @IsOptional()
  @IsString()
  status?: string;  // Could be 'To Do', 'In Progress', 'Done', etc.
}
