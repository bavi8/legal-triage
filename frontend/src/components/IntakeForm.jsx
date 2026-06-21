import { useState } from 'react'
import TriageResult from './TriageResult'
import { submitIntake } from '../services/api'

export default function IntakeForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    description: '',
  })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const data = await submitIntake(form)
      setResult(data)
    } catch (err) {
      setError('Could not process your request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setResult(null)
    setForm({ name: '', email: '', description: '' })
  }

  if (result) return <TriageResult result={result} onReset={handleReset} />

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">

        {/* Header */}
        <div className="mb-8">
          <span className="text-xs font-semibold tracking-widest text-indigo-500 uppercase">
            Legal Intake System
          </span>
          <h1 className="text-3xl font-bold text-slate-800 mt-1">
            Describe your legal issue
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            Our AI will categorize your issue, assess urgency, and suggest required documents.
          </p>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6">

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Priya Sharma"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              required
              placeholder="e.g. priya@email.com"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Describe your legal issue
            </label>
            <textarea
              name="description"
              required
              rows={5}
              placeholder="e.g. My employer terminated me without notice after 4 years of service and has refused to pay my final salary..."
              value={form.description}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
            <p className="text-xs text-slate-400 mt-1">
              {form.description.length} characters — more detail improves accuracy
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            {loading ? 'Analyzing your issue...' : 'Submit for AI Triage →'}
          </button>

        </form>

        <p className="text-center text-xs text-slate-400 mt-4">
          Your information is confidential and used only for case routing.
        </p>
      </div>
    </div>
  )
}