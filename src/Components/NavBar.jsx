import React, { useState } from 'react'; // import React and useState for mobile menu toggle
import { RiHome2Line, RiTimeLine, RiBarChart2Line, RiMenuLine, RiCloseLine } from 'react-icons/ri'; // icons

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false); // state for mobile menu open/close

    // Nav links with icon components
    const navLinks = [
        { name: 'Home', href: '/', icon: RiHome2Line },
        { name: 'Timeline', href: '/timeline', icon: RiTimeLine },
        { name: 'Stats', href: '/stats', icon: RiBarChart2Line },
    ];

    return (
        <div className='w-11/12 mx-auto'> {/* responsive container width */}
            <nav className="flex flex-wrap items-center justify-between py-4 shadow-md">

                {/* Logo / Title */}
                <h1 className='text-2xl md:text-3xl font-bold'>
                    <span className='text-green-800'>Keen</span>Keeper
                </h1>

                {/* Mobile menu button */}
                <button
                    className="md:hidden text-3xl"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <RiCloseLine /> : <RiMenuLine />}
                </button>

                {/* Nav Links */}
                <ul
                    className={`w-full md:w-auto flex flex-col md:flex-row md:items-center gap-6 md:gap-8 transition-all duration-300
                    ${isOpen ? 'block' : 'hidden'} md:flex`}
                >
                    {navLinks.map((link) => {
                        const Icon = link.icon;

                        return (
                            <li key={link.href}>
                                <a
                                    href={link.href}
                                    className="flex items-center gap-2 text-lg font-medium text-gray-700 hover:text-blue-500"
                                >
                                    <Icon className="text-xl" />
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