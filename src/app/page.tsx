"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, Search, Users, ArrowRight } from "lucide-react";
import Image from "next/image";
import worldMap from "/public/world-map-outline.svg";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <Navbar />
      {/* World Map Background */}
      <div className="absolute inset-0 opacity-10 z-0">
        <Image
          src={worldMap}
          alt="World Map Background"
          layout="fill"
          objectFit="cover"
          quality={50}
        />
      </div>

      {/* Geometric Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 z-1">
        <BackgroundGrid />
      </div>

      {/* Content Container */}
      <div className="relative z-10 container mx-auto px-4 py-16 min-h-screen flex flex-col justify-center items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center pt-7"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-primary relative">
            Profile Mapper
            <span className="absolute -top-2  md:right-15 text-sm bg-primary/20 text-primary px-2 py-1 rounded-full">
              Beta
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mb-10">
            Explore and discover profiles with interactive geographical
            visualization. Connect, learn, and understand the global
            distribution of professionals.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex space-x-4"
        >
          <Button asChild size="lg" className="group relative overflow-hidden">
            <Link href="/profiles" className="flex items-center">
              <Users className="mr-2 h-5 w-5 group-hover:animate-pulse" />
              View Profiles
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>

          <Button
            variant="outline"
            asChild
            size="lg"
            className="group relative overflow-hidden"
          >
            <Link href="/map" className="flex items-center">
              <MapPin className="mr-2 h-5 w-5 group-hover:animate-bounce" />
              Global Map
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 grid md:grid-cols-3 gap-8 max-w-4xl"
        >
          <FeatureCard
            icon={<Users />}
            title="Comprehensive Profiles"
            description="Browse through a diverse collection of professional profiles"
          />
          <FeatureCard
            icon={<MapPin />}
            title="Interactive Mapping"
            description="Visualize profile locations with our advanced mapping technology"
          />
          <FeatureCard
            icon={<Search />}
            title="Advanced Search"
            description="Find profiles quickly with our intelligent search capabilities"
          />
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}

// Background Grid Component
function BackgroundGrid() {
  // Generate concentric circles
  const concentricCircles = useMemo(
    () =>
      [...Array(5)].map((_, i) => ({
        id: i,
        size: (i + 1) * 100,
        delay: i * 0.5,
      })),
    []
  );

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Static Grid */}
      <div className="absolute inset-0 opacity-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          className="text-primary"
        >
          <defs>
            <pattern
              id="grid"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Concentric Pinging Circles */}
      <div className="absolute inset-0 flex items-center justify-center">
        {concentricCircles.map((circle) => (
          <motion.div
            key={circle.id}
            initial={{
              scale: 0,
              opacity: 0.6,
            }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0.6, 0, 0],
            }}
            transition={{
              duration: 3,
              delay: circle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute rounded-full border border-primary/30"
            style={{
              width: circle.size,
              height: circle.size,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// Feature Card Component
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-black/10 backdrop-blur-lg border border-primary/10 rounded-lg p-6 text-center hover:shadow-xl transition-all"
    >
      <div className="mx-auto mb-4 w-16 h-16 flex items-center justify-center text-primary bg-primary/10 rounded-full">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </motion.div>
  );
}
