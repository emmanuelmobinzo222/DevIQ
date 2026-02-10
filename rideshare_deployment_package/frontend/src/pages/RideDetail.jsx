import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Slider } from '../components/ui/slider';
import { mockRides, getCurrentUser } from '../mockData';
import { Car, MapPin, Users, Clock, Star, Phone, Mail, DollarSign, Shield } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const RideDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [ride, setRide] = useState(null);
  const [seatsToBook, setSeatsToBook] = useState(1);
  const [splitFare, setSplitFare] = useState(true);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);

    const foundRide = mockRides.find(r => r.id === id);
    if (foundRide) {
      setRide(foundRide);
    } else {
      navigate('/rides');
    }
  }, [id, navigate]);

  const calculateTotalCost = () => {
    if (!ride) return 0;
    
    if (splitFare) {
      // Split fare calculation
      const totalPassengers = ride.passengers.length + seatsToBook;
      const totalFare = ride.pricePerSeat * ride.totalSeats;
      return (totalFare / totalPassengers).toFixed(2);
    } else {
      // Regular fare
      return (ride.pricePerSeat * seatsToBook).toFixed(2);
    }
  };

  const handleBookRide = () => {
    toast({
      title: 'Ride Booked!',
      description: `You've successfully booked ${seatsToBook} seat(s) for $${calculateTotalCost()}`,
    });
    setTimeout(() => navigate('/dashboard'), 2000);
  };

  if (!ride || !user) return null;

  const departureDate = new Date(ride.departureTime);
  const formattedTime = departureDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const formattedDate = departureDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <Car className="h-8 w-8 text-black" />
            <span className="text-2xl font-bold text-black">RideShare</span>
          </div>
          <Button variant="outline" onClick={() => navigate('/rides')}>Back to Rides</Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Driver Info */}
            <Card>
              <CardHeader>
                <CardTitle>Driver Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={ride.driverAvatar} />
                    <AvatarFallback>{ride.driverName[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{ride.driverName}</h3>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center text-gray-600">
                        <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                        <span className="font-semibold">{ride.driverRating}</span>
                      </div>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        <Shield className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Car className="h-4 w-4 mr-1" />
                        {ride.carModel}
                      </div>
                      <div className="flex items-center">
                        <span className="font-mono">{ride.carPlate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Route Details */}
            <Card>
              <CardHeader>
                <CardTitle>Trip Details</CardTitle>
                <CardDescription>{formattedDate} at {formattedTime}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">Pickup Location</p>
                      <p className="font-semibold text-gray-900">{ride.origin.address}</p>
                    </div>
                  </div>
                  
                  <div className="ml-3 border-l-2 border-dashed border-gray-300 h-12"></div>
                  
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-6 w-6 text-red-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-600 mb-1">Drop-off Location</p>
                      <p className="font-semibold text-gray-900">{ride.destination.address}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Distance</p>
                      <p className="font-semibold text-gray-900">{ride.distance}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Duration</p>
                      <p className="font-semibold text-gray-900">{ride.duration}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Passengers */}
            <Card>
              <CardHeader>
                <CardTitle>Passengers ({ride.passengers.length}/{ride.totalSeats})</CardTitle>
                <CardDescription>
                  {ride.availableSeats} seat(s) still available
                </CardDescription>
              </CardHeader>
              <CardContent>
                {ride.passengers.length > 0 ? (
                  <div className="space-y-3">
                    {ride.passengers.map((passenger, idx) => (
                      <div key={idx} className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={passenger.avatar} />
                          <AvatarFallback>{passenger.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{passenger.name}</p>
                          <p className="text-sm text-gray-600">Passenger</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Be the first to join this ride!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Booking Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Book Your Ride</CardTitle>
                <CardDescription>Choose your seats and fare options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Seats Selection */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-base font-semibold">Number of Seats</Label>
                    <span className="text-2xl font-bold text-gray-900">{seatsToBook}</span>
                  </div>
                  <Slider
                    value={[seatsToBook]}
                    onValueChange={(value) => setSeatsToBook(value[0])}
                    max={ride.availableSeats}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-600">Max {ride.availableSeats} seats available</p>
                </div>

                {/* Split Fare Option */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      checked={splitFare}
                      onChange={(e) => setSplitFare(e.target.checked)}
                      className="mt-1 h-4 w-4"
                      id="split-fare"
                    />
                    <div className="flex-1">
                      <label htmlFor="split-fare" className="font-semibold text-gray-900 cursor-pointer">
                        Split fare with other passengers
                      </label>
                      <p className="text-sm text-gray-600 mt-1">
                        Share the total cost equally with all passengers for maximum savings
                      </p>
                    </div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Price per seat</span>
                    <span className="font-semibold">${ride.pricePerSeat}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Seats booked</span>
                    <span className="font-semibold">{seatsToBook}</span>
                  </div>
                  {splitFare && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Fare split savings</span>
                      <span className="font-semibold">
                        -${((ride.pricePerSeat * seatsToBook) - parseFloat(calculateTotalCost())).toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className="text-lg font-semibold text-gray-900">Total Cost</span>
                    <span className="text-3xl font-bold text-gray-900">${calculateTotalCost()}</span>
                  </div>
                </div>

                <Button 
                  className="w-full bg-black text-white hover:bg-gray-800 py-6 text-lg"
                  onClick={handleBookRide}
                  disabled={ride.availableSeats === 0}
                >
                  <DollarSign className="h-5 w-5 mr-2" />
                  Pay with Card
                </Button>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <Shield className="h-4 w-4" />
                    <span>Secure card payment • Charged after completion</span>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Only verified cards accepted</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const Label = ({ children, className = '' }) => (
  <label className={`text-sm font-medium text-gray-700 ${className}`}>{children}</label>
);

export default RideDetail;
