import React from 'react';
import CIcon from '@coreui/icons-react';
import { cilSpeedometer, cilUser, cilCalendar, cilEnvelopeLetter, cilLibraryAdd, cilPeople, cilPenAlt, cilLineWeight, cilMoney, cilWc, cilStorage } from '@coreui/icons';
import { CNavItem } from '@coreui/react';
export const adminMenu = [
  {
    component: CNavItem,
    title: "Dashboard",
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  // {
  //   component: CNavItem,
  //   title: 'Students',
  //   to: '/students',
  //   icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  // },
   {
    component: CNavItem,
    title: 'Students',
    to: '/studentTabs/1',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    title: "Contracts",
    icon: <CIcon icon={cilLibraryAdd} customClassName="nav-icon" />,
    to: '/settings/allcontracts',
  },
  {
    component: CNavItem,
    title: "Email Templates",
    icon: <CIcon icon={cilEnvelopeLetter} customClassName="nav-icon" />,
    to: '/settings/allemailtemplates',
  },
  {
    component: CNavItem,
    title: "Batches",
    icon: <CIcon icon={cilWc} customClassName="nav-icon" />,
    to: '/settings/batches',
  },
  {
    component: CNavItem,
    title: "Student Attendence ",
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
    to: '/studentattendenceList',
  },
  {
    component: CNavItem,
    title: "Events",
    icon: <CIcon icon={cilStorage} customClassName="nav-icon" />,
    to: '/events',
  },
  // {
  //   component: CNavItem,
  //   title: "Staff",
  //   icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  //   to: '/staff',
  // },
  {
    component: CNavItem,
    title: "Users Management",
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    to: '/userTabs',
  },
  // {
  //   component: CNavItem,
  //   title: "Staff Attendence",
  //   icon: <CIcon icon={cilPenAlt} customClassName="nav-icon" />,
  //   to: '/staff/createstaffattendence/new',
  // },
  {
    component: CNavItem,
    title: "Certification",
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
    to: '/certifications',
  },
  {
    component: CNavItem,
    title: "Level Testing",
    icon: <CIcon icon={cilLineWeight} customClassName="nav-icon" />,
    to: '/leveltesting/new',
  },
  {
    component: CNavItem,
    title: "Staff Attendence",
    icon: <CIcon icon={cilPenAlt} customClassName="nav-icon" />,
    to: '/attendence/createstaffattendence/new',
  }
];
export const staffMenu = [
  {
    component: CNavItem,
    title: "Staff Attendence",
    icon: <CIcon icon={cilPenAlt} customClassName="nav-icon" />,
    to: '/staff/createstaffattendence/new',
  }
];
// export const adminMenu = (admin) => {
//   switch (admin) {
//     case 'dashboard':
//       return {
//         title: "Dashboard",
//         to: '/dashboard',
//         icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
//       }
//       break;
//     case 'students':
//       return {
//         title: 'Students',
//         to: '/students',
//         icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
//       }
//       break;
//     case 'contracts':
//       return {
//         title: "Contracts",
//         icon: <CIcon icon={cilLibraryAdd} customClassName="nav-icon" />,
//         to: '/settings/allcontracts',
//       }
//       break;
//     case 'emailtemplates':
//       return {
//         title: "Email Templates",
//         icon: <CIcon icon={cilEnvelopeLetter} customClassName="nav-icon" />,
//         to: '/settings/allemailtemplates',
//       }
//       break;
//     case 'batches':
//       return {
//         title: "Batches",
//         icon: <CIcon icon={cilWc} customClassName="nav-icon" />,
//         to: '/settings/batches',
//       }
//       break;
//     case 'studentattendence':
//       return {
//         title: "Student Attendence ",
//         icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
//         to: '/studentattendenceList',
//       }
//       break;
//     case 'events':
//       return {
//         title: "Events",
//         icon: <CIcon icon={cilStorage} customClassName="nav-icon" />,
//         to: '/events',
//       }
//       break;
//     case 'staff':
//       return {
//         title: "Staff",
//         icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
//         to: '/staff',
//       }
//       break;
//     case 'staffattendence':
//       return {
//         title: "Staff Attendence",
//         icon: <CIcon icon={cilPenAlt} customClassName="nav-icon" />,
//         to: '/staff/createstaffattendence/new',
//       }
//       break;
//     case 'certification':
//       return {
//         title: "Certification",
//         icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
//         to: '/certifications',
//       }
//       break;
//     case 'leveltesting':
//       return {
//         title: "Level Testing",
//         icon: <CIcon icon={cilLineWeight} customClassName="nav-icon" />,
//         to: '/leveltesting/new',
//       }
//       break;
//     default:
//       return null;
//       break;
//   }
// }
// export const staffMenu = (staff) => {
//   switch (staff) {
//     case 'studentattendence':
//       return {
//         title: "Student Attendence ",
//         icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
//         to: '/studentattendenceList',
//       }
//       break;
//     case 'staffattendence':
//       return {
//         title: "Staff Attendence",
//         icon: <CIcon icon={cilPenAlt} customClassName="nav-icon" />,
//         to: '/staff/createstaffattendence/new',
//       }
//       break;
//     default:
//       return null;
//       break;
//   }
// }