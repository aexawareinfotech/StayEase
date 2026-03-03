import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Auth = () => {
    const { login, register, logout, user, role } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [isLogin, setIsLogin] = useState(true);
    const [rememberMe, setRememberMe] = useState(true);
    const [showWelcomeModal, setShowWelcomeModal] = useState(false);

    useEffect(() => {
        if (user) {
            if (role === 'admin') navigate('/admin/dashboard', { replace: true });
            else navigate('/', { replace: true });
        }
    }, [user, role, navigate]);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError('');
        setSuccessMsg('');
        setFormData({
            name: '',
            email: '',
            phone: '',
            password: '',
            confirmPassword: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');

        if (!isLogin) {
            if (formData.password !== formData.confirmPassword) {
                return setError('Passwords do not match');
            }
        }

        setLoading(true);

        try {
            if (isLogin) {
                const res = await login({ email: formData.email, password: formData.password }, rememberMe);
                if (res.success) {
                    if (res.data.role !== 'guest') {
                        logout();
                        setError('Access Denied. Admins must login at /admin/login');
                    } else {
                        navigate('/');
                    }
                }
            } else {
                const registerData = {
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    password: formData.password,
                    role: 'guest'
                };
                const res = await register(registerData);
                if (res.success) {
                    setSuccessMsg('Account created. Please login.');
                    setShowWelcomeModal(true); // Show welcome email preview
                    setIsLogin(true); // Switch to login mode
                    setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
                }
            }
        } catch (err) {
            setError(err.response?.data?.error || (isLogin ? 'Invalid credentials' : 'Registration failed'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
                <div>
                    <h2 className="mt-2 text-center text-4xl font-extrabold text-gray-900 border-b pb-4">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="mt-4 text-center text-sm text-gray-600">
                        {isLogin ? 'Sign in to your StayEase account' : 'Join StayEase for the best booking experience'}
                    </p>
                </div>

                <div className="flex justify-center mb-6">
                    <div className="flex bg-gray-100 rounded-lg p-1">
                        <button
                            type="button"
                            onClick={() => !isLogin && toggleMode()}
                            className={`px-6 py-2 rounded-md text-sm font-medium transition duration-150 ${isLogin ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={() => isLogin && toggleMode()}
                            className={`px-6 py-2 rounded-md text-sm font-medium transition duration-150 ${!isLogin ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            Register
                        </button>
                    </div>
                </div>

                {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4 border border-red-200">{error}</div>}
                {successMsg && <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm mb-4 border border-green-200">{successMsg}</div>}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4 rounded-md shadow-sm -space-y-px">
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-150"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                        <div className={!isLogin ? "pt-2" : ""}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-150"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        {!isLogin && (
                            <div className="pt-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    name="phone"
                                    type="text"
                                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-150"
                                    placeholder="+1 234 567 8900"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                        <div className={!isLogin ? "pt-2" : "pt-4"}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input
                                name="password"
                                type="password"
                                required
                                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-150"
                                placeholder={!isLogin ? "Min 8 chars, 1 number, 1 symbol" : "••••••••"}
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        {!isLogin && (
                            <div className="pt-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm transition duration-150"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                        {isLogin && (
                            <div className="pt-4 flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                                    Remember Me
                                </label>
                            </div>
                        )}
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-md transition duration-150 disabled:bg-blue-300"
                        >
                            {loading ? (isLogin ? 'Signing in...' : 'Registering...') : (isLogin ? 'Sign In' : 'Register')}
                        </button>
                    </div>
                </form>
            </div>

            {showWelcomeModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full transform transition-all duration-300 scale-100">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                                📧 Email Sent (Simulated)
                            </h3>
                            <button onClick={() => setShowWelcomeModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none">&times;</button>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-xl mb-6">
                            <p className="text-sm font-semibold text-gray-700">To: <span className="font-normal">{formData.email}</span></p>
                            <p className="text-sm font-semibold text-gray-700 mt-2">Subject: <span className="font-normal">Welcome to StayEase!</span></p>
                            <hr className="my-3 border-blue-200" />
                            <p className="text-gray-800">
                                "Hello {formData.name}, welcome to StayEase. Your account has been created successfully."
                            </p>
                        </div>
                        <button
                            onClick={() => setShowWelcomeModal(false)}
                            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold py-3 px-4 rounded-xl transition duration-150"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Auth;
