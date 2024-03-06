import React from "react";
import Header from '../../components/Header/Header';
import './Home.css'; // Import your CSS file for styling

const Home = () => {
    return (
        <>
            <Header />
            <main className="home-container">
                <section className="hero-section">
                    <div className="hero-content">
                        <h1>Welcome to Our Municipal Complaints Portal</h1>
                        <p>Your go-to destination for addressing community issues!</p>
                    </div>
                </section>

                <section className="feature-section">
                    <div className="feature">
                        <h2>Report a Complaint</h2>
                        <p>Report any civic issues such as potholes, garbage collection, street lights, etc. Let's work together to improve our city!</p>
                    </div>
                    <div className="feature">
                        <h2>Track Your Complaints</h2>
                        <p>Stay updated on the status of your complaints. Track their progress from submission to resolution.</p>
                    </div>
                    <div className="feature">
                        <h2>Get Involved</h2>
                        <p>Participate in community discussions, volunteer for initiatives, and contribute to making our city a better place to live.</p>
                    </div>
                </section>

           

                <footer className="footer">
                    <p>&copy; 2024 Your Municipal Corporation. All rights reserved.</p>
                </footer>
            </main>
        </>
    );
}

export default Home;
