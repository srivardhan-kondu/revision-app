import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const StatCard = ({ label, value, helper, icon, borderColor }) => (
    <div
        className={`flex-1 rounded-2xl bg-[#111b33]/40 backdrop-blur-sm border px-5 py-4 sm:px-6 sm:py-5 shadow-sm ${borderColor}`}
    >
        <div className="flex items-center gap-2 mb-4 sm:mb-5">
            <div className="w-8 h-8 flex items-center justify-center bg-[#1a2646] rounded-xl text-lg">
                {icon}
            </div>
            <span className="text-[11px] sm:text-xs uppercase tracking-wide text-slate-400">
                {label}
            </span>
        </div>
        <div className="text-2xl sm:text-3xl font-semibold mb-1">{value}</div>
        <div className="text-[11px] text-slate-400">{helper}</div>
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // today + upcoming
    const [dueItems, setDueItems] = useState([]);
    const [upcoming, setUpcoming] = useState([]);

    const firstName = useMemo(
        () => (user?.name ? user.name.split(' ')[0] : 'there'),
        [user]
    );

    useEffect(() => {
        const load = async () => {
            try {
                const statsRes = await api.get('/stats/overview');
                setStats(statsRes.data);

                const today = new Date();
                const todayStr = today.toISOString().slice(0, 10);

                // today
                const dueRes = await api.get('/items/due', { params: { date: todayStr } });
                setDueItems(dueRes.data);

                // upcoming next 5 days
                const daysAhead = 5;
                const promises = [];
                for (let i = 1; i <= daysAhead; i++) {
                    const d = new Date(today);
                    d.setDate(d.getDate() + i);
                    const dateStr = d.toISOString().slice(0, 10);
                    promises.push(
                        api
                            .get('/items/due', { params: { date: dateStr } })
                            .then((res) => ({ dateObj: d, dateStr, items: res.data }))
                    );
                }
                const results = await Promise.all(promises);
                const nonEmpty = results.filter((day) => day.items.length > 0);
                setUpcoming(nonEmpty);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleReview = async (id, response) => {
        try {
            await api.post(`/items/${id}/review`, { response });
            setDueItems((prev) => prev.filter((i) => i._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const streak = stats?.streakDays || 0;
    const streakPercent = Math.min(streak / 7, 1);
    const circleDeg = streakPercent * 360;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-6 lg:gap-8">
            {/* LEFT SIDE — streak + stats + actions + activity */}
            <div className="space-y-8 lg:space-y-10">
                {/* Welcome + streak */}
                <div className="flex flex-col items-center text-center space-y-5 mb-2">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-semibold">
                            Welcome back, {firstName}
                        </h1>
                        <p className="text-sm text-slate-400 mt-1">
                            Keep your learning streak alive!
                        </p>
                    </div>

                    {/* ring-style streak */}
                    <div className="relative flex items-center justify-center w-32 h-32 sm:w-40 sm:h-40">
                        {/* Outer ring */}
                        <div
                            className="absolute inset-0 rounded-full border border-slate-900 shadow-xl"
                            style={{
                                backgroundImage: `conic-gradient(#22c55e ${circleDeg}deg, rgba(148,163,184,0.18) ${circleDeg}deg)`
                            }}
                        />
                        {/* Inner circle */}
                        <div className="absolute inset-4 rounded-full bg-[#0f1629] border border-slate-800 flex flex-col items-center justify-center">
                            <span className="text-2xl sm:text-3xl font-semibold text-emerald-400">
                                {streak}
                            </span>
                            <span className="text-[11px] text-slate-400">day streak</span>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
                        <StatCard
                            label="Due Today"
                            value={stats?.dueToday ?? 0}
                            helper="cards to review"
                            icon="🗂️"
                            borderColor="border-[#4267ff]/40"
                        />
                        <StatCard
                            label="Completed"
                            value={stats?.reviewedToday ?? 0}
                            helper="cards today"
                            icon="✔️"
                            borderColor="border-[#22c55e]/40"
                        />
                        <StatCard
                            label="Total Topics"
                            value={stats?.totalTopics ?? 0}
                            helper="in your deck"
                            icon="⭐"
                            borderColor="border-[#ffb74a]/40"
                        />
                    </div>
                )}

                {/* Quick Actions */}
                <div className="rounded-2xl bg-[#111b33]/50 border border-slate-800 px-4 py-4 sm:px-6 sm:py-5 flex flex-col gap-3 sm:gap-4 backdrop-blur-sm shadow-md">
                    <span className="text-[11px] sm:text-xs uppercase tracking-wide text-slate-400 mb-1">
                        Quick Actions
                    </span>
                    <Link
                        to="/learn"
                        className="w-full rounded-xl bg-[#3569ff] hover:bg-[#3b72ff] text-sm font-medium text-white py-2.5 text-center transition"
                    >
                        + Study New Topics
                    </Link>
                    <Link
                        to="/calendar"
                        className="w-full rounded-xl bg-[#1d233e] hover:bg-[#232b4c] border border-slate-700 py-2.5 text-sm text-slate-200 text-center transition"
                    >
                        🗓 View Calendar
                    </Link>
                </div>

                {/* Recent activity */}
                {!loading && (
                    <div className="rounded-2xl bg-[#111b33]/45 border border-slate-800 px-4 py-5 sm:px-6 sm:py-6 backdrop-blur-sm shadow-md">
                        <div className="text-sm font-medium mb-1">Recent Activity</div>
                        <p className="text-xs text-slate-400 mb-4">
                            {stats?.reviewedToday
                                ? `Revised ${stats.reviewedToday} topics — great progress today!`
                                : 'No revision yet today — even a small session keeps your streak alive.'}
                        </p>

                        <div className="w-full h-2 rounded-full bg-[#1a2542] overflow-hidden">
                            <div
                                className="h-full bg-[#3569ff] transition-all"
                                style={{
                                    width: `${Math.min((streak / 7) * 100, 100)}%`
                                }}
                            />
                        </div>
                        <p className="text-[11px] text-slate-400 mt-2">
                            {streak}/7 days completed this week
                        </p>
                    </div>
                )}
            </div>

            {/* RIGHT SIDE — TODAY + UPCOMING */}
            <div className="rounded-2xl bg-[#111b33]/60 border border-slate-800 px-4 py-5 sm:px-5 backdrop-blur-sm shadow-md space-y-4 max-h-[480px] lg:max-h-none lg:overflow-y-auto lg:h-[calc(100vh-140px)] lg:sticky lg:top-[90px]">
                {/* Today's revision */}
                <div>
                    <h2 className="text-sm font-semibold">Today's Revision</h2>
                    <p className="text-xs text-slate-400 mb-2">
                        Tap the button that matches what you remember.
                    </p>

                    {dueItems.length === 0 ? (
                        <p className="text-xs text-slate-400 mt-4">
                            You're all done for today. Anything new you study will be scheduled
                            automatically.
                        </p>
                    ) : (
                        dueItems.map((item) => {
                            const plannedOn = new Date(item.createdAt).toLocaleDateString();
                            return (
                                <div
                                    key={item._id}
                                    className="mb-3 p-3 rounded-xl bg-[#10172a] border border-slate-800 text-sm"
                                >
                                    <div className="text-[11px] text-slate-400">
                                        {item.subjectId?.name}
                                    </div>
                                    <div className="font-medium">{item.title}</div>

                                    {item.description && (
                                        <div className="text-xs text-slate-300 mt-1 whitespace-pre-wrap">
                                            {item.description}
                                        </div>
                                    )}

                                    <div className="text-[11px] text-slate-500 mt-1">
                                        Planned on: {plannedOn}
                                    </div>

                                    <div className="mt-3 flex flex-col gap-2 text-xs">
                                        <button
                                            onClick={() => handleReview(item._id, 'remembered')}
                                            className="w-full rounded-xl bg-[#22c55e] hover:bg-[#35d36d] text-slate-950 py-2 font-medium transition"
                                        >
                                            I remembered this well
                                        </button>
                                        <button
                                            onClick={() => handleReview(item._id, 'okay')}
                                            className="w-full rounded-xl bg-[#f3f4ff] hover:bg-white text-slate-900 py-2 font-medium transition"
                                        >
                                            I kind of remember
                                        </button>
                                        <button
                                            onClick={() => handleReview(item._id, 'forgot')}
                                            className="w-full rounded-xl bg-[#111729] hover:bg-[#151d33] border border-slate-700 text-slate-100 py-2 font-medium transition"
                                        >
                                            I forgot this
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Upcoming revisions */}
                <div className="pt-3 border-t border-slate-800/70">
                    <h3 className="text-sm font-semibold mb-2">Upcoming</h3>
                    <p className="text-xs text-slate-400 mb-2">
                        A quick peek at the next few days. Tap a day to see full details.
                    </p>

                    {upcoming.length === 0 ? (
                        <p className="text-xs text-slate-400">
                            As you keep adding topics, we’ll spread them across the week so your
                            load stays manageable.
                        </p>
                    ) : (
                        <div className="space-y-2 text-xs">
                            {upcoming.map((day) => {
                                const labelDate = day.dateObj.toLocaleDateString(undefined, {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric'
                                });
                                const count = day.items.length;
                                const previewTitles = day.items
                                    .slice(0, 2)
                                    .map((i) => i.title)
                                    .join(' · ');

                                return (
                                    <button
                                        key={day.dateStr}
                                        onClick={() => navigate(`/revise?date=${day.dateStr}`)}
                                        className="w-full text-left rounded-xl bg-[#10172a] border border-slate-800 px-3 py-2 hover:bg-[#151d33] transition"
                                    >
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="text-slate-100">{labelDate}</span>
                                            <span className="text-slate-300">
                                                {count} topic{count > 1 ? 's' : ''}
                                            </span>
                                        </div>
                                        <div className="text-[11px] text-slate-400 truncate">
                                            {previewTitles}
                                            {count > 2 && ' …'}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
