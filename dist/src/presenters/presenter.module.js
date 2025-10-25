"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PresenterModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("../application/auth/auth.module");
const couple_module_1 = require("../application/couple/couple.module");
const account_module_1 = require("../application/account/account.module");
const transaction_module_1 = require("../application/transaction/transaction.module");
const auth_controller_1 = require("./http/controllers/auth.controller");
const couple_controller_1 = require("./http/controllers/couple.controller");
const account_controller_1 = require("./http/controllers/account.controller");
const transaction_controller_1 = require("./http/controllers/transaction.controller");
let PresenterModule = class PresenterModule {
};
exports.PresenterModule = PresenterModule;
exports.PresenterModule = PresenterModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule,
            couple_module_1.CoupleModule,
            account_module_1.AccountModule,
            transaction_module_1.TransactionModule,
        ],
        controllers: [
            auth_controller_1.AuthController,
            couple_controller_1.CoupleController,
            account_controller_1.AccountController,
            transaction_controller_1.TransactionController,
        ],
    })
], PresenterModule);
//# sourceMappingURL=presenter.module.js.map