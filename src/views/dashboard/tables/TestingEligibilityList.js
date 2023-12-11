import React,{useEffect, useState}  from 'react'
import { Col,  Label,Card,CardBody, Row,Input,Spinner, Button} from "reactstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import Axios from "../../../hoc/axiosConfig";
import Swal from 'sweetalert2';
import DatePicker from "react-datepicker";
import moment from 'moment/moment';
import { useNavigate } from "react-router-dom";
const StudentAttandinitialData= {chossenDate:"",TestingList:[],totalPages:"",currentPage:"",loader:false,totalTestingAnticipatedByDate:"",totalTestingApprovedByDate:""}
export default function TestingEligibilityList() {
  const [studentData, setState] = useState(StudentAttandinitialData);
  const {chossenDate,TestingList,totalPages,currentPage,loader,totalTestingAnticipatedByDate,totalTestingApprovedByDate} =  studentData;
  const navigate = useNavigate();
  const getDatafromDateChange=(name,date)=>{
     setState((prevState)=>({...prevState,loader:true}))
    let chossenDat = moment(date).format("YYYY-MM-DD");
    Axios.get(`/level-testing/${chossenDat}`).then((res)=>{
        setState((prevState)=>({
          ...prevState,
          TestingList:res.data.levelTestingSummaryList,loader:false,
          totalTestingAnticipatedByDate:res.data.totalTestingAnticipatedByDate,
          totalTestingApprovedByDate:res.data.totalTestingApprovedByDate,
          chossenDate:date
        }))
     }).catch(err=>{
      Swal.fire( err.response.data.message, 'Please try again '  ) 
       setState((prevState)=>({...prevState,loader:false}))
     })
  }
  useEffect(()=>{
    let dateToday = moment(new Date()).format("YYYY-MM-DD");
    getDatafromDateChange("chossenDate",dateToday)
  },[])
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
                 <h4><b>Testing Eligibility and Readiness</b></h4>
                 <div className='height15'></div>
              <Row>
                <Col md={3}>
                  <Label>Choose a level Testing Date :</Label>
                   <DatePicker
                    name="chossenDate"
                    selected={chossenDate?new Date(chossenDate):null}
                    onChange={(date) => getDatafromDateChange("chossenDate",date)}
                    placeholderText="mm/dd/yyyy"
                  />
                </Col>
                <Col md={3}>
                <Label>Total Anticipated</Label>
                  <Input type="text" value={totalTestingAnticipatedByDate} disabled/>
                </Col>
                
                <Col md={3}>
                  <Label>Total Approved</Label>
                  <Input  type="text" value={totalTestingApprovedByDate} disabled />  
                </Col>
                <Col md={2} style={{marginTop:"30px"}}>
                  <Button type="button" onClick={() => navigate("/dashboard")} >Back</Button>
                </Col>
              </Row>
              <hr/>
              <Row>
                <Col> 
                <BootstrapTable data={TestingList}  hover multiColumnSearch={true} version='4' search>
                  <TableHeaderColumn width="140" dataField='name'  dataSort isKey>Name</TableHeaderColumn>
                  <TableHeaderColumn width="180" dataField='level' dataSort>Level</TableHeaderColumn> 
                  <TableHeaderColumn width="140" dataField='testingAnticipated' dataSort> Testing Anticipated</TableHeaderColumn> 
                  <TableHeaderColumn width="140" dataField='testingApproved' dataSort>Testing Approved</TableHeaderColumn> 
                </BootstrapTable>
                </Col>
              </Row>
            </CardBody>
          </Card>
    </>
  )
}
