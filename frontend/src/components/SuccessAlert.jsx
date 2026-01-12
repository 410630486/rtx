import React from 'react'

const SuccessAlert = ({ message, onClose }) => {
  if (!message) return null

  return (
    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
      <span>{message}</span>
      <button
        onClick={onClose}
        className="text-green-700 hover:text-green-900 font-bold text-xl"
      >
        &times;
      </button>
    </div>
  )
}

export default SuccessAlert
