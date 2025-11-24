import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../api/axios';

const formatDateInput = (date) => {
    const d = new Date(date);
    return d.toISOString().slice(0, 10);
};

const Revise = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [date, setDate] = useState(() => {
        const param = searchParams.get('date');
        return param || formatDateInput(new Date());
    });
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [info, setInfo] = useState('');

    const fetchItems = async (targetDate) => {
        try {
            setLoading(true);
            setInfo('');
            const res = await api.get('/items/due', { params: { date: targetDate } });
            setItems(res.data);
            if (!res.data.length) {
                setInfo('No topics to revise on this day.');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems(date);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [date]);

    const handleDateChange = (e) => {
        const val = e.target.value;
        setDate(val);
        setSearchParams({ date: val });
    };

    const handleReview = async (id, response) => {
        try {
            const res = await api.post(`/items/${id}/review`, { response });
            const updated = res.data;
            const nextGapDays =
                (new Date(updated.nextReview) - new Date()) / (1000 * 60 * 60 * 24);

            setItems((prev) => prev.filter((i) => i._id !== id));
            if (items.length === 1) {
                setInfo(
                    "You’ve cleared today’s revision. Anything new you study now will be handled by MindLoop."
                );
            } else {
                setInfo(
                    `Nice. We’ll show this one again in about ${Math.round(
                        nextGapDays
                    )} day(s).`
                );
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-semibold">Time to revise</h1>
                    <p className="text-sm text-slate-400 mt-1">
                        These are the topics your future self will thank you for.
                    </p>
                </div>

                <div className="flex items-center gap-3 text-sm">
                    <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-slate-400">Choose day</span>
                        <input
                            type="date"
                            value={date}
                            onChange={handleDateChange}
                            className="rounded-xl bg-[#111729] border border-slate-700 px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#3569ff]"
                        />
                    </div>
                </div>
            </div>

            <Link
                to="/dashboard"
                className="inline-flex sm:hidden items-center gap-2 text-xs bg-[#111b33]/60 border border-slate-800 px-3 py-1.5 rounded-lg hover:bg-[#1a2344] transition text-slate-200"
            >
                ← Back to Dashboard
            </Link>

            {loading ? (
                <div className="text-sm text-slate-400">Loading your topics…</div>
            ) : (
                <>
                    {info && (
                        <div className="rounded-2xl bg-[#111b33]/60 border border-slate-800 px-4 py-3 text-sm text-slate-200">
                            {info}
                        </div>
                    )}

                    {items.length === 0 && (
                        <p className="text-sm text-slate-400">
                            As you keep adding topics, MindLoop will spread them across days
                            to protect your memory.
                        </p>
                    )}

                    <div className="space-y-4">
                        {items.map((item) => {
                            const plannedOn = new Date(item.createdAt);
                            return (
                                <div
                                    key={item._id}
                                    className="rounded-2xl bg-[#111b33]/70 border border-slate-800 px-4 py-4 sm:px-5 sm:py-4 shadow-sm backdrop-blur-sm text-sm"
                                >
                                    <div className="flex flex-col gap-2">
                                        <div>
                                            <div className="text-[11px] text-slate-400 mb-1">
                                                {item.subjectId?.name || 'Topic'}
                                            </div>
                                            <div className="font-medium">{item.title}</div>
                                        </div>

                                        {item.description && (
                                            <div className="text-xs text-slate-300 whitespace-pre-wrap mt-1">
                                                {item.description}
                                            </div>
                                        )}

                                        <div className="text-[11px] text-slate-500 mt-2">
                                            Planned on: {plannedOn.toLocaleDateString()}
                                        </div>
                                    </div>

                                    <div className="mt-4 flex flex-col sm:flex-row gap-2 text-xs">
                                        <button
                                            type="button"
                                            onClick={() => handleReview(item._id, 'remembered')}
                                            className="flex-1 rounded-xl bg-[#22c55e] hover:bg-[#35d36d] text-slate-950 py-2 font-medium transition"
                                        >
                                            I remembered this well
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleReview(item._id, 'okay')}
                                            className="flex-1 rounded-xl bg-[#f3f4ff] hover:bg-white text-slate-900 py-2 font-medium transition"
                                        >
                                            I kind of remember
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleReview(item._id, 'forgot')}
                                            className="flex-1 rounded-xl bg-[#111729] hover:bg-[#151d33] border border-slate-700 text-slate-100 py-2 font-medium transition"
                                        >
                                            I forgot this
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default Revise;
