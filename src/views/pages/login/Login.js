import React, { useEffect, useState } from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from "yup";
import YupPassword from 'yup-password';
YupPassword(Yup)
import { useNavigate, useParams } from 'react-router-dom';
import { Spinner,Row, Col } from 'reactstrap';
import './login.css'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoginImage from '../../../assets/images/avatars/loginbackk.png';
import LoginSideImage from '../../../assets/images/avatars/babiespic.png';
import Logo from '../../../assets/images/logo/surgelogo.jpg';
import email from "../../../assets/images/avatars/email.png";
import pass from "../../../assets/images/avatars/pass.png";
const Login = () => {
  // accode: "",
  const { additionalValue } = useParams();
  const [formValues, setFormValues] = useState([{ email: "", password: "", loader: false }]);
  const navigate = useNavigate();
  localStorage.setItem('accode', additionalValue)

  const initialValues = {
    email    : formValues.email,
    password : formValues.password //,
    //acCode: formValues.accode
  }
  const LoginSchema = () => Yup.object().shape({
    email    : Yup.string().email('Invalid email').required('Email Required'),
    password : Yup.string().required('Password is required').min(8, 'Password must be at least 8 characters').minLowercase(1, 'Password must contain at least 1 lower case letter')
                  .minUppercase(1, 'Password must contain at least 1 upper case letter')
                  .minNumbers(1, 'Password must contain at least 1 number')
                  .minSymbols(1, 'Password must contain at least 1 special character'),
  });
 
  const userLoginSubmit = (e) => {
    setFormValues({ ...formValues, loader: true });
    let userloginRequestPayload = {
      username : e.email,
      password : e.password //,
//      acCode: e.acCode
    }

    axios.post(`${process.env.REACT_APP_BASE_URL_BASE}auth/login/${additionalValue}`, userloginRequestPayload, { filterResponse: "filterResponse" })
      .then((res) => {
        localStorage.setItem('role', res.data.user.roles[0].name)
        localStorage.setItem('token', res.data.token)
        localStorage.setItem('username', `${res.data.user.firstName}${res.data.user.lastName}`)
        localStorage.setItem('useremail', res.data.user.email)
        localStorage.setItem('userid', res.data.user.id)
        localStorage.setItem('employmentType', res.data.user.employmentType.id)
        if (res.status === 200) {
          toast.success("User Login successful", { theme: "colored" })
          setTimeout(() => {
            navigate("/dashboard");
          }, 500);
        }
      }).catch((err) => {
        setFormValues({ ...formValues, loader: false });
        toast.error("Invalid Credentials", { theme: "colored" })
      })
  }
  return (
    <>
      <ToastContainer />
      {formValues.loader ? <Spinner className='loaderr' color="primary" > Loading... </Spinner> : null}
      <div class="loginBackground">
        <img src={LoginImage} alt="Login Image" className='curvebackground' />
        <div class="loginOuter">
          <div class='loginInner'>
            <Row id="rowstyle">
              <Col md="6" xs="12">
                <div>
                  <div className='loginHeading'>
                    <h5>WELCOME TO</h5>
                    <img src={Logo} className='logostyles' />
                    <span className='textstyle1'>Log in to get in the moment updates on the things that interest you</span>
                  </div>
                  <Formik
                    initialValues={initialValues}
                    validationSchema={LoginSchema}
                    onSubmit={userLoginSubmit}
                  >
                    {({ values, handleChange, handleSubmit, errors, touched, handleBlur, isValid, dirty }) => (
                      <Form>
                        <Row>
                          <div>
                            <img src={email} alt="email" className="loginemail" />
                            <input
                              id="loginname"
                              placeholder='Username'
                              type="email"
                              name="email"
                              value={values.email}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={errors.email && touched.email ? "input-error" : null}
                            />
                          </div>
                          <ErrorMessage name="email" render={msg => <div className="errmsg">{msg}</div>} />
                          <div className="second-input">
                            <img src={pass} alt="pass" className="loginpass" />
                            <input
                              type="password"
                              placeholder="Password"
                              id="loginname"
                              name="password"
                              value={values.password}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={errors.password && touched.password ? "input-error" : null}
                            />
                          </div>
                          <ErrorMessage name="password" render={msg => <div className="errmsg">{msg}</div>} />
                          {/* <div className="third-input">
                            <img src={pass} alt="ac" className="loginac" />
                            <input
                              type="text"
                              placeholder="Academy Code"
                              id="loginname"
                              name="acCode"
                              value={values.acCode}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={errors.accode && touched.accode ? "input-error" : null}
                            />
                          </div>
                          <ErrorMessage name="acCode" render={msg => <div className="errmsg">{msg}</div>} /> */}
                          <div >
                             <p style={{float:"right",padding:"0px 30px"}}>Forgot your password? <Link className='customLink' to={'/login/forgotpassword'} >Click here</Link></p>
                            <button className='button-login' type='submit'>Login</button>
                          </div>
                          <h6 className='horizanantalstyle'>Or</h6>
                          <div className='mobilestyle'>
                            <a href="https://twitter.com/minimalmonkey" class="icon-button twitter"><i class="fa fa-twitter"></i><span></span></a>
                            <a href="https://facebook.com" class="icon-button facebook"><i class="fa fa-facebook"></i><span></span></a>
                            <a href="https://plus.google.com" class="icon-button google-plus"><i class="fa fa-google-plus"></i><span></span></a>
                            <a href="https://linkedin.com" class="icon-button linkedin"><i class="fa fa-linkedin"></i><span></span></a>
                          </div>
                        </Row>
                      </Form>
                    )}
                  </Formik>
                </div>
              </Col>
              <Col md="6" xs="12">
                <Row className='textstyle'>Streamline your Taekwondo operations with us!</Row>
                <img src={LoginSideImage} alt="Avatar" className='babiespicstyles' />
              </Col>
            </Row>
            <br />
            <br />
            <br />
            <center> ACE © 2023 </center>
          </div>
        </div>
      </div>
    </>
  )
}
export default Login;