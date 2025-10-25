"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateCoupleUseCase = void 0;
const common_1 = require("@nestjs/common");
const couple_entity_1 = require("../../../../core/domain/entities/couple.entity");
const subscription_entity_1 = require("../../../../core/domain/entities/subscription.entity");
const user_already_in_couple_exception_1 = require("../../../../core/exceptions/couple/user-already-in-couple.exception");
const unit_of_work_1 = require("../../../../infra/database/prisma/unit-of-work");
const logger_service_1 = require("../../../../infra/logging/logger.service");
const subscription_status_enum_1 = require("../../../../core/enum/subscription-status.enum");
let CreateCoupleUseCase = class CreateCoupleUseCase {
    coupleRepository;
    subscriptionRepository;
    planRepository;
    unitOfWork;
    logger;
    TRIAL_DAYS = 30;
    constructor(coupleRepository, subscriptionRepository, planRepository, unitOfWork, logger) {
        this.coupleRepository = coupleRepository;
        this.subscriptionRepository = subscriptionRepository;
        this.planRepository = planRepository;
        this.unitOfWork = unitOfWork;
        this.logger = logger;
    }
    async execute(input) {
        this.logger.logUseCase('CreateCoupleUseCase', {
            user_id_a: input.user_id_a,
            user_id_b: input.user_id_b,
        });
        const [userAExists, userBExists] = await Promise.all([
            this.coupleRepository.existsByUserId(input.user_id_a),
            this.coupleRepository.existsByUserId(input.user_id_b),
        ]);
        if (userAExists) {
            throw new user_already_in_couple_exception_1.UserAlreadyInCoupleException(input.user_id_a);
        }
        if (userBExists) {
            throw new user_already_in_couple_exception_1.UserAlreadyInCoupleException(input.user_id_b);
        }
        const freePlan = await this.planRepository.findFreePlan();
        if (!freePlan) {
            throw new Error('FREE plan not found in database. Run seed first.');
        }
        const result = await this.unitOfWork.execute(async (prisma) => {
            const couple = new couple_entity_1.Couple({
                user_id_a: input.user_id_a,
                user_id_b: input.user_id_b,
                free_spending_a_monthly: input.free_spending_a_monthly,
                free_spending_b_monthly: input.free_spending_b_monthly,
                free_spending_a_remaining: input.free_spending_a_monthly,
                free_spending_b_remaining: input.free_spending_b_monthly,
                reset_day: input.reset_day || 1,
            });
            const createdCouple = await prisma.couple.create({
                data: {
                    id: couple.id,
                    user_id_a: couple.user_id_a,
                    user_id_b: couple.user_id_b,
                    free_spending_a_monthly: couple.free_spending_a_monthly,
                    free_spending_b_monthly: couple.free_spending_b_monthly,
                    free_spending_a_remaining: couple.free_spending_a_remaining,
                    free_spending_b_remaining: couple.free_spending_b_remaining,
                    reset_day: couple.reset_day,
                },
            });
            const endDate = new Date();
            endDate.setDate(endDate.getDate() + this.TRIAL_DAYS);
            const subscription = new subscription_entity_1.Subscription({
                couple_id: createdCouple.id,
                plan_id: freePlan.id,
                status: subscription_status_enum_1.SubscriptionStatus.TRIAL,
                end_date: endDate,
            });
            const createdSubscription = await prisma.subscription.create({
                data: {
                    id: subscription.id,
                    couple_id: subscription.couple_id,
                    plan_id: subscription.plan_id,
                    status: subscription.status,
                    start_date: subscription.start_date,
                    end_date: subscription.end_date,
                },
            });
            return { couple: createdCouple, subscription: createdSubscription };
        });
        this.logger.log('Couple created successfully', {
            coupleId: result.couple.id,
            subscriptionId: result.subscription.id,
        });
        return {
            couple: {
                id: result.couple.id,
                user_id_a: result.couple.user_id_a,
                user_id_b: result.couple.user_id_b,
                free_spending_a_monthly: Number(result.couple.free_spending_a_monthly),
                free_spending_b_monthly: Number(result.couple.free_spending_b_monthly),
                reset_day: result.couple.reset_day,
                created_at: result.couple.created_at,
            },
            subscription: {
                id: result.subscription.id,
                plan_name: freePlan.name,
                status: result.subscription.status,
                trial_days: this.TRIAL_DAYS,
            },
        };
    }
};
exports.CreateCoupleUseCase = CreateCoupleUseCase;
exports.CreateCoupleUseCase = CreateCoupleUseCase = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [Object, Object, Object, unit_of_work_1.UnitOfWork,
        logger_service_1.LoggerService])
], CreateCoupleUseCase);
//# sourceMappingURL=create-couple.use-case.js.map