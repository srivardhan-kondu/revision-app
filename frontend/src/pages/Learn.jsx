import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const Learn = () => {
    const [subjects, setSubjects] = useState([]);
    const [subjectName, setSubjectName] = useState('');
    const [selectedSubjectId, setSelectedSubjectId] = useState('');
    const [topicTitle, setTopicTitle] = useState('');
    const [description, setDescription] = useState('');
    const [sessionItems, setSessionItems] = useState([]);
    const [loadingSubjects, setLoadingSubjects] = useState(true);
    const [savingTopic, setSavingTopic] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const fetchSubjects = async () => {
        try {
            setLoadingSubjects(true);
            const res = await api.get('/subjects');
            setSubjects(res.data);
            if (res.data.length && !selectedSubjectId) {
                setSelectedSubjectId(res.data[0]._id);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingSubjects(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleAddSubject = async () => {
        try {
            setError('');
            if (!subjectName.trim()) return;
            const res = await api.post('/subjects', { name: subjectName.trim() });
            setSubjects((prev) => [...prev, res.data]);
            setSelectedSubjectId(res.data._id);
            setSubjectName('');
        } catch (err) {
            setError(err.response?.data?.message || 'Could not add subject.');
        }
    };

    const handleSaveTopic = async () => {
        try {
            setError('');
            setMessage('');
            if (!selectedSubjectId || !topicTitle.trim()) {
                setError('Please choose a subject and enter a topic name.');
                return;
            }
            setSavingTopic(true);
            const res = await api.post('/items', {
                subjectId: selectedSubjectId,
                title: topicTitle.trim(),
                description: description.trim() || undefined
            });
            setSessionItems((prev) => [...prev, res.data]);
            setTopicTitle('');
            setDescription('');
            const nextDate = new Date(res.data.nextReview);
            setMessage(
                `Saved. We’ll show this again on ${nextDate.toLocaleDateString()}.`
            );
        } catch (err) {
            setError(err.response?.data?.message || 'Could not save topic.');
        } finally {
            setSavingTopic(false);
        }
    };

    return (
        <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header + Back */}
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-semibold">
                        Log what you studied
                    </h1>
                    <p className="text-sm text-slate-400 mt-1">
                        Just tell MindLoop what you covered today. It will remember when to
                        bring it back.
                    </p>
                </div>
                <Link
                    to="/dashboard"
                    className="hidden sm:inline-flex items-center gap-2 text-xs bg-[#111b33]/60 border border-slate-800 px-3 py-1.5 rounded-lg hover:bg-[#1a2344] transition text-slate-200"
                >
                    ← Back to Dashboard
                </Link>
            </div>

            {/* alerts */}
            {error && (
                <div className="rounded-xl border border-red-500/40 bg-red-950/40 px-4 py-3 text-sm text-red-200">
                    {error}
                </div>
            )}
            {message && (
                <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-200">
                    {message}
                </div>
            )}

            {/* main grid */}
            <div className="grid gap-4 lg:gap-6 grid-cols-1 lg:grid-cols-[1.05fr_1.6fr]">
                {/* Subject card */}
                <div className="rounded-2xl bg-[#111b33]/60 border border-slate-800 px-4 py-4 sm:px-5 sm:py-5 backdrop-blur-sm shadow-md space-y-4">
                    <div>
                        <h2 className="text-sm font-semibold">Subject</h2>
                        <p className="text-xs text-slate-400 mt-1">
                            Pick a subject or add a new one.
                        </p>
                    </div>

                    {loadingSubjects ? (
                        <div className="text-xs text-slate-400">Loading subjects…</div>
                    ) : (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">
                                    Choose existing
                                </label>
                                <select
                                    value={selectedSubjectId}
                                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                                    className="w-full rounded-xl bg-[#111729] border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#3569ff]"
                                >
                                    <option value="">Select subject</option>
                                    {subjects.map((s) => (
                                        <option key={s._id} value={s._id}>
                                            {s.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs text-slate-400 mb-1">
                                    Or add a new subject
                                </label>
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <input
                                        placeholder="e.g. Biochemistry"
                                        value={subjectName}
                                        onChange={(e) => setSubjectName(e.target.value)}
                                        className="flex-1 rounded-xl bg-[#111729] border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#3569ff]"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddSubject}
                                        className="px-4 py-2 rounded-xl text-xs font-medium bg-[#1d2544] hover:bg-[#232c4e] border border-slate-700 text-slate-100 transition"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Topic card */}
                <div className="rounded-2xl bg-[#111b33]/60 border border-slate-800 px-4 py-4 sm:px-5 sm:py-5 backdrop-blur-sm shadow-md space-y-4">
                    <div>
                        <h2 className="text-sm font-semibold">Topic</h2>
                        <p className="text-xs text-slate-400 mt-1">
                            Capture the chapter and a few key points. MindLoop will handle the
                            timing.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs text-slate-400 mb-1">
                                Topic or chapter name
                            </label>
                            <input
                                placeholder="e.g. Urea cycle – steps and regulation"
                                value={topicTitle}
                                onChange={(e) => setTopicTitle(e.target.value)}
                                className="w-full rounded-xl bg-[#111729] border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#3569ff]"
                            />
                        </div>

                        <div>
                            <label className="block text-xs text-slate-400 mb-1">
                                Notes / key points / mnemonics (optional)
                            </label>
                            <textarea
                                placeholder="Add a few key points or mnemonics (optional)"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="w-full rounded-xl bg-[#111729] border border-slate-700 px-3 py-2 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#3569ff] resize-none"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={handleSaveTopic}
                            disabled={savingTopic}
                            className="w-full rounded-xl bg-[#3569ff] hover:bg-[#3b72ff] text-sm font-medium text-white py-2.5 transition disabled:opacity-60"
                        >
                            {savingTopic ? 'Saving…' : 'Save this topic'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Session items card */}
            {sessionItems.length > 0 && (
                <div className="rounded-2xl bg-[#111b33]/60 border border-slate-800 px-4 py-4 sm:px-5 sm:py-4 backdrop-blur-sm shadow-md">
                    <h3 className="text-sm font-semibold mb-2">
                        Topics you added this session
                    </h3>
                    <ul className="space-y-2 text-xs text-slate-200">
                        {sessionItems.map((item) => {
                            const nextDate = new Date(item.nextReview);
                            return (
                                <li
                                    key={item._id}
                                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-slate-800/70 last:border-0 pb-2 last:pb-0 gap-1"
                                >
                                    <span>{item.title}</span>
                                    <span className="text-slate-400">
                                        First revision: {nextDate.toLocaleDateString()}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Learn;
