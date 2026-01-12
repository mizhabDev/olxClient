import React, { useEffect, useState } from "react";
import AuthInfoPanel from "../components/auth/AuthInfoPannel";
import OtpModal from "../components/auth/OtpModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SignUpPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const navigate = useNavigate();
  const [otpMessage, setOtpMessage] = useState("");
  const [otpSuccessMessage, setOtpSuccessMessage] = useState("");




  useEffect(() => {
    if (!error) return;

    const timer = setTimeout(() => {
      setError("");
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    console.log("Sign Up attempt:", { name, email, password });

    // Show modal immediately with loading state
    setShowOtpModal(true);
    setIsSendingOtp(true);

    try {

      const res = await axios.post(
        `${API_BASE_URL}/api/auth/register`,
        {
          name,
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("sign up success:", res.data);
      setOtpMessage(res.data.message || "OTP sent successfully");
      setIsSendingOtp(false); // Show OTP form after success

    } catch (error) {
      console.error("Sign up failed:", error);
      setIsSendingOtp(false);
      setShowOtpModal(false); // Close modal on error

      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  const handleVerifyOtp = async (otp) => {
    // Add your OTP verification API call here
    const res = await axios.post(
      `${API_BASE_URL}/api/auth/verifyOtp`,
      {
        email,
        otp,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    console.log("OTP verified:", res.data);
    setOtpSuccessMessage(res.data.message);
    setTimeout(() => {
      setShowOtpModal(false);
      navigate("/login");
    }, 2000);
  };



  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* OTP Modal */}
      <OtpModal
        isOpen={showOtpModal}
        onClose={() => {
          setShowOtpModal(false);
          setIsSendingOtp(false);
        }}
        onVerify={handleVerifyOtp}
        email={email}
        isSendingOtp={isSendingOtp}
        message={otpMessage}
        successMessage={otpSuccessMessage}
      />

      <div className="relative z-10 w-full max-w-4xl mx-auto flex rounded-3xl overflow-hidden glass-panel border border-white/10 bg-[#000814]/5 backdrop-blur-xl shadow-2xl">


        <AuthInfoPanel error={error} />

        <div className="w-full lg:w-1/2 p-8 md:p-10 bg-[#0f172a]/40 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm text-gray-300 ml-1">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#1e293b]/50 border border-slate-700 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-300 ml-1">Email Address</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#1e293b]/50 border border-slate-700 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-300 ml-1">Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#1e293b]/50 border border-slate-700 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-300 ml-1">Confirm Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#1e293b]/50 border border-slate-700 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  required
                />
              </div>

              <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-white font-bold rounded-xl shadow-lg transform transition-all duration-200">
                Create Account
              </button>
            </form>

            <div className="my-8 flex items-center">
              <div className="flex-1 border-t border-slate-700"></div>
              <span className="px-4 text-xs text-gray-500 uppercase tracking-widest">
                OR
              </span>
              <div className="flex-1 border-t border-slate-700"></div>
            </div>

            <button onClick={() => {
              window.location.href = "http://localhost:4000/api/auth/google";
            }} className="w-full py-3.5 bg-[#1e293b]/50 hover:bg-[#1e293b] border border-slate-700 hover:border-slate-600 text-white font-medium rounded-xl flex items-center justify-center gap-3 transition-all duration-200 group">
              <svg
                className="w-5 h-5 group-hover:scale-110 transition-transform"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>Sign in with Google</span>
            </button>


            <p className="mt-8 text-center text-sm text-gray-400">
              Already have an account?{" "}
              <button type="button"
                onClick={() => navigate("/login")} className="text-orange-500 hover:text-orange-400 font-semibold cursor-pointer">
                Log In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>

  );
};

export default SignUpPage;