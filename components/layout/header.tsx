'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Bell, LogOut, User, Settings, Milk } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Image from 'next/image';

interface User {
  id: string
  name: string
  email: string
  role: string
}

export function Header() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const [header,setHeader] = useState("")

  useEffect(() => {
    fetchUser()
  }, [])

  const pathname = usePathname()

  useEffect(()=>{
    if(pathname === "/ "){
      setHeader("HOME")
      
    }
    else if (pathname === "/collections"){
      setHeader("Manage Collections")
    }
  },[])
  

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      toast.success('Logged out successfully')
      router.push('/login')
    } catch (error) {
      toast.error('Logout failed')
    }
  }

  

  


  

  return (
    <header className="lg:ml-64  ">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center min-w-0 gap-4">
            {/* Show branding in header only if sidebar is collapsed (w-20) */}
            <span className="block lg:hidden flex items-center">
              <Milk className="w-8 h-8 text-rwanda-blue" />
              <span className="ml-2 text-xl font-extrabold tracking-wide text-rwanda-blue">INEZA DAIRY</span>
            </span>
            <h1 className="text-2xl font-bold text-tertiary sm:truncate">
              {header}
            </h1>
          </div>
          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </Button> */}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-sky-100 text-sky-700">
                      {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium leading-none">{user?.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    Role: {user?.role}
                  </p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <a href='/settings'><span>Profile</span></a>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <a href='/settings'><span>Settings</span></a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}