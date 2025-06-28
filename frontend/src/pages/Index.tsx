import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Sparkles, Download, Edit, Save, X } from 'lucide-react';
import { ResumeUpload } from '@/components/ResumeUpload';
import { ResumeEditor } from '@/components/ResumeEditor';
import { ResumeDisplay } from '@/components/ResumeDisplay';
import { AIEnhancer } from '@/components/AIEnhancer';
import { DownloadOptions } from '@/components/DownloadOptions';
import { useToast } from '@/hooks/use-toast';

export interface Resume {
  id: string;
  fileName?: string;
  originalFile?: File;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    linkedin?: string;
    website?: string;
  };
  summary: string;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    startDate: string;
    endDate: string;
    gpa?: string;
  }>;
  skills: string[];
  projects?: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
    link?: string;
  }>;
  certifications?: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
  }>;
  lastModified: string;
}

const Index = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAIEnhancer, setShowAIEnhancer] = useState(false);
  const [showDownloadOptions, setShowDownloadOptions] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Load resumes from localStorage on component mount
  useEffect(() => {
    const savedResumes = localStorage.getItem('resumes');
    if (savedResumes) {
      try {
        const parsedResumes = JSON.parse(savedResumes);
        setResumes(parsedResumes);
      } catch (error) {
        console.error('Error loading resumes:', error);
      }
    }
  }, []);

  // Save resumes to localStorage whenever resumes change
  useEffect(() => {
    if (resumes.length > 0) {
      localStorage.setItem('resumes', JSON.stringify(resumes));
    }
  }, [resumes]);

  const handleResumeUpload = (resume: Resume) => {
    const newResumes = [...resumes, resume];
    setResumes(newResumes);
    setSelectedResume(resume);
    toast({
      title: "Resume uploaded successfully!",
      description: "Your resume has been processed and is ready for editing.",
    });
  };

  const handleResumeUpdate = (updatedResume: Resume) => {
    const updatedResumes = resumes.map(resume => 
      resume.id === updatedResume.id ? updatedResume : resume
    );
    setResumes(updatedResumes);
    setSelectedResume(updatedResume);
    toast({
      title: "Resume updated!",
      description: "Your changes have been saved locally.",
    });
  };

  const handleResumeDelete = (resumeId: string) => {
    const filteredResumes = resumes.filter(resume => resume.id !== resumeId);
    setResumes(filteredResumes);
    if (selectedResume?.id === resumeId) {
      setSelectedResume(null);
    }
    localStorage.setItem('resumes', JSON.stringify(filteredResumes));
    toast({
      title: "Resume deleted",
      description: "The resume has been removed from your collection.",
    });
  };

  const handleAIEnhancement = (enhancedResume: Resume) => {
    handleResumeUpdate(enhancedResume);
    setShowAIEnhancer(false);
    toast({
      title: "AI Enhancement Applied!",
      description: "Your resume has been enhanced with AI suggestions.",
    });
  };

  // const handleSaveResume = async () => {
  //   if (!selectedResume) return;

  //   setIsSaving(true);
  //   try {
  //     const saveData = {
  //       resumeId: selectedResume.id,
  //       resumeData: selectedResume,
  //       originalFile: selectedResume.originalFile || null,
  //       fileName: selectedResume.fileName || `${selectedResume.personalInfo.name || 'resume'}.json`
  //     };

  //     const response = await fetch('/save-resume', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(saveData),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const result = await response.json();
      
  //     toast({
  //       title: "Resume saved successfully!",
  //       description: "Your resume has been saved to the backend.",
  //     });

  //     console.log('Resume saved:', result);
  //   } catch (error) {
  //     console.error('Error saving resume:', error);
  //     toast({
  //       title: "Save failed",
  //       description: "Failed to save resume to backend. Please try again.",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsSaving(false);
  //   }
  // };
  const handleSaveResume = async () => {
  if (!selectedResume) return;

  setIsSaving(true);
  try {
    // 1) Build a payload that matches your Pydantic model:
    //    name: string
    //    summary: string
    //    experience: Array<...>
    //    education: Array<...>
    //    skills: string[]
    const payload = {
      name: selectedResume.personalInfo.name,
      summary: selectedResume.summary,
      experience: selectedResume.experience,
      education: selectedResume.education,
      skills: selectedResume.skills,
      projects: selectedResume.projects,
      // if you’ve added projects/certs, include them here too, or make them optional
    };

    // 2) POST it to your FastAPI endpoint
    const response = await fetch('http://localhost:8004/save-resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const result = await response.json();
    console.log('Saved to backend:', result);

    toast({
      title: 'Resume saved!',
      description: 'Your resume has been persisted to the server.',
     
    });
  } catch (err) {
    console.error('Error saving to backend:', err);
    toast({
      title: 'Save failed',
      description: 'Could not save your resume. Is the backend running on port 8004?',
      variant: 'destructive',
    });
  } finally {
    setIsSaving(false);
  }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50">
      {/* Luxury Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full bg-[radial-gradient(circle_at_1px_1px,_rgb(15_23_42)_1px,_transparent_0)] bg-[length:20px_20px]"></div>
      </div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl mb-6 shadow-2xl border border-slate-200">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-800 via-slate-700 to-slate-900 bg-clip-text text-transparent mb-4">
            Resume Craftr
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Transform your career story with AI-powered resume enhancement. 
            Create, edit, and perfect your professional narrative.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar - Resume List & Upload */}
          <div className="lg:col-span-4 space-y-6">
            {/* Upload Section */}
            <Card className="bg-white/90 backdrop-blur-lg border-slate-200/60 shadow-xl">
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center gap-2">
                  <Upload className="w-5 h-5 text-slate-700" />
                  Upload Resume
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResumeUpload onResumeUpload={handleResumeUpload} />
              </CardContent>
            </Card>

            {/* Resume List */}
            {resumes.length > 0 && (
              <Card className="bg-white/90 backdrop-blur-lg border-slate-200/60 shadow-xl">
                <CardHeader>
                  <CardTitle className="text-slate-800 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-slate-700" />
                    Your Resumes ({resumes.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {resumes.map((resume) => (
                    <div
                      key={resume.id}
                      className={`p-4 rounded-lg border transition-all cursor-pointer ${
                        selectedResume?.id === resume.id
                          ? 'bg-slate-100 border-slate-300 shadow-md'
                          : 'bg-white/60 border-slate-200 hover:bg-slate-50 hover:shadow-sm'
                      }`}
                      onClick={() => setSelectedResume(resume)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-slate-800 font-medium">
                            {resume.fileName || resume.personalInfo.name || 'Untitled Resume'}
                          </h3>
                          <p className="text-slate-500 text-sm">
                            Last modified: {new Date(resume.lastModified).toLocaleDateString()}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleResumeDelete(resume.id);
                          }}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8">
            {selectedResume ? (
              <div className="space-y-6">
                {/* Action Buttons */}
                <Card className="bg-white/90 backdrop-blur-lg border-slate-200/60 shadow-xl">
                  <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-3">
                      <Button
                        onClick={() => setIsEditing(!isEditing)}
                        className="bg-slate-800 hover:bg-slate-900 text-white shadow-lg"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        {isEditing ? 'View Mode' : 'Edit Mode'}
                      </Button>
                      
                      <Button
                        onClick={() => setShowAIEnhancer(true)}
                        className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white shadow-lg"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Enhance with AI
                      </Button>
                      
                      <Button
                        onClick={handleSaveResume}
                        disabled={isSaving}
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg disabled:opacity-50"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? 'Saving...' : 'Save Resume'}
                      </Button>
                      
                      <Button
                        onClick={() => setShowDownloadOptions(true)}
                        className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Resume Content */}
                <Card className="bg-white/90 backdrop-blur-lg border-slate-200/60 shadow-xl">
                  <CardContent className="pt-6">
                    {isEditing ? (
                      <ResumeEditor
                        resume={selectedResume}
                        onSave={(updatedResume) => {
                          handleResumeUpdate(updatedResume);
                          setIsEditing(false);
                        }}
                        onCancel={() => setIsEditing(false)}
                      />
                    ) : (
                      <ResumeDisplay resume={selectedResume} />
                    )}
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="bg-white/90 backdrop-blur-lg border-slate-200/60 shadow-xl">
                <CardContent className="pt-6">
                  <div className="text-center py-16">
                    <FileText className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-slate-800 mb-2">
                      No Resume Selected
                    </h3>
                    <p className="text-slate-500">
                      Upload a new resume or select an existing one to get started.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAIEnhancer && selectedResume && (
        <AIEnhancer
          resume={selectedResume}
          onEnhance={handleAIEnhancement}
          onClose={() => setShowAIEnhancer(false)}
        />
      )}

      {showDownloadOptions && selectedResume && (
        <DownloadOptions
          resume={selectedResume}
          onClose={() => setShowDownloadOptions(false)}
        />
      )}
    </div>
  );
};

export default Index;