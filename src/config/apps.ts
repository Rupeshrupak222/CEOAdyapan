export interface AppCredentials {
  email: string;
  password: string;
  role?: string;
}

export interface AppConfig {
  id: 'crm' | 'lms' | 'hrms' | 'careers';
  name: string;
  shortName: string;
  description: string;
  icon: 'Building2' | 'GraduationCap' | 'Users' | 'Briefcase';
  url: string;
  externalUrl: string;
  color: string;
  badge: string;
  category: string;
  tags: string[];
  credentials: AppCredentials;
}

export const APPLICATIONS: Record<string, AppConfig> = {
  crm: {
    id: 'crm',
    name: 'Adyapan CRM',
    shortName: 'CRM',
    description: 'Enterprise Sales Pipeline, Admissions & Deal Tracking System',
    icon: 'Building2',
    url: '/crm-frame',
    externalUrl: 'https://adyapancrm.in',
    color: 'from-orange-500 to-amber-600',
    badge: 'Sales & Admissions',
    category: 'Commercial Operations',
    tags: ['Sales', 'Leads', 'Deals', 'Transactions'],
    credentials: {
      email: 'saiadyapan@gmail.com',
      password: '12345678',
      role: 'Super Admin',
    },
  },
  lms: {
    id: 'lms',
    name: 'Adyapan LMS Academy',
    shortName: 'LMS',
    description: 'Learning Management System, Cohorts & Student Analytics Portal',
    icon: 'GraduationCap',
    url: 'https://my.adyapan.com',
    externalUrl: 'https://my.adyapan.com',
    color: 'from-purple-500 to-indigo-600',
    badge: 'Academics & Training',
    category: 'Educational Technology',
    tags: ['Courses', 'Students', 'Quizzes', 'Batches'],
    credentials: {
      email: 'sai@adyapan.com',
      password: '4$5ShfH#',
      role: 'Academy Admin',
    },
  },
  hrms: {
    id: 'hrms',
    name: 'Adyapan HRMS',
    shortName: 'HRMS',
    description: 'Workforce Master, Biometrics Attendance & Payroll Management',
    icon: 'Users',
    url: 'https://hrms.adyapan.com',
    externalUrl: 'https://hrms.adyapan.com',
    color: 'from-emerald-500 to-teal-600',
    badge: 'Human Resources',
    category: 'People & Operations',
    tags: ['Employees', 'Attendance', 'Payroll', 'Leaves'],
    credentials: {
      email: 'admin@adyapan.com',
      password: 'Admin@Ady2026!',
      role: 'HR Admin',
    },
  },
  careers: {
    id: 'careers',
    name: 'Adyapan Careers',
    shortName: 'Careers',
    description: 'Talent Acquisition, ATS Candidate Pipeline & Recruitment',
    icon: 'Briefcase',
    url: 'https://career.adyapan.com/login',
    externalUrl: 'https://career.adyapan.com/login',
    color: 'from-blue-500 to-cyan-600',
    badge: 'Hiring & Recruitment',
    category: 'Talent Acquisition',
    tags: ['ATS', 'Applicants', 'Jobs', 'Interviews'],
    credentials: {
      email: 'admin@adyapan.com',
      password: 'Admin@123',
      role: 'Talent Lead',
    },
  },
};

export const APP_LIST = Object.values(APPLICATIONS);
