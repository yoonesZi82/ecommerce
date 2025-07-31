import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import PayloadType from '../types/payload.type';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // for expire token
      secretOrKey: configService.get('JWT_SECRET_KEY') as string,
    });
  }

  validate(payload: PayloadType) {
    return {
      id: payload.id,
      role: payload.role,
      mobile: payload.mobile,
      display_name: payload.display_name,
    };
  }
}
