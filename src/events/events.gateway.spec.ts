import { Test, TestingModule } from '@nestjs/testing';
import { EventsGateway } from './events.gateway';
import { Socket } from 'socket.io';

describe('EventsGateway', () => {
  let gateway: EventsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EventsGateway],
    }).compile();

    gateway = module.get<EventsGateway>(EventsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('joinRoom', () => {
    it('should call socket.join with correct arguments', () => {
      const mockSocket = {
        join: jest.fn(),
      } as unknown as Socket;

      gateway.handleJoinRoom('1', mockSocket);

      expect(mockSocket.join).toHaveBeenCalledWith('1');
    });
  });
});
