import { IsEmail, IsString, MinLength } from "class-validator";

export class JoinDto {
  @IsString()
  code: string;

  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}