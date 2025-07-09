'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Milk, Shield, Truck } from 'lucide-react';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-sky-50 via-white to-sky-100 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-sky-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-teal-400 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center px-4 py-2 bg-sky-100 text-sky-700 rounded-full text-sm font-medium"
              >
                <Milk className="w-4 h-4 mr-2" />
                Fresh Daily Delivery
              </motion.div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Pure, Fresh
                <span className="text-sky-500 block">Dairy Products</span>
                Delivered Daily
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Experience the finest quality dairy products sourced directly from local farms. 
                Fresh milk, artisanal cheeses, and premium dairy delivered to your doorstep.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center px-4 py-2 bg-white rounded-full shadow-sm border">
                <Shield className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm font-medium">100% Organic</span>
              </div>
              <div className="flex items-center px-4 py-2 bg-white rounded-full shadow-sm border">
                <Truck className="w-5 h-5 text-blue-500 mr-2" />
                <span className="text-sm font-medium">Same Day Delivery</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-4 text-lg">
                Order Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-sky-200 hover:bg-sky-50">
                Become a Partner
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-sky-500">10K+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-sky-500">99.9%</div>
                <div className="text-sm text-gray-600">Quality Rating</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-sky-500">24/7</div>
                <div className="text-sm text-gray-600">Fresh Supply</div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Content - Product Showcase */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative z-10">
              <div className="grid grid-cols-2 gap-6">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-2xl p-6 shadow-xl"
                >
                  <div className="w-16 h-16 bg-sky-100 rounded-xl flex items-center justify-center mb-4">
                    <Milk className="w-8 h-8 text-sky-500" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Fresh Milk</h3>
                  <p className="text-sm text-gray-600">Farm-fresh whole milk delivered daily</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-2xl p-6 shadow-xl mt-8"
                >
                  <div className="w-16 h-16 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                    <div className="w-8 h-8 bg-teal-500 rounded-full"></div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Artisan Cheese</h3>
                  <p className="text-sm text-gray-600">Handcrafted premium cheese varieties</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-2xl p-6 shadow-xl -mt-4"
                >
                  <div className="w-16 h-16 bg-yellow-100 rounded-xl flex items-center justify-center mb-4">
                    <div className="w-8 h-8 bg-yellow-500 rounded-lg"></div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Fresh Butter</h3>
                  <p className="text-sm text-gray-600">Creamy, rich butter from local farms</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-2xl p-6 shadow-xl"
                >
                  <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                    <div className="w-8 h-8 bg-purple-500 rounded-full"></div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Greek Yogurt</h3>
                  <p className="text-sm text-gray-600">Protein-rich, probiotic yogurt</p>
                </motion.div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 w-20 h-20 bg-sky-200 rounded-full opacity-60"
            ></motion.div>
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-8 -left-8 w-32 h-32 bg-teal-200 rounded-full opacity-40"
            ></motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}