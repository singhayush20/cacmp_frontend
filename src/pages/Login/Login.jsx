import { useState } from 'react';
import './Login.css';
import axios from "axios";
import { apiPrefixV1, baseUrl } from '../../constants/AppConstants';
import { login as authLogin } from '../../redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingIndicator1 from '../../components/LoadingIndicator1/LoadingIndicator1';
const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const login = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post(
                `${baseUrl}/${apiPrefixV1}/user/login`, {
                "username": username,
                "password": password
            }
            );

            if (response.data['code'] === 2000) {
                const userData = response.data['data'];
                if (userData) dispatch(authLogin({ userData: userData, loggedInAccountType: 'admin' }));
                toast.success("Logged in!", { autoClose: true, position: 'top-right', pauseOnHover: false });
                navigate('/admin/dashboard/')
            } else {
                toast.error("Failed to login", { autoClose: true, position: 'top-right', pauseOnHover: false });
            }
        } catch (err) {
            toast.error("Some error occurred!", { autoClose: true, position: 'top-right', pauseOnHover: false });
        }
        setIsLoading(false);
    }

    return (
        <div className="container">
            <nav className="admin-login-navbar">
                <div className="left-nav">
                    <Link to='/' className='nav-link'><h1>Municipal Hub</h1></Link>
                </div>
            </nav>
            <div className="admin-login">

                <div className="admin-login-page-heading">
                    <h1>Admin Login</h1>
                </div>
                <p className="admin-login-subheading">Login using your admin credentials</p>
                <div className="admin-login-form-container">
                    <h1 className="admin-login-heading">Login</h1>
                    <form className="admin-login-form" onSubmit={login}>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={handleUsernameChange}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                        {isLoading ? <LoadingIndicator1 color="white" size={40} /> : <button className='admin-login-button' type="submit">Login</button>}
                        <div className="password-reset">
                            <Link to="/admin/password-reset" className="password-reset-link">Forgot Password?</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )

}

export default Login;
