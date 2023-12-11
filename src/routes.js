import React from 'react'
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))
const StudentTabs = React.lazy(() => import('./views/students/StudentTab'))
const InquiryList = React.lazy(() => import('./views/students/inquiry/InquiryList'))
const CreateInquiry = React.lazy(() => import('./views/students/inquiry/CreateInquiry'))
const Students = React.lazy(() => import('./views/students/studentList'))
const CreateStudent = React.lazy(() => import('./views/students/createStudent/createStudent'))
const EditStudent = React.lazy(() => import('./views/students/editStudent/editStudent'))
const StudentAttendenceList = React.lazy(() => import("./views/students/studentAttendence/studentAttendenceList"))
const StudentAttendence = React.lazy(() => import('./views/students/studentAttendence/Studentattendence'))
//contract
const AllContracts = React.lazy(() => import("./views/settings/contract/allcontracts"))
const CreateContract = React.lazy(() => import("./views/settings/contract/createcontract"))
//emailtemplate
const AllEmailTemplates = React.lazy(() => import("./views/settings/emailtemplate/allemailtemplates"))
const CreateTemplate = React.lazy(() => import("./views/settings/emailtemplate/createemailtemplate"))
//batch
const Batches = React.lazy(() => import("./views/settings/Batches/BatchList"))
const CreateBatch = React.lazy(() => import("./views/settings/Batches/createBatch"))
//events
const Allevents = React.lazy(() => import('./views/Events/Eventschedule/eventsList'))
const Createvent = React.lazy(() => import('./views/Events/Eventschedule/createEvent'))
const EventRegister = React.lazy(() => import('./views/Events/Eventregister/eventRegister'))
const StudentEvent = React.lazy(() => import('./views/Events/Studentevent/studentEvent'))
//const RegisteringStudent = React.lazy(() => import('./views/Events/Studentevent/registeringStudent'))
const EventCommunication = React.lazy(() => import('./views/Events/Eventcommunication/createEventCommunication'))
const  EventGroup = React.lazy(() => import('./views/Events/AudienceGroup/EventAudienceGroup'))
//staff
const UserTabs = React.lazy(() => import('./views/settings/Staff/userTabs'))
const Staff = React.lazy(() => import('./views/settings/Staff/staffdetails/staffList'))
const CreateStaff = React.lazy(() => import('./views/settings/Staff/staffdetails/createStaff'))
const PermissionsList = React.lazy(() => import('./views/settings/Staff/permissions/permissionsList'))
const CreatePermission = React.lazy(() => import('./views/settings/Staff/permissions/createPermission'))
 const CreateStaffAttendence = React.lazy(() => import('./views/settings/Staff/staffattendence/createStaffAttendence'))
