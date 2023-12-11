import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import { Col, Card, CardBody, CardFooter, Row, Button, Label, Input, FormGroup, CardImg } from "reactstrap";
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from "yup";
import Axios from "../../../hoc/axiosConfig";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import DatePicker from "react-datepicker";
import moment from 'moment';
import eventImage from "../../../assets/images/avatars/event-planning.webp"
const createEvent = () => {
  const [state, setState] = useState({ title: "", eventType: "", eventCategory: "", description: "", registrationFee: "", perdayFee: "", alldayCheck: true, customCheck: false, startDateAll: null, startTimeAll: null, endTimeAll: null,startDate:null,endDate:null,startTime:null,endTime:null });
  //const [customEventLoopValues, setCustomEventLoopValues] = useState([{ startDate: null,endDate:null, startTime: null, endTime: null }]);
  const [pricingLoopValues, setPricingLoopValues] = useState([{ mathValue: "", greaterlessnumber: "", discountfeeValue: "", discountfeeNumber: "" }]);
  const [eventTypeOptions, setEventTypeOptions] = useState("");
  const [eventCategoryOptions, setEventCategoryOptions] = useState("");
  const [mathOptions, setMathOptions] = useState("");
  const [discountfeeOptions, setDiscountFeeOptions] = useState("");
  const params = useParams();
  const navigate = useNavigate();
  const initialValues = {
    title: state.title,
    eventType: state.eventType,
    eventCategory: state.eventCategory,
    description: state.description,
    registrationFee: state.registrationFee,
    perdayFee: state.perdayFee,
    startDateAll: state.startDateAll,
    startTimeAll: state.startTimeAll,
    endTimeAll: state.endTimeAll,
  // customEventLoopValues: customEventLoopValues,
    startDate:state.startDate,
    endDate:state.endDate,
    startTime:state.startTime,
    endTime:state.endTime,
    pricingLoopValues: pricingLoopValues
  }
  const EventSchema = () =>
    Yup.object().shape({
      title: Yup.string().min(2, 'Too Short!').max(70, 'Too Long!').required('Title Required'),
      eventType: Yup.object().required('Event Type is Required'),
      eventCategory: Yup.object().required('Event Category is Required'),
      startDateAll: Yup.date().required('Start date is required').nullable(),
      startTimeAll: Yup.date().required('Start time is required').nullable(),
      endTimeAll: Yup.date().required('End time is required').nullable(),
      description: Yup.string().min(2, 'Too Short!').required('Description Required'),
       perdayFee: Yup.number().positive().required('Perday Fee is required'),
    });
  const EventSchemaCustom = () =>
    Yup.object().shape({
      title: Yup.string().min(2, 'Too Short!').max(70, 'Too Long!').required('Title Required'),
      eventType: Yup.object().required('Event Type is Required'),
      eventCategory: Yup.object().required('Event Category is Required'),
      // customEventLoopValues: Yup.array().of(
      //   Yup.object().shape({
           startDate: Yup.date().required('Start date is required').nullable(),
           endDate: Yup.date().required('End date is required').nullable(),
          startTime: Yup.date().required('Start time is required').nullable(),
          endTime: Yup.date().required('End time is required').nullable(),
      //   })
      // ),
      description: Yup.string().min(2, 'Too Short!').required('Description Required'),
       perdayFee: Yup.number().positive().required('Perday Fee is required'),
      pricingLoopValues: Yup.array().of(
        Yup.object().shape({
          mathValue: Yup.object().required("Select one option"),
          greaterlessnumber: Yup.number().required('Days Required'),
          discountfeeNumber: Yup.number().required('Discount required'),
          discountfeeValue: Yup.object().required('Type required'),
        })
      )
    });
  useEffect(() => {
    getAllEventTypes();
    getAllPricing();
    getDiscountFee();
    if (params.id !== "new") {
      Axios.get(`event/${params.id}`).then((res) => {
        let event = { value: res.data.eventType.id, label: res.data.eventType.name }
        if (res.data.isAllDay === true) {
          setState({ ...state, title: res.data.name, eventType: event, description: res.data.description, registrationFee: res.data.registrationFee, perdayFee: res.data.perDay, alldayCheck: res.data.isAllDay, customCheck: res.data.isCustomRange, startDateAll: res.data.allDayEvent.eventDate, startTimeAll: res.data.allDayEvent.startTime, endTimeAll: res.data.allDayEvent.endTime })
        }
        else {
          setState({ ...state, title: res.data.name, eventType: event, description: res.data.description, registrationFee: res.data.registrationFee, perdayFee: res.data.perDay, alldayCheck: res.data.isAllDay, customCheck: res.data.isCustomRange })
        }
        let customDateValues = []
        res.data.customRangeEvent.map((key, index) => {
          customDateValues.push({ startDate: key.eventDate, startTime: key.startTime, endTime: key.endTime })
        })
        setCustomEventLoopValues(customDateValues);
        let pricingValues = []
        res.data.eventPricing.map((key, index) => {
          pricingValues.push({ mathValue: { value: key.eventPricingCriteria.id, label: key.eventPricingCriteria.name }, greaterlessnumber: key.totalDays, discountfeeNumber: key.discount, discountfeeValue: { value: key.discountOrFee.id, label: key.discountOrFee.name } })
        })
        setPricingLoopValues(pricingValues)
      }).catch((err) => {
        Swal.fire(err.response.data.message, 'Please try again ')
      })
    }
  }, []);
  const getAllEventTypes = () => {
    Axios.get("event-type").then((res) => {
      let eventArray = [];
      res.data.content.map((key, index) => {
        eventArray.push({ value: key.id, label: key.name })
      })
      setEventTypeOptions(eventArray)
    }).catch(err => {
      Swal.fire(err.response.data.message, 'Please try again ')
    })
  }
  const getAllPricing = () => {
    Axios.get("event-pricing-criteria").then((res) => {
      let priceArray = []
      res.data.map((key, index) => {
        priceArray.push({ value: key.id, label: key.name })
      })
      setMathOptions(priceArray)
    }).catch(err => {
      Swal.fire(err.response.data.message, 'Please try again ')
    })
  }
  const getDiscountFee = () => {
    Axios.get("discount-or-fee").then((res) => {
      let discountFeeArray = []
      res.data.map((key, index) => {
        discountFeeArray.push({ value: key.id, label: key.name })
      })
      setDiscountFeeOptions(discountFeeArray)
    }).catch(err => {
      Swal.fire(err.response.data.message, 'Please try again ')
    })
  }
  const eventSubmit = (values) => {
    let priceArray = []
    values.pricingLoopValues.map((element, i) => {
       priceArray.push({
        eventPricingCriteria: {
          id: element.mathValue.value,
          name: element.mathValue.label
        },
        discountOrFee: {
          id: element.discountfeeValue.value,
          name: element.discountfeeValue.label
        },
        totalDays: element.greaterlessnumber,
        discount: element.discountfeeNumber
      })
    })
    let alldaypayload = {
      name: values.title,
      description: values.description,
      isAllDay: state.alldayCheck,
      isCustomRange: state.customCheck,
      registrationFee: values.registrationFee===''?0:values.registrationFee,
      perDay: values.perdayFee,
      allDayEvent: {
        eventDate: moment(values.startDateAll).format('YYYY-MM-DD'),
        startTime: moment(values.startTimeAll).format("HH:mm:ss"),
        endTime: moment(values.endTimeAll).format("HH:mm:ss")
      }
    }
    let custompayload = {
      name: values.title,
      description: values.description,
      isAllDay: state.alldayCheck,
      isCustomRange: state.customCheck,
      registrationFee: values.registrationFee===''?0:values.registrationFee,
      perDay: values.perdayFee,
     // customRangeEvent: customArray,
     "customRangeEvent":{
      startDate: moment(values.startDate).format("YYYY-MM-DD"),
      endDate: moment(values.endDate).format("YYYY-MM-DD"),
      startTime: moment(values.startTime).format("HH:mm:ss"),
      endTime: moment(values.endTime).format("HH:mm:ss"),
      },
      eventPricing: priceArray
    }
    
    axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token");
    if (state.alldayCheck === true) {
      axios.post(`${process.env.REACT_APP_BASE_URL}/event-type/${values.eventType.value}/event-category/${values.eventCategory.value}/event`, alldaypayload)
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            toast.success("All day event created successfully", { theme: "colored" })
            setTimeout(() => {
              navigate('/events')
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
    else {
      axios.post(`${process.env.REACT_APP_BASE_URL}/event-type/${values.eventType.value}/event-category/${values.eventCategory.value}/event`, custompayload)
        .then((res) => {
          if (res.status === 201 || res.status === 200) {
            toast.success("Custom range event created successfully", { theme: "colored" })
            setTimeout(() => {
              navigate('/events')
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
  }
  const handleAllDayCheck = () => {
    setState({ ...state, alldayCheck: !state.alldayCheck, customCheck: !state.customCheck })
  }
  const eventCategoryChange = (data) => {
    Axios.get(`event-type/${data.value}/all-event-mapping`).then((res) => {
      let eventCategoryArray = [];
      res.data.map((key, index) => {
        eventCategoryArray.push({ value: key.id, label: key.name })
      })
      setEventCategoryOptions(eventCategoryArray)
    }).catch(err => {
      Swal.fire(err.response.data.message, 'Please try again ')
    })
  }
  const handleCustomCheck = () => {
    setState({ ...state, customCheck: !state.customCheck, alldayCheck: !state.alldayCheck })
  }
  return (
    <>
      <ToastContainer />
      <Card  >
        <h4><strong>{params.id === "new" ? "Create" : "Update"} Event</strong></h4>
        <Row>
          <Col md={8}>
            <Card className='cardbgw'>
              <Formik
                enableReinitialize="true"
                initialValues={initialValues}
                validationSchema={state.alldayCheck == true ? EventSchema : EventSchemaCustom}
                onSubmit={eventSubmit}
              >
                {({ values, handleChange, handleSubmit, errors, touched, handleBlur, isValid, dirty, setFieldValue }) => (
                  <Form className="add-edit-user-form" onSubmit={handleSubmit} autoComplete="off">
                    <CardBody className='cardbgw'>
                      <Row>
                        <Col md={4}>
                          <Label for="">Title<span className="required">*</span> </Label>
                          <Input
                            type="text"
                            name="title" 
                            placeholder="Title"
                            value={values.title}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            invalid={touched.title && !!errors.title} />
                          <ErrorMessage name="title" component="div" className='errmsg'></ErrorMessage>
                        </Col>
                        <Col md={4}>
                          <Label for="eventType">Type of event<span className="required">*</span></Label>
                          <Select
                            name="eventType"
                            value={values.eventType}
                            options={eventTypeOptions}
                            onChange={(selectedOption) => { setFieldValue('eventType', selectedOption), eventCategoryChange(selectedOption, 'eventType'), setFieldValue('eventCategory', "") }}
                            invalid={touched.eventType && !!errors.eventType} />
                          <ErrorMessage name="eventType" component="div" className='errmsg'></ErrorMessage>
                        </Col>
                        <Col md={4}>
                          <Label for="eventCategory">Category of event<span className="required">*</span></Label>
                          <Select
                            name="eventCategory"
                            value={values.eventCategory}
                            options={eventCategoryOptions}
                            onChange={(selectedOption) => setFieldValue('eventCategory', selectedOption)}
                            invalid={touched.eventCategory && !!errors.eventCategory} />
                          <ErrorMessage name="eventCategory" component="div" className='errmsg'></ErrorMessage>
                        </Col>
                      </Row>
                      <br />
                      <Row>
                        <Col md={3} className="dayschange">
                          <Row>
                            <FormGroup switch>
                              <Label >
                                <Input type="switch" name="alldayCheck" onChange={handleAllDayCheck} checked={state.alldayCheck} />
                                All Day
                              </Label>
                            </FormGroup>
                          </Row>
                          <Row>
                            <FormGroup switch>
                              <Label >
                                <Input type="switch" name="customCheck" onChange={handleCustomCheck} checked={state.customCheck} />
                                Custom Range
                              </Label>
                            </FormGroup>
                          </Row>
                        </Col>
                        <Col md={8}>
                          {state.alldayCheck && (
                            <Row className='rowextend'>
                              <Col md={4}>
                                <FormGroup>
                                  <Label  >Date<span className="required">*</span></Label>
                                  <DatePicker
                                    name="startDateAll"
                                    selected={values.startDateAll ? values.startDateAll : null}
                                    onChange={(selectedOption) => setFieldValue('startDateAll', selectedOption)}
                                    onBlur={() => { setFieldTouched("startDateAll") }}
                                    minDate={new Date()}
                                    placeholderText="mm/dd/yyyy"
                                  />
                                  <ErrorMessage name="startDateAll" component="div" className='errmsg'></ErrorMessage>
                                </FormGroup>
                              </Col>
                              <Col md={4}>
                                <FormGroup>
                                  <Label  > Start Time<span className="required">*</span></Label>
                                  <DatePicker
                                    name="startTimeAll"
                                    selected={values.startTimeAll ? values.startTimeAll : null}
                                    onChange={(selectedOption) => setFieldValue('startTimeAll', selectedOption)}
                                    onBlur={() => { setFieldTouched("startTimeAll") }}
                                    placeholderText="--:-- --"
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeCaption="Time"
                                    dateFormat="h:mm aa"
                                  />
                                  <ErrorMessage name="startTimeAll" component="div" className='errmsg'></ErrorMessage>
                                </FormGroup>
                              </Col>
                              <Col md={4}>
                                <FormGroup>
                                  <Label  > End Time<span className="required">*</span></Label>
                                  <DatePicker
                                    name="endTimeAll"
                                    selected={values.endTimeAll ? values.endTimeAll : null}
                                    onChange={(selectedOption) => setFieldValue('endTimeAll', selectedOption)}
                                    onBlur={() => { setFieldTouched("endTimeAll") }}
                                    placeholderText="--:-- --"
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeCaption="Time"
                                    dateFormat="h:mm aa"
                                    minTime={new Date(new Date(values.startTimeAll).getTime() + (15 * 60 * 1000))}
                                    maxTime={new Date().setHours(23, 59, 59)}
                                  />
                                  <ErrorMessage name="endTimeAll" component="div" className='errmsg'></ErrorMessage>
                                </FormGroup>
                              </Col>
                            </Row>
                          )}
                          {state.customCheck === true ?
                           <>
                          <Row>
                              <Col md={3}>
                                 <Label  >Start Date<span className="required">*</span></Label>
                              <DatePicker
                                name="startDate"
                                selected={values.startDate ? new Date(values.startDate) : null}
                                onChange={(selectedOption) => setFieldValue(`startDate`, selectedOption)}
                                onBlur={() => { setFieldTouched(`startDate`) }}
                                minDate={new Date()}
                                placeholderText="mm/dd/yyyy"
                              />
                              <ErrorMessage name="startDate" component="div" className='errmsg' />
                            </Col>
                            <Col md={3}>
                                <Label  >End Date<span className="required">*</span></Label>
                              <DatePicker
                                name="endDate"
                                selected={values.endDate ? new Date(values.endDate) : null}
                                onChange={(selectedOption) => setFieldValue(`endDate`, selectedOption)}
                                onBlur={() => { setFieldTouched(`endDate`) }}
                                minDate={values.startDate}
                                placeholderText="mm/dd/yyyy"
                              />
                              <ErrorMessage name="endDate" component="div" className='errmsg' />
                            </Col> 
                            <Col md={3}>
                                <FormGroup>
                                  <Label  > Start Time<span className="required">*</span></Label>
                                  <DatePicker
                                  name="startTime"
                                  selected={values.startTime ? values.startTime : null}
                                  onChange={(selectedOption) => setFieldValue(`startTime`, selectedOption)}
                                  onBlur={() => { setFieldTouched(`startTime`) }}
                                  placeholderText="--:-- --"
                                  showTimeSelect
                                  showTimeSelectOnly
                                  timeCaption="Time"
                                  dateFormat="h:mm aa"
                                />
                                <ErrorMessage name={`startTime`} component="div" className='errmsg' />
                              </FormGroup>
                            </Col>
                            <Col md={3}>
                                <FormGroup>
                                  <Label  > End Time<span className="required">*</span></Label>
                                  <DatePicker
                                  name="endTime"
                                  selected={values.endTime ? values.endTime : null}
                                  onChange={(selectedOption) => setFieldValue(`endTime`, selectedOption)}
                                  onBlur={() => { setFieldTouched(`endTime`) }}
                                  placeholderText="--:-- --"
                                  showTimeSelect
                                  showTimeSelectOnly
                                  timeCaption="Time"
                                  dateFormat="h:mm aa"
                                  minTime={new Date(new Date(values.startTime).getTime() + (5 * 60 * 1000))}
                                  maxTime={new Date().setHours(23, 59, 59)}
                                />
                                <ErrorMessage name={`endTime`} component="div" className='errmsg' />
                              </FormGroup>
                            </Col>
                          </Row>
                          </>
                             : null}
                        </Col>
                      </Row>
                      <Row>
                        <FormGroup>
                          <Label for="eventBody">Description<span className="required">*</span></Label>
                          <Input
                            name="description"
                            value={values.description}
                            type="textarea"
                            placeholder='Content here...'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            rows="2"
                            invalid={touched.description && !!errors.description} />
                          <ErrorMessage name="description" component="div" className='errmsg'></ErrorMessage>
                        </FormGroup>
                      </Row>
                      <div >
                        <h5><strong>Pricing Details</strong></h5>
                        <hr />
                        <Row>
                        <Col md={6}>
                            <Label for="">Event Fee $ <span className="required">*</span></Label>
                            <Input
                              type="number"
                              placeholder="Per day fee "
                              name="perdayFee"
                              value={values.perdayFee}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              invalid={touched.perdayFee && !!errors.perdayFee} />
                            <ErrorMessage name="perdayFee" component="div" className='errmsg'></ErrorMessage>
                          </Col>
                          <Col md={6}>
                            <Label for="">Registration Fee $  </Label>
                            <Input
                              type="number"
                              placeholder="Registration fee"
                              name="registrationFee"
                              value={values.registrationFee}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                           </Col>
                        </Row>
                        <br />
                        <Row>
                          {state.customCheck === true ?
                            <FieldArray
                              name="pricingLoopValues"
                              render={arrayHelpers => {
                                const pricingLoopValues = values.pricingLoopValues;
                                return (
                                  <div>
                                    {pricingLoopValues && pricingLoopValues.length > 0 ? pricingLoopValues.map((element, index) => (
                                      <div key={index}>
                                        <Row className='rowextend2'>
                                          <Col md={3}>
                                            <FormGroup>
                                              <Label  >{index === 0 ? "Attending Days " : ""}<span className="required">*</span></Label>
                                              <Field>
                                                {({ field, form }) => (
                                                  <Select
                                                    name="mathValue"
                                                    options={mathOptions}
                                                    value={element.mathValue || ""}
                                                    onChange={(selectedOption) => form.setFieldValue(`pricingLoopValues.${index}.mathValue`, selectedOption)}
                                                    onBlur={() => { form.setFieldTouched(`pricingLoopValues.${index}.mathValue`) }}
                                                  />
                                                )}
                                              </Field>
                                              <ErrorMessage name={`pricingLoopValues.${index}.mathValue`} component="div" className='errmsg' />
                                            </FormGroup>
                                          </Col>
                                          <Col md={2}>
                                            <FormGroup>
                                              <Label  > {index === 0 ? "Days" : ""}<span className="required">*</span></Label>
                                              <Input type="number"
                                                placeholder='Days count'
                                                name={`pricingLoopValues.${index}.greaterlessnumber`}
                                                min="1"
                                                step="1"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={element.greaterlessnumber || ""}
                                              />
                                              <ErrorMessage name={`pricingLoopValues.${index}.greaterlessnumber`} component="div" className='errmsg' />
                                            </FormGroup>
                                          </Col>
                                          <Col md={2}>
                                            <FormGroup>
                                              <Label  > {index === 0 ? "Then Apply" : ""}<span className="required">*</span></Label>
                                              <Input type="number"
                                                placeholder='Less amount'
                                                name={`pricingLoopValues.${index}.discountfeeNumber`}
                                                min="1"
                                                step="1"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={element.discountfeeNumber || ""}
                                              />
                                              <ErrorMessage name={`pricingLoopValues.${index}.discountfeeNumber`} component="div" className='errmsg' />
                                            </FormGroup>
                                          </Col>
                                          <Col md={2}>
                                            <FormGroup>
                                              <Label  > {index === 0 ? "Discount/Fee" : ""}<span className="required">*</span></Label>
                                              <Field>
                                                {({ field, form }) => (
                                                  <Select
                                                    name="discountfeeValue"
                                                    value={element.discountfeeValue || ""}
                                                    onChange={(selectedOption) => form.setFieldValue(`pricingLoopValues.${index}.discountfeeValue`, selectedOption)}
                                                    onBlur={() => { form.setFieldTouched(`pricingLoopValues.${index}.discountfeeValue`) }}
                                                    options={discountfeeOptions}
                                                  />
                                                )}
                                              </Field>
                                              <ErrorMessage name={`pricingLoopValues.${index}.discountfeeValue`} component="div" className='errmsg' />
                                            </FormGroup>
                                          </Col>
                                          <Col md={3}>
                                            <Button color='success'
                                              onClick={() =>
                                                arrayHelpers.push({ mathValue: "", greaterlessnumber: "", discountfeeValue: "", discountfeeNumber: "" })
                                              }
                                              id="plusbutton" >
                                              <i className="fa fa-plus" aria-hidden="true" id="plusicon"></i>
                                            </Button> &nbsp;
                                            {index ? <Button color='danger' onClick={() => { arrayHelpers.remove(index) }} id="minusbutton">
                                              <i className="fa fa-minus" aria-hidden="true" id="minusicon"></i>
                                            </Button> : null}
                                          </Col>
                                        </Row>
                                      </div>
                                    ))
                                      : null}
                                  </div>
                                );
                              }}
                            />
                            : ""}
                        </Row>
                      </div>
                    </CardBody>
                    <CardFooter id='cardfootercolor'>
                      <Button color='secondary' size="md" type="button" id="cancelbutton" onClick={() => navigate(-1)}>Cancel</Button>{' '}
                      {params.id === "new" ? <Button color="primary" size='md' id="savebutton" type="submit">{params.id === "new" && "Save"}</Button> : ""}
                    </CardFooter>
                  </Form>
                )}
              </Formik>
            </Card>
          </Col>
          <Col md={4}>
            <CardImg
              alt="Card image cap"
              src={eventImage}
              bottom
            />
          </Col>
        </Row>
      </Card>
    </>
  )
}
export default createEvent