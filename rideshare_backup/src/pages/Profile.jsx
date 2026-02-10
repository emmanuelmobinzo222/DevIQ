import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { getCurrentUser, setCurrentUser } from '../mockData';
import { Car, User, Mail, Phone, Star, Shield, Edit } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    carModel: '',
    carPlate: '',
  });

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }
    setUser(currentUser);
    setFormData({
      name: currentUser.name || '',
      email: currentUser.email || '',
      phone: currentUser.phone || '',
      carModel: currentUser.carModel || '',
      carPlate: currentUser.carPlate || '',
    });
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updatedUser = {
      ...user,
      ...formData,
    };
    
    setCurrentUser(updatedUser);
    setUser(updatedUser);
    setIsEditing(false);
    
    toast({
      title: 'Profile Updated',
      description: 'Your profile has been successfully updated',
    });
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
          <Button variant="outline" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="h-32 w-32">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-4xl">{user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.name}</h1>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Star className="h-5 w-5 text-yellow-500 mr-1 fill-yellow-500" />
                    <span className="font-semibold">{user.rating}</span>
                  </div>
                  <Badge className="bg-gray-900 text-white">
                    {user.role === 'driver' ? 'Driver' : 'Rider'}
                  </Badge>
                  {user.verified && (
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600">{user.totalRides} rides completed</p>
              </div>
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)} variant="outline">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Profile Details */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              {isEditing ? 'Update your personal information' : 'View your account details'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
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
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {user.role === 'driver' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="carModel">Car Model</Label>
                        <div className="relative">
                          <Car className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            id="carModel"
                            name="carModel"
                            placeholder="e.g., Toyota Camry 2022"
                            value={formData.carModel}
                            onChange={handleChange}
                            className="pl-10"
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
                        />
                      </div>
                    </>
                  )}
                </div>

                <div className="flex space-x-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-black text-white hover:bg-gray-800"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Full Name</p>
                    <p className="font-semibold text-gray-900">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="font-semibold text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Phone</p>
                    <p className="font-semibold text-gray-900">{user.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Account Type</p>
                    <p className="font-semibold text-gray-900 capitalize">{user.role}</p>
                  </div>
                  {user.role === 'driver' && (
                    <>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Car Model</p>
                        <p className="font-semibold text-gray-900">{user.carModel || 'Not provided'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">License Plate</p>
                        <p className="font-semibold text-gray-900">{user.carPlate || 'Not provided'}</p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
