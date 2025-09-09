"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Heart, Video, Users, Shield, Clock, Globe, Smartphone, Calendar, FileText, MessageSquare, Stethoscope, Brain, Activity } from "lucide-react";

export default function Features() {
  const features = [
    {
      category: "Core Platform",
      items: [
        {
          icon: Video,
          title: "HD Video Consultations",
          description: "Crystal-clear video calls with specialists worldwide using enterprise-grade technology",
          image: "/landing/pexels-matazumultimedia-33811005.jpg",
          benefits: ["4K video quality", "Low latency worldwide", "Recording capabilities", "Multi-device support"]
        },
        {
          icon: Users,
          title: "Global Specialist Network",
          description: "Access to over 1,000 verified specialists from leading medical institutions",
          image: "/landing/pexels-shkrabaanthony-5217852.jpg",
          benefits: ["25+ medical specialties", "Board-certified doctors", "Multi-language support", "24/7 availability"]
        },
        {
          icon: Shield,
          title: "Enterprise Security",
          description: "HIPAA-compliant platform with bank-level encryption and security protocols",
          image: "/landing/pexels-cottonbro-4098274.jpg",
          benefits: ["End-to-end encryption", "HIPAA compliance", "Data sovereignty", "Audit trails"]
        }
      ]
    },
    {
      category: "Patient Experience",
      items: [
        {
          icon: Smartphone,
          title: "Mobile-First Design",
          description: "Seamless experience across all devices with our responsive platform",
          image: "/landing/pexels-karolina-grabowska-7195118.jpg",
          benefits: ["iOS & Android apps", "Web platform", "Offline capabilities", "Easy onboarding"]
        },
        {
          icon: Calendar,
          title: "Smart Scheduling",
          description: "AI-powered scheduling that considers time zones and specialist availability",
          image: "/landing/pexels-tima-miroshnichenko-8376207.jpg",
          benefits: ["Timezone automation", "Reminder systems", "Rescheduling options", "Waitlist management"]
        },
        {
          icon: FileText,
          title: "Digital Health Records",
          description: "Secure, comprehensive health records accessible to you and your care team",
          image: "/landing/pexels-shkrabaanthony-5217843.jpg",
          benefits: ["Complete history", "Test results integration", "Prescription tracking", "Care plan access"]
        }
      ]
    },
    {
      category: "Advanced Features",
      items: [
        {
          icon: Brain,
          title: "AI-Powered Matching",
          description: "Intelligent system that connects you with the most suitable specialist for your condition",
          image: "/landing/pexels-shvetsa-4225920.jpg",
          benefits: ["Symptom analysis", "Specialist matching", "Priority scoring", "Outcome prediction"]
        },
        {
          icon: MessageSquare,
          title: "Secure Messaging",
          description: "HIPAA-compliant messaging system for ongoing communication with your care team",
          image: "/landing/image2.jpeg",
          benefits: ["Real-time chat", "File sharing", "Translation support", "Message encryption"]
        },
        {
          icon: Activity,
          title: "Health Monitoring",
          description: "Integration with health devices and continuous monitoring capabilities",
          image: "/landing/image3.jpeg",
          benefits: ["Device integration", "Vital tracking", "Alert systems", "Trend analysis"]
        }
      ]
    }
  ];

  const stats = [
    { number: "99.9%", label: "Uptime Guarantee", description: "Reliable platform you can count on" },
    { number: "<100ms", label: "Global Latency", description: "Real-time communication worldwide" },
    { number: "256-bit", label: "Encryption", description: "Bank-level security for all data" },
    { number: "24/7", label: "Support", description: "Always available when you need help" }
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
              <Button variant="ghost" className="text-gray-600 hover:text-gray-900">About</Button>
            </Link>
            <Link href="/features">
              <Button variant="ghost" className="text-gray-900 font-medium">Features</Button>
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
                Powerful Features for
                <br />
                <span className="text-primary">Modern Healthcare</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed mb-12">
                Discover the comprehensive platform that's revolutionizing how patients connect with specialists worldwide. Built for reliability, security, and ease of use.
              </p>

              {/* Hero Image */}
              <div className="relative max-w-5xl mx-auto mb-16 animate-fade-in-up animation-delay-200">
                <div className="absolute inset-0 bg-primary/5 rounded-3xl transform rotate-1"></div>
                <div className="relative bg-white rounded-3xl border border-gray-100 overflow-hidden">
                  <div className="aspect-[16/9]">
                    <Image
                      src="/landing/image1.jpeg"
                      alt="TeleBridge platform interface"
                      width={1000}
                      height={563}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-50">
          <div className="container max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={stat.label} className={`text-center animate-fade-in-up`} style={{animationDelay: `${index * 100}ms`}}>
                  <div className="text-3xl font-medium text-primary mb-2">{stat.number}</div>
                  <div className="font-medium text-gray-900 mb-1">{stat.label}</div>
                  <p className="text-sm text-gray-600">{stat.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Sections */}
        {features.map((category, categoryIndex) => (
          <section key={category.category} className={`py-24 ${categoryIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
            <div className="container max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 mb-4 animate-fade-in-up">
                  {category.category}
                </Badge>
                <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-6 animate-fade-in-up animation-delay-200">
                  {category.category === 'Core Platform' && 'Essential Platform Capabilities'}
                  {category.category === 'Patient Experience' && 'Designed for Your Convenience'}
                  {category.category === 'Advanced Features' && 'Next-Generation Healthcare Technology'}
                </h2>
              </div>

              <div className="space-y-16">
                {category.items.map((feature, index) => {
                  const Icon = feature.icon;
                  const isEven = index % 2 === 0;
                  
                  return (
                    <div key={feature.title} className={`grid lg:grid-cols-2 gap-12 lg:gap-20 items-center ${!isEven ? 'lg:flex-row-reverse' : ''}`}>
                      <div className={`space-y-8 animate-fade-in-up ${!isEven ? 'lg:order-2' : ''}`} style={{animationDelay: `${index * 200}ms`}}>
                        <div className="space-y-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                              <Icon className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-2xl md:text-3xl font-medium text-gray-900">{feature.title}</h3>
                          </div>
                          <p className="text-xl text-gray-600 leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {feature.benefits.map((benefit, benefitIndex) => (
                            <div key={benefitIndex} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
                              <span className="text-gray-700 font-medium">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className={`relative animate-fade-in-right ${!isEven ? 'lg:order-1' : ''}`} style={{animationDelay: `${index * 200 + 100}ms`}}>
                        <div className="relative group">
                          <div className={`absolute inset-0 bg-primary/5 rounded-3xl transform transition-transform duration-300 ${isEven ? 'rotate-3 group-hover:rotate-6' : '-rotate-3 group-hover:-rotate-6'}`}></div>
                          <div className="relative bg-white rounded-3xl border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:border-primary/20">
                            <div className="aspect-[4/3] p-6">
                              <div className="w-full h-full rounded-2xl overflow-hidden">
                                <Image
                                  src={feature.image}
                                  alt={feature.title}
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
                  );
                })}
              </div>
            </div>
          </section>
        ))}

        {/* Integration Section */}
        <section className="py-24 bg-primary">
          <div className="container max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 animate-fade-in-up">
              <h2 className="text-3xl md:text-4xl font-medium text-white mb-6">
                Seamless Integrations
              </h2>
              <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto">
                TeleBridge integrates with your existing healthcare ecosystem, electronic health records, and medical devices for a unified experience.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center p-8 bg-white/10 border-white/20 text-white transition-all duration-300 hover:bg-white/20 animate-fade-in-up animation-delay-200">
                <CardHeader className="pb-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">EHR Integration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-primary-foreground/80">
                    Seamlessly connect with Epic, Cerner, and other major electronic health record systems.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-8 bg-white/10 border-white/20 text-white transition-all duration-300 hover:bg-white/20 animate-fade-in-up animation-delay-400">
                <CardHeader className="pb-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                    <Stethoscope className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">Medical Devices</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-primary-foreground/80">
                    Integration with wearables, monitoring devices, and diagnostic equipment for comprehensive care.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center p-8 bg-white/10 border-white/20 text-white transition-all duration-300 hover:bg-white/20 animate-fade-in-up animation-delay-600">
                <CardHeader className="pb-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">Global Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-primary-foreground/80">
                    HIPAA, GDPR, and regional compliance standards ensuring global healthcare delivery.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-white">
          <div className="container max-w-4xl mx-auto px-6 text-center animate-fade-in-up">
            <h2 className="text-3xl md:text-4xl font-medium text-gray-900 mb-6">
              Ready to experience the future of healthcare?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of patients and healthcare providers who trust TeleBridge for world-class medical consultations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="rounded-lg h-12 px-8 text-base font-medium"
              >
                Start Free Trial
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="rounded-lg h-12 px-8 text-base font-medium"
              >
                Schedule Demo
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