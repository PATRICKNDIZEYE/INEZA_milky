'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '#about' },
  { name: 'Products', href: '#products' },
  { name: 'Farmers', href: '#farmers' },
  { name: 'Contact', href: '#contact' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="fixed w-full bg-white/80 backdrop-blur-sm shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <Image 
                src="/rwanda-coat-of-arms.png" 
                alt="Rwanda Dairy Logo" 
                width={40} 
                height={40} 
                className="h-10 w-auto"
              />
              <span className="ml-3 text-xl font-bold text-rwanda-green">
                Rwanda Dairy
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'inline-flex items-center px-1 pt-1 text-sm font-medium',
                  pathname === item.href 
                    ? 'text-rwanda-blue border-b-2 border-rwanda-yellow' 
                    : 'text-gray-700 hover:text-rwanda-blue'
                )}
              >
                {item.name}
              </Link>
            ))}
            <Link href="/login">
              <Button className="ml-4 bg-rwanda-blue hover:bg-rwanda-blue/90">
                Login
              </Button>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-rwanda-blue focus:outline-none"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'block px-4 py-2 text-base font-medium',
                  pathname === item.href 
                    ? 'bg-rwanda-blue/10 text-rwanda-blue' 
                    : 'text-gray-700 hover:bg-gray-50 hover:text-rwanda-blue'
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="px-4 py-3">
              <Link href="/login">
                <Button className="w-full bg-rwanda-blue hover:bg-rwanda-blue/90">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
