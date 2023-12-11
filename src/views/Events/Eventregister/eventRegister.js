import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import { Col, Card, CardBody, Row, Button, Label, Input, FormGroup, Form } from "reactstrap";
import Axios from "../../../hoc/axiosConfig";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import moment from 'moment/moment';
import "./eventregister.css";
import Swal from 'sweetalert2';
const eventRegister = (props) => {
  const [state, setState] = useState({ title: "", eventType: "", eventCategory:"", eventTypeOptions: "", description: "", registrationFee: "", perdayFee: "", alldayCheck: true, customCheck: false, startDateAll: "", startTimeAll: "", endTimeAll: "" });
  const [customEventLoopValues, setCustomEventLoopValues] = useState([{ startDate: "",endDate:"", startTime: "", endTime: "" }]);
  const [pricingLoopValues, setPricingLoopValues] = useState([{ mathValue: "", greaterlessnumber: "", discountfeeValue: "", discountfeeNumber: "" }]);
  const [eventTypeOptions, setEventTypeOptions] = useState("");
  const [eventCategoryOptions, setEventCategoryOptions] = useState("");
  const [getCommunicationDataList, setGetCommunicationDataList] = useState("");
  const [mathOptions, setMathOptions] = useState("");
  const [discountfeeOptions, setDiscountFeeOptions] = useState("");
  const [registredStudents, setRegistredStudents] = useState([]);
  const params = useParams(); const navigate = useNavigate();
  useEffect(() => {
     const thead = document.getElementsByTagName("thead");
   thead[0].style.backgroundColor = localStorage.getItem('tableColor');
   thead[1].style.backgroundColor = localStorage.getItem('tableColor');
    getCommunicationData();
    getAllregistredStudents();
    if (params.id !== "new") {
      Axios.get(`event/${params.id}`).then((res) => {
         let event = { value: res.data.eventType.id, label: res.data.eventType.name }
        let eventCategoryFetch = { value: res.data.eventCategory.id, label: res.data.eventCategory.name }
       
        if (res.data.isAllDay === true) {
           setState({
            ...state, title: res.data.name, eventType: event,eventCategory:eventCategoryFetch, description: res.data.description, registrationFee: res.data.registrationFee, perdayFee: res.data.perDay, alldayCheck: res.data.isAllDay, customCheck: res.data.isCustomRange, startDateAll: res.data.allDayEvent.eventDate ? moment(res.data.allDayEvent.eventDate).format("MM/DD/YYYY") : res.data.allDayEvent.eventDate,
            startTimeAll: res.data.allDayEvent.startTime ? moment(res.data.allDayEvent.startTime, ["HH:mm:ss"]).format("hh:mm a") : res.data.allDayEvent.startTime,
            endTimeAll: res.data.allDayEvent.endTime ? moment(res.data.allDayEvent.endTime, ["HH:mm:ss"]).format("hh:mm a") : res.data.allDayEvent.endTime,
          })
        }
        else {
           let pricingValues = []
          res.data.eventPricing.map((key, index) => {
            pricingValues.push({ mathValue: { value: key.eventPricingCriteria.id, label: key.eventPricingCriteria.name }, greaterlessnumber: key.totalDays, discountfeeNumber: key.discount, discountfeeValue: { value: key.discountOrFee.id, label: key.discountOrFee.name } })
          })
          setPricingLoopValues(pricingValues)
          let customDateValues = []
          customDateValues.push({
           startDate: res.data.customRangeEvent.startDate? moment(res.data.customRangeEvent.startDate).format("MM/DD/YYYY") : res.data.customRangeEvent.startDate,
           endDate: res.data.customRangeEvent.endDate? moment(res.data.customRangeEvent.endDate).format("MM/DD/YYYY") : res.data.customRangeEvent.endDate,
           startTime: res.data.customRangeEvent.startTime ? moment(res.data.customRangeEvent.startTime, ["HH:mm:ss"]).format("hh:mm a") : res.data.customRangeEvent.startTime,
           endTime: res.data.customRangeEvent.endTime ? moment(res.data.customRangeEvent.endTime, ["HH:mm:ss"]).format("hh:mm a") : res.data.customRangeEvent.endTime,
         })
          setCustomEventLoopValues(customDateValues);
          setState({ ...state, title: res.data.name, eventType: event,eventCategory:eventCategoryFetch, description: res.data.description, registrationFee: res.data.registrationFee, perdayFee: res.data.perDay, alldayCheck: res.data.isAllDay, customCheck: res.data.isCustomRange })
        }
        
      }).catch((err) => {   })
    }
  }, []);
  const getCommunicationData = ()=>{
    Axios.get(`event/${params.id}/group-messages`).then((res) => {
       setGetCommunicationDataList(res.data);
    }).catch((err) => {
      Swal.fire( err.response.data.message, 'Please try again '  ) 
    })
  }
  const getAllregistredStudents = () => {
    Axios.get(`event/${params.id}/event-registration`).then((res) => {
       setRegistredStudents(res.data)
      if (res.status == 401) {
        Swal.fire({ title: "error", icon: "error", text: "Session Expired" })
        //navigate('/login')
        const additionalValue = localStorage.getItem("accode");
        const url = additionalValue ? `/login/${additionalValue}` : '/login';
        navigate(url);
      
      }
    }).catch((err) => {
      Swal.fire( err.response.data.message, 'Please try again '  ) 
    })
  }
  const nameDisplay = (cell, row) => {
    let keyOnly = Object.keys(row);
    let checkKey = keyOnly.includes("guestStudent")
    if (checkKey == true) {
      return (<span>{row ? `${row.guestStudent.firstName} ${row.guestStudent.lastName}` : null}</span>)
    }
    else {
      return (<span>{row ? `${row.student.firstName} ${row.student.lastName}` : null}</span>)
    }
  }
  const emailDisplay = (cell, row) => {
    let keyOnly = Object.keys(row);
    let checkKey = keyOnly.includes("guestStudent")
    if (checkKey == true) {
      return (<>{row.guestStudent.email}</>)
    }
    else {
      return (<>{row.student.email}</>)
    }
  }
  const creationDate = (date) => {
    return (<>{moment(date).format("MM/DD/YYYY")}</>)
  }
  return (
    <>
      <Card >
        <CardBody className='cardbg'>
          <h3><strong>Event</strong></h3> 
          <Card className='cardbgw'>
            <CardBody>
              <Row>
                <Col md={6}>
                  <Row>
                    <Form className="add-edit-user-form" >
                      <CardBody className='cardbgw'>
                        <Row>
                          <Col md={4}>
                            <Label for="">Title </Label>
                            <Input
                              type="text"
                              name="title"
                              placeholder="Title"
                              value={state.title}
                              readOnly
                            />
                          </Col>
                          <Col md={4}>
                            <Label for="eventType">Type of event</Label>
                            <Select
                              name="eventType"
                              value={state.eventType}
                              options={eventTypeOptions}
                              isDisabled={true}
                            />
                          </Col>
                          <Col md={4}>
                            <Label for="eventType">Category of event</Label>
                            <Select
                              name="eventCategory"
                              value={state.eventCategory}
                              options={eventCategoryOptions}
                              isDisabled={true}
                            />
                          </Col>
                        </Row>
                        <br />
                        <Row>
                          <Col md={3} className="dayschange">
                            <Row>
                              <FormGroup switch>
                                <Label >
                                  <Input type="switch" name="alldayCheck" checked={state.alldayCheck} readOnly/>
                                  All Day
                                </Label>
                              </FormGroup>
                            </Row>
                            <Row>
                              <FormGroup switch>
                                <Label >
                                  <Input type="switch" name="customCheck" checked={state.customCheck} readOnly/>
                                  Custom Range
                                </Label>
                              </FormGroup>
                            </Row>
                          </Col>
                          <Col md={8}>
                            {state.alldayCheck && (
                              <Row className='rowextend3'>
                                <Col md={4}>
                                  <FormGroup>
                                    <Label  >Date</Label>
                                    <Input name="startDateAll" value={state.startDateAll} readOnly
                                    />
                                  </FormGroup>
                                </Col>
                                <Col md={4}>
                                  <FormGroup>
                                    <Label  > Start Time</Label>
                                    <Input name="startTimeAll" value={state.startTimeAll} readOnly/>
                                  </FormGroup>
                                </Col>
                                <Col md={4}>
                                  <FormGroup>
                                    <Label  > End Time</Label>
                                    <Input name="endTimeAll" value={state.endTimeAll} readOnly/>
                                  </FormGroup>
                                </Col>
                              </Row>
                            )}
                            {state.customCheck === true ? (customEventLoopValues.map((element, index) => (
                              <div key={index}>
                                <Row className='rowextend4'>
                                  <Col md={2}>
                                    <FormGroup>
                                      <Label  >{index === 0 ? "Start Date" : ""}</Label>
                                      <Input name="startDate" value={element.startDate || "startDate"} readOnly/>
                                    </FormGroup>
                                  </Col>
                                  <Col md={2}>
                                    <FormGroup>
                                      <Label  >{index === 0 ? "End Date" : ""}</Label>
                                      <Input name="endDate" value={element.endDate || "endDate"} readOnly/>
                                    </FormGroup>
                                  </Col>
                                  <Col md={2}>
                                    <FormGroup>
                                      <Label  > {index === 0 ? "Start Time" : ""}</Label>
                                      <Input name="startTime" value={element.startTime || "startTime"} readOnly/>
                                    </FormGroup>
                                  </Col>
                                  <Col md={2}>
                                    <FormGroup>
                                      <Label  > {index === 0 ? "End Time" : ""}</Label>
                                      <Input name="endTime" value={element.endTime || "endTime"} readOnly/>
                                    </FormGroup>
                                  </Col>
                                </Row>
                              </div>
                            ))) : ""}
                          </Col>
                        </Row>
                        <Row>
                          <FormGroup>
                            <Label for="eventBody">Description</Label>
                            <Input
                              name="description"
                              value={state.description}
                              type="textarea"
                              placeholder='content here...'
                              rows="2"
                              readOnly
                            />
                          </FormGroup>
                        </Row>
                        <div >
                          <h5><strong>Pricing Details</strong></h5>
                          <div className='cardcolor'>
                            <Row>
                            <Col md={6}>
                                <Label for="">Event Fee $</Label>
                                <Input
                                  type="number"
                                  placeholder="Per day fee "
                                  name="perdayFee"
                                  value={state.perdayFee}
                                  readOnly
                                />
                              </Col>
                            <Col md={6}>
                                <Label for="">Registration Fee $ </Label>
                                <Input
                                  type="number"
                                  placeholder="Registration fee"
                                  name="registrationFee"
                                  value={state.registrationFee}
                                  readOnly
                                />
                              </Col>
                            </Row>
                            <br />
                            <Row>
                              {state.customCheck === true ?
                                (pricingLoopValues.map((element, index) => (
                                  <div key={index}>
                                    <Row className='rowextend5'>
                                      <Col md={3}>
                                        <FormGroup>
                                          <Label  >{index === 0 ? "Attending Days " : ""}</Label>
                                          <Select
                                            name="frequency"
                                            value={element.mathValue}
                                            options={mathOptions}
                                            isDisabled={true}
                                          />
                                        </FormGroup>
                                      </Col>
                                      <Col md={2}>
                                        <FormGroup>
                                          <Label  > {index === 0 ? "Days" : ""}</Label>
                                          <Input type="number" name="greaterlessnumber" placeholder='Days count' value={element.greaterlessnumber || "greaterlessnumber"} readOnly/>
                                        </FormGroup>
                                      </Col>
                                      <Col md={2}>
                                        <FormGroup>
                                          <Label  > {index === 0 ? "Then Apply" : ""}</Label>
                                          <Input type="number" name="discountfeeNumber" placeholder='Less amount' value={element.discountfeeNumber || "discountfeeNumber"} readOnly/>
                                        </FormGroup>
                                      </Col>
                                      <Col md={2}>
                                        <FormGroup>
                                          <Label  > {index === 0 ? "Discount/Fee" : ""}</Label>
                                          <Select
                                            name="discountfeeValue"
                                            value={element.discountfeeValue}
                                            options={discountfeeOptions}
                                            isDisabled={true}
                                          />
                                        </FormGroup>
                                      </Col>
                                    </Row>
                                  </div>
                                ))) : ""}
                            </Row>
                          </div>
                        </div>
                      </CardBody>
                    </Form>
                  </Row>
                </Col>
                <Col md={6}>
                  <Row>
                    <Col><h4><strong>Registered</strong></h4></Col>
                    <Col> <Button type="button" color="primary" size="sm" className='floatg' onClick={() => navigate(`/events/studentEvent/${params.id}`)} >Register</Button></Col>
                  </Row>
                  <Row className='rowborder'>
                    <Card className='marginStyleForTable'>
                      <BootstrapTable data={registredStudents} keyField="email" striped hover version='4' tableContainerClass='my-custom-class'>
                        <TableHeaderColumn width="120" dataAlign='left' dataField='name' dataFormat={nameDisplay} dataSort >Name</TableHeaderColumn>
                        <TableHeaderColumn width="120" dataAlign='left' dataField='email' dataFormat={emailDisplay} dataSort>Email</TableHeaderColumn>
                        <TableHeaderColumn width="80" dataAlign='left' dataField='creationDate' dataFormat={creationDate} dataSort>Sign-up Date</TableHeaderColumn>
                      </BootstrapTable>
                    </Card>
                  </Row>
                  <br />
                  <Row>
                    <Col><h4><strong>Email</strong></h4></Col>
                    {/* <Col> <Button type="button" color="primary" size="sm" className='floatg' onClick={() => navigate(`/events/createcommunication/${params.id}`)} >Email</Button></Col> */}
                    <Col> <Button type="button" color="primary" size="sm" className='floatg' onClick={() => navigate(`/events/communication/group/${params.id}`)} >Notify</Button></Col>
                  </Row>
                   <Row className='rowborder'>
                    <Card className='marginStyleForTable'>
                    <BootstrapTable data={getCommunicationDataList} keyField="subject" striped hover version='4' tableContainerClass='my-custom-class'>
                          <TableHeaderColumn width="100" dataAlign='left' dataField='subject' dataSort>Subject</TableHeaderColumn>
                          <TableHeaderColumn width="100" dataAlign='left' dataField='dateSent' dataFormat={creationDate}  dataSort>Date Sent</TableHeaderColumn>
                        </BootstrapTable>
                    </Card>
                  </Row>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </CardBody>
        <Row>
          <center>
            <Button size="md" type="button" id="cancelbutton" onClick={() =>navigate('/events')}>Back</Button>{' '}
          </center>
        </Row>
      </Card>
    </>
  )
}
export default eventRegister