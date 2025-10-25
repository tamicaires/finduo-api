import { BusinessException } from '../base/business.exception';
import { ErrorCode } from '@core/enum/error-codes.enum';

export class InsufficientFreeSpendingException extends BusinessException {
  constructor(available: number, required: number) {
    super(
      \`Insufficient free spending. Available: R$ \${available.toFixed(2)}, Required: R$ \${required.toFixed(2)}\`,
      ErrorCode.INSUFFICIENT_FREE_SPENDING,
      422,
    );
  }
}
