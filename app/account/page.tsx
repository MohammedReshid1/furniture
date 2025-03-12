"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

interface User {
  firstName: string
  lastName: string
  email: string
}

interface Order {
  id: string
  date: string
  total: number
  status: string
}

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null)
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    // Simulating fetching user data
    setUser({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
    })

    // Simulating fetching order history
    setOrders([
      { id: "1001", date: "2023-05-01", total: 299.99, status: "Delivered" },
      { id: "1002", date: "2023-05-15", total: 149.99, status: "Shipped" },
      { id: "1003", date: "2023-05-30", total: 499.99, status: "Processing" },
    ])
  }, [])

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Account</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          <div className="bg-white shadow-md rounded-lg p-6">
            <p>
              <strong>Name:</strong> {user.firstName} {user.lastName}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <Link href="/account/edit" className="text-blue-500 hover:underline mt-4 inline-block">
              Edit Profile
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Order History</h2>
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Order ID</th>
                  <th className="px-4 py-2 text-left">Date</th>
                  <th className="px-4 py-2 text-left">Total</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-t">
                    <td className="px-4 py-2">{order.id}</td>
                    <td className="px-4 py-2">{order.date}</td>
                    <td className="px-4 py-2">${order.total.toFixed(2)}</td>
                    <td className="px-4 py-2">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Account Actions</h2>
        <div className="space-y-2">
          <Link href="/account/change-password" className="text-blue-500 hover:underline block">
            Change Password
          </Link>
          <Link href="/account/addresses" className="text-blue-500 hover:underline block">
            Manage Addresses
          </Link>
          <button className="text-red-500 hover:underline">Log Out</button>
        </div>
      </div>
    </div>
  )
}

