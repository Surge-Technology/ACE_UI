import React, { useEffect, useState } from 'react'
//import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, CardBody,TabContent, TabPane, Nav, NavItem, NavLink, Row, Col} from 'reactstrap';
import classnames from 'classnames';  
import { useParams } from 'react-router-dom';
import axios from 'axios';
import StudentAttandList from './StudentAttandList';
import StaffAttendList from './StaffAttendList';
function DashAttendTab() {
     const [currentActiveTab, setCurrentActiveTab] = useState('1'); 
    const params = useParams();
     const toggle = tab => {
        if (currentActiveTab !== tab) setCurrentActiveTab(tab);
    }
    useEffect(()=>{
        toggle("1");
      },[])
    return (
        <div  >
        <Card>
            <CardBody className='cardbg'>
            <Nav tabs>
             <NavItem>
                    <NavLink
                        className={classnames({
                            active:
                                currentActiveTab === '1'
                        })}
                        onClick={() => { toggle('1'); }}
                    >
                          <h5><strong>Student Attendance List </strong></h5>
                    </NavLink>
                </NavItem> 
                <NavItem>
                    <NavLink
                        className={classnames({
                            active:
                                currentActiveTab === '2'
                        })}
                        onClick={() => { toggle('2'); }}
                    >
                         <h5><strong>Staff Attendance List </strong></h5>
                    </NavLink>
                </NavItem> 
               
            </Nav>
            </CardBody>
        
            <TabContent activeTab={currentActiveTab}>
               <TabPane tabId="1">
                    <Row>
                        <Col sm="12">
                            <StudentAttandList/>
                        </Col>
                    </Row>
                </TabPane> 
               <TabPane tabId="2">
                    <Row>
                        <Col sm="12">
                            <StaffAttendList/>
                        </Col>
                    </Row>
                </TabPane> 
            </TabContent>
            </Card>
        </div >
    );
}
  
export default DashAttendTab;