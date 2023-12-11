import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Col, Card, CardBody, CardFooter, Row, Button,Spinner } from "reactstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import './emailtemplate.css';
import Axios from "../../../hoc/axiosConfig";
import TablePagination from '../../../hoc/pagination';
import Swal from 'sweetalert2';
import moment from 'moment';
import axios from 'axios';
const allemailtemplates = () => {
  const allemailtemplatesInitialData = { allemailtemplatesList: [], totalPages: "", currentPage: "", loader: false ,
  permissions:{canCreate: true, canView: true, canUpdate: true, canDelete: true}}
  const [initialData, setState] = useState(allemailtemplatesInitialData);
  const { allemailtemplatesList, totalPages, currentPage, loader,permissions } = initialData
  let history = useNavigate();
  const tableList = (page) => {
    setState((prevState) => ({ ...prevState, loader: true }))
    Axios.get(`email-template?page=${page - 1}&size=10&sort=id,desc`).then((res) => {
      setState((prevState) => ({
        ...prevState,
        allemailtemplatesList: res.data.content,
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
      setState((prevState) => ({ ...prevState, loader: false, allemailtemplatesList: [], }))
    })
  }
  useEffect(() => {
    let userid=localStorage.getItem("userid");
    axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token");
    axios.get(`${process.env.REACT_APP_BASE_URL_BASE}auth/users/${userid}`)
      .then((res) => {
         let permission = res.data.roles?res.data.roles[0]["email_templates"]:null;
        setState((prevState) => ({
          ...prevState, 
          permissions:permission
        }))
      }).catch((err) => {      })
    const thead = document.getElementsByTagName("thead");
    thead[0].style.backgroundColor = localStorage.getItem('tableColor');
    thead[1]?thead[1].style.backgroundColor = localStorage.getItem('tableColor'):null;
   
    tableList("1");
  }, []);
  const onPaginationChange = (page) => {
    tableList(page);
  }
 
  const emailtemplateActionsHandle = (id) => {
    return (
      <span>
        {permissions.canUpdate?    <Link id={id} to={`/settings/createemailtemplate/${id}`}>
          <i className="fa fa-pencil" id="pencilspace" aria-hidden="true"></i>
        </Link>:null}
        {permissions.canDelete? <i className="fa fa-trash-o" aria-hidden="true" id="trashspace" onClick={() => { deleteEmail(id) }}></i>:null}
      </span>
    )
  }
  const deleteEmail = (id) => {
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
        Axios.delete(`email-template/${id}`)
          .then((response) => {
            if (response.status == 200) {
              tableList("1");
             // allEmails();
              Swal.fire('Record Deleted!', '', 'success')
            }
          }).catch((error) => { 
            Swal.fire( error.response, 'Please try again '  ) 
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
  return (
    <>
     {loader?<Spinner
      className='loaderr'
       color="primary"
      > 
      Loading...
    </Spinner>:null} 
      <Card>
        <CardBody className='cardbg' style={{backgroundColor: localStorage.getItem('cardColor')}}>
          <Row>
            <Col ><h4><strong>Email Templates </strong></h4></Col>
            <Col>
            {permissions.canCreate?  <Button color="info" style={{float:"right",backgroundColor: localStorage.getItem('btColor')}}  size="sm"  onClick={() => history("/settings/createemailtemplate/new")}>Add Email Template </Button>:null}
            </Col>
          </Row>
          <Row>
            <Col>
              <Card >
                <BootstrapTable data={allemailtemplatesList} keyField="sno" search striped hover multiColumnSearch={true} version='4'>
                  <TableHeaderColumn width="120" dataAlign='left' dataField='sno' dataFormat={indexFormat} >S No</TableHeaderColumn>
                  <TableHeaderColumn width="130" dataAlign='left' dataField='name'  >Name</TableHeaderColumn>
                  <TableHeaderColumn width="150" dataAlign='left' dataField='subject' >Subject</TableHeaderColumn>
                  <TableHeaderColumn width="140" dataAlign='left' dataField='createdBy' dataSort>Email</TableHeaderColumn>
                  <TableHeaderColumn width="140" dataAlign='left' dataField='creationDate' dataFormat={dateDisplay} dataSort>Created Date</TableHeaderColumn>
                  <TableHeaderColumn width="130" dataAlign='left' dataField="id" dataFormat={(id) => emailtemplateActionsHandle(id)} >Action</TableHeaderColumn>
                </BootstrapTable>
                <CardFooter>
                  {allemailtemplatesList.length >= 1 ? <TablePagination totalPages={totalPages} currentPage={currentPage} callbackfunc={onPaginationChange} defaultPageSize={"10"}></TablePagination> : null}
                </CardFooter>
              </Card>
            </Col>
          </Row>
          <Row>
          </Row>
        </CardBody>
      </Card>
    </>
  )
}
export default allemailtemplates
