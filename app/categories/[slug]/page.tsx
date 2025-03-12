import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

// This would typically come from a database or API
const categories = ["living-room", "bedroom", "office", "kitchen"]

export default function CategoryPage({ params }: { params: { slug: string } }) {
  if (!categories.includes(params.slug)) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 capitalize">{params.slug.replace("-", " ")} Furniture</h1>

      {/* Filters and Sort */}
      <div className="flex justify-between mb-8">
        <div className="flex space-x-4">
          <select className="border rounded-md px-2 py-1">
            <option>Filter by Price</option>
            <option>Under $100</option>
            <option>$100 - $500</option>
            <option>Over $500</option>
          </select>
          <select className="border rounded-md px-2 py-1">
            <option>Filter by Material</option>
            <option>Wood</option>
            <option>Metal</option>
            <option>Fabric</option>
          </select>
        </div>
        <select className="border rounded-md px-2 py-1">
          <option>Sort by Featured</option>
          <option>Price: Low to High</option>
          <option>Price: High to Low</option>
          <option>Newest</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {/* Replace with actual product data */}
        {[1, 2, 3, 4, 5, 6, 7, 8].map((product) => (
          <div key={product} className="bg-white rounded-lg shadow-md overflow-hidden">
            <Image
              src="/placeholder.svg?height=300&width=400"
              alt={`Product ${product}`}
              width={400}
              height={300}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">Product Name</h3>
              <p className="text-gray-600 mb-4">Short product description goes here.</p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">$299.99</span>
                <Link
                  href={`/products/${product}`}
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
                >
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

