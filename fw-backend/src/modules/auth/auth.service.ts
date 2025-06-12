import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async signToken(user: { id: string; email: string }): Promise<string> {
    return await this.jwtService.signAsync(user);
  }
}
