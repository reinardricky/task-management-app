import { IsString, IsOptional, IsEmail } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @IsEmail()
  readonly email?: string;

  @IsString()
  @IsOptional()
  readonly password?: string;
}
