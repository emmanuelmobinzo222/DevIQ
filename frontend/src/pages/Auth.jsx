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
    idNumber: '',
    idImage: null,
    selfieWithId: null,
    location: null,
    bankAccount: null,
    children: []
  });
  const [idImagePreview, setIdImagePreview] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);
  const [locationDetected, setLocationDetected] = useState(false);
  const [showBankForm, setShowBankForm] = useState(false);
  const [showChildForm, setShowChildForm] = useState(false);

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

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, idImage: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      toast({
        title: 'ID Uploaded',
        description: 'Your identification document has been uploaded',
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate card details for signup
    if (mode === 'signup') {
      if (!formData.cardNumber || formData.cardNumber.length < 16) {
        toast({
          title: 'Invalid Card',
          description: 'Please enter a valid credit card number',
          variant: 'destructive',
        });
        return;
      }
      
      if (!formData.idImage) {
        toast({
          title: 'ID Required',
          description: 'Please upload your identification document',
          variant: 'destructive',
        });
        return;
      }
    }
    
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
      cardVerified: mode === 'signup' ? true : false,
      idVerified: mode === 'signup' ? true : false,
      location: formData.location,
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
                        placeholder="+27 12 345 6789"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {/* Location Display */}
                  {locationDetected && formData.location && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4 text-green-600" />
                        <div>
                          <p className="font-semibold text-green-900">Location Detected</p>
                          <p className="text-green-700">
                            {formData.location.city}, {formData.location.country}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
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
                <>
                  {/* Credit Card Information */}
                  <div className="space-y-3 pt-2 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-5 w-5 text-gray-700" />
                      <Label className="text-base font-semibold">Card Verification (Required)</Label>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={formData.cardNumber}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\s/g, '');
                          if (value.length <= 16 && /^\d*$/.test(value)) {
                            setFormData({ ...formData, cardNumber: value });
                          }
                        }}
                        maxLength={19}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="cardExpiry">Expiry (MM/YY)</Label>
                        <Input
                          id="cardExpiry"
                          placeholder="12/25"
                          value={formData.cardExpiry}
                          onChange={(e) => {
                            let value = e.target.value.replace(/\D/g, '');
                            if (value.length >= 2) {
                              value = value.slice(0, 2) + '/' + value.slice(2, 4);
                            }
                            setFormData({ ...formData, cardExpiry: value });
                          }}
                          maxLength={5}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cardCVV">CVV</Label>
                        <Input
                          id="cardCVV"
                          placeholder="123"
                          type="password"
                          value={formData.cardCVV}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 3) {
                              setFormData({ ...formData, cardCVV: value });
                            }
                          }}
                          maxLength={3}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* ID Verification */}
                  <div className="space-y-3 pt-2 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <Upload className="h-5 w-5 text-gray-700" />
                      <Label className="text-base font-semibold">ID Verification (Required)</Label>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="idImage">Upload ID Document</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors">
                        <input
                          type="file"
                          id="idImage"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          required
                        />
                        <label htmlFor="idImage" className="cursor-pointer block text-center">
                          {idImagePreview ? (
                            <div className="space-y-2">
                              <img 
                                src={idImagePreview} 
                                alt="ID Preview" 
                                className="max-h-32 mx-auto rounded-lg"
                              />
                              <p className="text-sm text-green-600 font-medium">ID Uploaded Successfully</p>
                              <p className="text-xs text-gray-500">Click to change</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Upload className="h-8 w-8 text-gray-400 mx-auto" />
                              <p className="text-sm text-gray-600">Click to upload your ID</p>
                              <p className="text-xs text-gray-500">Passport, Driver's License, or National ID</p>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>

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

                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-900">
                      <strong>Card-Only Platform:</strong> All payments are processed securely through verified credit cards. Your card will be charged only after ride completion.
                    </p>
                  </div>
                </>
              )}

              <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">
                {mode === 'login' ? 'Log In' : 'Sign Up & Verify'}
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
