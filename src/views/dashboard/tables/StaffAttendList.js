import React,{useState,useEffect}  from 'react'
import { Col,Badge, Label,Card ,CardBody, Row, Button,Spinner } from "reactstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import Axios from "../../../hoc/axiosConfig";
import Swal from 'sweetalert2';
import DatePicker from "react-datepicker";
import moment from 'moment/moment';
import { useNavigate } from "react-router-dom";
const StudentAttandinitialData= {StaffAttandList:[],totalPages:"",currentPage:"",loader:false,startDate:'',endDate:"",SummaryORhours:"summary"}
export default function StaffAttendList() {
  const [studentData, setState] = useState(StudentAttandinitialData);
  const {StaffAttandList,totalPages,currentPage,loader,startDate,endDate,SummaryORhours} =  studentData;
  const navigate = useNavigate();
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
  const summaryStudentattendGetData=()=>{
    if(startDate!=="" && endDate !== ""){
      setState((prevState)=>({...prevState,loader:true}))
      let StartDat = moment(startDate).format("YYYY-MM-DD");
      let endDat = moment(endDate).format("YYYY-MM-DD");
      Axios.get(`/staff-attendance/${StartDat}/${endDat}`).then((res)=>{
       setState((prevState)=>({
          ...prevState,
          StaffAttandList:res.data,loader:false,SummaryORhours:"summary"
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
  const hoursStudentattendGetData=()=>{
    if(startDate!=="" && endDate !== ""){
      setState((prevState)=>({...prevState,loader:true}))
      let StartDat = moment(startDate).format("YYYY-MM-DD");
      let endDat = moment(endDate).format("YYYY-MM-DD");
      Axios.get(`/staff-attendance/summary/${StartDat}/${endDat}`).then((res)=>{
        setState((prevState)=>({
          ...prevState,
          StaffAttandList:res.data,loader:false,SummaryORhours:"hours"
        }))
      }).catch(err=>{
        Swal.fire( err.response.data.message, 'Please try again '  ) 
        setState((prevState)=>({...prevState,loader:false}))
      })
    }else{
      Swal.fire("Field is required")
    }
  }
  const displayhoursHandle =(num)=>{
    return(<>{parseFloat(num).toFixed(2)}</>)
  }
  const displayDate = (date)=>{
    return(<>{moment(date).format("MM/DD/YYYY")}</>)
  }
  const timeDisplay = (cell, row) => {
    return cell !== null && cell !== undefined ? moment(cell, ["HH:mm"]).format("hh:mm a") : "";
  }
  useEffect(()=>{
    var someDate = new Date();
    let StartDat = moment(someDate).format("YYYY-MM-DD");
      let endDat = moment(someDate).format("YYYY-MM-DD");
      Axios.get(`/staff-attendance/summary/${StartDat}/${endDat}`).then((res)=>{
        setState((prevState)=>({
          ...prevState,
          startDate:someDate,  endDate:someDate,
          StaffAttandList:res.data,loader:false,SummaryORhours:"hours"
        }))
      }).catch(err=>{
        Swal.fire( err.response.data.message, 'Please try again '  ) 
        setState((prevState)=>({...prevState,loader:false}))
      })
  },[])
  return (
    <>
     {loader?<Spinner
      className='loaderr'
       color="primary"
      > 
      Loading...
      </Spinner>:null}
      <CardBody className='cardbg'>          
          <h4><b>Staff Attendance List</b></h4>
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
          <Col md={1} style={{marginTop:"30px"}}> 
            <Button type="button" onClick={()=>{hoursStudentattendGetData()}}>Hours</Button>
          </Col>
          <Col md={2} style={{marginTop:"30px"}}> 
            <Button type="button" onClick={()=>{summaryStudentattendGetData()}}>Summary</Button>
          </Col>
          <Col md={1} style={{marginTop:"30px"}}>
            <Button type="button" onClick={() => navigate("/dashboard")} >Back</Button>
          </Col>
        </Row>
        <hr/>
        <Row>  
          <Col>
          {SummaryORhours ==="summary"? 
            <BootstrapTable data={StaffAttandList} hover multiColumnSearch={true} version='4' search>
              <TableHeaderColumn width="160" dataField='name'  dataSort isKey>Name</TableHeaderColumn>
              <TableHeaderColumn width="130" dataField='date' dataFormat={displayDate} dataSort>Date</TableHeaderColumn>
              <TableHeaderColumn width="100" dataField='checkInTime' dataFormat={timeDisplay} dataSort>Check In Time</TableHeaderColumn>
              <TableHeaderColumn width="100" dataField='checkOutTime'  dataFormat={timeDisplay}   dataSort>Check Out Time</TableHeaderColumn>
              <TableHeaderColumn width="120" dataField='totalWorkingHours' dataFormat={displayhoursHandle} dataSort>Total Hours</TableHeaderColumn>
            </BootstrapTable>
          :<BootstrapTable data={StaffAttandList} hover multiColumnSearch={true} version='4' search>
            <TableHeaderColumn width="50" dataAlign='center' dataField=''></TableHeaderColumn>
            <TableHeaderColumn width="100" dataAlign='left' dataField='name'  dataSort isKey>Name</TableHeaderColumn>
            <TableHeaderColumn width="100" dataAlign='left'  dataField='totalHoursInDateRange' dataFormat={displayhoursHandle} dataSort>Total Hours</TableHeaderColumn>
          </BootstrapTable>}
          </Col>
        </Row>
      </CardBody> 
    </>
  )
}
