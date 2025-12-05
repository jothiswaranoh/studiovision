import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle, Sparkles } from 'lucide-react';
import showToast from './Toast';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email) {
            showToast.error('Please enter your email address');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showToast.error('Please enter a valid email address');
            return;
        }

        setLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setLoading(false);
        setEmailSent(true);
        showToast.success('Password reset link sent to your email!');
    };

    if (emailSent) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-[#0A0A0F] via-[#1A1A2E] to-[#0A0A0F] flex items-center justify-center p-4">
                {/* Animated background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-cyan/10 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                <div className="w-full max-w-md relative z-10">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500/20 mb-6">
                            <CheckCircle className="w-10 h-10 text-green-400" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-4">
                            Check Your Email
                        </h1>
                        <p className="text-white/60 mb-2">
                            We've sent a password reset link to:
                        </p>
                        <p className="text-neon-cyan font-medium mb-8">
                            {email}
                        </p>
                        <div className="glass-effect border border-white/10 rounded-2xl p-6 mb-6">
                            <p className="text-sm text-white/80 mb-4">
                                Click the link in the email to reset your password. The link will expire in 1 hour.
                            </p>
                            <p className="text-xs text-white/60">
                                Didn't receive the email? Check your spam folder or{' '}
                                <button
                                    onClick={() => setEmailSent(false)}
                                    className="text-neon-cyan hover:text-neon-cyan/80 underline"
                                >
                                    try again
                                </button>
                            </p>
                        </div>
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                        >
                            <ArrowLeft size={18} />
                            Back to Login
                        </Link>
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
                        Forgot Password?
                    </h1>
                    <p className="text-white/60">
                        No worries! Enter your email and we'll send you a reset link
                    </p>
                </div>

                {/* Form Card */}
                <div className="glass-effect border border-white/10 rounded-2xl p-8 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
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
                                    className="w-full bg-white/5 border border-white/10 rounded-lg pl-11 pr-4 py-3 text-white placeholder-white/40 focus:outline-none focus:border-neon-cyan focus:ring-2 focus:ring-neon-cyan/20 transition-all"
                                    placeholder="you@example.com"
                                    disabled={loading}
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-semibold py-3 rounded-lg hover:shadow-lg hover:shadow-neon-cyan/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send size={18} />
                                    Send Reset Link
                                </>
                            )}
                        </button>
                    </form>

                    {/* Back to Login */}
                    <div className="mt-6 text-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-neon-cyan transition-colors"
                        >
                            <ArrowLeft size={16} />
                            Back to Login
                        </Link>
                    </div>
                </div>

                {/* Help Text */}
                <p className="text-center text-xs text-white/40 mt-6">
                    Remember your password?{' '}
                    <Link to="/login" className="text-neon-cyan hover:text-neon-cyan/80 transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
