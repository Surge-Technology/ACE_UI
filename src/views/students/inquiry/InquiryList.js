 
import React,{useState,useEffect}  from 'react'
import { useNavigate } from "react-router-dom";
import { Col, Card,CardBody,CardFooter, Row,Button,Spinner } from "reactstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import Axios from "../../../hoc/axiosConfig"
import moment from 'moment/moment';
import TablePagination from '../../../hoc/pagination';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
const studentInitialData= {inquiryList:[],totalPages:"",currentPage:"",loader:false,permissions:{canCreate: true, canView: true, canUpdate: true, canDelete: true},
studPermissions:{canCreate: true, canView: true, canUpdate: true, canDelete: true}}
export default function InquiryList(props) {
   const [initialData,setState] = useState(studentInitialData);
  const {inquiryList,totalPages,currentPage,loader,permissions,studPermissions} = initialData
const history = useNavigate();
const tableList = (page)=>{
  setState((prevState)=>({...prevState,loader:true}))
  Axios.get(`inquiry/inquiries?page=${page-1}&size=10&sort=id,desc`).then((res)=>{
      setState((prevState)=>({
      ...prevState,
      inquiryList:res.data.content,
      totalPages:res.data.totalElements,
      currentPage:res.data.pageNumber+1,
      loader:false
    })) 
     }).catch(err=>{
      Swal.fire(err.response.data.message,'Please try again later');
      setState((prevState)=>({...prevState,loader:false,inquiryList:[],}))
    })
}
 
const deleteInquiryHandle=(id)=>{
  Swal.fire({
    title: 'Are you sure?',
    text: "Are you sure you want delete?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      Axios.delete(`inquiry/${id}`).then((res)=>{
          tableList("1");
              Swal.fire({
                  position: 'center',
                  icon: 'success',
                  title: 'Record deleted successfully',
                  showConfirmButton: false,
                  timer: 1500
                })
          }).catch((err) => { 
          Swal.fire( err.response.data.message, 'Please try again '  ) 
      })
    }
  })
}
  useEffect(() => {
    let userid=localStorage.getItem("userid");
    axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token");
    axios.get(`${process.env.REACT_APP_BASE_URL_BASE}auth/users/${userid}`)
      .then((res) => {
        let permission = res.data.roles?res.data.roles[0]["inquiries"]:null;
        console.log(res,permission);
        let studpermission = res.data.roles?res.data.roles[0]["students"]:null;
        setState((prevState) => ({
          ...prevState, 
          permissions:permission,studPermissions:studpermission
        }))
      }).catch((err) => {      })
    const thead = document.getElementsByTagName("thead");
    thead[0].style.backgroundColor = localStorage.getItem('tableColor');
    thead[1]?thead[1].style.backgroundColor = localStorage.getItem('tableColor'):null;
    thead[2]?thead[2].style.backgroundColor = localStorage.getItem('tableColor'):null;
   tableList("1");
  }, []);
  const studentsActionsHandle=(cell,row)=>{ 
     return (
      <>
        <span>      
        {permissions.canUpdate?    <i className="fa fa-pencil" title='Edit' id="pencilspace" aria-hidden="true" onClick={()=> history(`/studentTabs/CreateInquiry/${row.id}`)} style={{ cursor: 'pointer', fontSize: "15px", color: "green" }}></i>     :null}
       {permissions.canDelete?   <i className="fa fa-trash-o" title='Delete' aria-hidden="true" id="trashspace" onClick={()=>{deleteInquiryHandle(row.id)}} style={{ cursor: 'pointer', fontSize: "15px",padding:"0px 10px 0px 0px", color: "red" }}></i> :null}
       {studPermissions.canCreate? row.inquiryStatus?row.inquiryStatus.name==="Register"?  <i className="fa fa-user" title='Redirect To Add Student' id="pencilspace" aria-hidden="true" onClick={()=> history(`/studentTabs/students/create`)} style={{ cursor: 'pointer', fontSize: "15px", color: "green" }}></i> :null :null :null}
        </span>
      </>
    )
  }
  
 const onPaginationChange=(page)=>{
    tableList(page);
   }
 
 const displayFullName = (cell, row) => {
    return (<span>{row?`${row.firstName} ${row.lastName}`:null}</span>)
  }
  const displayDate = (date)=>{
    return(<>{moment(date).format("MM/DD/YYYY")}</>)
  }
  const displayinquiryServices = (cell, row) => {
    return (<span>{row.inquiryServices? row.inquiryServices.name :null}</span>)
  }
  const displayinquiryStatus = (cell, row) => {
    return (<span>{row.inquiryStatus? row.inquiryStatus.name :null}</span>)
  }
  const displayinquiryType = (cell, row) => {
    return (<span>{row.inquiryType? row.inquiryType.name :null}</span>)
  }
  return (
    <>
     <ToastContainer /> 
    {loader?<Spinner
      className='loaderr'
       color="primary"
      > 
      Loading...
    </Spinner>:null}
       <CardBody className='cardbg' style={{backgroundColor: localStorage.getItem('cardColor')}}>
      <Row>
        <Col ><h4><strong>Inquiry List</strong></h4></Col>
        <Col>
          {permissions.canCreate?<Button color="primary" size="sm" style={{float:"right",backgroundColor: localStorage.getItem('btColor')}} onClick={()=> history("/studentTabs/CreateInquiry/new")}>Add Inquiry</Button>:null}
        </Col>      
     </Row>
     <div className='height15'></div>
     <Row>
        <Col>
        <Card >
           <BootstrapTable data={inquiryList} hover multiColumnSearch={true} version='4' search>
                <TableHeaderColumn width="140" dataField='firstName' dataFormat={displayFullName} dataSort>Name</TableHeaderColumn>
                <TableHeaderColumn width="160" dataField='email' dataSort>Email</TableHeaderColumn>
                <TableHeaderColumn width="110" dataField='phone'  dataSort>Phone</TableHeaderColumn>
                <TableHeaderColumn width="110" dataField='inquiryServices' dataFormat={displayinquiryServices} dataSort> Services</TableHeaderColumn>
                <TableHeaderColumn width="110" dataField='inquiryStatus' dataFormat={displayinquiryStatus} dataSort> Status</TableHeaderColumn>
                <TableHeaderColumn width="110" dataField='inquiryType' dataFormat={displayinquiryType} dataSort> Type</TableHeaderColumn>
                <TableHeaderColumn width="120" dataField='creationDate' dataFormat={displayDate}  dataSort>Created Date</TableHeaderColumn>
                <TableHeaderColumn width="100"  dataField="id" dataAlign='center' dataFormat={studentsActionsHandle} isKey>Action</TableHeaderColumn>
            </BootstrapTable>
            <CardFooter> 
            {inquiryList.length>=1?<TablePagination totalPages={totalPages} currentPage={currentPage} callbackfunc={onPaginationChange} defaultPageSize={"10"}></TablePagination>:null}
            </CardFooter>
            </Card>
         </Col>
      </Row>
     </CardBody> 
    </>
  )
}
