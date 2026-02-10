import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Code2 } from 'lucide-react';

const Projects = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] to-[#1a4d8f] p-8">
      <Button onClick={() => navigate('/dashboard')} className="mb-4">Back to Dashboard</Button>
      <h1 className="text-3xl font-bold text-white">Projects</h1>
      <p className="text-blue-200">Manage your app projects</p>
    </div>
  );
};
export default Projects;
