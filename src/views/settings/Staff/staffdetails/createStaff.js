import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import Select from 'react-select';
import { Col, Card, CardBody, CardFooter, Row, Button, Label, Input, FormGroup, CardImg } from "reactstrap";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from "yup";
import YupPassword from 'yup-password';
YupPassword(Yup)
import Axios from "../../../../hoc/axiosConfig";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import Swal from 'sweetalert2';
import moment from 'moment/moment';
import DatePicker from "react-datepicker";
import staffImage from "../../../../assets/images/avatars/team.jpg"
const createStaff = () => {
  const [state, setState] = useState({ firstName: "", lastName: "", gender: "", dateOfBirth: "", phoneNumber: "", email: "", employmentType: "", userType: "", login: "", password: "", pin: "", address: "", address2: "", city: "", state: "", zipcode: "", country: "" });
  const [employmentTypeOptions, setEmploymentTypeOptions] = useState("");
  const [userTypeOptions, setUserTypeOptions] = useState("");
  const [stateOptions, setStateOptions] = useState("");
  const [userTypeIdFromBackend, setUserTypeIdFromBackend] = useState("");
  const [employmentTypeIdFromBackend, setEmploymentTypeIdFromBackend] = useState("");
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
    pin: state.pin,
    address: state.address,
    address2: state.address2,
    city: state.city,
    state: state.state,
    zipcode: state.zipcode
  }
  const fieldHandleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phoneNumber") {
      const val = value.replace(/[^0-9]/g, "");
      const formattedPhoneNumber = val.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
      setState((prevState) => ({
        ...prevState,
        [name]: formattedPhoneNumber
      }))
    } else {
      setState((prevState) => ({
        ...prevState,
        [name]: value
      }))
    }
  }
  const selectFieldHandleChange = (name, value) => {
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }
  const StaffSchema = () =>
    Yup.object().shape(
      {
        firstName: Yup.string().matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed").min(2, 'Too Short!').max(70, 'Too Long!').required('First name is required'),
        lastName: Yup.string().matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed").min(2, 'Too Short!').max(70, 'Too Long!').required('Last name is required'),
        dateOfBirth: Yup.string().required("Birth date is required").test("DOB", "Age must be at least 18 years", (date) => moment().diff(moment(date), "years") > 18),
        email: Yup.string().required("Email is required").email("Invalid mail address"),
        phoneNumber: Yup.string().min(10, 'Minimum 10 digits!').max(14, 'Maximum 14 digits!').required("Phone number is required"),
        employmentType: Yup.object().required('Employment type is required'),
        userType: Yup.object().required('User type is required'),
        login: Yup.string().required('Login is required'),
        password: Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters').minLowercase(1, 'Password must contain at least 1 lower case letter')
          .minUppercase(1, 'Password must contain at least 1 upper case letter')
          .minNumbers(1, 'Password must contain at least 1 number')
          .minSymbols(1, 'Password must contain at least 1 special character'),
      //  pin: Yup.string().min(4, 'Must be exactly 4 digits').max(5, 'Must be exactly 4 digits').required("Pin is required"),
        address: Yup.string().min(2, 'Too Short!').required('Address is required'),
        city: Yup.string().required("City is required"),
        state: Yup.object().required("State is required"),
        zipcode: Yup.string().min(5, 'Must be exactly 5 digits').max(5, 'Must be exactly 5 digits').required("Zipcode is required")
      })
  const StaffSchemaUpdate = () =>
    Yup.object().shape(
      {
        firstName: Yup.string().min(2, 'Too Short!').max(70, 'Too Long!').required('First name is required'),
        lastName: Yup.string().min(2, 'Too Short!').max(70, 'Too Long!').required('Last name is required'),
        dateOfBirth: Yup.string().required("Birth date is required").test("DOB", "Age must be at least 18 years", (date) => moment().diff(moment(date), "years") > 18),
        email: Yup.string().required("Email is required").email("Invalid mail address"),
        phoneNumber: Yup.string().min(10, 'Minimum 10 digits!').max(14, 'Maximum 14 digits!').required("Phone number is required"),
        employmentType: Yup.object().required('Employment type is required'),
        userType: Yup.object().required('User type is required'),
      //  pin: Yup.string().min(4, 'Must be exactly 4 digits').max(5, 'Must be exactly 4 digits').required("Pin is required"),
        login: Yup.string().required('Login is required'),
        address: Yup.string().min(2, 'Too Short!').required('Address is required'),
        city: Yup.string().required("City is required"),
        state: Yup.object().required("State is required"),
        zipcode: Yup.string().min(5, 'Must be exactly 5 digits').max(5, 'Must be exactly 5 digits').required("Zipcode is required")
      })
  useEffect(() => {
    
    axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token");
    axios.get(`${process.env.REACT_APP_BASE_URL_BASE}auth/employment-type`).then((res) => {
      let allemploymentList = [];
      res.data.map((mapdata, index) => {
        allemploymentList.push({ value: mapdata.id, label: mapdata.name });
      })
      setEmploymentTypeOptions(allemploymentList);
      //setState({employmentType:null})
    }).catch((err) => {
      if (err.response.status === 401) {
        Swal.fire('401 session expired..!', 'Please re-login');
      }
      else {
        Swal.fire('Oops, something went wrong. Please try again later');
      }
    })
    if (params.id !== "new") {
      Axios.get(`${process.env.REACT_APP_BASE_URL_BASE}auth/user/${params.id}`).then((res) => {
         let user = res.data;
        setState({
          ...state,
          firstName: user.firstName,
          lastName: user.lastName,
        //  pin: user.pin,
          dateOfBirth: moment(user.dob).format("MM/DD/YYYY"),
          phoneNumber: user.phone, email: user.email,
           employmentType: { value: user.employmentType.id, label: user.employmentType.name },
          userType: { value: user.roles[0].id, label: user.roles[0].roleName }, 
           login: user.login, password: "",
           address: user.address.addressLine1, address2: user.address.addressLine2, city: user.address.city,
           state: { value: user.address.state.id, label: user.address.state.name }, zipcode: user.address.pinCode,
          });
        setUserTypeIdFromBackend(user.id);
         setEmploymentTypeIdFromBackend(user.employmentType.id);
      }).catch((err) => {
        Swal.fire(err.response?err.response.data.message:null, 'Please try again ')
      })
    }
    Axios.get("/states").then((res) => {
      let allstatesList = [];
       res.data.map((mapdata, index) => {
        allstatesList.push({ value: mapdata.id, label: mapdata.name });
      })
       setStateOptions(allstatesList);
    }).catch(err => {
       Swal.fire('Please try again ')
    })
    axios.get(`${process.env.REACT_APP_BASE_URL_BASE}auth/roles`).then((res) => {
      let allusertypeList = []; 
       res.data.map((mapdata, index) => {
        allusertypeList.push({ value: mapdata.id, label: mapdata.roleName });
      })
      setUserTypeOptions(allusertypeList);
    }).catch((err) => {
      if (err.response.status === 401) {
        Swal.fire('401 session expired..!', 'Please re-login');
      }
      else {
        Swal.fire('Oops, something went wrong. Please try again later');
      }
    })
  }, []);
  const setDateHere = (date, values) => {
    values.dateOfBirth = date;
    setState({ ...values });
  }
  const staffSubmit = (values) => {    
    let payload = {
         firstName: values.firstName,
      lastName: values.lastName,
      dob: moment(values.dateOfBirth).format("YYYY-MM-DD"),
      phone: values.phoneNumber,
      email: values.email,
      login: values.login,
      password: values.password,
     // pin: values.pin,
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
     if (params.id === "new") {
       axios.post(`${process.env.REACT_APP_BASE_URL_BASE}auth/register/roles/${values.userType.value}/employment-type/${values.employmentType.value}`, payload)
        .then((res) => {
           if (res.status === 201) {
            toast.success(`User created successfully`, { theme: "colored" });
            setTimeout(() => {
              navigate('/userTabs/2');
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
    else {
       axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token");
      axios.put(`${process.env.REACT_APP_BASE_URL_BASE}auth/roles/${values.userType.value}/employment-type/${values.employmentType.value}/user/${params.id}`, payload)
        .then((res) => {
          if (res.status === 200) {
            toast.info(`User updated successfully`, { theme: "colored" });
            setTimeout(() => {
              navigate('/userTabs/2');
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
  }
  return (
    <>
      <ToastContainer />
      <Card  >
        <h4><strong>{params.id === "new" ? "Create" : "Update"} User</strong></h4>
        <Row>
          <Col md={8}>
            <Card className='cardbgw'>
              <Formik
                enableReinitialize="true"
                initialValues={initialValues}
                validationSchema={params.id === "new" ? StaffSchema : StaffSchemaUpdate}
                onSubmit={staffSubmit}
              >
                {({ values, handleChange, handleSubmit, errors, touched, handleBlur, isValid, dirty, setFieldValue }) => (
                  <Form className="add-edit-user-form" onSubmit={handleSubmit} autocomplete='off'>
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
                              onChange={(handleChange, fieldHandleChange)}
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
                              onChange={(handleChange, fieldHandleChange)}
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
                            <DatePicker
                              name="dateOfBirth"
                              selected={values.dateOfBirth ? new Date(values.dateOfBirth) : null}
                              onChange={(date) => setDateHere(date, values)}
                              placeholderText="mm/dd/yyyy"
                            />
                            <ErrorMessage name="dateOfBirth" component="div" className='errmsg'></ErrorMessage>
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label  >Phone Number<span className="required">*</span></Label>
                            <Input type="text"
                              name="phoneNumber"
                              value={values.phoneNumber}
                              onChange={(handleChange, fieldHandleChange)}
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
                              defaultValue=""
                              onChange={(handleChange, fieldHandleChange)}
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
                            onChange={(selectedOption) => { setFieldValue('userType', selectedOption), selectFieldHandleChange("userType", selectedOption) }}
                            invalid={touched.userType && !!errors.userType} />
                          <ErrorMessage name="userType" component="div" className='errmsg'></ErrorMessage>
                        </Col>
                        <Col md={3}>
                          <Label for="employmentType">Employment Type<span className="required">*</span></Label>
                          <Select
                            name="employmentType"
                            value={values.employmentType}
                            options={employmentTypeOptions}
                            onChange={(selectedOption) => { setFieldValue('employmentType', selectedOption), selectFieldHandleChange("employmentType", selectedOption) }}
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
                              onChange={(handleChange, fieldHandleChange)}
                              onBlur={handleBlur}
                              invalid={touched.login && !!errors.login} />
                            <ErrorMessage name="login" component="div" className='errmsg'></ErrorMessage>
                          </FormGroup>
                        </Col>
                        <Col md={6}>
                          <FormGroup>
                            <Label  >Password <span className="required">*</span></Label>
                            <Input type="password"
                              name="password"
                              value={values.password}
                              onChange={(handleChange, fieldHandleChange)}
                              onBlur={handleBlur}
                              disabled={params.id === "new" ? false : true}
                            />
                            <ErrorMessage name="password" component="div" className='errmsg'></ErrorMessage>
                          </FormGroup>
                        </Col>
                        {/* <Col md={3}>
                          <FormGroup>
                            <Label  >Pin<span className="required">*</span></Label>
                            <Input type="text"
                              name="pin"
                              value={values.pin}
                              onChange={(handleChange, fieldHandleChange)}
                              onBlur={handleBlur}
                              invalid={touched.pin && !!errors.pin} />
                            <ErrorMessage name="pin" component="div" className='errmsg'></ErrorMessage>
                          </FormGroup>
                        </Col> */}
                      </Row>
                      <Row>
                        <FormGroup>
                          <Label for="address">Address<span className="required">*</span></Label>
                          <Input
                            name="address"
                            value={values.address}
                            type="text"
                            placeholder='Address here...'
                            onChange={(handleChange, fieldHandleChange)}
                            onBlur={handleBlur}
                            invalid={touched.address && !!errors.address} />
                          <ErrorMessage name="address" component="div" className='errmsg'></ErrorMessage>
                        </FormGroup>
                      </Row>
                      <Row>
                        <FormGroup>
                         <Input
                            name="address2"
                            value={values.address2}
                            type="text"
                            onChange={(handleChange, fieldHandleChange)}
                            onBlur={handleBlur}
                           />
                         </FormGroup>
                      </Row>
                      <Row>
                        <Col md={4}>
                          <FormGroup>
                            <Label  > City<span className="required">*</span></Label>
                            <Input type="text" name="city"
                              value={values.city}
                              onChange={(handleChange, fieldHandleChange)}
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
                            onChange={(selectedOption) => { setFieldValue('state', selectedOption), selectFieldHandleChange('state', selectedOption) }}
                            invalid={touched.mode && !!errors.mode} />
                          <ErrorMessage name="state" component="div" className='errmsg'></ErrorMessage>
                        </Col>
                        <Col md={4}>
                          <FormGroup>
                            <Label  > Zipcode<span className="required">*</span></Label>
                            <Input type="number" name="zipcode"
                              value={values.zipcode}
                              onChange={(handleChange, fieldHandleChange)}
                              onBlur={handleBlur}
                              invalid={touched.zipcode && !!errors.zipcode} />
                            <ErrorMessage name="zipcode" component="div" className='errmsg'></ErrorMessage>
                          </FormGroup>
                        </Col>
                      </Row>
                    </CardBody>
                    <CardFooter id='cardfootercolor'>
                      <Button size="md" color='secondary' type="button" id="cancelbutton" onClick={() =>navigate('/userTabs/2')}>Cancel</Button>{' '}
                      <Button color="primary" size='md' id="savebutton" type="submit">{params.id === "new" ? "Save" : "Update"}</Button>{' '}
                    </CardFooter>
                  </Form>
                )}
              </Formik>
            </Card>
          </Col>
          <Col md={4}>
            <CardImg
              alt="Batch image"
              src={staffImage}
              bottom
            />
          </Col>
        </Row>
      </Card>
    </>
  )
}
export default createStaff