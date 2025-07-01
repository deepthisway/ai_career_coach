'use client'
import Link from 'next/link';
import React, { useEffect, useRef } from 'react'
import { Button } from './ui/button';
import Image from 'next/image';

const Hero = () => {
  const imageRef = useRef(null);
  // This ref can be used for any future image manipulation or animations
  useEffect(() => {
    const imageElement = imageRef.current;
    const handelScroll = () => {

      const scrollPosition = window.scrollY;
      const scrollThreshold = 100;
      // Check if the page is scrolled down beyond a certain threshold
      if (scrollPosition > scrollThreshold) {
        imageElement.classList.add("scrolled");
      } else {
        imageElement.classList.remove("scrolled");
      }
    };
    window.addEventListener('scroll', handelScroll);
    return () => {
      // Cleanup the event listener on component unmount
      window.removeEventListener('scroll', handelScroll);
    }
},[]) 

  return (
    <section className="w-full pt-36 md:pt-48 pb-10">
      <div className="space-y-6 text-center">
        <div className="space-y-6 mx-auto">
          <h1 className='"text-5xl font-bold md:text-6xl lg:text-7xl xl:text-8xl gradient-title animate-gradient"'>
            AI-Powered Career Guidance
            <br />
            Tailored to You
          </h1>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl">
            Supercharge your career with smart guidance, interview mastery, and
            cutting-edge AI support.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/dashboard">
              <Button size="lg" className="px-8">
                Get Started
              </Button>
            </Link>
            {/* <Link href="/demo">
              <Button size="lg" variant="outline" className="px-8">
                Watch Demo
              </Button>
            </Link> */}
          </div>
          {/* Hero Image */}
          <div className="hero-image-wrapper mt-5 md:mt-0">
            <div ref={imageRef} className="hero-image">
              <Image
                src={"/Hero.jpg"}
                width={1280}
                height={720}
                alt="Dashboard Preview"
                className="rounded-lg shadow-2xl border mx-auto"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero

// priority ensures the image is loaded quickly, improving the initial user experience.  