import Link from "next/link"
import { ShoppingCart, User, Search } from "lucide-react"

export default function Header() {
  return (
    <header className="bg-background shadow-md">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-foreground">
          Furniture Haven
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/categories/living-room" className="text-muted-foreground hover:text-foreground">
                Living Room
              </Link>
            </li>
            <li>
              <Link href="/categories/bedroom" className="text-muted-foreground hover:text-foreground">
                Bedroom
              </Link>
            </li>
            <li>
              <Link href="/categories/office" className="text-muted-foreground hover:text-foreground">
                Office
              </Link>
            </li>
            <li>
              <Link href="/categories/kitchen" className="text-muted-foreground hover:text-foreground">
                Kitchen
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="/search" className="text-muted-foreground hover:text-foreground">
            <Search size={24} />
          </Link>
          <Link href="/cart" className="text-muted-foreground hover:text-foreground">
            <ShoppingCart size={24} />
          </Link>
          <Link href="/account" className="text-muted-foreground hover:text-foreground">
            <User size={24} />
          </Link>
        </div>
      </div>
    </header>
  )
}

