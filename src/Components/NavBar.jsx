import React from 'react';
import { RiHome2Line, RiTimeLine, RiBarChart2Line } from 'react-icons/ri';

const NavBar = () => {

    // Nav links with icon components
    const navLinks = [
        { name: 'Home', href: '/', icon: RiHome2Line },
        { name: 'Timeline', href: '/timeline', icon: RiTimeLine },
        { name: 'Stats', href: '/stats', icon: RiBarChart2Line },
    ];

    return (
        <div className='w-10/12 mx-auto'>
            <nav className="bg-transparent flex flex-row justify-between py-4 items-center w-full shadow-md">

                {/* Title */}
                <h1 className='text-3xl font-bold text-center py-4'>
                    <span className='text-green-800'>Keen</span>Keeper
                </h1>

                {/* Nav Links */}
                <ul className="flex justify-center gap-8 pb-4">
                    {navLinks.map((link) => {
                        const Icon = link.icon;

                        return (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    className='flex items-center gap-2 text-lg font-medium text-gray-700 hover:text-blue-500 transition'
                                >
                                    {/* Icon */}
                                    <Icon className="text-xl" />

                                    {/* Text */}
                                    {link.name}
                                </a>
                            </li>
                        );
                    })}
                </ul>

            </nav>
        </div>
    );
};

export default NavBar;