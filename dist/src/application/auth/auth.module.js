"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const database_module_1 = require("../../infra/database/database.module");
const logging_module_1 = require("../../infra/logging/logging.module");
const sign_up_use_case_1 = require("./useCases/sign-up/sign-up.use-case");
const sign_in_use_case_1 = require("./useCases/sign-in/sign-in.use-case");
const validate_user_use_case_1 = require("./useCases/validate-user/validate-user.use-case");
const jwt_strategy_1 = require("../../infra/http/auth/strategies/jwt.strategy");
const local_strategy_1 = require("../../infra/http/auth/strategies/local.strategy");
const prisma_user_repository_1 = require("../../infra/database/prisma/repositories/prisma-user.repository");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            logging_module_1.LoggingModule,
            passport_1.PassportModule,
            config_1.ConfigModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    secret: configService.get('JWT_SECRET') || 'your-super-secret-jwt-key-change-in-production',
                    signOptions: {
                        expiresIn: (configService.get('JWT_EXPIRES_IN') || '7d'),
                    },
                }),
            }),
        ],
        providers: [
            sign_up_use_case_1.SignUpUseCase,
            sign_in_use_case_1.SignInUseCase,
            validate_user_use_case_1.ValidateUserUseCase,
            jwt_strategy_1.JwtStrategy,
            local_strategy_1.LocalStrategy,
            {
                provide: 'IUserRepository',
                useClass: prisma_user_repository_1.PrismaUserRepository,
            },
        ],
        exports: [sign_up_use_case_1.SignUpUseCase, sign_in_use_case_1.SignInUseCase, validate_user_use_case_1.ValidateUserUseCase, jwt_1.JwtModule],
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map