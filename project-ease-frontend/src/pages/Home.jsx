import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Users, CheckCircle, Code, Smartphone, Monitor, Brain, Mail, Phone, MapPin } from 'lucide-react'
import axios from 'axios'

const Home = () => {
  const [featuredProjects, setFeaturedProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchFeaturedProjects = async () => {
      try {
        const { data } = await axios.get('/projects')
        setFeaturedProjects(data.projects.slice(0, 6))
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFeaturedProjects()
  }, [])

  const categoryIcons = {
    web: Monitor,
    mobile: Smartphone,
    desktop: Monitor,
    'ai-ml': Brain,
    other: Code
  }

  const stats = [
    { number: '500+', label: 'Projects Completed' },
    { number: '24/7', label: 'Support Available' },
    { number: '99%', label: 'Success Rate' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section id="home" className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100" />
        <div className="relative max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  Build Fast,
                  <span className="bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent">
                    {' '}Submit Faster
                  </span>
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  From concept to deployment, we deliver high-quality projects that exceed expectations. 
                  Join thousands of satisfied clients who chose ProjectEase for their success.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/projects"
                  className="btn-gradient text-white px-8 py-4 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-shadow"
                >
                  Explore Projects
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/signup"
                  className="border-2 border-sky-300 text-sky-700 px-8 py-4 rounded-lg font-semibold hover:bg-sky-50 transition-colors text-center"
                >
                  Get Started Free
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-8">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-2xl font-bold text-sky-600">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8">
                <div className="aspect-video bg-gradient-to-br from-sky-100 to-blue-100 rounded-xl mb-6 flex items-center justify-center">
                  <Code className="w-16 h-16 text-sky-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Ready to Start?</h3>
                <p className="text-gray-600 mb-4">
                  Choose from our extensive project catalog or request a custom solution.
                </p>
                <div className="flex items-center gap-2 text-sky-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="text-sm font-medium">Professional Quality Guaranteed</span>
                </div>
              </div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-sky-200 rounded-full opacity-20" />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-blue-200 rounded-full opacity-20" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section id="projects" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Featured Projects
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Discover our most popular projects, crafted with cutting-edge technologies 
                and delivered with excellence.
              </p>
            </motion.div>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-gray-100 rounded-xl h-64 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects.map((project, index) => {
                const CategoryIcon = categoryIcons[project.category] || Code
                const primaryImage = project.images?.find(img => img.isPrimary) || project.images?.[0]
                
                return (
                  <motion.div
                    key={project._id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ y: -8 }}
                    className="group"
                  >
                    <Link to={`/projects/${project._id}`} className="block">
                      <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow overflow-hidden">
                        {/* Project Image */}
                        <div className="aspect-video overflow-hidden">
                          {primaryImage ? (
                           <img
  src={`${import.meta.env.VITE_API_URL.replace('/api','')}${primaryImage.url}`}
  alt={primaryImage.alt || project.name}
  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
/>

                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-sky-100 to-blue-100 flex items-center justify-center">
                              <CategoryIcon className="w-12 h-12 text-sky-500" />
                            </div>
                          )}
                        </div>

                        {/* Project Info */}
                        <div className="p-6">
                          <div className="flex items-center justify-between mb-3">
                            <span className="px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-sm font-medium capitalize">
                              {project.category}
                            </span>
                            <div className="flex items-center gap-1 text-yellow-500">
                              <Star className="w-4 h-4 fill-current" />
                              <span className="text-sm font-medium text-gray-600">4.9</span>
                            </div>
                          </div>

                          <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-sky-600 transition-colors">
                            {project.name}
                          </h3>
                          
                          <p className="text-gray-600 mb-4 line-clamp-2">
                            {project.description}
                          </p>

                          {/* Tech Stack Preview */}
                          <div className="flex flex-wrap gap-1 mb-4">
                            {[
                              ...(project.technologies?.frontend || []).slice(0, 2),
                              ...(project.technologies?.backend || []).slice(0, 1)
                            ].slice(0, 3).map((tech, techIndex) => (
                              <span
                                key={techIndex}
                                className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                              >
                                {tech}
                              </span>
                            ))}
                            {((project.technologies?.frontend?.length || 0) + (project.technologies?.backend?.length || 0)) > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                +{((project.technologies?.frontend?.length || 0) + (project.technologies?.backend?.length || 0)) - 3} more
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-2xl font-bold text-green-600">
                              ₹{project.price?.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500">
                              {project.duration}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 btn-gradient text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
            >
              View All Projects
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                About ProjectEase
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We're a team of passionate developers dedicated to helping students and professionals 
                bring their project ideas to life with cutting-edge technology and exceptional service.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: CheckCircle,
                title: 'Quality Guaranteed',
                description: 'Every project undergoes rigorous testing and quality assurance to ensure excellence.'
              },
              {
                icon: Users,
                title: 'Expert Team',
                description: 'Our experienced developers use the latest technologies and best practices.'
              },
              {
                icon: ArrowRight,
                title: 'Fast Delivery',
                description: 'We deliver projects on time, every time, without compromising on quality.'
              },
              {
                icon: Star,
                title: '24/7 Support',
                description: 'Get round-the-clock support and maintenance for all your projects.'
              },
              {
                icon: Code,
                title: 'Modern Tech Stack',
                description: 'We use cutting-edge technologies to build scalable and maintainable solutions.'
              },
              {
                icon: CheckCircle,
                title: 'Transparent Process',
                description: 'Track your project progress in real-time with our transparent workflow system.'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-sky-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact/Reach Us Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Get In Touch
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Have questions about our services? Want to discuss a custom project? 
                We're here to help you succeed.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Email Us</h3>
                  <p className="text-gray-600">support@projectease.com</p>
                  <p className="text-gray-600">info@projectease.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Call Us</h3>
                  <p className="text-gray-600">+91 98765 43210</p>
                  <p className="text-gray-600">+91 87654 32109</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Visit Us</h3>
                  <p className="text-gray-600">123 Tech Street</p>
                  <p className="text-gray-600">Bangalore, Karnataka 560001</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-xl p-8"
            >
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Send us a message</h3>
              <form className="space-y-4">
                <div>
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <textarea
                    rows="4"
                    placeholder="Your Message"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full btn-gradient text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-shadow"
                >
                  Send Message
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-sky-600 to-blue-700">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold text-white">
              Ready to Start Your Next Project?
            </h2>
            <p className="text-xl text-sky-100">
              Join thousands of satisfied clients who chose ProjectEase for their success.
              Get started today and see the difference quality makes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="bg-white text-sky-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Get Started Free
              </Link>
              <Link
                to="/projects"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-sky-600 transition-colors"
              >
                Browse Projects
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Home
