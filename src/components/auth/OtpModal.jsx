import React, { useState, useRef, useEffect } from "react";

const OtpModal = ({
    isOpen,
    onClose,
    onVerify,
    email,
    isSendingOtp = false,
    message,
    successMessage,
}) => {
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [error, setError] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);
    const inputRefs = useRef([]);

    /* ---------------- Effects ---------------- */

    useEffect(() => {
        if (isOpen && !isSendingOtp && !successMessage) {
            inputRefs.current[0]?.focus();
        }
    }, [isOpen, isSendingOtp, successMessage]);

    useEffect(() => {
        if (isOpen && resendTimer > 0 && !isSendingOtp && !successMessage) {
            const timer = setTimeout(() => {
                setResendTimer((t) => t - 1);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer, isOpen, isSendingOtp, successMessage]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(""), 3000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    /* ---------------- Handlers ---------------- */

    const handleChange = (index, value) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        setError("");

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData("text").slice(0, 6);
        if (!/^\d+$/.test(pasted)) return;

        const newOtp = pasted.split("").slice(0, 6);
        setOtp([...newOtp, ...Array(6 - newOtp.length).fill("")]);
    };

    const handleVerify = async () => {
        const otpString = otp.join("");

        if (otpString.length !== 6) {
            setError("Please enter the complete 6-digit OTP");
            return;
        }

        setIsVerifying(true);
        try {
            await onVerify(otpString);
        } catch (err) {
            setError(err?.message || "Invalid OTP. Please try again.");
        } finally {
            setIsVerifying(false);
        }
    };

    const handleClose = () => {
        setOtp(["", "", "", "", "", ""]);
        setError("");
        setResendTimer(30);
        onClose();
    };

    if (!isOpen) return null;

    /* ---------------- UI ---------------- */

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
            />

            <div className="relative z-10 w-full max-w-md bg-[#0f172a]/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8">
                {/* Close */}
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                    ✕
                </button>

                {/* ---------------- Sending OTP ---------------- */}
                {isSendingOtp && (
                    <div className="text-center py-8">
                        <div className="animate-spin h-12 w-12 mx-auto mb-4 border-4 border-orange-500 border-t-transparent rounded-full" />
                        <h2 className="text-xl font-bold text-white mb-2">
                            Sending Verification Code
                        </h2>
                        <p className="text-gray-400 text-sm">
                            Please wait while we send OTP to
                            <br />
                            <span className="text-orange-500 font-medium">{email}</span>
                        </p>
                    </div>
                )}

                {/* ---------------- Success State ---------------- */}
                {!isSendingOtp && successMessage && (
                    <div className="text-center py-10 animate-success">
                        <div className="relative w-16 h-16 mx-auto mb-4">
                            <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
                            <div className="relative w-16 h-16 rounded-full bg-green-500 flex items-center justify-center text-white text-3xl font-bold scale-in">
                                ✓
                            </div>
                        </div>

                        <h2 className="text-xl font-bold text-white mb-2">
                            Verification Successful
                        </h2>

                        <p className="text-green-400 text-sm">
                            {successMessage}
                        </p>

                        <p className="text-gray-400 text-xs mt-3">
                            Redirecting to login…
                        </p>
                    </div>
                )}


                {/* ---------------- OTP Form ---------------- */}
                {!isSendingOtp && !successMessage && (
                    <>
                        <h2 className="text-2xl font-bold text-white text-center mb-2">
                            Verify Your Email
                        </h2>

                        <p className="text-gray-400 text-center mb-6 text-sm">
                            {message}
                            <br />
                            <span className="text-orange-500 font-medium">{email}</span>
                        </p>

                        {error && (
                            <div className="mb-4 p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-xl text-center">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
                            {otp.map((digit, i) => (
                                <input
                                    key={i}
                                    ref={(el) => (inputRefs.current[i] = el)}
                                    value={digit}
                                    onChange={(e) => handleChange(i, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(i, e)}
                                    maxLength={1}
                                    inputMode="numeric"
                                    className="w-12 h-14 text-xl text-center font-bold bg-[#1e293b]/50 border border-slate-700 rounded-xl text-white focus:border-orange-500"
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleVerify}
                            disabled={isVerifying}
                            className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl disabled:opacity-50"
                        >
                            {isVerifying ? "Verifying..." : "Verify OTP"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default OtpModal;
