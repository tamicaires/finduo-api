import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { InvalidCredentialsException } from '@core/exceptions/auth/invalid-credentials.exception';

/**
 * Local Strategy for Passport (Email/Password login)
 * 
 * Used in SignIn flow
 * Will be implemented when we have User repository
 */
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(email: string, password: string): Promise<any> {
    // TODO: Implement when UserRepository is ready
    // const user = await this.authService.validateUser(email, password);
    // if (!user) {
    //   throw new InvalidCredentialsException();
    // }
    // return user;
    
    throw new Error('LocalStrategy not yet implemented');
  }
}
