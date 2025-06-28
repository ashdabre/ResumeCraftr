
import React from 'react';
import { Resume } from '@/pages/Index';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Mail, Phone, Globe, Linkedin, Calendar, Award, Code, Briefcase, GraduationCap } from 'lucide-react';

interface ResumeDisplayProps {
  resume: Resume;
}

export const ResumeDisplay: React.FC<ResumeDisplayProps> = ({ resume }) => {
  console.log('ResumeDisplay - Full resume data:', resume);
  
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg p-8 text-slate-900 shadow-lg border border-slate-200">
      {/* Header Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">
          {resume.personalInfo?.name || 'Name not provided'}
        </h1>
        <div className="flex flex-wrap justify-center items-center gap-4 text-slate-600">
          {resume.personalInfo?.email && (
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              <span>{resume.personalInfo.email}</span>
            </div>
          )}
          {resume.personalInfo?.phone && (
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              <span>{resume.personalInfo.phone}</span>
            </div>
          )}
          {resume.personalInfo?.address && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span>{resume.personalInfo.address}</span>
            </div>
          )}
        </div>
        {(resume.personalInfo?.linkedin || resume.personalInfo?.website) && (
          <div className="flex justify-center items-center gap-4 mt-2 text-slate-700">
            {resume.personalInfo.linkedin && (
              <div className="flex items-center gap-1">
                <Linkedin className="w-4 h-4" />
                <span>{resume.personalInfo.linkedin}</span>
              </div>
            )}
            {resume.personalInfo.website && (
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                <span>{resume.personalInfo.website}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Professional Summary */}
      {resume.summary && (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-slate-700" />
              Professional Summary
            </h2>
            <p className="text-slate-700 leading-relaxed text-justify">
              {resume.summary}
            </p>
          </div>
          <Separator className="my-8" />
        </>
      )}

      {/* Skills Section */}
      {resume.skills && resume.skills.length > 0 && (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Code className="w-6 h-6 text-slate-700" />
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-slate-100 text-slate-800 hover:bg-slate-200 px-3 py-1 border border-slate-200"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          <Separator className="my-8" />
        </>
      )}

      {/* Experience Section */}
      {resume.experience && resume.experience.length > 0 && (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-slate-700" />
              Professional Experience
            </h2>
            <div className="space-y-6">
              {resume.experience.map((exp, index) => (
                <div key={exp.id || index} className="border-l-4 border-slate-600 pl-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-slate-800">
                        {exp.position || 'Position not specified'}
                      </h3>
                      <p className="text-lg text-slate-700 font-medium">
                        {exp.company || 'Company not specified'}
                      </p>
                    </div>
                    {(exp.startDate || exp.endDate) && (
                      <div className="text-right text-slate-600 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(exp.startDate) || 'Start date'} - {exp.endDate ? formatDate(exp.endDate) : 'Present'}
                        </span>
                      </div>
                    )}
                  </div>
                  {exp.description && (
                    <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
          <Separator className="my-8" />
        </>
      )}

      {/* Education Section */}
      {resume.education && resume.education.length > 0 && (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-slate-700" />
              Education
            </h2>
            <div className="space-y-4">
              {resume.education.map((edu, index) => (
                <div key={edu.id || index} className="border-l-4 border-slate-600 pl-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">
                        {edu.degree || 'Degree not specified'}
                      </h3>
                      <p className="text-slate-700 font-medium">
                        {edu.institution || 'Institution not specified'}
                      </p>
                      {edu.gpa && (
                        <p className="text-slate-600">GPA: {edu.gpa}</p>
                      )}
                    </div>
                    {(edu.startDate || edu.endDate) && (
                      <div className="text-slate-600 flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDate(edu.startDate) || 'Start'} - {formatDate(edu.endDate) || 'End'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Separator className="my-8" />
        </>
      )}

      {/* Projects Section */}
      {resume.projects && resume.projects.length > 0 && (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Code className="w-6 h-6 text-indigo-600" />
              Projects
            </h2>
            <div className="space-y-4">
              {resume.projects.map((project, index) => (
                <div key={project.id || index} className="border-l-4 border-indigo-600 pl-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-slate-800">
                      {project.name || 'Project name not specified'}
                    </h3>
                    {project.link && (
                      <a
                        href={project.link}
                        className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Globe className="w-4 h-4" />
                        View Project
                      </a>
                    )}
                  </div>
                  {project.description && (
                    <p className="text-slate-700 mb-2 leading-relaxed">
                      {project.description}
                    </p>
                  )}
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech, techIndex) => (
                        <Badge
                          key={techIndex}
                          variant="outline"
                          className="text-indigo-700 border-indigo-300"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <Separator className="my-8" />
        </>
      )}

      {/* Certifications Section */}
      {resume.certifications && resume.certifications.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-600" />
            Certifications
          </h2>
          <div className="space-y-3">
            {resume.certifications.map((cert, index) => (
              <div key={cert.id || index} className="border-l-4 border-amber-600 pl-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      {cert.name || 'Certificate name not specified'}
                    </h3>
                    <p className="text-amber-600 font-medium">
                      {cert.issuer || 'Issuer not specified'}
                    </p>
                  </div>
                  {cert.date && (
                    <div className="text-slate-600 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(cert.date)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Show message if no significant data found */}
      {(!resume.summary && (!resume.skills || resume.skills.length === 0) && 
        (!resume.experience || resume.experience.length === 0) && 
        (!resume.education || resume.education.length === 0) && 
        (!resume.projects || resume.projects.length === 0) && 
        (!resume.certifications || resume.certifications.length === 0)) && (
        <div className="text-center py-8 text-slate-500">
          <p>Resume content is being processed. Please ensure your uploaded file contains readable text.</p>
        </div>
      )}
    </div>
  );
};
