import React from 'react'
import Projects from './Projects'
import { motion } from 'framer-motion'

const sectionStyle = 'max-w-7xl mx-auto px-4 py-24 lg:py-32'

const Home = () => (
  <div id="home">
    {/* Hero */}
    <section className={`${sectionStyle} text-center`}>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-5xl font-extrabold text-sky-700 mb-6"
      >
        Welcome to ProjectEase
      </motion.h1>
      <p className="text-lg text-gray-600 max-w-2xl mx-auto">
        CodeSalah - Build Fast, Submit Faster. <br />
        Get production-ready projects with zero hassle.
      </p>
      <motion.a
        href="#projects"
        whileTap={{ scale: 0.95 }}
        className="btn-gradient inline-block mt-10 text-white px-8 py-3 rounded-lg font-medium"
      >
        View Projects
      </motion.a>
    </section>

    {/* Projects */}
    <Projects />

    {/* About */}
    <section id="about" className={sectionStyle}>
      <h2 className="text-3xl font-bold text-sky-700 mb-4">About Us</h2>
      <p className="text-gray-600 leading-relaxed">
        ProjectEase is a student-centric service from CodeSalah, dedicated to
        delivering high-quality academic and industrial projects in record
        time. Our expert developers, designers, and mentors collaborate to
        ensure your project is not only delivered quickly but also meets the
        highest standards of code quality and documentation.
      </p>
    </section>

    {/* Reach Us */}
    <section id="contact" className={`${sectionStyle} pb-32`}>
      <h2 className="text-3xl font-bold text-sky-700 mb-4">Reach Us</h2>
      <p className="text-gray-600">
        Email: support@projectease.com <br />
        Phone: +91 98765 43210
      </p>
    </section>
  </div>
)

export default Home
