import { ChevronDown, Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FORMATS, GENRES, SEASONS, SORTS, STATUSES, YEARS } from '@/lib/options'
import type { Filters } from '@/lib/types'

type Options = readonly (readonly [string, string])[]

function Select({ label, value, options, onChange }: { label: string; value: string; options: Options; onChange: (value: string) => void }) {
  return (
    <label className="relative shrink-0">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn('h-10 appearance-none rounded-full border bg-white/5 pl-4 pr-9 text-sm outline-none focus:border-violet-400/60 [&>option]:bg-[#14141c]', value ? 'border-violet-400/50 text-violet-200' : 'border-white/10')}
      >
        <option value="">{label}</option>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
    </label>
  )
}

interface FilterBarProps {
  filters: Filters
  active: boolean
  onChange: (name: 'q' | 'year' | 'season' | 'format' | 'status' | 'sort', value: string) => void
  onGenre: (genre: string) => void
  onReset: () => void
}

export function FilterBar({ filters, active, onChange, onGenre, onReset }: FilterBarProps) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-white/40" />
        <input
          value={filters.q}
          onChange={(e) => onChange('q', e.target.value)}
          placeholder="Search anime"
          className="h-12 w-full rounded-full border border-white/10 bg-white/5 pl-12 pr-4 text-base outline-none placeholder:text-white/30 focus:border-violet-400/60"
        />
      </div>
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {GENRES.map((g) => (
          <button
            key={g}
            aria-pressed={filters.genres.includes(g)}
            onClick={() => onGenre(g)}
            className={cn('shrink-0 rounded-full border px-4 py-1.5 text-sm transition', filters.genres.includes(g) ? 'border-violet-400 bg-violet-500/25 text-violet-100' : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10')}
          >
            {g}
          </button>
        ))}
      </div>
      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
        <Select label="Year" value={filters.year} options={YEARS} onChange={(v) => onChange('year', v)} />
        <Select label="Season" value={filters.season} options={SEASONS} onChange={(v) => onChange('season', v)} />
        <Select label="Format" value={filters.format} options={FORMATS} onChange={(v) => onChange('format', v)} />
        <Select label="Status" value={filters.status} options={STATUSES} onChange={(v) => onChange('status', v)} />
        <Select label="Sort" value={filters.sort} options={SORTS} onChange={(v) => onChange('sort', v)} />
        {active && (
          <button onClick={onReset} className="flex h-10 shrink-0 items-center gap-1 rounded-full px-3 text-sm text-white/60 hover:text-white">
            <X className="h-4 w-4" />
            Reset
          </button>
        )}
      </div>
    </div>
  )
}
