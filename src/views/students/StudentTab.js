 
import React, { useEffect, useState } from 'react'
//import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, CardBody,TabContent, TabPane, Nav, NavItem, NavLink, Row, Col} from 'reactstrap';
import classnames from 'classnames';
import { useParams } from 'react-router-dom';
import InquiryList from './inquiry/InquiryList';
import StudentList from './studentList';
import axios from 'axios';
const studentInitialData= {studPermissions:{canCreate: true, canView: true, canUpdate: true, canDelete: true},
inquPermissions:{canCreate: true, canView: true, canUpdate: true, canDelete: true}}
function StudentTab() {
    const [currentActiveTab, setCurrentActiveTab] = useState('1');
    const [initialData,setState] = useState(studentInitialData);
    const {studPermissions,inquPermissions} = initialData
    const params = useParams();
      const toggle = tab => {
        if (currentActiveTab !== tab) setCurrentActiveTab(tab);
    }
  useEffect(()=>{
    toggle(params.id);
    let userid=localStorage.getItem("userid");
    axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token");
    axios.get(`${process.env.REACT_APP_BASE_URL_BASE}auth/users/${userid}`)
      .then((res) => {
         let studpermission = res.data.roles?res.data.roles[0]["students"]:null;
          let inqpermission = res.data.roles?res.data.roles[0]["inquiries"]:null;
        setState((prevState) => ({
          ...prevState, 
          studPermissions:studpermission,inquPermissions:inqpermission
        }))
      }).catch((err) => { })
  },[])
    return (
        <div  >
        <Card>
            <CardBody className='cardbg' style={{backgroundColor: localStorage.getItem('cardColor')}}>
            <Nav tabs style={{cursor:"pointer"}}>
                 {inquPermissions.canView?     <NavItem>
                    <NavLink
                        className={classnames({
                            active:
                                currentActiveTab === '1'
                        })}
                        onClick={() => { toggle('1'); }}
                    >
                     <h5><strong>Inquiry</strong></h5>   
                    </NavLink>
                </NavItem>:null}
                {studPermissions.canView?   <NavItem>
                    <NavLink
                        className={classnames({
                            active:
                                currentActiveTab === '2'
                        })}
                        onClick={() => { toggle('2'); }}
                    >
                       <h5><strong>Students </strong></h5>
                    </NavLink>
                </NavItem>:null}
            </Nav>
            </CardBody>
        
            <TabContent activeTab={currentActiveTab}>
                 {inquPermissions.canView?     <TabPane tabId="1">
                    <Row>
                        <Col sm="12">
                             <InquiryList/>
                        </Col>
                    </Row>
                </TabPane>:null}
                {studPermissions.canView?<TabPane tabId="2">
                    <Row>
                        <Col sm="12">
                        <StudentList/>
                        </Col>
                    </Row>
                </TabPane>:null}
            </TabContent>
            </Card>
        </div >
    );
}
  
export default StudentTab;