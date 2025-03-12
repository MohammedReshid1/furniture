import Link from "next/link"

export default function Footer() {
  return (
    <footer className="bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">About Us</h3>
            <p className="text-gray-600">
              Furniture Haven is your one-stop shop for stylish and comfortable furniture.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/categories/living-room" className="text-gray-600 hover:text-gray-800">
                  Living Room
                </Link>
              </li>
              <li>
                <Link href="/categories/bedroom" className="text-gray-600 hover:text-gray-800">
                  Bedroom
                </Link>
              </li>
              <li>
                <Link href="/categories/office" className="text-gray-600 hover:text-gray-800">
                  Office
                </Link>
              </li>
              <li>
                <Link href="/categories/bedroom" className="text-gray-600 hover:text-gray-800">
                  Kitchen
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-gray-800">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-600 hover:text-gray-800">
                  Shipping Information
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-600 hover:text-gray-800">
                  Returns & Exchanges
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Newsletter</h3>
            <p className="text-gray-600 mb-2">Subscribe to our newsletter for the latest updates and offers.</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-grow px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 transition duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200 text-center text-gray-600">
          <p>&copy; 2025 Furniture Haven. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

