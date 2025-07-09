'use client'

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Home, 
  Users, 
  Package, 
  CreditCard, 
  FileText, 
  Settings,
  Menu,
  X,
  Milk,
  Building2,
  BarChart3,
  UserCog,
  LogOut,
  User,
  Calendar,
  DollarSign,
  Database,
  Activity,
  Bell,
  HelpCircle,
  MapPin,
  Leaf,
  Sun
} from 'lucide-react';

const navigation = [
  { 
    name: 'Dashboard', 
    href: '/dashboard', 
    icon: Home,
    color: 'text-rwanda-blue',
    bgColor: 'bg-rwanda-blue/10'
  },
  { 
    name: 'Farmers', 
    href: '/farmers', 
    icon: Users,
    color: 'text-rwanda-green',
    bgColor: 'bg-rwanda-green/10'
  },
  { 
    name: 'Collections', 
    href: '/collections', 
    icon: Package,
    color: 'text-rwanda-yellow',
    bgColor: 'bg-rwanda-yellow/10'
  },
  { 
    name: 'Payments', 
    href: '/payments', 
    icon: DollarSign,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  { 
    name: 'Collection Centers', 
    href: '/collection-centers', 
    icon: MapPin,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100'
  },
  { 
    name: 'Reports', 
    href: '/reports', 
    icon: BarChart3,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
  { 
    name: 'User Management', 
    href: '/users', 
    icon: UserCog,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100'
  },
  { 
    name: 'System Logs', 
    href: '/logs', 
    icon: FileText,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100'
  },
];

const secondaryNavigation = [
  { 
    name: 'Settings', 
    href: '/settings', 
    icon: Settings,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100'
  },
  { 
    name: 'Help & Support', 
    href: '/help', 
    icon: HelpCircle,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100'
  },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        className="lg:hidden fixed top-4 left-4 z-50 bg-white/80 backdrop-blur-sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-rwanda-blue" />
        ) : (
          <Menu className="h-6 w-6 text-rwanda-blue" />
        )}
      </Button>

      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 bg-white/95 backdrop-blur-sm shadow-xl transform transition-transform duration-200 ease-in-out lg:translate-x-0 border-r border-gray-100",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-20 px-6 border-b border-gray-100">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-rwanda-blue flex items-center justify-center">
                <Milk className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-rwanda-blue">Rwanda Dairy</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          {/* Navigation */}
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            <div className="px-3 mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Main Menu
              </h3>
            </div>
            
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg mx-2 transition-colors group",
                    isActive 
                      ? `bg-rwanda-blue/5 text-rwanda-blue font-medium` 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <span className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-colors",
                    isActive 
                      ? `${item.bgColor} ${item.color}`
                      : "text-gray-400 group-hover:bg-gray-100"
                  )}>
                    <item.icon className="h-5 w-5" />
                  </span>
                  {item.name}
                  {isActive && (
                    <span className="ml-auto w-1.5 h-6 bg-rwanda-blue rounded-full"></span>
                  )}
                </Link>
              );
            })}
            
            <div className="px-3 mt-8 mb-6">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Account
              </h3>
            </div>
            
            {secondaryNavigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg mx-2 transition-colors group",
                    isActive 
                      ? `bg-rwanda-blue/5 text-rwanda-blue font-medium` 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <span className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-colors",
                    isActive 
                      ? `${item.bgColor} ${item.color}`
                      : "text-gray-400 group-hover:bg-gray-100"
                  )}>
                    <item.icon className="h-5 w-5" />
                  </span>
                  {item.name}
                </Link>
              );
            })}
            
            <div className="mt-8 pt-6 border-t border-gray-100 mx-4">
              <button className="w-full flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                <LogOut className="w-5 h-5 mr-3 text-gray-400" />
                Logout
              </button>
            </div>
          </nav>
          
          {/* User profile */}
          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-rwanda-blue/10 flex items-center justify-center text-rwanda-blue">
                <User className="w-5 h-5" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Admin User</p>
                <p className="text-xs text-gray-500">admin@rwandadairy.rw</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}