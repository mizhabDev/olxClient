const ForgotPasswordModal = ({
  email,
  onClose,
  onSend,
  loading,
  message,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl bg-[#0f172a] border border-white/10 p-6 shadow-2xl animate-shake">
        <h3 className="text-xl font-bold text-white mb-2">
          Reset Password
        </h3>

        {/* 🔴 No email entered */}
        {!email && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-red-300 text-sm">
            Please enter your email address first.
          </div>
        )}

        {/* ✅ Email exists */}
        {email && (
          <p className="text-gray-300 text-sm mb-4">
            Send a password reset link to:
            <br />
            <span className="font-semibold text-white">{email}</span>
          </p>
        )}

        {/* ✅ Backend message */}
        {message && (
          <div className="mb-4 rounded-lg bg-green-500/10 border border-green-500/20 px-4 py-2 text-green-300 text-sm">
            {message}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-gray-300 hover:text-white"
          >
            Close
          </button>

          <button
            type="button"
            onClick={onSend}
            disabled={!email || loading}
            className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-400 text-white font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordModal;
