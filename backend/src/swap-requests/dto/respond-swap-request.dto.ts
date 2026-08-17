import { IsEnum } from "class-validator";
import { SwapRequestStatus } from "../../generated/prisma/enums";

export class RespondSwapRequestDto {
  @IsEnum(SwapRequestStatus)
  status!: SwapRequestStatus;
}