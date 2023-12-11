import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from "yup";
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import { Button, FormGroup, Label, Input, Card, CardFooter, CardBody, Col, Row, CardImg } from 'reactstrap';
import './emailtemplate.css';
import Axios from "../../../hoc/axiosConfig";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import emailtemplateImage from "../../../assets/images/avatars/emailtemplate.jpg"
const emailTemplte = { templateName: '', templateSubject: "", emailBody: "",emailType:"",emailTypeOptions:"",attachmentName:"" };
const createemailtemplate = () => {
  const [templateValues, setState] = useState(emailTemplte);
  const {templateName, templateSubject, emailBody,emailType,emailTypeOptions,attachmentName}=templateValues
  const params = useParams();
  const navigate = useNavigate();
  const TemplateSchema = () => Yup.object().shape({
    templateName: Yup.string().min(2, 'Too Short!').required('Template name Required'),
    templateSubject: Yup.string().min(2, 'Too Short!').required('Template subject Required'),
    emailBody: Yup.string().min(2, 'Too Short!').required('Email body Required'),
    emailType: Yup.object().required('Email type Required'),
  });
  useEffect(() => {
    if (params.id !== "new") {
      Axios.get(`email-template/${params.id}`).then((res) => {
        setState((prevState)=>({
          ...prevState,
          templateName: res.data.name, templateSubject: res.data.subject, emailBody: res.data.emailBody,
          emailType:{ value: res.data.emailType.id, label: res.data.emailType.name },
          attachmentName:res.data.attachment,

        })) 
      }).catch((err) => { 
        Swal.fire( err.response.data.message, 'Please try again '  ) 
      })
    }
    emailTypesDropdown();
  }, []);
  const emailTypesDropdown = () => {
    Axios.get(`email-types`).then((res) => {
      let typesArray = [];
      res.data.map((key, index) => {
        typesArray.push({ value: key.id, label: key.name });
      })
     setState((prevState)=>({
        ...prevState,
        emailTypeOptions:typesArray
      })) 
    }).catch((err) => {
      Swal.fire( err.response.data.message, 'Please try again '  ) 
     })
  }
  const templateSubmit = (values) => {
    const payload = {
      name      : values.templateName,
      subject   : values.templateSubject,
      emailBody : values.emailBody,
      attachment: attachmentName
    }
    if (params.id !== "new") {
      Axios.put(`email-type/${values.emailType.value}/email-template/${params.id}`, payload).then((res) => {
        if (res.status === 200) {
          toast.info("Email-Template updated successfully", { theme: "colored" });
          setTimeout(() => {
            navigate('/settings/allemailtemplates');
          }, 2000);
        }
      }).catch((err) => {
        Swal.fire( err.response.data.message, 'Please try again '  ) 
       })
    }
    else {
      axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token");
      axios.post(`${process.env.REACT_APP_BASE_URL}/email-type/${values.emailType.value}/email-template`, payload).then((res) => {
        if (res.status === 201) {
          toast.success("Email-Template created successfully", { theme: "colored" });
          setTimeout(() => {
            navigate('/settings/allemailtemplates');
          }, 2000);
        }
      }).catch((err) => {
        if (err.response.status === 401) {
          Swal.fire('401 session expired..!', 'Please re-login');
        }
        else {
          Swal.fire(err.response.data.message,'Please try again later');
        }
      })
    }
  }
  const attachmentHandleChange =(e)=>{
    let file =URL.createObjectURL(e.target.files[0]);
      let formdata = new FormData();
    formdata.append('image', e.target.files[0]);
     axios.defaults.headers.common['Authorization'] =  "Bearer " + localStorage.getItem("token");
    axios.post(`${process.env.REACT_APP_BASE_URL}/email-template/image/upload`,formdata).then((res)=>{
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
  const selectFieldHandleChange=(name,e)=>{
    setState((prevState)=>({
     ...prevState,
     [name]:e
   })) 
  }
  return (
    <>
      <ToastContainer />
      <Card >
        <CardBody className='cardbg'>
          <h5><strong>{params.id === "new" ? "Create" : "Update"} Email Template</strong></h5>
          <Card  >
            <Row>
              <Col md={6}>
                <Card className='cardbgw'>
                  <Formik
                    enableReinitialize="true"
                    initialValues={templateValues}
                    validationSchema={TemplateSchema}
                    onSubmit={templateSubmit}
                  >
                    {({ values, handleChange, handleSubmit, errors, touched, handleBlur, isValid, dirty, setFieldValue }) => (
                      <Form className="add-edit-user-form" onSubmit={handleSubmit}>
                        <CardBody className='cardbgw'>
                          <Row>
                            <Col md={6}>
                              <Label for="templateName">Name <span className="required">*</span></Label>
                              <Input
                                type="text"
                                name="templateName"
                                value={values.templateName}
                                id="templateName"
                                placeholder="Template name "
                                onChange={(handleChange,fieldHandleChange)}
                                onBlur={handleBlur}
                                className={errors.templateName && touched.templateName ? "input-error" : null}
                                bsSize="lg" />
                              <ErrorMessage name="templateName" component="div" className='errmsg'></ErrorMessage>
                            </Col>
                            <Col md={6}>
                              <Label for="emailType">Email Type <span className="required">*</span></Label>
                              <Select
                                name="emailType"
                                value={values.emailType}
                                options={emailTypeOptions}
                                onChange={(e)=>{setFieldValue("emailType",e),selectFieldHandleChange("emailType",e)}}
                              />
                              <ErrorMessage name="emailType" component="div" className='errmsg'></ErrorMessage>
                            </Col>
                          </Row>
                          <Row>
                            <FormGroup>
                              <Label for="templateSubject">Subject<span className="required">*</span></Label>
                              <Input
                                type="text"
                                name="templateSubject"
                                value={values.templateSubject}
                                id="templateSubject"
                                placeholder="Subject"
                                onChange={(handleChange,fieldHandleChange)}
                                onBlur={handleBlur}
                                bsSize="lg" />
                              <ErrorMessage name="templateSubject" component="div" className='errmsg'></ErrorMessage>
                            </FormGroup>
                          </Row>
                          <Row>
                            <FormGroup>
                              <Label for="emailBody">Body<span className="required">*</span></Label>
                              <Input
                                type="textarea"
                                name="emailBody"
                                value={values.emailBody}
                                id="emailBody"
                                placeholder='Body content here...'
                                onChange={(handleChange,fieldHandleChange)}
                                onBlur={handleBlur}
                                rows="6" />
                              <ErrorMessage name="emailBody" component="div" className='errmsg'></ErrorMessage>
                            </FormGroup>
                          </Row>
                          <Row>
                            <FormGroup>
                              <Label for="templateFile">Attachment</Label>
                              <Input
                                type="file"
                                name="templateFile"
                                value={values.templateFile}
                                onChange={(handleChange,attachmentHandleChange)}
                                id="templateFile" />
                            </FormGroup>
                          </Row>
                        </CardBody>
                        <CardFooter id='cardfootercolor'>
                          <Button  size="md" color='secondary' type="button" className='btncncl' id="cancelbutton" onClick={() => navigate(-1)}>Cancel</Button>{' '}
                          <Button  color="primary" size='md' id="savebutton" className='btnsave' type="submit">{params.id === "new" ? "Save" : "Update"}</Button>{' '}
                        </CardFooter>
                      </Form>
                    )}
                  </Formik>
                </Card>
              </Col>
              <Col md={6}>
                <CardImg
                  alt="Card image cap"
                  src={emailtemplateImage}
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
export default createemailtemplate