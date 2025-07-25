import React from 'react'
import { motion } from 'framer-motion'

const ProjectCard = ({ project, onRequest }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="card-hover bg-white rounded-xl shadow-md p-6 flex flex-col"
  >
    <h3 className="text-xl font-semibold mb-2 text-sky-700">{project.name}</h3>
    <p className="text-gray-600 flex-grow">{project.description}</p>

    <div className="mt-3 flex flex-wrap gap-2">
      {project.technologies.map((tech) => (
        <span
          key={tech}
          className="text-xs bg-sky-100 text-sky-700 px-2 py-1 rounded-md"
        >
          {tech}
        </span>
      ))}
    </div>

    <button
      onClick={() => onRequest(project)}
      className="btn-gradient text-white w-full mt-4 py-2 rounded-lg"
    >
      Request This Project
    </button>
  </motion.div>
)

export default ProjectCard
