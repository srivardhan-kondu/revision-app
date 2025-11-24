import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const getMonthBounds = (year, monthIndex) => {
    const from = new Date(year, monthIndex, 1);
    const to = new Date(year, monthIndex + 1, 0);
    return { from, to };
};

const formatYmd = (date) => date.toISOString().slice(0, 10);

const CalendarPage = () => {
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());
    const [load, setLoad] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchCalendar = async (y, m) => {
        try {
            setLoading(true);
            const { from, to } = getMonthBounds(y, m);
            const res = await api.get('/items/calendar', {
                params: { from: formatYmd(from), to: formatYmd(to) }
            });
            setLoad(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCalendar(year, month);
    }, [year, month]);

    const handleMonthChange = (delta) => {
        let newMonth = month + delta;
        let newYear = year;
        if (newMonth < 0) {
            newMonth = 11;
            newYear -= 1;
        } else if (newMonth > 11) {
            newMonth = 0;
            newYear += 1;
        }
        setYear(newYear);
        setMonth(newMonth);
    };

    const monthName = new Intl.DateTimeFormat('en', {
        month: 'long'
    }).format(new Date(year, month, 1));

    const firstDay = new Date(year, month, 1).getDay(); // 0=Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells = [];
    const offset = (firstDay + 6) % 7; // Monday first

    for (let i = 0; i < offset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
        cells.push(new Date(year, month, d));
    }

    const isToday = (date) =>
        date &&
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate();

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-semibold">
                        Revision calendar
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                        See how your revision load is spread across the month.
                    </p>
                </div>

                <div className="flex items-center gap-2 text-sm">
                    <button
                        type="button"
                        onClick={() => handleMonthChange(-1)}
                        className="px-3 py-1.5 rounded-xl bg-[#111729] border border-slate-700 text-xs hover:bg-[#151d33]"
                    >
                        ‹
                    </button>
                    <span className="text-sm text-slate-100 min-w-[130px] text-center">
                        {monthName} {year}
                    </span>
                    <button
                        type="button"
                        onClick={() => handleMonthChange(1)}
                        className="px-3 py-1.5 rounded-xl bg-[#111729] border border-slate-700 text-xs hover:bg-[#151d33]"
                    >
                        ›
                    </button>
                </div>
            </div>

            {/* calendar card */}
            <div className="rounded-2xl bg-[#111b33]/60 border border-slate-800 px-3 py-4 sm:px-5 sm:py-5 backdrop-blur-sm shadow-md">
                {loading ? (
                    <div className="text-sm text-slate-400">Loading calendar…</div>
                ) : (
                    <>
                        <div className="grid grid-cols-7 text-[10px] sm:text-[11px] text-slate-400 mb-2 sm:mb-3 gap-y-1">
                            <div>Mon</div>
                            <div>Tue</div>
                            <div>Wed</div>
                            <div>Thu</div>
                            <div>Fri</div>
                            <div>Sat</div>
                            <div>Sun</div>
                        </div>

                        <div className="grid grid-cols-7 gap-1 sm:gap-1.5 text-[11px] sm:text-xs">
                            {cells.map((date, idx) => {
                                if (!date) {
                                    return (
                                        <div
                                            key={idx}
                                            className="h-12 sm:h-16 rounded-xl bg-transparent"
                                        />
                                    );
                                }
                                const ymd = formatYmd(date);
                                const count = load[ymd] || 0;
                                const heavy = count >= 8;
                                const medium = count >= 4 && count < 8;

                                let bg = '#101529';
                                if (heavy) bg = '#192448';
                                else if (medium) bg = '#151d3a';

                                const borderClass = isToday(date)
                                    ? 'border-[#3569ff]'
                                    : 'border-slate-700';

                                return (
                                    <button
                                        key={idx}
                                        type="button"
                                        disabled={count === 0}
                                        onClick={() => {
                                            if (count > 0) navigate(`/revise?date=${ymd}`);
                                        }}
                                        className={`h-12 sm:h-16 rounded-xl border ${borderClass} px-1.5 sm:px-2 py-1 flex flex-col justify-between text-left transition ${count > 0
                                                ? 'hover:border-[#4a7bff] hover:bg-[#1a2344]'
                                                : 'opacity-60'
                                            }`}
                                        style={{ backgroundColor: bg }}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11px] sm:text-xs text-slate-100">
                                                {date.getDate()}
                                            </span>
                                            {isToday(date) && (
                                                <span className="text-[9px] sm:text-[10px] text-[#69a6ff]">
                                                    Today
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-[9px] sm:text-[11px] text-slate-300">
                                            {count === 0
                                                ? '—'
                                                : `${count} topic${count > 1 ? 's' : ''}`}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default CalendarPage;
