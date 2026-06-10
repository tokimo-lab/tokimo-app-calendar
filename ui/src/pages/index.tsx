import { useQuery } from "@tanstack/react-query";
import { Select, Spin, Tooltip } from "@tokimo/ui";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Globe,
  PartyPopper,
  Sunrise,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useT } from "../TranslatorContext";

// ─── Types ──────────────────────────────────────────────────────────────────

interface PublicHolidayOutput {
  date: string;
  localName: string;
  name: string;
  global: boolean;
  types: string[];
}

interface LongWeekendOutput {
  startDate: string;
  endDate: string;
  dayCount: number;
  needBridgeDay: boolean;
}

interface AvailableCountryOutput {
  countryCode: string;
  name: string;
}

// ─── API fetch helpers ───────────────────────────────────────────────────────

async function fetchHolidays(
  year: number,
  country: string,
): Promise<PublicHolidayOutput[]> {
  const r = await fetch(
    `/api/apps/calendar/holidays?year=${year}&country=${country}`,
    {
      credentials: "same-origin",
    },
  );
  if (!r.ok) throw new Error(`holidays fetch failed: ${r.status}`);
  return r.json() as Promise<PublicHolidayOutput[]>;
}

async function fetchLongWeekends(
  year: number,
  country: string,
): Promise<LongWeekendOutput[]> {
  const r = await fetch(
    `/api/apps/calendar/long-weekends?year=${year}&country=${country}`,
    {
      credentials: "same-origin",
    },
  );
  if (!r.ok) throw new Error(`long-weekends fetch failed: ${r.status}`);
  return r.json() as Promise<LongWeekendOutput[]>;
}

async function fetchNextHolidays(
  country: string,
): Promise<PublicHolidayOutput[]> {
  const r = await fetch(`/api/apps/calendar/next-holidays?country=${country}`, {
    credentials: "same-origin",
  });
  if (!r.ok) throw new Error(`next-holidays fetch failed: ${r.status}`);
  return r.json() as Promise<PublicHolidayOutput[]>;
}

