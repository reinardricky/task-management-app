import { IsString, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ description: 'User email', example: 'email@example.com' })
  @IsString()
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @ApiProperty({ description: 'User password', example: 'password1234' })
  @IsString()
  @IsOptional()
  readonly password?: string;
}
