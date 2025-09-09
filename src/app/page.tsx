"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Video, Users, Shield, Calendar, Heart, Globe } from "lucide-react";

export default function Home() {
  const router = useRouter();
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur">
        <div className="container max-w-7xl mx-auto flex h-16 items-center px-6">
          <div className="mr-8 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-xl">TeleBridge</span>
          </div>
          <nav className="flex-1 flex items-center justify-end space-x-8">
            <Link href="/features">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">Features</Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">About</Button>
            </Link>
            <Link href="/case-studies">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">Case Studies</Button>
            </Link>
            
            <SignedIn>
              <Button 
                variant="ghost" 
                onClick={() => router.push("/dashboard")}
                className="text-gray-600 hover:text-gray-900"
              >
                Dashboard
              </Button>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" className="text-gray-600 hover:text-gray-900">Sign In</Button>
              </SignInButton>
              <Button onClick={() => router.push("/sign-up")} className="rounded-lg">
                Get Started
              </Button>
            </SignedOut>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 md:py-32 bg-white">
          <div className="container max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="space-y-8 animate-fade-in-up">
                <div className="space-y-4">
                  <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-gray-900 leading-tight">
                    Expert Care,
                    <br />
                    <span className="text-primary">Anywhere</span>
                  </h1>
                  <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-xl">
                    Connect with world-class specialists from home. Quality healthcare without borders.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <SignedOut>
                    <Button 
                      size="lg" 
                      onClick={() => router.push("/sign-up")}
                      className="rounded-lg h-12 px-8 text-base font-medium"
                    >
                      Start Consultation
                    </Button>
                  </SignedOut>
                  <SignedIn>
                    <Button 
                      size="lg" 
                      onClick={() => router.push("/dashboard")}
                      className="rounded-lg h-12 px-8 text-base font-medium"
                    >
                      Go to Dashboard
                    </Button>
                  </SignedIn>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="rounded-lg h-12 px-8 text-base font-medium border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    Learn More
                  </Button>
                </div>

                <div className="flex items-center gap-8 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      <div className="w-8 h-8 rounded-full bg-primary/10 border-2 border-white"></div>
                      <div className="w-8 h-8 rounded-full bg-green-100 border-2 border-white"></div>
                      <div className="w-8 h-8 rounded-full bg-blue-100 border-2 border-white"></div>
                    </div>
                    <span className="text-sm text-gray-600 ml-2">1000+ patients helped</span>
                  </div>
                </div>
              </div>

              <div className="relative lg:pl-8 animate-fade-in-right">
                <div className="relative group">
                  <div className="absolute inset-0 bg-primary/5 rounded-3xl transform rotate-3 transition-transform duration-300 group-hover:rotate-6"></div>
                  <div className="relative bg-white rounded-3xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-primary/20">
                    <div className="aspect-[4/3] p-6">
                      <div className="w-full h-full rounded-2xl overflow-hidden">
                        <Image
                          src="/landing/image1.jpeg"
                          alt="Virtual consultation interface"
                          width={600}
                          height={450}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-gray-50">
          <div className="container max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-4">
                Healthcare that works for everyone
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Connecting patients in underserved regions with world-class specialists, eliminating barriers to expert care.
              </p>
            </div>

            <div className="mb-12">
              <div className="relative max-w-4xl mx-auto">
                <div className="absolute inset-0 bg-primary/5 rounded-3xl transform rotate-1"></div>
                <div className="relative bg-white rounded-3xl border border-gray-100 overflow-hidden">
                  <div className="aspect-[16/9]">
                    <Image
                      src="/landing/image3.jpeg"
                      alt="Global healthcare network"
                      width={800}
                      height={450}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-4 animate-fade-in-up animation-delay-200 group">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                  <Video className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium text-gray-900">Virtual Consultations</h3>
                <p className="text-gray-600">
                  High-quality video calls with specialists worldwide, ensuring effective diagnosis and treatment plans.
                </p>
              </div>
              
              <div className="text-center space-y-4 animate-fade-in-up animation-delay-400 group">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium text-gray-900">Expert Network</h3>
                <p className="text-gray-600">
                  Access to neurologists, cardiologists, oncologists, and other specialists from leading medical institutions.
                </p>
              </div>
              
              <div className="text-center space-y-4 animate-fade-in-up animation-delay-600 group">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto transition-all duration-300 group-hover:bg-primary/20 group-hover:scale-110">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-medium text-gray-900">Secure & Private</h3>
                <p className="text-gray-600">
                  HIPAA-compliant platform ensuring your medical data is protected with enterprise-grade security.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-24 bg-white">
          <div className="container max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-4">
                    Bridging the healthcare gap in underserved regions
                  </h2>
                  <p className="text-xl text-gray-600">
                    Millions lack access to specialized care. We're changing that by connecting patients directly with world-class specialists.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <div className="text-3xl font-medium text-primary mb-2">1000+</div>
                    <p className="text-gray-600">Consultations completed</p>
                  </div>
                  <div>
                    <div className="text-3xl font-medium text-primary mb-2">50+</div>
                    <p className="text-gray-600">Specialist doctors</p>
                  </div>
                  <div>
                    <div className="text-3xl font-medium text-primary mb-2">15</div>
                    <p className="text-gray-600">Medical specialties</p>
                  </div>
                  <div>
                    <div className="text-3xl font-medium text-primary mb-2">95%</div>
                    <p className="text-gray-600">Patient satisfaction</p>
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/5 rounded-3xl transform -rotate-2"></div>
                  <div className="relative bg-white rounded-3xl border border-gray-100 overflow-hidden">
                    <div className="aspect-[4/3]">
                      <Image
                        src="/landing/image2.jpeg"
                        alt="Healthcare consultation process"
                        width={600}
                        height={450}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">Schedule → Consult → Care</p>
                          <p className="text-xs text-gray-600">Simple 3-step process</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-gray-50">
          <div className="container max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-4">
                Trusted by patients and doctors worldwide
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Real stories from people whose lives have been changed by accessible healthcare.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-3xl p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/landing/headshot_female.jpg" alt="Amelia Mukamana" />
                    <AvatarFallback className="bg-primary/10 text-primary">AM</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">Amelia Mukamana</p>
                    <p className="text-sm text-gray-600">Patient from Kigali, Rwanda</p>
                  </div>
                </div>
                <p className="text-gray-700 text-lg">
                  "I was able to get a second opinion from a cardiologist in Germany without leaving Rwanda. The consultation was clear, professional, and gave me the confidence I needed for my treatment."
                </p>
              </div>
              
              <div className="bg-white rounded-3xl p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/landing/headshot_male.jpg" alt="Dr. Robert Chen" />
                    <AvatarFallback className="bg-primary/10 text-primary">DR</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900">Dr. Robert Chen</p>
                    <p className="text-sm text-gray-600">Neurologist, Johns Hopkins</p>
                  </div>
                </div>
                <p className="text-gray-700 text-lg">
                  "TeleBridge allows me to extend my practice globally and help patients who would otherwise have no access to neurological expertise. It's incredibly rewarding."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary">
          <div className="container max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl md:text-4xl font-medium text-white mb-6">
              Ready to connect with world-class specialists?
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Join thousands of patients who have found expert care through TeleBridge. Your health journey starts here.
            </p>
            <SignedOut>
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => router.push("/sign-up")}
                className="rounded-lg h-12 px-8 text-base font-medium bg-white text-primary hover:bg-gray-50"
              >
                Start Your Consultation
              </Button>
            </SignedOut>
            <SignedIn>
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => router.push("/dashboard")}
                className="rounded-lg h-12 px-8 text-base font-medium bg-white text-primary hover:bg-gray-50"
              >
                Go to Dashboard
              </Button>
            </SignedIn>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-16 bg-white">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="font-semibold text-xl">TeleBridge</span>
              </div>
              <p className="text-gray-600 max-w-xs">
                Connecting patients with specialized healthcare across borders.
              </p>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Globe className="w-4 h-4" />
                <span>Available worldwide</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Platform</h3>
              <ul className="space-y-3 text-gray-600">
                <li><button className="hover:text-gray-900 transition-colors">How it works</button></li>
                <li><button className="hover:text-gray-900 transition-colors">Specialists</button></li>
                <li><button className="hover:text-gray-900 transition-colors">Security</button></li>
                <li><button className="hover:text-gray-900 transition-colors">Pricing</button></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Company</h3>
              <ul className="space-y-3 text-gray-600">
                <li><button className="hover:text-gray-900 transition-colors">About</button></li>
                <li><button className="hover:text-gray-900 transition-colors">Mission</button></li>
                <li><button className="hover:text-gray-900 transition-colors">Careers</button></li>
                <li><button className="hover:text-gray-900 transition-colors">Contact</button></li>
              </ul>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Support</h3>
              <ul className="space-y-3 text-gray-600">
                <li><button className="hover:text-gray-900 transition-colors">Help Center</button></li>
                <li><button className="hover:text-gray-900 transition-colors">Privacy</button></li>
                <li><button className="hover:text-gray-900 transition-colors">Terms</button></li>
                <li><button className="hover:text-gray-900 transition-colors">Status</button></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} TeleBridge. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm">
              Made with ❤️ for global healthcare access
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
