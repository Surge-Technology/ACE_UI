import React, { useState, useEffect } from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from "yup";
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import { Button, FormGroup, Label, Input, Card, CardHeader, CardFooter, CardBody, Col, Row,  CardImg,Spinner } from 'reactstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import communicationImage from "../../../assets/images/avatars/communication.webp"
const comm = { subject: '', primaryAudience: "", seconderyAudience: "", message: "" ,file:"",loader:false,attachmentName:null}
const createEventCommunication = () => {
  const [eventValues, setState] = useState(comm);
  const {subject,primaryAudience,seconderyAudience,message,file,loader,attachmentName}=eventValues
  const [File, setFile] = useState("");
  const params = useParams();
  const navigate = useNavigate();
   
  const EventSchema = () => Yup.object().shape({
    subject: Yup.string().min(2, 'Too Short!').max(70, 'Too Long!').required('Subject Required'),
    message: Yup.string().min(2, 'Too Short!').required('Message Required'),
  });
  useEffect(() => {
     setState((prevState)=>({
      ...prevState,
      primaryAudience:params.name
    }));
   }, []);
   const eventSubmit = (values) => { 
    setState((prevState)=>({...prevState,loader:true}));
    const ppayload = {
      "subject": values.subject,
      "message": values.message,
      "secondaryAudience": values.seconderyAudience,
      "attachment": attachmentName
  }
     axios.defaults.headers.common['Authorization'] =  "Bearer " + localStorage.getItem("token");
    axios.post(`${process.env.REACT_APP_BASE_URL}/event/${params.id}/primary-audience/${params.primaryAudienceId}/group-message`,ppayload).then((res)=>{
        toast.success("Created successfully", { theme: "colored" })
       setState((prevState)=>({...prevState,loader:false}));
       setTimeout(() => {
        navigate(`/events/eventregister/${params.id}`);
      }, 1000);
    }).catch(err=>{
       setState((prevState)=>({...prevState,loader:false}));
      Swal.fire(
              err.response.data.message,
               'Please try again '
            )
    })
  }
  const attachmentHandleChange =(e)=>{
    let file =URL.createObjectURL(e.target.files[0]);
      let formdata = new FormData();
    formdata.append('image', e.target.files[0]);
     axios.defaults.headers.common['Authorization'] =  "Bearer " + localStorage.getItem("token");
    axios.post(`${process.env.REACT_APP_BASE_URL}/group-message/image/upload`,formdata).then((res)=>{
        setState((prevState)=>({
        ...prevState,
        attachmentName:res.data.imageName
      })) 
    }).catch(err=>{
      Swal.fire( err.response.data.message, 'Please try again '  ) 
    })  
  }
  const fieldHandleChange = (data)=>{
    setState((prevState)=>({
      ...prevState,
      [data.target.name]:data.target.value
    })) 
  }
  return (
    <>
      {loader?<Spinner
      className='loaderr'
       color="primary"
      > 
      Loading...
    </Spinner>:null} 
      <ToastContainer />
      <Card >
        <CardBody className='cardbg'>
          <h2><strong>New Group Message</strong></h2>
          <Card  >
            <Row>
              <Col md={6}>
                <Card className='cardbgw'>
                  <Formik
                    enableReinitialize="true"
                    initialValues={eventValues}
                    validationSchema={EventSchema}
                    onSubmit={eventSubmit}
                  >
                    {({ values, handleChange, handleSubmit, errors, touched, handleBlur, isValid, dirty, setFieldValue }) => (
                      <Form className="add-edit-user-form" onSubmit={handleSubmit}>
                        <CardBody className='cardbgw'>
                          <Row>
                            <Col md={12}>
                              <Label for="templateName">Subject <span className="required">*</span></Label>
                              <Input
                                type="text"
                                name="subject"
                                value={values.subject}
                                placeholder="subject "
                                onChange={(handleChange,fieldHandleChange)}
                                onBlur={handleBlur}
                                className={errors.subject && touched.subject ? "input-error" : null}
                                bsSize="lg" />
                              <ErrorMessage name="subject" component="div" className='errmsg'></ErrorMessage>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={6}>
                              <Label for="primaryAudience">Primary Audience <span className="required">*</span></Label>
                              <Input
                                type="text"
                                name="primaryAudience"
                                value={values.primaryAudience}
                                placeholder="primaryAudience "
                                onChange={(handleChange,fieldHandleChange)}
                                onBlur={handleBlur}
                                readOnly
                                 bsSize="lg" />
                              <ErrorMessage name="primaryAudience" component="div" className='errmsg'></ErrorMessage>
                            </Col>
                            <Col md={6}>
                              <Label for="seconderyAudience">Secondary Audience</Label>
                               <Input
                                type="text"
                                name="seconderyAudience"
                                value={values.seconderyAudience}
                                placeholder="seconderyAudience "
                                onChange={(handleChange,fieldHandleChange)}
                                onBlur={handleBlur}
                                className={errors.seconderyAudience && touched.seconderyAudience ? "input-error" : null}
                                bsSize="lg" />
                              </Col>
                          </Row>
                          <Row>
                            <FormGroup>
                              <Label for="message">Message<span className="required">*</span></Label>
                              <Input
                                type="textarea"
                                name="message"
                                value={values.message}
                                placeholder='Message content here...'
                                onChange={(handleChange,fieldHandleChange)}
                                onBlur={handleBlur}
                                rows="3" />
                              <ErrorMessage name="message" component="div" className='errmsg'></ErrorMessage>
                            </FormGroup>
                          </Row>
                          <Row>
                            <FormGroup>
                              <Label for="file">Attachment</Label>
                              <Input
                                type="file"
                                name="file"
                                value={values.file}
                                onChange={(handleChange,attachmentHandleChange)}
                              />
                            </FormGroup>
                          </Row>
                        </CardBody>
                        <CardFooter id='cardfootercolor'>
                          <Button  size="md" color='secondary' type="button" id="cancelbutton" onClick={() => navigate(`/events/eventregister/${params.id}`)}>Cancel</Button>{' '}
                          <Button  color="primary" size='md' id="savebutton" type="submit">{params.id === "new" ? "Send" : "send"}</Button>{' '}
                        </CardFooter>
                      </Form>
                    )}
                  </Formik>
                </Card>
              </Col>
              <Col md={6}>
                <CardImg
                  alt="Card image cap"
                  src={communicationImage}
                  bottom
                />
              </Col>
            </Row>
          </Card>
        </CardBody>
      </Card>
    </>
  );
}
export default createEventCommunication