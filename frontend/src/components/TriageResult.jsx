const URGENCY_STYLES = {
  high:   'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  low:    'bg-green-100 text-green-700 border-green-200',
}

const CATEGORY_ICONS = {
  contract:   '📄',
  employment: '💼',
  property:   '🏠',
  dispute:    '⚖️',
  compliance: '✅',
  general:    '⚖️',
}

export default function TriageResult({ result, onReset }) {
  // Backend returns { message, ticket: { category, urgency, id, ... } }
  const ticket = result.ticket || result

  const urgency  = ticket.urgency?.toLowerCase()  || 'medium'
  const category = ticket.category?.toLowerCase() || 'general'

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">

        {/* Success header */}
        <div className="mb-6 text-center">
          <div className="text-4xl mb-3">{CATEGORY_ICONS[category] || '⚖️'}</div>
          <h2 className="text-2xl font-bold text-slate-800">Issue Analyzed</h2>
          <p className="text-slate-500 text-sm mt-1">Here's what our AI found</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6">

          {/* Category + Urgency row */}
          <div className="flex gap-3">
            <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">Category</p>
              <p className="text-slate-800 font-semibold capitalize">
                {ticket.category || 'General'}
              </p>
            </div>
            <div className="flex-1 rounded-xl p-4 border">
              <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-1">Urgency</p>
              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border capitalize ${URGENCY_STYLES[urgency]}`}>
                {ticket.urgency || 'Medium'}
              </span>
            </div>
          </div>

          {/* Summary from AI */}
          {ticket.summary && (
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-xs text-slate-400 uppercase tracking-wide font-medium mb-2">
                AI Summary
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">{ticket.summary}</p>
            </div>
          )}

          {/* Ticket confirmation */}
          {ticket.id && (
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl px-4 py-3">
              <p className="text-xs text-indigo-400 font-medium">Your ticket reference</p>
              <p className="text-indigo-700 font-mono text-sm mt-0.5">{ticket.id}</p>
            </div>
          )}

          {/* Status */}
          <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 flex items-center gap-2">
            <span className="text-green-500 text-lg">✅</span>
            <div>
              <p className="text-xs text-green-600 font-medium">Ticket submitted successfully</p>
              <p className="text-xs text-green-500 mt-0.5">
                A lawyer will review your case shortly
              </p>
            </div>
          </div>

          <button
            onClick={onReset}
            className="w-full border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium py-2.5 rounded-lg text-sm transition-colors"
          >
            ← Submit another issue
          </button>

        </div>
      </div>
    </div>
  )
}