
import React from "react";
import { Link } from "react-router-dom";
import { AnimatedGradient } from "@/components/ui/animated-gradient";
import { CustomButton } from "@/components/ui/custom-button";
import { GlassCard } from "@/components/ui/glass-card";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Calendar, Clock, Building, Users, BookOpen, Sparkles } from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: <Calendar className="h-10 w-10 text-primary" />,
      title: "Smart Scheduling",
      description: "AI-powered algorithm that automatically creates conflict-free timetables."
    },
    {
      icon: <Clock className="h-10 w-10 text-primary" />,
      title: "Time Optimization",
      description: "Optimize faculty time and room usage with efficient allocations."
    },
    {
      icon: <Building className="h-10 w-10 text-primary" />,
      title: "Room Management",
      description: "Track room capacity and facilities to ensure perfect matches for courses."
    },
    {
      icon: <Users className="h-10 w-10 text-primary" />,
      title: "Faculty Workload",
      description: "Balance teaching loads and avoid scheduling conflicts."
    },
    {
      icon: <BookOpen className="h-10 w-10 text-primary" />,
      title: "Course Tracking",
      description: "Manage course details, enrollments, and scheduling requirements."
    },
    {
      icon: <Sparkles className="h-10 w-10 text-primary" />,
      title: "Intelligent Generation",
      description: "Generate optimized timetables at the click of a button."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b" 
          alt="Background" 
          className="w-full h-full object-cover opacity-10"
        />
      </div>
      
      <AnimatedGradient />
      <Navbar />
      
      <main className="flex-grow pt-32 pb-20 relative z-10">
        {/* Hero Section */}
        <section className="container px-4 mx-auto">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-6 animate-fade-in">
              AI-Powered Scheduling
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-slide-up">
              Effortless Timetable Creation with <span className="text-gradient">Class Chronos</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl animate-slide-up delay-100">
              The intelligent scheduling system that eliminates conflicts and optimizes resource allocation, saving you hours of manual work.
            </p>
            <div className="flex flex-wrap gap-4 justify-center animate-slide-up delay-200">
              <Link to="/timetable">
                <CustomButton size="lg" className="shadow-lg">
                  View Timetable
                </CustomButton>
              </Link>
              <Link to="/courses">
                <CustomButton size="lg" variant="secondary" className="shadow-md border border-gray-200 dark:border-gray-800">
                  Add Data
                </CustomButton>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container px-4 mx-auto mt-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Intelligent Scheduling Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered system handles the complexity of timetable creation while you focus on education.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <GlassCard 
                key={index} 
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 p-3 rounded-full bg-primary/10">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container px-4 mx-auto mt-32">
          <div className="relative overflow-hidden rounded-2xl bg-primary p-8 md:p-12">
            <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-accent opacity-90"></div>
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Ready to simplify your scheduling process?
              </h2>
              <p className="text-primary-foreground/90 text-lg mb-8">
                Start by adding your courses, faculty, and rooms - then let our AI create the perfect timetable.
              </p>
              <Link to="/courses">
                <CustomButton 
                  size="lg" 
                  variant="secondary" 
                  className="bg-white hover:bg-gray-100 text-primary font-medium shadow-md"
                >
                  Get Started Now
                </CustomButton>
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
