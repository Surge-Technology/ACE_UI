import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Col, Label, Card, CardBody, Row, Input, FormGroup, Button, Media, Spinner } from "reactstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from "yup";
import Axios from "../../hoc/axiosConfig";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import moment from 'moment/moment';
import Select from 'react-select'; 
import Swal from 'sweetalert2';
import DatePicker from "react-datepicker";
import emptyimage from "../../assets/images/avatars/userempty.jpg";
let dateToday = moment(new Date()).format("YYYY-MM-DD");
const createLevelTesting = () => {
  const [state, setState] = useState({ startDate: new Date(), master: null,program:null, class: null, loader: false });
  const [programOptions, setProgramOptions] = useState([]);
  const [masterOptions, setMasterOptions] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [attendenceTime, setAttendenceTime] = useState("");
  const [attendenceStartTime, setAttendenceStartTime] = useState("");
  const [studentAttendenceList, setStudentAttendenceList] = useState([]);
  const [studentDetails, setStudentDetails] = useState([]);
   const navigate = useNavigate();
  useEffect(() => {
     axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token");
    axios.get(`${process.env.REACT_APP_BASE_URL_BASE}api/program-names`)
      .then((res) => {
         let programs = []
        res.data.map((key, index) => {
          programs.push({ value: key.id, label: key.name });
        })
        setProgramOptions(programs)
      }).catch((err) => {
        if (err.response.status === 401) {
          Swal.fire('401 session expired..!', 'Please re-login');
        }
        else {
          Swal.fire('Oops, something went wrong. Please try again later');
        }
      })
  }, []);
  const initialValues = {
    startDate: state.startDate,
    master: state.master,
    class: state.class,
  }
  const setStartDate = (date, values) => {
    values.startDate = date;
    setState({ ...values });
    let dat = moment(date).format("YYYY-MM-DD")
    Axios.get(`student-statuses/${dat}`).then(response => {
      if(response.status===200){
      setStudentAttendenceList(response.data);
     }
    }).catch((err) => {
      Swal.fire(err , 'Please try again later');
    })
  } 
  const selectedRow = {
    mode: 'checkbox',
    showOnlySelected: true,
    onSelect: (row, isSelected, rowIndex, e) => {
        if (isSelected) {
        const data = studentDetails
        data.push(row)
          setTimeout(() => { 
          setStudentDetails(data);
           setState({ ...state });
       }, 500);
      } else {
        const selectedData= []
        studentDetails.map((mapdata,index)=>{
          if(mapdata.studentId!==row.studentId){
            selectedData.push(mapdata)
          }
        })
         setTimeout(() => {
           setStudentDetails(selectedData);
        }, 500);
      }
    },
    onSelectAll: (isSelect, rows, e) => {
       if (isSelect) {
        setStudentDetails(rows);
      }
      
     if (!isSelect)  {
        setStudentDetails([]);
      }
    }
  };
  const pictureFormat = (picture) => {
    let studentPicture = picture === null ? emptyimage : `${process.env.REACT_APP_BASE_URL_BASE}auth/student/image/${picture}`;
    return (
      <Media>
        <Media src={studentPicture} id="mediastyle" />
      </Media>
    )
  }
  const attendenceSubmit = (values) => {
     let payload = []
      studentDetails.map((mapdat,index)=>{
          payload.push({
            "levelId": mapdat.currentLevel?mapdat.currentLevel.id:null,
            "studentId": mapdat.studentId,
            "certificateName": mapdat.certificate?mapdat.certificate.backgroundPhoto?mapdat.certificate.backgroundPhoto:null:null
          })
      })
        setTimeout(() => {
        axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token");
    axios.post(`${process.env.REACT_APP_BASE_URL}/level-testing/promote`, payload)
      .then((res) => {
         if (res.status === 201) {
          toast.success("Successfully", { theme: "colored" });
          setStudentDetails([])
        }
      }).catch((err) => {
        if (err.response.status === 401) {
          Swal.fire('401 session expired..!', 'Please re-login');
        }
        else {
           Swal.fire(err.response.data.message,'Please try again later');
        }
      })
      }, 500);
  }
  
  const displaycurrentLevel = (cell, row) => {
    return (<span>{row.currentLevel.name? row.currentLevel.name : null}</span>);
  }
  const displaynextLevel = (cell, row) => {
    return (<span>{row.nextLevel.name? row.nextLevel.name : null}</span>);
  }
   const displaysubLevels = (cell, row) => {
   
    let name ='';
    if(row.subLevels ){
      row.subLevels.map((mapdat,index)=>{
          if(index===0){
              name=mapdat.shortName
          }else{
              name=name+", "+mapdat.shortName 
          }
      })
   }
   return name
  }
  return (
    <> 
      <ToastContainer />
      {state.loader ? <Spinner
        className='loaderr'
        color="primary"
      >
        Loading...
      </Spinner> : null}
      <Card >
        <CardBody className='cardbg'>
          <h4><strong>Belt Testing ({dateToday})</strong></h4>
          <Card className='attendencecard' >
            <Formik
              enableReinitialize="true"
              initialValues={initialValues}
              onSubmit={attendenceSubmit}
            >
              {({ values, handleChange, handleSubmit, errors, touched, handleBlur, isValid, dirty, setFieldValue }) => (
                <Form className="add-edit-user-form" onSubmit={handleSubmit}>
                  <Row>
                    <Col md={3}>
                     <FormGroup>
                        <Label for="startDate" >Search By Date</Label>
                        <DatePicker
                          className='studentsattendancecolor'
                          name="startDate"
                          selected={values.startDate ? new Date(values.startDate) : null}
                          onChange={(date) => setStartDate(date, values)}
                          placeholderText="mm/dd/yyyy"
                          />
                      </FormGroup>
                    </Col>  
                     <Col md={2}  >
                      <FormGroup style={{marginTop:"14%"}}>
                        <Button   type="submit" disabled={studentDetails.length<=0 ? true : false}>Promote</Button>
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik> 
          </Card>
          <hr />
           <Row className='rowborder'>
            <Card className='marginStyleForTablee'>
              <BootstrapTable data={studentAttendenceList} selectRow={selectedRow} keyField="studentId" search tableContainerClass='studenttablescro' multiColumnSearch="true">
                <TableHeaderColumn width="100" dataField='studentId' hidden >unique field</TableHeaderColumn>
                <TableHeaderColumn  width="150" dataField='studentName'>Student Name</TableHeaderColumn>
                <TableHeaderColumn width="150" dataField='currentLevel' dataFormat={displaycurrentLevel}>Current Level</TableHeaderColumn>
                <TableHeaderColumn  width="130" dataField='nextLevel' dataFormat={displaynextLevel} >Next Level</TableHeaderColumn>
                <TableHeaderColumn width="100" dataField='phone' dataFormat={displaysubLevels} >Tip</TableHeaderColumn>
              </BootstrapTable>
            </Card>
          </Row>
          <Row>
          </Row>
        </CardBody>
      </Card>
    </>
  )
}
export default createLevelTesting;