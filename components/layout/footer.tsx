import Link from 'next/link';
import { Facebook, Twitter, Instagram, MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-rwanda-green text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img 
                src="/rwanda-coat-of-arms.png" 
                alt="Rwanda Dairy" 
                className="h-10 w-auto mr-2"
              />
              <span className="text-xl font-bold">Rwanda Dairy</span>
            </div>
            <p className="text-sm text-gray-200">
              Empowering Rwandan dairy farmers and delivering premium quality dairy products to our communities since 2010.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-300 hover:text-white">
                <span className="sr-only">Facebook</span>
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <span className="sr-only">Twitter</span>
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white">
                <span className="sr-only">Instagram</span>
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Quick Links</h3>
            <div className="mt-4 space-y-2">
              <Link href="#about" className="block text-sm text-gray-300 hover:text-white">
                About Us
              </Link>
              <Link href="#products" className="block text-sm text-gray-300 hover:text-white">
                Our Products
              </Link>
              <Link href="#farmers" className="block text-sm text-gray-300 hover:text-white">
                Our Farmers
              </Link>
              <Link href="#testimonials" className="block text-sm text-gray-300 hover:text-white">
                Testimonials
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Contact Us</h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-rwanda-yellow flex-shrink-0 mt-0.5" />
                <p className="ml-3 text-sm text-gray-300">
                  KG 7 Ave, Kigali, Rwanda
                </p>
              </div>
              <div className="flex items-center">
                <Phone className="h-5 w-5 text-rwanda-yellow flex-shrink-0" />
                <p className="ml-3 text-sm text-gray-300">
                  +250 788 123 456
                </p>
              </div>
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-rwanda-yellow flex-shrink-0" />
                <p className="ml-3 text-sm text-gray-300">
                  info@rwandadairy.rw
                </p>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider">Newsletter</h3>
            <p className="mt-4 text-sm text-gray-300">
              Subscribe to our newsletter for the latest updates on our products and services.
            </p>
            <form className="mt-4 sm:flex sm:max-w-md">
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                type="email"
                name="email-address"
                id="email-address"
                autoComplete="email"
                required
                className="w-full min-w-0 appearance-none rounded-md border-0 bg-white/10 px-4 py-2 text-base text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rwanda-yellow focus:ring-offset-2 focus:ring-offset-rwanda-green"
                placeholder="Enter your email"
              />
              <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                <button
                  type="submit"
                  className="flex w-full items-center justify-center rounded-md bg-rwanda-yellow px-4 py-2 text-sm font-medium text-rwanda-green hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-rwanda-yellow focus:ring-offset-2 focus:ring-offset-rwanda-green"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-rwanda-green-light pt-8">
          <p className="text-center text-xs text-gray-300">
            &copy; {new Date().getFullYear()} Rwanda Dairy Cooperative. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
