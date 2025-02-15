// import React, { useCallback, useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import Logo from "../Images/logo.png";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
// import { useAuth } from '../context/AuthContext';
// import { toast } from 'react-toastify';


// const DASHBOARD_ROUTE = '/'; // Define this constant for easier maintenance


// const Login1 = () => {
//     const [showPassword, setShowPassword] = useState(false);
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [errors, setErrors] = useState({email:'', password:'', general: ''});
//     const [isLoading, setIsLoading] = useState(false);
//     const { login, user } = useAuth();
//     const navigate = useNavigate();

//     useEffect(() => {
//         if (user) {
//             navigate(DASHBOARD_ROUTE);
//         }
//     }, [user, navigate]);

//     const handleLogin = useCallback(async (event) => {
//         event.preventDefault();
//         let valid = true;
//         let newErrors = {email:'', password:'', general: ''};

//         // Validate email
//         if(!email){
//             newErrors.email = 'Email is required';
//             valid = false;
//         }

//         // Validate Password 
//         if(!password){
//             newErrors.password = "Password is required";
//             valid = false;
//         }

//         if(!valid){
//             setErrors(newErrors);
//         } else {
//             setIsLoading(true);
//             try {
//                await login(email, password);
//                toast.success('Logged in successfully!');
//                navigate(DASHBOARD_ROUTE);
//             } catch (error) {
//                 console.error('Login error:', error);
//                 setErrors({...newErrors, general: error.message || 'Invalid email or password'});
//                 toast.error('Login failed. Please check your credentials.');
//             } finally {
//                 setIsLoading(false);
//             }
//         }
//     }, [email, password, login, navigate]);

//     const handleEmailChange = useCallback((e) => {
//         setEmail(e.target.value);
//         setErrors((prevErrors) => ({...prevErrors, email: '', general: ''}));
//     }, []);

//     const handlePasswordChange = useCallback((e) => {
//         setPassword(e.target.value);
//         setErrors((prevErrors) => ({...prevErrors, password:'', general: ''}));
//     }, []);


//     const togglePassword = useCallback(() => {
//         setShowPassword((prev) => !prev);
//     }, []);

//     return (
//         <section className="bg-gray-50 dark:bg-gray-900" style={{fontFamily:'Plus_Jakarta',}}>
//             <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0" >
//                 <div  className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700" style={{ borderRadius: "20px",  }}>
//                     <div className="p-8 space-y-4 md:space-y-6 sm:p-8" style={{ borderRadius: "20px"}}>
//                         <div className="flex justify-center items-center space-y-4 md:space-y-6">
//                             <img className="w-14 h-14 mr-2" src={Logo} alt="Logo" />
//                         </div>
//                         {errors.general && <p className="text-red-500 text-sm text-center">{errors.general}</p>}
//                         <form className="space-y-3 md:space-y-6" action="#" onSubmit={handleLogin}>
//                             <div>
//                                 <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" style={{fontSize:'14px'}}>
//                                     Email
//                                 </label>
//                                 <input
//                                     type="email"
//                                     name="email"
//                                     id="email"
//                                     className={`bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-300'} text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
//                                     placeholder="Enter your email"
//                                     required=""
//                                     value={email}
//                                     onChange={handleEmailChange}
//                                 />
//                                 {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
//                             </div>
//                             <div >
//                                 <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" style={{fontSize:'14px'}}>
//                                     Password
//                                 </label>
//                                 <div className="relative">
//                                     <input
//                                         type={showPassword ? 'text': 'password'}
//                                         name="password"
//                                         id="password"
//                                         value={password}
//                                         onChange={handlePasswordChange}
//                                         placeholder="********"
//                                         className={`bg-gray-50 border ${errors.password ? 'border-red-500': 'border-gray-300'} text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
//                                         required=""
//                                     />
//                                     <button type="button" onClick={togglePassword} className="absolute inset-y-0 right-0 flex items-center pr-3">
//                                         <FontAwesomeIcon icon={showPassword ? faEye: faEyeSlash} className="text-gray-500 dark:text-gray-400" />
//                                     </button>
//                                 </div>
//                                 {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
//                                 <div className="text-end mt-2">
//                                     <a href="/forgot" className="text-sm text-right text-end items-end font-medium text-gray-900 hover:underline dark:text-primary-500">
//                                         Forgot password?
//                                     </a>
//                                     {/* <Link to='/register' href="#" className="text-sm text-right text-end items-end font-medium text-gray-900 hover:underline dark:text-primary-500">
//                                         register
//                                     </Link> */}
//                                 </div>
//                             </div>
//                             <button
//                                 type="submit"
//                                 className="w-full text-white bg-gray-950 hover:bg-gray-900 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
//                                 disabled={isLoading}
//                             >
//                                 {isLoading ? 'Signing in...' : 'Sign in'}
//                             </button>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default Login1;

