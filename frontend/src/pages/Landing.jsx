import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Car, Users, DollarSign, MapPin, Star, Shield } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Car className="h-8 w-8 text-black" />
            <span className="text-2xl font-bold text-black">RideShare</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/login')}>
              Log in
            </Button>
            <Button onClick={() => navigate('/signup')} className="bg-black text-white hover:bg-gray-800">
              Sign up
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight">
                Travel Together,
                <span className="block mt-2">Save Together</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Join rides heading your way and split the fare. The smart way to travel without breaking the bank.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/signup')}
                  className="bg-black text-white hover:bg-gray-800 text-lg px-8 py-6"
                >
                  Get Started
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  onClick={() => navigate('/rides')}
                  className="text-lg px-8 py-6 border-2 border-gray-900 hover:bg-gray-50"
                >
                  Find a Ride
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center">
                <Car className="h-64 w-64 text-gray-800" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose RideShare?</h2>
            <p className="text-xl text-gray-600">Save money, meet people, reduce traffic</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center mb-6">
                <DollarSign className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Split the Fare</h3>
              <p className="text-gray-600 leading-relaxed">
                Share rides with others and split the cost. Save up to 70% on your daily commute.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center mb-6">
                <Users className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Join Existing Rides</h3>
              <p className="text-gray-600 leading-relaxed">
                Find rides heading your direction. No need to book a whole car just for yourself.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center mb-6">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">100% Verified & Secure</h3>
              <p className="text-gray-600 leading-relaxed">
                Card-only platform with ID verification. All users verified through credit card and photo ID for maximum safety.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600">Simple, fast, and convenient</p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Sign Up', desc: 'Create your account in seconds' },
              { step: '2', title: 'Find a Ride', desc: 'Search for rides going your way' },
              { step: '3', title: 'Join & Split', desc: 'Book your seat and split the fare' },
              { step: '4', title: 'Travel', desc: 'Enjoy your affordable journey' }
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-gray-900 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { value: '50K+', label: 'Active Users' },
              { value: '200K+', label: 'Rides Completed' },
              { value: '$2M+', label: 'Money Saved' },
              { value: '4.9', label: 'Average Rating' }
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-5xl font-bold mb-2">{stat.value}</div>
                <div className="text-gray-400 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Start Saving?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of smart travelers who are already saving money on every ride.
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/signup')}
            className="bg-black text-white hover:bg-gray-800 text-lg px-12 py-6"
          >
            Sign Up Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Car className="h-6 w-6 text-black" />
            <span className="text-xl font-bold text-black">RideShare</span>
          </div>
          <p className="text-gray-600 mb-4">Travel Together, Save Together</p>
          <p className="text-sm text-gray-500">© 2025 RideShare. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
