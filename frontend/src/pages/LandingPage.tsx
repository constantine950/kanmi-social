export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="py-24 px-6 text-center">
        <h1 className="text-4xl font-bold text-gray-900">
          Kanmi — Share moments. Connect with people.
        </h1>
        <p className="text-gray-600 mt-4 max-w-xl mx-auto">
          A clean and modern social app built for creators and friends.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <a
            href="/register"
            className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-lg font-medium"
          >
            Create an account
          </a>
          <a href="/login" className="text-indigo-600 text-lg">
            Login
          </a>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          {["Post Anything", "Chat Instantly", "Stay Connected"].map(
            (title) => (
              <div key={title} className="p-6 bg-white rounded-2xl shadow-sm">
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-gray-600 mt-2 text-sm">
                  Simple and fast, made for everyone.
                </p>
              </div>
            )
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 text-center text-gray-500 text-sm">
        © 2025 Kanmi. All rights reserved.
      </footer>
    </div>
  );
}
