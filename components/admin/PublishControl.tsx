'use client'

import { BLOG_STATUSES, type BlogStatus, toLocalInput, fromLocalInput, describeDelay } from '@/lib/blog/status'

/**
 * Visibility control for a blog post: Draft, Schedule, or Publish.
 *
 * This exists as one component rather than as markup in each page because the
 * new-post and edit-post screens previously carried their own near-identical
 * copies of the publish buttons — and they had already drifted. On the edit
 * screen "Save" called save(false), which quietly took a live post OFFLINE
 * every time someone fixed a typo in it. That is the bug this component is
 * shaped to make impossible: the post's state is a value the editor picks and
 * can see, not a side effect of which button they happened to press.
 */

export type Visibility = { status: BlogStatus; scheduledFor: string | null }

const STATE_COPY: Record<BlogStatus, { label: string; hint: string }> = {
  draft: { label: 'Draft', hint: 'Only visible here. Nobody can reach it on the site.' },
  scheduled: { label: 'Schedule', hint: 'Goes live automatically at the time you set.' },
  published: { label: 'Publish', hint: 'Live on the site as soon as you save.' },
}

export default function PublishControl({
  value,
  onChange,
  className = '',
}: {
  value: Visibility
  onChange: (next: Visibility) => void
  className?: string
}) {
  const { status, scheduledFor } = value

  const pick = (next: BlogStatus) => {
    if (next === 'scheduled' && !scheduledFor) {
      // Default to 9am tomorrow rather than to "now", which would publish
      // immediately and defeat the point of choosing Schedule.
      const d = new Date()
      d.setDate(d.getDate() + 1)
      d.setHours(9, 0, 0, 0)
      onChange({ status: next, scheduledFor: d.toISOString() })
      return
    }
    onChange({ status: next, scheduledFor: next === 'scheduled' ? scheduledFor : null })
  }

  const isPast = Boolean(scheduledFor && new Date(scheduledFor).getTime() <= Date.now())

  const lblClass = 'font-mono text-[10px] text-text-3 uppercase tracking-wider block mb-1.5'

  return (
    <div className={className}>
      <label className={lblClass}>Visibility</label>

      <div role="radiogroup" aria-label="Post visibility" className="flex gap-1.5 flex-wrap">
        {BLOG_STATUSES.map(s => {
          const active = status === s
          return (
            <button
              key={s}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => pick(s)}
              className={`py-2 px-3.5 rounded-lg text-[12px] font-semibold font-display cursor-pointer transition-colors border ${
                active
                  ? 'bg-[rgba(var(--primary-rgb),0.15)] border-[rgba(var(--primary-rgb),0.45)] text-white'
                  : 'bg-transparent border-border text-text-3 hover:bg-bg-3 hover:text-text-2'
              }`}
            >
              {STATE_COPY[s].label}
            </button>
          )
        })}
      </div>

      <p className="text-[11px] text-text-3 mt-2 leading-relaxed">{STATE_COPY[status].hint}</p>

      {status === 'scheduled' && (
        <div className="mt-3">
          <label className={lblClass} htmlFor="scheduled-for">Goes live at</label>
          <input
            id="scheduled-for"
            type="datetime-local"
            value={toLocalInput(scheduledFor)}
            onChange={e => onChange({ status: 'scheduled', scheduledFor: fromLocalInput(e.target.value) })}
            className="w-full bg-bg-3 border border-border rounded-lg py-2.5 px-3.5 text-[13px] text-white outline-none box-border font-body transition-colors focus:border-primary/50"
          />

          {/* The time is entered and shown in the editor's own timezone, but
              stored as UTC — so this line spells out what was understood,
              rather than leaving someone to discover at 9am that their post
              went out five hours early. */}
          {scheduledFor && !isPast && (
            <p className="text-[11px] text-text-3 mt-1.5">
              Publishes {describeDelay(scheduledFor)} — {new Date(scheduledFor).toLocaleString()} your time.
            </p>
          )}

          {isPast && (
            <p className="text-[11px] text-[#fbbf24] mt-1.5">
              That time has already passed, so saving will publish this post immediately.
            </p>
          )}

          {!scheduledFor && (
            <p className="text-[11px] text-[#fbbf24] mt-1.5">
              Pick a date and time, or this will save as a draft.
            </p>
          )}
        </div>
      )}
    </div>
  )
}

/** The label for the primary save button, so both screens read the same. */
export function saveLabel(status: BlogStatus, saving: boolean): string {
  if (saving) return 'Saving…'
  if (status === 'published') return 'Publish'
  if (status === 'scheduled') return 'Schedule'
  return 'Save draft'
}
