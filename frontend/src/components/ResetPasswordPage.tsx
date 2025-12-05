import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, Sparkles, Check, X } from 'lucide-react';
import showToast from './Toast';

export default function ResetPasswordPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resetComplete, setResetComplete] = useState(false);

    // Password strength calculation
    const getPasswordStrength = (pwd: string): { score: number; label: string; color: string } => {
        let score = 0;
        if (pwd.length >= 6) score++;
        if (pwd.length >= 10) score++;
        if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
        if (/\d/.test(pwd)) score++;
        if (/[^a-zA-Z\d]/.test(pwd)) score++;

        if (score <= 1) return { score, label: 'Weak', color: 'bg-red-500' };
        if (score <= 3) return { score, label: 'Fair', color: 'bg-yellow-500' };
        if (score <= 4) return { score, label: 'Good', color: 'bg-blue-500' };
        return { score, label: 'Strong', color: 'bg-green-500' };
    };

    const passwordStrength = getPasswordStrength(password);

    // Password requirements
    const requirements = [
        { label: 'At least 6 characters', met: password.length >= 6 },
        { label: 'Contains uppercase & lowercase', met: /[a-z]/.test(password) && /[A-Z]/.test(password) },
        { label: 'Contains a number', met: /\d/.test(password) },
        { label: 'Passwords match', met: password === confirmPassword && password.length > 0 },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!token) {
            showToast.error('Invalid reset link');
            return;
        }

        if (!password || !confirmPassword) {
            showToast.error('Please fill in all fields');
            return;
        }

        if (password.length < 6) {
            showToast.error('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            showToast.error('Passwords do not match');
            return;
        }

        setLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setLoading(false);
        setResetComplete(true);
        showToast.success('Password reset successfully!');

        // Redirect to login after 3 seconds
        setTimeout(() => {
            navigate('/login');
        }, 3000);
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0A0A0F] via-[#1A1A2E] to-[#0A0A0F] flex items-center justify-center p-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-4">Invalid Reset Link</h1>
                    <p className="text-white/60 mb-6">This password reset link is invalid or has expired.</p>
                    <Link
                        to="/forgot-password"
                        className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-semibold"
                    >
                        Request New Link
                    </Link>
                </div>
            </div>
        );
    }

    if (resetComplete) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0A0A0F] via-[#1A1A2E] to-[#0A0A0F] flex items-center justify-center p-4">
                {/* Animated background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                <div className="w-full max-w-md relative z-10 text-center">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6">
                        <CheckCircle className="w-10 h-10 text-green-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-4">
                        Password Reset Successfully!
                    </h1>
                    <p className="text-white/60 mb-8">
                        Your password has been updated. Redirecting to login...
                    </p>
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0A0A0F] via-[#1A1A2E] to-[#0A0A0F] flex items-center justify-center p-4">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-cyan to-neon-purple mb-4">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Reset Your Password
                    </h1>
                    <p className="text-white/60">
                        Enter your new password below
                    </p>
                </div>

                {/* Form Card */}
                <div className="glass-effect border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* New Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                New Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-11 pr-12 py-3 text-white placeholder-white/40 focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 transition-all"
                                    placeholder="••••••••"
                                    disabled={loading}
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Password Strength Indicator */}
                            {password && (
                                <div className="mt-2">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs text-white/60">Password Strength</span>
                                        <span className={`text-xs font-medium ${passwordStrength.score <= 1 ? 'text-red-400' :
                                                passwordStrength.score <= 3 ? 'text-yellow-400' :
                                                    passwordStrength.score <= 4 ? 'text-blue-400' :
                                                        'text-green-400'
                                            }`}>
                                            {passwordStrength.label}
                                        </span>
                                    </div>
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={`h-1 flex-1 rounded-full transition-all ${i < passwordStrength.score
                                                        ? passwordStrength.color
                                                        : 'bg-white/10'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-11 pr-12 py-3 text-white placeholder-white/40 focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 transition-all"
                                    placeholder="••••••••"
                                    disabled={loading}
                                />
                                {confirmPassword && (
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        {password === confirmPassword ? (
                                            <Check className="w-5 h-5 text-green-400" />
                                        ) : (
                                            <X className="w-5 h-5 text-red-400" />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Password Requirements */}
                        <div className="bg-white/5 rounded-lg p-4 space-y-2">
                            <p className="text-xs font-medium text-white/80 mb-2">Password must:</p>
                            {requirements.map((req, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${req.met ? 'bg-green-500/20' : 'bg-white/10'
                                        }`}>
                                        {req.met && <Check className="w-3 h-3 text-green-400" />}
                                    </div>
                                    <span className={`text-xs ${req.met ? 'text-green-400' : 'text-white/60'}`}>
                                        {req.label}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading || !requirements.every(r => r.met)}
                            className="w-full bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-neon-cyan/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Resetting...
                                </>
                            ) : (
                                <>
                                    <Lock size={18} />
                                    Reset Password
                                </>
                            )}
                        </button>
                    </form>

                    {/* Back to Login */}
                    <div className="mt-6 text-center">
                        <Link
                            to="/login"
                            className="text-sm text-white/60 hover:text-neon-cyan transition-colors"
                        >
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
