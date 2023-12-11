import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from "yup";
import '../login/login.css'
import { Link } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, CardImg, Row, Col } from 'reactstrap';
import Swal from 'sweetalert2';
import LoginImage from '../../../assets/images/avatars/loginbackk.png';
import LoginSideImage from '../../../assets/images/avatars/babiespic.png';
import Logo from '../../../assets/images/logo/surgelogo.jpg';
import pic from "../../../assets/images/avatars/email.png";
import forgotpasswordImage from "../../../assets/images/avatars/passwordmail.jpg"
const forgotpassword = () => {
    const [modal, setModal] = useState(false)
    const [email, setEmail] = useState("")
    const initialValue = {
        email: email
    }
    const forgotPasswordSchema = () => Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Email Required'),
    });
    const forgotpasswordSubmit = (e) => {
        let payload = {
            email: e.email
        }
        axios.post(`${process.env.REACT_APP_BASE_URL_BASE}auth/forgot-password`, payload).then()
            .catch((err) => { Swal.fire('Oops, something went wrong. Please try again later'); })
        setModal(!modal)
    }
    const toggle = () => {
        setModal(!modal)
    }
    return (
        <>
            <ToastContainer />
            <div class="loginBackground">
                <img src={LoginImage} alt="Login Image" className='curvebackground' />
                <div class="loginOuter">
                    <div class='loginInner'>
                        <Row id="rowstyle">
                            <Col md="6" xs="12">
                                <div>
                                    <div className='loginHeading'>
                                        <h5>FORGOT PASSWORD</h5>
                                        <img src={Logo} className='logostyles' />
                                        <span className='textstyle1'>Enter the email associated with your account and we will send an email instructions to reset your password</span>
                                    </div>
                                    <Formik
                                        initialValues={initialValue}
                                        validationSchema={forgotPasswordSchema}
                                        onSubmit={forgotpasswordSubmit}
                                    >
                                        {({ handleChange }) => (
                                            <Form>
                                                <Row>
                                                    <div>
                                                        <img src={pic} alt="email" className="loginemail" />
                                                        <input
                                                            id="loginname"
                                                            placeholder='Enter Your Email Address'
                                                            type="email"
                                                            name="email"
                                                            onChange={handleChange}
                                                        />
                                                    </div>
                                                    <ErrorMessage name="email" render={msg => <div className="errmsg">{msg}</div>} />
                                                    <div className="d-grid gap-2">
                                                        <div>
                                                            <Modal isOpen={modal} toggle={toggle} >
                                                                <ModalHeader toggle={toggle}></ModalHeader>
                                                                <ModalBody>
                                                                    <img
                                                                        width="80%"
                                                                        style={{ marginLeft: "10%" }}
                                                                        // className='forgotImage'
                                                                        alt="Card image cap"
                                                                        src={forgotpasswordImage}
                                                                    />
                                                                    <h2 className='center'>Check your mail</h2>
                                                                    <p className='center'>We have sent a password recover instructions to your email.</p>
                                                                </ModalBody>
                                                                <ModalFooter style={{ background: "none" }}>
                                                                    <div className="login-button">
                                                                        <button className='button-login' type='submit' onClick={toggle}>Ok</button>
                                                                    </div>
                                                                </ModalFooter>
                                                            </Modal>
                                                        </div>
                                                        <div className="login-button">
                                                            <button className='button-login' type='submit'>Send</button>
                                                            <p><Link className='customLink' to={'/login'} >Back</Link></p>
                                                        </div>
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
                        <br />
                        <center> ACE © 2023 </center>
                    </div>
                </div>
            </div>
        </>
    )
}
export default forgotpassword;