import type {
  CalculationResult,
  HistoryRecord,
  ValidationError,
} from '../types/shopping';

const HISTORY_STORAGE_KEY = 'smart_shopping_calc_history_v1';
const MAX_HISTORY_ITEMS = 20;

export const DISCOUNT_PRESETS = [
  { label: '9 折', value: '9' },
  { label: '8 折', value: '8' },
  { label: '7 折', value: '7' },
  { label: '5 折', value: '5' },
] as const;

/**
 * 將數值格式化為台灣常用的千分位金額格式
 */
export function formatCurrency(amount: number): string {
  return amount.toLocaleString('zh-TW', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}

/**
 * 格式化折扣顯示標籤（例如：8 -> 8 折，85 -> 85 折）
 */
export function formatDiscountLabel(discount: number): string {
  return `${discount} 折`;
}

/**
 * 格式化試算時間
 */
export function formatHistoryTime(timestamp: number): string {
  try {
    return new Intl.DateTimeFormat('zh-TW', {
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(new Date(timestamp));
  } catch {
    return '';
  }
}

/**
 * 驗證並執行購物優惠計算
 */
export function calculateShoppingOffer(
  rawOriginalPrice: string,
  rawDiscountRate: string,
  rawCouponAmount: string
):
  | { ok: true; result: CalculationResult }
  | { ok: false; error: ValidationError } {
  const trimmedPrice = rawOriginalPrice.trim();
  const trimmedDiscount = rawDiscountRate.trim();
  const trimmedCoupon = rawCouponAmount.trim();

  if (trimmedPrice === '' || trimmedDiscount === '') {
    return {
      ok: false,
      error: {
        field: trimmedPrice === '' ? 'originalPrice' : 'discountRate',
        message: '請完整輸入「商品原價」與「商品折扣」。',
      },
    };
  }

  const originalPrice = Number(trimmedPrice);
  if (!Number.isFinite(originalPrice) || originalPrice <= 0) {
    return {
      ok: false,
      error: {
        field: 'originalPrice',
        message: '商品原價必須為大於 0 的有效數字，不可輸入負數或無效數值。',
      },
    };
  }

  const discountInput = Number(trimmedDiscount);
  if (
    !Number.isFinite(discountInput) ||
    discountInput <= 0 ||
    discountInput >= 100
  ) {
    return {
      ok: false,
      error: {
        field: 'discountRate',
        message:
          '請輸入合理的折扣數值（需介於 0.1 至 99 之間，例如 8 代表 8 折、85 代表 85 折）。',
      },
    };
  }

  let couponInput = 0;
  if (trimmedCoupon !== '') {
    couponInput = Number(trimmedCoupon);
    if (!Number.isFinite(couponInput) || couponInput < 0) {
      return {
        ok: false,
        error: {
          field: 'couponAmount',
          message: '優惠券金額不可為負數或無效數值。',
        },
      };
    }
  }

  // 換算折扣乘數：小於 10 (例如 8 或 7.5) 除以 10；10~99 (例如 85) 除以 100
  const multiplier =
    discountInput < 10 ? discountInput / 10 : discountInput / 100;

  const discountedPrice = Math.round(originalPrice * multiplier);
  const roundedCoupon = Math.round(couponInput);

  // 最終付款金額不得低於 0
  const finalPrice = Math.max(0, discountedPrice - roundedCoupon);
  const appliedCoupon = discountedPrice - finalPrice;
  const totalSaved = originalPrice - finalPrice;

  return {
    ok: true,
    result: {
      originalPrice,
      discountInput,
      discountLabel: formatDiscountLabel(discountInput),
      discountedPrice,
      couponInput: roundedCoupon,
      appliedCoupon,
      finalPrice,
      totalSaved,
    },
  };
}

/**
 * 從 localStorage 讀取試算歷史紀錄
 */
export function loadHistory(): HistoryRecord[] {
  try {
    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is HistoryRecord =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as HistoryRecord).id === 'string' &&
        typeof (item as HistoryRecord).originalPrice === 'number' &&
        typeof (item as HistoryRecord).finalPrice === 'number' &&
        typeof (item as HistoryRecord).createdAt === 'number'
    );
  } catch {
    return [];
  }
}

/**
 * 儲存試算歷史紀錄到 localStorage
 */
export function saveHistory(records: HistoryRecord[]): HistoryRecord[] {
  const trimmed = records.slice(0, MAX_HISTORY_ITEMS);
  try {
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(trimmed));
  } catch {
    // 若瀏覽器停用或空間不足，忽略儲存錯誤而不中斷試算功能
  }
  return trimmed;
}

/**
 * 清除 localStorage 中的試算歷史紀錄
 */
export function clearStoredHistory(): void {
  try {
    window.localStorage.removeItem(HISTORY_STORAGE_KEY);
  } catch {
    // 忽略儲存存取異常
  }
}
