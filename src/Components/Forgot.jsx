import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from "../Images/logo.png";
import { toast } from 'react-toastify';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/firebase'; // Make sure this path is correct

const PasswordReset = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({ email: '', general: '' });

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email) {
            setErrors({ ...errors, email: 'Email is required' });
            return;
        }
        setIsLoading(true);
        try {
            await sendPasswordResetEmail(auth, email);
            toast.success('Password reset link sent to your email.');
            setEmail('');

            setTimeout(() => {
                navigate('/login');
            }, 4000);
        } catch (error) {
            console.error('Password reset error:', error);
            let errorMessage = 'Failed to send reset link. Please try again.';
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'No user found with this email address.';
            }
            setErrors({ ...errors, general: errorMessage });
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-900" style={{ fontFamily: "Plus_Jakarta",}}>
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-xl xl:p-0 dark:bg-gray-800 dark:border-gray-700" style={{ borderRadius: "20px", width: '900px' }}>
                    <div className="p-8 space-y-4 md:space-y-6 sm:p-8" style={{ borderRadius: "20px" }}>
                        <div className="flex justify-center items-center space-y-4 md:space-y-6">
                            <img className="w-14 h-14 mr-2" src={Logo} alt="Logo" />
                        </div>
                        <h2 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white text-center">
                            Password Reset
                        </h2>
                        <p className="text-gray-600 ml-9 mr-9 justify-center text-center dark:text-gray-400 text-sm" style={{color: 'var(--Gray-400, #6B7280)', fontSize:'16px', fontWeight:'500', lineHeight:'24px'}}>
                            Enter your email and we'll send you a link to reset your password
                        </p>
                        {errors.general && <p className="text-red-500 text-sm text-center">{errors.general}</p>}
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" style={{fontSize:'14px'}}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    style={{padding: '14px 16px', fontSize:'14px'}}
                                    className={`bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-300'} text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setErrors({ ...errors, email: '', general: '' });
                                    }}
                                    required
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                            <button
                                type="submit"
                                style={{padding: '12px 8px', fontSize:'14px'}}
                                className="w-full text-white bg-gray-950 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Sending...' : 'Send link to email'}
                            </button>
                            <p className="text-sm  font-light text-gray-500 dark:text-gray-400">
                                Remember your password? <Link to="/login" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign in</Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PasswordReset;