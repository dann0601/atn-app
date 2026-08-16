import { IsInt } from "class-validator";

export class CreateSwapRequestDto {
  @IsInt()
  toUserId!: number;
}
