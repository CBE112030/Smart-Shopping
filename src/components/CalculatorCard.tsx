import { FormEvent, KeyboardEvent, RefObject } from 'react';
import {
  AlertCircle,
  Calculator,
  RotateCcw,
  Tag,
  Ticket,
} from 'lucide-react';
import { DISCOUNT_PRESETS } from '../utils/calculator';

interface CalculatorCardProps {
  originalPrice: string;
  discountRate: string;
  couponAmount: string;
  errorMessage: string | null;
  originalPriceRef: RefObject<HTMLInputElement | null>;
  discountRateRef: RefObject<HTMLInputElement | null>;
  couponAmountRef: RefObject<HTMLInputElement | null>;
  onOriginalPriceChange: (value: string) => void;
  onDiscountRateChange: (value: string) => void;
  onCouponAmountChange: (value: string) => void;
  onSelectPresetDiscount: (value: string) => void;
  onCalculate: (event: FormEvent<HTMLFormElement>) => void;
  onClear: () => void;
}

function preventInvalidNumberKeys(event: KeyboardEvent<HTMLInputElement>) {
  if (['-', '+', 'e', 'E'].includes(event.key)) {
    event.preventDefault();
  }
}

export function CalculatorCard({
  originalPrice,
  discountRate,
  couponAmount,
  errorMessage,
  originalPriceRef,
  discountRateRef,
  couponAmountRef,
  onOriginalPriceChange,
  onDiscountRateChange,
  onCouponAmountChange,
  onSelectPresetDiscount,
  onCalculate,
  onClear,
}: CalculatorCardProps) {
  const normalizedDiscount = discountRate.trim();

  return (
    <section
      aria-labelledby="calculator-heading"
      className="bg-white rounded-3xl border border-[#F0DDE2] shadow-[0_8px_30px_rgb(190,115,138,0.08)] p-6 sm:p-8"
    >
      <div className="flex items-center gap-2.5 mb-6">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#FDF0F3] text-[#C83E6B]">
          <Tag className="w-5 h-5" aria-hidden="true" />
        </span>
        <div>
          <h2
            id="calculator-heading"
            className="text-lg font-bold text-[#2B2124] tracking-tight"
          >
            商品與優惠設定
          </h2>
          <p className="text-xs text-[#78656B]">
            依序套用商品折數後，再折抵優惠券金額
          </p>
        </div>
      </div>

      {errorMessage && (
        <div
          id="errorBox"
          className="mb-5 p-3.5 rounded-2xl bg-[#FFF0F3] border border-[#F5C2CF] text-[#A82049] text-sm flex items-start gap-2.5"
          role="alert"
        >
          <AlertCircle
            className="w-5 h-5 text-[#C83E6B] shrink-0 mt-0.5"
            aria-hidden="true"
          />
          <span>{errorMessage}</span>
        </div>
      )}

      <form
        id="calculatorForm"
        onSubmit={onCalculate}
        className="space-y-5"
        noValidate
      >
        {/* 商品原價 */}
        <div>
          <label
            htmlFor="originalPrice"
            className="block text-sm font-semibold text-[#3C2E32] mb-1.5"
          >
            商品原價 (新台幣)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-[#8C757C] font-medium select-none text-sm">
              NT$
            </span>
            <input
              ref={originalPriceRef}
              type="number"
              id="originalPrice"
              min="1"
              step="1"
              inputMode="decimal"
              value={originalPrice}
              onKeyDown={preventInvalidNumberKeys}
              onChange={(e) => onOriginalPriceChange(e.target.value)}
              placeholder="例如：1200"
              className="w-full pl-13 pr-4 py-3 bg-[#FCF8F9] border border-[#EAD4DA] rounded-2xl text-[#2B2124] placeholder-[#B09BA2] focus:outline-none focus:ring-2 focus:ring-[#D96B8F] focus:border-[#C83E6B] focus:bg-white transition-colors text-base tabular-nums"
            />
          </div>
        </div>

        {/* 商品折扣（快速選擇 + 自訂輸入） */}
        <div>
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
            <label
              htmlFor="discountRate"
              className="block text-sm font-semibold text-[#3C2E32]"
            >
              商品折扣
            </label>
            <span className="text-xs text-[#8C757C]">
              快速點選或輸入自訂折數
            </span>
          </div>

          <div
            className="grid grid-cols-4 gap-2 sm:gap-2.5 mb-2.5"
            role="group"
            aria-label="常用折扣快速選擇"
          >
            {DISCOUNT_PRESETS.map((preset) => {
              const isSelected = normalizedDiscount === preset.value;
              return (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => onSelectPresetDiscount(preset.value)}
                  aria-pressed={isSelected}
                  className={`min-h-[42px] py-2 px-3 rounded-xl text-sm font-semibold border transition-colors cursor-pointer whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C83E6B] ${
                    isSelected
                      ? 'bg-[#C83E6B] text-white border-[#C83E6B] shadow-sm'
                      : 'bg-[#FDF5F7] text-[#5C454C] border-[#EDD8DE] hover:bg-[#FAE8ED] hover:text-[#2B2124]'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          <div className="relative">
            <input
              ref={discountRateRef}
              type="number"
              id="discountRate"
              min="0.1"
              max="99"
              step="0.1"
              inputMode="decimal"
              value={discountRate}
              onKeyDown={preventInvalidNumberKeys}
              onChange={(e) => onDiscountRateChange(e.target.value)}
              placeholder="自訂折數，例如：85 代表 85 折"
              className="w-full pl-4 pr-11 py-3 bg-[#FCF8F9] border border-[#EAD4DA] rounded-2xl text-[#2B2124] placeholder-[#B09BA2] focus:outline-none focus:ring-2 focus:ring-[#D96B8F] focus:border-[#C83E6B] focus:bg-white transition-colors text-base tabular-nums"
            />
            <span className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#78656B] font-medium select-none text-sm">
              折
            </span>
          </div>
          <p className="text-xs text-[#8C757C] mt-1.5">
            支援 0.1 至 99 之間（例如：8 代表 8 折，85 代表 85 折）
          </p>
        </div>

        {/* 優惠券折抵金額 */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <label
              htmlFor="couponAmount"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3C2E32]"
            >
              <Ticket className="w-4 h-4 text-[#C83E6B]" aria-hidden="true" />
              <span>優惠券折抵金額</span>
            </label>
            <span className="text-xs text-[#8C757C]">選填</span>
          </div>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-[#8C757C] font-medium select-none text-sm">
              NT$
            </span>
            <input
              ref={couponAmountRef}
              type="number"
              id="couponAmount"
              min="0"
              step="1"
              inputMode="decimal"
              value={couponAmount}
              onKeyDown={preventInvalidNumberKeys}
              onChange={(e) => onCouponAmountChange(e.target.value)}
              placeholder="例如：100（無優惠券可留空）"
              className="w-full pl-13 pr-4 py-3 bg-[#FCF8F9] border border-[#EAD4DA] rounded-2xl text-[#2B2124] placeholder-[#B09BA2] focus:outline-none focus:ring-2 focus:ring-[#D96B8F] focus:border-[#C83E6B] focus:bg-white transition-colors text-base tabular-nums"
            />
          </div>
          <p className="text-xs text-[#8C757C] mt-1.5">
            商品折扣後再扣除優惠券，最終付款金額最低為 NT$ 0
          </p>
        </div>

        {/* 操作按鈕 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            id="clearBtn"
            onClick={onClear}
            className="w-full min-h-[46px] py-3 px-4 inline-flex items-center justify-center gap-2 bg-[#FBF3F5] hover:bg-[#F5E4E9] active:bg-[#EED5DD] text-[#5C454C] font-semibold rounded-2xl border border-[#EDD8DE] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C83E6B] cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            <span>清除重填</span>
          </button>
          <button
            type="submit"
            id="calculateBtn"
            className="w-full min-h-[46px] py-3 px-4 inline-flex items-center justify-center gap-2 bg-[#C83E6B] hover:bg-[#B3315C] active:bg-[#9D284F] text-white font-semibold rounded-2xl shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C83E6B] focus-visible:ring-offset-2 cursor-pointer whitespace-nowrap"
          >
            <Calculator className="w-4 h-4" aria-hidden="true" />
            <span>計算優惠價格</span>
          </button>
        </div>
      </form>
    </section>
  );
}
