import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { mockRides, getCurrentUser } from '../mockData';
import { Car, MapPin, Users, Clock, Star, Search, Filter } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const Rides = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [rides, setRides] = useState([]);
  const [searchOrigin, setSearchOrigin] = useState('');
  const [searchDestination, setSearchDestination] = useState('');
  const [filteredRides, setFilteredRides] = useState([]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    setRides(mockRides);
    setFilteredRides(mockRides);
  }, [navigate]);

  const handleSearch = () => {
    const filtered = rides.filter(ride => {
      const originMatch = !searchOrigin || ride.origin.address.toLowerCase().includes(searchOrigin.toLowerCase());
      const destMatch = !searchDestination || ride.destination.address.toLowerCase().includes(searchDestination.toLowerCase());
      return originMatch && destMatch;
    });
    setFilteredRides(filtered);
    
    if (filtered.length === 0) {
      toast({
        title: 'No rides found',
        description: 'Try adjusting your search criteria',
      });
    }
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
          <Button variant="outline" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Find Your Ride</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="origin">From</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="origin"
                    placeholder="Enter pickup location"
                    value={searchOrigin}
                    onChange={(e) => setSearchOrigin(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="destination">To</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="destination"
                    placeholder="Enter destination"
                    value={searchDestination}
                    onChange={(e) => setSearchDestination(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <Button 
                  onClick={handleSearch} 
                  className="w-full bg-black text-white hover:bg-gray-800"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search Rides
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rides List */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Available Rides ({filteredRides.length})</h3>
          <p className="text-gray-600">Join a ride and split the fare with other travelers</p>
        </div>

        <div className="grid gap-6">
          {filteredRides.map((ride) => (
            <Card key={ride.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    {/* Driver Info */}
                    <div className="flex items-center space-x-3 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={ride.driverAvatar} />
                        <AvatarFallback>{ride.driverName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900">{ride.driverName}</p>
                        <div className="flex items-center space-x-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Star className="h-3 w-3 text-yellow-500 mr-1 fill-yellow-500" />
                            {ride.driverRating}
                          </div>
                          <span className="text-sm text-gray-500">•</span>
                          <span className="text-sm text-gray-600">{ride.carModel}</span>
                        </div>
                      </div>
                    </div>

                    {/* Route Info */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{ride.origin.address}</p>
                        </div>
                      </div>
                      <div className="ml-2 border-l-2 border-gray-300 h-4"></div>
                      <div className="flex items-start space-x-2">
                        <MapPin className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{ride.destination.address}</p>
                        </div>
                      </div>
                    </div>

                    {/* Ride Details */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {ride.duration}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {ride.availableSeats} of {ride.totalSeats} seats available
                      </div>
                      {ride.splitEnabled && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Fare Split Available
                        </Badge>
                      )}
                    </div>

                    {/* Passengers */}
                    {ride.passengers.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm text-gray-600 mb-2">Current passengers:</p>
                        <div className="flex -space-x-2">
                          {ride.passengers.map((passenger, idx) => (
                            <Avatar key={idx} className="h-8 w-8 border-2 border-white">
                              <AvatarImage src={passenger.avatar} />
                              <AvatarFallback>{passenger.name[0]}</AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Price and Action */}
                  <div className="mt-6 lg:mt-0 lg:ml-8 flex flex-col items-end space-y-4">
                    <div className="text-right">
                      <p className="text-3xl font-bold text-gray-900">${ride.pricePerSeat}</p>
                      <p className="text-sm text-gray-600">per person</p>
                      {ride.passengers.length > 0 && (
                        <p className="text-sm text-green-600 mt-1">
                          Save ${((ride.pricePerSeat * ride.totalSeats) / (ride.passengers.length + 1) - ride.pricePerSeat).toFixed(2)} by splitting!
                        </p>
                      )}
                    </div>
                    <Button 
                      className="bg-black text-white hover:bg-gray-800 px-8"
                      onClick={() => navigate(`/ride/${ride.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRides.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No rides found</h3>
              <p className="text-gray-600">Try adjusting your search criteria or check back later</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Rides;
