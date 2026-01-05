import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const ResetPasswordPage = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });

    const navigate = useNavigate();

    const { token } = useParams();
    useEffect(() => {
        if (message.text) {
            const timer = setTimeout(() => {
                setMessage({ type: "", text: "" });
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (newPassword !== confirmPassword) {
            setMessage({ type: "error", text: "Passwords do not match." });
            return;
        }

        if (newPassword.length < 6) {
            setMessage({ type: "error", text: "Password must be at least 6 characters." });
            return;
        }

        if (!token) {
            setMessage({ type: "error", text: "Invalid or missing reset token." });
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post(
                `${API_BASE_URL}/api/auth/reset-password/${token}`,
                {
                    newPassword,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            setMessage({ type: "success", text: res.data.message || "Password reset successful!" });

            // Redirect to login after success
            setTimeout(() => {
                navigate("/login");
            }, 3000);
        } catch (err) {
            console.error("Reset password failed:", err);
            setMessage({
                type: "error",
                text: err.response?.data?.message || "Failed to reset password. Please try again.",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className="relative z-10 w-full max-w-xl mx-auto rounded-3xl overflow-hidden glass-panel border border-white/10 bg-[#000814]/40 backdrop-blur-xl shadow-2xl">
                {/* Glassy container */}
                <div className="p-8 md:p-12 bg-[#0f172a]/50">
                    {/* Header with icon */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-orange-500/20 to-orange-600/10 border border-orange-500/20 mb-6">
                            <Lock className="w-8 h-8 text-orange-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-2">New Password</h2>
                        <p className="text-gray-400">Create a strong password for your account</p>
                    </div>

                    {/* Status messages */}
                    {message.text && (
                        <div
                            className={`mb-6 rounded-xl px-4 py-3 flex items-center gap-3 text-sm ${message.type === "success"
                                ? "bg-green-500/10 border border-green-500/20 text-green-300"
                                : "bg-red-500/10 border border-red-500/20 text-red-300"
                                }`}
                        >
                            {message.type === "success" ? (
                                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                            ) : (
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            )}
                            {message.text}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* New Password Field */}
                        <div className="space-y-2">
                            <label className="text-sm text-gray-300 ml-1">New Password</label>
                            <div className="relative group">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-[#1e293b]/50 border border-slate-700 rounded-xl px-5 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                >
                                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <label className="text-sm text-gray-300 ml-1">Confirm Password</label>
                            <div className="relative group">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full bg-[#1e293b]/50 border border-slate-700 rounded-xl px-5 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Password strength indicator */}
                        {newPassword && (
                            <div className="space-y-2">
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4].map((level) => (
                                        <div
                                            key={level}
                                            className={`h-1 flex-1 rounded-full transition-colors ${newPassword.length >= level * 3
                                                ? level <= 2
                                                    ? "bg-red-500"
                                                    : level === 3
                                                        ? "bg-yellow-500"
                                                        : "bg-green-500"
                                                : "bg-slate-700"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500">
                                    {newPassword.length < 6
                                        ? "Password too short"
                                        : newPassword.length < 9
                                            ? "Fair password"
                                            : newPassword.length < 12
                                                ? "Strong password"
                                                : "Very strong password"}
                                </p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 mt-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 transform transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    Resetting...
                                </span>
                            ) : (
                                "Set New Password"
                            )}
                        </button>
                    </form>

                    {/* Back to login link */}
                    <p className="mt-8 text-center text-sm text-gray-400">
                        Remember your password?{" "}
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="text-orange-500 hover:text-orange-400 font-semibold cursor-pointer"
                        >
                            Back to Login
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
