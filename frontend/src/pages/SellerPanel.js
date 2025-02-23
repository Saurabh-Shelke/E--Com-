import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { FaRegCircleUser } from "react-icons/fa6";
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import ROLE from '../common/role';

const SellerPanel = () => {
    const user = useSelector(state => state?.user?.user);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role !== ROLE.ADMIN) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <div className='min-h-screen flex'>
            <aside className='bg-white min-h-full w-64 max-w-64 customShadow'>
                <div className='h-32 flex justify-center items-center flex-col'>
                    <div className='text-5xl cursor-pointer relative flex justify-center'>
                        {user?.profilePic ? (
                            <img src={user?.profilePic} className='w-20 h-20 rounded-full' alt={user?.name} />
                        ) : (
                            <FaRegCircleUser />
                        )}
                    </div>
                    <p className='capitalize text-lg font-semibold'>{user?.name}</p>
                    <p className='text-sm'>{user?.role}</p>
                </div>
                <nav className='p-4'>
                    {/* Use NavLink instead of Link and apply active styling */}
                    <NavLink 
                        to={"all-products"} 
                        className={({ isActive }) => 
                            `block px-2 py-1 hover:bg-slate-100 ${isActive ? 'bg-slate-200 font-semibold' : ''}`
                        }
                    >
                        All Products
                    </NavLink>
                </nav>
            </aside>
            <main className='flex-1 p-2'>
                <Outlet />
            </main>
        </div>
    );
};

export default SellerPanel;
