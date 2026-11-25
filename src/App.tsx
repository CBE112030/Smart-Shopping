/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FormEvent, useRef, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { CalculatorCard } from './components/CalculatorCard';
import { HistoryPanel } from './components/HistoryPanel';
import { ResultCard } from './components/ResultCard';
import type { CalculationResult, HistoryRecord } from './types/shopping';
import {
  calculateShoppingOffer,
  clearStoredHistory,
  loadHistory,
  saveHistory,
} from './utils/calculator';

export default function App() {
  const [originalPrice, setOriginalPrice] = useState('');
  const [discountRate, setDiscountRate] = useState('');
  const [couponAmount, setCouponAmount] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [history, setHistory] = useState<HistoryRecord[]>(() => loadHistory());

  const originalPriceRef = useRef<HTMLInputElement>(null);
  const discountRateRef = useRef<HTMLInputElement>(null);
  const couponAmountRef = useRef<HTMLInputElement>(null);

  function clearErrorIfPresent() {
    if (errorMessage !== null) {
      setErrorMessage(null);
    }
  }

  function handleOriginalPriceChange(value: string) {
    setOriginalPrice(value);
    clearErrorIfPresent();
  }

  function handleDiscountRateChange(value: string) {
    setDiscountRate(value);
    clearErrorIfPresent();
  }

  function handleCouponAmountChange(value: string) {
    setCouponAmount(value);
    clearErrorIfPresent();
  }

  function handleSelectPresetDiscount(value: string) {
    setDiscountRate(value);
    clearErrorIfPresent();
  }

  function handleCalculate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const outcome = calculateShoppingOffer(
      originalPrice,
      discountRate,
      couponAmount
    );

    if (!outcome.ok) {
      setErrorMessage(outcome.error.message);
      setResult(null);

      if (outcome.error.field === 'originalPrice') {
        originalPriceRef.current?.focus();
      } else if (outcome.error.field === 'discountRate') {
        discountRateRef.current?.focus();
      } else if (outcome.error.field === 'couponAmount') {
        couponAmountRef.current?.focus();
      }
      return;
    }

    setResult(outcome.result);

    const newRecord: HistoryRecord = {
      ...outcome.result,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: Date.now(),
    };

    setHistory((prev) => saveHistory([newRecord, ...prev]));
  }

  function handleClearAndRecalculate() {
    setOriginalPrice('');
    setDiscountRate('');
    setCouponAmount('');
    setErrorMessage(null);
    setResult(null);
    originalPriceRef.current?.focus();
  }

  function handleClearHistory() {
    clearStoredHistory();
    setHistory([]);
  }

  function handleRemoveRecord(id: string) {
    setHistory((prev) => saveHistory(prev.filter((item) => item.id !== id)));
  }

  function handleSelectRecord(record: HistoryRecord) {
    setOriginalPrice(String(record.originalPrice));
    setDiscountRate(String(record.discountInput));
    setCouponAmount(record.couponInput > 0 ? String(record.couponInput) : '');
    setErrorMessage(null);
    setResult({
      originalPrice: record.originalPrice,
      discountInput: record.discountInput,
      discountLabel: record.discountLabel,
      discountedPrice: record.discountedPrice,
      couponInput: record.couponInput,
      appliedCoupon: record.appliedCoupon,
      finalPrice: record.finalPrice,
      totalSaved: record.totalSaved,
    });
  }

  return (
    <div className="min-h-screen bg-[#FBF8F4] text-[#2B2124] flex flex-col">
      {/* 頁面頂部品牌區 */}
      <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-7 sm:pt-10 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#FCE8EE] border border-[#F3CFD9] flex items-center justify-center text-[#C83E6B] shrink-0">
              <ShoppingBag className="w-6 h-6" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-[1.75rem] font-bold text-[#2B2124] tracking-tight text-balance">
                Smart Shopping 購物優惠試算助手
              </h1>
              <p className="text-sm text-[#78656B] mt-0.5">
                快速計算商品折扣與優惠券折抵，輕鬆掌握最終實付與省下金額
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* 主要內容區：電腦版雙欄並排、手機版單欄堆疊 */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 items-start">
          <div className="lg:col-span-7 space-y-6">
            <CalculatorCard
              originalPrice={originalPrice}
              discountRate={discountRate}
              couponAmount={couponAmount}
              errorMessage={errorMessage}
              originalPriceRef={originalPriceRef}
              discountRateRef={discountRateRef}
              couponAmountRef={couponAmountRef}
              onOriginalPriceChange={handleOriginalPriceChange}
              onDiscountRateChange={handleDiscountRateChange}
              onCouponAmountChange={handleCouponAmountChange}
              onSelectPresetDiscount={handleSelectPresetDiscount}
              onCalculate={handleCalculate}
              onClear={handleClearAndRecalculate}
            />

            {result && (
              <ResultCard
                result={result}
                onRecalculate={handleClearAndRecalculate}
              />
            )}
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-6">
            <HistoryPanel
              records={history}
              onClearHistory={handleClearHistory}
              onRemoveRecord={handleRemoveRecord}
              onSelectRecord={handleSelectRecord}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
