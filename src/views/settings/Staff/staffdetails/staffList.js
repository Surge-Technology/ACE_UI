import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Col, Card, CardBody, CardFooter, Row, Button ,Spinner} from "reactstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import axios from 'axios';
import TablePagination from '../../../../hoc/pagination';
import Swal from 'sweetalert2';
const StaffList = () => {
  const usersInitialData = { allusersList: [], totalPages: "", currentPage: "", loader: false ,
  permissions:{canCreate: true, canView: true, canUpdate: true, canDelete: true}}
  const [initialData, setState] = useState(usersInitialData);
  const { allusersList, totalPages, currentPage, loader,permissions } = initialData
  let history = useNavigate();
  const tableList = (page) => {
    setState((prevState) => ({ ...prevState, loader: true }))
    axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token");
    axios.get(`${process.env.REACT_APP_BASE_URL_BASE}users/pagination?page=${page - 1}&size=10&sort=id,desc`).then((res) => {
       console.log("res",res)
      setState((prevState) => ({
        ...prevState,
        allusersList: res.data.content,
        totalPages: res.data.totalElements,
        currentPage: res.data.pageNumber + 1,
        loader: false
      }))
      if (res.status == 401) {
        Swal.fire({ title: "error", icon: "error", text: "Session Expired" });
        // navigate('/login');
        const additionalValue = localStorage.getItem("accode");
        const url = additionalValue ? `/login/${additionalValue}` : '/login';
        navigate(url);
      
      }
    }).catch(err => {
      Swal.fire( err.response.data.message, 'Please try again '  ) 
      setState((prevState) => ({ ...prevState, loader: false, studentList: [], }))
    })
  }
  useEffect(() => {
    let userid=localStorage.getItem("userid");
    axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token");
    axios.get(`${process.env.REACT_APP_BASE_URL_BASE}auth/users/${userid}`)
      .then((res) => {
         let permission = res.data.roles?res.data.roles[0]["users"]:null;
        setState((prevState) => ({
          ...prevState, 
          permissions:permission
        }))
      }).catch((err) => {      })
    tableList("1");
  }, []);
  const onPaginationChange = (page) => {
    tableList(page);
  }
 
  const staffActionsHandle = (id) => {
    return (
      <span>
       {permissions.canUpdate?   <Link id={id} to={`/staff/createstaff/${id}`}>
          <i className="fa fa-pencil" id="pencilspace" aria-hidden="true"  ></i>
        </Link>:null}
      </span>
    )
  }
  const indexFormat = (cell, row, enumObject, index) => {
    return (<>{index + 1}</>);
  }
  const userTypeFetch = (cell, row) => {
     return (<>{row.roles?row.roles[0].roleName:null}</>);
  }
  const employmentTypeFetch = (cell, row) => {
    return (<>{row.employmentType?row.employmentType.name:null}</>);
  }
  const displayFullName = (cell, row) => {
    return (<span>{row ? `${row.firstName} ${row.lastName}` : null}</span>);
  }
  return (
    <>
     {loader?<Spinner
      className='loaderr'
       color="primary"
      > 
      Loading...
    </Spinner>:null} 
      
        <CardBody className='cardbg'>
          <Row>
            <Col ><h4><strong>Users List </strong></h4></Col>
            <Col>
            {permissions.canCreate?   <Button outline color="info" size="sm" className='buttonfloat' onClick={() => history("/staff/createstaff/new")}>Add User </Button>:null}
            </Col>
          </Row>
          <Row>
            <Col>
              <Card >
                <BootstrapTable data={allusersList} keyField="sno" search striped hover multiColumnSearch={true} version='4'>
                  <TableHeaderColumn width="00" dataAlign='left' dataField='sno' dataFormat={indexFormat} dataSort>S No</TableHeaderColumn>
                  <TableHeaderColumn width="160" dataAlign='left' dataField='name' dataFormat={displayFullName} >Name</TableHeaderColumn>
                 <TableHeaderColumn width="160" dataAlign='left' dataField='email' dataSort>Email</TableHeaderColumn>
                 <TableHeaderColumn width="100" dataAlign='left' dataField='phone' >Phone</TableHeaderColumn>
                  <TableHeaderColumn width="100" dataAlign='left' dataField='user' dataSort dataFormat={userTypeFetch}>User Type</TableHeaderColumn>
                  <TableHeaderColumn width="100" dataAlign='left' dataField='employment' dataSort dataFormat={employmentTypeFetch}>Employment Type</TableHeaderColumn>
                  <TableHeaderColumn width="80" dataAlign='left' dataField='pin' dataSort  >Pin</TableHeaderColumn>
                  <TableHeaderColumn width="80" dataAlign='left' dataField="id" dataFormat={(id) => staffActionsHandle(id)} >Action</TableHeaderColumn>
                </BootstrapTable>
                <CardFooter>
                  {allusersList.length >= 1 ? <TablePagination totalPages={totalPages} currentPage={currentPage} callbackfunc={onPaginationChange} defaultPageSize={"10"}></TablePagination> : null}
                </CardFooter>
              </Card>
            </Col>
          </Row>
          <Row>
          </Row>
        </CardBody>
       
    </>
  )
}
export default StaffList;
