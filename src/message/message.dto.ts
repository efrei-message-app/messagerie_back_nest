import { IsEmail, IsString, IsUUID } from 'class-validator';

export class MessageDTO {
  @IsString()
  message: string;

  @IsUUID()
  convID: string;
}