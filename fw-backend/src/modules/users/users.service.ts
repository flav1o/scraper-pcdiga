import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../thirdparty/prisma/prisma.service';
import { SignUpInput } from './gql/types/users.input';
import { User } from './gql/types/users.outputs';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(
    input: SignUpInput & { socialAuth?: boolean },
  ): Promise<User> {
    const salt: string = await bcrypt.genSalt(10);
    const hashedPassword: string = await bcrypt.hash(input.password, salt);

    return await this.prisma.user.create({
      data: {
        email: input.email,
        password: hashedPassword,
        socialAuth: input?.socialAuth,
        name: input.username,
      },
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        userId: id,
      },
    });
  }
}
