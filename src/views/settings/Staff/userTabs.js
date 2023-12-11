import React, { useEffect, useState } from 'react'
//import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, CardBody,TabContent, TabPane, Nav, NavItem, NavLink, Row, Col} from 'reactstrap';
import classnames from 'classnames';
import PermissionsList from './permissions/permissionsList';
import StaffList from './staffdetails/staffList';
import { useParams } from 'react-router-dom';
import axios from 'axios';
const usertabInitialData= {usersPermissions:{canCreate: true, canView: true, canUpdate: true, canDelete: true},
permPermissions:{canCreate: true, canView: true, canUpdate: true, canDelete: true}}
function userTabs() {
    const [currentActiveTab, setCurrentActiveTab] = useState('1');
    const [initialData,setState] = useState(usertabInitialData);
    const {usersPermissions,permPermissions} = initialData
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
             let userspermission = res.data.roles?res.data.roles[0]["users"]:null;
              let permissions = res.data.roles?res.data.roles[0]["permissions"]:null;
            setState((prevState) => ({
              ...prevState, 
              usersPermissions:userspermission,permPermissions:permissions
            }))
          }).catch((err) => {  })
      },[])
    return (
        <div  >
        <Card>
            <CardBody className='cardbg'>
            <Nav tabs>
              {permPermissions.canView?   <NavItem>
                    <NavLink
                        className={classnames({
                            active:
                                currentActiveTab === '1'
                        })}
                        onClick={() => { toggle('1'); }}
                    >
                         <h5><strong>Permissions </strong></h5>
                    </NavLink>
                </NavItem>:null}
                {usersPermissions.canView?    <NavItem>
                    <NavLink
                        className={classnames({
                            active:
                                currentActiveTab === '2'
                        })}
                        onClick={() => { toggle('2'); }}
                    >
                          <h5><strong>Users </strong></h5>
                    </NavLink>
                </NavItem>:null}
            </Nav>
            </CardBody>
        
            <TabContent activeTab={currentActiveTab}>
            {permPermissions.canView?  <TabPane tabId="1">
                    <Row>
                        <Col sm="12">
                            <PermissionsList/>
                        </Col>
                    </Row>
                </TabPane>:null}
            {usersPermissions.canView?  <TabPane tabId="2">
                    <Row>
                        <Col sm="12">
                        <StaffList/>
                        </Col>
                    </Row>
                </TabPane>:null}          
            </TabContent>
            </Card>
        </div >
    );
}
  
export default userTabs;