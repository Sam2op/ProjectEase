import React from 'react'
import { Link } from 'react-router-dom'
import { Monitor } from 'lucide-react'

export default function ProjectCard({ project, index }) {
  const imgs = project.images || []
  const primary = imgs.find(i => i.isPrimary) || imgs[0]
  const front = project.technologies?.frontend || []
  const back  = project.technologies?.backend  || []
  const techs = [...front, ...back].slice(0, 3)
  const more  = front.length + back.length - techs.length

  const getImageUrl = (url) => {
    if (url.startsWith('http')) return url
    return `${import.meta.env.VITE_API_URL.replace('/api','')}${url}`
  }

  return (
    <Link to={`/projects/${project._id}`} className="group block">
      <div className="aspect-video bg-gray-100 overflow-hidden rounded-xl">
        {primary ? (
          <img
            src={getImageUrl(primary.url)}
            alt={primary.alt || project.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <Monitor className="w-full h-full text-gray-300"/>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">{project.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
        <div className="flex flex-wrap gap-1 mb-4">
          {techs.map((t,i)=>(
            <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">{t}</span>
          ))}
          {more>0 && <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">+{more} more</span>}
        </div>
        <div className="flex justify-between items-center">
          <div className="text-green-600 font-bold">₹{project.price?.toLocaleString()}</div>
          <div className="text-sm text-gray-500">{project.duration}</div>
        </div>
      </div>
    </Link>
  )
}
