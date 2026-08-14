import { IsDateString, IsOptional, IsString } from "class-validator";

export class CreateEventDto {
  @IsString()
  title!: string;

  @IsDateString()
  date!: string;

  @IsString()
  time!: string;

  @IsString()
  location!: string;

  @IsOptional()
  @IsString()
  description!: string;

  @IsOptional()
  @IsString()
  equipmentNeeded!: string;
}
