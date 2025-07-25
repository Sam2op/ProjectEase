import React, { useEffect, useState } from 'react'
import axios from 'axios'
import ProjectCard from '../components/ProjectCard'
import RequestModal from '../components/RequestModal'

const Projects = () => {
  const [projects, setProjects] = useState([])
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    axios.get('/projects').then((res) => setProjects(res.data.projects))
  }, [])

  return (
    <section id="projects" className="bg-sky-50 py-24">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-sky-700 mb-10">
          Project Catalogue
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((p) => (
            <ProjectCard key={p._id} project={p} onRequest={setSelected} />
          ))}
        </div>
      </div>

      {selected && (
        <RequestModal
          isOpen={!!selected}
          onClose={() => setSelected(null)}
          project={selected}
        />
      )}
    </section>
  )
}

export default Projects