const CreateCertification = React.lazy(() => import('./views/settings/certification/createCertification'))
const CertificationsList = React.lazy(() => import('./views/settings/certification/certificationsList'))
const CreateAttendence=React.lazy(()=> import('./views/settings/Staff/attendancetabs/createattendance'))
//leveltesting
const CreateLevelTesting = React.lazy(() => import('./views/leveltesting/createLevelTesting'))
//dashboard
const StaffAttendList = React.lazy(() => import('./views/dashboard/tables/StaffAttendList'))
const StudentAttandList = React.lazy(() => import('./views/dashboard/tables/StudentAttandList'))
const TestingEligibilityList = React.lazy(() => import('./views/dashboard/tables/TestingEligibilityList'))
const DashboardAttendence = React.lazy(() => import('./views/dashboard/tables/DashAttendTab'))
const ContractDetailsList = React.lazy(() => import('./views/dashboard/tables/ContractDetailsList'))
const InquiryDetailsList = React.lazy(() => import('./views/dashboard/tables/InquiryDetailsList'))
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard, exact:true },
  { path: '/dashboard/StudentANDstaffAttendenceTab', name: 'Student & Staff Attendence', element: DashboardAttendence, exact: true },
  { path: '/dashboard/StaffAttendList', name: 'StaffAttendList', element: StaffAttendList, exact: true },
  { path: '/dashboard/ContractDetailsList', name: 'ContractDetailsList', element: ContractDetailsList, exact: true },
  { path: '/dashboard/InquiryDetailsList', name: 'InquiryDetailsList', element: InquiryDetailsList, exact: true },
  { path: '/dashboard/StudentAttandList', name: 'StudentAttandList', element: StudentAttandList, exact: true },
  { path: '/dashboard/TestingEligibilityList', name: 'TestingEligibilityList', element: TestingEligibilityList, exact: true },
  { path: '/studentTabs/:id', name: 'Student Tabs', element: StudentTabs , exact: true },
  { path: '/studentTabs/inquiryList', name: 'Inquiry List', element: InquiryList , exact: true },
  { path: '/studentTabs/CreateInquiry/:id', name: 'Create Inquiry', element: CreateInquiry , exact: true },
   { path: '/studentTabs/students', name: 'Students', element: Students, exact: true },
  { path: '/studentTabs/students/create', name: 'Create Students', element: CreateStudent, exact: true },
  { path: '/studentTabs/students/edit/:id', name: 'Edit Students', element: EditStudent, exact: true },
  { path: '/studentattendenceList', name: 'StudentAttendenceList', element: StudentAttendenceList, exact: true },
  { path: '/studentattendence/:id', name: "StudentAttendence", element: StudentAttendence, exact: true },
  { path: '/settings/allcontracts', name: 'AllContracts', element: AllContracts, exact: true },
  { path: '/settings/createcontract/:id', name: 'CreateContract', element: CreateContract, exact: true },
  { path: '/settings/allemailtemplates', name: 'AllEmailTemplates', element: AllEmailTemplates, exact: true },
  { path: '/settings/createemailtemplate/:id', name: 'CreateTemplate', element: CreateTemplate, exact: true },
  { path: '/settings/batches', name: 'Batches', element: Batches, exact: true },
  { path: '/settings/createbatch/:id', name: 'CreateBatch', element: CreateBatch, exact: true },
  { path: '/events', name: 'AllEvents', element: Allevents, exact: true },
  { path: '/events/addevent/:id', name: 'AddEvent', element: Createvent, exact: true },
  { path: '/events/eventregister/:id', name: 'EventRegister', element: EventRegister, exact: true },
  { path: '/events/studentEvent/:id', name: 'Student Event', element: StudentEvent, exact: true },
  //{ path: '/events/registeringStudent/:id/:studentId', name: 'Registering Student', element: RegisteringStudent, exact: true },
  { path: '/events/createcommunication/:id/:name/:primaryAudienceId', name: 'Event Communication', element: EventCommunication, exact: true },
  { path: '/events/communication/group/:id', name: 'Event Group', element: EventGroup, exact: true },
  { path: '/attendence/createstaffattendence/:id', name: 'CreateAttendence', element: CreateAttendence, exact: true },
   { path: '/staff', name: 'Staff', element: Staff, exact: true },
   { path: '/userTabs/:id', name: 'UserTabs', element: UserTabs, exact: true },
   { path: '/permissions', name: 'PermissionsList', element: PermissionsList, exact: true },
   { path: '/permissions/create/:id', name: 'CreatePermission', element: CreatePermission, exact: true },
 { path: '/staff/createstaff/:id', name: 'CreateStaff', element: CreateStaff, exact: true },
  //{ path: '/staff/staffattendence', name: 'StaffAttendence', element: StaffAttendence, exact: true },
  { path: '/staff/createstaffattendence/:id', name: 'CreateStaffAttendence', element: CreateStaffAttendence, exact: true },
  { path: '/certifications', name: 'Certifications', element: CertificationsList, exact: true },
  { path: '/certifications/createcertification/:id', name: 'CreateCertification', element: CreateCertification, exact: true },
  { path: '/leveltesting/:id', name: 'CreateLevelTesting', element: CreateLevelTesting, exact: true },
  // { path: '/theme', name: 'Theme', element: Colors, exact: true },
  // { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },
]
export default routes
