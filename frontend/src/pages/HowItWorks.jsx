// frontend/src/pages/HowItWorks.jsx
import { Link } from 'react-router-dom';

const HowItWorks = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between gap-3">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-semibold">
                        How MindLoop helps your brain remember
                    </h1>
                    <p className="text-sm text-slate-400 mt-2 max-w-xl">
                        This isn&apos;t magic. It&apos;s a simple scheduling system
                        built on how memory actually works: forgetting, revisiting,
                        and gradually spacing things out.
                    </p>
                </div>

                <Link
                    to="/dashboard"
                    className="hidden sm:inline-flex items-center gap-2 text-xs bg-[#111b33]/60 border border-slate-800 px-3 py-1.5 rounded-lg hover:bg-[#1a2344] transition text-slate-200"
                >
                    ← Back to dashboard
                </Link>
            </div>

            {/* Section 1: what happens in the brain */}
            <section className="rounded-2xl bg-[#111b33]/70 border border-slate-800 px-5 py-5 backdrop-blur-sm shadow-md space-y-3">
                <h2 className="text-lg font-semibold">1. What actually happens when you learn?</h2>
                <p className="text-sm text-slate-300">
                    When you study a topic, brain cells form or strengthen connections
                    (synapses). Right after learning, that connection is fragile.
                    If you don&apos;t touch the idea again, your brain labels it as
                    &quot;probably not important&quot; and it fades. This is why you
                    can feel confident today and blank out a week later.
                </p>
                <p className="text-sm text-slate-300">
                    The goal is not to cram information once, but to tell your brain:
                    &quot;Hey, this topic matters. Keep it.&quot; The most reliable way
                    to do that is to see the same idea a few times, with smart gaps in
                    between.
                </p>
            </section>

            {/* Section 2: spacing vs cramming */}
            <section className="rounded-2xl bg-[#111b33]/70 border border-slate-800 px-5 py-5 backdrop-blur-sm shadow-md space-y-4">
                <h2 className="text-lg font-semibold">2. Why spacing beats cramming</h2>
                <p className="text-sm text-slate-300">
                    If you revise the same day you learned something, you feel
                    confident but you&apos;re mostly just re-reading what is still
                    fresh. Your brain doesn&apos;t get a strong &quot;keep this&quot;
                    signal.
                </p>
                <p className="text-sm text-slate-300">
                    When you wait a little and almost start to forget, revisiting the
                    topic is harder. That slight effort is exactly what strengthens the
                    memory. Over time, you can push the topic further and further into
                    the future and still remember it.
                </p>

                <div className="mt-3">
                    <p className="text-xs uppercase tracking-wide text-slate-400 mb-2">
                        The schedule MindLoop uses
                    </p>
                    <div className="flex flex-wrap gap-2 text-xs">
                        {[
                            { gap: '1 day', label: 'Stage 0 → 1' },
                            { gap: '3 days', label: 'Stage 1 → 2' },
                            { gap: '7 days', label: 'Stage 2 → 3' },
                            { gap: '15 days', label: 'Stage 3 → 4' },
                            { gap: '30 days', label: 'Stage 4 → 5' },
                            { gap: '90 days', label: 'Stage 5 (long term)' }
                        ].map((step) => (
                            <div
                                key={step.label}
                                className="flex-1 min-w-[130px] rounded-xl border border-slate-700 bg-[#0f1629] px-3 py-2"
                            >
                                <div className="text-slate-200">{step.gap}</div>
                                <div className="text-[11px] text-slate-400">{step.label}</div>
                            </div>
                        ))}
                    </div>
                    <p className="text-[11px] text-slate-400 mt-2">
                        New topics start at Stage 0. Every successful revision moves
                        them to the next stage, which means a longer gap before the
                        next review.
                    </p>
                </div>
            </section>

            {/* Section 3: what MindLoop actually does */}
            <section className="rounded-2xl bg-[#111b33]/70 border border-slate-800 px-5 py-5 backdrop-blur-sm shadow-md space-y-4">
                <h2 className="text-lg font-semibold">3. What MindLoop is doing for you</h2>

                <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2 text-sm text-slate-300">
                        <h3 className="text-sm font-semibold text-slate-100">
                            When you add a topic
                        </h3>
                        <ul className="list-disc list-inside space-y-1 text-[13px] text-slate-300">
                            <li>You tell the app what you studied and which subject it belongs to.</li>
                            <li>
                                MindLoop sets the topic to <span className="font-semibold">Stage 0</span> and
                                schedules its first revision for tomorrow (1 day later).
                            </li>
                            <li>
                                You don&apos;t have to think about dates. The topic automatically joins your
                                future revision queue.
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-2 text-sm text-slate-300">
                        <h3 className="text-sm font-semibold text-slate-100">
                            When you revise a topic
                        </h3>
                        <ul className="list-disc list-inside space-y-1 text-[13px] text-slate-300">
                            <li>
                                You see simple options: <span className="italic">I remembered this well</span>,
                                <span className="italic"> I kind of remember</span>, or{' '}
                                <span className="italic">I forgot this</span>.
                            </li>
                            <li>
                                Based on your choice, the topic moves to an easier or harder stage, and the{' '}
                                <span className="font-semibold">next revision date</span> is adjusted.
                            </li>
                            <li>
                                Strong topics slowly move out to 15, 30, then 90 days. Weak topics come back
                                sooner so they don&apos;t slip away.
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="text-sm text-slate-300">
                    <h3 className="text-sm font-semibold text-slate-100 mb-1">
                        What this means for your exam prep
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-[13px]">
                        <li>Your daily revision list stays manageable instead of exploding at the end.</li>
                        <li>
                            You&apos;re always revising topics at the moment they are about to fade, which is the
                            most efficient time to restudy.
                        </li>
                        <li>
                            Over weeks and months, more of your syllabus moves into true long-term memory, which
                            lowers stress before exams.
                        </li>
                    </ul>
                </div>
            </section>

            {/* Transparency section */}
            <section className="rounded-2xl bg-[#0f1527]/80 border border-slate-800 px-5 py-5 backdrop-blur-sm shadow-md space-y-3">
                <h2 className="text-lg font-semibold">4. What MindLoop is and isn&apos;t</h2>
                <p className="text-sm text-slate-300">
                    MindLoop doesn&apos;t use complicated AI to guess your memory. Instead, it uses a simple,
                    science-inspired schedule that is easy to understand and predictable. You always know why a topic
                    is showing up today.
                </p>
                <ul className="list-disc list-inside space-y-1 text-[13px] text-slate-300">
                    <li>It&apos;s not a medical tool and it doesn&apos;t diagnose learning issues.</li>
                    <li>
                        It is a planning tool that respects how human memory usually behaves: new → shaky → stronger → stable.
                    </li>
                    <li>
                        If you keep showing up for short daily sessions, the system quietly takes care of when to
                        bring things back.
                    </li>
                </ul>
                <p className="text-sm text-slate-200 mt-2">
                    In short: <span className="font-semibold">you handle what to study</span>, and MindLoop handles
                    <span className="font-semibold"> when to see it again</span>.
                </p>
            </section>

            <div className="flex justify-center">
                <Link
                    to="/dashboard"
                    className="inline-flex items-center justify-center rounded-xl bg-[#3569ff] hover:bg-[#3b72ff] text-sm font-medium text-white px-5 py-2.5 transition"
                >
                    Got it — take me back to my plan
                </Link>
            </div>
        </div>
    );
};

export default HowItWorks;
