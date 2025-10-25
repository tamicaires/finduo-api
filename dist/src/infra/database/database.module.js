"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma/prisma.service");
const prisma_tenant_service_1 = require("./prisma/prisma-tenant.service");
const unit_of_work_1 = require("./prisma/unit-of-work");
const logging_module_1 = require("../logging/logging.module");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [logging_module_1.LoggingModule],
        providers: [prisma_service_1.PrismaService, prisma_tenant_service_1.PrismaTenantService, unit_of_work_1.UnitOfWork],
        exports: [prisma_service_1.PrismaService, prisma_tenant_service_1.PrismaTenantService, unit_of_work_1.UnitOfWork],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map