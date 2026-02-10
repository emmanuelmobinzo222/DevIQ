import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { getCurrentUser, mockRideHistory } from '../mockData';
import { Car, MapPin, DollarSign, Star, Calendar, Users } from 'lucide-react';

const History = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    setHistory(mockRideHistory);
  }, [navigate]);

  if (!user) return null;

  const completedRides = history.filter(r => r.status === 'completed');
  const totalSpent = completedRides.reduce((sum, ride) => sum + ride.finalCost, 0);
  const totalSaved = completedRides.reduce((sum, ride) => {
    if (ride.splitWith > 1) {
      return sum + (ride.fare - ride.finalCost);
    }
    return sum;
  }, 0);

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

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Rides</p>
                  <p className="text-3xl font-bold text-gray-900">{completedRides.length}</p>
                </div>
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                  <Car className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Spent</p>
                  <p className="text-3xl font-bold text-gray-900">${totalSpent.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Money Saved</p>
                  <p className="text-3xl font-bold text-green-600">${totalSaved.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ride History */}
        <Card>
          <CardHeader>
            <CardTitle>Ride History</CardTitle>
            <CardDescription>View all your past rides and transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="all">All Rides</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                {history.length > 0 ? (
                  history.map((ride) => (
                    <Card key={ride.id}>
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="flex-1 mb-4 md:mb-0">
                            <div className="flex items-center space-x-2 mb-2">
                              <Badge 
                                variant={ride.status === 'completed' ? 'default' : 'secondary'}
                                className={ride.status === 'completed' ? 'bg-green-600' : ''}
                              >
                                {ride.status}
                              </Badge>
                              {ride.splitWith > 1 && (
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                  <Users className="h-3 w-3 mr-1" />
                                  Split with {ride.splitWith}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-start space-x-2">
                                <MapPin className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <p className="font-medium text-gray-900">{ride.origin}</p>
                              </div>
                              <div className="flex items-start space-x-2">
                                <MapPin className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                <p className="font-medium text-gray-900">{ride.destination}</p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(ride.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </div>
                              {ride.rating && (
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
                                  {ride.rating}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            {ride.splitWith > 1 && (
                              <p className="text-sm text-gray-600 line-through">${ride.fare}</p>
                            )}
                            <p className="text-3xl font-bold text-gray-900">${ride.finalCost}</p>
                            {ride.splitWith > 1 && (
                              <p className="text-sm text-green-600 font-semibold">
                                Saved ${(ride.fare - ride.finalCost).toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Car className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No rides yet</h3>
                    <p className="text-gray-600 mb-4">Start your journey by booking a ride</p>
                    <Button onClick={() => navigate('/rides')} className="bg-black text-white hover:bg-gray-800">
                      Find Rides
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="completed" className="space-y-4">
                {completedRides.length > 0 ? (
                  completedRides.map((ride) => (
                    <Card key={ride.id}>
                      <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="flex-1 mb-4 md:mb-0">
                            <div className="flex items-center space-x-2 mb-2">
                              {ride.splitWith > 1 && (
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                  <Users className="h-3 w-3 mr-1" />
                                  Split with {ride.splitWith}
                                </Badge>
                              )}
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex items-start space-x-2">
                                <MapPin className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <p className="font-medium text-gray-900">{ride.origin}</p>
                              </div>
                              <div className="flex items-start space-x-2">
                                <MapPin className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                <p className="font-medium text-gray-900">{ride.destination}</p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4 mt-3 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(ride.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </div>
                              {ride.rating && (
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 mr-1 text-yellow-500 fill-yellow-500" />
                                  {ride.rating}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="text-right">
                            {ride.splitWith > 1 && (
                              <p className="text-sm text-gray-600 line-through">${ride.fare}</p>
                            )}
                            <p className="text-3xl font-bold text-gray-900">${ride.finalCost}</p>
                            {ride.splitWith > 1 && (
                              <p className="text-sm text-green-600 font-semibold">
                                Saved ${(ride.fare - ride.finalCost).toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-gray-600">No completed rides</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default History;
