import { Receipt, RotateCcw } from 'lucide-react';
import type { CalculationResult } from '../types/shopping';
import { formatCurrency } from '../utils/calculator';

interface ResultCardProps {
  result: CalculationResult;
  onRecalculate: () => void;
}

export function ResultCard({ result, onRecalculate }: ResultCardProps) {
  const isCouponCapped = result.couponInput > result.appliedCoupon;

  return (
    <section
      id="resultSection"
      aria-live="polite"
      aria-labelledby="result-heading"
      className="bg-white rounded-3xl border border-[#F0DDE2] shadow-[0_8px_30px_rgb(190,115,138,0.08)] p-6 sm:p-8"
    >
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#FDF0F3] text-[#C83E6B]">
            <Receipt className="w-5 h-5" aria-hidden="true" />
          </span>
          <div>
            <h2
              id="result-heading"
              className="text-lg font-bold text-[#2B2124] tracking-tight"
            >
              優惠試算明細
            </h2>
            <p className="text-xs text-[#78656B]">
              已為您套用 {result.discountLabel}
              {result.appliedCoupon > 0
                ? ` 與 NT$ ${formatCurrency(result.appliedCoupon)} 優惠券`
                : ''}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRecalculate}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#5C454C] bg-[#FBF3F5] hover:bg-[#F5E4E9] rounded-xl border border-[#EDD8DE] transition-colors cursor-pointer whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C83E6B]"
        >
          <RotateCcw className="w-3.5 h-3.5" aria-hidden="true" />
          <span>重新計算</span>
        </button>
      </div>

      {/* 重點放大顯示：最終付款金額 & 總共省下金額 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
        <div className="bg-[#FDF2F5] rounded-2xl p-5 flex flex-col justify-between">
          <span className="text-sm font-medium text-[#7A505D]">
            最終付款金額
          </span>
          <div className="mt-2 text-3xl sm:text-[2.25rem] leading-tight font-bold text-[#B3315C] tracking-tight tabular-nums">
            <span className="text-base sm:text-lg font-semibold mr-1">NT$</span>
            <span id="finalPrice">{formatCurrency(result.finalPrice)}</span>
          </div>
        </div>

        <div className="bg-[#FAF5EE] rounded-2xl p-5 flex flex-col justify-between">
          <span className="text-sm font-medium text-[#735D4B]">
            總共省下金額
          </span>
          <div className="mt-2 text-3xl sm:text-[2.25rem] leading-tight font-bold text-[#2E6F5E] tracking-tight tabular-nums">
            <span className="text-base sm:text-lg font-semibold mr-1">NT$</span>
            <span id="totalSaved">{formatCurrency(result.totalSaved)}</span>
          </div>
        </div>
      </div>

      {/* 完整明細項目 */}
      <dl className="divide-y divide-[#F4E6EA] text-sm">
        <div className="py-3 flex items-center justify-between gap-4">
          <dt className="text-[#6B585E]">商品原價</dt>
          <dd className="font-semibold text-[#2B2124] tabular-nums">
            NT$ {formatCurrency(result.originalPrice)}
          </dd>
        </div>

        <div className="py-3 flex items-center justify-between gap-4">
          <dt className="text-[#6B585E]">
            折扣後價格（{result.discountLabel}）
          </dt>
          <dd className="font-semibold text-[#2B2124] tabular-nums">
            NT$ {formatCurrency(result.discountedPrice)}
          </dd>
        </div>

        <div className="py-3 flex items-center justify-between gap-4">
          <dt className="text-[#6B585E]">
            優惠券折抵金額
            {isCouponCapped && (
              <span className="block text-xs text-[#9C7D86]">
                輸入 NT$ {formatCurrency(result.couponInput)}，已折抵至 NT$ 0 上限
              </span>
            )}
          </dt>
          <dd className="font-semibold text-[#B3315C] tabular-nums">
            {result.appliedCoupon > 0
              ? `- NT$ ${formatCurrency(result.appliedCoupon)}`
              : 'NT$ 0'}
          </dd>
        </div>

        <div className="pt-3.5 pb-1 flex items-center justify-between gap-4">
          <dt className="font-semibold text-[#2B2124]">最終實付金額</dt>
          <dd className="text-base font-bold text-[#B3315C] tabular-nums">
            NT$ {formatCurrency(result.finalPrice)}
          </dd>
        </div>
      </dl>
    </section>
  );
}
