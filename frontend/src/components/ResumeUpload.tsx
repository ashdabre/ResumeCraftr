import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { Resume } from '@/pages/Index';
import { useToast } from '@/hooks/use-toast';

interface ResumeUploadProps {
  onResumeUpload: (resume: Resume) => void;
}

export const ResumeUpload: React.FC<ResumeUploadProps> = ({ onResumeUpload }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const generateResumeId = () => {
    return 'resume_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  };

  const parseResumeFile = async (file: File): Promise<Resume> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        console.log('File content:', content);
        
        // Create a basic resume structure from the uploaded file
        const resume: Resume = {
          id: generateResumeId(),
          fileName: file.name,
          personalInfo: {
            name: "",
            email: "",
            phone: "",
            address: "",
            linkedin: "",
            website: ""
          },
          summary: "",
          experience: [],
          education: [],
          skills: [],
          projects: [],
          certifications: [],
          lastModified: new Date().toISOString()
        };

        // Try to extract basic information from the content
        const lines = content.split('\n').filter(line => line.trim() !== '');
        console.log('Parsed lines:', lines);
        
        // Extract email
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
        const emails = content.match(emailRegex);
        if (emails && emails.length > 0) {
          resume.personalInfo.email = emails[0];
          console.log('Found email:', emails[0]);
        }

        // Extract phone number
        const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?\d{4}/g;
        const phones = content.match(phoneRegex);
        if (phones && phones.length > 0) {
          resume.personalInfo.phone = phones[0];
          console.log('Found phone:', phones[0]);
        }

        // Extract name (assume first line with letters is name, or look for common name patterns)
        for (const line of lines.slice(0, 5)) { // Check first 5 lines
          const trimmedLine = line.trim();
          if (trimmedLine.length > 2 && trimmedLine.length < 50 && /^[A-Za-z\s.]+$/.test(trimmedLine) && !trimmedLine.includes('@')) {
            resume.personalInfo.name = trimmedLine;
            console.log('Found name:', trimmedLine);
            break;
          }
        }

        // Extract address (look for common address patterns)
        const addressRegex = /\d+\s+[A-Za-z\s,]+(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd)/gi;
        const addresses = content.match(addressRegex);
        if (addresses && addresses.length > 0) {
          resume.personalInfo.address = addresses[0];
          console.log('Found address:', addresses[0]);
        }

        // Extract LinkedIn
        const linkedinRegex = /(?:linkedin\.com\/in\/|linkedin\.com\/pub\/)([\w-]+)/gi;
        const linkedin = content.match(linkedinRegex);
        if (linkedin && linkedin.length > 0) {
          resume.personalInfo.linkedin = linkedin[0];
          console.log('Found LinkedIn:', linkedin[0]);
        }

        // Extract website
        const websiteRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g;
        const websites = content.match(websiteRegex);
        if (websites && websites.length > 0) {
          // Filter out LinkedIn and email-related URLs
          const filteredWebsites = websites.filter(url => 
            !url.includes('linkedin.com') && !url.includes('mailto:')
          );
          if (filteredWebsites.length > 0) {
            resume.personalInfo.website = filteredWebsites[0];
            console.log('Found website:', filteredWebsites[0]);
          }
        }

        // Extract skills (look for common skill keywords and skill sections)
        const skillKeywords = [
          'JavaScript', 'Python', 'React', 'Node.js', 'HTML', 'CSS', 'Java', 'C++', 'SQL', 'Git', 
          'Docker', 'AWS', 'TypeScript', 'Angular', 'Vue', 'MongoDB', 'PostgreSQL', 'PHP', 'C#',
          'Kubernetes', 'Jenkins', 'Linux', 'Windows', 'MacOS', 'Agile', 'Scrum', 'REST', 'API',
          'GraphQL', 'Redux', 'Express', 'Django', 'Flask', 'Spring', 'Laravel', 'Ruby', 'Go'
        ];
        const foundSkills: string[] = [];
        
        skillKeywords.forEach(skill => {
          if (content.toLowerCase().includes(skill.toLowerCase())) {
            foundSkills.push(skill);
          }
        });
        resume.skills = foundSkills;
        console.log('Found skills:', foundSkills);

        // Extract experience (look for job titles and companies)
        const experienceKeywords = ['experience', 'work history', 'employment', 'career'];
        const jobTitleKeywords = ['developer', 'engineer', 'manager', 'analyst', 'designer', 'consultant', 'specialist', 'coordinator', 'director', 'lead'];
        
        // Try to find experience section and extract job information
        let experienceFound = false;
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].toLowerCase();
          if (experienceKeywords.some(keyword => line.includes(keyword))) {
            experienceFound = true;
            // Look for job entries after experience section
            for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
              const jobLine = lines[j];
              if (jobTitleKeywords.some(title => jobLine.toLowerCase().includes(title))) {
                const experienceEntry = {
                  id: generateResumeId(),
                  company: 'Company name extracted from resume',
                  position: jobLine.trim(),
                  startDate: '2020-01-01', // Default dates
                  endDate: '2023-12-31',
                  description: `Experience details extracted from ${file.name}`
                };
                resume.experience.push(experienceEntry);
                console.log('Found experience:', experienceEntry);
                break;
              }
            }
            break;
          }
        }

        // If no structured experience found, create a generic one if we have a name
        if (!experienceFound && resume.personalInfo.name) {
          resume.experience.push({
            id: generateResumeId(),
            company: 'Previous Company',
            position: 'Professional Role',
            startDate: '2020-01-01',
            endDate: '2023-12-31',
            description: 'Professional experience details will be updated during editing.'
          });
        }

        // Extract education
        const educationKeywords = ['education', 'degree', 'university', 'college', 'bachelor', 'master', 'phd', 'diploma'];
        const degreeKeywords = ['bachelor', 'master', 'phd', 'doctorate', 'associate', 'diploma', 'certificate'];
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].toLowerCase();
          if (educationKeywords.some(keyword => line.includes(keyword))) {
            // Look for degree information
            for (let j = i; j < Math.min(i + 5, lines.length); j++) {
              const eduLine = lines[j];
              if (degreeKeywords.some(degree => eduLine.toLowerCase().includes(degree))) {
                const educationEntry = {
                  id: generateResumeId(),
                  institution: 'Educational Institution',
                  degree: eduLine.trim(),
                  startDate: '2016-09-01',
                  endDate: '2020-05-31',
                  gpa: ''
                };
                resume.education.push(educationEntry);
                console.log('Found education:', educationEntry);
                break;
              }
            }
            break;
          }
        }

        // Set a summary from the content (look for summary/objective sections or create from content)
        const summaryKeywords = ['summary', 'objective', 'profile', 'about'];
        let summaryFound = false;
        
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i].toLowerCase();
          if (summaryKeywords.some(keyword => line.includes(keyword))) {
            // Get next few lines as summary
            const summaryLines = lines.slice(i + 1, i + 4).filter(line => line.trim().length > 20);
            if (summaryLines.length > 0) {
              resume.summary = summaryLines.join(' ').trim();
              summaryFound = true;
              console.log('Found summary:', resume.summary);
              break;
            }
          }
        }

        // If no summary found, create a basic one
        if (!summaryFound) {
          const contentPreview = lines.slice(0, 3).join(' ').substring(0, 200);
          if (contentPreview.length > 50) {
            resume.summary = `Professional with experience in ${foundSkills.slice(0, 3).join(', ')} and other relevant technologies. Details extracted from uploaded resume.`;
          }
        }

        console.log('Final parsed resume:', resume);
        resolve(resume);
      };
      
      reader.readAsText(file);
    });
  };

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    setIsProcessing(true);
    try {
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const resume = await parseResumeFile(file);
      onResumeUpload(resume);
      
      toast({
        title: "Success!",
        description: `Resume "${file.name}" has been processed successfully.`,
      });
    } catch (error) {
      console.error('Error processing resume:', error);
      toast({
        title: "Error",
        description: "Failed to process the resume file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive
            ? 'border-slate-400 bg-slate-50'
            : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {isProcessing ? (
          <div className="space-y-4">
            <Loader2 className="w-12 h-12 text-slate-600 mx-auto animate-spin" />
            <div>
              <p className="text-slate-800 font-medium">Processing your resume...</p>
              <p className="text-slate-500 text-sm">This may take a moment</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-16 h-16 bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl mx-auto flex items-center justify-center shadow-lg">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-slate-800 font-medium mb-2">
                Drag & drop your resume here
              </p>
              <p className="text-slate-500 text-sm mb-4">
                Supports PDF, DOC, DOCX, TXT files
              </p>
              <Button
                variant="outline"
                className="bg-white border-slate-300 text-slate-700 hover:bg-slate-50 shadow-sm"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <FileText className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </div>
          </div>
        )}
        
        <Input
          id="file-upload"
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
      
      <div className="flex items-center justify-center space-x-4 text-sm text-slate-500">
        <span>Supported formats:</span>
        <div className="flex space-x-2">
          <span className="px-2 py-1 bg-slate-100 rounded text-xs border">PDF</span>
          <span className="px-2 py-1 bg-slate-100 rounded text-xs border">DOC</span>
          <span className="px-2 py-1 bg-slate-100 rounded text-xs border">DOCX</span>
          <span className="px-2 py-1 bg-slate-100 rounded text-xs border">TXT</span>
        </div>
      </div>
    </div>
  );
};
//////////////////////////////////////////////

// import React, { useState, useRef } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Upload, FileText, Loader2 } from 'lucide-react';
// import { Resume } from '@/pages/Index';
// import { useToast } from '@/hooks/use-toast';

// interface ResumeUploadProps {
//   onResumeUpload: (resume: Resume) => void;
// }

// export const ResumeUpload: React.FC<ResumeUploadProps> = ({ onResumeUpload }) => {
//   const [isUploading, setIsUploading] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const { toast } = useToast();

//   const parseResumeContent = (text: string, fileName: string, originalFile: File): Resume => {
//     console.log('Parsing resume content:', text.substring(0, 500));
    
//     // Initialize empty resume structure
//     let extractedName = '';
//     let extractedEmail = '';
//     let extractedPhone = '';
//     let extractedAddress = '';
//     let extractedLinkedIn = '';
//     let extractedWebsite = '';
//     let extractedSummary = '';
//     let extractedExperience: Resume['experience'] = [];
//     let extractedEducation: Resume['education'] = [];
//     let extractedSkills: Resume['skills'] = [];
//     let extractedProjects: Resume['projects'] = [];
//     let extractedCertifications: Resume['certifications'] = [];

//     // Clean and normalize text
//     const cleanText = text.replace(/\s+/g, ' ').trim();
//     const lines = text.split('\n').map(line => line.trim()).filter(line => line);

//     // Enhanced Name extraction - look for patterns at the beginning
//     const namePatterns = [
//       /^([A-Z][a-zA-Z]+(?: [A-Z][a-zA-Z]+)+)/m,
//       /(?:Name|Full Name)[:\s]*([A-Z][a-zA-Z]+(?: [A-Z][a-zA-Z]+)+)/i,
//       /^([A-Z][a-zA-Z]+ [A-Z][a-zA-Z]+(?:\s[A-Z][a-zA-Z]+)?)/m
//     ];
    
//     for (const pattern of namePatterns) {
//       const match = cleanText.match(pattern);
//       if (match && match[1]) {
//         extractedName = match[1].trim();
//         break;
//       }
//     }

//     // Enhanced Email extraction
//     const emailMatch = cleanText.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
//     extractedEmail = emailMatch ? emailMatch[1] : '';

//     // Enhanced Phone extraction
//     const phonePatterns = [
//       /(\+?\d{1,3}[-.\s]?)?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})/,
//       /(\+?\d{1,3}[-.\s]?)?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})/,
//       /(?:Phone|Tel|Mobile|Cell)[:\s]*(\+?\d{1,3}[-.\s]?)?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})/i
//     ];
    
//     for (const pattern of phonePatterns) {
//       const match = cleanText.match(pattern);
//       if (match) {
//         extractedPhone = match[0].trim();
//         break;
//       }
//     }

//     // LinkedIn extraction
//     const linkedinPatterns = [
//       /(linkedin\.com\/in\/[a-zA-Z0-9-]+)/i,
//       /(?:LinkedIn|linkedin)[:\s]*(linkedin\.com\/in\/[a-zA-Z0-9-]+)/i,
//       /(linkedin\.com\/in\/[a-zA-Z0-9-]+)/i
//     ];
    
//     for (const pattern of linkedinPatterns) {
//       const match = cleanText.match(pattern);
//       if (match) {
//         extractedLinkedIn = match[1] || match[0];
//         break;
//       }
//     }

//     // Website extraction
//     const websiteMatch = cleanText.match(/(https?:\/\/[^\s]+|www\.[^\s]+)/i);
//     extractedWebsite = websiteMatch ? websiteMatch[0] : '';

//     // Address extraction - look for patterns with city, state, zip
//     const addressPatterns = [
//       /(\d+\s+[A-Za-z0-9\s,'-]+(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd)[^,\n]*(?:,\s*[A-Za-z\s]+,\s*[A-Z]{2}\s*\d{5})?)/i,
//       /([A-Za-z\s]+,\s*[A-Z]{2}\s*\d{5}(?:-\d{4})?)/,
//       /(?:Address|Location)[:\s]*([^\n]+)/i
//     ];
    
//     for (const pattern of addressPatterns) {
//       const match = cleanText.match(pattern);
//       if (match && match[1]) {
//         extractedAddress = match[1].trim();
//         break;
//       }
//     }

//     // Enhanced Summary/Objective extraction
//     const summaryPatterns = [
//       /(?:Professional\s+Summary|Summary|Objective|Profile|About)[:\s]*([\s\S]*?)(?=\n\s*(?:Experience|Education|Skills|Employment|Work\s+History|Technical\s+Skills))/i,
//       /(?:Summary|Objective)[:\s]*([^\n]*(?:\n(?!\s*[A-Z][A-Za-z\s]*:)[^\n]*)*)/i
//     ];
    
//     for (const pattern of summaryPatterns) {
//       const match = text.match(pattern);
//       if (match && match[1]) {
//         extractedSummary = match[1].trim().replace(/\s+/g, ' ');
//         break;
//       }
//     }

//     // Enhanced Skills extraction
//     const skillsPatterns = [
//       /(?:Technical\s+Skills|Skills|Core\s+Competencies|Technologies)[:\s]*([\s\S]*?)(?=\n\s*(?:Experience|Education|Employment|Work\s+History|Projects|Certifications))/i,
//       /(?:Skills)[:\s]*([^\n]*(?:\n(?!\s*[A-Z][A-Za-z\s]*:)[^\n]*)*)/i
//     ];
    
//     for (const pattern of skillsPatterns) {
//       const match = text.match(pattern);
//       if (match && match[1]) {
//         const skillsText = match[1].trim();
//         // Split by common delimiters and clean up
//         extractedSkills = skillsText
//           .split(/[,;•\n|]/)
//           .map(skill => skill.trim())
//           .filter(skill => skill && skill.length > 1 && skill.length < 50)
//           .slice(0, 20); // Limit to first 20 skills
//         break;
//       }
//     }

//     // Enhanced Experience extraction
//     const experiencePattern = /(?:Professional\s+Experience|Work\s+Experience|Experience|Employment\s+History|Work\s+History)[:\s]*([\s\S]*?)(?=\n\s*(?:Education|Skills|Projects|Certifications)|$)/i;
//     const experienceMatch = text.match(experiencePattern);

//     if (experienceMatch && experienceMatch[1]) {
//       const experienceText = experienceMatch[1].trim();
//       // Split by double newlines or job patterns
//       const jobEntries = experienceText.split(/\n\s*\n|\n(?=[A-Z][^,\n]*(?:,|\s+\|\s+|\s+at\s+))/);

//       extractedExperience = jobEntries
//         .map((entry, index) => {
//           const lines = entry.split('\n').map(line => line.trim()).filter(line => line);
//           if (lines.length < 2) return null;

//           // Try to identify position and company
//           let position = '';
//           let company = '';
//           let dateRange = '';
//           let description = '';

//           // Look for patterns like "Position at Company" or "Position | Company"
//           const firstLine = lines[0];
//           const positionCompanyMatch = firstLine.match(/^([^,|@]+?)(?:\s+(?:at|@|\|)\s+(.+?))?$/);
          
//           if (positionCompanyMatch) {
//             position = positionCompanyMatch[1].trim();
//             company = positionCompanyMatch[2]?.trim() || '';
//           }

//           // Look for date range in second line or later
//           for (let i = 1; i < lines.length; i++) {
//             const dateMatch = lines[i].match(/(\d{4}|\w+\s+\d{4}).*?(?:to|-).*?(\d{4}|present|current)/i);
//             if (dateMatch) {
//               dateRange = lines[i];
//               description = lines.slice(i + 1).join('\n');
//               break;
//             }
//           }

//           // If no date found, assume second line is company and rest is description
//           if (!dateRange && lines.length > 1) {
//             if (!company) {
//               company = lines[1];
//               description = lines.slice(2).join('\n');
//             } else {
//               description = lines.slice(1).join('\n');
//             }
//           }

//           const [startDate, endDate] = dateRange
//             ? dateRange.split(/\s*(?:to|-|–)\s*/i).map(d => d.trim())
//             : ['', ''];

//           return {
//             id: `exp_${index}`,
//             company: company || 'Company Name',
//             position: position || 'Position Title',
//             startDate: startDate || '',
//             endDate: endDate || '',
//             description: description || '',
//           };
//         })
//         .filter(Boolean) as Resume['experience'];
//     }

//     // Enhanced Education extraction
//     const educationPattern = /(?:Education|Academic\s+Background)[:\s]*([\s\S]*?)(?=\n\s*(?:Experience|Skills|Projects|Certifications|Work\s+History)|$)/i;
//     const educationMatch = text.match(educationPattern);

//     if (educationMatch && educationMatch[1]) {
//       const educationText = educationMatch[1].trim();
//       const eduEntries = educationText.split(/\n\s*\n|\n(?=[A-Z][^,\n]*(?:,|\s+in\s+|\s+of\s+))/);

//       extractedEducation = eduEntries
//         .map((entry, index) => {
//           const lines = entry.split('\n').map(line => line.trim()).filter(line => line);
//           if (lines.length < 1) return null;

//           let degree = '';
//           let institution = '';
//           let dateRange = '';

//           // First line usually contains degree info
//           const degreeMatch = lines[0].match(/^([^,]+?)(?:\s*,\s*(.+))?$/);
//           if (degreeMatch) {
//             degree = degreeMatch[1].trim();
//             institution = degreeMatch[2]?.trim() || '';
//           }

//           // Look for institution in second line if not found
//           if (!institution && lines.length > 1) {
//             institution = lines[1];
//           }

//           // Look for date range
//           for (const line of lines) {
//             const dateMatch = line.match(/(\d{4}).*?(\d{4})/);
//             if (dateMatch) {
//               dateRange = line;
//               break;
//             }
//           }

//           const [startDate, endDate] = dateRange
//             ? dateRange.split(/\s*(?:to|-|–)\s*/i).map(d => d.trim())
//             : ['', ''];

//           return {
//             id: `edu_${index}`,
//             institution: institution || 'Institution Name',
//             degree: degree || 'Degree',
//             startDate: startDate || '',
//             endDate: endDate || '',
//           };
//         })
//         .filter(Boolean) as Resume['education'];
//     }

//     // Enhanced Projects extraction
//     const projectsPattern = /(?:Projects|Personal\s+Projects|Notable\s+Projects)[:\s]*([\s\S]*?)(?=\n\s*(?:Experience|Education|Skills|Certifications)|$)/i;
//     const projectsMatch = text.match(projectsPattern);

//     if (projectsMatch && projectsMatch[1]) {
//       const projectsText = projectsMatch[1].trim();
//       const projectEntries = projectsText.split(/\n\s*\n|\n(?=[A-Z][^\n]*(?::|-))/);

//       extractedProjects = projectEntries
//         .map((entry, index) => {
//           const lines = entry.split('\n').map(line => line.trim()).filter(line => line);
//           if (lines.length < 1) return null;

//           const name = lines[0].replace(/[:\-].*$/, '').trim();
//           const description = lines.slice(1).join(' ').trim();

//           return {
//             id: `proj_${index}`,
//             name: name || `Project ${index + 1}`,
//             description: description || '',
//             technologies: [], // Could be enhanced to extract technologies
//           };
//         })
//         .filter(Boolean) as Resume['projects'];
//     }

//     // Enhanced Certifications extraction
//     const certificationsPattern = /(?:Certifications|Certificates|Professional\s+Certifications)[:\s]*([\s\S]*?)(?=\n\s*(?:Experience|Education|Skills|Projects)|$)/i;
//     const certificationsMatch = text.match(certificationsPattern);

//     if (certificationsMatch && certificationsMatch[1]) {
//       const certificationsText = certificationsMatch[1].trim();
//       const certEntries = certificationsText.split(/\n\s*\n|\n(?=[A-Z][^\n]*(?:,|\s+-\s+))/);

//       extractedCertifications = certEntries
//         .map((entry, index) => {
//           const lines = entry.split('\n').map(line => line.trim()).filter(line => line);
//           if (lines.length < 1) return null;

//           const parts = lines[0].split(/[,-]/);
//           const name = parts[0]?.trim() || `Certification ${index + 1}`;
//           const issuer = parts[1]?.trim() || '';
          
//           // Look for date
//           let date = '';
//           const dateMatch = entry.match(/(\d{4}|\w+\s+\d{4})/);
//           if (dateMatch) {
//             date = dateMatch[0];
//           }

//           return {
//             id: `cert_${index}`,
//             name: name,
//             issuer: issuer || 'Issuing Organization',
//             date: date || '',
//           };
//         })
//         .filter(Boolean) as Resume['certifications'];
//     }

//     const resume: Resume = {
//       id: 'resume_' + Date.now(),
//       fileName: fileName,
//       // originalFile: originalFile,
//       personalInfo: {
//         name: extractedName || 'Name Not Found',
//         email: extractedEmail || '',
//         phone: extractedPhone || '',
//         address: extractedAddress || '',
//         linkedin: extractedLinkedIn || '',
//         website: extractedWebsite || '',
//       },
//       summary: extractedSummary || '',
//       experience: extractedExperience,
//       education: extractedEducation,
//       skills: extractedSkills,
//       projects: extractedProjects,
//       certifications: extractedCertifications,
//       lastModified: new Date().toISOString(),
//     };

//     console.log('Parsed resume:', resume);
//     console.log('Extracted skills:', extractedSkills);
//     console.log('Extracted experience:', extractedExperience);
//     console.log('Extracted education:', extractedEducation);
    
//     return resume;
//   };

//   const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (!file) return;

//     setIsUploading(true);

//     try {
//       const text = await file.text();
//       const resume = parseResumeContent(text, file.name, file);
//       onResumeUpload(resume);
      
//       toast({
//         title: "Resume uploaded successfully!",
//         description: `${file.name} has been processed and data extracted.`,
//       });
//     } catch (error) {
//       console.error('Error processing file:', error);
//       toast({
//         title: "Upload failed",
//         description: "There was an error processing your resume. Please try again.",
//         variant: "destructive",
//       });
//     } finally {
//       setIsUploading(false);
//       if (fileInputRef.current) {
//         fileInputRef.current.value = '';
//       }
//     }
//   };

//   return (
//     <div>
//       <input
//         type="file"
//         id="upload"
//         className="hidden"
//         onChange={handleFileUpload}
//         accept=".pdf,.doc,.docx,.txt"
//         ref={fileInputRef}
//       />
//       <Button
//         asChild
//         disabled={isUploading}
//         className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold rounded shadow-lg"
//       >
//         <label htmlFor="upload" className="flex items-center justify-center gap-2 py-2 px-4 cursor-pointer">
//           {isUploading ? (
//             <>
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               Processing...
//             </>
//           ) : (
//             <>
//               <Upload className="mr-2 h-4 w-4" />
//               Upload Resume
//             </>
//           )}
//         </label>
//       </Button>
//     </div>
//   );
// };
