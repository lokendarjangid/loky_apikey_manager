'use client'

import { useState } from 'react'
import { Plus, Copy, Trash2, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

interface ApiKey {
  id: string
  name: string
  key: string
  prefix: string
  status: string
  rateLimit: number
  lastUsedAt: string | null
  createdAt: string
}

export default function ApiKeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set())

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev)
      if (newSet.has(keyId)) {
        newSet.delete(keyId)
      } else {
        newSet.add(keyId)
      }
      return newSet
    })
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">API Keys</h1>
          <p className="text-slate-600">
            Manage your API keys and monitor their usage
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          <Plus className="h-5 w-5" />
          Create API Key
        </button>
      </div>

      {/* API Keys List */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Key</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Rate Limit</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-slate-900">Last Used</th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {keys.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-slate-400">
                      <p className="text-lg mb-2">No API keys yet</p>
                      <p className="text-sm">Create your first API key to get started</p>
                    </div>
                  </td>
                </tr>
              ) : (
                keys.map((key) => (
                  <tr key={key.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{key.name}</p>
                      <p className="text-sm text-slate-500">
                        Created {new Date(key.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <code className="text-sm font-mono bg-slate-100 px-2 py-1 rounded">
                          {visibleKeys.has(key.id) ? key.key : `${key.prefix}...`}
                        </code>
                        <button
                          onClick={() => toggleKeyVisibility(key.id)}
                          className="p-1 hover:bg-slate-200 rounded"
                        >
                          {visibleKeys.has(key.id) ? (
                            <EyeOff className="h-4 w-4 text-slate-600" />
                          ) : (
                            <Eye className="h-4 w-4 text-slate-600" />
                          )}
                        </button>
                        <button
                          onClick={() => copyToClipboard(key.key)}
                          className="p-1 hover:bg-slate-200 rounded"
                        >
                          <Copy className="h-4 w-4 text-slate-600" />
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2 py-1 text-xs rounded ${
                        key.status === 'active' 
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {key.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {key.rateLimit.toLocaleString()}/hour
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">
                      {key.lastUsedAt 
                        ? new Date(key.lastUsedAt).toLocaleDateString()
                        : 'Never'
                      }
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition"
                        onClick={() => {
                          if (confirm('Are you sure you want to revoke this API key?')) {
                            // Handle delete
                            toast.success('API key revoked')
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rate Limit Warning */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Rate Limits:</strong> Free plan includes 10,000 requests/month. 
          Upgrade to Pro for unlimited requests.
        </p>
      </div>

      {showCreateModal && (
        <CreateKeyModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  )
}

function CreateKeyModal({ onClose }: { onClose: () => void }) {
  const [name, setName] = useState('')
  const [rateLimit, setRateLimit] = useState('1000')
  const [loading, setLoading] = useState(false)

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error('Please enter a key name')
      return
    }

    setLoading(true)
    try {
      // API call to create key
      toast.success('API key created successfully!')
      onClose()
    } catch (error) {
      toast.error('Failed to create API key')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Create API Key</h2>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Key Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Production API"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Rate Limit (requests/hour)
            </label>
            <input
              type="number"
              value={rateLimit}
              onChange={(e) => setRateLimit(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
            {loading ? 'Creating...' : 'Create Key'}
          </button>
        </div>
      </div>
    </div>
  )
}
