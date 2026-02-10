import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Code2, Zap, Smartphone, Sparkles, Check, ArrowRight } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Code2 className="h-8 w-8" />,
      title: "AI-Powered Development",
      description: "Generate complete mobile apps using advanced AI technology"
    },
    {
      icon: <Zap className="h-8 w-8" />,
      title: "Instant Creation",
      description: "Build iOS and Android apps in minutes, not months"
    },
    {
      icon: <Smartphone className="h-8 w-8" />,
      title: "Cross-Platform",
      description: "One codebase for both iOS and Android platforms"
    },
    {
      icon: <Sparkles className="h-8 w-8" />,
      title: "Smart Templates",
      description: "Start with pre-built templates and customize instantly"
    }
  ];

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      features: [
        "3 active projects",
        "Basic AI assistance",
        "Community support",
        "Standard templates",
        "Export code"
      ],
      cta: "Start Free",
      popular: false
    },
    {
      name: "Pro",
      price: "$9.99",
      period: "/month",
      features: [
        "Unlimited projects",
        "Advanced AI features",
        "Priority support",
        "Premium templates",
        "Code optimization",
        "Export to GitHub"
      ],
      cta: "Go Pro",
      popular: true
    },
    {
      name: "Enterprise",
      price: "$29.99",
      period: "/month",
      features: [
        "Everything in Pro",
        "Team collaboration",
        "Custom branding",
        "API access",
        "Dedicated support",
        "Advanced analytics"
      ],
      cta: "Contact Sales",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] to-[#1a4d8f]">
      {/* Header */}
      <header className="fixed top-0 w-full bg-[#0a1628]/95 backdrop-blur-sm border-b border-blue-800/50 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Code2 className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">DEVIQ</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-white hover:text-blue-400" onClick={() => navigate('/login')}>
              Log in
            </Button>
            <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={() => navigate('/signup')}>
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Build Mobile Apps
            <span className="block mt-2 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              With AI Magic
            </span>
          </h1>
          <p className="text-xl sm:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Create stunning iOS and Android applications instantly using the power of artificial intelligence. No coding experience required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate('/signup')}
              className="bg-blue-600 text-white hover:bg-blue-700 text-lg px-8 py-6"
            >
              Start Building Free <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              className="text-white border-2 border-blue-400 hover:bg-blue-900/50 text-lg px-8 py-6"
            >
              Watch Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0d1f3a]/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose DEVIQ?</h2>
            <p className="text-xl text-blue-200">The smartest way to build mobile applications</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-[#1a2f4a] p-6 rounded-xl border border-blue-700/30 hover:border-blue-500/50 transition-all hover:scale-105">
                <div className="text-blue-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-blue-200">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-blue-200">Choose the perfect plan for your needs</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <div 
                key={index} 
                className={`relative bg-[#1a2f4a] p-8 rounded-xl border ${
                  plan.popular ? 'border-blue-500 shadow-xl shadow-blue-500/20' : 'border-blue-700/30'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-blue-200 ml-2">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="h-5 w-5 text-blue-400 mr-2 flex-shrink-0 mt-0.5" />
                      <span className="text-blue-100">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className={`w-full ${
                    plan.popular 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-[#2a3f5a] hover:bg-[#3a4f6a] text-white'
                  }`}
                  onClick={() => navigate('/signup')}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#0d1f3a]/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Build Your App?</h2>
          <p className="text-xl text-blue-200 mb-8">
            Join thousands of developers using AI to create amazing mobile applications.
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/signup')}
            className="bg-blue-600 text-white hover:bg-blue-700 text-lg px-12 py-6"
          >
            Start Building Now <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a1628] py-12 px-4 sm:px-6 lg:px-8 border-t border-blue-800/50">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Code2 className="h-6 w-6 text-blue-400" />
            <span className="text-xl font-bold text-white">DEVIQ</span>
          </div>
          <p className="text-blue-200 mb-4">AI-Powered Mobile App Development</p>
          <p className="text-sm text-blue-300">© 2025 DEVIQ. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
