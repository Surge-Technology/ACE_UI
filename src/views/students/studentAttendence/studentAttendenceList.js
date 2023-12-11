import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Col, Card, CardBody, CardFooter, Row, Button ,Spinner} from "reactstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import Axios from "../../../hoc/axiosConfig";
import TablePagination from '../../../hoc/pagination';
import Swal from 'sweetalert2';
import moment from 'moment';
import "./studentAttendence.css";
import axios from 'axios';
const allAttendenceLists = () => {
  const allAttendenceListsInitialData = { allAttendenceLists: [], totalPages: "", currentPage: "", loader: false ,
  permissions:{canCreate: true, canView: true, canUpdate: true, canDelete: true}}
  const [initialData, setState] = useState(allAttendenceListsInitialData);
  const { allAttendenceLists, totalPages, currentPage, loader,permissions} = initialData
  let history = useNavigate();
  const tableList = (page) => {
    setState((prevState) => ({ ...prevState, loader: true }))
    Axios.get(`/student-attendances?page=${page - 1}&size=10&sort=id,desc`).then((res) => {
      setState((prevState) => ({
        ...prevState,
        allAttendenceLists: res.data.content,
        totalPages: res.data.totalElements,
        currentPage: res.data.pageNumber + 1,
        loader: false
      }))
      if (res.status == 401) {
        Swal.fire({ title: "error", icon: "error", text: "Session Expired" })
        // navigate('/login')
        const additionalValue = localStorage.getItem("accode");
        const url = additionalValue ? `/login/${additionalValue}` : '/login';
        navigate(url);
      
      }
    }).catch(err => {
      Swal.fire(err.response.data.message,'Please try again later');
      setState((prevState) => ({ ...prevState, loader: false, allAttendenceLists: [], }))
    })
  }
  useEffect(() => {
    let userid=localStorage.getItem("userid");
    axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token");
    axios.get(`${process.env.REACT_APP_BASE_URL_BASE}auth/users/${userid}`)
      .then((res) => {
         let permission = res.data.roles?res.data.roles[0]["student_attendences"]:null;
        setState((prevState) => ({
          ...prevState, 
          permissions:permission
        }))
      }).catch((err) => {  })
    tableList("1");
  }, []);
  const onPaginationChange = (page) => {
    tableList(page);
  } 
  const indexFormat = (cell, row, enumObject, index) => {
    return (<>{index + 1}</>);
  }
  const dateDisplay = (cell, row) => {
    return cell !== null && cell !== undefined ? moment(cell).format("MM/DD/YYYY") : "";
  }
  const timeDisplay = (cell, row) => {
    return cell !== null && cell !== undefined ? moment(cell, ["HH:mm"]).format("hh:mm a") : "";;
  }
  return (
    <>
     {loader?<Spinner
      className='loaderr'
       color="primary"
      > 
      Loading...
    </Spinner>:null} 
      <Card>
        <CardBody className='cardbg'>
          <Row>
            <Col ><h4><strong>Student Attendence List </strong></h4></Col>
            <Col>
            {permissions.canCreate?   <Button outline color="info" size="sm" className='buttonfloat' onClick={() => history("/studentattendence/new")}>Add Attendence</Button>:null}
            </Col>
          </Row>
          <Row>
            <Card>
              <BootstrapTable data={allAttendenceLists} keyField="sno" search striped hover multiColumnSearch={true} version='4'>
                <TableHeaderColumn width="80" dataAlign='left' dataField='sno' dataFormat={indexFormat} dataSort>S No</TableHeaderColumn>
                <TableHeaderColumn width="160" dataAlign='left' dataField='name' dataSort>Student</TableHeaderColumn>
                <TableHeaderColumn width="140" dataAlign='left' dataField='masterName' dataSort>Master</TableHeaderColumn>
                <TableHeaderColumn width="100" dataAlign='left' dataField='batch' dataSort>Batch</TableHeaderColumn>
                <TableHeaderColumn width="100" dataAlign='left' dataField='studentAttendanceDate' dataFormat={dateDisplay} dataSort>Date</TableHeaderColumn>
                <TableHeaderColumn width="100" dataAlign='left' dataField='studentAttendanceTime' dataSort dataFormat={timeDisplay} >In-Time</TableHeaderColumn>
              </BootstrapTable>
              <CardFooter>
                {allAttendenceLists.length >= 1 ? <TablePagination totalPages={totalPages} currentPage={currentPage} callbackfunc={onPaginationChange} defaultPageSize={"10"}></TablePagination> : null}
              </CardFooter>
            </Card>
          </Row>
        </CardBody>
      </Card>
    </>
  )
}
export default allAttendenceLists;