import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import { Col, Card, CardBody, CardFooter, Row, Button, Label, Input, FormGroup, CardImg } from "reactstrap";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from "yup";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import moment from 'moment/moment';
import './register.css'
import LoginVideo from '../../../assets/videos/login-background-video.mp4'
const Register = () => {
  const [state, setState] = useState({ firstName: "", lastName: "", gender: "", dateOfBirth: "", phoneNumber: "", email: "", employmentType: "", userType: "", login: "", password: "", address: "", address2: "", city: "", state: "", zipcode: "", country: "" })
  const [employmentTypeOptions, setEmploymentTypeOptions] = useState("");
  const [userTypeOptions, setUserTypeOptions] = useState("");
  const [stateOptions, setStateOptions] = useState("");
  const params = useParams();
  const navigate = useNavigate();
  const initialValues = {
    firstName: state.firstName,
    lastName: state.lastName,
    dateOfBirth: state.dateOfBirth,
    phoneNumber: state.phoneNumber,
    email: state.email,
    employmentType: state.employmentType,
    userType: state.userType,
    login: state.login,
    password: state.password,
    address: state.address,
    address2: state.address2,
    city: state.city,
    state: state.state,
    zipcode: state.zipcode,
  }
  const StaffSchema = () =>
    Yup.object().shape(
      {
        firstName: Yup.string().min(2, 'Too Short!').max(70, 'Too Long!').required('First name is required'),
        lastName: Yup.string().min(2, 'Too Short!').max(70, 'Too Long!').required('Last name is required'),
        dateOfBirth: Yup.string().required("Birth date is required").test("DOB", "Age must be at least 18 years", (date) => moment().diff(moment(date), "years") > 18),
        email: Yup.string().required("Email is required").email("Invalid mail address"),
        phoneNumber: Yup.string().required("Phone number is required"),
        employmentType: Yup.object().required('Employment type is required'),
        userType: Yup.object().required('User type is required'),
        login: Yup.string().required('Login is required'),
        password: Yup.string().required('Password is required').min(5, 'Password must be at least 5 characters').max(40, 'Password must not exceed 40 characters'),
        address: Yup.string().min(2, 'Too Short!').required('Address is required'),
        address2: Yup.string().min(2, 'Too Short!').required('Alternate Address is required'),
        city: Yup.string().required("City is required"),
        state: Yup.object().required("State is required"),
        zipcode: Yup.string().min(5, 'Must be exactly 5 digits').max(5, 'Must be exactly 5 digits').required("Zipcode is required"),
      });
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BASE_URL}/states`).then((res) => {
      let allstatesList = []
      res.data.map((mapdata, index) => {
        allstatesList.push({ value: mapdata.id, label: mapdata.name })
      })
      setStateOptions(allstatesList);
    }).catch(err => {  })
    axios.get(`${process.env.REACT_APP_BASE_URL}/employment-type`).then((res) => {
      let allemploymentList = []
      res.data.content.map((mapdata, index) => {
        allemploymentList.push({ value: mapdata.id, label: mapdata.name })
      })
      setEmploymentTypeOptions(allemploymentList);
    }).catch(err => {  })
    axios.get(`${process.env.REACT_APP_BASE_URL}/user-type`).then((res) => {
      let allusertypeList = []
      res.data.content.map((mapdata, index) => {
        allusertypeList.push({ value: mapdata.id, label: mapdata.name })
      })
      setUserTypeOptions(allusertypeList);
    }).catch(err => {  })
  }, []);
  const staffSubmit = (values) => {
    let payload = {
      firstName: values.firstName,
      lastName: values.lastName,
      dob: values.dateOfBirth,
      phone: values.phoneNumber,
      email: values.email,
      login: values.login,
      password: values.password,
      address: {
        addressLine1: values.address,
        addressLine2: values.address2,
        pinCode: values.zipcode,
        city: values.city,
        state: {
          id: values.state.value,
          name: values.state.label
        }
      }
    }
    axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token");
    axios.post(`${process.env.REACT_APP_BASE_URL_BASE}auth/register/user-type/${values.userType.value}/employment-type/${values.employmentType.value}`, payload)
      .then((res) => {
        if (res.status === 201) {
          toast.success(`User ${res.data.roles[0].name} created successfully`, { theme: "colored" })
          setTimeout(() => {
            //navigate('/login')
            const additionalValue = localStorage.getItem("accode");
            const url = additionalValue ? `/login/${additionalValue}` : '/login';
            navigate(url);
          
          }, 2000);
        }
      }).catch((err) => {
        Swal.fire(err.response.data.message, "Please try again")
      })
  }
  return (
    <>
      <ToastContainer />
      <div className="loginBackground">
        <video autoplay="" muted="" playsinline="" loop="">
          <source src={LoginVideo} type="video/mp4" />
        </video>
        <div className="loginOuter">
          <div className='loginInner'>
            <div className='loginHeading'>
              <h2>Register to ACE</h2>
            </div>
            <Row>
              <Col md={12}>
                <Card className='cardbgw'>
                  <Formik
                    enableReinitialize="true"
                    initialValues={initialValues}
                    validationSchema={StaffSchema}
                    onSubmit={staffSubmit}
                  >
                    {({ values, handleChange, handleSubmit, errors, touched, handleBlur, isValid, dirty, setFieldValue }) => (
                      <Form className="add-edit-user-form" onSubmit={handleSubmit}>
                        <CardBody className='cardbgw'>
                          <Row>
                            <Col md={6}>
                              <FormGroup>
                                <Label for="firstName">First Name<span className="required">*</span> </Label>
                                <Input
                                  type="text"
                                  name="firstName"
                                  placeholder="First name"
                                  value={values.firstName}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={touched.firstName && !!errors.firstName} />
                                <ErrorMessage name="firstName" component="div" className='errmsg'></ErrorMessage>
                              </FormGroup>
                            </Col>
                            <Col md={6}>
                              <FormGroup>
                                <Label for="lastName">Last Name<span className="required">*</span> </Label>
                                <Input
                                  type="text"
                                  name="lastName"
                                  placeholder="Last name"
                                  value={values.lastName}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={touched.lastName && !!errors.lastName} />
                                <ErrorMessage name="lastName" component="div" className='errmsg'></ErrorMessage>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={6}>
                              <FormGroup>
                                <Label  >Date of birth<span className="required">*</span></Label>
                                <Input type="date"
                                  name="dateOfBirth"
                                  value={values.dateOfBirth}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={touched.dateOfBirth && !!errors.dateOfBirth} />
                                <ErrorMessage name="dateOfBirth" component="div" className='errmsg'></ErrorMessage>
                              </FormGroup>
                            </Col>
                            <Col md={6}>
                              <FormGroup>
                                <Label  >Phone Number<span className="required">*</span></Label>
                                <Input type="number"
                                  name="phoneNumber"
                                  value={values.phoneNumber}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={touched.phoneNumber && !!errors.phoneNumber} />
                                <ErrorMessage name="phoneNumber" component="div" className='errmsg'></ErrorMessage>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={6}>
                              <FormGroup>
                                <Label  >Email<span className="required">*</span></Label>
                                <Input type="email"
                                  name="email"
                                  value={values.email}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={touched.email && !!errors.email} />
                                <ErrorMessage name="email" component="div" className='errmsg'></ErrorMessage>
                              </FormGroup>
                            </Col>
                            <Col md={3}>
                              <Label for="userType">User Type<span className="required">*</span></Label>
                              <Select
                                name="userType"
                                value={values.userType}
                                options={userTypeOptions}
                                onChange={(selectedOption) => setFieldValue('userType', selectedOption)}
                                invalid={touched.userType && !!errors.userType} />
                              <ErrorMessage name="userType" component="div" className='errmsg'></ErrorMessage>
                            </Col>
                            <Col md={3}>
                              <Label for="employmentType">Employment Type<span className="required">*</span></Label>
                              <Select
                                name="employmentType"
                                value={values.employmentType}
                                options={employmentTypeOptions}
                                onChange={(selectedOption) => setFieldValue('employmentType', selectedOption)}
                                invalid={touched.style && !!errors.style} />
                              <ErrorMessage name="employmentType" component="div" className='errmsg'></ErrorMessage>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={6}>
                              <FormGroup>
                                <Label  >Login<span className="required">*</span></Label>
                                <Input type="text"
                                  name="login"
                                  value={values.login}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={touched.login && !!errors.login} />
                                <ErrorMessage name="login" component="div" className='errmsg'></ErrorMessage>
                              </FormGroup>
                            </Col>
                            <Col md={6}>
                              <FormGroup>
                                <Label  >Password<span className="required">*</span></Label>
                                <Input type="password"
                                  name="password"
                                  value={values.password}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={touched.password && !!errors.password} />
                                <ErrorMessage name="password" component="div" className='errmsg'></ErrorMessage>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={6}>
                              <FormGroup>
                                <Label for="address">Address<span className="required">*</span></Label>
                                <Input
                                  name="address"
                                  value={values.address}
                                  type="textarea"
                                  placeholder='content here...'
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  rows="2"
                                  invalid={touched.address && !!errors.address} />
                                <ErrorMessage name="address" component="div" className='errmsg'></ErrorMessage>
                              </FormGroup>
                            </Col>
                            <Col md={6}>
                              <FormGroup>
                                <Label for="address2">Alternate Address<span className="required">*</span></Label>
                                <Input
                                  name="address2"
                                  value={values.address2}
                                  type="textarea"
                                  placeholder='Alternate address here...'
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  rows="2"
                                  invalid={touched.address2 && !!errors.address2} />
                                <ErrorMessage name="address2" component="div" className='errmsg'></ErrorMessage>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={4}>
                              <FormGroup>
                                <Label  > City<span className="required">*</span></Label>
                                <Input type="text" name="city"
                                  value={values.city}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={touched.city && !!errors.city} />
                                <ErrorMessage name="city" component="div" className='errmsg'></ErrorMessage>
                              </FormGroup>
                            </Col>
                            <Col md={4}>
                              <Label for="state">State<span className="required">*</span></Label>
                              <Select
                                name="state"
                                value={values.state}
                                options={stateOptions}
                                onChange={(selectedOption) => setFieldValue('state', selectedOption)}
                                invalid={touched.mode && !!errors.mode} />
                              <ErrorMessage name="state" component="div" className='errmsg'></ErrorMessage>
                            </Col>
                            <Col md={4}>
                              <FormGroup>
                                <Label  > Zipcode<span className="required">*</span></Label>
                                <Input type="number" name="zipcode"
                                  value={values.zipcode}
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  invalid={touched.zipcode && !!errors.zipcode} />
                                <ErrorMessage name="zipcode" component="div" className='errmsg'></ErrorMessage>
                              </FormGroup>
                            </Col>
                          </Row>
                        </CardBody>
                        <CardFooter id='cardfootercolor'>
                          <Button outline size="md" type="button" id="cancelbutton" onClick={() => navigate("/login")}>Sign In</Button>{' '}
                          <Button outline color="info" size='md' id="savebutton" type="submit">Sign Up</Button>{' '}
                        </CardFooter>
                      </Form>
                    )}
                  </Formik>
                </Card>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </>
  )
}
export default Register;