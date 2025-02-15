import React, { useState } from "react";
import Logo from "../Images/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase/firebase'

const Register = () => {

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({email:'', password:''});


    

    const handleBlankError = async (event)=>{
        event.preventDefault();
        let valid = true;
        let errors = {email:'', password:''};

        //Validate email first
        if(!email){
            errors.email = 'Email is required';
            valid = false;
        }

        //Validate Password 
        if(!password){
            errors.password ="Password is required";
            valid= false;
        }

        if(!valid){
            setErrors(errors);
        } else{
            console.log('Form submitted');
            setErrors({email:'', password:''});
            // clearning the forms
            setEmail('')
            setPassword('');
            
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            const user = auth.currentUser;
            console.log(user);
            console.log("user register");
            
            
            
        } catch (error) {
            console.log(error.message);
            
            
        }
    };

    const handleEmailChange = (e)=>{
        setEmail(e.target.value);
        if(errors.email){
            setErrors((prevErrors) => ({...prevErrors, email: ''}));
        }
    }

    const handlePasswordChange=(e)=>{
        setPassword(e.target.value);
        if(errors.password){
            setErrors((prevErrors) => ({...prevErrors, password:''}));
        }
    }



 const TogglePassword = ()=>{
    setShowPassword(!showPassword);
 }

//  const handleRegister = async (e) =>{
//     e.preventDefault();
    
//  }








  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div
          className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
          style={{ borderRadius: "20px" }}
        >
          <div
            className="p-8 space-y-4  md:space-y-6 sm:p-8"
            style={{ borderRadius: "20px" }}
          >
            <div className="flex justify-center items-center space-y-4 md:space-y-6">
              <img className="w-14 h-14 mr-2 " src={Logo} alt="Logo" />
            </div>
            <form className="space-y-3 md:space-y-6" action="#" onSubmit={handleBlankError}>
              <div>
                <label
                  for="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className={`bg-gray-50 border ${errors.email ? 'border-red-500' : 'border-gray-300'} text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400  dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
                  placeholder="Enter your email"
                  required=""
                  value={email}
                  onChange={handleEmailChange}
                ></input>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div >
                <label
                  for="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <div className="relative">
                <input
                  type={showPassword ? 'text': 'password'}
                  name="password"
                  id="password"
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="********"
                
                  className={`bg-gray-50 border ${errors.password ? 'border-red-500':  'border-gray-300'} text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500  dark:focus:border-blue-500`}
                  required=""
                />

                <button type="button" onClick={TogglePassword} className="absolute inset-y-0 right-0 flex items-center pr-3">

                <FontAwesomeIcon icon={showPassword ? faEye: faEyeSlash} className="text-gray-500 dark:text-gray-400 " />
                </button>
                </div>

                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                <div className="text-end mt-2 ">
                  <a
                    href="#"
                    className="text-sm text-right text-end items-end font-medium text-gray-900 hover:underline dark:text-primary-500" 
                  >
                    Forgot password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                className="w-full text-white bg-gray-950 hover:bg-gray-900 focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
