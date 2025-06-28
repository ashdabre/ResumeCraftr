# # from pydantic import BaseModel
# # from typing import List, Dict

# # class SectionEnhanceRequest(BaseModel):
# #     section: str
# #     content: str

# # class Resume(BaseModel):
# #     name: str
# #     summary: str
# #     experience: List[Dict[str, str]]
# #     education: List[Dict[str, str]]
# #     skills: List[str]

# from pydantic import BaseModel
# from typing import List, Optional

# class PersonalInfo(BaseModel):
#     name: str
#     email: str
#     phone: str
#     address: str
#     linkedin: Optional[str] = None
#     website: Optional[str] = None

# class ExperienceItem(BaseModel):
#     id: str
#     company: str
#     position: str
#     startDate: str
#     endDate: Optional[str] = None
#     description: str

# class EducationItem(BaseModel):
#     id: str
#     institution: str
#     degree: str
#     fieldOfStudy: Optional[str] = None
#     startDate: str
#     endDate: Optional[str] = None

# class ProjectItem(BaseModel):
#     id: str
#     name: str
#     description: str
#     link: Optional[str] = None

# class CertificationItem(BaseModel):
#     id: str
#     name: str
#     issuer: str
#     date: str

# class Resume(BaseModel):
#     id: str
#     fileName: Optional[str]
#     personalInfo: PersonalInfo
#     summary: Optional[str]
#     experience: List[ExperienceItem]
#     education: List[EducationItem]
#     skills: List[str]
#     projects: List[ProjectItem]
#     certifications: List[CertificationItem]
#     lastModified: str
from pydantic import BaseModel
from typing import List, Dict, Optional

class SectionEnhanceRequest(BaseModel):
    section: str
    content: str

class Resume(BaseModel):
    name: str
    summary: str
    experience: List[Dict[str, str]]
    education: List[Dict[str, str]]
    skills: List[str]
    
    # ✅ ADD this field so FastAPI can receive it in the request
    fileName: Optional[str] = None
