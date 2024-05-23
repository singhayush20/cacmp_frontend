import { useState } from 'react';
import axios from "axios";
import { apiPrefixV1, baseUrl } from '../../constants/AppConstants';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { HiEye, HiEyeOff } from 'react-icons/hi';

function AdminPasswordResetPage() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [resettingPassword,setResettingPassword]=useState(false);
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordVerify, setNewPasswordVerify] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        if (email && email.trim().length === 0) {
            return;
        }
        setLoading(true);
        try {
            const response = await axios.get(`${baseUrl}/${apiPrefixV1}/user/password/reset`, { params: { email } });

            const code = response.data.code;
            if (code === 2000) {
                toast.success('OTP has been sent successfully', { autoClose: true, position: 'top-right', pauseOnHover: false });
            }
            else {
                toast.error(`${response.data.message}`, { autoClose: true, position: 'top-right', pauseOnHover: false });
            }
        } catch (error) {
            toast.error('Failed to send password reset link', { autoClose: true, position: 'top-right', pauseOnHover: false });
        }
        setLoading(false);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!email || email.trim().length === 0) {
            toast.error('Please enter a valid email address', { autoClose: true, position: 'top-right', pauseOnHover: false });
            return;
        }
        setResettingPassword(true);
        try {
            const response = await axios.put(`${baseUrl}/${apiPrefixV1}/user/password/change`, {
                email,
                otp,
                newPassword,
            });

            const code = response.data.code;
            if (code === 2000) {
                toast.success('Password has been reset successfully!', { autoClose: true, position: 'top-right', pauseOnHover: false });
                navigate(-1);
            } else {
                toast.error(`${response.data.message}`, { autoClose: true, position: 'top-right', pauseOnHover: false });
            }
        } catch (error) {
            toast.error("Some error occurred", { autoClose: true, position: 'top-right', pauseOnHover: false });
        }
        setResettingPassword(false);
    };

    return (
        <div className="container">
            <nav className="admin-login-navbar">
                <Link to='/admin' className='nav-link'><h1 className="text-2xl font-bold ml-2">Admin Password Reset</h1></Link>
            </nav>
            <div className='max-w-[600px] mx-auto border rounded-lg p-8 my-10 bg-gray-100'>
                <h1 className='text-2xl font-bold mb-4'>Reset Account Password</h1>
                <form >
                    <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email Address</label>
                    <div className="mb-4 flex flex-row items-center gap-2">
                        <input
                            type="email"
                            id="email"
                            className=" px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 flex-1"
                            placeholder="Enter your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}

                        />

                        <button
                            type="submit"
                            className="  bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:bg-blue-600"
                            disabled={loading}
                            onClick={handleSendOTP}
                        >
                            {loading ? 'Sending...' : 'Send OTP'}
                        </button>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="otp" className="block text-gray-700 font-bold mb-2">OTP</label>
                        <input
                            type="text"
                            id="otp"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="newPassword" className="block text-gray-700 font-bold mb-2">New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="newPassword"
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                placeholder="Enter new password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <HiEyeOff /> : <HiEye />}
                            </button>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label htmlFor="newPasswordVerify" className="block text-gray-700 font-bold mb-2">Verify New Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="newPasswordVerify"
                                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                                placeholder="Enter new password again"
                                value={newPasswordVerify}
                                onChange={(e) => setNewPasswordVerify(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? <HiEyeOff /> : <HiEye />}
                            </button>
                        </div>
                    </div>
                    <div className="mb-4 flex justify-center">
                        <button
                            type="submit"
                            onClick={handleResetPassword}
                            className="w-[1/2] bg-green-500 text-white font-bold py-2 px-4 hover:bg-green-700 rounded-md focus:outline-none focus:bg-blue-600"
                            disabled={resettingPassword}
                        >
                            {resettingPassword ? 'Resetting...' : 'Reset Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AdminPasswordResetPage;
