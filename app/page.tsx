"use client";
import Link from "next/link";
import { Milk, Users, CreditCard, BarChart3 } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Nav */}
      <nav className="w-full flex items-center justify-between px-8 py-5 border-b border-gray-100 bg-white">
        <div className="flex items-center gap-2">
          <Milk className="w-8 h-8 text-tertiary" />
          <span className="text-xl font-extrabold tracking-wide text-rwanda-blue">INEZA DAIRY</span>
        </div>
        <Link href="/login">
          <button className="bg-tertiary hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg text-base shadow transition-all">
            Login
          </button>
        </Link>
      </nav>
      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center py-24 px-4 text-center bg-gradient-to-br from-white to-blue-50">
        <div className="flex items-center justify-center mb-6">
          {/* <Milk className="w-16 h-16 text-rwanda-blue mr-3" /> */}
          <span className="text-4xl sm:text-5xl font-extrabold text-tertiary tracking-tight">INEZA DAIRY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 max-w-2xl mx-auto">
          Modern Dairy Management for Rwanda’s Farmers & Cooperatives
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto">
          Track milk collections, manage payments, and empower your dairy business with real-time insights and easy reporting.
        </p>
        <Link href="/login">
          <button className="bg-tertiary hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg text-lg shadow transition-all">
            Get Started
          </button>
        </Link>
      </section>
      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10 text-gray-900">Key Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center p-6 bg-blue-50 rounded-xl shadow-sm">
              <Users className="w-10 h-10 text-rwanda-blue mb-3" />
              <h3 className="font-semibold text-lg mb-2">Farmer Management</h3>
              <p className="text-gray-600 text-sm text-center">Easily add, update, and track all your farmers in one place.</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-green-50 rounded-xl shadow-sm">
              <CreditCard className="w-10 h-10 text-green-600 mb-3" />
              <h3 className="font-semibold text-lg mb-2">Payments & Payouts</h3>
              <p className="text-gray-600 text-sm text-center">Automate payment calculations and keep payment records organized.</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-yellow-50 rounded-xl shadow-sm">
              <BarChart3 className="w-10 h-10 text-yellow-500 mb-3" />
              <h3 className="font-semibold text-lg mb-2">Reports & Analytics</h3>
              <p className="text-gray-600 text-sm text-center">Export reports, view trends, and make data-driven decisions.</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-purple-50 rounded-xl shadow-sm">
              <Milk className="w-10 h-10 text-purple-600 mb-3" />
              <h3 className="font-semibold text-lg mb-2">Milk Collection</h3>
              <p className="text-gray-600 text-sm text-center">Record, monitor, and optimize daily milk collections.</p>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <footer className="py-8 bg-white border-t border-gray-100 text-center text-gray-500 text-sm mt-auto">
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 justify-center mb-1">
            <Milk className="w-6 h-6 text-rwanda-blue" />
            <span className="font-bold text-rwanda-blue">INEZA DAIRY</span>
          </div>
          <span>&copy; {new Date().getFullYear()} INEZA DAIRY. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
}