import { IsEmail, IsString, Max, Min } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Min(3)
  name: string;

  @IsEmail()
  @Max(48)
  email: string;

  @IsString()
  @Max(72)
  @Min(6)
  password: string;

  constructor(partial: Partial<CreateUserDto>) {
    Object.assign(this, partial);
    console.log('DTO Data:', this, partial);
  }
}
