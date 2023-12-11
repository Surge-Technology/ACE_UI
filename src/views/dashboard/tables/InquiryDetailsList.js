import React,{useState,useEffect}  from 'react'
import { Col,Badge, Label,Card,CardBody, Row,Input,Button,Spinner } from "reactstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
const StudentAttandinitialData= {inquiryList:[],totalPages:"",currentPage:"",loader:false,startDate:'',endDate:""}
import Axios from "../../../hoc/axiosConfig";
import Swal from 'sweetalert2';
import DatePicker from "react-datepicker";
import moment from 'moment/moment';
import { useNavigate } from "react-router-dom";
export default function InquiryDetailsList() {
  const [studentData, setState] = useState(StudentAttandinitialData);
  const {inquiryList,totalPages,currentPage,loader,startDate,endDate} =  studentData;
  const navigate = useNavigate();
  useEffect(()=>{
    // var someDate = new Date();
    // let StartDat = moment(someDate).format("YYYY-MM-DD");
    //   let endDat = moment(someDate).format("YYYY-MM-DD");
    //   Axios.get(`/dashboard/inquiry/${StartDat}/${endDat}`).then((res)=>{
    //     if(res.status===200||res.status===201){
    //       setState((prevState)=>({
    //         ...prevState, 
    //         inquiryList:res.data?res.data:[],
    //         loader:false
    //       }))
    //     }
    //   }).catch(err=>{
    //     Swal.fire( err.response.data.message, 'Please try again '  ) 
    //     setState((prevState)=>({...prevState,loader:false}))
    //   })
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
      Axios.get(`/dashboard/inquiry/${StartDat}/${endDat}`).then((res)=>{
        if(res.status===200||res.status===201){
          setState((prevState)=>({
            ...prevState, 
            inquiryList:res.data?res.data:[],
            loader:false
          }))
        }else{
          setState((prevState)=>({
            ...prevState, 
             loader:false
          }))
        }
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
  const statusHandleChange =()=>{
    return(<><Badge color="primary">Active</Badge></>)
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
       <Card >
            <CardBody className='cardbg'>          
                 <h4><b>Inquiry Details List</b></h4>
                 <div className='height15'></div>
              <Row>
                <Col md={3}>
                <Label>Start Date</Label>
                  <DatePicker
                    name="startDate"
                   // selected={startDate?new Date(startDate):null}
                   selected={startDate}
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
                <BootstrapTable data={inquiryList} hover multiColumnSearch={true} version='4' search>
                  <TableHeaderColumn width="140" dataField='name'  dataSort isKey>Name</TableHeaderColumn>
                    <TableHeaderColumn width="120" dataField='batch'    dataSort>Class</TableHeaderColumn>
                  {/* <TableHeaderColumn width="100" dataField='MasterName'  dataFormat={statusHandleChange} dataSort>Status</TableHeaderColumn> */}
                  <TableHeaderColumn width="100" dataField='startTime' dataFormat={timeDisplay} dataSort>Start Time</TableHeaderColumn>
                  <TableHeaderColumn width="100" dataField='endTime'  dataFormat={timeDisplay}  dataSort>End Time</TableHeaderColumn>
                  <TableHeaderColumn width="100"  dataField="attendanceCount" dataSort>Attn.count</TableHeaderColumn>
                </BootstrapTable>
                </Col>
              </Row>
            </CardBody>
          </Card>
    </>
  )
}
