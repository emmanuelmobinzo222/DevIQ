import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { getCurrentUser } from '../mockData';
import { Car, MapPin, DollarSign, Users, Clock, Calendar } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const CreateRide = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    origin: '',
    destination: '',
    date: '',
    time: '',
    seats: 4,
    pricePerSeat: '',
    carModel: '',
    carPlate: '',
  });

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (currentUser.role !== 'driver') {
      toast({
        title: 'Access Denied',
        description: 'Only drivers can create rides',
        variant: 'destructive',
      });
      navigate('/dashboard');
      return;
    }
    setUser(currentUser);
  }, [navigate, toast]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Mock ride creation
    toast({
      title: 'Ride Created!',
      description: 'Your ride has been posted successfully',
    });
    
    setTimeout(() => navigate('/dashboard'), 2000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <Car className="h-8 w-8 text-black" />
            <span className="text-2xl font-bold text-black">RideShare</span>
          </div>
          <Button variant="outline" onClick={() => navigate('/dashboard')}>Cancel</Button>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Create a New Ride</CardTitle>
            <CardDescription>
              Fill in the details to offer a ride and start earning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Route Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Route Information</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="origin">Pickup Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-green-600" />
                    <Input
                      id="origin"
                      name="origin"
                      placeholder="e.g., 123 Market St, San Francisco, CA"
                      value={formData.origin}
                      onChange={handleChange}
                      className="pl-11"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destination">Drop-off Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-5 w-5 text-red-600" />
                    <Input
                      id="destination"
                      name="destination"
                      placeholder="e.g., 456 Broadway, Oakland, CA"
                      value={formData.destination}
                      onChange={handleChange}
                      className="pl-11"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Schedule</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        className="pl-11"
                        required
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Departure Time</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="time"
                        name="time"
                        type="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="pl-11"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Vehicle & Pricing */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Vehicle & Pricing</h3>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="carModel">Car Model</Label>
                    <div className="relative">
                      <Car className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="carModel"
                        name="carModel"
                        placeholder="e.g., Toyota Camry 2022"
                        value={formData.carModel}
                        onChange={handleChange}
                        className="pl-11"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="carPlate">License Plate</Label>
                    <Input
                      id="carPlate"
                      name="carPlate"
                      placeholder="e.g., ABC-1234"
                      value={formData.carPlate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="seats">Available Seats</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="seats"
                        name="seats"
                        type="number"
                        min="1"
                        max="7"
                        value={formData.seats}
                        onChange={handleChange}
                        className="pl-11"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pricePerSeat">Price per Seat</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                      <Input
                        id="pricePerSeat"
                        name="pricePerSeat"
                        type="number"
                        min="1"
                        step="0.01"
                        placeholder="15.00"
                        value={formData.pricePerSeat}
                        onChange={handleChange}
                        className="pl-11"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Fare Split Info */}
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <DollarSign className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Fare Splitting Enabled</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      Passengers can split the total fare equally, making rides more affordable and attractive
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex space-x-4 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/dashboard')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-black text-white hover:bg-gray-800"
                >
                  Create Ride
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateRide;
