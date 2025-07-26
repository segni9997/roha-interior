"use client";

import { useState } from "react";
import { Menu, X, Phone, Mail } from "lucide-react";
import logo from "../assets/roha.png";
import ModelHero from "./modelmakingHero";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (

      <>
          <nav className="relative bg-white shadow-lg">
      {/* Top contact bar */}
      <div className="bg-[#395e63] text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>+251 923-4567</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>info@roha.com</span>
            </div>
          </div>
          {/* <div className="hidden md:block text-xs">
            {"Award-winning architectural design since 1995"}
          </div> */}
        </div>
      </div>

      {/* Main navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <div className="relative">
              <img src={logo} className="w-8 h-8" />
            </div>
            <div className="ml-3">
              <h1 className="text-2xl font-bold text-slate-800">
                Roha Model Makers
              </h1>
              <p className="text-xs text-slate-500 tracking-wider">
                ARCHITECTURE & DESIGN
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a
                href="#"
                className="relative group px-3 py-2 text-slate-700 hover:text-slate-900 font-medium transition-colors duration-300"
              >
                Home
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#395e63] group-hover:w-full transition-all duration-300"></div>
              </a>
              <a
                href="#"
                className="relative group px-3 py-2 text-slate-700 hover:text-slate-900 font-medium transition-colors duration-300"
              >
                Projects
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#395e63] group-hover:w-full transition-all duration-300"></div>
              </a>
              <a
                href="#"
                className="relative group px-3 py-2 text-slate-700 hover:text-slate-900 font-medium transition-colors duration-300"
              >
                360 Gallery
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#395e63] group-hover:w-full transition-all duration-300"></div>
              </a>
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <button
              className="relative px-6 py-3 bg-[#5b949b] text-white font-semibold overflow-hidden group transition-all duration-300 hover:bg-slate-900"
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 12px) 0, 100% 100%, 12px 100%)",
              }}
            >
              <span className="relative z-10">Get Intouch</span>
              <div
                className="absolute inset-0 bg-[#395e63] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"
                style={{
                  clipPath:
                    "polygon(0 0, calc(100% - 12px) 0, 100% 100%, 12px 100%)",
                }}
              ></div>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-950"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-slate-50 border-t">
          <a
            href="#"
            className="block px-3 py-2 text-slate-700 hover:text-slate-900 hover:bg-white rounded-md font-medium transition-colors duration-200"
          >
            Home
          </a>
          <a
            href="#"
            className="block px-3 py-2 text-slate-700 hover:text-slate-900 hover:bg-white rounded-md font-medium transition-colors duration-200"
          >
            Projects
          </a>
          <a
            href="#"
            className="block px-3 py-2 text-slate-700 hover:text-slate-900 hover:bg-white rounded-md font-medium transition-colors duration-200"
          >
            Services
          </a>
          <a
            href="#"
            className="block px-3 py-2 text-slate-700 hover:text-slate-900 hover:bg-white rounded-md font-medium transition-colors duration-200"
          >
            About
          </a>
          <a
            href="#"
            className="block px-3 py-2 text-slate-700 hover:text-slate-900 hover:bg-white rounded-md font-medium transition-colors duration-200"
          >
            Contact
          </a>
          <div className="px-3 py-2">
            <button className="w-full px-4 py-2 bg-[#395e63] text-white font-semibold rounded-md hover:bg-slate-900 transition-colors duration-200">
              Get InTouch
            </button>
          </div>
        </div>
      </div>

      {/* Decorative geometric element */}
      <div
        className="absolute top-0 right-0 w-96 h-7 bg-gradient-to-r from-[#395e63] to-[#5b949b] opacity-80"
        style={{
          clipPath: "polygon(20% 0%, 100% 0%, 80% 100%, 0% 100%)",
        }}
      ></div>
          </nav>
          
          <ModelHero/>
      </>

  );
}
