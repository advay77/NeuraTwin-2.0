"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
// import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <footer className="bg-gradient-to-b from-neutral-900 via-neutral-950 to-black py-16 ">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 64 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 64 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="container mx-auto px-4 md:px-6 flex flex-col items-center"
      >
        {/* Website Name */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-8 text-4xl md:text-5xl font-extrabold text-white tracking-tight bg-gradient-to-r from-indigo-400 via-sky-400 to-indigo-600 bg-clip-text text-transparent drop-shadow-lg"
        >
          NeuraTwin
        </motion.div>
        {/* Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mb-10 flex flex-wrap justify-center gap-8 text-white font-semibold text-lg"
        >
          <a
            href="#"
            className="hover:text-indigo-400 transition-colors duration-200"
          >
            Home
          </a>
          <a
            href="#"
            className="hover:text-indigo-400 transition-colors duration-200"
          >
            About
          </a>
          <a
            href="#"
            className="hover:text-indigo-400 transition-colors duration-200"
          >
            Services
          </a>
          <a
            href="#"
            className="hover:text-indigo-400 transition-colors duration-200"
          >
            Products
          </a>
          <a
            href="#"
            className="hover:text-indigo-400 transition-colors duration-200"
          >
            Contact
          </a>
        </motion.nav>
        {/* Social Icons */}
        {/* <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={
            inView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
          }
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mb-10 flex space-x-5"
        >
          <a
            href="#"
            className="group rounded-full border border-neutral-700 p-3 hover:bg-indigo-500/20 transition duration-200 shadow-lg"
          >
            <Facebook className="h-6 w-6 text-white group-hover:text-indigo-400 transition" />
            <span className="sr-only">Facebook</span>
          </a>
          <a
            href="#"
            className="group rounded-full border border-neutral-700 p-3 hover:bg-indigo-500/20 transition duration-200 shadow-lg"
          >
            <Twitter className="h-6 w-6 text-white group-hover:text-indigo-400 transition" />
            <span className="sr-only">Twitter</span>
          </a>
          <a
            href="#"
            className="group rounded-full border border-neutral-700 p-3 hover:bg-indigo-500/20 transition duration-200 shadow-lg"
          >
            <Instagram className="h-6 w-6 text-white group-hover:text-indigo-400 transition" />
            <span className="sr-only">Instagram</span>
          </a>
          <a
            href="#"
            className="group rounded-full border border-neutral-700 p-3 hover:bg-indigo-500/20 transition duration-200 shadow-lg"
          >
            <Linkedin className="h-6 w-6 text-white group-hover:text-indigo-400 transition" />
            <span className="sr-only">LinkedIn</span>
          </a>
        </motion.div> */}
        {/* Newsletter */}
        <motion.form
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mb-10 w-full max-w-md flex space-x-2"
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-grow rounded-full px-5 py-3 bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          />
          <button
            type="submit"
            className="rounded-full bg-gradient-to-r from-indigo-500 via-sky-500 to-indigo-700 text-white px-8 py-3 font-bold hover:from-indigo-600 hover:to-indigo-800 transition"
          >
            Subscribe
          </button>
        </motion.form>
        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="text-center"
        >
          <p className="text-sm text-neutral-400">
            © 2024 NeuraTwin. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </footer>
  );
}
