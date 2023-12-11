import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Col, Card, CardBody, CardFooter, Row, Button ,Spinner} from "reactstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import Swal from 'sweetalert2';
import Axios from "../../../hoc/axiosConfig";
import TablePagination from '../../../hoc/pagination';
import axios from 'axios';
const eventsList = () => {
  const eventInitialData = { eventList: [], totalPages: "", currentPage: "", loader: false,
  permissions:{canCreate: true, canView: true, canUpdate: true, canDelete: true}}
  const [initialData, setState] = useState(eventInitialData);
  const { eventList, totalPages, currentPage, loader,permissions } = initialData
  let navigate = useNavigate();
  const tableList = (page) => {
    setState((prevState) => ({ ...prevState, loader: true }))
    Axios.get(`event?page=${page - 1}&size=10&sort=id,desc`).then((res) => {
      setState((prevState) => ({
        ...prevState,
        eventList: res.data.content,
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
      Swal.fire( err.response.data.message, 'Please try again '  ) ;
      setState((prevState) => ({ ...prevState, loader: false, eventList: [], }))
    })
  }
  useEffect(() => {
    let userid=localStorage.getItem("userid");
    axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token");
    axios.get(`${process.env.REACT_APP_BASE_URL_BASE}auth/users/${userid}`)
      .then((res) => {
         let permission = res.data.roles?res.data.roles[0]["events"]:null;
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
  const eventActionsHandle = (id) => {
    return (
      <span>
      {permissions.canUpdate?   <Button color='primary' onClick={() => navigate(`/events/eventregister/${id}`)}>Register</Button>:null}
      </span>
    )
  }
  const indexFormat = (cell, row, enumObject, index) => {
    return (<>{index + 1}</>)
  }
  const typeFetch = (cell, row) => {
    return (<>{cell.name}</>)
  }
  const boolenHandleChange=(cell,row)=>{
     return (<>{cell===true?"Yes":"No"}</>)
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
            <Col ><h4><strong>Events </strong></h4></Col>
            <Col>
            {permissions.canCreate?   <Button color="primary" size="sm" className='buttonfloat' onClick={() => navigate("/events/addevent/new")}>Add Event </Button>:null}
            </Col>
          </Row>
          <Row>
            <Col>
              <Card >
                <BootstrapTable data={eventList} keyField="name" search striped hover multiColumnSearch={true} version='4'>
                  <TableHeaderColumn width="120" dataAlign='left' dataField='sno' dataFormat={indexFormat} dataSort>S No</TableHeaderColumn>
                  <TableHeaderColumn width="130" dataAlign='left' dataField='name'  >Title</TableHeaderColumn>
                  <TableHeaderColumn width="130" dataAlign='left' dataField='eventType' dataFormat={typeFetch} >Event Type</TableHeaderColumn>
                  <TableHeaderColumn width="130" dataAlign='left' dataField='registrationFee'  >Registration Fee $</TableHeaderColumn>
                  <TableHeaderColumn width="130" dataAlign='left' dataField='perDay'  >Event Fee $</TableHeaderColumn>
                  <TableHeaderColumn width="130" dataAlign='left' dataField='isAllDay' dataFormat={boolenHandleChange} >All Day</TableHeaderColumn>
                  <TableHeaderColumn width="140" dataAlign='left' dataField='isCustomRange' dataFormat={boolenHandleChange}>Custom Range</TableHeaderColumn>
                  <TableHeaderColumn width="130" dataAlign='left' dataField="id" dataFormat={(id) => eventActionsHandle(id)} >Action</TableHeaderColumn>
                </BootstrapTable>
                <CardFooter>
                  {eventList.length >= 1 ? <TablePagination totalPages={totalPages} currentPage={currentPage} callbackfunc={onPaginationChange} defaultPageSize={"10"}></TablePagination> : null}
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
export default eventsList
