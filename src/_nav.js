import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilCalculator, cilChartPie, cilCursor, cilDescription, cilDrop, cilNotes, cilPencil, cilPuzzle, cilSpeedometer, cilStar, cilUser, cilCalendar, cilEnvelopeLetter, cilLibraryAdd, cilPeople, cilPenAlt, cilSatelite, cilLineStyle, cilLineWeight, cilMoney, cilWc, cilStorage, cilSettings,cilUserPlus } from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
const _nav = [
  {
    component: CNavItem,
     title: "Dashboard",
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    identifier:"dashboard",
    // badge: {
    //   color: 'info',
    //   text: 'NEW',
    // },
  },
  {
    component: CNavItem,
    title: 'Students',
    to: '/studentTabs/1',
    icon: <CIcon icon={cilUserPlus} customClassName="nav-icon" />,
    identifier:"studentTab",
  },
  {
    component: CNavItem,
    title: "Attendence",
    icon: <CIcon icon={cilPenAlt} customClassName="nav-icon" />,
    to: '/attendence/createstaffattendence/new',
    identifier:"attendenceTab",
  },
  {
    component: CNavItem,
    title: "Level Testing",
    icon: <CIcon icon={cilLineWeight} customClassName="nav-icon" />,
    to: '/leveltesting/new',
    identifier:"levelTesting",
  },
  {
    component: CNavItem,
    title: "Contracts",
    icon: <CIcon icon={cilLibraryAdd} customClassName="nav-icon" />,
    to: '/settings/allcontracts',
    identifier:"contracts",
  },
  {
    component: CNavItem,
    title: "Certification",
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
    to: '/certifications',
    identifier:"certificates",
  },
  {
    component: CNavItem,
    title: "Email Templates",
    icon: <CIcon icon={cilEnvelopeLetter} customClassName="nav-icon" />,
    to: '/settings/allemailtemplates',
    identifier:"email_templates",
  },
  {
    component: CNavItem,
    title: "Users Management",
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    to: '/userTabs/1',
    identifier:"usersTab",
  },
  {
    component: CNavItem,
    title: "Batches",
    icon: <CIcon icon={cilWc} customClassName="nav-icon" />,
    to: '/settings/batches',
    identifier:"batches",
  },
  // {
  //   component: CNavItem,
  //   title: "Student Attendence ",
  //   icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
  //   to: '/studentattendenceList',
  //   identifier:"student_attendences",
  // },
 
  {
    component: CNavItem,
    title: "Events",
    icon: <CIcon icon={cilStorage} customClassName="nav-icon" />,
    to: '/events',
    identifier:"events",
  },
]
export default _nav
