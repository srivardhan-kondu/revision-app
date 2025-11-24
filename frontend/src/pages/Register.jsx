import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await register(form.name, form.email, form.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950">
            <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-lg">
                <h1 className="text-xl font-semibold mb-2">Create your account</h1>
                <p className="text-sm text-slate-400 mb-6">
                    Tell the app what you study. It will remind you when to revise.
                </p>

                {error && (
                    <div className="mb-4 text-sm text-red-400 bg-red-950/40 border border-red-900 rounded p-2">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm mb-1">Name</label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-slate-600"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Email</label>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-slate-600"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm mb-1">Password</label>
                        <input
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-slate-600"
                            required
                        />
                    </div>
                    <button
                        disabled={loading}
                        className="w-full mt-2 bg-slate-100 text-slate-900 py-2 rounded-md text-sm font-medium hover:bg-white disabled:opacity-60"
                    >
                        {loading ? 'Creating account…' : 'Create account'}
                    </button>
                </form>

                <p className="mt-4 text-xs text-slate-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-slate-100 underline">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
