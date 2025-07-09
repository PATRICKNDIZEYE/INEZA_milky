'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Milk, Shield, Truck, MapPin, Calendar, Users, Award } from 'lucide-react';
import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-50 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/rwanda-hills.png')] bg-cover bg-center opacity-5"></div>
        <div className="absolute top-20 left-20 w-32 h-32 bg-rwanda-blue/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-rwanda-green/10 rounded-full blur-3xl"></div>
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
                className="inline-flex items-center px-4 py-2 bg-rwanda-blue/10 text-rwanda-blue rounded-full text-sm font-medium border border-rwanda-blue/20"
              >
                <Milk className="w-4 h-4 mr-2" />
                Made in Rwanda
              </motion.div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Rwanda's Finest
                <span className="text-rwanda-blue block">Dairy Products</span>
                From Our Farms to You
              </h1>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                Supporting local Rwandan dairy farmers while delivering the freshest, highest quality 
                milk and dairy products to homes and businesses across the country.
              </p>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
                <Shield className="w-5 h-5 text-rwanda-green mr-2" />
                <span className="text-sm font-medium">100% Rwandan</span>
              </div>
              <div className="flex items-center px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
                <MapPin className="w-5 h-5 text-rwanda-blue mr-2" />
                <span className="text-sm font-medium">Local Farmers</span>
              </div>
              <div className="flex items-center px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
                <Award className="w-5 h-5 text-rwanda-yellow mr-2" />
                <span className="text-sm font-medium">Premium Quality</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-rwanda-blue hover:bg-rwanda-blue/90 text-white px-8 py-4 text-lg">
                Order Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-rwanda-blue/20 hover:bg-rwanda-blue/5">
                Become a Partner Farmer
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
                <div className="text-3xl font-bold text-rwanda-blue">500+</div>
                <div className="text-sm text-gray-600 flex items-center justify-center">
                  <Users className="w-4 h-4 mr-1 text-rwanda-green" />
                  Local Farmers
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-rwanda-green">50K+</div>
                <div className="text-sm text-gray-600 flex items-center justify-center">
                  <Calendar className="w-4 h-4 mr-1 text-rwanda-blue" />
                  Liters Monthly
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-rwanda-yellow">10+</div>
                <div className="text-sm text-gray-600 flex items-center justify-center">
                  <Award className="w-4 h-4 mr-1 text-rwanda-yellow" />
                  Years Experience
                </div>
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
                  className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
                >
                  <div className="w-16 h-16 bg-rwanda-blue/10 rounded-xl flex items-center justify-center mb-4">
                    <Milk className="w-8 h-8 text-rwanda-blue" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Fresh Milk</h3>
                  <p className="text-sm text-gray-600">Farm-fresh whole milk from Rwandan cows</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-2xl p-6 shadow-xl mt-8 border border-gray-100"
                >
                  <div className="w-16 h-16 bg-rwanda-green/10 rounded-xl flex items-center justify-center mb-4">
                    <div className="w-8 h-8 bg-rwanda-green rounded-full"></div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Ikivuguto</h3>
                  <p className="text-sm text-gray-600">Traditional Rwandan fermented milk</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-2xl p-6 shadow-xl -mt-4 border border-gray-100"
                >
                  <div className="w-16 h-16 bg-rwanda-yellow/10 rounded-xl flex items-center justify-center mb-4">
                    <div className="w-8 h-8 bg-rwanda-yellow rounded-lg"></div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Amavuta</h3>
                  <p className="text-sm text-gray-600">Traditional Rwandan butter</p>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-white rounded-2xl p-6 shadow-xl border border-gray-100"
                >
                  <div className="w-16 h-16 bg-rwanda-green-dark/10 rounded-xl flex items-center justify-center mb-4">
                    <div className="w-8 h-8 bg-rwanda-green-dark rounded-full"></div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Yogurt</h3>
                  <p className="text-sm text-gray-600">Creamy, probiotic-rich yogurt</p>
                </motion.div>
              </div>
            </div>

            {/* Floating Elements */}
            <motion.div
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 w-20 h-20 bg-rwanda-blue/10 rounded-full opacity-60"
            ></motion.div>
            <motion.div
              animate={{ y: [10, -10, 10] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-8 -left-8 w-32 h-32 bg-rwanda-green/10 rounded-full opacity-40"
            ></motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}