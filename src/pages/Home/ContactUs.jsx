import React, { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
function ContactUs() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
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
                                <input className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500" type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2" htmlFor="email">Email</label>
                                <input className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500" type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2" htmlFor="phone">Phone</label>
                                <input className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500" type="text" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 font-semibold mb-2" htmlFor="message">Message</label>
                                <textarea className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500" id="message" name="message" rows="4" value={formData.message} onChange={handleChange}></textarea>
                            </div>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg" type="submit">Send Message</button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default ContactUs;
