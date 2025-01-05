import type { CareStats } from '../types'
export function StatsDisplay({stats,loading,error}:{stats:CareStats|null;loading:boolean;error:string|null}) {
 if(loading)return <p role="status" className="text-sm text-slate-600">Loading statistics…</p>
 if(error)return <p role="alert">{error}</p>
 if(!stats)return <p className="text-sm text-slate-500">No statistics available for this selection.</p>
 return <div><dl className="grid grid-cols-2 gap-3 md:grid-cols-4">{[['Total notes',stats.total_notes],['Avg notes/patient',stats.avg_notes_per_patient.toFixed(1)],['Active facilities',Object.keys(stats.by_facility).length],['Categories',Object.keys(stats.by_category).length]].map(([label,value])=><div className="rounded-lg bg-slate-50 p-4" key={label}><dt className="text-xs text-slate-500">{label}</dt><dd className="mt-2 text-2xl font-semibold text-teal-800">{value}</dd></div>)}</dl><div className="mt-5 grid gap-3 md:grid-cols-2">{Object.entries(stats.by_category).map(([category,count])=><div key={category}><p className="flex justify-between text-sm capitalize"><span>{category}</span><span>{count}</span></p><div className="mt-2 h-2 rounded bg-slate-100"><div className="h-2 rounded bg-teal-600" style={{width:`${stats.total_notes>0?Math.min(100,count/stats.total_notes*100):0}%`}}/></div></div>)}</div></div>
}
