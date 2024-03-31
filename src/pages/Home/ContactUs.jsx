import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import axios from 'axios';
import { baseUrl, apiPrefixV1 } from '../../constants/AppConstants';
import { toast } from 'react-toastify';
import LoadingIndicator2 from '../../components/LoadingIndicator2/LoadingIndicator2';
import { useNavigate } from 'react-router-dom';

function ContactUs() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        message: ''
    });
    const [formErrors, setFormErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const navigate=useNavigate();
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                setIsLoading(true);
                const response = await axios.post(`${baseUrl}/${apiPrefixV1}/query/new`, {
                    name: formData.fullName,
                    email: formData.email,
                    phone: formData.phone,
                    message: formData.message,
                });
                console.log(response.data);
                let code = response.data.code;
                if (code === 2000) {
                    navigate(-1);
                } else if (code === 2003) {
                    dispatch(logout());
                    toast.info("Login again!", { autoClose: true, position: 'top-right', pauseOnHover: false });
                    navigate('/login');
                } else {
                    toast.error("Failed to save article.", { autoClose: true, position: 'top-right', pauseOnHover: false });
                }
            } catch (error) {
                console.log(error.message);
                toast.error("An error occurred while saving the article.", { autoClose: true, position: 'top-right', pauseOnHover: false });
            } finally {
                setIsLoading(false);
            }
        }
    };

    const validateForm = () => {
        let isValid = true;
        const errors = {};

        if (formData.fullName.trim().length === 0) {
            errors.fullName = 'Name is required';
            isValid = false;
        }

        if (formData.email.trim().length === 0) {
            errors.email = 'Email is required';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            errors.email = 'Email is invalid';
            isValid = false;
        }

        if (formData.phone.trim().length === 0) {
            errors.phone = 'Phone is required';
            isValid = false;
        } else if (!/^\d{10}$/.test(formData.phone)) {
            errors.phone = 'Phone number is not valid';
            isValid = false;
        }

        if (formData.message.trim().length === 0) {
            errors.message = 'Message is required';
            isValid = false;
        }
        if(formData.message.length>500){
            errors.message = 'Max 500 characters are allowed!';
            isValid = false;
        }

        setFormErrors(errors);

        return isValid;
    };



    return (
        <div className="bg-slate-100">
            <Header />
            <div className="container mx-auto px-4 py-10">
                <h1 className="text-4xl font-bold text-slate-800 mb-8">Contact Us</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4">Our Offices</h2>
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold">Headquarters</h3>
                            <p>123 City Hall Avenue</p>
                            <p>Your City, State 12345</p>
                            <p>Email: info@citymunicipal.com</p>
                            <p>Phone: +123 456 7890</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">Branch Office</h3>
                            <p>456 Municipal Street</p>
                            <p>City Center, State 67890</p>
                            <p>Email: branch@citymunicipal.com</p>
                            <p>Phone: +987 654 3210</p>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-md">
                        <h2 className="text-xl font-bold mb-4">Send us a Message</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2" htmlFor="name">Name</label>
                                <input className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500" type="text" id="name" name="fullName" value={formData.fullName} onChange={handleChange} />
                                {formErrors.fullName && (
                                    <span className="error-message">{formErrors.fullName}</span>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">Email</label>
                                <input className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500" type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                                {formErrors.email && (
                                    <span className="error-message">{formErrors.email}</span>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2" htmlFor="phone">Phone</label>
                                <input className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500" type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                                {formErrors.phone && (
                                    <span className="error-message">{formErrors.phone}</span>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2" htmlFor="message">Message</label>
                                <textarea className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500" id="message" name="message" rows="4" value={formData.message} onChange={handleChange}></textarea>
                                {formErrors.message && (
                                    <span className="error-message">{formErrors.message}</span>
                                )}
                            </div>
                            {
                                (isLoading) ? <div className="loading"><LoadingIndicator2 color="#36d7b7" size={20} /></div> : <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg" type="submit">Send Message</button>
                            }
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default ContactUs;
