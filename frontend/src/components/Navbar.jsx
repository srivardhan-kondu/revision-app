import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useAuth();
    const first = user?.name?.[0]?.toUpperCase() || '?';
    const [open, setOpen] = useState(false);
    const menuRef = useRef();

    const location = useLocation();
    const navigate = useNavigate();
    const showBack = location.pathname !== '/dashboard';

    // Close menu when clicking outside
    useEffect(() => {
        const handler = (e) => {
            if (!menuRef.current?.contains(e.target)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    return (
        <nav className="w-full bg-[#0e1425] border-b border-slate-800 px-6 py-3 sticky top-0 z-20">
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                {/* Left: Back + Brand */}
                <div className="flex items-center gap-4">
                    {showBack && (
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center gap-1 text-sm text-slate-300 hover:text-white transition"
                        >
                            ← Back
                        </button>
                    )}

                    <Link to="/dashboard" className="flex items-center gap-2 cursor-pointer">
                        <div className="w-3 h-3 rounded-full bg-[#4d78ff]" />
                        <span className="font-semibold tracking-tight text-lg">MindLoop</span>
                    </Link>
                </div>

                {/* Avatar dropdown */}
                <div className="relative" ref={menuRef}>
                    <button
                        onClick={() => setOpen((prev) => !prev)}
                        className="flex items-center gap-2 text-sm"
                    >
                        <span className="hidden sm:inline text-slate-200">{user?.name}</span>
                        <div className="w-8 h-8 rounded-full bg-[#16213c] border border-slate-600 flex items-center justify-center text-xs font-semibold">
                            {first}
                        </div>
                    </button>

                    {open && (
                        <div className="absolute right-0 mt-2 w-44 rounded-xl bg-[#111b33]/90 backdrop-blur border border-slate-700 shadow-lg py-2 text-sm">
                            <Link
                                to="/dashboard"
                                className="block px-4 py-2 hover:bg-[#1c2548] transition"
                                onClick={() => setOpen(false)}
                            >
                                Dashboard
                            </Link>
                            <Link
                                to="/learn"
                                className="block px-4 py-2 hover:bg-[#1c2548] transition"
                                onClick={() => setOpen(false)}
                            >
                                Study New Topics
                            </Link>
                            <Link
                                to="/calendar"
                                className="block px-4 py-2 hover:bg-[#1c2548] transition"
                                onClick={() => setOpen(false)}
                            >
                                Calendar
                            </Link>
                            <button
                                onClick={() => {
                                    logout();
                                    setOpen(false);
                                }}
                                className="block text-left w-full px-4 py-2 hover:bg-[#1c2548] text-red-300 transition"
                            >
                                Log Out
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
