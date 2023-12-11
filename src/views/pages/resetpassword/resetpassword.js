import React, { useState } from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from "yup";
import { useNavigate, useParams } from 'react-router-dom';
import '../login/login.css'
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, ModalHeader, ModalBody, ModalFooter, CardImg, Row, Col, Spinner } from 'reactstrap';
import Swal from 'sweetalert2';
import LoginImage from '../../../assets/images/avatars/loginbackk.png';
import LoginSideImage from '../../../assets/images/avatars/babiespic.png';
import Logo from '../../../assets/images/logo/surgelogo.jpg';
import pass from "../../../assets/images/avatars/pass.png";
import pass1 from "../../../assets/images/avatars/pass1.png";
import YupPassword from 'yup-password';
YupPassword(Yup)
// video
const resetpassword = () => {
  const [formValues, setFormValues] = useState([{ password: "", confirmPassword: "", loader: false }]);
  const initialValues = {
    password: formValues.password,
    confirmPassword: formValues.confirmPassword,
  }
  const ResetSchema = () => Yup.object().shape({
    password: Yup.string().required('Password is required').minLowercase(1, 'Password must contain at least 1 lower case letter')
      .minUppercase(1, 'Password must contain at least 1 upper case letter')
      .minNumbers(1, 'Password must contain at least 1 number')
      .minSymbols(1, 'Password must contain at least 1 special character'),
    confirmPassword: Yup.string().required('Confirm Password is required').oneOf([Yup.ref('password'), null], 'Confirm Password does not match'),
  });
  const navigate = useNavigate();
  const params = useParams();
  const resetpasswordSubmit = (values) => {
    formValues.loader = true;
    setFormValues({ ...formValues });
    let payload = {
      token: params.id,
      newPassword: values.password
    }
    axios.put(`${process.env.REACT_APP_BASE_URL_BASE}auth/reset-Password`, payload).then((res) => {
      if (res.status === 200) {
        toast.success("Your password successfully updated.", { theme: "colored" });
        formValues.loader = false;
        setFormValues({ ...formValues });
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    }).catch((err) => {
      formValues.loader = false;
      setFormValues({ ...formValues });
      Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Oops, something went wrong. Please try again later',
        showConfirmButton: false,
        timer: 500
      })
    })
  }
  return (
    <>
      {formValues.loader ? <Spinner
        className='loaderr'
        color="primary"
      >
        Loading...
      </Spinner> : null}
      <ToastContainer />
      <div class="loginBackground">
        <img src={LoginImage} alt="Login Image" className='curvebackground' />
        <div class="loginOuter">
          <div class='loginInner'>
            <Row id="rowstyle">
              <Col md="6" xs="12">
                <div>
                  <div className='loginHeading'>
                    <h5>RESET PASSWORD</h5>
                    <img src={Logo} className='logostyles' />
                    <span className='textstyle1'>Your new password must be different from previous used passwords</span>
                  </div>
                  <Formik
                    initialValues={initialValues}
                    validationSchema={ResetSchema}
                    onSubmit={resetpasswordSubmit}
                  >
                    {({ values, handleChange, handleSubmit, errors, touched, handleBlur, isValid, dirty }) => (
                      <Form>
                        <Row>
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
                          <div className="second-input">
                            <img src={pass1} alt="pass" className="loginpass1" />
                            <input
                              placeholder='Confirm Password'
                              type="password"
                              name="confirmPassword"
                              id="loginname"
                              value={values.confirmPassword}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={errors.confirmPassword && touched.confirmPassword ? "input-error" : null}
                            />
                          </div>
                          <ErrorMessage name="confirmPassword" render={msg => <div className="errmsg">{msg}</div>} />
                          <div className="login-button">
                            <button className='button-login' type='submit'>Reset Password</button>
                          </div>
                        </Row>
                        <br />
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
            <br /> <br /> <br /> <br />
            <center> ACE © 2023 </center>
          </div>
        </div>
      </div>
    </>
  )
}
export default resetpassword;
