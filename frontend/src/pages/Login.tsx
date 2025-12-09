export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black text-stone-200 font-[Inter] selection:bg-stone-800 selection:text-stone-200 flex items-center justify-center px-6">
      {/* FONT */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div className="max-w-md w-full space-y-8 p-8 border border-stone-800 bg-stone-950">
        <h1 className="text-3xl font-[Playfair_Display] text-white tracking-tight">
          Login to Kanmi
        </h1>
        <p className="text-xs text-stone-400">Welcome back, minimalist.</p>

        <form className="space-y-4">
          <input
            type="text"
            placeholder="Username or Email"
            className="w-full px-3 py-2 text-sm text-white bg-stone-900 border border-stone-800 focus:outline-none focus:border-stone-600"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-3 py-2 text-sm text-white bg-stone-900 border border-stone-800 focus:outline-none focus:border-stone-600"
          />
          <button
            type="submit"
            className="w-full px-3 py-2 text-xs uppercase tracking-wide bg-white text-black border border-stone-900 hover:bg-stone-300 transition-all"
          >
            Login
          </button>
        </form>

        <p className="text-xs text-stone-500 text-center">
          Don’t have an account?{" "}
          <a href="/register" className="text-white underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
