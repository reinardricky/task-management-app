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
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
@ApiBearerAuth()
@ApiTags('Task')
@Controller('task')
export class TaskController {
  constructor(private taskService: TaskService) {}

  /**
   * Endpoint to create a task.
   * Only authenticated user can create task.
   */
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create a task' })
  @ApiResponse({ status: 201, description: 'Task created successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
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
  @ApiOperation({ summary: 'Get all tasks' })
  @ApiResponse({ status: 200, description: 'Return all tasks.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
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
  @ApiOperation({ summary: 'Get my tasks' })
  @ApiResponse({
    status: 200,
    description: 'Return tasks assigned to the user.',
  })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
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
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiResponse({ status: 200, description: 'Return the task.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
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
  @ApiOperation({ summary: 'Update a task' })
  @ApiResponse({ status: 200, description: 'Task updated successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
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
   */
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a task' })
  @ApiResponse({ status: 200, description: 'Task deleted successfully.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  removeTask(@Param('id') id: string) {
    return this.taskService.removeTask(id);
  }
}
