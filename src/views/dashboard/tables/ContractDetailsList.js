import React,{useState,useEffect}  from 'react'
import { Col,Badge, Label,Card,CardBody, Row,Input,Button,Spinner } from "reactstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
const StudentAttandinitialData= {StudentAttandList:[],totalPages:"",currentPage:"",loader:false,startDate:'',endDate:""}
import Axios from "../../../hoc/axiosConfig";
import Swal from 'sweetalert2';
import DatePicker from "react-datepicker";
import moment from 'moment/moment';
import { useNavigate } from "react-router-dom";
export default function ContractDetailsList() {
  const [studentData, setState] = useState(StudentAttandinitialData);
  const {StudentAttandList,totalPages,currentPage,loader,startDate,endDate} =  studentData;
  const navigate = useNavigate();
  useEffect(()=>{
    var someDate = new Date();
    let StartDat = moment(someDate).format("YYYY-MM-DD");
      let endDat = moment(someDate).format("YYYY-MM-DD");
      Axios.get(`/dashboard/all-contract?${StartDat}&endDate=${endDat}`).then((res)=>{
        console.log("res",res)
        setState((prevState)=>({
          ...prevState, 
          startDate:someDate,
          endDate:someDate,
          StudentAttandList:res.data.contractDtos,loader:false
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
      Axios.get(`/dashboard/all-contract?${StartDat}&endDate=${endDat}`).then((res)=>{
        setState((prevState)=>({
          ...prevState, 
          StudentAttandList:res.data.contractDtos,loader:false
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
  const nameHandle = (cell, row) => {
      return<>{row.contractPromotion.name}</>
  }
const totalFeeHandle = (cell, row) => {
  return<>{row.pricing.total?row.pricing.total:null}</>
}
const FeeHandle = (cell, row) => {
  return<>{row.pricing.fee?row.pricing.fee:null}</>
}
const creationDateHandle = (cell, row) => {
  return<>{cell? moment(cell).format("YYYY-MM-DD"):null}</>
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
                 <h4><b>Contract Details List</b></h4>
                 <div className='height15'></div>
              <Row>
                <Col md={3}>
                <Label>Start Date</Label>
                  <DatePicker
                    name="startDate"
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
                <BootstrapTable data={StudentAttandList} hover multiColumnSearch={true} version='4' search>
                  <TableHeaderColumn width="140" dataField='name'  dataSort isKey dataFormat={nameHandle}>Name</TableHeaderColumn>
                 <TableHeaderColumn width="120" dataField='fee'  dataFormat={FeeHandle}   dataSort>fee</TableHeaderColumn>
                  <TableHeaderColumn width="120" dataField='totalFee' dataFormat={totalFeeHandle} dataSort>Total Fee</TableHeaderColumn>
                  <TableHeaderColumn width="100" dataField='contractStatus'   dataSort>Contract Status</TableHeaderColumn>
                  <TableHeaderColumn width="100" dataField='startDate' dataSort>Start Date</TableHeaderColumn>
                  <TableHeaderColumn width="100" dataField='endDate'   dataSort>End Date</TableHeaderColumn>
                  <TableHeaderColumn width="100" dataField='creationDate' dataFormat={creationDateHandle}  dataSort>Created Date</TableHeaderColumn>
                   </BootstrapTable>
                </Col>
              </Row>
            </CardBody>
           </Card>  
    </>
  )
}
