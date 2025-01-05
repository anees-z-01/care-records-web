import type React from "react"

interface StatsCardProps {
  title: string
  value: number | string
  subtitle?: string
  className?: string
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, className = "" }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
      <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">{title}</h3>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
    </div>
  )
}
