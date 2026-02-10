import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { getCurrentUser, clearCurrentUser, mockRides, mockRideHistory } from '../mockData';
import { Car, MapPin, Users, DollarSign, Clock, Star, LogOut, History, Plus } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [activeRides, setActiveRides] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    setActiveRides(mockRides.slice(0, 2));
    setHistory(mockRideHistory);
  }, [navigate]);

  const handleLogout = () => {
    clearCurrentUser();
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out',
    });
    navigate('/');
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
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/rides')}>
              Find Rides
            </Button>
            {user.role === 'driver' && (
              <Button variant="ghost" onClick={() => navigate('/create-ride')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Ride
              </Button>
            )}
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile Section */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center text-gray-600">
                      <Star className="h-4 w-4 text-yellow-500 mr-1 fill-yellow-500" />
                      <span>{user.rating}</span>
                    </div>
                    <span className="text-gray-600">{user.totalRides} rides</span>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      {user.role === 'driver' ? 'Driver' : 'Rider'}
                    </span>
                  </div>
                </div>
              </div>
              <Button onClick={() => navigate('/profile')}>Edit Profile</Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/rides')}>
            <CardHeader>
              <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mb-2">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Find a Ride</CardTitle>
              <CardDescription>Search for rides going your way</CardDescription>
            </CardHeader>
          </Card>

          {user.role === 'driver' && (
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/create-ride')}>
              <CardHeader>
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mb-2">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Create Ride</CardTitle>
                <CardDescription>Offer a ride and earn money</CardDescription>
              </CardHeader>
            </Card>
          )}

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/history')}>
            <CardHeader>
              <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center mb-2">
                <History className="h-6 w-6 text-white" />
              </div>
              <CardTitle>Ride History</CardTitle>
              <CardDescription>View your past rides</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Active Rides */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-gray-900">Available Rides</h3>
            <Button variant="outline" onClick={() => navigate('/rides')}>View All</Button>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {activeRides.map((ride) => (
              <Card key={ride.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={ride.driverAvatar} />
                        <AvatarFallback>{ride.driverName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-gray-900">{ride.driverName}</p>
                        <div className="flex items-center text-sm text-gray-600">
                          <Star className="h-3 w-3 text-yellow-500 mr-1 fill-yellow-500" />
                          {ride.driverRating}
                        </div>
                      </div>
                    </div>
                    <span className="text-2xl font-bold text-gray-900">${ride.pricePerSeat}</span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-5 w-5 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{ride.origin.address}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-5 w-5 text-red-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{ride.destination.address}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {ride.duration}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {ride.availableSeats} seats left
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-black text-white hover:bg-gray-800"
                    onClick={() => navigate(`/ride/${ride.id}`)}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent History */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-gray-900">Recent Rides</h3>
            <Button variant="outline" onClick={() => navigate('/history')}>View All</Button>
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {history.map((ride) => (
                  <div key={ride.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{ride.origin} → {ride.destination}</p>
                      <p className="text-sm text-gray-600">{ride.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900">${ride.finalCost}</p>
                      {ride.splitWith > 1 && (
                        <p className="text-sm text-green-600">Split with {ride.splitWith} riders</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
