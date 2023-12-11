import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import { Col, Card, CardBody, CardFooter, Row, Button, Label, Input, FormGroup } from "reactstrap";
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from "yup";
import Axios from "../../../hoc/axiosConfig";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import moment from 'moment/moment';
import SCHEDULE from "./Schedular";
import DatePicker from "react-datepicker";
const createBatch = () => {
  const [state, setState] = useState({ batchName: "", sport: "", coach: "", style: "", program: "", mode: "", description: "", startDateTime: "", endDateTime: "", startTime: "", endTime: "",sportNprogramView:false });
  const [sportOptions, setSportOptions] = useState([]);
  const [coachOptions, setCoachOptions] = useState([]);
  const [styleOptions, setStyleOptions] = useState([]);
  const [programOptions, setProgramOptions] = useState([]);
  const [modeOptions, setModeOptions] = useState([]);
  const [batchTimings, setBatchTimings] = useState([]);
  const params = useParams();
  const navigate = useNavigate();
  const initialValues = {
    batchName: state.batchName,
    sport: state.sport,
    coach: state.coach,
    style: state.style,
    program: state.program,
    mode: state.mode,
    startDateTime: state.startDateTime,
    endDateTime: state.endDateTime,
    startTime: state.startTime,
    endTime: state.endTime,
    description: state.description,
    sportNprogramView:state.sportNprogramView
  }
  const BatchSchema = () =>
    Yup.object().shape(
      {
        batchName: Yup.string().min(2, 'Too Short!').max(70, 'Too Long!').required('Batch name Required'),
        sport: Yup.object().required('Sport is Required'),
        coach: Yup.object().required('Coach is Required'),
        style: Yup.object().required('Style is Required'),
        program: Yup.object().required('Program is Required'),
        mode: Yup.object().required('Mode is Required'),
        description: Yup.string().min(2, 'Too Short!').required('Description Required'),
        startTime: Yup.string().required("Start time Required"),
        endTime: Yup.string().required("End time Required"),
        startDateTime: Yup.date().required("Start Date is required").max(moment().add(6, 'months'), "Start date should't be more than 6 months"),
        endDateTime: Yup.date().required('End date is required'),
      });
  useEffect(() => { 
    Axios.get(`${process.env.REACT_APP_BASE_URL}/sports/all`).then((res) => {
      setState({
      ...state,
        sport: { value: res.data[0]?res.data[0].id:null, label: res.data[0]?res.data[0].name:null },
        program: { value: res.data[0]?res.data[0].programName[0]?res.data[0].programName[0].id:null:null, label: res.data[0]?res.data[0].programName[0]?res.data[0].programName[0].name:null:null },
        sportNprogramView:res.data[0]?res.data[0].view:null
    });
    }).catch((err) => { 
      Swal.fire( err.response.data.message, 'Please try again '  ) 
     })
    if (params.id !== "new") {
      Axios.get(`${process.env.REACT_APP_BASE_URL}/batches/${params.id}`).then((res) => {
        let batch = res.data;
        setState({
          ...state,
          batchName: batch.name,
           coach: { value: batch.user.id, label: `${batch.user.firstName} ${batch.user.lastName}` },
          style: { value: batch.batchStyle.id, label: batch.batchStyle.name },
          program: { value: batch.programName.id, label: batch.programName.name },
          mode: { value: batch.mode.id, label: batch.mode.name },
          startDateTime: moment(batch.startDate).format("MM/DD/YYYY"),
          endDateTime: moment(batch.endDate).format("MM/DD/YYYY"),
          startTime: batch.startTime ? moment(batch.startTime, 'HH:mm:ss').format("HH:mm") : batch.startTime,
          endTime: batch.endTime ? moment(batch.endTime, 'HH:mm:ss').format("HH:mm") : batch.endTime,
          description: batch.description,
        });
      }).catch((err) => { 
        Swal.fire( err.response.data.message, 'Please try again '  ) 
       })
    }
    getAllSports();
    getAllStaff();
    getAllStyles();
    getAllModes();
  }, []);
  const getAllSports = () => {
    Axios.get("sports").then((res) => {
      let sportsArray = []
      res.data.content.map((key, index) => {
        sportsArray.push({ value: key.id, label: key.name });
      })
      setSportOptions(sportsArray)
    }).catch(err => { 
      Swal.fire( err.response.data.message, 'Please try again '  ) 
    });
  }
  const sportChangeHandler = (data) => {
    getAllProgramsBySportId(data.value);
  }
  const getAllProgramsBySportId = (id) => {
    Axios.get(`sports/${id}/program-name`).then((res) => {
      let programArray = [];
      res.data.map((key, index) => {
        programArray.push({ value: key.id, label: key.name });
      })
      setProgramOptions(programArray)
    }).catch(err => {
      Swal.fire( err.response.data.message, 'Please try again '  ) 
     })
  }
  const getAllStaff = () => {
    axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token");
    axios.get(`${process.env.REACT_APP_BASE_URL_BASE}auth/roles/Coach/users`)
      .then((res) => {
        let staffArray = []
        res.data.map((key, index) => {
          staffArray.push({ value: key.id, label: `${key.firstName} ${key.lastName}` });
        })
        setCoachOptions(staffArray)
      }).catch((err) => {
        if (err.response.status === 401) {
          Swal.fire('401 session expired..!', 'Please re-login');
        }
        else {
          Swal.fire( err.response.data.message, 'Please try again '  ) 
        }
      })
  }
  const getstaffId = (id) => {
    Axios.get(`/user/${id.value}/batch`)
      .then((n) => {
        let batchArray = [];
        n.data.map((event, i) => {
          let startDate = event.startDate.split("-");
          let startTime = event.startTime.split(':');
          let startDateAndTime = new Date(event.startDate);
          let startDateAndTime2 = new Date(event.startDate);
          startDateAndTime.setHours(startTime[0]);
          startDateAndTime.setMinutes(startTime[1]);
          startDateAndTime.setSeconds(startTime[2]);
          let endDate = event.endDate.split("-");
          let endTime = event.endTime.split(':');
          let endDateAndTime = new Date(event.endDate);
          let endDateAndTime2 = new Date(event.endDate);
          endDateAndTime.setHours(endTime[0]);
          endDateAndTime.setMinutes(endTime[1]);
          endDateAndTime.setSeconds(endTime[2]);
          if (startDateAndTime2 < endDateAndTime2) {
            let startingPoint = new Date(startDateAndTime.getFullYear(), startDateAndTime.getMonth(), startDateAndTime.getDate());
            let endingPoint = new Date(endDateAndTime.getFullYear(), endDateAndTime.getMonth(), endDateAndTime.getDate());
             while (new Date(startingPoint) < new Date(endingPoint)) {
              let estartDateAndTime = new Date(startingPoint);
              estartDateAndTime.setHours(startTime[0]);
              estartDateAndTime.setMinutes(startTime[1]);
              estartDateAndTime.setSeconds(startTime[2]);
              let sendDateAndTime = new Date(startingPoint);
              sendDateAndTime.setHours(endTime[0]);
              sendDateAndTime.setMinutes(endTime[1]);
              sendDateAndTime.setSeconds(endTime[2]);
              startingPoint.setDate(startingPoint.getDate() + 1);
              batchArray.push({
                'title': event.name,
                'start': estartDateAndTime,
                'end': sendDateAndTime,
              })
            }
          }
          else {
            batchArray.push({
              'title': event.name,
              'start': startDateAndTime,
              'end': endDateAndTime,
            })
          }
        })
        setTimeout(() => {
          setBatchTimings(batchArray);
        }, 1500);
      })
  }
  const getAllStyles = () => {
    Axios.get("batch-style").then((res) => {
      let styleArray = []
      res.data.content.map((key, index) => {
        styleArray.push({ value: key.id, label: key.name });
      })
      setStyleOptions(styleArray)
    }).catch(err => {  
      Swal.fire( err.response.data.message, 'Please try again '  ) 
    })
  }
  const getAllModes = () => {
    Axios.get("batch-mode").then((res) => {
      let modeArray = []
      res.data.content.map((key, index) => {
        modeArray.push({ value: key.id, label: key.name });
      })
      setModeOptions(modeArray)
    }).catch(err => { 
      Swal.fire( err.response.data.message, 'Please try again '  ) 
     })
  }
  const batchSubmit = (values) => {
    let payload = {
      name: values.batchName,
      startDate: moment(values.startDateTime).format("YYYY-MM-DD"),
      endDate: moment(values.endDateTime).format("YYYY-MM-DD"),
      startTime: moment(values.startTime).format("HH:mm:ss"),
      endTime: moment(values.endTime).format("HH:mm:ss"),
      description: values.description
    }
    axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token");
      axios.post(`${process.env.REACT_APP_BASE_URL}/sports/${values.sport.value}/program-name/${values.program.value}/user/${values.coach.value}/batch-style/${values.style.value}/batch-mode/${values.mode.value}/batch`, payload)
      .then((res) => {
        if (res.status === 201) {
          toast.success("Batch created successfully", { theme: "colored" });
          setTimeout(() => {
            navigate('/settings/batches');
          }, 2000);
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
  const setStartDateFunc = (date, values) => {
    values.startDateTime = date;
    setState({ ...values });
  }
  const setEndDateFunc = (date, values) => {
    values.endDateTime = date;
    setState({ ...values });
  }
  const setStartTimeFunc = (date, values) => {
    values.startTime = date;
    setState({ ...values });
  }
  const setEndTimeFunc = (date, values) => {
    values.endTime = date;
    setState({ ...values });
  }
  return (
    <>
      <ToastContainer />
      <Card  >
        <h4><strong>{params.id === "new" ? "Create" : "Update"} Batch</strong></h4>
        <Row>
          <Col md={6}>
            <Card className='cardbgw'>
              <Formik
                enableReinitialize="true"
                initialValues={initialValues}
                validationSchema={BatchSchema}
                onSubmit={batchSubmit}
              >
                {({ values, handleChange, handleSubmit, errors, touched, handleBlur, isValid, dirty, setFieldValue }) => (
                  <Form className="add-edit-user-form" onSubmit={handleSubmit} autoComplete="off">
                    <CardBody className='cardbgw'>
                      <Row>
                        <Col md={6}>
                          <Label for="batchName">Name<span className="required">*</span> </Label>
                          <Input
                            type="text"
                            name="batchName"
                            placeholder="Batch name"
                            value={values.batchName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            invalid={touched.batchName && !!errors.batchName} />
                          <ErrorMessage name="batchName" component="div" className='errmsg'></ErrorMessage>
                        </Col>
                        <Col md={6}>
                          <Label for="coach">Coach<span className="required">*</span></Label>
                          <Select
                            name="coach"
                            value={values.coach}
                            options={coachOptions}
                            onChange={(selectedOption) => { setFieldValue('coach', selectedOption), getstaffId(selectedOption, 'coach') }}
                            invalid={touched.coach && !!errors.coach} />
                          <ErrorMessage name="coach" component="div" className='errmsg'></ErrorMessage>
                        </Col>
                        </Row>
                  {values.sportNprogramView?<Row>
                      <Col md={6}>
                          <Label for="sport">Sport<span className="required">*</span></Label>
                          <Select
                            name="sport"
                            value={values.sport}
                            options={sportOptions}
                            onChange={(selectedOption) => {
                              setFieldValue('sport', selectedOption), sportChangeHandler(selectedOption, "sport")
                            }}
                            invalid={touched.sport && !!errors.sport} />
                          <ErrorMessage name="sport" component="div" className='errmsg'></ErrorMessage>
                        </Col>
                        <Col md={6}>
                          <Label for="program">Program<span className="required">*</span></Label>
                          <Select
                            name="program"
                            value={values.program}
                            options={programOptions}
                            onChange={(selectedOption) => setFieldValue('program', selectedOption)}
                            invalid={touched.program && !!errors.program} />
                          <ErrorMessage name="program" component="div" className='errmsg'></ErrorMessage>
                        </Col> 
                      </Row>:null}
                      <Row>
                        <Col md={6}>
                          <Label for="style">Style<span className="required">*</span></Label>
                          <Select
                            name="style"
                            value={values.style}
                            options={styleOptions}
                            onChange={(selectedOption) => setFieldValue('style', selectedOption)}
                            invalid={touched.style && !!errors.style} />
                          <ErrorMessage name="style" component="div" className='errmsg'></ErrorMessage>
                        </Col>
                        <Col md={6}>
                          <Label for="mode">Mode<span className="required">*</span></Label>
                          <Select
                            name="mode"
                            value={values.mode}
                            options={modeOptions}
                            onChange={(selectedOption) => setFieldValue('mode', selectedOption)}
                            invalid={touched.mode && !!errors.mode} />
                          <ErrorMessage name="mode" component="div" className='errmsg'></ErrorMessage>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <FormGroup>
                            <Label  >Start Date<span className="required">*</span></Label>
                            <DatePicker
                              name="startDateTime"
                              selected={values.startDateTime ? new Date(values.startDateTime) : null}
                              onChange={date => setStartDateFunc(date, values)}
                              //minDate={params.id === "new" ? new Date() : ""}
                              placeholderText="mm/dd/yyyy"
                              minDate={new Date()}
                              maxDate={values.endDateTime}
                            />
                            <ErrorMessage name="startDateTime" component="div" className='errmsg'></ErrorMessage>
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label  >End Date<span className="required">*</span></Label>
                            <DatePicker
                              name="endDateTime"
                              selected={values.endDateTime ? new Date(values.endDateTime) : null}
                              onChange={date => setEndDateFunc(date, values)}
                              placeholderText="mm/dd/yyyy"
                              minDate={values.startDateTime}
                            //minDate={new Date(new Date(values.startDateTime).getTime() + 86400000)} 
                            />
                            <ErrorMessage name="endDateTime" component="div" className='errmsg'></ErrorMessage>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6}>
                          <FormGroup>
                            <Label  > Start Time<span className="required">*</span></Label>
                            <DatePicker
                              selected={values.startTime ? values.startTime : null}
                              onChange={date => setStartTimeFunc(date, values)}
                              placeholderText="--:-- --"
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={15}
                              timeCaption="Time"
                              dateFormat="h:mm aa"
                            />
                            <ErrorMessage name="startTime" component="div" className='errmsg'></ErrorMessage>
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label  > End Time<span className="required">*</span></Label>
                            <DatePicker
                              selected={values.endTime ? values.endTime : null}
                              onChange={date => setEndTimeFunc(date, values)}
                              placeholderText="--:-- --"
                              showTimeSelect
                              showTimeSelectOnly
                              timeIntervals={15}
                              timeCaption="Time"
                              dateFormat="h:mm aa"
                              minTime={new Date(new Date(values.startTime).getTime() + (5 * 60 * 1000))}
                              maxTime={new Date().setHours(23, 59, 59)}
                            />
                            <ErrorMessage name="endTime" component="div" className='errmsg'></ErrorMessage>
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={12}>
                          <FormGroup>
                            <Label for="description">Description<span className="required">*</span></Label>
                            <Input
                              name="description"
                              value={values.description}
                              type="textarea"
                              placeholder='content here...'
                              onChange={handleChange}
                              onBlur={handleBlur}
                              rows="2"
                              invalid={touched.description && !!errors.description} />
                            <ErrorMessage name="description" component="div" className='errmsg'></ErrorMessage>
                          </FormGroup>
                        </Col>
                      </Row>
                    </CardBody>
                    <CardFooter id='cardfootercolor'>
                      <Button size="md" color='secondary' type="button" id="cancelbutton" onClick={() => navigate(-1)}>Cancel</Button>{' '}
                      <Button color="primary" size='md' id="savebutton" type="submit">{params.id === "new" ? "Save" : "Update"}</Button>{' '}
                    </CardFooter>
                  </Form>
                )}
              </Formik>
            </Card>
          </Col>
          <Col md={6}>
            <Card className='fullCard'>
              <CardBody >
                <Card className='fullCardBody'>
                  <SCHEDULE events={batchTimings} />
                </Card>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Card>
    </>
  )
}
export default createBatch;
