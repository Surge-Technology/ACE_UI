import React,{useState,useEffect}  from 'react'
import { useNavigate } from "react-router-dom";
import { Col, Card,CardBody,CardFooter, Row,Button,Spinner } from "reactstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import Axios from "../../../hoc/axiosConfig"
import moment from 'moment/moment';
import TablePagination from '../../../hoc/pagination';
import Swal from 'sweetalert2';
import axios from 'axios';
const certificationsinitialData= {certificationsList:[],totalPages:"",currentPage:"",loader:false,
permissions:{canCreate: true, canView: true, canUpdate: true, canDelete: true}}

export default function certificationsList() {
  const [certificationsinitial, setState] = useState(certificationsinitialData);
  const {certificationsList,totalPages,currentPage,loader,permissions} =  certificationsinitial;
  const navigate = useNavigate();
   const tableList = (page)=>{
    setState((prevState)=>({...prevState,loader:true}))
    Axios.get(`certificate?page=${page-1}&size=10&sort=id,desc`).then((res)=>{
        setState((prevState)=>({
        ...prevState,
        certificationsList:res.data.content,
        totalPages:res.data.totalElements,
        currentPage:res.data.pageNumber+1,
        loader:false
      })) 
      }).catch(err=>{
        Swal.fire( err.response.data.message, 'Please try again '  ) 
        setState((prevState)=>({...prevState,loader:false,certificationsList:[],}))
      })
  }
  useEffect(() => {
    let userid=localStorage.getItem("userid");
    axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token");
    axios.get(`${process.env.REACT_APP_BASE_URL_BASE}auth/users/${userid}`)
      .then((res) => {
         let permission = res.data.roles?res.data.roles[0]["certificates"]:null;
        setState((prevState) => ({
          ...prevState, 
          permissions:permission
        }))
      }).catch((err) => {      })
    tableList("1");
   }, []);
   const displayBeltNameHandle=(cell,row)=>{
    return (<span>{row.level?`${row.level.name}`:null}</span>)
   }
   const displayDate = (date)=>{
    return(<>{moment(date).format("MM/DD/YYYY")}</>)
  }
  const onPaginationChange=(page)=>{
    tableList(page);
   }
  const certificateDeleteHandle=(id)=>{
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
        axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token");
        axios.delete(`${process.env.REACT_APP_BASE_URL}/certificate/${id}`).then((res) => {
            if (res.status == 204) {
              tableList("1");
              Swal.fire('Record Deleted!', '', 'success')
            }
          }).catch((err) => { 
            Swal.fire( err.response.data.message, 'Please try again '  ) 
        })
      }
    })
  }
  const certificateActionsHandle=(cell,row)=>{
    return (
      <>
        <span>      
        {permissions.canUpdate?  <i className="fa fa-pencil" id="pencilspace" aria-hidden="true" onClick={()=> navigate(`/certifications/createcertification/${row.id}`)} style={{ cursor: 'pointer', fontSize: "15px", color: "green" }}></i>     :null}
        {permissions.canDelete?      <i className="fa fa-trash-o" aria-hidden="true" onClick={()=>  certificateDeleteHandle(row.id)} style={{ cursor: 'pointer', fontSize: "15px", color: "red" }}  ></i> :null}
        </span>
      </>
    )
  }
  return (
    <>{loader?<Spinner
      className='loaderr'
       color="primary"
      > 
      Loading...
    </Spinner>:null}
    <Card>
      <CardBody className='cardbg'>
      <Row>
        <Col ><h4><strong>Certifications </strong></h4></Col>
        <Col>
             {permissions.canCreate? <Button color="primary" size="sm" style={{float:"right"}} onClick={()=> navigate("/certifications/createcertification/new")}>Create</Button>:null}
        </Col>      
     </Row>
     <div className='height15'></div>
     <Row>
        <Col>
        <Card >
           <BootstrapTable data={certificationsList} hover multiColumnSearch={true} version='4' search>
                <TableHeaderColumn width="100" dataField='level' dataFormat={displayBeltNameHandle} dataSort isKey>Belt Name</TableHeaderColumn>
                <TableHeaderColumn width="100" dataField='name'  dataSort  >Name</TableHeaderColumn>
                <TableHeaderColumn width="200" dataField='templateBody' dataSort>Certificate Body</TableHeaderColumn>
                <TableHeaderColumn width="120" dataField='creationDate'  dataFormat={displayDate}  dataSort>Registered Date</TableHeaderColumn>
                <TableHeaderColumn width="60"  dataField="id" dataAlign='center' dataFormat={certificateActionsHandle}>Action</TableHeaderColumn>
            </BootstrapTable>
            <CardFooter> 
            {certificationsList.length>=1?<TablePagination totalPages={totalPages} currentPage={currentPage} callbackfunc={onPaginationChange} defaultPageSize={"10"}></TablePagination>:null}
            </CardFooter>
            </Card>
         </Col>
      </Row>
     </CardBody>
     </Card>
    </>
  )
}
