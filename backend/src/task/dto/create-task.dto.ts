import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  dueDate: Date;

  @IsOptional()
  @IsString()
  status: string;  // Could be 'To Do', 'In Progress', 'Done', etc.
}
