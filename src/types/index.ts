export type EcosystemModule = 'dashboard' | 'crm' | 'lms' | 'hrms' | 'careers' | 'settings';

export type UserRole = 'CEO' | 'Admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  organization: string;
  department: string;
  timezone: string;
  twoFactorEnabled: boolean;
}

export interface ActivityItem {
  id: string;
  module: 'crm' | 'lms' | 'hrms' | 'careers' | 'system';
  title: string;
  description: string;
  timestamp: string;
  user: {
    name: string;
    avatar?: string;
  };
  badgeColor: string;
  status?: 'success' | 'warning' | 'info' | 'pending';
}

export interface KPICardData {
  id: string;
  title: string;
  value: string;
  numericValue: number;
  change: string;
  isPositive: boolean;
  module: string;
  subtitle: string;
  sparkline: number[];
}

export interface CRMLead {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: 'Qualified' | 'Proposal' | 'Negotiation' | 'Closed Won' | 'Lost';
  value: number;
  source: string;
  owner: {
    name: string;
    avatar: string;
  };
  probability: number;
  createdAt: string;
}

export interface LMSCourse {
  id: string;
  title: string;
  category: string;
  enrolledStudents: number;
  completionRate: number;
  rating: number;
  instructor: string;
  duration: string;
  status: 'Published' | 'Draft' | 'Archived';
  revenue: number;
  progress: number;
  thumbnail: string;
}

export interface LMSStudent {
  id: string;
  name: string;
  email: string;
  enrolledCoursesCount: number;
  avgCompletion: number;
  lastActive: string;
  grade: string;
  status: 'Active' | 'Inactive' | 'Graduated';
  avatar: string;
}

export interface HRMSEmployee {
  id: string;
  name: string;
  role: string;
  department: 'Engineering' | 'Product' | 'Design' | 'Sales' | 'Human Resources' | 'Marketing';
  email: string;
  status: 'Active' | 'On Leave' | 'Remote' | 'Probation';
  joinDate: string;
  attendanceRate: number;
  avatar: string;
  performanceScore: number;
}

export interface HRMSLeaveRequest {
  id: string;
  employeeName: string;
  employeeAvatar: string;
  type: 'Annual' | 'Sick' | 'Parental' | 'Unpaid';
  dates: string;
  days: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  reason: string;
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Contract' | 'Remote';
  applicantsCount: number;
  status: 'Active' | 'Paused' | 'Closed';
  salaryRange: string;
  postedDate: string;
}

export interface Candidate {
  id: string;
  name: string;
  role: string;
  email: string;
  experience: string;
  stage: 'Applied' | 'Screening' | 'Technical Interview' | 'Executive Review' | 'Offer Sent' | 'Hired';
  rating: number;
  avatar: string;
  appliedDate: string;
  matchScore: number;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'alert' | 'update' | 'message' | 'security';
  module: string;
}