async function fetchCountries(): Promise<AvailableCountryOutput[]> {
  const r = await fetch("/api/apps/calendar/countries", {
    credentials: "same-origin",
  });
  if (!r.ok) throw new Error(`countries fetch failed: ${r.status}`);
  return r.json() as Promise<AvailableCountryOutput[]>;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

const GRID_CELLS = 42;

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function firstDayOfWeek(year: number, month: number): number {
  return new Date(year, month - 1, 1).getDay();
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isWeekend(year: number, month: number, day: number): boolean {
  const dow = new Date(year, month - 1, day).getDay();
  return dow === 0 || dow === 6;
}

function dateKey(month: number, day: number): string {
  return `${pad(month)}-${pad(day)}`;
}

function parseDateStr(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatDateNice(dateStr: string, locale: string): string {
  const d = parseDateStr(dateStr);
  return d.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    weekday: "short",
  });
}

function daysUntil(dateStr: string): number {
  const target = parseDateStr(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

// ─── Holiday map builder ──────────────────────────────────────────────────────

interface HolidayInfo {
  localName: string;
  name: string;
  global: boolean;
  types: string[];
}

function buildHolidayMap(
  data: PublicHolidayOutput[],
): Map<string, HolidayInfo> {
  const map = new Map<string, HolidayInfo>();
  for (const h of data) {
    const key = h.date.slice(5);
    map.set(key, {
      localName: h.localName,
      name: h.name,
      global: h.global,
      types: h.types,
    });
  }
  return map;
}

function buildLongWeekendSet(weekends: LongWeekendOutput[]): Set<string> {
  const set = new Set<string>();
  for (const w of weekends) {
    const start = parseDateStr(w.startDate);
    const end = parseDateStr(w.endDate);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      set.add(
        `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
      );
    }
  }
  return set;
}

// ─── Subcomponents ───────────────────────────────────────────────────────────

function MonthNavButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg text-fg-secondary transition-colors hover:bg-black/8 hover:text-fg-primary dark:hover:bg-white/10"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function DayCell({
  day,
  isCurrentMonth,
  isToday,
  isWeekendDay,
  holiday,
  isLongWeekend,
  isSelected,
  onClick,
}: {
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekendDay: boolean;
  holiday: HolidayInfo | undefined;
  isLongWeekend: boolean;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`relative flex h-[72px] cursor-pointer flex-col items-center justify-start gap-0.5 rounded-xl pt-1.5 transition-all ${
        isToday
          ? "bg-red-500 text-white shadow-md shadow-red-500/25"
          : isSelected
            ? "bg-black/8 dark:bg-white/10"
            : isLongWeekend && isCurrentMonth
              ? "bg-amber-500/8 dark:bg-amber-400/10"
              : "hover:bg-black/5 dark:hover:bg-white/8"
      } ${!isCurrentMonth ? "opacity-30" : ""}`}
      onClick={onClick}
    >
      <span
        className={`text-sm font-medium leading-none ${
          isToday
            ? "text-white"
            : isWeekendDay && isCurrentMonth
              ? "text-red-500 dark:text-red-400"
              : isCurrentMonth
                ? "text-fg-primary"
                : "text-fg-muted"
        }`}
      >
        {day}
      </span>
      {holiday && isCurrentMonth && (
        <span
          className={`mt-0.5 max-w-full truncate px-0.5 text-[9px] leading-tight ${
            isToday ? "text-white/80" : "text-red-500 dark:text-red-400"
          }`}
        >
          {holiday.localName}
        </span>
      )}
      {isLongWeekend && isCurrentMonth && !holiday && (
        <div
          className={`mt-1 h-1 w-1 rounded-full ${
            isToday ? "bg-white/60" : "bg-amber-500 dark:bg-amber-400"
          }`}
        />
      )}
    </button>
  );
}

function UpcomingHolidays({
  holidays,
  isLoading,
  locale,
  onNavigate,
}: {
  holidays: PublicHolidayOutput[] | undefined;
  isLoading: boolean;
  locale: string;
  onNavigate: (dateStr: string) => void;
}) {
  const t = useT();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Spin />
      </div>
    );
  }

  const upcoming = holidays?.slice(0, 8) ?? [];

  if (upcoming.length === 0) {
    return (
      <p className="py-4 text-center text-xs text-fg-muted">
        {t("noUpcoming")}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {upcoming.map((h) => {
        const days = daysUntil(h.date);
        const dateLabel = formatDateNice(h.date, locale);
        return (
          <button
            type="button"
            key={h.date}
            className="flex w-full cursor-pointer items-start gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-black/5 dark:hover:bg-white/8"
            onClick={() => onNavigate(h.date)}
          >
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-500/10 text-red-500 dark:bg-red-500/20">
              <PartyPopper size={14} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-fg-primary">
                {h.localName}
              </p>
              <p className="text-[10px] text-fg-muted">
                {dateLabel}
                {days >= 0 && (
                  <span className="ml-1 text-red-500 dark:text-red-400">
                    {days === 0
                      ? t("today")
                      : days === 1
                        ? t("tomorrow")
                        : t("inDays", { count: days })}
                  </span>
                )}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function LongWeekendsList({
  weekends,
  isLoading,
  locale,
  onNavigate,
}: {
  weekends: LongWeekendOutput[] | undefined;
  isLoading: boolean;
  locale: string;
  onNavigate: (dateStr: string) => void;
}) {
  const t = useT();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Spin />
      </div>
    );
  }

  const items = weekends ?? [];
  if (items.length === 0) {
    return (
      <p className="py-4 text-center text-xs text-fg-muted">
        {t("noLongWeekends")}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {items.map((w) => {
        const start = formatDateNice(w.startDate, locale);
        const end = formatDateNice(w.endDate, locale);
        return (
          <button
            type="button"
            key={w.startDate}
            className="flex w-full cursor-pointer items-start gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-black/5 dark:hover:bg-white/8"
            onClick={() => onNavigate(w.startDate)}
          >
            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
              <Sunrise size={14} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-fg-primary">
                {t("daysOff", { count: w.dayCount })}
                {w.needBridgeDay && (
                  <span className="ml-1 text-[10px] text-amber-600 dark:text-amber-400">
                    {t("needBridgeDay")}
                  </span>
                )}
              </p>
              <p className="text-[10px] text-fg-muted">
                {start} — {end}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function CalendarPage({ locale }: { locale: string }) {
  const t = useT();
  const weekdayLabels = t("weekdays").split(",");

  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [country, setCountry] = useState("CN");

  const { data: holidays, isLoading: holidaysLoading } = useQuery({
    queryKey: ["holidays", viewYear, country],
    queryFn: () => fetchHolidays(viewYear, country),
    staleTime: 5 * 60_000,
  });

  const { data: longWeekends, isLoading: lwLoading } = useQuery({
    queryKey: ["long-weekends", viewYear, country],
    queryFn: () => fetchLongWeekends(viewYear, country),
    staleTime: 5 * 60_000,
  });

  const { data: nextHolidays, isLoading: nextLoading } = useQuery({
    queryKey: ["next-holidays", country],
    queryFn: () => fetchNextHolidays(country),
    staleTime: 5 * 60_000,
  });

  const { data: countries } = useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
    staleTime: 60 * 60_000,
  });

  const holidayMap = useMemo(
    () =>
      holidays ? buildHolidayMap(holidays) : new Map<string, HolidayInfo>(),
    [holidays],
  );

  const longWeekendDates = useMemo(
    () =>
      longWeekends ? buildLongWeekendSet(longWeekends) : new Set<string>(),
    [longWeekends],
  );

  const countryOptions = useMemo(
    () =>
      (countries ?? []).map((c: AvailableCountryOutput) => ({
        label: `${c.name} (${c.countryCode})`,
        value: c.countryCode,
      })),
    [countries],
  );

  const goToPrevMonth = useCallback(() => {
    if (viewMonth === 1) {
      setViewYear((y) => y - 1);
      setViewMonth(12);
    } else {
      setViewMonth((m) => m - 1);
    }
    setSelectedDay(null);
  }, [viewMonth]);

  const goToNextMonth = useCallback(() => {
    if (viewMonth === 12) {
      setViewYear((y) => y + 1);
      setViewMonth(1);
    } else {
      setViewMonth((m) => m + 1);
    }
    setSelectedDay(null);
  }, [viewMonth]);

  const goToToday = useCallback(() => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth() + 1);
    setSelectedDay(today.getDate());
  }, [today]);

  const goToPrevYear = useCallback(() => {
    setViewYear((y) => y - 1);
    setSelectedDay(null);
  }, []);

  const goToNextYear = useCallback(() => {
    setViewYear((y) => y + 1);
    setSelectedDay(null);
  }, []);

  const navigateToDate = useCallback((dateStr: string) => {
    const d = parseDateStr(dateStr);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth() + 1);
    setSelectedDay(d.getDate());
  }, []);

  const days = daysInMonth(viewYear, viewMonth);
  const startDay = firstDayOfWeek(viewYear, viewMonth);

  const prevMonthDays =
    viewMonth === 1
      ? daysInMonth(viewYear - 1, 12)
      : daysInMonth(viewYear, viewMonth - 1);

  const cells: { day: number; isCurrentMonth: boolean }[] = [];
  for (let i = startDay - 1; i >= 0; i--) {
    cells.push({ day: prevMonthDays - i, isCurrentMonth: false });
  }
  for (let d = 1; d <= days; d++) {
    cells.push({ day: d, isCurrentMonth: true });
  }
  let nextDay = 1;
  while (cells.length < GRID_CELLS) {
    cells.push({ day: nextDay++, isCurrentMonth: false });
  }

  const selectedHoliday =
    selectedDay != null
      ? holidayMap.get(dateKey(viewMonth, selectedDay))
      : undefined;

  const isViewingCurrentMonth =
    viewYear === today.getFullYear() && viewMonth === today.getMonth() + 1;

  const monthLabel = new Date(viewYear, viewMonth - 1).toLocaleDateString(
    locale,
    {
      month: "long",
    },
  );

  return (
    <div className="flex h-full select-none">
      {/* ── Main Calendar Area ── */}
      <div className="flex flex-1 flex-col bg-[var(--color-surface-content)]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/6 px-5 pb-3 pt-3 dark:border-transparent">
          <div className="flex items-center gap-1">
            <MonthNavButton onClick={goToPrevYear}>
              <ChevronLeft size={14} />
              <ChevronLeft size={14} className="-ml-2.5" />
            </MonthNavButton>
            <MonthNavButton onClick={goToPrevMonth}>
              <ChevronLeft size={16} />
            </MonthNavButton>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-lg font-semibold text-fg-primary">
              {monthLabel} {viewYear}
            </h1>
            {!isViewingCurrentMonth && (
              <button
                type="button"
                className="cursor-pointer rounded-md bg-red-500/10 px-2.5 py-1 text-xs font-medium text-red-500 transition-colors hover:bg-red-500/20 dark:text-red-400"
                onClick={goToToday}
              >
                {t("goToToday")}
              </button>
            )}
          </div>

          <div className="flex items-center gap-1">
            <MonthNavButton onClick={goToNextMonth}>
              <ChevronRight size={16} />
            </MonthNavButton>
            <MonthNavButton onClick={goToNextYear}>
              <ChevronRight size={14} />
              <ChevronRight size={14} className="-ml-2.5" />
            </MonthNavButton>
          </div>
        </div>

        {/* Weekday headers */}
        <div className="grid grid-cols-7 border-b border-black/4 px-3 dark:border-transparent">
          {weekdayLabels.map((lbl, idx) => (
            <div
              key={lbl}
              className={`flex h-8 items-center justify-center text-xs font-medium ${
                idx === 0 || idx === 6
                  ? "text-red-500/70 dark:text-red-400/70"
                  : "text-fg-muted"
              }`}
            >
              {lbl}
            </div>
          ))}
        </div>

        {/* Day grid */}
        <div className="relative flex-1 px-3 py-1">
          {holidaysLoading && (
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <Spin />
            </div>
          )}
          <div className="grid h-full grid-cols-7 grid-rows-6 gap-px">
            {cells.map((cell, idx) => {
              const key = cell.isCurrentMonth ? `d-${cell.day}` : `e-${idx}`;
              const holiday = cell.isCurrentMonth
                ? holidayMap.get(dateKey(viewMonth, cell.day))
                : undefined;
              const fullDateStr = `${viewYear}-${pad(viewMonth)}-${pad(cell.day)}`;
              const isLW = longWeekendDates.has(fullDateStr);
              const isTodayCell =
                cell.isCurrentMonth &&
                isSameDay(new Date(viewYear, viewMonth - 1, cell.day), today);

              return (
                <DayCell
                  key={key}
                  day={cell.day}
                  isCurrentMonth={cell.isCurrentMonth}
                  isToday={isTodayCell}
                  isWeekendDay={
                    cell.isCurrentMonth &&
                    isWeekend(viewYear, viewMonth, cell.day)
                  }
                  holiday={holiday}
                  isLongWeekend={isLW}
                  isSelected={cell.isCurrentMonth && cell.day === selectedDay}
                  onClick={() => {
                    if (cell.isCurrentMonth) setSelectedDay(cell.day);
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Selected day detail bar */}
        {selectedDay != null && selectedHoliday && (
          <div className="flex items-center gap-3 border-t border-black/6 px-5 py-2.5 dark:border-transparent">
            <CalendarDays
              size={16}
              className="shrink-0 text-red-500 dark:text-red-400"
            />
            <div className="min-w-0 flex-1">
              <span className="text-sm font-medium text-fg-primary">
                {viewMonth}/{selectedDay} — {selectedHoliday.localName}
              </span>
              <span className="ml-2 text-xs text-fg-muted">
                {selectedHoliday.name}
              </span>
            </div>
            <div className="flex gap-1">
              {selectedHoliday.types.map((type) => (
                <span
                  key={type}
                  className="rounded-md bg-red-500/10 px-1.5 py-0.5 text-[10px] font-medium text-red-500 dark:text-red-400"
                >
                  {type}
                </span>
              ))}
              {selectedHoliday.global && (
                <Tooltip title={t("nationwide")}>
                  <span className="flex items-center rounded-md bg-blue-500/10 px-1.5 py-0.5 text-[10px] font-medium text-blue-500">
                    <Globe size={10} className="mr-0.5" />
                    {t("national")}
                  </span>
                </Tooltip>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Sidebar ── */}
      <div className="flex w-[240px] shrink-0 flex-col border-l border-black/6 dark:border-transparent">
        {/* Country selector */}
        <div className="border-b border-black/6 px-3 py-3 dark:border-transparent">
          <Select
            value={country}
            onChange={(val: string) => setCountry(val)}
            options={countryOptions}
            className="w-full"
          />
        </div>

        {/* Today info */}
        <div className="border-b border-black/6 px-4 py-3 dark:border-transparent">
          <p className="text-[40px] font-light leading-none text-red-500 dark:text-red-400">
            {today.getDate()}
          </p>
          <p className="mt-1 text-xs text-fg-muted">
            {today.toLocaleDateString(locale, {
              weekday: "long",
              year: "numeric",
              month: "long",
            })}
          </p>
        </div>

        {/* Upcoming holidays */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-3 pb-1 pt-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted">
              {t("upcomingHolidays")}
            </h3>
          </div>
          <div className="px-1">
            <UpcomingHolidays
              holidays={nextHolidays}
              isLoading={nextLoading}
              locale={locale}
              onNavigate={navigateToDate}
            />
          </div>

          <div className="px-3 pb-1 pt-3">
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-fg-muted">
              {t("longWeekends")} {viewYear}
            </h3>
          </div>
          <div className="px-1 pb-3">
            <LongWeekendsList
              weekends={longWeekends}
              isLoading={lwLoading}
              locale={locale}
              onNavigate={navigateToDate}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
