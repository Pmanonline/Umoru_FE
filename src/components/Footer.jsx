// UMORUS-POR.../client/src/components/Footer.jsx
import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleTheme } from "../features/Theme/themeSlice";

const Footer = () => {
  const [email, setEmail] = React.useState("");
  const dispatch = useDispatch();
  const { mode } = useSelector((state) => state.theme);

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log("Subscribed:", email);
    setEmail("");
  };

  // Social media links (replace with Segun's actual URLs)
  const socialLinks = [
    { icon: <FaFacebookF />, url: "https://facebook.com/segunumoru" },
    { icon: <FaTwitter />, url: "https://twitter.com/segunumoru" },
    { icon: <FaInstagram />, url: "https://instagram.com/segunumoru" },
    { icon: <FaLinkedinIn />, url: "https://linkedin.com/in/segunumoru" },
  ];

  // Quick links for Segun's portfolio
  const quickLinks = [
    { label: "Home", url: "/" },
    { label: "About", url: "/about-us" },
    { label: "Services", url: "/services" },
    { label: "Podcast", url: "/podcast" },
    { label: "Resources", url: "/resources" },
    { label: "Blog", url: "/blog" },
    { label: "Shop", url: "/shop" },
    { label: "Contact", url: "/contact" },
  ];

  return (
    <footer className="bg-primary dark:bg-[#1A1A2E] text-white dark:text-white py-6 sm:py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Subscribe Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="bg-secondary dark:bg-secondary-darkMode p-1 rounded-md shadow-md">
                <Mail className="h-5 w-5 text-primary dark:text-primary-darkMode" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold">Subscribe</h3>
            </div>
            <p className="text-white/70 dark:text-white/70 text-sm">
              Get updates on coaching, data science, and spiritual growth.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full px-3 py-1.5 rounded-md text-gray-800 dark:text-white bg-white dark:bg-accent-creamDark focus:outline-none focus:ring-2 focus:ring-secondary dark:focus:ring-secondary-darkMode transition-all duration-200"
                required
              />
              <button
                type="submit"
                className="w-full bg-secondary dark:bg-secondary-darkMode hover:bg-secondary-light dark:hover:bg-secondary-darkMode text-white px-4 py-1.5 rounded-md text-sm transition-all duration-200 hover:shadow-md hover:scale-105">
                Subscribe
              </button>
            </form>
          </div>

          {/* About Section */}
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-semibold">About Segun</h3>
            <p className="text-white/70 dark:text-white/70 text-sm">
              Segun Umoru is a Data Scientist, Life Coach, and Spiritual Guide,
              empowering individuals through faith and data.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-semibold">Quick Links</h3>
            <ul className="space-y-1">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.url}
                    className="hover:underline hover:text-secondary dark:hover:text-secondary-darkMode text-sm transition-colors duration-200">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Us & Theme Toggle Section */}
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-semibold">Follow & Theme</h3>
            <p className="text-white/70 dark:text-white/70 text-sm">
              Join our community and switch themes!
            </p>
            <div className="flex flex-col space-y-3">
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white dark:text-white hover:text-secondary dark:hover:text-secondary-darkMode hover:scale-110 text-lg transition-all duration-200">
                    <span>{social.icon}</span>
                  </a>
                ))}
              </div>
              <button
                onClick={() => dispatch(toggleTheme())}
                className="p-2 rounded-full bg-accent-cream dark:bg-accent-creamDark hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center justify-center">
                {mode === "light" ? (
                  <svg
                    className="w-6 h-6 text-secondary dark:text-secondary-darkMode"
                    fill="currentColor"
                    viewBox="0 0 24 24">
                    <path d="M12 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm0 15a5 5 0 100-10 5 5 0 000 10zm9-5a1 1 0 011 1h-1a1 1 0 11-2 0h-1a1 1 0 011-1zm-17 0a1 1 0 011 1h-1a1 1 0 11-2 0h-1a1 1 0 011-1zm15.071-7.071a1 1 0 011.414 0 1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707zM5.636 17.364a1 1 0 011.414 0 1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707zM4.929 4.929a1 1 0 011.414 0 1 1 0 010 1.414L5.636 7.05A1 1 0 014.22 5.636l.707-.707zm12.728 12.728a1 1 0 011.414 0 1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707zM12 20a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1z" />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6 text-secondary dark:text-secondary-darkMode"
                    fill="currentColor"
                    viewBox="0 0 24 24">
                    <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Contact Row */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 sm:pt-6 border-t border-accent-cream/30 dark:border-accent-creamDark/30">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-secondary dark:text-secondary-darkMode" />
            <a href="tel:+2348005556666" className="hover:underline text-sm">
              Tel: +234 813 114 5200
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-secondary dark:text-secondary-darkMode" />
            <a
              href="mailto:segun@segunumoru.com"
              className="hover:underline text-sm">
              segun@segunumoru.com
            </a>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-secondary dark:text-secondary-darkMode" />
            <span className="text-sm">Lagos, Nigeria</span>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-4 sm:mt-6 text-center text-white/60 dark:text-white/60 text-xs sm:text-sm">
          <p>© {new Date().getFullYear()} Segun Umoru. All rights reserved.</p>
          <div className="mt-1 sm:mt-2">
            <a className="hover:underline hover:text-secondary dark:hover:text-secondary-darkMode">
              Powered by Segun Umoru Portfolio
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
