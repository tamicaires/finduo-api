import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SignUpUseCase } from '@application/auth/useCases/sign-up/sign-up.use-case';
import { SignInUseCase } from '@application/auth/useCases/sign-in/sign-in.use-case';
import { SignUpDto } from '../dtos/auth/sign-up.dto';
import { SignInDto } from '../dtos/auth/sign-in.dto';
import { Public } from '@infra/http/auth/decorators/public.decorator';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly signUpUseCase: SignUpUseCase,
    private readonly signInUseCase: SignInUseCase,
  ) {}

  @Public()
  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input or user already exists',
  })
  async signUp(@Body() dto: SignUpDto) {
    return this.signUpUseCase.execute({
      email: dto.email,
      password: dto.password,
      name: dto.name,
    });
  }

  @Public()
  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate user and get access token' })
  @ApiResponse({
    status: 200,
    description: 'User successfully authenticated',
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials',
  })
  async signIn(@Body() dto: SignInDto) {
    return this.signInUseCase.execute({
      email: dto.email,
      password: dto.password,
    });
  }
}
