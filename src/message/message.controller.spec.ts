// src/message/message.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { UserService } from '../user/user.service';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { RmqContext } from '@nestjs/microservices';
import { ConversationService } from 'src/conversation/conversation.service';
import { EventsGateway } from 'src/events/events.gateway';

describe('MessageController', () => {
  let controller: MessageController;
  let messageService: MessageService;
  let userService: UserService;

  const mockUser = { id: 'user1', email: 'test@mail.com' };
  const mockMessage = {
    id: 'message1',
    sender: mockUser,
    conversation: { participants: [mockUser] },
    content: 'Hello',
  };

  const mockContext = {
    getChannelRef: () => ({
      ack: jest.fn(),
    }),
    getMessage: () => 'originalMsg',
  } as unknown as RmqContext;

  const messageServiceMock = {
    create: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  };

  const userServiceMock = {
    findOneByMail: jest.fn(),
  };

  const conversationServiceMock = {
    findOne: jest.fn(),
  };

  const socketServiceMock = {
    emitMessageToConversation: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [
        { provide: MessageService, useValue: messageServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: ConversationService, useValue: conversationServiceMock },
        { provide: EventsGateway, useValue: socketServiceMock },
      ],
    }).compile();

    controller = module.get<MessageController>(MessageController);
    messageService = module.get<MessageService>(MessageService);
    userService = module.get<UserService>(UserService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('handleIncomingMessage', () => {
    it('should create a message if user exists', async () => {
      userService.findOneByMail = jest.fn().mockResolvedValue(mockUser);
      conversationServiceMock.findOne = jest.fn().mockResolvedValue({ id: 'conv1', participants: [mockUser] });

      await controller.handleIncomingMessage(
        { email: 'test@mail.com', content: 'Hello', conversationId: 'conv1' },
        mockContext,
      );

      expect(messageService.create).toHaveBeenCalledWith({
        content: 'Hello',
        conversationId: 'conv1',
        senderId: 'user1',
      });
    });

    it('should not create message if user not found', async () => {
      userService.findOneByMail = jest.fn().mockResolvedValue(null);
      await controller.handleIncomingMessage(
        { email: 'notfound@mail.com', content: 'Hello', conversationId: 'conv1' },
        mockContext,
      );
      expect(messageService.create).not.toHaveBeenCalled();
    });
  });

  describe('deleteMessage', () => {
    it('should delete a message if user and message are valid', async () => {
      userService.findOneByMail = jest.fn().mockResolvedValue(mockUser);
      messageService.findOne = jest.fn().mockResolvedValue(mockMessage);

      const res = await controller.deleteMessage('test@mail.com', 'message1');
      expect(messageService.delete).toHaveBeenCalledWith(mockMessage);
      expect(res).toEqual({ status: 'Message supprimé avec succès' });
    });

    it('should throw NotFoundException if user not found', async () => {
      userService.findOneByMail = jest.fn().mockResolvedValue(null);
      await expect(
        controller.deleteMessage('test@mail.com', 'message1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if message not found', async () => {
      userService.findOneByMail = jest.fn().mockResolvedValue(mockUser);
      messageService.findOne = jest.fn().mockResolvedValue(null);
      await expect(
        controller.deleteMessage('test@mail.com', 'message1'),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if user not in conversation', async () => {
      const otherConv = {
        ...mockMessage,
        conversation: { participants: [{ id: 'otherUser' }] },
      };
      userService.findOneByMail = jest.fn().mockResolvedValue(mockUser);
      messageService.findOne = jest.fn().mockResolvedValue(otherConv);
      await expect(
        controller.deleteMessage('test@mail.com', 'message1'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw NotFoundException if not sender', async () => {
      const otherSender = { ...mockMessage, sender: { id: 'otherUser' } };
      userService.findOneByMail = jest.fn().mockResolvedValue(mockUser);
      messageService.findOne = jest.fn().mockResolvedValue(otherSender);
      await expect(
        controller.deleteMessage('test@mail.com', 'message1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateMessage', () => {
    it('should update a message if user and message are valid', async () => {
      messageService.update = jest.fn().mockResolvedValue({
        ...mockMessage,
        content: 'Updated',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      userService.findOneByMail = jest.fn().mockResolvedValue(mockUser);
      messageService.findOne = jest.fn().mockResolvedValue(mockMessage);

      await controller.updateMessage(
        { email: 'test@mail.com', content: 'Updated', messageId: 'message1' },
        mockContext,
      );
      expect(messageService.update).toHaveBeenCalledWith({
        ...mockMessage,
        content: 'Updated',
      });
    });

    it('should throw NotFoundException if user not found', async () => {
      userService.findOneByMail = jest.fn().mockResolvedValue(null);
      await expect(
        controller.updateMessage(
          { email: 'test@mail.com', content: 'Updated', messageId: 'message1' },
          mockContext,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if message not found', async () => {
      userService.findOneByMail = jest.fn().mockResolvedValue(mockUser);
      messageService.findOne = jest.fn().mockResolvedValue(null);
      await expect(
        controller.updateMessage(
          { email: 'test@mail.com', content: 'Updated', messageId: 'message1' },
          mockContext,
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if user not in conversation', async () => {
      const otherConv = {
        ...mockMessage,
        conversation: { participants: [{ id: 'otherUser' }] },
      };
      userService.findOneByMail = jest.fn().mockResolvedValue(mockUser);
      messageService.findOne = jest.fn().mockResolvedValue(otherConv);
      await expect(
        controller.updateMessage(
          { email: 'test@mail.com', content: 'Updated', messageId: 'message1' },
          mockContext,
        ),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw NotFoundException if user not sender', async () => {
      const notSender = { ...mockMessage, sender: { id: 'otherUser' } };
      userService.findOneByMail = jest.fn().mockResolvedValue(mockUser);
      messageService.findOne = jest.fn().mockResolvedValue(notSender);
      await expect(
        controller.updateMessage(
          { email: 'test@mail.com', content: 'Updated', messageId: 'message1' },
          mockContext,
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });
});