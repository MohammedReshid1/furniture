import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[600px]">
        <Image
          src="/placeholder.svg?height=600&width=1600"
          alt="Modern living room"
          layout="fill"
          objectFit="cover"
          className="brightness-50"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white">
          <h1 className="text-5xl font-bold mb-4">Welcome to Furniture Haven</h1>
          <p className="text-xl mb-8">Discover comfort and style for every room</p>
          <Link
            href="/categories/all"
            className="bg-background text-foreground px-8 py-3 rounded-md text-lg font-semibold hover:bg-background/90 transition duration-300"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-foreground">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((product) => (
              <div key={product} className="bg-card rounded-lg overflow-hidden shadow-md">
                <div className="relative h-48">
                  <Image
                    src="/placeholder.svg?height=300&width=400"
                    alt={`Product ${product}`}
                    layout="fill"
                    objectFit="cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-card-foreground mb-2">Product Name</h3>
                  <p className="text-muted-foreground mb-4">$299.99</p>
                  <button className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition duration-300">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Highlights */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-foreground">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {["Living Room", "Bedroom", "Office", "Kitchen"].map((category) => (
              <Link key={category} href={`/categories/${category.toLowerCase().replace(" ", "-")}`} className="group">
                <div className="relative h-64 rounded-lg overflow-hidden">
                  <Image
                    src="/placeholder.svg?height=300&width=400"
                    alt={category}
                    layout="fill"
                    objectFit="cover"
                    className="group-hover:scale-110 transition duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <h3 className="text-white text-2xl font-bold">{category}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

