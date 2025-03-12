import Link from "next/link"
import { ShoppingCart, User, Search } from "lucide-react"

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          Furniture Haven
        </Link>
        <nav>
          <ul className="flex space-x-6">
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
              <Link href="/categories/kitchen" className="text-gray-600 hover:text-gray-800">
                Kitchen
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="/search" className="text-gray-600 hover:text-gray-800">
            <Search size={24} />
          </Link>
          <Link href="/cart" className="text-gray-600 hover:text-gray-800">
            <ShoppingCart size={24} />
          </Link>
          <Link href="/account" className="text-gray-600 hover:text-gray-800">
            <User size={24} />
          </Link>
        </div>
      </div>
    </header>
  )
}

