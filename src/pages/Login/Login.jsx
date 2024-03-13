import { useState } from 'react';
import './Login.css'
import axios from "axios";
import { apiPrefixV1, baseUrl } from '../../constants/AppConstants';
import { login as authLogin } from '../../redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };


    const login = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                `${baseUrl}/${apiPrefixV1}/user/login`, {
                "username": username,
                "password": password
            }
            )

            if (response.data['code'] === 2000) {
                const userData = response.data['data'];
                if (userData) dispatch(authLogin({ userData: userData, loggedInAccountType: 'admin' }));
                toast.success("Logged in!", { autoClose: true, position: 'top-right', pauseOnHover: false });
                navigate('/admin/dashboard/')
            }
            else {
                setError(response.data['message'])
                toast.error("Failed to login", { autoClose: true, position: 'top-right', pauseOnHover: false });
            }
        }
        catch (err) {
            setError(err.message)
            toast.error("Some error occurred!", { autoClose: true, position: 'top-right', pauseOnHover: false });
        }
    }

    return (
        <div className="container">
            <nav className="navbar">
                <Link to='/' className='nav-link'><h1>CACMP E-Seva</h1></Link>
            </nav>
            <div className="login">

                <div className="login-page-heading">
                    <h1>CACMP Admin Login</h1>
                </div>
                <p className="subheading">Login using your admin credentials</p>
                <div className="login-form-container">
                    <h1 className="login-heading">Login</h1>
                    <form className="login-form" onSubmit={login}>
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
                        <button type='submit' >Login</button>
                    </form>
                </div>
            </div>
        </div>
    )

}

export default Login;