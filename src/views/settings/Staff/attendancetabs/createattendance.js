import React, { useEffect, useState } from 'react'
import { Card, CardBody,TabContent, TabPane, Nav, NavItem, NavLink, Row, Col} from 'reactstrap';
import classnames from 'classnames';
import StaffAttendancetab from '../staffattendence/createStaffAttendence';
import axios from 'axios';
import Studentattendence from 'src/views/students/studentAttendence/Studentattendence';
  
 const addendInitialData= {studPermissions:{canCreate: true, canView: true, canUpdate: true, canDelete: true},
stafPermissions:{canCreate: true, canView: true, canUpdate: true, canDelete: true}}
function createattendance() {
  
    // State for current active Tab
    const [currentActiveTab, setCurrentActiveTab] = useState('1');
    const [initialData,setState] = useState(addendInitialData);
    const {studPermissions,stafPermissions} = initialData
    // Toggle active state for Tab
    const toggle = tab => {
        if (currentActiveTab !== tab) setCurrentActiveTab(tab);
    }
  useEffect(()=>{
    let userid=localStorage.getItem("userid");
    axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token");
    axios.get(`${process.env.REACT_APP_BASE_URL_BASE}auth/users/${userid}`)
      .then((res) => {
        let studpermission = res.data.roles?res.data.roles[0]["student_attendences"]:null;
          let staffpermission = res.data.roles?res.data.roles[0]["staff_attendence"]:null;
        setState((prevState) => ({
          ...prevState, 
          studPermissions:studpermission,stafPermissions:staffpermission
        }))
      }).catch((err) => {  })
  },[])
    return (
        <div>
        <Card>
            <CardBody className='cardbg'>
            <Nav tabs>
            {stafPermissions.canView?   <NavItem>
                    <NavLink
                        className={classnames({
                            active:
                                currentActiveTab === '1'
                        })}
                        onClick={() => { toggle('1'); }}
                    >
                       <h5><strong>Staff Attendance </strong></h5>
                    </NavLink>
                </NavItem>:null}
                {studPermissions.canView?     <NavItem>
                    <NavLink
                        className={classnames({
                            active:
                                currentActiveTab === '2'
                        })}
                        onClick={() => { toggle('2'); }}
                    >
                    <h5><strong> Student Attendance   </strong></h5>
                    </NavLink>
                </NavItem>:null}
              </Nav>
            </CardBody>
          <TabContent activeTab={currentActiveTab}>
            {stafPermissions.canView?  <TabPane tabId="1">
                    <Row>
                        <Col sm="12">
                            <StaffAttendancetab/>
                        </Col>
                    </Row>
                </TabPane>:null}
                {studPermissions.canView?  <TabPane tabId="2">
                    <Row>
                        <Col sm="12">
                             <Studentattendence/>
                        </Col>
                    </Row>
                </TabPane>:null}
            </TabContent>
            </Card>
        </div >
    );
}
  
export default createattendance;