import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../Images/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const DASHBOARD_ROUTE = '/';

const Login1 = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({email:'', password:'', general: ''});
    const [isLoading, setIsLoading] = useState(false);
    const { login, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate(DASHBOARD_ROUTE);
        }
    }, [user, navigate]);

    const handleLogin = useCallback(async (event) => {
        event.preventDefault();
        let valid = true;
        let newErrors = {email:'', password:'', general: ''};

        if(!email){
            newErrors.email = 'Email is required';
            valid = false;
        }

        if(!password){
            newErrors.password = "Password is required";
            valid = false;
        }

        if(!valid){
            setErrors(newErrors);
        } else {
            setIsLoading(true);
            try {
               const userData = await login(email, password);
               console.log("Login successful, user data:", userData);
               toast.success('Logged in successfully!');
               navigate(DASHBOARD_ROUTE);
            } catch (error) {
                console.error('Login error:', error);
                if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                    setErrors({...newErrors, general: 'Invalid email or password'});
                } else if (error.message === "User account not found in staff database.") {
                    setErrors({...newErrors, general: 'Your account is not authorized. Please contact an administrator.'});
                } else {
                    setErrors({...newErrors, general: error.message || 'An error occurred during login'});
                }
                toast.error('Login failed. Please check your credentials or contact an administrator.');
            } finally {
                setIsLoading(false);
            }
        }
    }, [email, password, login, navigate]);
    
    const handleEmailChange = useCallback((e) => {
        setEmail(e.target.value);
        setErrors((prevErrors) => ({...prevErrors, email: '', general: ''}));
    }, []);

    const handlePasswordChange = useCallback((e) => {
        setPassword(e.target.value);
        setErrors((prevErrors) => ({...prevErrors, password:'', general: ''}));
    }, []);

    const togglePassword = useCallback(() => {
        setShowPassword((prev) => !prev);
    }, []);

    return (
        <section className="bg-gray-50 dark:bg-gray-900" style={{fontFamily:'Plus_Jakarta',}}>
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0" >
                <div  className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700" style={{ borderRadius: "20px",  }}>
                    <div className="p-8 space-y-4 md:space-y-6 sm:p-8" style={{ borderRadius: "20px"}}>
                        <div className="flex justify-center items-center space-y-4 md:space-y-6">
                            <img className="w-14 h-14 mr-2" src={Logo} alt="Logo" />
                        </div>
                        {errors.general && <p className="text-red-500 text-sm text-center">{errors.general}</p>}
                        <form className="space-y-3 md:space-y-6" action="#" onSubmit={handleLogin}>
                            <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" style={{fontSize:'14px'}}>
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    style={{padding: '12px 12px', fontSize:'14px'}}
                                    className={`bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-300'} text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                                    placeholder="Enter your email"
                                    required=""
                                    value={email}
                                    onChange={handleEmailChange}
                                />
                                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                            </div>
                            <div >
                                <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" style={{fontSize:'14px'}}>
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text': 'password'}
                                        name="password"
                                        id="password"
                                        style={{padding: '12px 12px', fontSize:'14px'}}
                                        value={password}
                                        onChange={handlePasswordChange}
                                        placeholder="********"
                                        className={`bg-gray-50 border ${errors.password ? 'border-red-500': 'border-gray-300'} text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                                        required=""
                                    />
                                    <button type="button" onClick={togglePassword} className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <FontAwesomeIcon icon={showPassword ? faEye: faEyeSlash} className="text-gray-500 dark:text-gray-400" />
                                    </button>
                                </div>
                                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                                <div className="text-end mt-2">
                                    <a href="/forgot" className="text-md text-right text-end items-end font-medium text-gray-900 hover:underline dark:text-primary-500">
                                        Forgot password?
                                    </a>
                                </div>
                            </div>
                            <button
                                type="submit"
                                style={{padding: '12px 8px', fontSize:'14px'}}
                                className="w-full text-white bg-gray-950 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"                                disabled={isLoading}
                            >
                                {isLoading ? 'Signing in...' : 'Sign in'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login1;