import React from "react";
import { ChevronRight } from "lucide-react";
import Diamond from "../assets/images/diamond.png";
import { Link } from "react-router-dom";

const AboutUsPage = () => {
  return (
    <section className="w-full py-8 sm:py-12 md:py-16 px-4 bg-accent-cream mt-8">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex mx-auto justify-center items-center">
            <span className="mx-3 sm:mx-5 mt-4">
              <img src={Diamond} alt="Diamond Icon" />
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary mb-4">
              About The Pride of the World
            </h1>
            <span className="mx-3 sm:mx-5 mt-4">
              <img src={Diamond} alt="Diamond Icon" />
            </span>
          </div>
          <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto">
            Celebrating the world's extraordinary individuals and organizations
            shaping a brighter future for all
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-xl p-6 sm:p-8 mb-8 sm:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-4 sm:mb-6">
            Celebrating Global Excellence
          </h2>
          <p className="text-gray-700 mb-4 sm:mb-6">
            Welcome to The Pride of the World, a platform dedicated to
            celebrating the extraordinary individuals and organizations shaping
            a brighter future for humanity. We spotlight heroes, innovators,
            leaders, and changemakers who inspire the world through their
            achievements, resilience, and contributions to global society.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              "Showcase Global Excellence – Highlight individuals making an impact worldwide",
              "Inspire Future Leaders – Share stories of perseverance and global impact",
              "Foster Unity – Unite the world through shared accomplishments",
            ].map((item, index) => (
              <div
                key={index}
                className="bg-accent-cream p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <ChevronRight className="text-primary" />
                </div>
                <p className="text-gray-800 text-sm sm:text-base">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Our Story Section */}
        <div className="flex flex-col md:flex-row gap-6 sm:gap-8 mb-12 sm:mb-16">
          <div className="md:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
              alt="Our Story"
              className="w-full h-auto rounded-xl object-cover"
            />
          </div>
          <div className="md:w-1/2">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-4 sm:mb-6">
              Our Story
            </h2>
            <p className="text-gray-700 mb-4 text-sm sm:text-base">
              Founded in 2023, The Pride of the World emerged from a vision to
              amplify the voices of those driving positive change globally. The
              world is home to countless talented individuals—artists,
              entrepreneurs, scientists, athletes, and activists—who deserve
              recognition.
            </p>
            <p className="text-gray-700 text-sm sm:text-base">
              Through profiles, interviews, and features, we bring these stories
              to life, ensuring that the world's brightest stars are celebrated
              and their journeys documented for future generations.
            </p>
          </div>
        </div>

        {/* What We Do Section */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-6 sm:mb-8 text-center">
            What We Do
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                title: "Global Spotlights",
                description:
                  "We feature weekly and monthly profiles of exceptional individuals from around the world.",
                icon: "👑",
              },
              {
                title: "Community Impact",
                description:
                  "We highlight global initiatives, NGOs, and social enterprises transforming lives worldwide.",
                icon: "🤝",
              },
              {
                title: "Events & Awards",
                description:
                  "We organize annual recognition awards to honor outstanding contributions globally.",
                icon: "🏆",
              },
              {
                title: "Youth Empowerment",
                description:
                  "Through partnerships, we provide mentorship, scholarships, and opportunities for young global leaders.",
                icon: "🚀",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="bg-white p-4 sm:p-6 rounded-xl hover:shadow-md transition-all">
                <div className="text-3xl sm:text-4xl mb-4">{item.icon}</div>
                <h3 className="text-lg sm:text-xl font-bold text-primary mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-700 text-sm sm:text-base">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Core Values */}
        <div className="bg-primary text-white rounded-xl p-6 sm:p-8 mb-12 sm:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 text-center">
            Our Core Values
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {[
              {
                value: "Excellence",
                description: "We celebrate the best of humanity",
                emoji: "✨",
              },
              {
                value: "Unity",
                description: "We bridge divides through shared success",
                emoji: "🤝",
              },
              {
                value: "Innovation",
                description: "We embrace creativity and progress",
                emoji: "💡",
              },
              {
                value: "Impact",
                description: "We measure success by lives changed",
                emoji: "🌍",
              },
            ].map((item, index) => (
              <div key={index} className="text-center p-4">
                <div className="text-2xl sm:text-3xl mb-2">{item.emoji}</div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">
                  {item.value}
                </h3>
                <p className="text-sm sm:text-base">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Gallery Section */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-6 sm:mb-8 text-center">
            Our Journey in Pictures
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
                alt: "Global Team Photo",
              },
              {
                src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
                alt: "Global Award Ceremony",
              },
              {
                src: "https://images.unsplash.com/photo-1524179091875-bf99a9a6af57?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
                alt: "Youth Empowerment Workshop",
              },
              {
                src: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=761&q=80",
                alt: "Featured Global Hero",
              },
            ].map((image, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-40 sm:h-48 object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="p-3 bg-white">
                  <p className="text-sm text-gray-600">{image.alt}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-primary to-secondary text-white rounded-xl p-6 sm:p-8 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4">
            Join the Global Movement
          </h2>
          <p className="mb-4 sm:mb-6 max-w-2xl mx-auto text-sm sm:text-base">
            Together, let's redefine the world's narrative—one story at a time.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-6 sm:mb-8">
            <Link to={"/nominate"}>
              <button className="bg-white text-primary px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold hover:bg-gray-100 transition-colors">
                Nominate a Hero
              </button>
            </Link>
            <Link to={"/fund"}>
              <button className="bg-transparent border-2 border-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold hover:bg-white hover:text-primary transition-colors">
                Partner With Us
              </button>
            </Link>
          </div>

          <div className="flex justify-center gap-4">
            <a
              href="#"
              className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all">
              <span className="sr-only">Facebook</span>
              <span>f</span>
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all">
              <span className="sr-only">Twitter</span>
              <span>𝕏</span>
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all">
              <span className="sr-only">Instagram</span>
              <span>📸</span>
            </a>
            <a
              href="#"
              className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center hover:bg-opacity-30 transition-all">
              <span className="sr-only">LinkedIn</span>
              <span>in</span>
            </a>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 sm:mt-12 text-center text-gray-600">
          <p className="font-bold text-lg sm:text-xl mb-2">
            The Pride of the World
          </p>
          <p>Lagos, Nigeria</p>
          <p>contact@theprideofworld.org</p>
          <p>Tel: 07000555666</p>
          <p className="mt-4">www.theprideofworld.org</p>
        </div>
      </div>
    </section>
  );
};

export default AboutUsPage;
