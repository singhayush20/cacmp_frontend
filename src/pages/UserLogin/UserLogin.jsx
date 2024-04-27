import { useState } from 'react';
import './UserLogin.css'
import axios from "axios";
import { apiPrefixV1, baseUrl } from '../../constants/AppConstants';
import { login as authLogin } from '../../redux/slices/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import LoadingIndicator1 from '../../components/LoadingIndicator1/LoadingIndicator1';
const UserLogin = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const login = async (event) => {
        event.preventDefault();

        setIsLoading(true)

        try {
            const response = await axios.post(
                `${baseUrl}/${apiPrefixV1}/department/login`, {
                "username": username,
                "password": password
            }
            )

            if (response.data['code'] === 2000) {
                const userData = response.data['data'];
                if (userData) dispatch(authLogin({ userData: userData, loggedInAccountType: 'department' }));
                navigate('/dashboard')
            }
            else {
                toast.error("Failed to login", { autoClose: true, position: 'top-right', pauseOnHover: false });
            }

            setError(response.data['message'])
        }

        catch (err) {
            setError(err.message)
        }
        finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <nav className="dept-login-nav-bar">
                <Link to='/' className='dept-nav-link'><h1>Municipal E-Connect</h1></Link>
            </nav>
            <div className="login">
                <div className="login-page-heading">
                    <h1>CACMP Department Login</h1>
                </div>
                <p className="subheading">Login using your department credentials</p>
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
                        {isLoading ? <LoadingIndicator1 color="#36c2d6" size={40} /> : <button type='submit' >Login</button>}
                    </form>
                </div>
            </div>
        </>
    );

}

export default UserLogin;