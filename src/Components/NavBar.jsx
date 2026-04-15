import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { RiHome2Line, RiTimeLine, RiBarChart2Line, RiMenuLine, RiCloseLine } from 'react-icons/ri';

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: 'Home', path: '/', icon: RiHome2Line },
        { name: 'Timeline', path: '/timeline', icon: RiTimeLine },
        { name: 'Stats', path: '/stats', icon: RiBarChart2Line },
    ];

    return (
        <div className='w-full mx-auto'>
            <nav className="flex w-full px-20 mx-auto flex-wrap items-center justify-between py-4 shadow-md">

                <h1 className='text-2xl md:text-3xl font-bold'>
                    <span className='text-green-800'>Keen</span>Keeper
                </h1>

                <button
                    className="md:hidden text-3xl"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <RiCloseLine /> : <RiMenuLine />}
                </button>

                <ul
                    className={`w-full md:w-auto flex flex-col md:flex-row md:items-center gap-6 md:gap-8 transition-all duration-300
                    ${isOpen ? 'block' : 'hidden'} md:flex`}
                >
                    {navLinks.map((link) => {
                        const Icon = link.icon;

                        return (
                            <li key={link.path}>
                                <NavLink
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `relative flex items-center gap-2 text-lg font-medium px-3 py-2 rounded-md transition-all duration-300 ${isActive
                                            ? 'text-white bg-[#244D3F]'
                                            : 'text-gray-700 hover:text-[#244D3F] hover:bg-gray-100'
                                        } `
                                    }
                                    onClick={() => setIsOpen(false)}
                                >
                                    <Icon className="text-xl" />
                                    {link.name}
                                </NavLink>
                            </li>
                        );
                    })}
                </ul>

            </nav>
        </div>
    );
};

export default NavBar;