import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Eye, EyeOff, Loader2, Sparkles, Check, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import showToast from './Toast';

export default function SignupPage() {
    const navigate = useNavigate();
    const { signup, loading } = useAuth();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!name || !email || !password || !confirmPassword) {
            showToast.error('Please fill in all fields');
            return;
        }

        if (password !== confirmPassword) {
            showToast.error('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            showToast.error('Password must be at least 6 characters');
            return;
        }

        if (!agreedToTerms) {
            showToast.error('Please agree to the terms and conditions');
            return;
        }

        const result = await signup({ name, email, password });

        if (result.success) {
            showToast.success('Account created successfully!');
            navigate('/onboarding');
        } else {
            showToast.error(result.error || 'Signup failed');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#0A0A0F] via-[#1A1A2E] to-[#0A0A0F] flex items-center justify-center p-4">
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-neon-purple to-neon-cyan mb-4">
                        <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">
                        Create Account
                    </h1>
                    <p className="text-white/60">
                        Start your visual programming journey today
                    </p>
                </div>

                {/* Signup Card */}
                <div className="glass-effect border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-11 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-neon-purple focus:ring-2 focus:ring-neon-purple/20 transition-all"
                                    placeholder="John Doe"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-11 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-neon-purple focus:ring-2 focus:ring-neon-purple/20 transition-all"
                                    placeholder="you@example.com"
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-white/80 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-11 pr-12 py-3 text-white placeholder-white/40 focus:outline-none focus:border-neon-purple focus:ring-2 focus:ring-neon-purple/20 transition-all"
                                    placeholder="••••••••"
                                    disabled={loading}
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
                                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-11 pr-12 py-3 text-white placeholder-white/40 focus:outline-none focus:border-neon-purple focus:ring-2 focus:ring-neon-purple/20 transition-all"
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

                        {/* Terms Checkbox */}
                        <div>
                            <label className="flex items-start gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={agreedToTerms}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 text-neon-purple focus:ring-neon-purple focus:ring-offset-0"
                                />
                                <span className="text-sm text-white/60">
                                    I agree to the{' '}
                                    <a href="#" className="text-neon-purple hover:text-neon-purple/80 transition-colors">
                                        Terms of Service
                                    </a>{' '}
                                    and{' '}
                                    <a href="#" className="text-neon-purple hover:text-neon-purple/80 transition-colors">
                                        Privacy Policy
                                    </a>
                                </span>
                            </label>
                        </div>

                        {/* Signup Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-neon-purple to-neon-cyan text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-neon-purple/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5" />
                                    Create Account
                                </>
                            )}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-surface text-white/40">Or sign up with</span>
                        </div>
                    </div>

                    {/* Social Signup Placeholders */}
                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white/60 py-3 rounded-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Google
                        </button>
                        <button className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white/60 py-3 rounded-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                            </svg>
                            GitHub
                        </button>
                    </div>

                    {/* Login Link */}
                    <p className="text-center text-sm text-white/60 mt-6">
                        Already have an account?{' '}
                        <Link
                            to="/login"
                            className="text-neon-purple hover:text-neon-purple/80 font-medium transition-colors"
                        >
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
