'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const testimonials = [
  {
    id: 1,
    name: 'Jean de Dieu Niyonzima',
    role: 'Dairy Farmer, Musanze District',
    image: '/testimonials/farmer-1.jpg',
    rating: 5,
    comment: 'Since partnering with Rwanda Dairy, my income has increased by 40%. Their fair pricing and regular collection schedule have transformed my small farm into a thriving business.',
  },
  {
    id: 2,
    name: 'Marie Claire Uwimana',
    role: 'Restaurant Owner, Kigali',
    image: '/testimonials/chef-1.jpg',
    rating: 5,
    comment: 'The quality of milk we get is exceptional. Our customers always compliment the rich taste of our yogurts and cheeses made with Rwanda Dairy products.',
  },
  {
    id: 3,
    name: 'Emmanuel Ntaganda',
    role: 'Cooperative Leader, Nyabihu',
    image: '/testimonials/coop-leader.jpg',
    rating: 5,
    comment: 'The training and support from Rwanda Dairy have helped our cooperative improve milk quality and increase production. We\'re proud to be part of their network.',
  },
  {
    id: 4,
    name: 'Josiane Mukamana',
    role: 'Mother of Three, Gasabo',
    image: '/testimonials/mother-1.jpg',
    rating: 5,
    comment: 'My children love the fresh milk, and I love knowing it comes from local farmers. The home delivery service makes my life so much easier!',
  },
  {
    id: 5,
    name: 'Dr. Samuel Mugisha',
    role: 'Nutritionist, Kigali',
    image: '/testimonials/nutritionist.jpg',
    rating: 5,
    comment: 'Rwanda Dairy products are a staple in my nutritional recommendations. Their commitment to quality and purity makes them the best choice for healthy dairy consumption.',
  },
];

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-20 bg-gradient-to-br from-white to-rwanda-sky/30 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-rwanda-blue/5 rounded-full -mr-32 -mt-32"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-rwanda-green/5 rounded-full -ml-64 -mb-64"></div>
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 relative z-10"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-rwanda-yellow/10 text-rwanda-yellow text-sm font-medium mb-4">
            <Star className="w-4 h-4 mr-2 fill-current" />
            Testimonials
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Voices from Our <span className="text-rwanda-blue">Rwandan</span> Community
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Hear from farmers, business owners, and families who are part of Rwanda's dairy revolution
          </p>
        </motion.div>

        <div className="relative max-w-4xl mx-auto">
          {/* Main Testimonial */}
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-xl"
          >
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0 relative">
                <div className="absolute -inset-1 bg-rwanda-blue/20 rounded-full blur-md"></div>
                <img
                  src={testimonials[currentIndex].image}
                  alt={testimonials[currentIndex].name}
                  className="relative w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  onError={(e) => {
                    // Fallback to a placeholder if image fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = '/testimonials/placeholder.jpg';
                  }}
                />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex justify-center md:justify-start mb-3">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-rwanda-yellow fill-current" />
                  ))}
                </div>
                
                <blockquote className="relative text-lg text-gray-700 mb-6 px-6 py-4 bg-white/50 rounded-lg">
                  <svg 
                    className="absolute top-4 left-0 w-8 h-8 text-rwanda-blue/20" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="relative z-10">"{testimonials[currentIndex].comment}"</p>
                </blockquote>
                
                <div>
                  <div className="font-medium text-gray-900">
                    {testimonials[currentIndex].name}
                  </div>
                  <div className="text-rwanda-blue font-medium">
                    {testimonials[currentIndex].role}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Navigation Buttons */}
          <button
            onClick={prevTestimonial}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 p-3 rounded-full bg-white shadow-lg text-rwanda-blue hover:bg-rwanda-blue/5 focus:outline-none focus:ring-2 focus:ring-rwanda-blue/50 focus:ring-offset-2 transition-all duration-200 hover:scale-110"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={nextTestimonial}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 p-3 rounded-full bg-white shadow-lg text-rwanda-blue hover:bg-rwanda-blue/5 focus:outline-none focus:ring-2 focus:ring-rwanda-blue/50 focus:ring-offset-2 transition-all duration-200 hover:scale-110"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-12 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-12 h-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex ? 'bg-rwanda-blue w-8' : 'bg-gray-200'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button 
              variant="outline" 
              className="border-rwanda-blue text-rwanda-blue hover:bg-rwanda-blue/5 hover:border-rwanda-blue/80 hover:text-rwanda-blue/90"
            >
              <a href="/register" className="flex items-center">
                Share Your Story
                <ChevronRight className="ml-2 w-4 h-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}