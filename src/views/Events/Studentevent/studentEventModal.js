import React,{useEffect, useState} from 'react'
import { Col, Label, Row,Input, Modal, ModalBody, ModalFooter, ModalHeader, Button,Spinner,Tooltip  } from "reactstrap";
import {  useNavigate } from "react-router-dom"; 
import "./studentEvent.css";
import PaymentType from '../../../hoc/paymentType';
import Axios from "../../../hoc/axiosConfig";
import axios from 'axios';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import moment from 'moment';
import CardPay from './CardPay/CardPay';
const registering = {alldayORcustom:"empty",eventPricing:[],discount:0,eventLength:"",discountOrFee:"",checkbox:[false],studentTypeData:"",eventsList:[],totalFee:"",fee:"",paymentTypeModalToggle:false,PaymentData:"",
registrationFee:"",perDay:"",selectedEventsLength:[],extraDiscount:"",loader:false,finalTotalFee:0,stripeModalToggle:false,tooltipOpen: false}
export default function StudentEventModal(props) {
  const [eventsData,setState] =useState(registering);
  const {alldayORcustom,eventPricing,discount,discountOrFee,eventLength,checkbox,studentTypeData,eventsList,totalFee,fee,paymentTypeModalToggle,PaymentData,registrationFee,perDay,
    selectedEventsLength,extraDiscount,loader,finalTotalFee,stripeModalToggle,tooltipOpen}=eventsData;
  const navigate = useNavigate();
   const callBackpaymentData=(e)=>{
      if(e===undefined){
        Swal.fire(   "Check again",'Please try again '  ) 
     }else{
       setState((prevState)=>({
         ...prevState,
         PaymentData:e
       })) 
     }
     modelToggleHandle()
   }
   const modelToggleHandle =()=>{
      setState((prevState)=>({
          ...prevState,
          paymentTypeModalToggle:!paymentTypeModalToggle
        }))    
    }
    useEffect(()=>{
       Axios.get(`event/${props.eventId}`).then((res)=>{
           if(res.data.isCustomRange===true){
          const list = []
         let checkboxData = []
          let date1 = new Date(res.data.customRangeEvent.startDate);  
          let  date2 = new Date(res.data.customRangeEvent.endDate);   
             let time_difference = date2.getTime() - date1.getTime();  
              let days_difference = time_difference / (1000 * 60 * 60 * 24);  
             let eventStartTime = moment(res.data.customRangeEvent.startTime, ["HH:mm:ss"]).format("hh:mm a")
            let eventEndTime = moment(res.data.customRangeEvent.endTime, ["HH:mm:ss"]).format("hh:mm a")
            for (let i = 1; i < days_difference+1; i++) {
              var date = new Date(date1)
              date.setDate(date.getDate() + i)
              checkboxData[i-1] = false
              list.push({"enrollmentDate": moment(date).format("YYYY-MM-DD"), "startTime":eventStartTime,"endTime":  eventEndTime})
            }
           let length = []
          res.data.eventPricing.map((lengt,index)=>{
            length.push(lengt.totalDays);
          })
          setState((prevState)=>({
            ...prevState,
            alldayORcustom:"isCustomRange",
            checkbox : checkboxData,
            eventsList : list,
            registrationFee : res.data.registrationFee,
            perDay : res.data.perDay,
            fee:res.data.registrationFee,
            eventLength : res.data.eventPricing.length,
            eventPricing : res.data.eventPricing,
            totalFee : res.data.perDay,
            selectedEventsLength : [],discountOrFee : "",discount : 0 ,
            extraDiscount:"",finalTotalFee:0
          }))
        }
        if(res.data.isAllDay===true){
          //"isAllDay" 
          setState((prevState)=>({
            ...prevState,
            alldayORcustom:"isAllDay",
            eventsList:[{"enrollmentDate": res.data.allDayEvent.eventDate, "startTime": res.data.allDayEvent.startTime,"endTime":  res.data.allDayEvent.endTime}],
            registrationFee:res.data.registrationFee,
            perDay:res.data.perDay,
            fee:res.data.registrationFee,
            totalFee:res.data.registrationFee,
            selectedEventsLength:[],discountOrFee:"",discount:0,
            extraDiscount:"",finalTotalFee:0
          }))
        }
      }).catch(err=>{   })
     },[])
    const checkboxHandleChange = (e)=>{ 
      let eventSelected = selectedEventsLength;
       e.target.checked?(eventSelected.push(e.target.name)):(eventSelected.pop(e.target.name));
       let amouunt = e.target.checked?fee+perDay:fee-perDay;
        let checked = checkbox;
       if(checked.length<e.target.name){
        checked[e.target.name] = e.target.value
       }else{
         checked[e.target.name] = !checked[e.target.name]
       } 
       setState((prevState)=>({
        ...prevState,
         checkbox:checked,fee:amouunt,selectedEventsLength:eventSelected,totalFee:amouunt,extraDiscount:""
      }))
      eventPricing.map((mapPricing,index)=>{
       
      if(eventSelected.length>mapPricing.totalDays){
        if(mapPricing.eventPricingCriteria.name==="Greater Than"){
          if(mapPricing.discountOrFee.name==="Discount %"){
             setState((prevState)=>({
              ...prevState,
              discountOrFee:mapPricing.discountOrFee.name,discount:mapPricing.discount,
              totalFee:amouunt-((amouunt/ 100) * mapPricing.discount),finalTotalFee:amouunt-((amouunt/ 100) * mapPricing.discount),
              extraDiscount:""
            }))
          }
          if(mapPricing.discountOrFee.name==="Fee $"){
             setState((prevState)=>({
              ...prevState,
              discountOrFee:mapPricing.discountOrFee.name,discount:mapPricing.discount,totalFee:amouunt-mapPricing.discount,finalTotalFee:amouunt-mapPricing.discount,extraDiscount:""
            }))
          }
        }
       }
       if(eventSelected.length<=mapPricing.totalDays){
        if(mapPricing.eventPricingCriteria.name==="Less Than Or Equal To"){
          if(mapPricing.discountOrFee.name==="Discount %"){
             setState((prevState)=>({
                      ...prevState,
                      discountOrFee:mapPricing.discountOrFee.name,discount:mapPricing.discount,
                      totalFee:amouunt-((amouunt/ 100) * mapPricing.discount),finalTotalFee:amouunt-((amouunt/ 100) * mapPricing.discount),
                      extraDiscount:""
                    }))
          }
          if(mapPricing.discountOrFee.name==="Fee $"){
             setState((prevState)=>({
              ...prevState,
              discountOrFee:mapPricing.discountOrFee.name,discount:mapPricing.discount,totalFee:amouunt-mapPricing.discount,finalTotalFee:amouunt-mapPricing.discount,
              extraDiscount:""
            }))
          }
        }
       }
      })
      if(alldayORcustom==="isAllDay"){
         setState((prevState)=>({
          ...prevState, finalTotalFee:amouunt 
        }))
      }
    }
  const extraDiscountHandleChange=(e)=>{
     setState((prevState)=>({
      ...prevState,extraDiscount:e.target.value,finalTotalFee:totalFee-e.target.value
    }))
  }
  const stripeModalToggleHandle=()=>{
    setState((prevState)=>({
      ...prevState,
      stripeModalToggle:!stripeModalToggle, 
    }))
  }
  const submitEventData=()=>{ 
    if(PaymentData===""){
      Swal.fire({
        position : 'center',
        icon     : 'info',
        title    : 'Please select payment type..!',
        showConfirmButton: false,
        timer    : 1500
      })
    }else{
      setState((prevState)=>({...prevState,loader:true}))
       if(props.studentTypeData.currentStudentId===""){
        //gueststudent
        let eventEnrollmentData = []
        eventsList.map((event,index)=>{
          if(checkbox[index]===true){
            eventEnrollmentData.push(event)
          }
        })
        let payload ={
          "totalFee": finalTotalFee,
          "guestStudent": {
              "firstName" : props.studentTypeData.firstName,
              "lastName"  : props.studentTypeData.lastName,
              "dob"       :  moment(props.studentTypeData.birthDate).format("YYYY-MM-DD"),
              "email"     : props.studentTypeData.email,
              "phone"     : props.studentTypeData.phone,
              "address": {
                "addressLine1": props.studentTypeData.address,
                "addressLine2": props.studentTypeData.address2,
                "pinCode": props.studentTypeData.zipcode,
                "city": props.studentTypeData.city,
                "state": {
                    "id": props.studentTypeData.state.value,
                    "name": props.studentTypeData.label
                }
            }
          },
          "customRangeEventEnrollmentDate":  eventEnrollmentData,
          }
          if(PaymentData.paymentType.label==="AutoPay"){
            payload.autoPay = {
              "accountNumber" : PaymentData.accountNo,
              "routingNumber" :  PaymentData.routingNo,
              "chargeAmount"  : PaymentData.chargeAmount
            }
            }
          if(PaymentData.paymentType.label==="Card"){
            
            payload.usAePayCardPaymentResponse= {
              "amount": PaymentData.chargeAmount, 
              "currency": PaymentData.currency.value,  
              "description": PaymentData.description,
              "cardNumber": PaymentData.cardNumber,
              "cardExpiryDate":moment(PaymentData.expireDate).format("YYYY-MM-DD"),
              "cardCode": PaymentData.pin
            }
          }
          if(PaymentData.paymentType.label==="Cheque"){
             payload.usAePayChequePayment = {
              "payeeName"    : PaymentData.payeeName,
              "chequeNumber" : PaymentData.chequeNo,
              "date"         : moment( PaymentData.date).format("YYYY-MM-DD"),
              "amount" : PaymentData.chargeAmount,
              "frontPictureAttachment":PaymentData.frontPictureAttachment,
              "backPictureAttachment":PaymentData.backPictureAttachment,
              "checkAccountNumber": PaymentData.accountNo,
              "checkRoutingNumber": PaymentData.routingNo,
            }
          }
              axios.defaults.headers.common['Authorization'] =  "Bearer " + localStorage.getItem("token");
            axios.post(`${process.env.REACT_APP_BASE_URL}/custom-range-event/${props.eventId}/payment-type/${PaymentData.paymentType.value}/event-registration`,payload).then((res)=>{
               toast.success("Registered successfully", { theme: "colored" })
              setState((prevState)=>({...prevState,loader:false}))
              if(res.data.cardPaymentResponse!=null){
                localStorage.setItem("clientSecret",res.data.cardPaymentResponse.clientSecret)
                setState((prevState)=>({...prevState,stripeModalToggle:!stripeModalToggle}));
               }else{
                setTimeout(() => {
                  navigate(`/events/eventregister/${props.eventId}`)
                 }, 1000); 
               }                     
            }).catch(err=>{
              setState((prevState)=>({...prevState,loader:false}))
              Swal.fire(
                      err.response.data.message,
                      'Please try again '
                    )
            })
      }else{
       //"existing student registering"
        let eventEnrollmentData = []
        eventsList.map((event,index)=>{
          if(checkbox[index]===true){
            eventEnrollmentData.push(event)
          }
        })
        let existingstudentPayload ={
          "totalFee": finalTotalFee,
          "customRangeEventEnrollmentDate": eventEnrollmentData,
      }
      if(PaymentData.paymentType.label==="AutoPay"){
        existingstudentPayload.autoPay = {
           "accountNumber" : PaymentData.accountNo,
           "routingNumber" :  PaymentData.routingNo,
           "chargeAmount"  : PaymentData.chargeAmount
         }
        }
       if(PaymentData.paymentType.label==="Card"){
        existingstudentPayload.cardPaymentResponse = {
             "amount": PaymentData.chargeAmount,
            "currency": PaymentData.currency.value,
            "description": PaymentData.description
         } 
       }
       if(PaymentData.paymentType.label==="Cheque"){
        existingstudentPayload.chequePayment = {
           "payeeName"    : PaymentData.payeeName,
           "chequeNumber" : PaymentData.chequeNo,
           "date"         : moment(PaymentData.date).format("YYYY-MM-DD"),
           "chargeAmount" : PaymentData.chargeAmount,
          "frontPictureAttachment":PaymentData.frontPictureAttachment,
          "backPictureAttachment":PaymentData.backPictureAttachment
         }
       }
        axios.defaults.headers.common['Authorization'] =  "Bearer " + localStorage.getItem("token");
       axios.post(`${process.env.REACT_APP_BASE_URL}/custom-range-event/${props.eventId}/student/${props.studentTypeData.currentStudentId}/payment-type/${PaymentData.paymentType.value}/event-registration`,existingstudentPayload).then((res)=>{
         toast.success("Registered successfully", { theme: "colored" })
       setState((prevState)=>({...prevState,loader:false}))
       if(res.data.cardPaymentResponse!=null){
        localStorage.setItem("clientSecret",res.data.cardPaymentResponse.clientSecret)
        setState((prevState)=>({...prevState,stripeModalToggle:!stripeModalToggle}));
       }else{
        setTimeout(() => {
          navigate(`/events/eventregister/${props.eventId}`)
         }, 1000); 
       }           
     }).catch(err=>{
        setState((prevState)=>({...prevState,loader:false}))
          Swal.fire(
               err.response.data.message,
                'Please try again '
             )
        })
      }
    }
  }
  const toggle=()=> {
    setState((prevState)=>({...prevState,tooltipOpen: !tooltipOpen}))
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
    <Modal isOpen={stripeModalToggle} toggle={()=>stripeModalToggleHandle()} backdrop="static" centered>
        <ModalHeader toggle={()=>stripeModalToggleHandle()} >Card payment</ModalHeader>
        <ModalBody>
          <CardPay rout={`/events/eventregister/${props.eventId}`}/>
        </ModalBody>
      </Modal>  
      <ModalHeader className='cardbg'>Registering Student {props.studentTypeData.currentStudentId!==""?<span>{props.studentTypeData.currentStudentData.firstName} {props.studentTypeData.currentStudentData.lastName}</span>:<span>{props.studentTypeData.firstName} {props.studentTypeData.lastName}</span>}</ModalHeader>
        <ModalBody>
        <Modal isOpen={paymentTypeModalToggle} toggle={modelToggleHandle} centered backdrop="static"> 
        <ModalHeader className='cardbg'>Payment Information</ModalHeader>    
        <PaymentType sendData={callBackpaymentData} contractFee={finalTotalFee}/>    
      </Modal>   
        
             <h5><strong>Events Dates</strong></h5>
            <div className='height15'></div>
                <Row style={{height:"250px",overflow:"auto"}}>
                    {/* <Col> 
                      {
                        eventsList.length===1?<>
                          { eventsList.map((mapData,index)=>{
                              return(<div style={{marginLeft:"20px"}} key={index}>
                                  <Input type="checkbox"  name={index} value={checkbox[index]} onChange={checkboxHandleChange} checked={true}/> <Label check > 
                                  <span style={{margin:"0px 0px 0px 26px"}}>{mapData.enrollmentDate} <span style={{fontSize:"12px",padding:"0px 0px 0px 10px"}}> {moment(mapData.startTimeView).format("hh:mm a")} - {moment(mapData.endTimeView).format("hh:mm a")}</span></span></Label>
                              </div>)
                          })}
                        </>:
                        <>
                            { eventsList.map((mapData,index)=>{
                              return(<div style={{marginLeft:"20px"}} key={index}>
                                  <Input type="checkbox"  name={index} value={checkbox[index]} onChange={checkboxHandleChange} /> <Label check > 
                                  <span style={{margin:"0px 0px 0px 26px"}}>{mapData.enrollmentDate} <span style={{fontSize:"12px",padding:"0px 0px 0px 10px"}}> {moment(mapData.startTimeView).format("hh:mm a")} - {moment(mapData.endTimeView).format("hh:mm a")}</span></span></Label>
                              </div>)
                            })}
                        </>
                      }  
                    </Col> */}
                      <Col>   
                    { eventsList.map((mapData,index)=>{
                    return(<div style={{marginLeft:"20px"}} key={index}> 
                                 <Input type="checkbox"  name={index} value={checkbox[index]} onChange={checkboxHandleChange} /> <Label check > 
                                <span style={{margin:"0px 0px 0px 26px"}}>{mapData.enrollmentDate} <span style={{fontSize:"12px",padding:"0px 0px 0px 10px"}}> {moment(mapData.startTimeView).format("hh:mm a")} - {moment(mapData.endTimeView).format("hh:mm a")}</span></span></Label>
                            </div>)
                     })}
                    </Col>
                </Row> 
                  <Row>
                  <Col md={3}>
                     Registration Fee = <b>{registrationFee}</b>
                  </Col>
                  <Col md={3}>
                     Per Day Fee = <b>{perDay}</b>
                  </Col>
                  <Col md={6}>
                  Registration Fee + Per Day Fee = Fee : <b>{registrationFee + perDay}</b>
                  <span style={{textDecoration: "underline", color:"blue",cursor:"pointer",paddingLeft:"10px" }} href="#" id="TooltipExample">Example</span>
                    <Tooltip placement="right" isOpen={tooltipOpen} target="TooltipExample" toggle={()=>toggle()}>
                      If event is in one day, Registration Fee + Per Day Fee = total fee.<br/>
                      If else event is more than one day, Registration Fee + Per Day Fee + Per Day Fee ....etc = total fee
                    </Tooltip>
                  </Col> 
                </Row>
                <hr/>
                <Row>
                  <Col md={3}><strong>Total Fee - {discount} {discountOrFee}</strong></Col>
                  <Col md={3}><strong> Additional discount</strong></Col>
                  <Col md={3}><strong>Final Fee</strong></Col>
                </Row> 
                <Row> 
                <Col md={2}><Input type="text" value={totalFee} disabled/></Col>
                <Col md={1}><span style={{padding:"32%",fontSize:"22px"}}>-</span></Col>
                <Col md={2}><Input name="extraDiscount" type="number"  value={extraDiscount} onChange={extraDiscountHandleChange} /></Col>
                <Col md={1}><span style={{padding:"32%",fontSize:"22px"}}>=</span> </Col>
                <Col md={2}><Input type="text" value={finalTotalFee} disabled/></Col>
                <Col md={4}>
                    <Button type="button" color='primary'  size="sm" disabled={selectedEventsLength.length>0?false:true} onClick={()=>{modelToggleHandle()}} >Pay</Button>
                </Col>
                </Row>
        </ModalBody>
        <ModalFooter>
            <Button type="button" color='secondary' size="sm" onClick={()=> props.callBackmodel("studentEventRegi")}  >Cancel</Button>
            <Button type="submit" color='primary' size="sm" onClick={()=>submitEventData()} >Save</Button>
        </ModalFooter> 
    </>
  )
}
