import React from 'react';
import { Link, useRouteError } from 'react-router-dom';

const ErrorPage = () => {
    const error = useRouteError();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-linear-to-br from-[#0f172a] via-[#1e293b] to-[#020617] text-white px-4">
            
            <h1 className="text-8xl font-extrabold bg-linear-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text mb-4">
                404
            </h1>

            <p className="text-2xl mb-2 text-gray-300">
                Lost in the dark 🌌
            </p>

            <p className="mb-6 text-center max-w-md text-gray-400">
                {error?.statusText || error?.message || "The page you’re looking for doesn’t exist."}
            </p>

            <Link 
                to="/" 
                className="px-6 py-3 rounded-full font-semibold bg-linear-to-r from-cyan-400 to-blue-500 text-black hover:scale-105 transition duration-300 shadow-lg"
            >
                Back to Home
            </Link>

        </div>
    );
};

export default ErrorPage;