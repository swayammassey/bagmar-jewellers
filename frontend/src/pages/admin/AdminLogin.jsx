import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, firebaseReady } from "../../lib/firebase";
import { Logo } from "../../components/Logo";

const friendlyError = (code) => {
  if (code === "auth/invalid-credential" || code === "auth/wrong-password" || code === "auth/user-not-found")
    return "Invalid email or password";
  if (code === "auth/too-many-requests") return "Too many attempts. Try again later.";
  if (code === "auth/invalid-email") return "That email doesn't look right";
  return "Login failed — please try again";
};

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    if (!firebaseReady) { setError("Firebase is not configured on this deployment"); return; }
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
      navigate("/admin");
    } catch (err) {
      setError(friendlyError(err.code));
    }
    setLoading(false);
  };

  return (
    <main data-testid="admin-login-page" className="min-h-screen bg-ivory flex items-center justify-center px-5">
      <div className="w-full max-w-md border border-gold/30 bg-white p-2 shadow-[0_40px_90px_-30px_rgba(197,160,89,0.35)]">
        <div className="border border-gold/25 p-8 md:p-10">
          <div className="flex justify-center"><Logo compact /></div>
          <h1 className="font-marcellus text-2xl text-center mt-8 tracking-[0.1em]">Admin Studio</h1>
          <p className="font-jost text-xs font-light text-ink/70 text-center mt-2 tracking-wide">
            Sign in to manage the catalogue
          </p>
          <form onSubmit={submit} className="mt-8 space-y-5">
            <div>
              <label className="font-jost text-[10px] tracking-[0.3em] uppercase text-ink/70 block mb-2">Email</label>
              <input
                data-testid="admin-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gold/30 bg-ivory px-4 py-3 font-jost text-sm outline-none focus:border-gold transition-colors"
                placeholder="admin@bagmarjewellers.com"
              />
            </div>
            <div>
              <label className="font-jost text-[10px] tracking-[0.3em] uppercase text-ink/70 block mb-2">Password</label>
              <input
                data-testid="admin-password-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gold/30 bg-ivory px-4 py-3 font-jost text-sm outline-none focus:border-gold transition-colors"
                placeholder="••••••••"
              />
            </div>
            {error && (
              <p data-testid="admin-login-error" className="font-jost text-xs text-wine">{error}</p>
            )}
            <button
              data-testid="admin-login-submit"
              type="submit"
              disabled={loading}
              className="btn-lux group w-full bg-wine text-white py-4 font-jost text-[11px] tracking-[0.3em] uppercase disabled:opacity-60"
            >
              <span className="btn-fill bg-gold" />
              <span className="relative z-10 transition-colors duration-500 group-hover:text-ink">
                {loading ? "Signing in…" : "Sign In"}
              </span>
            </button>
          </form>
          <div className="text-center mt-6">
            <Link to="/" className="lux-link font-jost text-[10px] tracking-[0.3em] uppercase text-ink/70">
              Back to website
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
