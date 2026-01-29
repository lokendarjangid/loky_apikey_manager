'use client'

import { useState } from 'react'
import { Plus, FolderOpen, Key, BarChart3, Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'

interface Project {
  id: string
  name: string
  description: string
  slug: string
  _count: {
    apiKeys: number
  }
  createdAt: string
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Projects</h1>
          <p className="text-slate-600">
            Organize your API keys into projects for better management
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          <Plus className="h-5 w-5" />
          New Project
        </button>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="bg-white rounded-xl p-12 border border-slate-200 text-center">
          <FolderOpen className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            No projects yet
          </h3>
          <p className="text-slate-600 mb-6">
            Create your first project to organize your API keys
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            Create Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {showCreateModal && (
        <CreateProjectModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200 hover:border-purple-300 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-purple-100 rounded-lg">
          <FolderOpen className="h-6 w-6 text-purple-600" />
        </div>
        <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <h3 className="text-xl font-semibold text-slate-900 mb-2">
        {project.name}
      </h3>
      <p className="text-sm text-slate-600 mb-4">
        {project.description || 'No description'}
      </p>

      <div className="flex items-center justify-between pt-4 border-t border-slate-200">
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <div className="flex items-center gap-1">
            <Key className="h-4 w-4" />
            <span>{project._count.apiKeys} keys</span>
          </div>
        </div>
        <a 
          href={`/dashboard/projects/${project.slug}`}
          className="text-purple-600 hover:text-purple-700 font-medium text-sm"
        >
          View →
        </a>
      </div>
    </div>
  )
}

function CreateProjectModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error('Please enter a project name')
      return
    }

    setLoading(true)
    try {
      // API call to create project
      toast.success('Project created successfully!')
      onClose()
    } catch (error) {
      toast.error('Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Create New Project
        </h2>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Project Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Mobile App API"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What is this project for?"
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </div>
      </div>
    </div>
  )
}
