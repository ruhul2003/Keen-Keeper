import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-linear-to-br from-[#0f172a] via-[#1e293b] to-[#020617] text-white px-4 py-16">
      <h1 className="text-8xl font-extrabold text-center text-white bg-clip-text mb-4">
        404
      </h1>

      <p className="text-2xl mb-2 font-bold text-gray-300">
        Page Not Found
      </p>
      <p className="text-center text-gray-400 mt-5">
        Looks like this friendship is broken. The page you are <br /> looking for doesn't exist or has been removed.
      </p>

      <Link
        href="/"
        className="mt-8 px-6 py-3 rounded-full font-semibold bg-linear-to-r from-cyan-400 to-blue-500 text-black hover:scale-105 transition duration-300 shadow-lg"
      >
        Back to Home
      </Link>
    </div>
  );
}
