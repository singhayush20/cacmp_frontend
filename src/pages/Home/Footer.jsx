import React from 'react';

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 px-10">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold mb-2">Contact Us</h3>
          <p className="text-sm">Agra Nagar Nigam</p>
          <p className="text-sm">Agra, Uttar Pradesh</p>
          <p className="text-sm">info@agranigam.com</p>
        </div>
        <div className="text-center md:text-right mt-4 md:mt-0">
          <p className="text-sm">&copy; {new Date().getFullYear()} City Municipal E-Connect</p>
          <p className="text-sm">All rights reserved</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
