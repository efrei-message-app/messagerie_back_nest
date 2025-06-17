import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service'
import { UserResolver } from './user.resolver'
import { User } from './user.model'
import { CreateUserInput, UpdateUserInput } from './dto/user.input';

const mockUser: User = {
    id: "1",
    email: "mock email",
    username: "mock username",
    createdAt: new Date("December 17, 1995 03:24:00"),
    updatedAt: new Date("June 17, 2025 10:15:00")
}

const usersServiceMock = {
    findOne: jest.fn((id: String): User => mockUser),
    findAll: jest.fn((): User[] => [mockUser]),

    create: jest.fn((data: CreateUserInput): User => ({ ...mockUser, ...data })),
    update: jest.fn((id: string, data: UpdateUserInput): User => ({ ...mockUser, ...data })),
    remove: jest.fn((id: string): User => mockUser),
};

describe('UsersResolver', () => {
    let resolver: UserResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserResolver,
                { provide: UserService, useValue: usersServiceMock },
            ],
        }).compile();

        resolver = module.get<UserResolver>(UserResolver)
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });

    it('should query for a single user', async () => {
        const result = await resolver.findOne("1");
        expect(result.id).toEqual("1");
    });

    it('should query all users', () => {
        const result = resolver.findAll();
        expect(Array.isArray(result)).toEqual(true);
    });

    it('should create a user', async () => {
        const input: CreateUserInput = {
            email: 'new@example.com',
            username: 'newuser',
            password: 'password123',
        };
        const result = await resolver.createUser(input);
        expect(result.email).toEqual(input.email);
        expect(result.username).toEqual(input.username);
        expect(usersServiceMock.create).toHaveBeenCalledWith(input);
    });

    it('should update a user', async () => {
        const input: UpdateUserInput = {
            email: 'updated@example.com',
            username: 'updatedUser',
        };
        const result = await resolver.updateUser('1', input);
        expect(result.email).toEqual(input.email);
        expect(result.username).toEqual(input.username);
        expect(usersServiceMock.update).toHaveBeenCalledWith('1', input);
    });

    it('should remove a user', async () => {
        const result = await resolver.removeUser('1');
        expect(result).toEqual(mockUser);
        expect(usersServiceMock.remove).toHaveBeenCalledWith('1');
    });
})