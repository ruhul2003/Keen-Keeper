import React from 'react';
import { Outlet } from 'react-router-dom';
import NavBar from '../Components/NavBar';
import Footer from '../Components/Footer';

const Layout = () => {
    return (
        <div className='flex flex-col min-h-screen'>

            <NavBar />

            <div className='grow'>
                <Outlet />
            </div>

            <Footer />

        </div>
    );
};

export default Layout;