"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  
  return (
    <div className="flex flex-col min-h-screen px-8">
      {/* Navigation */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex items-center gap-2">
            <Image 
              src="/telebridge-logo.svg" 
              alt="TeleBridge Logo" 
              width={32} 
              height={32}
              className="h-8 w-8"
              onError={(e) => {
                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 12h-4l-3 9L9 3l-3 9H2'/%3E%3C/svg%3E";
              }}
            />
            <span className="font-bold text-xl">TeleBridge</span>
          </div>
          <nav className="flex-1 flex items-center justify-end space-x-4">
            <Button variant="ghost">About</Button>
            <Button variant="ghost">Features</Button>
            <Button variant="ghost">Testimonials</Button>
            <Button variant="ghost">Contact</Button>
            
            <SignedIn>
              <Button 
                variant="ghost" 
                onClick={() => router.push("/dashboard")}
              >
                Dashboard
              </Button>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost">Sign In</Button>
              </SignInButton>
              <Button onClick={() => router.push("/sign-up")}>Get Started</Button>
            </SignedOut>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-background to-muted">
          <div className="container flex flex-col md:flex-row items-center gap-8 md:gap-16">
            <div className="flex-1 space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                Connecting Patients to Specialized Healthcare
              </h1>
              <p className="text-xl text-muted-foreground">
                TeleBridge connects patients in Rwanda and underserved regions with expert specialists worldwide, eliminating the need for international travel.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <SignedOut>
                  <Button size="lg" onClick={() => router.push("/sign-up")}>Get Started</Button>
                </SignedOut>
                <SignedIn>
                  <Button size="lg" onClick={() => router.push("/dashboard")}>
                    Go to Dashboard
                  </Button>
                </SignedIn>
                <Button size="lg" variant="outline">Learn More</Button>
              </div>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative w-full max-w-md aspect-square">
                <Image 
                  src="/hero-image.svg"
                  alt="TeleBridge connecting patients with doctors"
                  fill
                  className="object-contain"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Ccircle cx='12' cy='8' r='5'/%3E%3Cpath d='M20 21a8 8 0 0 0-16 0'/%3E%3Cline x1='12' y1='11' x2='12' y2='13'/%3E%3Cline x1='12' y1='15' x2='12' y2='15'/%3E%3C/svg%3E";
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 bg-background">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">🌍 Purpose & Mission</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                TeleBridge is a prototype platform designed to solve the lack of specialized healthcare access in Rwanda and other underserved regions.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Connect</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Connect patients with expert doctors including specialists like neurologists, gynecologists, oncologists, and more.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Access</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Provide access to specialized healthcare without the need to travel abroad, saving time and resources.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Transform</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Transform healthcare delivery in underserved regions through innovative telemedicine solutions.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Key Features</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Our platform offers innovative solutions to connect patients with specialists worldwide.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle>Virtual Consultations</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p>Connect with specialists through high-quality video calls, ensuring effective communication and diagnosis.</p>
                </CardContent>
              </Card>
              <Card className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle>Specialist Network</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p>Access a global network of medical specialists including neurologists, gynecologists, oncologists, and more.</p>
                </CardContent>
              </Card>
              <Card className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle>Secure Medical Records</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p>Safely store and share medical records with doctors, ensuring comprehensive and informed care.</p>
                </CardContent>
              </Card>
              <Card className="flex flex-col h-full">
                <CardHeader>
                  <CardTitle>Follow-up Care</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p>Maintain continuity of care through scheduled follow-ups and ongoing communication with specialists.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-background">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Testimonials</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Hear from patients and doctors who have experienced the benefits of TeleBridge.
              </p>
            </div>
            <Carousel className="w-full max-w-4xl mx-auto">
              <CarouselContent>
                <CarouselItem>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <Avatar className="h-16 w-16">
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-lg mb-4">"TeleBridge allowed me to consult with a neurologist without traveling to another country. The experience was seamless and life-changing."</p>
                          <p className="font-semibold">Jean Doe, Patient</p>
                          <p className="text-sm text-muted-foreground">Kigali, Rwanda</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
                <CarouselItem>
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <Avatar className="h-16 w-16">
                          <AvatarFallback>DS</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-lg mb-4">"As a specialist, TeleBridge has enabled me to extend my expertise to patients who would otherwise not have access to specialized care."</p>
                          <p className="font-semibold">Dr. Sarah Smith</p>
                          <p className="text-sm text-muted-foreground">Neurologist</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Bridge the Healthcare Gap?</h2>
            <p className="text-xl max-w-3xl mx-auto mb-8">
              Join us in our mission to make specialized healthcare accessible to everyone, regardless of location.
            </p>
            <SignedOut>
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => router.push("/sign-up")}
              >
                Get Started Today
              </Button>
            </SignedOut>
            <SignedIn>
              <Button 
                size="lg" 
                variant="secondary"
                onClick={() => router.push("/dashboard")}
              >
                Go to Dashboard
              </Button>
            </SignedIn>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/30">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Image 
                  src="/telebridge-logo.svg" 
                  alt="TeleBridge Logo" 
                  width={24} 
                  height={24}
                  className="h-6 w-6"
                  onError={(e) => {
                    e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M22 12h-4l-3 9L9 3l-3 9H2'/%3E%3C/svg%3E";
                  }}
                />
                <span className="font-bold text-lg">TeleBridge</span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs">
                Connecting patients with specialized healthcare across borders.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <h3 className="font-medium">Platform</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Button variant="link" className="p-0 h-auto">Features</Button></li>
                  <li><Button variant="link" className="p-0 h-auto">Security</Button></li>
                  <li><Button variant="link" className="p-0 h-auto">Pricing</Button></li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-medium">Company</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Button variant="link" className="p-0 h-auto">About</Button></li>
                  <li><Button variant="link" className="p-0 h-auto">Careers</Button></li>
                  <li><Button variant="link" className="p-0 h-auto">Contact</Button></li>
                </ul>
              </div>
              <div className="space-y-3">
                <h3 className="font-medium">Legal</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Button variant="link" className="p-0 h-auto">Privacy</Button></li>
                  <li><Button variant="link" className="p-0 h-auto">Terms</Button></li>
                  <li><Button variant="link" className="p-0 h-auto">Cookie Policy</Button></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-6 border-t text-center md:text-left text-sm text-muted-foreground">
            © {new Date().getFullYear()} TeleBridge. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
