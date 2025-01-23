import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsEmail()
  @MaxLength(48)
  email: string;

  @IsString()
  @MaxLength(72)
  @MinLength(6)
  password: string;
}
