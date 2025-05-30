import React, { useEffect, useState } from 'react';
import InputField from '../components/InputField';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import Button from '../components/ButtonAuth';
import GoogleLoginButton from '../components/GoogleLoginButton';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import authService from '../firebase/AuthService.js'
import {toast} from "sonner"
import { useDispatch, useSelector } from 'react-redux';
import {login} from '../store/authSlice'
import DataService from '../firebase/DataService.js'
import LoadingSpinner from '../components/LoadingSpinner';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isDarkMode = useSelector((state) => state.darkMode.isDarkMode);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

  const validate = () => {
    const newErrors= {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsLoading(true);
    
    try {
      const user = await authService.login(formData.email, formData.password);      
      
      const dataService = new DataService("users");
      
      const response = await dataService.getUserData(user.uid);
      
      
      if(user && !user.emailVerified && !response){

        await authService.sendEmailVerification(user)
        
        setIsVerifying(true);
        toast.success('Please verify you email, Verification email sent!');
        const checkVerification = setInterval(async () => {
          await user.reload();
          if (user.emailVerified) {
            clearInterval(checkVerification);
            setIsVerifying(false);
            
            const userData = {
              uid: user.uid,
              email: user.email,
              displayName: formData.name,
              photoURL: user.photoURL,
              collegeName: '',
              role: '',
              branch: '',
              studyType: '',
              phone: '',
              gender: '',
              isAdmin:false,
            };
            
            localStorage.setItem("userData", JSON.stringify(userData));
            localStorage.setItem("authStatus", "true");
            localStorage.setItem("profileCompleted", "false");
            localStorage.setItem("fromSignup", "true");
            
            dispatch(login({ 
              userData: { 
                email: user.email, 
                name: formData.name, 
                userID: user.uid 
              },
              status: true,
              profileCompleted: false
            }));
            
            toast.success('Email verified successfully!');
            navigate('/complete-profile', { replace: true });
          }
        }, 3000);
      }
      else if (!response) {
        // Set up basic user data in localStorage for new users
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || "",
          photoURL: user.photoURL || "",
          collegeName: "",
          role: "",
          branch: "",
          studyType: "",
          phone: null,
          gender: "",
          isAdmin: false
        };
        
        localStorage.setItem("userData", JSON.stringify(userData));
        localStorage.setItem("profileCompleted", "false");
        localStorage.setItem("authStatus", "true");
        localStorage.setItem("fromSignup", "true");
        
        dispatch(login({ 
          userData: { 
            email: user.email, 
            name: user.displayName || "", 
            userID: user.uid 
          },
          status: true,
          profileCompleted: false
        }));
        
        navigate('/complete-profile', { replace: true });
        return;
      }
      

      const userData = {
        uid: user.uid,
        email: response.email,
        displayName: response.name || "",
        collegeName: response.collegeName || "",
        photoURL: user.photoURL,
        branch: response.branch?.toLowerCase().replace(/\s+/g, '_') || "",
        role: response.role || "",
      };
      
      localStorage.setItem("userData", JSON.stringify(userData));
      localStorage.setItem("authStatus", "true");
      
      // Check if profile is completed
      const isProfileCompleted = response.college && response.branch && response.role;
      localStorage.setItem("profileCompleted", true);
      
      dispatch(login({ 
        userData: { 
          email: user.email, 
          name: user.displayName || "", 
          userID: user.uid
        },
        status: true,
        profileCompleted: isProfileCompleted
      }));
      
      toast.success('Logged in successfully!');
      

      
      navigate('/home', { replace: true });
    } catch (error) {
      console.error(error);
      if (!isVerifying) {
        const errorMessage = error.code?.split("auth/")[1] || "unknown-error";
        toast.error(`Login failed: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // const handleGoogleLogin = async () => {
    //   try {
      //     const user = await authService.signInWithGoogle()
      //       const userString=JSON.stringify(user)
      //       localStorage.setItem("userData",userString)
      //       toast.success('Logged in with Google successfully!')
      //     navigate('/home')
      //   } catch (error) {
        //     console.error(error)
        //     toast.error('Google login failed. Please try again')
  //   }
  // };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (isVerifying) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`w-full max-w-md rounded-lg shadow-md p-8 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="text-center">
            <h1 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Verify your email
            </h1>
            <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              We've sent a verification link to your email. Please check your inbox and click the link to verify your account.
            </p>
            <div className='flex justify-center items-center'>
              <LoadingSpinner />
            </div>
            <p className={`mt-4 text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Don't forget to check your spam folder!
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <div className={`w-full max-w-md rounded-lg shadow-md p-8 ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="text-center mb-8">
          <h1 className={`text-3xl font-bold mb-2 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>Welcome back</h1>
          <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
            Login to your account to continue
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <InputField
              label={"Email"}
              type="email"
              placeholder="Enter your email"
              icon={<Mail size={18} />}
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              id="email"
            />
          </div>

          <div className="mb-6">
            <InputField
              label={"Password"}
              id="password"
              type="password"
              placeholder="Enter your password"
              icon={<Lock size={18} />}
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
            />
            <div className="flex justify-end mt-2">
              <Link to={"/forgot-password"}>
                <h2 className="text-blue-500 text-sm hover:underline">Forgot Password</h2>
              </Link>
            </div>
          </div>

          <div className="mb-6">
            <Button text="Login" isLoading={isLoading} loadingText={"Logging in..."} variant="primary" fullWidth disabled={isLoading} />
          </div>
        </form>

        {/* <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-gray-300 absolute w-full"></div>
          <div className="bg-white px-4 relative text-gray-500 text-sm">OR</div>
        </div>

        <div className="mb-6">
          <GoogleLoginButton onClick={handleGoogleLogin} disabled={isLoading} />
        </div> */}

        <div className={`text-center ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Don't have an account?{' '}
          <Link 
            to="/signup" 
            className="text-blue-500 text-sm inline-flex items-center"
          >
            Sign up <ArrowRight size={14} className="ml-1" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;