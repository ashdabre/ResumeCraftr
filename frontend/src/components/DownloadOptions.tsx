
import React from 'react';
import { Resume } from '@/pages/Index';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileJson, FileText, Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DownloadOptionsProps {
  resume: Resume;
  onClose: () => void;
}

export const DownloadOptions: React.FC<DownloadOptionsProps> = ({ resume, onClose }) => {
  const { toast } = useToast();

  const downloadJSON = () => {
    const dataStr = JSON.stringify(resume, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${resume.personalInfo.name.replace(/\s+/g, '_')}_resume.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "JSON Downloaded!",
      description: `${exportFileDefaultName} has been downloaded successfully.`,
    });
  };

  const downloadFormattedResume = () => {
    const formatDate = (dateString: string) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    };

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${resume.personalInfo.name} - Resume</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Georgia', serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            background: #fff;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
        }
        
        .header h1 {
            font-size: 2.5em;
            font-weight: bold;
            margin-bottom: 10px;
            color: #2c3e50;
        }
        
        .contact-info {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 20px;
            margin-bottom: 10px;
            font-size: 1.1em;
        }
        
        .contact-links {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 20px;
            color: #3498db;
        }
        
        .section {
            margin-bottom: 30px;
        }
        
        .section h2 {
            font-size: 1.5em;
            color: #2c3e50;
            border-bottom: 1px solid #bdc3c7;
            padding-bottom: 5px;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .summary {
            font-size: 1.1em;
            line-height: 1.8;
            text-align: justify;
            margin-bottom: 30px;
        }
        
        .experience-item, .education-item, .project-item, .certification-item {
            margin-bottom: 20px;
            border-left: 3px solid #3498db;
            padding-left: 15px;
        }
        
        .experience-header, .education-header, .project-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 8px;
            flex-wrap: wrap;
        }
        
        .position, .degree, .project-name {
            font-size: 1.2em;
            font-weight: bold;
            color: #2c3e50;
        }
        
        .company, .institution {
            color: #3498db;
            font-weight: 600;
            font-size: 1.1em;
        }
        
        .date {
            color: #7f8c8d;
            font-style: italic;
            white-space: nowrap;
        }
        
        .description {
            margin-top: 8px;
            line-height: 1.7;
            text-align: justify;
        }
        
        .skills {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        
        .skill {
            background: #ecf0f1;
            padding: 6px 12px;
            border-radius: 15px;
            font-size: 0.9em;
            color: #2c3e50;
            border: 1px solid #bdc3c7;
        }
        
        .technologies {
            margin-top: 8px;
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
        }
        
        .tech {
            background: #e8f4f8;
            color: #2980b9;
            padding: 4px 8px;
            border-radius: 10px;
            font-size: 0.8em;
            border: 1px solid #3498db;
        }
        
        .project-link {
            color: #3498db;
            text-decoration: none;
            font-weight: 600;
        }
        
        .project-link:hover {
            text-decoration: underline;
        }
        
        @media print {
            body {
                padding: 20px;
                font-size: 12px;
            }
            
            .header h1 {
                font-size: 2em;
            }
            
            .section h2 {
                font-size: 1.2em;
            }
            
            .position, .degree, .project-name {
                font-size: 1em;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>${resume.personalInfo.name}</h1>
        <div class="contact-info">
            <span>${resume.personalInfo.email}</span>
            <span>${resume.personalInfo.phone}</span>
            <span>${resume.personalInfo.address}</span>
        </div>
        ${(resume.personalInfo.linkedin || resume.personalInfo.website) ? `
        <div class="contact-links">
            ${resume.personalInfo.linkedin ? `<span>${resume.personalInfo.linkedin}</span>` : ''}
            ${resume.personalInfo.website ? `<span>${resume.personalInfo.website}</span>` : ''}
        </div>
        ` : ''}
    </div>

    ${resume.summary ? `
    <div class="section">
        <h2>Professional Summary</h2>
        <div class="summary">${resume.summary}</div>
    </div>
    ` : ''}

    ${resume.experience && resume.experience.length > 0 ? `
    <div class="section">
        <h2>Professional Experience</h2>
        ${resume.experience.map(exp => `
        <div class="experience-item">
            <div class="experience-header">
                <div>
                    <div class="position">${exp.position}</div>
                    <div class="company">${exp.company}</div>
                </div>
                <div class="date">${formatDate(exp.startDate)} - ${exp.endDate ? formatDate(exp.endDate) : 'Present'}</div>
            </div>
            <div class="description">${exp.description.replace(/\n/g, '<br>')}</div>
        </div>
        `).join('')}
    </div>
    ` : ''}

    ${resume.education && resume.education.length > 0 ? `
    <div class="section">
        <h2>Education</h2>
        ${resume.education.map(edu => `
        <div class="education-item">
            <div class="education-header">
                <div>
                    <div class="degree">${edu.degree}</div>
                    <div class="institution">${edu.institution}</div>
                    ${edu.gpa ? `<div style="color: #7f8c8d;">GPA: ${edu.gpa}</div>` : ''}
                </div>
                <div class="date">${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}</div>
            </div>
        </div>
        `).join('')}
    </div>
    ` : ''}

    ${resume.skills && resume.skills.length > 0 ? `
    <div class="section">
        <h2>Skills</h2>
        <div class="skills">
            ${resume.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
        </div>
    </div>
    ` : ''}

    ${resume.projects && resume.projects.length > 0 ? `
    <div class="section">
        <h2>Projects</h2>
        ${resume.projects.map(project => `
        <div class="project-item">
            <div class="project-header">
                <div class="project-name">${project.name}</div>
                ${project.link ? `<a href="${project.link}" class="project-link" target="_blank">View Project</a>` : ''}
            </div>
            <div class="description">${project.description}</div>
            ${project.technologies && project.technologies.length > 0 ? `
            <div class="technologies">
                ${project.technologies.map(tech => `<span class="tech">${tech}</span>`).join('')}
            </div>
            ` : ''}
        </div>
        `).join('')}
    </div>
    ` : ''}

    ${resume.certifications && resume.certifications.length > 0 ? `
    <div class="section">
        <h2>Certifications</h2>
        ${resume.certifications.map(cert => `
        <div class="certification-item">
            <div class="experience-header">
                <div>
                    <div class="position">${cert.name}</div>
                    <div class="company">${cert.issuer}</div>
                </div>
                <div class="date">${formatDate(cert.date)}</div>
            </div>
        </div>
        `).join('')}
    </div>
    ` : ''}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    const exportFileDefaultName = `${resume.personalInfo.name.replace(/\s+/g, '_')}_resume.html`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', url);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    URL.revokeObjectURL(url);
    
    toast({
      title: "Resume Downloaded!",
      description: `${exportFileDefaultName} has been downloaded successfully.`,
    });
  };

  const printResume = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${resume.personalInfo.name} - Resume</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              h1 { color: #333; text-align: center; }
              h2 { color: #555; border-bottom: 1px solid #ddd; }
              .contact { text-align: center; margin-bottom: 20px; }
              .section { margin-bottom: 20px; }
              .skill { display: inline-block; background: #f0f0f0; padding: 4px 8px; margin: 2px; border-radius: 4px; }
            </style>
          </head>
          <body>
            <h1>${resume.personalInfo.name}</h1>
            <div class="contact">
              ${resume.personalInfo.email} | ${resume.personalInfo.phone} | ${resume.personalInfo.address}
            </div>
            <div class="section">
              <h2>Professional Summary</h2>
              <p>${resume.summary}</p>
            </div>
            <div class="section">
              <h2>Skills</h2>
              ${resume.skills.map(skill => `<span class="skill">${skill}</span>`).join('')}
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
    
    toast({
      title: "Print Dialog Opened",
      description: "Your resume is ready to print!",
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Download Resume
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={downloadJSON}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileJson className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div>JSON Format</div>
                  <div className="text-sm font-normal text-gray-600">
                    Raw data format for backup or import
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={downloadFormattedResume}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div>Formatted Resume</div>
                  <div className="text-sm font-normal text-gray-600">
                    Professional HTML format ready to print
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={printResume}>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-3 text-lg">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Printer className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div>Print Resume</div>
                  <div className="text-sm font-normal text-gray-600">
                    Open print dialog for immediate printing
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
