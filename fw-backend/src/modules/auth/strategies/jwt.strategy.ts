import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'Token',
    });
  }

  async validate(payload: any) {
    if (!payload || !payload.id || !payload.email) {
      throw new UnauthorizedException('Invalid token payload');
    }
    return { userId: payload.id, email: payload.email };
  }
}
