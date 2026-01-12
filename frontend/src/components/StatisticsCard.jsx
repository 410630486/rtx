import React from 'react'

const StatisticsCard = ({ title, value, icon, color = 'blue' }) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 border-${color}-500`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className={`text-4xl text-${color}-500`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

export default StatisticsCard
