import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';

const ProjectDetail = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a1628] to-[#1a4d8f] p-8">
      <Button onClick={() => navigate('/projects')} className="mb-4">Back</Button>
      <h1 className="text-3xl font-bold text-white">Project Detail</h1>
      <p className="text-blue-200">AI Chat & Code Editor</p>
    </div>
  );
};
export default ProjectDetail;
