import { IsEmail, IsString, Max, Min } from 'class-validator';

export class SigninAuthDto {
  @IsEmail()
  @Max(48)
  email: string;

  @IsString()
  @Max(72)
  @Min(6)
  password: string;
}
