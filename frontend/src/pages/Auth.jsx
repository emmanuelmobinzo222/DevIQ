import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Car, Mail, Lock, User, Phone, CreditCard, Upload, MapPin } from 'lucide-react';
import { setCurrentUser } from '../mockData';
import { useToast } from '../hooks/use-toast';

const Auth = ({ mode = 'login' }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'rider',
    cardNumber: '',
    cardExpiry: '',
    cardCVV: '',
    idImage: null,
    location: null
  });
  const [idImagePreview, setIdImagePreview] = useState(null);
  const [locationDetected, setLocationDetected] = useState(false);

  useEffect(() => {
    // Detect user's location automatically
    if (mode === 'signup' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Reverse geocoding to get location details
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
            .then(res => res.json())
            .then(data => {
              const country = data.address?.country || 'Unknown';
              setFormData(prev => ({
                ...prev,
                location: {
                  lat: latitude,
                  lng: longitude,
                  country: country,
                  city: data.address?.city || data.address?.town || '',
                  address: data.display_name
                }
              }));
              setLocationDetected(true);
              toast({
                title: 'Location Detected',
                description: `${country}`,
              });
            })
            .catch(() => {
              setFormData(prev => ({
                ...prev,
                location: { lat: latitude, lng: longitude, country: 'South Africa' }
              }));
              setLocationDetected(true);
            });
        },
        (error) => {
          // Default to South Africa if geolocation fails
          setFormData(prev => ({
            ...prev,
            location: { lat: -26.2041, lng: 28.0473, country: 'South Africa', city: 'Johannesburg' }
          }));
          setLocationDetected(true);
          toast({
            title: 'Location Set',
            description: 'Defaulted to South Africa',
          });
        }
      );
    }
  }, [mode, toast]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mock authentication
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name || 'User',
      email: formData.email,
      role: formData.role,
      phone: formData.phone,
      rating: 5.0,
      totalRides: 0,
      verified: true,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.email}`
    };
    
    setCurrentUser(user);
    
    toast({
      title: mode === 'login' ? 'Welcome back!' : 'Account created!',
      description: `Successfully ${mode === 'login' ? 'logged in' : 'signed up'} as ${user.name}`,
    });
    
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Car className="h-10 w-10 text-black" />
            <span className="text-3xl font-bold text-black">RideShare</span>
          </div>
          <p className="text-gray-600">Travel Together, Save Together</p>
        </div>

        <Card className="shadow-lg border-0">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
            <CardDescription className="text-center">
              {mode === 'login' 
                ? 'Enter your credentials to continue' 
                : 'Sign up to start sharing rides'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="phone"
                        placeholder="+1234567890"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label>I want to</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant={formData.role === 'rider' ? 'default' : 'outline'}
                      onClick={() => setFormData({ ...formData, role: 'rider' })}
                      className={formData.role === 'rider' ? 'bg-black text-white' : ''}
                    >
                      Be a Rider
                    </Button>
                    <Button
                      type="button"
                      variant={formData.role === 'driver' ? 'default' : 'outline'}
                      onClick={() => setFormData({ ...formData, role: 'driver' })}
                      className={formData.role === 'driver' ? 'bg-black text-white' : ''}
                    >
                      Be a Driver
                    </Button>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">
                {mode === 'login' ? 'Log In' : 'Sign Up'}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-gray-600">
                {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
              </span>
              <button
                onClick={() => navigate(mode === 'login' ? '/signup' : '/login')}
                className="text-black font-semibold hover:underline"
              >
                {mode === 'login' ? 'Sign up' : 'Log in'}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
