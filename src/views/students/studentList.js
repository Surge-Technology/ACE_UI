
import React,{useState,useEffect}  from 'react'
import { useNavigate } from "react-router-dom";
import { Col, Card,CardBody,CardFooter, Row,Button,Spinner } from "reactstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import Axios from "../../hoc/axiosConfig"
import moment from 'moment/moment';
import TablePagination from '../../hoc/pagination';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
const studentInitialData= {studentList:[],totalPages:"",currentPage:"",loader:false,permissions:{canCreate: true, canView: true, canUpdate: true, canDelete: true}}
export default function StudentList(props) {
   const [initialData,setState] = useState(studentInitialData);
  const {studentList,totalPages,currentPage,loader,permissions} = initialData
const history = useNavigate();
const tableList = (page)=>{
  setState((prevState)=>({...prevState,loader:true}))
  Axios.get(`students?page=${page-1}&size=10&sort=id,desc`).then((res)=>{
     let stList = res.data.content?res.data.content:[];
     setState((prevState)=>({
      ...prevState,
      studentList:stList,
      totalPages:res.data.totalElements,
      currentPage:res.data.pageNumber+1,
      loader:false
    })) 
     }).catch(err=>{
      Swal.fire(err.response.data.message,'Please try again later');
      setState((prevState)=>({...prevState,loader:false,studentList:[],}))
    })
}
  useEffect(() => {
    let userid=localStorage.getItem("userid");
    axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token");
    axios.get(`${process.env.REACT_APP_BASE_URL_BASE}auth/users/${userid}`)
      .then((res) => {
         let permission = res.data.roles?res.data.roles[0]["students"]:null;
        setState((prevState) => ({
          ...prevState, 
          permissions:permission
        }))
      }).catch((err) => {   })
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
        {permissions.canUpdate?  <i className="fa fa-pencil" id="pencilspace" aria-hidden="true" onClick={()=> history(`/studentTabs/students/edit/${row.id}`)} style={{ cursor: 'pointer', fontSize: "15px", color: "green" }}></i>:null}
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
        <Col ><h4><strong>Students List</strong></h4></Col>
        <Col>
        {permissions.canCreate?<Button color="primary" size="sm" style={{float:"right",backgroundColor: localStorage.getItem('btColor')}} onClick={()=> history("/studentTabs/students/create")}>Add Student</Button>:null}
        </Col>      
     </Row>
     <div className='height15'></div>
     <Row>
        <Col>
        <Card >
           <BootstrapTable data={studentList} hover multiColumnSearch={true} version='4' search>
                <TableHeaderColumn width="140" dataField='firstName' dataFormat={displayFullName} dataSort>Student Name</TableHeaderColumn>
                <TableHeaderColumn width="180" dataField='email' dataSort>Email</TableHeaderColumn>
                <TableHeaderColumn width="120" dataField='phone'  dataSort>Phone</TableHeaderColumn>
                <TableHeaderColumn width="100" dataField='creationDate' dataFormat={displayDate}  dataSort>Registered Date</TableHeaderColumn>
                <TableHeaderColumn width="60"  dataField="id" dataAlign='center' dataFormat={studentsActionsHandle} isKey>Action</TableHeaderColumn>
            </BootstrapTable>
            <CardFooter> 
              {studentList?studentList.length>=1?<TablePagination totalPages={totalPages} currentPage={currentPage} callbackfunc={onPaginationChange} defaultPageSize={"10"}></TablePagination>:null:null}
            </CardFooter>
            </Card>
         </Col>
      </Row>
     </CardBody>
    </>
  )
}
