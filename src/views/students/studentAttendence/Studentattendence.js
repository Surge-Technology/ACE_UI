import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { Col, Label, Card, CardBody, Row, Input, FormGroup, Button, Media, Spinner } from "reactstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from "yup";
import Axios from "../../../hoc/axiosConfig";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import moment from 'moment/moment';
import Select from 'react-select';
import "./studentAttendence.css";
import Swal from 'sweetalert2';
import DatePicker from "react-datepicker";
import emptyimage from "../../../assets/images/avatars/userempty.jpg";

const Studentattendence = () => {
  const [state, setState] = useState({ startDate: new Date(), master: null,program:null, class: null, loader: false });
  const [programOptions, setProgramOptions] = useState([]);
  const [masterOptions, setMasterOptions] = useState([]);
  const [classOptions, setClassOptions] = useState([]);
  const [attendenceTime, setAttendenceTime] = useState("");
  const [attendenceStartTime, setAttendenceStartTime] = useState("");
  const [studentAttendenceList, setStudentAttendenceList] = useState([]);
  const [studentDetails, setStudentDetails] = useState([]);
  const [selectrow, setSelectrow] = useState(false);
  const [selectrows, setSelectrows] = useState(false)
  const navigate = useNavigate();
  useEffect(() => {
    //getAllMasters();
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
    program:state.program
  }
  const setStartDate = (date, values) => {
    values.startDate = date;
    setState({ ...values });
  }
  const AttendenceSchema = () => Yup.object().shape({
    master: Yup.object().required('Master is Required'),
    class: Yup.object().required('Class is Required'),
  });
  const getmasterId = (data) => { classDependable(data.value) }
  const classDependable = (id) => {
    Axios.get(`user/${id}/batch`).then(response => {
      let batchArray = [];
      response.data.map((mapdata, index) => {
        batchArray.push({ value: mapdata.id, label: mapdata.name });
      })
      setClassOptions(batchArray);
      setAttendenceTime("");
      }).catch((err) => {
      Swal.fire(err.response.data.message, 'Please try again later');
    })
  }
  const getMastersByprogram =(e,name)=>{
       Axios.get(`program-names/${e.value}/users`).then(response => {
        if(response.status===200){
            let staffArray = []
          response.data.map((key, index) => {
            staffArray.push({ value: key.id, label: `${key.firstName} ${key.lastName}` });
          })
          setState({ ...state });
           setMasterOptions(staffArray);
          setClassOptions([]);
          setStudentAttendenceList([]);
          setSelectrow(false);
          setSelectrows(false);
        }
      }).catch((err) => { })
  }
  const getclassId = (data) => { studentDependable(data.value) }
  const studentDependable = (id) => {
    state.loader = true;
    setState({ ...state });
    Axios.get(`batch/${id}/student`).then(response => {
        state.loader = false;
        setState({ ...state });
        setAttendenceStartTime(response.data[0].batch.startTime);
        setAttendenceTime(`${moment(response.data[0].batch.startTime, ["HH:mm"]).format("hh:mm a")} - ${moment(response.data[0].batch.endTime, ["HH:mm"]).format("hh:mm a")}`);
        setStudentAttendenceList(response.data);
      }).catch((err) => {
      Swal.fire(err.response.data.message, 'Please try again later');
      state.loader = false;
      setState({ ...state });
    })
  }
  const displayFullName = (cell, row) => {
    return (<span>{row ? `${row.firstName} ${row.lastName}` : null}</span>);
  }
  const selectedRow = {
    mode: 'checkbox',
    showOnlySelected: true,
    onSelect: (row, isSelect, rowIndex, e) => {
      setSelectrow(isSelect);
      let singleArray = studentDetails;
      if (isSelect === true) {
        singleArray.push(row);
        let singleDetails = [];
        singleArray.map((student, index) => {
          singleDetails.push({ id: student.id, firstName: student.firstName, lastName: student.lastName, dob: student.dob, gender: student.gender, photo: student.photo, phone: student.phone, email: student.email, studentAttendance: student.studentAttendance });
        })
        setStudentDetails(singleDetails);
      } else {
        singleArray.map((student, index) => {
          if (row.id == student.id) {
            singleArray.splice(index, 1);
          }
        })
      }
    },
    onSelectAll: (isSelect, rows, e) => {
      setSelectrows(isSelect);
      if (isSelect) {
        let details = []
        rows.map((student, index) => {
          details.push({ id: student.id, firstName: student.firstName, lastName: student.lastName, dob: student.dob, gender: student.gender, photo: student.photo, phone: student.phone, email: student.email, studentAttendance: student.studentAttendance });
        })
        setStudentDetails(details);
      }
      else {
        setStudentDetails([]);
      }
    }
  }
  const pictureFormat = (picture) => {
    let studentPicture = picture === null ? emptyimage : `${process.env.REACT_APP_BASE_URL_BASE}auth/student/image/${picture}`;
    return (
      <Media>
        <Media src={studentPicture} id="mediastyle" />
      </Media>
    )
  }
  const attendenceSubmit = (values) => {
    let payload = {
      studentAttendanceDate: values.startDate ? moment(values.startDate).format("YYYY-MM-DD") : values.startDate,
      studentAttendanceTime: attendenceStartTime,
      student: studentDetails
    }
     axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token");
    axios.post(`${process.env.REACT_APP_BASE_URL}/user/${values.master.value}/batch/${values.class.value}/studentAttendance`, payload)
      .then((res) => {
         if (res.status === 201) {
          toast.success("Attendence done successfully", { theme: "colored" });
          setTimeout(() => {
            setState({ startDate: new Date(), master: {},program:{}, class: {}, loader: false })
            setStudentAttendenceList([]);
            setStudentDetails([]);
            setMasterOptions([]);
            setClassOptions([]);
              navigate('/attendence/createstaffattendence/new');
          }, 1000);
        }
      }).catch((err) => {
        if (err.response.status === 401) {
          Swal.fire('401 session expired..!', 'Please re-login');
        }
        else {
          Swal.fire(err.response.data.message, 'Please try again later');
        }
      })
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
          <h4><strong>Attendence</strong></h4>
          <Card className='attendencecard' >
            <Formik
              enableReinitialize="true"
              initialValues={initialValues}
              validationSchema={AttendenceSchema}
              onSubmit={attendenceSubmit}
            >
              {({ values, handleChange, handleSubmit, errors, touched, handleBlur, isValid, dirty, setFieldValue }) => (
                <Form className="add-edit-user-form" onSubmit={handleSubmit}>
                  <Row>
                     <Col md={3}>
                      <FormGroup>
                      <Label for="program">Program</Label>{console.log("values",values)}
                        <Select
                          name="program"
                          value={values.program}
                          options={programOptions}
                          onChange={(selectedOption) => { setFieldValue('program', selectedOption), getMastersByprogram(selectedOption, 'getMasters'),setFieldValue("master", {}) , setFieldValue("class", {}) }}
                          invalid={touched.program && !!errors.program}
                        />
                        <ErrorMessage name="program" component="div" className='errmsg'></ErrorMessage>
                      </FormGroup>
                    </Col>  
                    <Col md={3}>
                      <FormGroup>
                        <Label for="master">Master</Label> 
                        <Select
                          name="master"
                          value={values.master}
                          options={masterOptions}
                          onChange={(selectedOption) => { setFieldValue('master', selectedOption), getmasterId(selectedOption, 'master'), setFieldValue("class", {}) }}
                          invalid={touched.master && !!errors.master}
                        />
                        <ErrorMessage name="master" component="div" className='errmsg'></ErrorMessage>
                      </FormGroup>
                    </Col>
                    <Col md={3}>
                      <FormGroup>
                        <Label for="class">Class</Label>
                        <Select
                          name="class"
                          value={values.class}
                          options={classOptions}
                          onChange={(selectedOption) => { setFieldValue('class', selectedOption), getclassId(selectedOption, 'class') }}
                          invalid={touched.class && !!errors.class}
                        />
                        <ErrorMessage name="class" component="div" className='errmsg'></ErrorMessage>
                      </FormGroup>
                    </Col>
                      <Col md={2}>
                      <Button className="markasbutton" type="submit" disabled={studentDetails.length<= 0 ? true : false}>Mark as Attend</Button>
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik>
          </Card>
          <hr />
          <Row>
            <Col ><h4><strong>Mark as Attendence </strong></h4></Col>
          </Row>
          <Row className='rowborder'>
            <Card className='marginStyleForTablee'>
              <BootstrapTable data={studentAttendenceList} selectRow={selectedRow} keyField="id" search tableContainerClass='studenttablescro' multiColumnSearch="true">
                <TableHeaderColumn width="5" dataField='id' hidden >unique field</TableHeaderColumn>
                <TableHeaderColumn width='120' dataField='photo' dataFormat={pictureFormat}>Student</TableHeaderColumn>
                <TableHeaderColumn width='150' dataField='firstName' dataFormat={displayFullName}>Name</TableHeaderColumn>
                <TableHeaderColumn width='120' dataField='gender' >Gender</TableHeaderColumn>
                <TableHeaderColumn width='120' dataField='phone' >Phone</TableHeaderColumn>
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
export default Studentattendence;