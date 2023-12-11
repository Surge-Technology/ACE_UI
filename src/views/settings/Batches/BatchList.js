import React, { useState, useEffect } from 'react';
import { useNavigate ,Link} from "react-router-dom";
import { Col, Card, CardBody, CardFooter, Row, Button,Spinner } from "reactstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import Axios from "../../../hoc/axiosConfig";
import TablePagination from '../../../hoc/pagination';
import Swal from 'sweetalert2';
import moment from 'moment';
import axios from 'axios';
const BatchList = () => {
  const allbatchsInitialData = { allbatchs: [], totalPages: "", currentPage: "", loader: false ,
  permissions:{canCreate: true, canView: true, canUpdate: true, canDelete: true}}
  const [initialData, setState] = useState(allbatchsInitialData);
  const { allbatchs, totalPages, currentPage, loader ,permissions} = initialData
  let history = useNavigate();
  const tableList = (page) => {
    setState((prevState) => ({ ...prevState, loader: true }))
    Axios.get(`batches?page=${page - 1}&size=10&sort=id,desc`).then((res) => {
      setState((prevState) => ({
        ...prevState,
        allbatchs: res.data.content,
        totalPages: res.data.totalElements,
        currentPage: res.data.pageNumber + 1,
        loader: false
      }))
      if (res.status == 401) {
        Swal.fire({ title: "error", icon: "error", text: "Session Expired" })
        //navigate('/login')
        const additionalValue = localStorage.getItem("accode");
        const url = additionalValue ? `/login/${additionalValue}` : '/login';
        navigate(url);
      
      }
    }).catch(err => {
      Swal.fire( err.response.data.message, 'Please try again '  ) 
      setState((prevState) => ({ ...prevState, loader: false, allbatchs: [], }))
    })
  }
  useEffect(() => {
    let userid=localStorage.getItem("userid");
    axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token");
    axios.get(`${process.env.REACT_APP_BASE_URL_BASE}auth/users/${userid}`)
      .then((res) => {
        let permission = res.data.roles?res.data.roles[0]["batches"]:null;
        setState((prevState) => ({
          ...prevState, 
          permissions:permission
        }))
      }).catch((err) => {})
    tableList("1");
  }, []);
  const onPaginationChange = (page) => {
    tableList(page);
  }
  const batchActionsHandle = (id) => {
    return (
      <span>
       {permissions.canDelete?   <i className="fa fa-trash-o" aria-hidden="true" id="trashspace" onClick={() => { deleteBatch(id) }}></i>:null}
      </span>
    )
  }
  const deleteBatch = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token");
        axios.delete(`${process.env.REACT_APP_BASE_URL}/batches/${id}`).then((res) => {
            if (res.status == 204) {
              tableList("1");
              Swal.fire('Record Deleted!', '', 'success')
            }
          }).catch((err) => { 
            Swal.fire( err.response.data.message, 'Please try again '  ) 
           })
      }
      else {
        Swal.fire('Your Data safe', '');
      }
    })
  }
  const indexFormat = (cell, row, enumObject, index) => {
    return (<>{index + 1}</>)
  }
  const dateDisplay = (cell, row) => {
    return cell !== null && cell !== undefined ? moment(cell).format("MM/DD/YYYY") : "";
  }
  const timeDisplay = (cell, row) => {
    return cell !== null && cell !== undefined ? moment(cell, ["HH:mm"]).format("hh:mm a") : "";
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
            <Col ><h4><strong>Batches</strong></h4></Col>
            <Col>
            {permissions.canCreate? <Button outline color="info" size="sm" className='buttonfloat' onClick={() => history("/settings/createbatch/new")}>Add Batch</Button>:null}
            </Col>
          </Row>
          <Row>
            <Col>
              <Card >
                <BootstrapTable data={allbatchs} keyField="sno" search striped hover multiColumnSearch={true} version='4'>
                  <TableHeaderColumn width="120" dataAlign='left' dataField='sno' dataFormat={indexFormat} dataSort>S No</TableHeaderColumn>
                  <TableHeaderColumn width="130" dataAlign='left' dataField='name' dataSort>Name</TableHeaderColumn>
                  <TableHeaderColumn width="130" dataAlign='left' dataField='startDate' dataFormat={dateDisplay} dataSort>Start Date</TableHeaderColumn>
                  <TableHeaderColumn width="130" dataAlign='left' dataField='endDate' dataFormat={dateDisplay} dataSort>End Date</TableHeaderColumn>
                  <TableHeaderColumn width="130" dataAlign='left' dataField='startTime' dataSort dataFormat={timeDisplay}>Start Time</TableHeaderColumn>
                  <TableHeaderColumn width="130" dataAlign='left' dataField='endTime' dataSort dataFormat={timeDisplay}>End Time</TableHeaderColumn>
                  <TableHeaderColumn width="120" dataAlign='left' dataField="id" dataFormat={(id) => batchActionsHandle(id)} >Action</TableHeaderColumn>
                </BootstrapTable>
                <CardFooter>
                  {allbatchs.length >= 1 ? <TablePagination totalPages={totalPages} currentPage={currentPage} callbackfunc={onPaginationChange} defaultPageSize={"10"}></TablePagination> : null}
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  )
}
export default BatchList;