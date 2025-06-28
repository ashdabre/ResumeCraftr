
import React, { useState } from 'react';
import { Resume } from '@/pages/Index';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Save, X, Plus, MinusCircle } from 'lucide-react';
import axios from 'axios';
import { toast } from 'sonner';

interface ResumeEditorProps {
  resume: Resume;
  onSave: (resume: Resume) => void;
  onCancel: () => void;
}



export const ResumeEditor: React.FC<ResumeEditorProps> = ({ resume, onSave, onCancel }) => {
  const [editedResume, setEditedResume] = useState<Resume>({ 
    ...resume,
    lastModified: new Date().toISOString()
  });

  const handlePersonalInfoChange = (field: string, value: string) => {
    setEditedResume({
      ...editedResume,
      personalInfo: {
        ...editedResume.personalInfo,
        [field]: value
      }
    });
  };

  const handleSummaryChange = (value: string) => {
    setEditedResume({
      ...editedResume,
      summary: value
    });
  };

  const handleExperienceChange = (index: number, field: string, value: string) => {
    const updatedExperience = [...editedResume.experience];
    updatedExperience[index] = {
      ...updatedExperience[index],
      [field]: value
    };
    setEditedResume({
      ...editedResume,
      experience: updatedExperience
    });
  };

  const addExperience = () => {
    const newExperience = {
      id: 'exp_' + Date.now(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    setEditedResume({
      ...editedResume,
      experience: [...editedResume.experience, newExperience]
    });
  };

  const removeExperience = (index: number) => {
    const updatedExperience = editedResume.experience.filter((_, i) => i !== index);
    setEditedResume({
      ...editedResume,
      experience: updatedExperience
    });
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    const updatedEducation = [...editedResume.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value
    };
    setEditedResume({
      ...editedResume,
      education: updatedEducation
    });
  };

  const addEducation = () => {
    const newEducation = {
      id: 'edu_' + Date.now(),
      institution: '',
      degree: '',
      startDate: '',
      endDate: '',
      gpa: ''
    };
    setEditedResume({
      ...editedResume,
      education: [...editedResume.education, newEducation]
    });
  };

  const removeEducation = (index: number) => {
    const updatedEducation = editedResume.education.filter((_, i) => i !== index);
    setEditedResume({
      ...editedResume,
      education: updatedEducation
    });
  };

  const handleSkillsChange = (value: string) => {
    const skills = value.split(',').map(skill => skill.trim()).filter(skill => skill);
    setEditedResume({
      ...editedResume,
      skills
    });
  };

  const handleProjectChange = (index: number, field: string, value: string | string[]) => {
    const updatedProjects = [...(editedResume.projects || [])];
    if (field === 'technologies' && typeof value === 'string') {
      updatedProjects[index] = {
        ...updatedProjects[index],
        technologies: value.split(',').map(tech => tech.trim()).filter(tech => tech)
      };
    } else {
      updatedProjects[index] = {
        ...updatedProjects[index],
        [field]: value
      };
    }
    setEditedResume({
      ...editedResume,
      projects: updatedProjects
    });
  };

  const addProject = () => {
    const newProject = {
      id: 'proj_' + Date.now(),
      name: '',
      description: '',
      technologies: [],
      link: ''
    };
    setEditedResume({
      ...editedResume,
      projects: [...(editedResume.projects || []), newProject]
    });
  };

  const removeProject = (index: number) => {
    const updatedProjects = (editedResume.projects || []).filter((_, i) => i !== index);
    setEditedResume({
      ...editedResume,
      projects: updatedProjects
    });
  };

  // const handleSave = () => {
  //   onSave(editedResume);
  // };
  const handleSave = async () => {
    try {
      const { data } = await axios.post(
        'http://localhost:8000/save-resume',
        editedResume,
        { headers: { 'Content-Type': 'application/json' } }
      );
      const { toast } = useToast()
toast({
  title: 'Saved!',
  description: 'Your resume was saved on the server.',
  variant: 'success',
})

      // If you still need local state update:
      // onSave && onSave(editedResume);
    } catch (err) {
      console.error('Saved failed', err);
      const { toast } = useToast()
toast({
  title: 'unSaved!',
  description: 'Your resume was not saved on the server.',
  variant: 'success',
})

    }
  };


  return (
    <div className="space-y-6 max-h-screen overflow-y-auto">
      {/* Action Buttons */}
      <div className="flex justify-end gap-3 sticky top-0 bg-white/90 backdrop-blur-sm p-4 rounded-lg border border-white/20 z-10">
        <Button variant="outline" onClick={onCancel} className="text-gray-700">
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
       <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700 text-white">
      <Save className="w-4 h-4 mr-2" />
      Save Changes
    </Button>
      </div>

      {/* Personal Information */}
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <Input
                value={editedResume.personalInfo.name}
                onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                value={editedResume.personalInfo.email}
                onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                placeholder="your.email@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <Input
                value={editedResume.personalInfo.phone}
                onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <Input
                value={editedResume.personalInfo.address}
                onChange={(e) => handlePersonalInfoChange('address', e.target.value)}
                placeholder="City, State, Country"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn
              </label>
              <Input
                value={editedResume.personalInfo.linkedin || ''}
                onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
                placeholder="linkedin.com/in/yourprofile"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <Input
                value={editedResume.personalInfo.website || ''}
                onChange={(e) => handlePersonalInfoChange('website', e.target.value)}
                placeholder="yourwebsite.com"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Professional Summary */}
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Professional Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={editedResume.summary}
            onChange={(e) => handleSummaryChange(e.target.value)}
            placeholder="Write a compelling professional summary..."
            rows={4}
            className="resize-none"
          />
        </CardContent>
      </Card>

      {/* Experience */}
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-gray-900">Professional Experience</CardTitle>
          <Button onClick={addExperience} size="sm" className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-1" />
            Add Experience
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {editedResume.experience.map((exp, index) => (
            <div key={exp.id} className="p-4 border border-gray-200 rounded-lg relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeExperience(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <MinusCircle className="w-4 h-4" />
              </Button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position
                  </label>
                  <Input
                    value={exp.position}
                    onChange={(e) => handleExperienceChange(index, 'position', e.target.value)}
                    placeholder="Job title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <Input
                    value={exp.company}
                    onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
                    placeholder="Company name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <Input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => handleExperienceChange(index, 'startDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <Input
                    type="month"
                    value={exp.endDate}
                    onChange={(e) => handleExperienceChange(index, 'endDate', e.target.value)}
                    placeholder="Leave empty if current"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <Textarea
                  value={exp.description}
                  onChange={(e) => handleExperienceChange(index, 'description', e.target.value)}
                  placeholder="Describe your role and achievements..."
                  rows={3}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Education */}
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-gray-900">Education</CardTitle>
          <Button onClick={addEducation} size="sm" className="bg-green-600 hover:bg-green-700">
            <Plus className="w-4 h-4 mr-1" />
            Add Education
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {editedResume.education.map((edu, index) => (
            <div key={edu.id} className="p-4 border border-gray-200 rounded-lg relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeEducation(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <MinusCircle className="w-4 h-4" />
              </Button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Degree
                  </label>
                  <Input
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                    placeholder="Bachelor of Science..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Institution
                  </label>
                  <Input
                    value={edu.institution}
                    onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                    placeholder="University name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <Input
                    type="month"
                    value={edu.startDate}
                    onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <Input
                    type="month"
                    value={edu.endDate}
                    onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GPA (Optional)
                  </label>
                  <Input
                    value={edu.gpa || ''}
                    onChange={(e) => handleEducationChange(index, 'gpa', e.target.value)}
                    placeholder="3.8"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-gray-900">Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills (comma-separated)
            </label>
            <Textarea
              value={editedResume.skills.join(', ')}
              onChange={(e) => handleSkillsChange(e.target.value)}
              placeholder="JavaScript, React, Node.js, Python..."
              rows={3}
            />
          </div>
          <div className="mt-3">
            <p className="text-sm text-gray-600 mb-2">Preview:</p>
            <div className="flex flex-wrap gap-2">
              {editedResume.skills.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects */}
      <Card className="bg-white/90 backdrop-blur-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-gray-900">Projects</CardTitle>
          <Button onClick={addProject} size="sm" className="bg-purple-600 hover:bg-purple-700">
            <Plus className="w-4 h-4 mr-1" />
            Add Project
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {editedResume.projects?.map((project, index) => (
            <div key={project.id} className="p-4 border border-gray-200 rounded-lg relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeProject(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <MinusCircle className="w-4 h-4" />
              </Button>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Name
                  </label>
                  <Input
                    value={project.name}
                    onChange={(e) => handleProjectChange(index, 'name', e.target.value)}
                    placeholder="Project name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Link (Optional)
                  </label>
                  <Input
                    value={project.link || ''}
                    onChange={(e) => handleProjectChange(index, 'link', e.target.value)}
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <Textarea
                  value={project.description}
                  onChange={(e) => handleProjectChange(index, 'description', e.target.value)}
                  placeholder="Describe the project..."
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Technologies (comma-separated)
                </label>
                <Input
                  value={project.technologies.join(', ')}
                  onChange={(e) => handleProjectChange(index, 'technologies', e.target.value)}
                  placeholder="React, Node.js, MongoDB..."
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
function useToast(): { toast: any; } {
  throw new Error('Function not implemented.');
}

