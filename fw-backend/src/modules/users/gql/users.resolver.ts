import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/modules/auth/auth.service';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt.guard';
import { GoogleAuthService } from 'src/modules/thirdparty/google-auth/google-auth.service';
import { UsersService } from '../users.service';
import { SignInInput, SignUpInput } from './types/users.input';
import { SignInResult, User } from './types/users.outputs';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly googleAuthService: GoogleAuthService,
  ) {}

  @Mutation(() => SignInResult)
  async googleAuth(@Args('code') code: string): Promise<SignInResult> {
    const gPayload = await this.googleAuthService.getUserPayload(code);

    const userExists = await this.usersService.getUserByEmail(gPayload.email);

    if (userExists) {
      const authToken = await this.authService.signToken({
        id: userExists.userId,
        email: userExists.email,
      });

      return { authToken };
    }

    const newUser = await this.usersService.createUser({
      email: gPayload.email,
      username: gPayload.name,
      password: 'SOCIAL_AUTH',
      socialAuth: true,
    });

    const authToken = await this.authService.signToken({
      id: newUser.userId,
      email: newUser.email,
    });

    return { authToken };
  }

  @Mutation(() => User)
  async signUp(@Args('input') createUserInput: SignUpInput) {
    const user = await this.usersService.getUserByEmail(createUserInput.email);

    if (user) {
      throw new HttpException(
        'auth.email_already_exists',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.usersService.createUser(createUserInput);
  }

  @Mutation(() => SignInResult)
  async signIn(
    @Args('input') { email, password }: SignInInput,
  ): Promise<SignInResult> {
    const user = await this.usersService.getUserByEmail(email);

    if (!user || user.socialAuth) {
      throw new HttpException(
        'auth.invalid_credentials',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword) {
      throw new HttpException(
        'auth.invalid_credentials',
        HttpStatus.BAD_REQUEST,
      );
    }

    const signedToken = await this.authService.signToken({
      id: user.userId,
      email: user.email,
    });

    return { authToken: signedToken };
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async me(@Args('id') id: string) {
    return await this.usersService.getUserById(id);
  }
}
