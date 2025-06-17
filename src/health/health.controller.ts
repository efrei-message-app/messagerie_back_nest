
import { Controller, Get } from '@nestjs/common';
import { HealthCheckService, 
  HttpHealthIndicator, 
  HealthCheck, 
  MicroserviceHealthIndicator } from '@nestjs/terminus';
import { Transport } from '@nestjs/microservices';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private microservice: MicroserviceHealthIndicator,
  ) {}
  @Get()
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com'),
      () =>
        this.microservice.pingCheck('rabbitmq', {
          transport: Transport.RMQ,
          options: {
            urls: ['amqp://guest:guest@rabbitmq:5672'],
            queue: 'health-check',
            queueOptions: {
              durable: false,
            },
          },
        }),
    ]);
  }
}
