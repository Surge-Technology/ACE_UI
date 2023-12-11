import React,{useEffect, useState} from 'react'
import { useNavigate } from "react-router-dom";
import { Col, Label,  Row,Input, Modal,ModalHeader, ModalBody, ModalFooter,Button,Spinner } from "reactstrap";
import { Formik,Form , Field, ErrorMessage, yupToFormErrors,} from "formik";
import * as Yup from 'yup';
import Select from 'react-select';
import Axios from "./axiosConfig";
import axios from 'axios';
import Swal from 'sweetalert2';
import DatePicker from "react-datepicker";
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment/moment';
import CardApp from './cardPayment/cardApp';
   let card = {cardType:"",expireDate:"",cardNumber:"",pin:"",currency:"",description:""};
  let cheque = { date:"",payeeName:"",chequeNo:"",accountNo:"",routingNo:""};
  let autoPay = {accountNo:"",routingNo:""};
let initialPaymentData ={
    cardType:"",expireDate:"",cardNumber:"",pin:"",
    currency:"",currencyOptions:[{ value:"usd", label:"usd" }],description:"",paymentType:"",accountNo:"",routingNo:"",chargeAmount:"",
    date:"",payeeName:"",chequeNo:"",frontPictureAttachment:"",backPictureAttachment:"",paymentTypeOptions:"",loader:false,stripeModalToggle:false
}
let valid = {"paymentType": Yup.object().required(`Payment Type is required`)};
let todayDate = moment(new Date()).format("YYYY-MM-DD");
export default function PaymentType(props) {
    const [initialState,setState] = useState(initialPaymentData);
    const {cardType,expireDate,currency,cardNumber,pin,currencyOptions,description,paymentType,accountNo,routingNo,chargeAmount,date,
        payeeName,chequeNo,frontPictureAttachment,backPictureAttachment,paymentTypeOptions,loader,stripeModalToggle} = initialState;
        const navigate = useNavigate();
        let validationSchema = (data) => { 
        return Yup.object().shape(data)   
    } 
    
    const stripeModalToggleHandle=()=>{
        setState((prevState)=>({
          ...prevState,
          stripeModalToggle:!stripeModalToggle, 
        }))
      }
    let  onSubmitPayment=(data)=>{
        let formdata =data
        formdata.frontPictureAttachment=frontPictureAttachment;
        formdata.backPictureAttachment= backPictureAttachment
         if(paymentType.label==="Cheque" && frontPictureAttachment==="" ){
             Swal.fire( "Upload Front Picture", 'Cheque') 
        }
        if(paymentType.label==="Cheque" && backPictureAttachment===""){
             Swal.fire( "Upload Back Picture", 'Cheque') 
        }else{
            if(props.contractDetails !==undefined){
                //if for edit student screen update of contract and payment
                setState((prevState)=>({...prevState,loader:true}))
                 let payload = {
                    
                    "contract":{
                         "pricing":{
                        "id":props.contractDetails.member.value,
                        "fee":props.contractDetails.fee,
                        "discount":props.contractDetails.discount,
                        "totalFee": props.contractDetails.totalFee,
                        "members": props.contractDetails.member.label,
                       "subscriptionFrequency":{
                       "id":props.contractDetails.membersAndFrequency.value,
                       "name":props.contractDetails.membersAndFrequency.label
                   }
                        },
                       "startDate":moment(props.contractDetails.startDate).format("YYYY-MM-DD"),
                       "endDate":moment(props.contractDetails.endDate).format("YYYY-MM-DD"),
                       "attachment":props.contractDetails.contractImageName
                       }
                }
                if(paymentType.label==="AutoPay"){
                    payload.autoPay = {
                       "accountNumber" : data.accountNo,
                       "routingNumber" :  data.routingNo,
                       "chargeAmount"  : data.chargeAmount
                     }
                }
                if(paymentType.label==="Card"){
                    // payload.cardPaymentResponse = {
                    //    "amount": data.chargeAmount,
                    //     "currency": data.currency.value,
                    //     "description":data.description
                    //  } 
                    payload.usAePayCardPaymentResponse= {
                        "amount": data.chargeAmount, 
                        "currency": data.currency.value,  
                        "description": data.description,
                        "cardNumber": data.cardNumber,
                        "cardExpiryDate":moment(data.expireDate).format("YYYY-MM-DD"),
                        "cardCode": data.pin
                      }
                }
                if(paymentType.label==="Cheque"){
                      payload.usAePayChequePayment = {
                        "payeeName"    : data.payeeName,
                        "chequeNumber" : data.chequeNo,
                        "date"         : moment( data.date).format("YYYY-MM-DD"),
                        "amount" : data.chargeAmount,
                        "frontPictureAttachment":data.frontPictureAttachment,
                        "backPictureAttachment":data.backPictureAttachment,
                        "checkAccountNumber": data.accountNo,
                        "checkRoutingNumber": data.routingNo,
                      }
                }
                 Swal.fire({
                    title: 'Are you sure?',
                    text: "You want to update!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yes'
                  }).then((result) => {
                    if (result.isConfirmed) {
                        axios.defaults.headers.common['Authorization'] =  "Bearer " + localStorage.getItem("token");
                        ///payment-type/19/contract-promotion/87/contract-status/24/student/162/student
                        axios.post(`${process.env.REACT_APP_BASE_URL}/payment-type/${data.paymentType.value}/contract-promotion/${props.contractDetails.contractPromotion.value}/contract-status/${props.contractDetails.contractStatus.label}/student/${props.studentId}`,payload).then((res)=>{
                            toast.success("Updated successfully", { theme: "colored" })
                            console.log("res",res)
                            
                            if(payload.cardPaymentResponse){
                                localStorage.setItem("clientSecret",res.data.cardPaymentResponse.clientSecret)
                                setState((prevState)=>({...prevState,stripeModalToggle:!stripeModalToggle,loader:false}));
                               }else{
                                setTimeout(() => {
                                    props.sendData("payment")
                                    navigate("/studentTabs/2")
                                       setState((prevState)=>({...prevState,loader:false}))
                                  }, 1000);
                               }
                        }).catch(err=>{
                            setState((prevState)=>({...prevState,loader:false}))
                             Swal.fire( err.response.data.message, 'Please try again '  ) 
                        })
                    }else{
                        setState((prevState)=>({...prevState,loader:false}))
                    }
                  })
                
            }else{
                //else for create student screen and student event registering screen
                props.sendData(formdata);
            }
        }
     }
    
     let paymentTypeHandle =(data)=>{
        valid ={}
          if(data.label ==="Card"){
           // cardNumber.
             Object.keys(card).map((key)=>{
                if(key==="currency"){
                    valid[key]= Yup.object().required(`Field is required`)
                }else{
                    valid[key]= Yup.string().required(`Field is required`)
                }
            })
            validationSchema(valid);       
        }
        if(data.label ==="Cheque"){
            Object.keys(cheque).map((key)=>{
                valid[key]= Yup.string().required(`Field is required`)
            })
            validationSchema(valid);
        }
        if(data.label ==="AutoPay"){
             Object.keys(autoPay).map((key)=>{
                if(key==="routingNo"){
                    valid[key]= Yup.string().min(9,'Minimum length 9 is required').required(`Field is required`)
                }
                 if(key==="accountNo"){ 
                valid[key]= Yup.string().min(9, 'Minimum 9 digits required').max(16, 'Maximum 16 digits required').required(`Field is required`)
                }
            })
            validationSchema(valid);
        }
        setState((prevState)=>({
            ...prevState,
            paymentType:data
        })) 
     }
      useEffect(()=>{
         Axios.get("payment-types").then((res)=>{
        let  allpaymentTypes = []
            res.data.map((mapdata,index)=>{
                allpaymentTypes.push( { value: mapdata.id, label: mapdata.name })
            })
            setState((prevState)=>({
                ...prevState,
                paymentTypeOptions:allpaymentTypes,chargeAmount:props.contractFee
            }))
       }).catch(err=>{
        Swal.fire( err.response.data.message, 'Please try again '  ) ;
    })
      },[])
    const frontPicFileHandleChange=(e)=>{
        setState((prevState)=>({...prevState,loader:true}))
        let formdata = new FormData();
      formdata.append('image', e.target.files[0]);
       axios.defaults.headers.common['Authorization'] =  "Bearer " + localStorage.getItem("token");
      axios.post(`${process.env.REACT_APP_BASE_URL}/files/chequefrontimage/upload`,formdata).then((res)=>{
          setState((prevState)=>({
          ...prevState,
          frontPictureAttachment:res.data.imageName,loader:false
        })) 
      }).catch(err=>{
        setState((prevState)=>({...prevState,loader:false}))
        Swal.fire(err.response.data.message,'Please try again later');
      })  
    }
    const backPicFileHandleChange=(e)=>{
        setState((prevState)=>({...prevState,loader:true}))
        let formdata = new FormData();
      formdata.append('image', e.target.files[0]);
       axios.defaults.headers.common['Authorization'] =  "Bearer " + localStorage.getItem("token");
      axios.post(`${process.env.REACT_APP_BASE_URL}/files/chequefrontimage/upload`,formdata).then((res)=>{
        console.log("image",res)
         setState((prevState)=>({
          ...prevState,
          backPictureAttachment:res.data.imageName,loader:false
        })) 
      }).catch(err=>{
        setState((prevState)=>({...prevState,loader:false}))
        Swal.fire(err.response.data.message,'Please try again later');
      })  
    }
  return (
    <>  
    <ToastContainer />  
    {loader?<Spinner
      className='loaderr'
       color="primary"
      > 
      Loading...
    </Spinner>:null} 
    <Modal isOpen={stripeModalToggle} toggle={()=>stripeModalToggleHandle()} backdrop="static" centered>
        <ModalHeader toggle={()=>stripeModalToggleHandle()}>Card payment</ModalHeader>
        <ModalBody>
          <CardApp />
        </ModalBody>
      </Modal>  
          <Formik
          enableReinitialize={true}
          initialValues={initialPaymentData}
          validationSchema={validationSchema(valid)}
          onSubmit={onSubmitPayment} 
          >           
        {({ values,setFieldValue,handleChange,handleBlur,handleSubmit,errors,touched }) => (
            <Form > 
                <ModalBody>
                    <Row>
                        <Col md={3}><Label>Payment Type  </Label></Col>
                        <Col nd={6}>
                            <Select
                            name="paymentType"
                            defaultValue={paymentType}
                            onChange={(e)=>{setFieldValue("paymentType",e),paymentTypeHandle(e)}}
                            options={paymentTypeOptions}
                        />
                        <ErrorMessage name="paymentType" component="div"  className='errmsg'></ErrorMessage>
                        </Col>
                        
                    </Row><span className='displayNone'>{values.chargeAmount=chargeAmount}</span>
                    {paymentType.label==="AutoPay"?
                        <>
                            <div className='height15'></div>
                            <Row>
                                <Col md={1}></Col>
                                <Col md={3}><Label> Account No  <span className='colorRed'>*</span></Label></Col>
                                <Col md ={5}>
                                    <Input name="accountNo" type="number" value={values.accountNo} onChange={handleChange} onBlur={handleBlur} invalid={touched.accountNo &&!!errors.accountNo }/>
                                    <ErrorMessage name="accountNo" component="div"  className='errmsg'></ErrorMessage>
                                </Col>
                            </Row>
                            <div className='height15'></div>
                            <Row>
                                <Col md={1}></Col>
                                <Col md={3}><Label> Routing No  <span className='colorRed'>*</span></Label></Col>
                                <Col md ={5}>
                                    <Input name="routingNo" type="number" value={values.routingNo} onChange={handleChange} onBlur={handleBlur} invalid={touched.routingNo &&!!errors.routingNo }/>
                                    <ErrorMessage name="routingNo" component="div"  className='errmsg'></ErrorMessage>
                                    </Col>
                            </Row> <div className='height15'></div>
                            <Row>
                               <Col  md={4}><Label ><span>Charge Amount $</span></Label></Col>
                                <Col  md={5}>
                                    <Input name="chargeAmount" type="text" value={chargeAmount} disabled  onChange={handleChange} onBlur={handleBlur} />
                                 </Col>
                            </Row>
                        </>
                    :paymentType.label==="Card"?
                        <>
                            <Row>
                                <Col md={6}>
                                    <Label > Card Type  <span className='colorRed'>*</span> </Label>
                                    <Input name="cardType" type="text" value={values.cardType} placeholder="ex:-visa"  onChange={handleChange} onBlur={handleBlur} invalid={touched.cardType &&!!errors.cardType } />
                                    <ErrorMessage name="cardType" component="div"  className='errmsg'></ErrorMessage>
                                </Col>
                                <Col  md={6}>
                                     <Label ><span>expire Date  <span className='colorRed'>*</span></span></Label>
                                     
{/* <input type="month" format="mm-yyyy" />  */}
                                    <DatePicker
                                        name="expireDate"
                                        min={todayDate}
                                        dateFormat="MMM yyy"
                                        selected={values.expireDate?new Date(values.expireDate):null}
                                        onChange={(e)=>{setFieldValue("expireDate",e)}}
                                         showMonthYearPicker
                                        onBlur={handleBlur}
                                         
                                    />
                                    <ErrorMessage name="expireDate" component="div"  className='errmsg'></ErrorMessage>
                                    {/* <Label > Name on card  <span className='colorRed'>*</span></Label>
                                    <Input name="nameOnCard" type="text" value={values.nameOnCard} placeholder="Enter name on card"  onChange={handleChange} onBlur={handleBlur}   />
                                    <ErrorMessage name="nameOnCard" component="div"  className='errmsg'></ErrorMessage> */}
                                </Col>
                            </Row> 
                           
                            <Row>
                                <Col  md={6}>
                                    <Label > Card Number   <span className='colorRed'>*</span></Label>
                                    <Input name="cardNumber" type="number" value={values.cardNumber} placeholder="XXXXX XXXXX XXXXX"  onChange={handleChange} onBlur={handleBlur} invalid={touched.cardNumber &&!!errors.cardNumber } />
                                    <ErrorMessage name="cardNumber" component="div"  className='errmsg'></ErrorMessage>
                                </Col>
                                <Col  md={6}>
                                    <Label > Pin  <span className='colorRed'>*</span> </Label>
                                    <Input name="pin" type="number" value={values.pin} placeholder="XXX" onChange={handleChange} onBlur={handleBlur} invalid={touched.pin &&!!errors.pin } />
                                    <ErrorMessage name="pin" component="div"  className='errmsg'></ErrorMessage>
                                </Col>
                            </Row>
                            <Row>
                                <Col  md={6}>
                                <Label > Currency  <span className='colorRed'>*</span> </Label>
                                <Select
                                    name="currency"
                                    defaultValue={currency}
                                    onChange={(e)=>{setFieldValue("currency",e)}}
                                    options={currencyOptions}
                                />
                                <ErrorMessage name="currency" component="div"  className='errmsg'></ErrorMessage>
                                 </Col>
                                <Col  md={6}>
                                    <Label ><span>Charge Amount $</span></Label>
                                    <Input name="chargeAmount" type="text" value={chargeAmount} disabled  onChange={handleChange} onBlur={handleBlur}  />
                                </Col>
                                <Col>
                                
                                <Label > description   <span className='colorRed'>*</span></Label>
                                    <Input name="description" type="text" value={values.description}    onChange={handleChange} onBlur={handleBlur} invalid={touched.description &&!!errors.description } />
                                    <ErrorMessage name="description" component="div"  className='errmsg'></ErrorMessage>
                                </Col>
                            </Row> 
                            {/* <Row>
                                <CardApp />
                            </Row> */}
                        </>
                    :paymentType.label==="Cheque"?
                        <>
                            <Row>
                                <Col  md={6}>
                                    <Label ><span>Date  <span className='colorRed'>*</span></span></Label>
                                    <DatePicker
                                        name="date"
                                        selected={values.date?new Date(values.date):null}
                                        onChange={(e)=>{setFieldValue("date",e)}}
                                        onBlur={handleBlur}
                                        placeholderText="mm/dd/yyyy"
                                    />
                                    <ErrorMessage name="date" component="div"  className='errmsg'></ErrorMessage>
                                </Col>
                                <Col  md={6}>
                                    <Label ><span>Payee Name  <span className='colorRed'>*</span></span></Label>
                                    <Input name="payeeName" type="text" value={values.payeeName} onChange={handleChange} onBlur={handleBlur} invalid={touched.payeeName &&!!errors.payeeName } />
                                    <ErrorMessage name="payeeName" component="div"  className='errmsg'></ErrorMessage>
                                </Col>
                            </Row>
                            <Row>
                                <Col  md={6}>
                                    <Label ><span>Cheque No.  <span className='colorRed'>*</span></span></Label>
                                    <Input name="chequeNo" type="text" value={values.chequeNo} onChange={handleChange} onBlur={handleBlur} invalid={touched.chequeNo &&!!errors.chequeNo } />
                                    <ErrorMessage name="chequeNo" component="div"  className='errmsg'></ErrorMessage>
                                </Col>
                                <Col  md={6}>
                                    <Label ><span>Charge Amount $</span></Label>
                                    <Input name="chargeAmount" type="text" value={chargeAmount} disabled  onChange={handleChange} onBlur={handleBlur} />
                                   
                                </Col>
                            </Row>
                            <Row>
                                 <Col md ={6}>
                                <Label> Account No  <span className='colorRed'>*</span></Label>
                                    <Input name="accountNo" type="number" value={values.accountNo} onChange={handleChange} onBlur={handleBlur} invalid={touched.accountNo &&!!errors.accountNo }/>
                                    <ErrorMessage name="accountNo" component="div"  className='errmsg'></ErrorMessage>
                                </Col>
                                <Col md ={6}>
                                <Label> Routing No  <span className='colorRed'>*</span></Label>
                                    <Input name="routingNo" type="number" value={values.routingNo} onChange={handleChange} onBlur={handleBlur} invalid={touched.routingNo &&!!errors.routingNo }/>
                                    <ErrorMessage name="routingNo" component="div"  className='errmsg'></ErrorMessage>
                                    </Col>
                            </Row>
                            <Row>
                                <Col  md={6}>
                                    <Row>
                                        <Col>
                                            <Label ><span>front Picture Attachment</span></Label>
                                            <span className="btn btn-primary btn-file">
                                            Upload  Front  <input type="file" onChange={(e) =>frontPicFileHandleChange(e)}/>
                                            </span>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <span> {frontPictureAttachment?<b style={{color:"green"}}>Successfully Uploaded</b>:null}</span> 
                                    </Row>
                                 </Col>
                                <Col  md={6}>
                                    <Row>
                                        <Col>
                                            <Label ><span>back Picture Attachment  <span className='colorRed'>*</span></span></Label>
                                            <span className="btn btn-primary btn-file">
                                            Upload Back  <input type="file"  onChange={(e) =>backPicFileHandleChange(e)}/>
                                            </span>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <span> {backPictureAttachment?<b style={{color:"green"}}>Successfully Uploaded</b>:null}</span>
                                    </Row>
                                </Col>
                            </Row>
                        </>
                    :null}
                </ModalBody>
                <ModalFooter>
                    <Button type="button" color='secondary' size="sm" onClick={()=> props.sendData("payment")}  >Cancel</Button>
                    <Button type="submit" color='primary' size="sm" >Save</Button>
                </ModalFooter>
            </Form>
          )}
        </Formik>       
    </>
  )
}
