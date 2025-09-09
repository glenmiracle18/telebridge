"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, Users, TrendingUp, Globe, Heart } from "lucide-react";

export default function CaseStudies() {
  const caseStudies = [
    {
      id: 1,
      title: "Connecting Rural Rwanda with Global Cardiology Expertise",
      description: "How TeleBridge helped a 45-year-old farmer receive life-saving cardiac consultation from a German specialist",
      image: "/landing/pexels-shkrabaanthony-5217843.jpg",
      category: "Cardiology",
      readTime: "5 min read",
      impact: {
        patients: "150+",
        timeReduced: "85%",
        satisfaction: "98%"
      },
      quote: "Without TeleBridge, I would have needed to travel 8 hours to the capital for a consultation that might not have been available for months.",
      author: {
        name: "Jean Baptiste Uwimana",
        role: "Patient, Kigali",
        avatar: "/landing/headshot_male.jpg"
      },
      doctor: {
        name: "Dr. Mueller Schmidt",
        role: "Cardiologist, Munich Medical Center",
        avatar: "/landing/headshot_male.jpg"
      }
    },
    {
      id: 2,
      title: "Pediatric Neurology Excellence Across Borders",
      description: "A complex pediatric case from Ghana successfully managed through TeleBridge's specialist network",
      image: "/landing/pexels-tima-miroshnichenko-8376207.jpg",
      category: "Pediatric Neurology",
      readTime: "7 min read",
      impact: {
        patients: "85+",
        timeReduced: "92%",
        satisfaction: "100%"
      },
      quote: "The detailed consultation and follow-up care plan gave us confidence in managing our child's condition locally.",
      author: {
        name: "Grace Asante",
        role: "Parent, Accra",
        avatar: "/landing/headshot_female.jpg"
      },
      doctor: {
        name: "Dr. Sarah Chen",
        role: "Pediatric Neurologist, Johns Hopkins",
        avatar: "/landing/headshot_female.jpg"
      }
    },
    {
      id: 3,
      title: "Oncology Second Opinions Save Lives",
      description: "Remote oncology consultations providing critical second opinions for cancer patients in underserved regions",
      image: "/landing/pexels-karolina-grabowska-7195118.jpg",
      category: "Oncology",
      readTime: "6 min read",
      impact: {
        patients: "200+",
        timeReduced: "78%",
        satisfaction: "96%"
      },
      quote: "Getting a second opinion from a world-renowned oncologist changed my treatment plan and gave me hope.",
      author: {
        name: "Maria Santos",
        role: "Patient, São Paulo",
        avatar: "/landing/headshot_female.jpg"
      },
      doctor: {
        name: "Dr. James Wilson",
        role: "Oncologist, Memorial Sloan Kettering",
        avatar: "/landing/headshot_male.jpg"
      }
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur">
        <div className="container max-w-7xl mx-auto flex h-16 items-center px-6">
          <Link href="/" className="mr-8 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-xl">TeleBridge</span>
          </Link>
          <nav className="flex-1 flex items-center justify-end space-x-8">
            <Link href="/case-studies">
              <Button variant="ghost" className="text-gray-900 font-medium">Case Studies</Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">About</Button>
            </Link>
            <Link href="/features">
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">Features</Button>
            </Link>
            <Link href="/">
              <Button variant="outline" className="rounded-lg">
                Back to Home
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-24 md:py-32 bg-white">
          <div className="container max-w-7xl mx-auto px-6">
            <div className="text-center max-w-4xl mx-auto animate-fade-in-up">
              <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Home
              </Link>
              <h1 className="text-5xl md:text-6xl font-medium tracking-tight text-gray-900 leading-tight mb-6">
                Real Stories of
                <br />
                <span className="text-primary">Global Healthcare</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed mb-8">
                See how TeleBridge is transforming lives by connecting patients with world-class specialists, regardless of geographic barriers.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                <div className="text-center space-y-2 animate-fade-in-up animation-delay-200">
                  <div className="text-3xl font-medium text-primary">500+</div>
                  <p className="text-gray-600">Lives Changed</p>
                </div>
                <div className="text-center space-y-2 animate-fade-in-up animation-delay-400">
                  <div className="text-3xl font-medium text-primary">15</div>
                  <p className="text-gray-600">Countries Served</p>
                </div>
                <div className="text-center space-y-2 animate-fade-in-up animation-delay-600">
                  <div className="text-3xl font-medium text-primary">97%</div>
                  <p className="text-gray-600">Success Rate</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Case Studies Grid */}
        <section className="py-24 bg-gray-50">
          <div className="container max-w-7xl mx-auto px-6">
            <div className="space-y-16">
              {caseStudies.map((study, index) => (
                <Card key={study.id} className={`overflow-hidden transition-all duration-300 hover:shadow-2xl border-gray-100 animate-fade-in-up ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`} style={{animationDelay: `${index * 200}ms`}}>
                  <div className="grid lg:grid-cols-2 gap-0">
                    <div className="relative">
                      <div className="aspect-[4/3] lg:aspect-[3/4] relative overflow-hidden">
                        <Image
                          src={study.image}
                          alt={study.title}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                    </div>
                    
                    <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                      <CardHeader className="p-0 mb-6">
                        <div className="flex items-center gap-4 mb-4">
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                            {study.category}
                          </Badge>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            {study.readTime}
                          </div>
                        </div>
                        <CardTitle className="text-2xl lg:text-3xl font-medium text-gray-900 leading-tight">
                          {study.title}
                        </CardTitle>
                        <CardDescription className="text-lg text-gray-600 leading-relaxed">
                          {study.description}
                        </CardDescription>
                      </CardHeader>
                      
                      {/* Impact Stats */}
                      <div className="grid grid-cols-3 gap-6 mb-8 p-6 bg-gray-50 rounded-2xl">
                        <div className="text-center">
                          <div className="text-xl font-medium text-primary mb-1">{study.impact.patients}</div>
                          <div className="text-sm text-gray-600">Patients Helped</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-medium text-primary mb-1">{study.impact.timeReduced}</div>
                          <div className="text-sm text-gray-600">Time Saved</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-medium text-primary mb-1">{study.impact.satisfaction}</div>
                          <div className="text-sm text-gray-600">Satisfaction</div>
                        </div>
                      </div>

                      {/* Quote */}
                      <blockquote className="text-lg text-gray-700 italic mb-6 pl-4 border-l-4 border-primary/20">
                        "{study.quote}"
                      </blockquote>

                      {/* People */}
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={study.author.avatar} alt={study.author.name} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {study.author.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">{study.author.name}</p>
                            <p className="text-sm text-gray-600">{study.author.role}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={study.doctor.avatar} alt={study.doctor.name} />
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {study.doctor.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">{study.doctor.name}</p>
                            <p className="text-sm text-gray-600">{study.doctor.role}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary">
          <div className="container max-w-4xl mx-auto px-6 text-center animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-medium text-white mb-6">
              Ready to be our next success story?
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Join thousands of patients and doctors who are already transforming healthcare delivery through TeleBridge.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="rounded-lg h-12 px-8 text-base font-medium bg-white text-primary hover:bg-gray-50"
              >
                Start Your Journey
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="rounded-lg h-12 px-8 text-base font-medium border-white text-white hover:bg-white hover:text-primary"
              >
                Contact Us
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-16 bg-white">
        <div className="container max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-xl">TeleBridge</span>
            </div>
            <p className="text-gray-600">
              Connecting patients with specialized healthcare across borders.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mt-4">
              <Globe className="w-4 h-4" />
              <span>Available worldwide</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}