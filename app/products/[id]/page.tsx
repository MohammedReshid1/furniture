"use client"

import Image from "next/image"
import { Star, Truck, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/app/contexts/CartContext"
import { useState } from "react"
import React from "react"

export default function ProductPage({ params }: { params: { id: string } }) {
  const id = React.use(Promise.resolve(params.id))
  const { addToCart } = useCart()
  const [quantity, setQuantity] = useState(1)

  // In a real application, you would fetch the product data based on the ID
  const product = {
    id: Number.parseInt(id),
    name: "Comfortable Armchair",
    price: 299.99,
    description: "A stylish and comfortable armchair perfect for any living room or reading nook.",
    rating: 4.5,
    reviews: 128,
    inStock: true,
    image: "/placeholder.svg?height=600&width=600",
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image,
    })
    alert("Product added to cart!")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/categories/living-room" className="flex items-center text-blue-500 hover:underline mb-4">
        <ArrowLeft size={20} className="mr-2" />
        Back to Living Room
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            width={600}
            height={600}
            className="w-full rounded-lg shadow-md"
          />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400 mr-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} size={20} fill={star <= Math.floor(product.rating) ? "currentColor" : "none"} />
              ))}
            </div>
            <span className="text-gray-600">({product.reviews} reviews)</span>
          </div>
          <p className="text-2xl font-bold mb-4">${product.price.toFixed(2)}</p>
          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Quantity:</h3>
            <div className="flex items-center space-x-2">
              <button
                className="bg-gray-200 px-3 py-1 rounded-md"
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
              >
                -
              </button>
              <span className="text-xl font-semibold">{quantity}</span>
              <button className="bg-gray-200 px-3 py-1 rounded-md" onClick={() => setQuantity((prev) => prev + 1)}>
                +
              </button>
            </div>
          </div>

          <button
            className="w-full bg-blue-500 text-white py-3 rounded-md font-semibold hover:bg-blue-600 transition duration-300 mb-4"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>

          <div className="flex items-center text-green-600 mb-6">
            <Truck size={20} className="mr-2" />
            <span>{product.inStock ? "In stock and ready to ship" : "Out of stock"}</span>
          </div>

          <div className="border-t pt-6">
            <h3 className="font-semibold mb-2">Product Details:</h3>
            <ul className="list-disc list-inside text-gray-600">
              <li>Comfortable padded seat and backrest</li>
              <li>Sturdy wooden frame</li>
              <li>Easy to clean fabric upholstery</li>
              <li>Dimensions: 30" W x 32" D x 34" H</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

