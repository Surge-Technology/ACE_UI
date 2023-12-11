import React,{useState,useEffect}  from 'react'
import { Col,Badge, Label,Card,CardBody, Row,Input,Button,Spinner } from "reactstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
const StudentAttandinitialData= {StudentAttandList:[],totalPages:"",currentPage:"",loader:false,startDate:'',endDate:""}
import Axios from "../../../hoc/axiosConfig";
import Swal from 'sweetalert2';
import DatePicker from "react-datepicker";
import moment from 'moment/moment';
import { useNavigate } from "react-router-dom";
export default function StudentAttandList() {
  const [studentData, setState] = useState(StudentAttandinitialData);
  const {StudentAttandList,totalPages,currentPage,loader,startDate,endDate} =  studentData;
  const navigate = useNavigate();
  useEffect(()=>{
    var someDate = new Date();
    let StartDat = moment(someDate).format("YYYY-MM-DD");
      let endDat = moment(someDate).format("YYYY-MM-DD");
      Axios.get(`/student-attendance/${StartDat}/${endDat}`).then((res)=>{
       setState((prevState)=>({
          ...prevState, 
          startDate:someDate,
          endDate:someDate,
          StudentAttandList:res.data,loader:false
        }))
      }).catch(err=>{
        Swal.fire( err.response.data.message, 'Please try again '  ) 
        setState((prevState)=>({...prevState,loader:false}))
      })
  },[])
  const dateHandleChange=(name,date)=>{
    if(name==="startDate"){
      setState((prevState)=>({
        ...prevState,
        startDate:date
      }))
    }
    if(name==="endDate"){
      setState((prevState)=>({
        ...prevState,
        endDate:date
      }))
    }
  }
  const studentattendGetData=()=>{
     if(startDate!=="" && endDate !== ""){
      setState((prevState)=>({...prevState,loader:true}))
      let StartDat = moment(startDate).format("YYYY-MM-DD");
      let endDat = moment(endDate).format("YYYY-MM-DD");
      Axios.get(`/student-attendance/${StartDat}/${endDat}`).then((res)=>{
       setState((prevState)=>({
          ...prevState, 
          StudentAttandList:res.data,loader:false
        }))
      }).catch(err=>{
        Swal.fire( err.response.data.message, 'Please try again '  ) 
        setState((prevState)=>({...prevState,loader:false}))
      })
    }else{
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Please Enter Some Date',
        showConfirmButton: false,
        timer: 1500
      })
    }
  } 
  const absentCount = (cell, row) => {
    let date1 = new Date(startDate);  
    let date2 = new Date(endDate);   
    let time_difference = date2.getTime() - date1.getTime();  
    let days_difference = time_difference / (1000 * 60 * 60 * 24);
    let totalcont = days_difference+1
    let absent = totalcont-row.attendanceCount
    let finalData = absent.toFixed(0)
      return(<>{finalData?finalData:null}</>)
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
            <h4><b>Student Attendance List</b></h4>
            <div className='height15'></div>
          <Row>
            <Col md={3}>
            <Label>Start Date</Label>
              <DatePicker
                name="startDate"
                selected={startDate?new Date(startDate):null}
                onChange={(date) => dateHandleChange("startDate",date)}
                placeholderText="mm/dd/yyyy"
              />
            </Col>
            <Col md={3}>
              <Label>End Date</Label>
              <DatePicker
                selected={endDate}
                onChange={(date) => dateHandleChange("endDate",date)}
                placeholderText="mm/dd/yyyy"
                minDate={startDate} 
              />
            </Col>
            <Col md={2} style={{marginTop:"30px"}}> 
              <Button type="button" onClick={()=>{studentattendGetData()}}>Search</Button>
            </Col>
            <Col md={2} style={{marginTop:"30px"}}>
              <Button type="button" onClick={() => navigate("/dashboard")} >Back</Button>
            </Col>
          </Row>
          <hr/>
          <Row>
            <Col>
            <BootstrapTable data={StudentAttandList} hover multiColumnSearch={true} version='4' search>
              <TableHeaderColumn width="140" dataField='name'  dataSort isKey>Name</TableHeaderColumn>
              <TableHeaderColumn width="180" dataField='masterName' dataSort>Master Name</TableHeaderColumn>
              <TableHeaderColumn width="120" dataField='program'  dataSort>Program</TableHeaderColumn>
              <TableHeaderColumn width="100" dataAlign='center' dataField="attendanceCount" dataSort>Attn.Count</TableHeaderColumn>
              <TableHeaderColumn width="100" dataAlign='center' dataField='endTime'  dataFormat={absentCount}  dataSort>Absent Count</TableHeaderColumn>
            </BootstrapTable>
            </Col>
          </Row>
        </CardBody> 
    </>
  )
}
