import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Param,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // Add a comment to a task
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Add a comment to a task' })
  @ApiResponse({ status: 201, description: 'Comment added successfully.' })
  @ApiResponse({ status: 400, description: 'Bad request.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async addComment(@Body() createCommentDto: CreateCommentDto, @Request() req) {
    const userId = req.user.userId;
    return this.commentService.createComment(createCommentDto, userId);
  }

  // Get comments for a specific task
  @UseGuards(JwtAuthGuard)
  @Get(':taskId')
  @ApiOperation({ summary: 'Get comments for a task' })
  @ApiResponse({ status: 200, description: 'Return comments for a task.' })
  @ApiResponse({ status: 401, description: 'Unauthorized.' })
  async getComments(@Param('taskId') taskId: number) {
    return this.commentService.getCommentsForTask(taskId);
  }
}
