"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart, Globe, Users, Target, Award, Lightbulb, Shield } from "lucide-react";

export default function About() {
  const team = [
    {
      name: "Dr. Amara Okonkwo",
      role: "Founder & CEO",
      bio: "Former WHO Director with 20+ years in global health policy and telemedicine implementation.",
      avatar: "/landing/headshot_female.jpg",
      education: "MD, Harvard Medical School"
    },
    {
      name: "Marcus Chen",
      role: "CTO",
      bio: "Former Google Health engineer, specializing in healthcare technology and platform scalability.",
      avatar: "/landing/headshot_male.jpg",
      education: "PhD Computer Science, MIT"
    },
    {
      name: "Dr. Sofia Rodriguez",
      role: "Chief Medical Officer",
      bio: "Pediatric specialist with extensive experience in international medical consultations.",
      avatar: "/landing/headshot_female.jpg",
      education: "MD, Johns Hopkins University"
    },
    {
      name: "James Wilson",
      role: "Head of Operations",
      bio: "Healthcare operations expert focused on connecting underserved regions with medical expertise.",
      avatar: "/landing/headshot_male.jpg",
      education: "MBA, Wharton Business School"
    }
  ];

  const milestones = [
    {
      year: "2019",
      title: "Founded",
      description: "TeleBridge was founded with a mission to democratize access to specialist healthcare globally."
    },
    {
      year: "2020",
      title: "First 100 Consultations",
      description: "Reached our first major milestone during the global pandemic, proving the value of remote healthcare."
    },
    {
      year: "2021",
      title: "International Expansion",
      description: "Expanded to serve patients across 15 countries in Africa, Asia, and Latin America."
    },
    {
      year: "2022",
      title: "1000+ Specialists",
      description: "Built a network of over 1000 world-class specialists from leading medical institutions."
    },
    {
      year: "2023",
      title: "10,000+ Patients Served",
      description: "Crossed the milestone of serving 10,000 patients with life-changing medical consultations."
    },
    {
      year: "2024",
      title: "AI Integration",
      description: "Launched AI-powered patient matching and diagnostic assistance tools."
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
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">Case Studies</Button>
            </Link>
            <Link href="/about">
              <Button variant="ghost" className="text-gray-900 font-medium">About</Button>
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
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="space-y-8 animate-fade-in-up">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Link>
                <div className="space-y-6">
                  <h1 className="text-5xl md:text-6xl font-medium tracking-tight text-gray-900 leading-tight">
                    Bridging the
                    <br />
                    <span className="text-primary">Global Health Gap</span>
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    We believe that geography should never determine the quality of healthcare you receive. TeleBridge connects patients in underserved regions with world-class medical specialists, making expert healthcare accessible to everyone, everywhere.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-8">
                  <div>
                    <div className="text-3xl font-medium text-primary mb-2">15,000+</div>
                    <p className="text-gray-600">Patients Served</p>
                  </div>
                  <div>
                    <div className="text-3xl font-medium text-primary mb-2">50+</div>
                    <p className="text-gray-600">Countries</p>
                  </div>
                </div>
              </div>

              <div className="relative animate-fade-in-right">
                <div className="relative group">
                  <div className="absolute inset-0 bg-primary/5 rounded-3xl transform -rotate-3 transition-transform duration-300 group-hover:-rotate-6"></div>
                  <div className="relative bg-white rounded-3xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl">
                    <div className="aspect-[4/3] p-6">
                      <div className="w-full h-full rounded-2xl overflow-hidden">
                        <Image
                          src="/landing/pexels-cottonbro-4098274.jpg"
                          alt="Global healthcare mission"
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

        {/* Mission & Values */}
        <section className="py-24 bg-gray-50">
          <div className="container max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-6 animate-fade-in-up">
                Our Mission & Values
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
                We're driven by the belief that every person deserves access to world-class healthcare, regardless of where they live.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center p-8 border-gray-100 transition-all duration-300 hover:shadow-lg hover:border-primary/20 animate-fade-in-up animation-delay-200">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Target className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Accessibility</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Making expert healthcare accessible to everyone, everywhere, breaking down geographic and economic barriers.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-8 border-gray-100 transition-all duration-300 hover:shadow-lg hover:border-primary/20 animate-fade-in-up animation-delay-400">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Award className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Excellence</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Connecting patients with only the highest caliber specialists from leading medical institutions worldwide.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-8 border-gray-100 transition-all duration-300 hover:shadow-lg hover:border-primary/20 animate-fade-in-up animation-delay-600">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Lightbulb className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Innovation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Leveraging cutting-edge technology to create seamless, secure, and effective healthcare experiences.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-24 bg-white">
          <div className="container max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-6 animate-fade-in-up">
                Our Journey
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
                From a simple idea to a global platform transforming healthcare access for millions.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              {milestones.map((milestone, index) => (
                <div key={milestone.year} className={`flex gap-8 mb-12 animate-fade-in-up`} style={{animationDelay: `${index * 100}ms`}}>
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full bg-primary flex-shrink-0 mt-2"></div>
                    {index < milestones.length - 1 && (
                      <div className="w-px bg-gray-200 flex-grow mt-4"></div>
                    )}
                  </div>
                  <div className="flex-grow pb-8">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
                      <h3 className="text-2xl font-medium text-gray-900">{milestone.title}</h3>
                      <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full font-medium">
                        {milestone.year}
                      </span>
                    </div>
                    <p className="text-gray-600 text-lg leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-24 bg-gray-50">
          <div className="container max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-6 animate-fade-in-up">
                Meet Our Leadership Team
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up animation-delay-200">
                A diverse team of healthcare professionals, technologists, and global health experts united by our shared mission.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <Card key={member.name} className={`text-center p-8 border-gray-100 transition-all duration-300 hover:shadow-lg hover:border-primary/20 group animate-fade-in-up`} style={{animationDelay: `${index * 100}ms`}}>
                  <CardHeader className="pb-6">
                    <Avatar className="h-20 w-20 mx-auto mb-4">
                      <AvatarImage src={member.avatar} alt={member.name} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xl">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <CardTitle className="text-xl mb-2">{member.name}</CardTitle>
                    <p className="text-primary font-medium">{member.role}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {member.bio}
                    </p>
                    <p className="text-xs text-gray-500 font-medium">
                      {member.education}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-24 bg-white">
          <div className="container max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8 animate-fade-in-up">
                <div>
                  <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-6">
                    Making a Global Impact
                  </h2>
                  <p className="text-xl text-gray-600 leading-relaxed">
                    Every consultation through TeleBridge represents a life changed, a family supported, and a step toward global healthcare equity.
                  </p>
                </div>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Patient-Centered Care</p>
                      <p className="text-sm text-gray-600">Every decision we make prioritizes patient outcomes and experience</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Globe className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Global Network</p>
                      <p className="text-sm text-gray-600">Specialists from 25+ countries providing care to patients worldwide</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Secure & Compliant</p>
                      <p className="text-sm text-gray-600">HIPAA-compliant platform with enterprise-grade security</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="relative animate-fade-in-right">
                <div className="relative group">
                  <div className="absolute inset-0 bg-primary/5 rounded-3xl transform rotate-2 transition-transform duration-300 group-hover:rotate-3"></div>
                  <div className="relative bg-white rounded-3xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl">
                    <div className="aspect-[4/3]">
                      <Image
                        src="/landing/pexels-shvetsa-4225920.jpg"
                        alt="Global healthcare impact"
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
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary">
          <div className="container max-w-4xl mx-auto px-6 text-center animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-medium text-white mb-6">
              Join us in democratizing healthcare
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Whether you're a patient seeking expert care or a specialist wanting to extend your practice globally, TeleBridge is your platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                variant="secondary"
                className="rounded-lg h-12 px-8 text-base font-medium bg-white text-primary hover:bg-gray-50"
              >
                Get Started Today
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="rounded-lg h-12 px-8 text-base font-medium border-white text-white hover:bg-white hover:text-primary"
              >
                Join as a Specialist
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