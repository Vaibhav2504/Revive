import React from 'react';
import { useState } from 'react';
import bg from '../assets/background/bg.jpg';

const Login = () => {
    const [username, setusername] = useState('');
    const [password, setpassword] = useState('');

    const userSubmitted = (e) => {
        e.preventDefault();
        setpassword('');
    }

    return (
        <div className='min-h-screen flex items-center justify-center bg-linear-to-br from-indigo-800 via-purple-800 to-pink-800 p-4 relative overflow-hidden'>
            {/* Animated Background Elements */}
            <div className='absolute inset-0 overflow-hidden'>
                <div className='absolute -top-40 -right-40 w-80 h-80 bg-purple-950 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse'></div>
                <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-pink-950 rounded-full mix-blend-multiply filter blur-2xl opacity-20 animate-pulse delay-1000'></div>
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-950 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse delay-1000'></div>
            </div>

            <div className='w-full max-w-6xl relative z-10'>
                <div className='bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 hover:shadow-3xl transition-all duration-500'>
                    <div className='flex flex-col lg:flex-row'>
                        {/* Image Section */}
                        <div className='w-full lg:w-1/2 relative overflow-hidden group'>
                            <div className='absolute inset-0 bg-linear-to-br from-emerald-600/40 to-blue-700/40 z-10'></div>
                            <img
                                src={bg}
                                alt="Welcome"
                                className='w-full h-full object-cover transition-transform duration-700 group-hover:scale-110'
                            />
                            <div className='absolute inset-0 z-20 flex flex-col items-center justify-center p-8 text-white'>
                                <div className='text-center transform transition-transform duration-500 group-hover:scale-105'>
                                    <h3 className='text-3xl font-bold mb-4 drop-shadow-lg'>Revive</h3>
                                    <p className='text-white/95 text-xl font-bold drop-shadow'>Less paperwork. More patient care</p>
                                </div>
                            </div>
                        </div>

                        {/* Login Form Section */}
                        <div className='w-full lg:w-1/2 p-6 sm:p-8 md:p-10 lg:p-12 bg-white/15 backdrop-blur-sm'>
                            <div className='text-center mb-2'>
                                <h2 className='text-3xl sm:text-4xl font-bold leading-normal bg-gradient-to-r from-[#E6EEC9] to-[#C2D099] bg-clip-text text-transparent'>
                                    Sign In
                                </h2>
                            </div>

                            <form onSubmit={(e) => userSubmitted(e)} className='space-y-4 sm:space-y-5'>
                                <div>
                                    <label className='block text-[#C9CAAC] font-semibold mb-2 ml-1 text-lg lg:text-lg'>UniqueID</label>
                                    <div className='relative'>
                                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7h16M4 17h16M7 11h4m-4 4h6m5-4h.01M4 5a2 2 0 012-2h12a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V5z"/>
                                            </svg>
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="PT/DR/AD"
                                            className='w-full bg-gradient-to-r from-amber-50 to-yellow-50 text-gray-800 text-sm sm:text-base rounded-xl pl-10 pr-4 py-3 sm:py-4 border-2 border-amber-300 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all duration-300 shadow-sm hover:shadow-md font-bold'
                                            onChange={(e) => {
                                                setusername(e.target.value);
                                            }}
                                            value={username}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className='block text-[#C9CAAC] font-semibold mb-2 ml-1 text-lg lg:text-lg'>Password</label>
                                    <div className='relative'>
                                        <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                            <svg className='h-5 w-5 text-gray-400' fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            className='w-full bg-gradient-to-r from-amber-50 to-yellow-50 text-gray-800 text-sm sm:text-base rounded-xl pl-10 pr-4 py-3 sm:py-4 border-2 border-amber-300 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all duration-300 shadow-sm hover:shadow-md font-bold'
                                            onChange={(e) => {
                                                setpassword(e.target.value);
                                            }}
                                            value={password}
                                        />
                                    </div>
                                </div>

                                <div className='flex items-center justify-between text-sm'>
                                    <a href='#' className='text-[#C9CAAC] hover:text-[#869B7E] text-lg lg:text-lg transition-colors'>Forgot password?</a>
                                </div>

                                <button
                                    type='submit'
                                    className='w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-base sm:text-lg font-semibold rounded-xl px-6 py-3 sm:py-4 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl shadow-lg relative overflow-hidden group'
                                >
                                    <span className='relative'>Sign In</span>
                                    <div className='absolute bg-gradient-to-r from-emerald-700 to-emerald-800'></div>
                                </button>
                            </form>

                            <div className='mt-6 sm:mt-8'>
                                <div className='relative'>
                                    <div className='absolute inset-0 flex items-center'>
                                        <div className='w-full border-t border-gray-300'></div>
                                    </div>
                                    <div className='relative flex justify-center text-sm'>
                                        <span className='px-4 bg-emerald-600 text-[#E5EEE4] rounded-xl p-2 font-bold text-sm sm:text-sm'>Or continue with</span>
                                    </div>
                                </div>

                                <div className='mt-6 grid grid-cols-3 gap-3'>
                                    <button className='flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 hover:shadow-md'>
                                        <svg className='w-5 h-5' viewBox="0 0 24 24">
                                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                        </svg>
                                    </button>
                                    <button className='flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 hover:shadow-md'>
                                        <svg className='w-5 h-5' fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                        </svg>
                                    </button>
                                    <button className='flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-300 hover:shadow-md'>
                                        <svg className='w-5 h-5' fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                                        </svg>
                                    </button>
                                </div>

                                <p className='text-center mt-6 text-sm text-[#C0E1D2]'>
                                    Don't have an account?{' '}
                                    <a href='#' className='text-[#C0E1D2] hover:text-emerald-700 font-semibold hover:underline transition-colors'>
                                        Create an account
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login