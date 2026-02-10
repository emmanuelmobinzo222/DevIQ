import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Code2, Mail, Lock, User } from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', company: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('deviq_user', JSON.stringify({
      id: '1',
      name: formData.name,
      email: formData.email,
      company: formData.company,
      subscriptionTier: 'free',
      projectsCount: 0,
      maxProjects: 3,
      aiCredits: 100
    }));
    toast({ title: 'Account created!', description: 'Welcome to DEVIQ' });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] to-[#1a4d8f] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Code2 className="h-10 w-10 text-blue-400" />
            <span className="text-3xl font-bold text-white">DEVIQ</span>
          </div>
          <p className="text-blue-200">Start Building Amazing Apps</p>
        </div>

        <Card className="bg-[#1a2f4a] border-blue-700/30">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center text-white">Create Account</CardTitle>
            <CardDescription className="text-center text-blue-200">Get started with free plan</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
                  <Input
                    id="name"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-10 bg-[#0d1f3a] border-blue-700/30 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-10 bg-[#0d1f3a] border-blue-700/30 text-white"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-blue-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 bg-[#0d1f3a] border-blue-700/30 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company" className="text-white">Company (Optional)</Label>
                <Input
                  id="company"
                  placeholder="Your Company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="bg-[#0d1f3a] border-blue-700/30 text-white"
                />
              </div>

              <Button type="submit" className="w-full bg-blue-600 text-white hover:bg-blue-700">
                Create Account
              </Button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-blue-200">Already have an account? </span>
              <button onClick={() => navigate('/login')} className="text-blue-400 font-semibold hover:underline">
                Log in
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
