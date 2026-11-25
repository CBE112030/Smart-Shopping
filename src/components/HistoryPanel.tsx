import { History, ShoppingBag, Trash2 } from 'lucide-react';
import type { HistoryRecord } from '../types/shopping';
import { formatCurrency, formatHistoryTime } from '../utils/calculator';

interface HistoryPanelProps {
  records: HistoryRecord[];
  onClearHistory: () => void;
  onRemoveRecord: (id: string) => void;
  onSelectRecord: (record: HistoryRecord) => void;
}

export function HistoryPanel({
  records,
  onClearHistory,
  onRemoveRecord,
  onSelectRecord,
}: HistoryPanelProps) {
  return (
    <aside
      aria-labelledby="history-heading"
      className="bg-white rounded-3xl border border-[#F0DDE2] shadow-[0_8px_30px_rgb(190,115,138,0.08)] p-6 sm:p-8"
    >
      <div className="flex items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#FAF5EE] text-[#9A6B52]">
            <History className="w-5 h-5" aria-hidden="true" />
          </span>
          <div>
            <h2
              id="history-heading"
              className="text-lg font-bold text-[#2B2124] tracking-tight"
            >
              試算歷史紀錄
            </h2>
            <p className="text-xs text-[#78656B]">
              {records.length > 0
                ? `共 ${records.length} 筆紀錄 · 點擊可帶入重新試算`
                : '自動儲存於本機瀏覽器'}
            </p>
          </div>
        </div>

        {records.length > 0 && (
          <button
            type="button"
            id="clearHistoryBtn"
            onClick={onClearHistory}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#A82049] bg-[#FFF0F3] hover:bg-[#FCE0E7] rounded-xl border border-[#F5C2CF] transition-colors cursor-pointer whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C83E6B]"
          >
            <Trash2 className="w-3.5 h-3.5" aria-hidden="true" />
            <span>清除歷史紀錄</span>
          </button>
        )}
      </div>

      {records.length === 0 ? (
        <div className="rounded-2xl bg-[#FCF8F9] border border-dashed border-[#EAD4DA] py-12 px-5 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#FDF0F3] text-[#C83E6B] mb-3">
            <ShoppingBag className="w-6 h-6" aria-hidden="true" />
          </div>
          <p className="text-sm font-semibold text-[#3C2E32]">
            目前還沒有試算紀錄
          </p>
          <p className="text-xs text-[#8C757C] mt-1 leading-relaxed">
            輸入商品原價與優惠條件並點擊計算後，系統會自動保存紀錄方便比價。
          </p>
        </div>
      ) : (
        <ul className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
          {records.map((record) => {
            const timeLabel = formatHistoryTime(record.createdAt);
            return (
              <li
                key={record.id}
                className="group rounded-2xl bg-[#FCF8F9] hover:bg-[#FDF2F5] border border-[#F2E3E8] transition-colors p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectRecord(record)}
                    className="text-left flex-1 min-w-0 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C83E6B] rounded-lg"
                  >
                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-xs text-[#78656B] tabular-nums">
                      <span>原價 NT$ {formatCurrency(record.originalPrice)}</span>
                      <span aria-hidden="true">·</span>
                      <span>{record.discountLabel}</span>
                      {record.appliedCoupon > 0 && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>券折 NT$ {formatCurrency(record.appliedCoupon)}</span>
                        </>
                      )}
                      {timeLabel && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{timeLabel}</span>
                        </>
                      )}
                    </div>

                    <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2">
                      <span className="text-base font-bold text-[#B3315C] tabular-nums">
                        實付 NT$ {formatCurrency(record.finalPrice)}
                      </span>
                      <span className="text-xs font-semibold text-[#2E6F5E] tabular-nums">
                        省下 NT$ {formatCurrency(record.totalSaved)}
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onRemoveRecord(record.id)}
                    aria-label="刪除此筆試算紀錄"
                    title="刪除此筆紀錄"
                    className="p-2 -mr-1 -mt-1 text-[#A48D94] hover:text-[#A82049] hover:bg-[#FCE0E7] rounded-xl transition-colors cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C83E6B]"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </aside>
  );
}
