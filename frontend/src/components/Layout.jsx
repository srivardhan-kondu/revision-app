import Navbar from './Navbar';
import FloatingHomeButton from './FloatingHomeButton';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen flex flex-col text-slate-100">
            {/* Background gradient */}
            <div className="fixed inset-0 -z-10 bg-[#0c1222]" />
            <div className="fixed inset-0 -z-10 bg-gradient-to-b from-[#0c1222] to-[#111c35]" />

            {/* subtle blob lights */}
            <div className="pointer-events-none fixed inset-0 -z-10">
                <div className="absolute -left-32 bottom-0 w-72 h-72 rounded-full bg-[#1c2240]/40 blur-[120px]" />
                <div className="absolute -right-20 bottom-6 w-72 h-72 rounded-full bg-[#1f234c]/40 blur-[130px]" />
            </div>

            <Navbar />

            <main className="flex-1 px-6 py-10 max-w-6xl mx-auto">{children}</main>

            {/* floating home button */}
            <FloatingHomeButton />
        </div>
    );
};

export default Layout;
