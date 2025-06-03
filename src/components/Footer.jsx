import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  const [email, setEmail] = React.useState("");

  const handleSubscribe = (e) => {
    e.preventDefault();
    console.log("Subscribed:", email);
    setEmail("");
  };

  // Social media links (replace with actual URLs)
  const socialLinks = [
    { icon: <FaFacebookF />, url: "https://facebook.com" },
    { icon: <FaTwitter />, url: "https://twitter.com" },
    { icon: <FaInstagram />, url: "https://instagram.com" },
    { icon: <FaLinkedinIn />, url: "https://linkedin.com" },
  ];

  return (
    <footer className="bg-primary text-white py-6 sm:py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          {/* Subscribe Section */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="bg-sunlit-gold p-1 rounded-md shadow-md">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold">Subscribe</h3>
            </div>
            <p className="text-white/70 text-sm">
              Get updates on Nigeria's heroes and news.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full px-3 py-1.5 rounded-md text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-sunlit-gold transition-all duration-200"
                required
              />
              <button
                type="submit"
                className="w-full bg-sunlit-gold hover:bg-primary text-primary hover:text-white px-4 py-1.5 rounded-md text-sm transition-all duration-200 hover:shadow-md hover:scale-105">
                Subscribe
              </button>
            </form>
          </div>

          {/* About Section */}
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-semibold">About Us</h3>
            <p className="text-white/70 text-sm">
              Know Your Heroes celebrates Nigeria's unsung heroes, sharing their
              inspiring stories and updates.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-semibold">Quick Links</h3>
            <ul className="space-y-1">
              {["Home", "About Us", "Nominate", "Winners", "News"].map(
                (item) => (
                  <li key={item}>
                    <a
                      href={`/${item.toLowerCase().replace(/ /g, "-")}`}
                      className="hover:underline hover:text-sunlit-gold text-sm transition-colors duration-200">
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Follow Us Section */}
          <div className="space-y-2">
            <h3 className="text-lg sm:text-xl font-semibold">Follow Us</h3>
            <p className="text-white/70 text-sm">Join our community!</p>
            <div className="flex space-x-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-sunlit-gold hover:scale-110 text-lg transition-all duration-200">
                  <span>{social.icon}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Row */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 sm:pt-6 border-t border-accent-cream/30">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-sunlit-gold" />
            <a href="tel:07000555666" className="hover:underline text-sm">
              Tel: 07000555666
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-sunlit-gold" />
            <a
              href="mailto:info@prideofnigeria.ng"
              className="hover:underline text-sm">
              info@prideofnigeria.ng
            </a>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-sunlit-gold" />
            <span className="text-sm">Lagos, Nigeria</span>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-4 sm:mt-6 text-center text-white/60 text-xs sm:text-sm">
          <p>
            © {new Date().getFullYear()} Pride of the world. All rights
            reserved.
          </p>
          <div className="mt-1 sm:mt-2">
            <a className="hover:underline hover:text-sunlit-gold">
              <span>Powered by Pride of the world</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
