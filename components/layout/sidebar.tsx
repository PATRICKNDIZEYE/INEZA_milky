'use client'

import { useState, createContext, useContext } from 'react';
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
  Sun,
  ChevronLeft,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import Image from 'next/image';

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
  // { 
  //   name: 'System Logs', 
  //   href: '/logs', 
  //   icon: FileText,
  //   color: 'text-gray-600',
  //   bgColor: 'bg-gray-100'
  // },
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
    name: 'SMS Test', 
    href: '/admin/sms-test', 
    icon: MessageSquare,
    color: 'text-green-600',
    bgColor: 'bg-green-100'
  },
  // { 
  //   name: 'Help & Support', 
  //   href: '/help', 
  //   icon: HelpCircle,
  //   color: 'text-blue-600',
  //   bgColor: 'bg-blue-100'
  // },
];

export const SidebarContext = createContext({ collapsed: false, setCollapsed: (v: boolean) => {} });

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  return useContext(SidebarContext);
}

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const { collapsed, setCollapsed } = useSidebar();
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
        collapsed
          ? "fixed inset-y-0 left-0 z-40 w-20 bg-white/95 backdrop-blur-sm shadow-xl border-r border-gray-100 transition-all duration-200"
          : "fixed inset-y-0 left-0 z-40 w-72 bg-white/95 backdrop-blur-sm shadow-xl border-r border-gray-100 transition-all duration-200",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className={collapsed ? "flex flex-col items-center justify-center h-12 px-2 border-b border-gray-100 bg-white" : "flex flex-col items-center justify-center h-20 px-6 border-b border-gray-100 bg-white"}>
            <span className="flex items-center justify-center">
              <Milk className={collapsed ? "w-10 h-10 text-rwanda-blue" : "w-16 h-10 text-rwanda-blue"} />
              {!collapsed && <span className="ml-3 text-2xl font-extrabold tracking-wide text-rwanda-blue">INEZA DAIRY</span>}
            </span>
          </div>
          <div className="border-b border-gray-100 mb-2" />
          {/* Navigation */}
          <nav className="flex-1 px-1 py-6 space-y-1 overflow-y-auto">
          <div className={collapsed ? "px-1 mt-8 mb-6" : "px-3 mt-8 mb-6"}>
              <h3 className={collapsed ? "text-[10px] font-semibold text-gray-400 uppercase tracking-wider" : "text-xs font-semibold text-gray-500 uppercase tracking-wider"}>
                Navigate
              </h3>
            </div>
            
            {navigation.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-2 py-3 text-sm font-medium rounded-lg mx-1 transition-colors group",
                    isActive 
                      ? `bg-rwanda-blue/5 text-rwanda-blue font-medium` 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <span className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center mr-0 transition-colors",
                    isActive 
                      ? `${item.bgColor} ${item.color}`
                      : "text-gray-400 group-hover:bg-gray-100"
                  )}>
                    <item.icon className="h-6 w-6" />
                  </span>
                  {!collapsed && <span className="ml-3">{item.name}</span>}
                  {isActive && !collapsed && (
                    <span className="ml-auto w-1.5 h-6 bg-rwanda-blue rounded-full"></span>
                  )}
                </Link>
              );
            })}
            <div className={collapsed ? "px-1 mt-8 mb-6" : "px-3 mt-8 mb-6"}>
              <h3 className={collapsed ? "text-[10px] font-semibold text-gray-400 uppercase tracking-wider" : "text-xs font-semibold text-gray-500 uppercase tracking-wider"}>
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
                    "flex items-center px-2 py-3 text-sm font-medium rounded-lg mx-1 transition-colors group",
                    isActive 
                      ? `bg-rwanda-blue/5 text-rwanda-blue font-medium` 
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <span className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center mr-0 transition-colors",
                    isActive 
                      ? `${item.bgColor} ${item.color}`
                      : "text-gray-400 group-hover:bg-gray-100"
                  )}>
                    <item.icon className="h-6 w-6" />
                  </span>
                  {!collapsed && <span className="ml-3">{item.name}</span>}
                  {isActive && !collapsed && (
                    <span className="ml-auto w-1.5 h-6 bg-rwanda-blue rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </nav>
          {/* Collapse/Expand Button */}
          <div className="flex items-center justify-center py-4 border-t border-gray-100">
            <Button variant="ghost" size="icon" onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? <ChevronRight className="h-6 w-6" /> : <ChevronLeft className="h-6 w-6" />}
            </Button>
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