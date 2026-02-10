import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Code2, Plus, Zap, Smartphone, LogOut } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('deviq_user');
    if (!stored) {
      navigate('/login');
      return;
    }
    setUser(JSON.parse(stored));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('deviq_user');
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] to-[#1a4d8f]">
      <header className="bg-[#0a1628]/95 backdrop-blur-sm border-b border-blue-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <Code2 className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">DEVIQ</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" className="text-white hover:text-blue-400" onClick={() => navigate('/templates')}>
              Templates
            </Button>
            <Button variant="ghost" className="text-white hover:text-blue-400" onClick={() => navigate('/settings')}>
              Settings
            </Button>
            <Button variant="ghost" className="text-white hover:text-blue-400" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {user.name}!</h1>
          <p className="text-blue-200">Let's build something amazing today</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-[#1a2f4a] border-blue-700/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-200 mb-1">Projects</p>
                  <p className="text-3xl font-bold text-white">{user.projectsCount || 0}/{user.maxProjects}</p>
                </div>
                <Smartphone className="h-12 w-12 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2f4a] border-blue-700/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-200 mb-1">AI Credits</p>
                  <p className="text-3xl font-bold text-white">{user.aiCredits || 100}</p>
                </div>
                <Zap className="h-12 w-12 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-[#1a2f4a] border-blue-700/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-200 mb-1">Plan</p>
                  <p className="text-3xl font-bold text-white capitalize">{user.subscriptionTier}</p>
                </div>
                <div className="px-3 py-1 bg-blue-600 rounded-full">
                  <span className="text-white text-sm font-semibold">Active</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-[#1a2f4a] border-blue-700/30 mb-8">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-white">Your Projects</CardTitle>
                <CardDescription className="text-blue-200">Build and manage your apps</CardDescription>
              </div>
              <Button onClick={() => navigate('/projects')} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <Smartphone className="h-16 w-16 text-blue-400 mx-auto mb-4 opacity-50" />
              <p className="text-blue-200 mb-4">No projects yet</p>
              <Button onClick={() => navigate('/projects')} className="bg-blue-600 hover:bg-blue-700 text-white">
                Create Your First App
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
