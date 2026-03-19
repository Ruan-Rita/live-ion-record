import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class SigninAuthDto {
  @IsEmail()
  @MaxLength(48)
  email: string;

  @IsString()
  @MaxLength(72)
  @MinLength(6)
  password: string;
}
