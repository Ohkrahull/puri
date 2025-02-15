import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAuth, confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { app } from '../firebase/firebase'; // Adjust this path
import { toast } from 'react-toastify';
import Logo from "../Images/logo.png";

const auth = getAuth(app);

const ChangePassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '' });
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const oobCode = queryParams.get('oobCode');

        if (!oobCode) {
            toast.error('Invalid password reset link.');
            navigate('/login');
        } else {
            verifyPasswordResetCode(auth, oobCode).catch((error) => {
                console.error('Invalid or expired code:', error);
                toast.error('Invalid or expired password reset link. Please request a new one.');
                navigate('/login');
            });
        }
    }, [navigate, location]);

    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        checkPasswordStrength(newPassword);
    };

    const checkPasswordStrength = (password) => {
        let score = 0;
        if (password.length >= 8) score++;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) score++;
        if (password.match(/\d/)) score++;
        if (password.match(/[^a-zA-Z\d]/)) score++;

        let label = '';
        let color = '';
        if (score === 0) { label = 'Very Weak'; color = '#ff4136'; }
        else if (score === 1) { label = 'Weak'; color = '#ff851b'; }
        else if (score === 2) { label = 'Fair'; color = '#ffdc00'; }
        else if (score === 3) { label = 'Good'; color = '#2ecc40'; }
        else if (score === 4) { label = 'Strong'; color = '#0074d9'; }

        setPasswordStrength({ score, label, color });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setErrors({ confirmPassword: 'Passwords do not match' });
            return;
        }
        if (passwordStrength.score < 3) {
            setErrors({ password: 'Please use a stronger password' });
            return;
        }
        setIsLoading(true);
        try {
            const queryParams = new URLSearchParams(location.search);
            const oobCode = queryParams.get('oobCode');
            await confirmPasswordReset(auth, oobCode, password);
            toast.success('Password updated successfully');
            navigate('/login');
        } catch (error) {
            console.error('Password change error:', error);
            setErrors({ general: error.message || 'Failed to update password. Please try again.' });
            toast.error('Failed to update password. Please try again.');
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
                            Change Password
                        </h2>
                        {errors.general && <p className="text-red-500 text-sm text-center">{errors.general}</p>}
                        <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
                            <div>
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" style={{fontSize:'14px'}}>
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    style={{padding: '14px 16px', fontSize:'14px'}}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    value={password}
                                    onChange={handlePasswordChange}
                                    required
                                />

{password && (
                                    <div className="mt-1 text-sm" style={{ color: passwordStrength.color }}>
                                        Password strength: {passwordStrength.label}
                                    </div>
                                )}
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}

                            </div>
                            <div>
                                <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" style={{fontSize:'14px'}}>
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    id="confirmPassword"
                                    style={{padding: '14px 16px', fontSize:'14px'}}
                                    className={`bg-gray-50 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                            </div>
                            <button
                                type="submit"
                                style={{padding: '12px 8px', fontSize:'14px'}}
                                className="w-full text-white bg-gray-950 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                                disabled={isLoading || passwordStrength.score < 3}
                            >
                                {isLoading ? 'Updating...' : 'Change Password'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ChangePassword;