import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';


@Controller('rabbit')
@UsePipes(new ValidationPipe({ whitelist: true }))
export class RabbitController {
}