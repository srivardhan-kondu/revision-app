import { Link, useLocation } from 'react-router-dom';

const FloatingHomeButton = () => {
    const location = useLocation();

    // Don't show on dashboard (already home)
    if (location.pathname === '/dashboard') return null;

    return (
        <Link
            to="/dashboard"
            className="fixed bottom-6 left-6 z-30 inline-flex items-center gap-2 px-3 py-2 rounded-full 
                 bg-[#3569ff] hover:bg-[#3b72ff] text-xs font-medium text-white shadow-lg
                 border border-[#4a7bff]/60 transition-transform hover:-translate-y-0.5"
        >
            <span className="text-sm">🏠</span>
            <span>Home</span>
        </Link>
    );
};

export default FloatingHomeButton;
