export interface CalculationResult {
  originalPrice: number;
  discountInput: number;
  discountLabel: string;
  discountedPrice: number;
  couponInput: number;
  appliedCoupon: number;
  finalPrice: number;
  totalSaved: number;
}

export interface HistoryRecord extends CalculationResult {
  id: string;
  createdAt: number;
}

export interface ValidationError {
  field: 'originalPrice' | 'discountRate' | 'couponAmount' | 'general';
  message: string;
}
