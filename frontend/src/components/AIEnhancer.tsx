
import React, { useState } from 'react';
import { Resume } from '@/pages/Index';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, CheckCircle, XCircle, Eye, Wand2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AIEnhancerProps {
  resume: Resume;
  onEnhance: (enhancedResume: Resume) => void;
  onClose: () => void;
}

interface Enhancement {
  id: string;
  section: string;
  type: 'improvement' | 'addition' | 'rewrite';
  original: string;
  suggested: string;
  reason: string;
  applied: boolean;
}

export const AIEnhancer: React.FC<AIEnhancerProps> = ({ resume, onEnhance, onClose }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [enhancements, setEnhancements] = useState<Enhancement[]>([]);
  const [previewResume, setPreviewResume] = useState<Resume>(resume);
  const [activeTab, setActiveTab] = useState('suggestions');

  const generateEnhancements = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const mockEnhancements: Enhancement[] = [
      {
        id: '1',
        section: 'Summary',
        type: 'improvement',
        original: resume.summary,
        suggested: `${resume.summary} Demonstrated expertise in leading cross-functional teams and delivering high-impact solutions that drive business growth and operational efficiency.`,
        reason: 'Added leadership and business impact keywords to strengthen professional positioning',
        applied: false
      },
      {
        id: '2',
        section: 'Experience',
        type: 'improvement',
        original: resume.experience[0]?.description || '',
        suggested: `• Led development of scalable microservices architecture serving 100K+ active users, resulting in 40% improved system performance\n• Implemented robust CI/CD pipelines using Jenkins and Docker, reducing deployment time by 60% and minimizing production issues\n• Mentored team of 3 junior developers through code reviews and technical guidance, improving team velocity by 25%\n• Collaborated with product managers and designers to deliver feature enhancements that increased user engagement by 30%`,
        reason: 'Enhanced with quantifiable achievements, action verbs, and specific technologies',
        applied: false
      },
      {
        id: '3',
        section: 'Skills',
        type: 'addition',
        original: resume.skills.join(', '),
        suggested: resume.skills.join(', ') + ', Kubernetes, Microservices, System Design, Team Leadership, Agile Methodologies, Performance Optimization',
        reason: 'Added trending technical and soft skills relevant to senior developer roles',
        applied: false
      },
      {
        id: '4',
        section: 'Projects',
        type: 'improvement',
        original: resume.projects?.[0]?.description || '',
        suggested: 'Built comprehensive e-commerce platform with React frontend and Node.js backend, featuring real-time inventory management, secure payment processing via Stripe API, and automated email notifications. Achieved 99.9% uptime and processed 10K+ transactions monthly.',
        reason: 'Added technical details, metrics, and business impact to showcase project complexity',
        applied: false
      }
    ];
    
    setEnhancements(mockEnhancements);
    setIsAnalyzing(false);
  };

  const toggleEnhancement = (enhancementId: string) => {
    const updatedEnhancements = enhancements.map(enhancement => {
      if (enhancement.id === enhancementId) {
        return { ...enhancement, applied: !enhancement.applied };
      }
      return enhancement;
    });
    
    setEnhancements(updatedEnhancements);
    generatePreview(updatedEnhancements);
  };

  const generatePreview = (enhancementList: Enhancement[]) => {
    let updatedResume = { ...resume };
    
    enhancementList.forEach(enhancement => {
      if (enhancement.applied) {
        switch (enhancement.section) {
          case 'Summary':
            updatedResume.summary = enhancement.suggested;
            break;
          case 'Experience':
            if (updatedResume.experience[0]) {
              updatedResume.experience[0].description = enhancement.suggested;
            }
            break;
          case 'Skills':
            updatedResume.skills = enhancement.suggested.split(', ').map(s => s.trim());
            break;
          case 'Projects':
            if (updatedResume.projects?.[0]) {
              updatedResume.projects[0].description = enhancement.suggested;
            }
            break;
        }
      }
    });
    
    updatedResume.lastModified = new Date().toISOString();
    setPreviewResume(updatedResume);
  };

  const applyAllEnhancements = () => {
    const allApplied = enhancements.map(e => ({ ...e, applied: true }));
    setEnhancements(allApplied);
    generatePreview(allApplied);
  };

  const clearAllEnhancements = () => {
    const allCleared = enhancements.map(e => ({ ...e, applied: false }));
    setEnhancements(allCleared);
    setPreviewResume(resume);
  };

  const handleApplyChanges = () => {
    onEnhance(previewResume);
  };

  React.useEffect(() => {
    generateEnhancements();
  }, []);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-purple-600" />
            AI Resume Enhancement
          </DialogTitle>
        </DialogHeader>

        <div className="p-6 pt-0">
          {isAnalyzing ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="relative">
                <Loader2 className="w-16 h-16 text-purple-600 animate-spin" />
                <Sparkles className="w-8 h-8 text-yellow-500 absolute top-2 right-2 animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold mt-6 mb-2">Analyzing Your Resume</h3>
              <p className="text-gray-600 text-center max-w-md">
                Our AI is reviewing your resume and generating personalized suggestions to make it stand out...
              </p>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="suggestions" className="flex items-center gap-2">
                  <Wand2 className="w-4 h-4" />
                  AI Suggestions ({enhancements.filter(e => e.applied).length}/{enhancements.length})
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Preview Changes
                </TabsTrigger>
              </TabsList>

              <TabsContent value="suggestions" className="mt-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                        {enhancements.length} Suggestions Found
                      </Badge>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        {enhancements.filter(e => e.applied).length} Applied
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={clearAllEnhancements}
                        disabled={enhancements.every(e => !e.applied)}
                      >
                        Clear All
                      </Button>
                      <Button
                        size="sm"
                        onClick={applyAllEnhancements}
                        disabled={enhancements.every(e => e.applied)}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Apply All
                      </Button>
                    </div>
                  </div>

                  <ScrollArea className="h-96">
                    <div className="space-y-4 pr-4">
                      {enhancements.map((enhancement) => (
                        <Card key={enhancement.id} className={`transition-all ${
                          enhancement.applied ? 'ring-2 ring-green-500 bg-green-50' : ''
                        }`}>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <CardTitle className="text-lg">{enhancement.section}</CardTitle>
                                <Badge variant={
                                  enhancement.type === 'improvement' ? 'default' :
                                  enhancement.type === 'addition' ? 'secondary' : 'outline'
                                }>
                                  {enhancement.type}
                                </Badge>
                              </div>
                              <Button
                                variant={enhancement.applied ? "default" : "outline"}
                                size="sm"
                                onClick={() => toggleEnhancement(enhancement.id)}
                                className={enhancement.applied ? "bg-green-600 hover:bg-green-700" : ""}
                              >
                                {enhancement.applied ? (
                                  <>
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    Applied
                                  </>
                                ) : (
                                  <>
                                    <XCircle className="w-4 h-4 mr-1" />
                                    Apply
                                  </>
                                )}
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3">
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-1">Why this helps:</p>
                              <p className="text-sm text-gray-600">{enhancement.reason}</p>
                            </div>
                            
                            {enhancement.original && (
                              <div>
                                <p className="text-sm font-medium text-red-700 mb-1">Current:</p>
                                <div className="bg-red-50 p-3 rounded border-l-4 border-red-300">
                                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                    {enhancement.original}
                                  </p>
                                </div>
                              </div>
                            )}
                            
                            <div>
                              <p className="text-sm font-medium text-green-700 mb-1">Suggested:</p>
                              <div className="bg-green-50 p-3 rounded border-l-4 border-green-300">
                                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                  {enhancement.suggested}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>

              <TabsContent value="preview" className="mt-6">
                <ScrollArea className="h-96">
                  <div className="bg-white p-6 rounded-lg border">
                    <div className="text-center mb-6">
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {previewResume.personalInfo.name}
                      </h1>
                      <div className="flex justify-center items-center gap-4 text-gray-600 text-sm">
                        <span>{previewResume.personalInfo.email}</span>
                        <span>•</span>
                        <span>{previewResume.personalInfo.phone}</span>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Professional Summary</h2>
                        <p className="text-gray-700 leading-relaxed">{previewResume.summary}</p>
                      </div>

                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-3">Skills</h2>
                        <div className="flex flex-wrap gap-2">
                          {previewResume.skills.map((skill, index) => (
                            <Badge key={index} variant="secondary">{skill}</Badge>
                          ))}
                        </div>
                      </div>

                      {previewResume.experience.length > 0 && (
                        <div>
                          <h2 className="text-xl font-bold text-gray-900 mb-3">Experience</h2>
                          <div className="space-y-4">
                            {previewResume.experience.slice(0, 1).map((exp) => (
                              <div key={exp.id}>
                                <h3 className="text-lg font-semibold">{exp.position}</h3>
                                <p className="text-blue-600 font-medium">{exp.company}</p>
                                <p className="text-gray-700 mt-2 whitespace-pre-wrap">{exp.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          )}

          {!isAnalyzing && (
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                onClick={handleApplyChanges}
                disabled={enhancements.every(e => !e.applied)}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Apply Changes to Resume
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
