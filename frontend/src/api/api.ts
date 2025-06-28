import axios from 'axios';
const API = axios.create({ baseURL: 'http://localhost:8000' });

export interface Resume { name: string; summary: string; experience: any[]; education: any[]; skills: string[]; }
export interface SectionEnhanceResp { section: string; enhanced_content: string; }

export const listResumes = (): Promise<string[]> => API.get('/resumes').then(r => r.data.resumes);
export const fetchResume = (name: string): Promise<Resume> => API.get(`/resume/${encodeURIComponent(name)}`).then(r => r.data);
export const enhanceSection = (section: string, content: string): Promise<SectionEnhanceResp> => API.post('/ai-enhance', { section, content }).then(r => r.data);
export const saveResume = (resume: Resume): Promise<{ status: string; message: string }> => API.post('/save-resume', resume).then(r => r.data);