import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const Navbar = () => {
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-xl font-bold hover:text-blue-200">
            存貨管理系統
          </Link>
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded transition ${
                isActive('/') ? 'bg-blue-700' : 'hover:bg-blue-500'
              }`}
            >
              首頁
            </Link>
            <Link
              to="/products"
              className={`px-3 py-2 rounded transition ${
                isActive('/products') ? 'bg-blue-700' : 'hover:bg-blue-500'
              }`}
            >
              商品管理
            </Link>
            <Link
              to="/inventory"
              className={`px-3 py-2 rounded transition ${
                isActive('/inventory') ? 'bg-blue-700' : 'hover:bg-blue-500'
              }`}
            >
              庫存管理
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
