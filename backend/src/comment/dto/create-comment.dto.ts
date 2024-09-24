import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({
    description: 'The content of the comment',
    example: 'This is a comment',
  })
  content: string;

  @ApiProperty({
    description: 'The ID of the task associated with the comment',
    example: 1,
  })
  taskId: number;
}
