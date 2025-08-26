export interface Faculty {
  name: string;
  role: string;
  areaOfInterest: string;
  email: string;
}

export interface Department {
  label: string;
  value: string;
  faculties?: Faculty[];
}

export interface Staff {
  label: string;
  value: string;
  departmentCode: string;
}

export interface DocumentType {
  label: string;
  value: string;
}

// Department data with faculty information
export const departments: Department[] = [
  {
    label: 'Admin Block',
    value: 'ADMIN',
    faculties: [
      {
        name: 'Dr. K N Subramanya',
        role: 'Principal',
        areaOfInterest: 'Administration',
        email: 'principal@rvce.edu.in',
      },
      {
        name: 'Dr. B S Satyanarayana',
        role: 'Director',
        areaOfInterest: 'Administration',
        email: 'director@rvce.edu.in',
      },
      {
        name: 'Dr. N S Narahari',
        role: 'Dean Academics',
        areaOfInterest: 'Academic Administration',
        email: 'deanacademics@rvce.edu.in',
      },
      {
        name: 'Administrative Office',
        role: 'Administrative Section',
        areaOfInterest: 'Administration',
        email: 'admin@rvce.edu.in',
      },
      {
        name: 'Accounts Section',
        role: 'Accounts Department',
        areaOfInterest: 'Finance and Accounts',
        email: 'accounts@rvce.edu.in',
      },
      {
        name: 'Examination Section',
        role: 'Examination Department',
        areaOfInterest: 'Examination and Evaluation',
        email: 'examination@rvce.edu.in',
      },
    ],
  },
  {
    label: 'Aerospace Engineering',
    value: 'AE',
    faculties: [
      {
        name: 'Dr. Ravindra S Kulkarni',
        role: 'Professor & Head',
        areaOfInterest: 'Fluid Dynamics, Heat Transfer, Experimental Aerodynamics',
        email: 'ravindraskulkarni@rvce.edu.in',
      },
      {
        name: 'Dr. Promio Charles F',
        role: 'Associate Professor',
        areaOfInterest: 'Aerostructure Analysis, Aeroelasticity',
        email: 'promiocharlesf@rvce.edu.in',
      },
      {
        name: 'Dr. R Supreeth',
        role: 'Associate Professor',
        areaOfInterest: 'Aerodynamics, Aerospace Propulsion',
        email: 'supreethr@rvce.edu.in',
      },
    ],
  },
  {
    label: 'Artificial Intelligence & Machine Learning',
    value: 'AIML',
    faculties: [
      {
        name: 'Dr. B. Sathish Babu',
        role: 'Professor and HoD',
        areaOfInterest: 'Artificial Intelligence, Computer Networks Security, HPC',
        email: 'bsbabu@rvce.edu.in',
      },
      {
        name: 'Dr. Vijayalakshmi M.N',
        role: 'Associate Professor',
        areaOfInterest: 'Data Mining and Image Processing, Soft Computing',
        email: 'vijayalakshmi@rvce.edu.in',
      },
      {
        name: 'Dr. S. Anupama Kumar',
        role: 'Associate Professor',
        areaOfInterest: 'Data Mining',
        email: 'anupamakumar@rvce.edu.in',
      },
    ],
  },
  {
    label: 'Biotechnology',
    value: 'BT',
    faculties: [
      {
        name: 'Dr. Vidya Niranjan',
        role: 'Professor & HOD',
        areaOfInterest: 'Computational Biology',
        email: 'vidya.n@rvce.edu.in',
      },
      {
        name: 'Dr A H Manjunatha Reddy',
        role: 'Associate Professor',
        areaOfInterest: 'Environmental Biotechnology',
        email: 'ahmanjunatha@rvce.edu.in',
      },
    ],
  },
  {
    label: 'Chemical Engineering',
    value: 'CH',
    faculties: [
      {
        name: 'Dr. Vinod Kallur',
        role: 'Associate Professor and Head',
        areaOfInterest: 'Computational Chemical Engineering',
        email: 'vinodkallur@rvce.edu.in',
      },
      {
        name: 'Dr. R Suresh',
        role: 'Professor and Associate Dean',
        areaOfInterest: 'Transfer operations, Clean & Sustainable Technology',
        email: 'sureshr@rvce.edu.in',
      },
    ],
  },
  {
    label: 'Civil Engineering',
    value: 'CV',
    faculties: [
      {
        name: 'Dr. Radhakrishna',
        role: 'Professor & Head',
        areaOfInterest: 'Structural Engineering',
        email: 'radhakrishna@rvce.edu.in',
      },
      {
        name: 'Dr. M.V. Renukadevi',
        role: 'Professor',
        areaOfInterest: 'Structural Engineering',
        email: 'renukadevimv@rvce.edu.in',
      },
    ],
  },
  {
    label: 'Computer Science and Engineering',
    value: 'CSE',
    faculties: [
      {
        name: 'Dr. Ramakanth Kumar P',
        role: 'Professor & Head',
        areaOfInterest: 'Pattern Recognition, NLP',
        email: 'ramakanthkp@rvce.edu.in',
      },
      {
        name: 'Dr. Krishnappa H K',
        role: 'Associate Professor',
        areaOfInterest: 'Graph Theory, Graphics',
        email: 'krishnappahk@rvce.edu.in',
      },
      {
        name: 'Dr. Deepamala N',
        role: 'Associate Professor',
        areaOfInterest: 'NLP, Computer Networks',
        email: 'deepamalan@rvce.edu.in',
      },
    ],
  },
  {
    label: 'Electrical and Electronics Engineering',
    value: 'EEE',
    faculties: [
      {
        name: 'Dr. S. G. Srivani',
        role: 'Professor & (I/C) HOD, Associate PG Dean',
        areaOfInterest: 'Power System Protection and control, Smart grid',
        email: 'srivanisg@rvce.edu.in',
      },
      {
        name: 'Dr. M. N. Dinesh',
        role: 'Professor',
        areaOfInterest: 'Insulators for HV applications, control systems',
        email: 'dineshmn@rvce.edu.in',
      },
    ],
  },
  {
    label: 'Electronics and Communication Engineering',
    value: 'ECE',
    faculties: [
      {
        name: 'Dr. H. V. Ravish Aradhya',
        role: 'Professor & Associate PG Dean & HOD(I/c)',
        areaOfInterest: 'VLSI & Embedded Systems',
        email: 'ravisharadhya@rvce.edu.in',
      },
      {
        name: 'Dr. K.S. Geetha',
        role: 'Professor & Vice-Principal',
        areaOfInterest: 'Signal Processing, Image processing',
        email: 'geethaks@rvce.edu.in',
      },
    ],
  },
  {
    label: 'Information Science and Engineering',
    value: 'ISE',
    faculties: [
      {
        name: 'Dr. B.M. Sagar',
        role: 'Professor & HOD',
        areaOfInterest: 'Natural Language Processing, Algorithms',
        email: 'sagarbm@rvce.edu.in',
      },
      {
        name: 'S. G. Raghavendra Prasad',
        role: 'Assistant Professor',
        areaOfInterest: 'Discrete Mathematics, Graph theory, Automata theory',
        email: 'raghavendrap@rvce.edu.in',
      },
    ],
  },
  {
    label: 'Mechanical Engineering',
    value: 'ME',
    faculties: [
      {
        name: 'Dr. Krishna M',
        role: 'Professor and Head',
        areaOfInterest: 'Materials Science',
        email: 'krishnam@rvce.edu.in',
      },
      {
        name: 'Dr. Shanmukha N',
        role: 'Professor and Dean Academics',
        areaOfInterest: 'Machine Design',
        email: 'shanmukhan@rvce.edu.in',
      },
    ],
  },
];

// Convert faculty list to staff list for dropdowns
export const departmentStaff: Record<string, Staff[]> = departments
  .filter(dept => dept.faculties)
  .reduce((acc, dept) => {
    acc[dept.value] = dept.faculties!.map(faculty => ({
      label: `${faculty.name} (${faculty.role})`,
      value: faculty.email,
      departmentCode: dept.value,
    }));
    return acc;
  }, {} as Record<string, Staff[]>);

// Document types
export const documentTypes: DocumentType[] = [
  { label: 'National ID', value: 'NID' },
  { label: 'Aadhar Card', value: 'AADHAR' },
  { label: 'Driving License', value: 'DL' },
  { label: 'Company ID', value: 'CID' },
  { label: 'Other', value: 'OTHER' },
];
