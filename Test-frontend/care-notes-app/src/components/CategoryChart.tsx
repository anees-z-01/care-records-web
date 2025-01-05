import type React from "react"

interface CategoryChartProps {
  data: Record<string, number>
  title: string
}

export const CategoryChart: React.FC<CategoryChartProps> = ({ data, title }) => {
  const total = Object.values(data).reduce((sum, value) => sum + value, 0)
  const categories = Object.entries(data).sort(([, a], [, b]) => b - a)

  const colors = {
    medication: "bg-blue-500",
    observation: "bg-green-500",
    treatment: "bg-purple-500",
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>

      {categories.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No data available</p>
      ) : (
        <div className="space-y-3">
          {categories.map(([category, count]) => {
            const percentage = total > 0 ? (count / total) * 100 : 0
            const colorClass = colors[category as keyof typeof colors] || "bg-gray-500"

            return (
              <div key={category} className="flex items-center">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize">{category}</span>
                    <span className="text-sm text-gray-500">
                      {count} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className={`h-2 rounded-full ${colorClass}`} style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
