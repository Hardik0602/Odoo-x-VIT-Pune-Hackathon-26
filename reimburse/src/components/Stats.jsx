import React from 'react'
import { FaArrowTrendDown, FaArrowTrendUp } from 'react-icons/fa6'
const Stats = ({ title, value, icon, color, subtitle, trend, index = 0 }) => {
  const colorConfig = {
    blue: {
      bg: 'bg-blue-50',
      iconBg: 'bg-blue-100',
      iconText: 'text-blue-600',
      valuText: 'text-blue-600',
      border: 'border-blue-200'
    },
    green: {
      bg: 'bg-green-50',
      iconBg: 'bg-green-100',
      iconText: 'text-green-600',
      valuText: 'text-green-600',
      border: 'border-green-200'
    },
    red: {
      bg: 'bg-red-50',
      iconBg: 'bg-red-100',
      iconText: 'text-red-600',
      valuText: 'text-red-600',
      border: 'border-red-200'
    },
    amber: {
      bg: 'bg-amber-50',
      iconBg: 'bg-amber-100',
      iconText: 'text-amber-600',
      valuText: 'text-amber-600',
      border: 'border-amber-200'
    }
  }
  const colors = colorConfig[color] || colorConfig.blue
  return (
    <div
      className={`${colors.bg} rounded-lg border ${colors.border} p-6 animate-slideUp`}
      style={{ animationDelay: `${index * 75}ms`, animationFillMode: 'backwards' }}>
      <div className='flex items-center justify-between'>
        <div className='flex-1'>
          <p className='text-sm font-medium text-slate-600 mb-3'>{title}</p>
          <p className={`text-3xl font-bold ${colors.valuText}`}>{value}</p>
          {subtitle && (
            <p className='text-xs text-slate-500 mt-2'>{subtitle}</p>
          )}
          {trend && (
            <div className='flex items-center gap-1 mt-2'>
              {trend > 0 ? (
                <FaArrowTrendUp
                  className='text-green-500'
                  size={15} />
              ) : (
                <FaArrowTrendDown
                  size={15}
                  className='text-red-500' />
              )}
              <span className={`text-xs font-medium ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {Math.abs(trend)}% {trend > 0 ? 'increase' : 'decrease'}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div className={`${colors.iconBg} ${colors.iconText} p-3 rounded-lg`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
export default Stats