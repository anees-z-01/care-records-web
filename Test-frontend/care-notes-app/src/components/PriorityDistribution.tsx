import type React from "react"

interface PriorityDistributionProps {
  data: Record<number, number>
}

export const PriorityDistribution: React.FC<PriorityDistributionProps> = ({ data }) => {
  const priorities = [1, 2, 3, 4, 5]
  const total = Object.values(data).reduce((sum, value) => sum + value, 0)

  const getPriorityColor = (priority: number) => {
    const colors = {
      1: "bg-red-500",
      2: "bg-orange-500",
      3: "bg-yellow-500",
      4: "bg-blue-500",
      5: "bg-green-500",
    }
    return colors[priority as keyof typeof colors] || "bg-gray-500"
  }

  const getPriorityLabel = (priority: number) => {
    const labels = {
      1: "Critical",
      2: "High",
      3: "Medium",
      4: "Low",
      5: "Routine",
    }
    return labels[priority as keyof typeof labels] || `Priority ${priority}`
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Priority Distribution</h3>

      <div className="space-y-3">
        {priorities.map((priority) => {
          const count = data[priority] || 0
          const percentage = total > 0 ? (count / total) * 100 : 0

          return (
            <div key={priority} className="flex items-center">
              <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">{getPriorityLabel(priority)}</span>
                  <span className="text-sm text-gray-500">
                    {count} ({percentage.toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${getPriorityColor(priority)}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
