import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  UseGuards,
  Body,
  Param,
  Request,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  /**
   * Endpoint to create a task.
   * Only authenticated user can create task.
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    const userId = req.user.userId;
    return this.taskService.createTask(createTaskDto, userId);
  }

  /**
   * Endpoint to get all task.
   * Only 'admin' user can retrieve all task.
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get('admin')
  findAllTaskForAdmin() {
    return this.taskService.findAll();
  }

  /**
   * Endpoint to get task assigned to the authenticated user.
   * Both 'user' and 'admin' roles can access this.
   */
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'user')
  @Get('me')
  findMyTask(@Request() req) {
    const userId = req.user.userId;
    return this.taskService.findTaskByUser(userId);
  }

  /**
   * Endpoint to get a specific task by its ID.
   * Only authenticated user can view the task.
   */
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findTaskById(@Param('id') id: string, @Request() req) {
    const userId = req.user.userId;
    return this.taskService.findOne(id, userId);
  }

  /**
   * Endpoint to update a task.
   * Only authenticated user who are assigned the task can update it.
   */
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Request() req,
  ) {
    const userId = req.user.userId;
    return this.taskService.updateTask(id, updateTaskDto, userId);
  }

  /**
   * Endpoint to delete a task.
   * Only the 'admin' role can delete task.
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  removeTask(@Param('id') id: string) {
    return this.taskService.removeTask(id);
  }
}
