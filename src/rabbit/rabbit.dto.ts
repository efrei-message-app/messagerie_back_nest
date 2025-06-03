import { IsEmail, IsString } from 'class-validator';

export class NotificationDto {
  @IsEmail()
  email: string;

  @IsString()
  message: string;
}