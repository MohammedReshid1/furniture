import Link from "next/link"
import Image from "next/image"

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[700px] overflow-hidden bg-texture">
        <Image
          src="https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=1600&h=600&q=80"
          alt="Modern living room"
          fill
          priority
          className="object-cover brightness-[0.4]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />
        <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4">
          <h1 className="mb-6 animate-fade-in-up max-w-4xl">
            Welcome to Furniture Haven
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-2xl animate-fade-in-up stagger-1 font-light tracking-wide">
            Discover comfort and style for every room
          </p>
          <Link
            href="/categories/all"
            className="bg-primary text-primary-foreground px-10 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-2xl animate-fade-in-up stagger-2 hover-glow"
          >
            Shop Now
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-texture">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center">Featured Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { id: 1, name: "Modern Sofa", price: "$899.99", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80" },
              { id: 2, name: "Ergonomic Chair", price: "$299.99", image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80" },
              { id: 3, name: "Coffee Table", price: "$199.99", image: "https://images.unsplash.com/photo-1499933374294-4584851497cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80" },
              { id: 4, name: "Bookshelf", price: "$249.99", image: "https://images.unsplash.com/photo-1593085260707-5377ba37f868?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80" }
            ].map((product, idx) => (
              <div
                key={product.id}
                className={`bg-card rounded-xl overflow-hidden shadow-lg border border-border/50 hover-lift group animate-scale-in stagger-${idx + 1}`}
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-card-foreground mb-2">{product.name}</h3>
                  <p className="text-primary font-bold text-lg mb-4">{product.price}</p>
                  <button className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg hover:bg-primary/90 hover:shadow-lg transition-all duration-300 font-medium">
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Highlights */}
      <section className="bg-muted/50 py-20 border-y border-border/30">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Living Room", image: "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80" },
              { name: "Bedroom", image: "https://images.unsplash.com/photo-1588046130717-0eb0c9a3ba15?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80" },
              { name: "Office", image: "https://images.unsplash.com/photo-1497215842964-222b430dc094?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80" },
              { name: "Kitchen", image: "https://images.unsplash.com/photo-1600489000022-c2086d79f9d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80" }
            ].map((category) => (
              <Link key={category.name} href={`/categories/${category.name.toLowerCase().replace(" ", "-")}`} className="group">
                <div className="relative h-72 rounded-2xl overflow-hidden shadow-lg border border-border/50 hover-lift">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-black/80 transition-all duration-300" />
                  <div className="absolute inset-0 flex items-end p-6">
                    <h3 className="text-white text-3xl font-bold drop-shadow-2xl group-hover:translate-x-2 transition-transform duration-300">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-texture">
        <div className="container mx-auto px-4">
          <h2 className="mb-16 text-center">Why Choose Furniture Haven</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-card/80 backdrop-blur-sm p-8 rounded-2xl border border-border/50 flex flex-col items-center text-center hover-lift">
              <div className="bg-gradient-to-br from-primary to-accent p-5 rounded-2xl mb-6 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white h-10 w-10">
                  <path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"></path>
                  <path d="M16.5 9.4 7.55 4.24"></path>
                  <polyline points="3.29 7 12 12 20.71 7"></polyline>
                  <polyline points="12 22 12 12"></polyline>
                  <circle cx="18.5" cy="15.5" r="2.5"></circle>
                  <path d="M20.27 17.27 22 19"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-card-foreground">Premium Quality</h3>
              <p className="text-muted-foreground leading-relaxed">We source only the finest materials and partner with skilled craftsmen to deliver furniture that lasts a lifetime.</p>
            </div>
            <div className="bg-card/80 backdrop-blur-sm p-8 rounded-2xl border border-border/50 flex flex-col items-center text-center hover-lift">
              <div className="bg-gradient-to-br from-secondary to-primary p-5 rounded-2xl mb-6 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white h-10 w-10">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="22" x2="18" y1="12" y2="12"></line>
                  <line x1="6" x2="2" y1="12" y2="12"></line>
                  <line x1="12" x2="12" y1="6" y2="2"></line>
                  <line x1="12" x2="12" y1="22" y2="18"></line>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-card-foreground">Free Shipping</h3>
              <p className="text-muted-foreground leading-relaxed">Enjoy free shipping on all orders over $500. We deliver to your doorstep with care and precision.</p>
            </div>
            <div className="bg-card/80 backdrop-blur-sm p-8 rounded-2xl border border-border/50 flex flex-col items-center text-center hover-lift">
              <div className="bg-gradient-to-br from-accent to-secondary p-5 rounded-2xl mb-6 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white h-10 w-10">
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" x2="12" y1="17" y2="17"></line>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-card-foreground">Expert Advice</h3>
              <p className="text-muted-foreground leading-relaxed">Our design consultants are ready to help you find the perfect pieces for your space at no extra cost.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gradient-to-br from-primary to-accent py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-grain opacity-30" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="mb-5 text-white">Stay Updated</h2>
            <p className="text-white/90 mb-8 text-lg font-light">Subscribe to our newsletter to receive updates on new arrivals, special offers, and design inspiration.</p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-6 py-4 rounded-xl border-2 border-white/20 bg-white/10 backdrop-blur-md text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/40 transition-all"
              />
              <button className="bg-white text-primary px-8 py-4 rounded-xl hover:bg-white/90 hover:scale-105 transition-all duration-300 font-semibold shadow-xl">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

