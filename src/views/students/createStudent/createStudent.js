import React,{useState,memo, useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import { Col, Label,Card,CardBody,CardFooter, Row,Input,FormFeedback, Modal,   ModalHeader, FormGroup,Button,Spinner, ModalBody, ModalFooter } from "reactstrap";
import { Formik,Form ,  ErrorMessage, } from "formik";
import Select from 'react-select';
import PaymentType from '../../../hoc/paymentType';
import ValidationSchema from './ValidationSchema';
import Axios from "../../../hoc/axiosConfig";
import student1 from "../../../assets/images/avatars/student.jpg";
import Swal from 'sweetalert2';
import moment from 'moment/moment';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import DatePicker from "react-datepicker";
import CardApp from 'src/hoc/cardPayment/cardApp';

let initialData = {
 firstName:"",lastName:"",birthDate:"",gender:'',address:"",address2:"",city:"",state:"",zipcode:"",
  gfirstName:"",glastName:"",gaddress:"",gaddress2:"",gcity:"",gstate:"",gzipcode:"",email:"",phone:"",
 contractNameSelect:"",paymentTypeModalToggle:false,
  memberFrequency:"",fee:"",totalFee:"",discount:"",status:"New",sports:"",programName:"",batch:"",contractNameOptions:"",
  contractMemberOptions:[{ value: "selecct", label: "Select"}],startDate:"",endDate:"",sportsOptions:"",programNameOptions: [{ value: "selecct", label: "Select"}],allBatchesOptions:[{ value: "selecct", label: "Select"}],PaymentData:"",
  guardianCheckbox:false, tenureLength:"",studentImageNameForApi:"",stateOptions:"",loader:false,contractImageName:"", contractData:"",stripeModalToggle:false,member:"",memberOptions:[],sportNprogramView:false
}
function createStudent() { 
  const [initialStudentFields,setState] = useState(initialData);
    const {firstName,lastName,birthDate,gender,address,address2,city,state,zipcode,
      gfirstName,glastName,gaddress,gaddress2,gcity,gstate,gzipcode,email,phone,
       contractNameSelect,paymentTypeModalToggle,
      memberFrequency,fee,totalFee,discount,status,sports,programName,batch,contractNameOptions,
      contractMemberOptions,startDate,endDate,sportsOptions,programNameOptions,allBatchesOptions,PaymentData,
      guardianCheckbox,tenureLength,studentImageNameForApi,stateOptions,loader,contractImageName,contractData,stripeModalToggle,
      member,memberOptions,sportNprogramView} =initialStudentFields;
  const [studentImage, setStudentImage] = useState("");
  let history = useNavigate();
  let previewImage = student1;
  
  const fieldHandleChange=(e)=>{
    const { name, value } = e.target;
    if(name ==="phone"){
      const val= value.replace(/[^0-9]/g, "");
      const formattedPhoneNumber = val.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
      setState((prevState)=>({
        ...prevState,      
        [name]:formattedPhoneNumber
      }))
    }else{
      setState((prevState)=>({
       ...prevState,      
       [name]:value
     }))
    }
  }
  const dateHandleChange=(name,value)=>{
    setState((prevState)=>({
      ...prevState,      
      [name]:value
    }))
  }
  const selectFieldHandleChange=(name,value)=>{
    setState((prevState)=>({
      ...prevState,      
      [name]:value
    }))
  }
  const onSubmit=(values)=>{ 
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
      let payload = {
        "firstName" : values.firstName,
        "lastName"  : values.lastName,
        "dob"       : moment(values.birthDate).format("YYYY-MM-DD"),
        "gender"    : values.gender.value,
        "photo"     : studentImageNameForApi!==""?studentImageNameForApi:null,
        "sameAsStudent" : guardianCheckbox,
        "phone"     : values.phone,
        "email"     : values.email,
        "referBy"   : values.referedEmail,
        "address"   : {
            "addressLine1": values.address,
            "addressLine2":  values.address2,
            "pinCode": values.zipcode,
            "city"   :  values.city,
            "state"  :  { "id":values.state.value, "name": values.state.label }  
        },
        "parent": {
            "firstName" : values.gfirstName,
             "lastName" : values.glastName,
             "address"  : {
                "addressLine1": values.gaddress===""?values.address:values.gaddress,
                "addressLine2": values.gaddress2===""?values.address2:values.gaddress2,
                "pinCode"     :  values.gzipcode===""?values.zipcode:values.gzipcode,
                "city"        :  values.gcity===""?values.city:values.gcity,
                "state"       :  { "id":values.gstate===""?values.state.value:values.gstate.value, "name":values.gstate===""?values.state.label:values.gstate.label }  
            }
        },
       "contract":{
            "pricing":{
              "id":values.member.value,
              "fee":values.fee,
              "discount":values.discount,
              "totalFee":values.totalFee,
              "members":values.member.label,
              "subscriptionFrequency":{
                "id":values.memberFrequency.value,
                "name":values.memberFrequency.label
              }
          },
          "startDate":moment(values.startDate).format("YYYY-MM-DD"),
          "endDate":moment(values.endDate).format("YYYY-MM-DD"),
          "attachment": contractImageName,
        }
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
               axios.post(`${process.env.REACT_APP_BASE_URL}/sports/${values.sports.value}/program/${values.programName.value}/batch/${values.batch.value}/payment-type/${PaymentData.paymentType.value}/contract-promotion/${contractNameSelect.value}/contract-status/New/student`,payload).then((res)=>{
                toast.success("Student registered successfully", { theme: "colored" })
                  setTimeout(() => {
                    history("/studentTabs/2");
                  }, 1000);
                setState((prevState)=>({...prevState,loader:false}));
             
            }).catch(err=>{
                setState((prevState)=>({...prevState,loader:false}));
              Swal.fire(
                      err.response.data.message,
                       'Please try again '
                    )
            })
    }
  }
  const fileHandleChange=(e)=>{
    let file =URL.createObjectURL(e.target.files[0]);
    setStudentImage(file);
     let formdata = new FormData();
    formdata.append('image', e.target.files[0]);
     axios.defaults.headers.common['Authorization'] =  "Bearer " + localStorage.getItem("token");
    axios.post(`${process.env.REACT_APP_BASE_URL}/student/image/upload`,formdata).then((res)=>{
       setState((prevState)=>({
        ...prevState,
        studentImageNameForApi:res.data.imageName
      })) 
    }).catch(err=>{
      Swal.fire(err.response.data.message,'Please try again later');
    })  
  }
  
  const ContractFileHandleChange=(e)=>{
     let formdata = new FormData();
    formdata.append('image', e.target.files[0]);
     axios.defaults.headers.common['Authorization'] =  "Bearer " + localStorage.getItem("token");
    axios.post(`${process.env.REACT_APP_BASE_URL}/files/fileimage/upload`,formdata).then((res)=>{
        setState((prevState)=>({
        ...prevState,
        contractImageName:res.data.imageName,contractData:e
      })) 
    }).catch(err=>{
      Swal.fire(err.response.data.message,'Please try again later');
    })  
  }
  const removeFileHandleChange=(e)=>{
     setStudentImage("");
    Axios.delete(`/student/image/${studentImageNameForApi}`).then((response) => {
        setState((prevState)=>({
            ...prevState,
            studentImageNameForApi:""
            })) 
        }).catch((error) => {
          Swal.fire(err.response.data.message,'Please try again later');
    })
  }
  const modelToggleHandle =()=>{
    if(fee===""){
      Swal.fire({
        position: 'center',
        icon: 'info',
        title: 'Please select contract first..!',
        showConfirmButton: false,
        timer: 1500
      })
    }else{
      setState((prevState)=>({
        ...prevState,
        paymentTypeModalToggle:!paymentTypeModalToggle
      })) 
    }     
  }
  const callBackpaymentData=(e)=>{
     if(e==="payment"){
     }else{
        setState((prevState)=>({
        ...prevState,
        PaymentData:e
      })) 
     }
    modelToggleHandle()
  }
   useEffect(()=>{
     Axios.get("contract-promotions").then((res)=>{
        let  allcontract = []
         res.data.map((mapdata,index)=>{
          allcontract.push( { value: mapdata.id, label: mapdata.name })
         })
      setState((prevState)=>({
        ...prevState,
        contractNameOptions:allcontract,startDate:moment().format('MM/DD/YYYY')
      }))
    }).catch(err=>{
       Swal.fire(err.response.data.message,'Please try again later');
    })
    Axios.get("states").then((res)=>{
        let  allstatesList = []
          res.data.map((mapdata,index)=>{
            allstatesList.push( { value: mapdata.id, label: mapdata.name })
          })
       setState((prevState)=>({
         ...prevState,
         stateOptions:allstatesList 
       }))
     }).catch(err=>{
      Swal.fire(err.response.data.message,'Please try again later');
     })
    Axios.get("sport").then((res)=>{
       let  allSports = []
         res.data.map((mapdata,index)=>{
          allSports.push( { value: mapdata.id, label: mapdata.name })
         })
      setState((prevState)=>({
        ...prevState,
        sportsOptions:allSports
      }))
    }).catch(err=>{
      Swal.fire(err.response.data.message,'Please try again later');
    })
    setTimeout(()=>{
      Axios.get(`${process.env.REACT_APP_BASE_URL}/sports/all`).then((res) => {
        setState((prevState)=>({
          ...prevState,
           sports: { value: res.data[0]?res.data[0].id:null, label: res.data[0]?res.data[0].name:null },
           programName: { value: res.data[0]?res.data[0].programName[0]?res.data[0].programName[0].id:null:null, label: res.data[0]?res.data[0].programName[0]?res.data[0].programName[0].name:null:null },
           sportNprogramView:res.data[0]?res.data[0].view:null
        }))
        sportsSelectHandle({ value: res.data[0]?res.data[0].programName[0]?res.data[0].programName[0].id:null:null, label: res.data[0]?res.data[0].programName[0]?res.data[0].programName[0].name:null:null },"programName")
       }).catch((err) => { 
         Swal.fire( err.response.data.message, 'Please try again '  ) 
        })
    },1000)
   },[])
   const contractSelectHandle =(fieldData,type)=>{
    if(type==="getMembers"){
         Axios.get(`contract-promotions/${fieldData.value}/members`).then((res)=>{
          let  allmembers = []
            res.data.map((mapdata,index)=>{
            allmembers.push( { value: mapdata.id, label: mapdata.members })
            })
        setState((prevState)=>({
          ...prevState,
          memberOptions:allmembers,contractNameSelect:fieldData,memberFrequency:{},fee:"",totalFee:"",discount:""
        }))
        }).catch(err=>{
        Swal.fire(err.response.data.message,'Please try again later');
        })
    }
     if(type==="getFrequency"){
      Axios.get(`contract-promotion/${contractNameSelect.value}/members/${fieldData.label}/subscription-frequency`).then((res)=>{
          let  allmembers = []
           res.data.map((mapdata,index)=>{
            allmembers.push( { value: mapdata.id, label:  mapdata.name  })
           })
        setState((prevState)=>({
          ...prevState,
          contractMemberOptions:allmembers,member:fieldData,memberFrequency:{},fee:"",totalFee:"",discount:""
        }))
      }).catch(err=>{ })
    }if(type==="getFee"){
       Axios.get(`contract-promotion/${contractNameSelect.value}`).then((res)=>{
           let lengt = res.data.tenure.name.slice(0, 2);
        let length = parseInt(lengt);
        let startDate = new Date().setUTCHours(0,0,0,0); 
        let nextDate = new Date(startDate);
         let dateValue = nextDate.getDate()-1;
        nextDate.setDate(dateValue);
         let startDatewithLength  = nextDate.setMonth(nextDate.getMonth()+length);
         let dat =  new Date(startDatewithLength);
         let finalDate = moment(dat).format('MM/DD/YYYY')
         res.data.pricing.map((mapdata,index)=>{
              if(mapdata.id===member.value ){
              setState((prevState)=>({
                ...prevState,
                fee:res.data.basePrice+mapdata.fee,totalFee:mapdata.total,discount:mapdata.discount,
                tenureLength:length,endDate:finalDate,memberFrequency:fieldData
              }))
            }
          })
       }).catch(err=>{
        Swal.fire(err.response.data.message,'Please try again later');
       })
    }
   }
   const sportsSelectHandle = (selectedData,type)=>{
    if(type==="sports"){
       Axios.get(`sports/${selectedData.value}/program-name`).then((res)=>{
         let  allPrograms = []
           res.data.map((mapdata,index)=>{
            allPrograms.push( { value: mapdata.id, label: mapdata.name })
           })
        setState((prevState)=>({
          ...prevState,
          programNameOptions:allPrograms ,sports:selectedData,programName:"",batch:""
        }))
      }).catch(err=>{
        Swal.fire(err.response.data.message,'Please try again later');
      })
    }
    if(type==="programName"){
       Axios.get(`program-name/${selectedData.value}/batch`).then((res)=>{
        let  allBatches = []
           res.data.map((mapdata,index)=>{
               allBatches.push( { value: mapdata.id, label: mapdata.name })
              })   
        setState((prevState)=>({
          ...prevState,
          allBatchesOptions:allBatches ,programName:selectedData,batch:""
        }))
      }).catch(err=>{
        Swal.fire(err.response.data.message,'Please try again later');
      })
    }
    if(type==="batch"){
      setState((prevState)=>({
          ...prevState,
          batch:selectedData
        }))
    }
   }
   const startDateHandleChange=(e)=>{
    let chngeDAte= moment(e).format("YYYY-MM-DD")
    let startDate = new Date(chngeDAte).setUTCHours(0,0,0,0); 
    let nextDate = new Date(startDate);
    let dateValue = nextDate.getDate()-1;
    nextDate.setDate(dateValue);
    let startDatewithLength  = nextDate.setMonth(nextDate.getMonth()+tenureLength);
    let dat =  new Date(startDatewithLength);
     let finalDate = moment(dat).format('MM/DD/YYYY');
       setState((prevState)=>({
        ...prevState,
        startDate:chngeDAte,endDate:finalDate

      }))
   }
    const sameHasGuardiancheckHandle=(e)=>{
      if(e.target.checked===true){
        setState((prevState)=>({
          ...prevState,
          guardianCheckbox:e.target.checked,
             gaddress:address,
            gaddress2:address2,
            gcity:city,
            gstate:state,
            gzipcode:zipcode
        }))
      }else{
        setState((prevState)=>({
          ...prevState,
          guardianCheckbox:e.target.checked,
             gaddress:"",
            gaddress2:"",
            gcity:"",
            gstate:"",
            gzipcode:""
        }))
      }
    }
    const stripeModalToggleHandle=()=>{
      setState((prevState)=>({
        ...prevState,
        stripeModalToggle:!stripeModalToggle, 
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
      <Modal isOpen={paymentTypeModalToggle} toggle={modelToggleHandle} centered backdrop="static"> 
        <ModalHeader className='cardbg' toggle={modelToggleHandle}>Payment Information</ModalHeader>    
        <PaymentType sendData={callBackpaymentData} contractFee={totalFee}/>    
      </Modal>  
      <Modal isOpen={stripeModalToggle} toggle={()=>stripeModalToggleHandle()} backdrop="static" centered>
        <ModalHeader toggle={()=>stripeModalToggleHandle()}>Card payment</ModalHeader>
        <ModalBody>
          <CardApp />
        </ModalBody>
      </Modal>  
      <Card >
        <CardBody className='cardbg'>
        <h5><strong>Register Student</strong></h5>
        <Card className='cardbgw'>
          <Formik
            enableReinitialize={true}
            initialValues={initialStudentFields}
            validationSchema={ValidationSchema}
            onSubmit={onSubmit} 
            >           
          {({ values,setFieldValue,handleChange,handleSubmit,handleBlur,errors,touched }) => (
              <Form onSubmit={handleSubmit} >                    
                <CardBody>
                <h5><strong>Student</strong></h5> 
                  <Row>
                    <Col md={8}>
                    <Row>  
                        <Col md={4}>
                          <Label > First Name <span className='colorRed'>*</span></Label>
                            <Input name="firstName" type="text" value={values.firstName} onBlur={handleBlur} onChange={(handleChange,fieldHandleChange)} invalid={touched.firstName &&   !!errors.firstName } />
                          <ErrorMessage name="firstName" component="div"  className='errmsg'></ErrorMessage>
                        </Col>
                        <Col md={5}>
                          <Label > Last Name <span className='colorRed'>*</span></Label>
                          <Input type="text" name="lastName" value={values.lastName} onBlur={handleBlur} onChange={(handleChange,fieldHandleChange)} invalid={touched.lastName &&!!errors.lastName } />
                          <FormFeedback>{errors.lastName}</FormFeedback>
                        </Col>
                        <Col md={3}>
                          <Label> Birthdate <span className='colorRed'>*</span></Label>
                             <DatePicker
                              name="birthDate"
                              selected={values.birthDate?new Date(values.birthDate):null}
                              onChange={(e)=>{setFieldValue("birthDate",e),dateHandleChange("birthDate",e)}}
                              onBlur={handleBlur}
                              placeholderText="mm/dd/yyyy"
                            />
                          <ErrorMessage name="birthDate" component="div"  className='errmsg'></ErrorMessage>   
                        </Col>
                      </Row>
                      <Row>
                        <Col md={3}>
                          <Label > Gender <span className='colorRed'>*</span> </Label>
                           <Select
                              name="gender"
                              defaultValue={gender}
                               onChange={(e)=>{setFieldValue("gender",e),selectFieldHandleChange("gender",e)}}
                              options={[ { value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' },
                              { value: 'Other', label: 'Other' },]}
                            />
                            <ErrorMessage name="gender" component="div"  className='errmsg'></ErrorMessage>
                        </Col>
                        <Col md={9}>
                          <Label > Address <span className='colorRed'>*</span></Label>
                         <Input name="address" type="text" value={values.address} onChange={(handleChange,fieldHandleChange)} invalid={touched.address &&   !!errors.address } />
                          <FormFeedback>{errors.address}</FormFeedback>
                        </Col>
                        <div className='height15'></div>
                        <Col>
                           <Input name="address2" type="text" value={values.address2} onChange={(handleChange,fieldHandleChange)}  />
                        </Col>
                      </Row>
                      <Row>
                        <Col md={5}>
                          <Label > City <span className='colorRed'>*</span> </Label>
                          <Input name="city" type="text" value={values.city} onChange={(handleChange,fieldHandleChange)} invalid={touched.city &&   !!errors.city } />
                          <FormFeedback>{errors.city}</FormFeedback>
                        </Col>
                        <Col md={4}>
                          <Label > State   <span className='colorRed'>*</span></Label>
                          <Select
                            name="state"
                            defaultValue={state}
                            onChange={(e)=>{setFieldValue("state",e),selectFieldHandleChange("state",e)}}
                            options={stateOptions}
                           />
                          <ErrorMessage name="state" component="div"  className='errmsg'></ErrorMessage>
                        </Col>
                        <Col md={3}>
                          <Label > Zipcode <span className='colorRed'>*</span> </Label>
                           <Input name="zipcode" type="number" value={values.zipcode} onChange={(handleChange,fieldHandleChange)} onBlur={handleBlur} invalid={touched.zipcode &&   !!errors.zipcode } />
                          <FormFeedback>{errors.zipcode}</FormFeedback>
                        </Col>
                      </Row>
                      <hr/>
                        <h5><strong>Guardian</strong></h5>
                        
                      <Row>
                        <Col md={6}>
                          <Label > First Name  <span className='colorRed'>*</span> </Label>
                             <Input name="gfirstName" type="text" value={values.gfirstName} onChange={(handleChange,fieldHandleChange)} invalid={touched.gfirstName &&   !!errors.gfirstName } />
                          <FormFeedback>{errors.gfirstName}</FormFeedback>
                        </Col>
                        <Col md={6}>
                          <Label > Last Name  <span className='colorRed'>*</span></Label>
                           <Input name="glastName" type="text" value={values.glastName} onChange={(handleChange,fieldHandleChange)} invalid={touched.glastName &&   !!errors.glastName } />
                          <FormFeedback>{errors.glastName}</FormFeedback>
                        </Col>
                      </Row><div className='height15'></div>
                      <Row ><FormGroup check  ><Col>
                           <Input type="checkbox" name="guardianCheckbox" value={guardianCheckbox} onChange={sameHasGuardiancheckHandle}/> <Label check ><span>Same as Student</span></Label>
                          </Col></FormGroup>
                        </Row>
                      <Row>
                        <Col md={12}>
                        <Label > Address </Label>
                           <Input name="gaddress" type="text" value={values.gaddress} disabled={guardianCheckbox?true:false} onChange={(handleChange,fieldHandleChange)} invalid={touched.gaddress &&   !!errors.gaddress } />
                          <FormFeedback>{errors.gaddress}</FormFeedback>
                        </Col>
                      </Row>
                      <div className='height15'></div>
                       <Row>
                        <Col>
                            <Input name="gaddress2" type="text" value={values.gaddress2} disabled={guardianCheckbox?true:false} onChange={(handleChange,fieldHandleChange)} />
                        </Col>
                      </Row>
                      <Row>
                        <Col md={5}>
                          <Label > City </Label>
                           <Input name="gcity" type="text" value={values.gcity} disabled={guardianCheckbox?true:false} onChange={(handleChange,fieldHandleChange)} invalid={touched.gcity &&   !!errors.gcity } />
                          <FormFeedback>{errors.gcity}</FormFeedback>
                        </Col>
                        <Col md={4}>
                          <Label > State   </Label>
                          <Select
                           isDisabled={guardianCheckbox?true:false}
                            name="gstate"
                            value={gstate}
                            onChange={(e)=>{setFieldValue("gstate",e),selectFieldHandleChange("gstate",e)}}
                            options={stateOptions}
                          />
                          <ErrorMessage name="gstate" component="div"  className='errmsg'></ErrorMessage>
                        </Col>
                        <Col md={3}>
                          <Label > Zipcode </Label>
                           <Input name="gzipcode" type="number" value={values.gzipcode} disabled={guardianCheckbox?true:false} onChange={(handleChange,fieldHandleChange)} invalid={touched.gzipcode &&   !!errors.gzipcode } />
                          <FormFeedback>{errors.gzipcode}</FormFeedback>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={7}> 
                          <Label > Email  <span className='colorRed'>*</span> </Label>
                          <Input name="email" type="text" value={values.email} onChange={(handleChange,fieldHandleChange)} onBlur={handleBlur} invalid={touched.email &&   !!errors.email } />
                          <FormFeedback>{errors.email}</FormFeedback>
                        </Col>
                        <Col md={5}>
                          <Label > Phone <span className='colorRed'>*</span> </Label>
                          <Input name="phone" type="text" value={values.phone} onChange={(handleChange,fieldHandleChange)} onBlur={handleBlur} invalid={touched.phone &&   !!errors.phone } />
                          <FormFeedback>{errors.phone}</FormFeedback>
                        </Col>
                      </Row>
                      <hr></hr>
                      {/* <h5><strong>Sports Details</strong></h5> */}
                      <Row>
                        {values.sportNprogramView?<> 
                            <Col md={4}>
                            <Label > Sports  <span className='colorRed'>*</span> </Label>
                            <Select
                              name="sports"
                              value={sports || "Select"}
                              onChange={(e)=>{setFieldValue("sports",e),sportsSelectHandle(e,"sports")}}
                              options={sportsOptions}
                            />
                            <ErrorMessage name="sports" component="div"  className='errmsg'></ErrorMessage>
                            </Col>
                            <Col md={4}>
                              <Label > Program Name   <span className='colorRed'>*</span></Label>
                              <Select
                                name="programName"
                                value={programName || "Select"}
                                onChange={(e)=>{setFieldValue("programName",e),sportsSelectHandle(e,"programName")}}
                                options={programNameOptions}
                              />
                              <ErrorMessage name="programName" component="div"  className='errmsg'></ErrorMessage>
                            </Col></>:null}
                            <Col md={4}>
                              <Label > Batch  <span className='colorRed'>*</span> </Label>
                              <Select
                                name="batch"
                                value={batch || "Select"}
                                onChange={(e)=>{setFieldValue("batch",e),sportsSelectHandle(e,"batch")}}
                                options={allBatchesOptions}
                              />
                              <ErrorMessage name="batch" component="div"  className='errmsg'></ErrorMessage>
                            </Col>
                          </Row>
                     </Col>
                   <Col md={4}>
                      <Row>
                         <div className="card"  >
                       <img  src={studentImage != ""?studentImage:previewImage} style={{width:"80%",height:"300px",objectFit: "cover", margin: "4px 0 2px",marginLeft:"auto",marginRight:"auto",borderRadius:"50%"}}/>
                        <div className="card-footer cardimgv" >
                        {studentImage != ""?<Button type="button" color="secondary" className='floatl' onClick={(e) =>removeFileHandleChange(e)}  >Remove</Button>: 
                          <span className="btn btn-primary btn-file">
                              Upload<input type="file" accept=".jpg, .jpeg, .png"  onChange={(e) =>fileHandleChange(e)}/>
                          </span>}
                       </div> 
                       </div>
                      </Row>
                        <div className='height15'></div>
                        <Row>
                        <Card>
                      <CardBody>
                        <Row>
                            <Col md={9}><h5><strong>Contract</strong></h5> </Col>
                            <Col md={2}><Button type="button" color="primary" size="sm" onClick={modelToggleHandle}>Pay</Button></Col>
                        </Row>
                        <Row><Col>
                        <Label > Name   <span className='colorRed'>*</span></Label>
                          <Select
                            name="contractNameSelect"
                            defaultValue={contractNameSelect}
                            onChange={(e)=>{setFieldValue("contractNameSelect",e),contractSelectHandle(e,"getMembers")}}
                            options={contractNameOptions}
                          />
                          <ErrorMessage name="contractNameSelect" component="div"  className='errmsg'></ErrorMessage>
                          </Col>
                        </Row>
                        <Row>
                        <Col  md={3}>
                          <Label > Member   <span className='colorRed'>*</span> </Label>
                            <Select
                              name="member"
                              defaultValue={member}
                              onChange={(e)=>{setFieldValue("member",e),contractSelectHandle(e,"getFrequency")}}
                              options={memberOptions}
                            />
                            <ErrorMessage name="member" component="div"  className='errmsg'></ErrorMessage>
                          </Col>
                          <Col  md={5}>
                          <Label >Frequency  <span className='colorRed'>*</span> </Label>
                            <Select
                              name="memberFrequency"
                              defaultValue={memberFrequency}
                              onChange={(e)=>{setFieldValue("memberFrequency",e),contractSelectHandle(e,"getFee")}}
                              options={contractMemberOptions}
                            />
                            <ErrorMessage name="memberFrequency" component="div"  className='errmsg'></ErrorMessage>
                          </Col>
                          <Col md={4}>
                            <Label > Base Fee $ </Label>
                            <span className='displayNone'>{values.fee=fee}</span>
                            <Input name="fee" type="number" placeholder='$' value={fee} disabled onChange={handleChange}  />
                          </Col>
                        </Row>
                        <Row>
                          <Col md={4}>
                            <Label > Discount % </Label>
                            <span className='displayNone'>{values.discount=discount}</span>
                            <Input name="discount" type="number" placeholder='%' value={discount} disabled onChange={fieldHandleChange}  />
                          </Col>
                          <Col md={4}>
                            <Label > Total Fee $ </Label> 
                            <span className='displayNone'>{values.totalFee=totalFee}</span>
                            <Input name="totalFee" type="number" placeholder='$' value={totalFee} disabled onChange={handleChange} />
                          </Col>
                          <Col md={4}>
                            <Label > Status </Label>
                            <span className='displayNone'>{values.status=status}</span>
                            <Input name="status" type="text" value={values.status} disabled onChange={handleChange}  />
                          </Col>
                        </Row>
                        <Row>
                          <Col md={6}>
                            <Label > Start Date  </Label>
                            <span className='displayNone'>{values.startDate=startDate}</span>
                            <DatePicker
                              name="startDate"
                              selected={values.startDate?new Date(values.startDate):null}
                              onChange={(e)=>{setFieldValue("startDate",e),startDateHandleChange(e)}}
                              onBlur={handleBlur}
                              placeholderText="mm/dd/yyyy"
                            />
                          <ErrorMessage name="startDate" component="div"  className='errmsg'></ErrorMessage>  
                          </Col>
                          <Col md={6}>
                            <Label > End Date  </Label>
                            <span className='displayNone'>{values.endDate=endDate}</span> 
                             <DatePicker
                               name="endDate"
                              selected={values.endDate?new Date(values.endDate):null}
                              onChange={(e)=>{setFieldValue("endDate",e),startDateHandleChange(e)}}
                              onBlur={handleBlur}
                              placeholderText="mm/dd/yyyy"
                              disabled
                            />
                          </Col>
                        </Row>
                        <Row>
                        <div className='height15'></div>
                          <Col md={6}>
                           <span className="btn btn-primary btn-file">
                             Contract Upload <input type="file"   onChange={(e) =>ContractFileHandleChange(e)}/>
                          </span>
                         
                          </Col>
                          <Col md={6}>
                          <span> {contractImageName?<b style={{color:"green"}}>Successfully Uploaded</b>:null}</span>
                          </Col>
                        </Row>
                        <Row> <ErrorMessage name="contractImageName" component="div"  className='errmsg'></ErrorMessage></Row>
                      </CardBody>
                      </Card> 
                        </Row>
                       </Col>
                  </Row>
                </CardBody>
                <CardFooter>
                    <Button type="button" color='secondary' size="sm" onClick={()=> history("/studentTabs/2")}  className="floatg btncncl">Cancel</Button>
                    <Button type="submit" color='primary' size="sm" className='floatgM btnsave'>Save</Button>
                </CardFooter>            
              </Form>
            )}
          </Formik>
        </Card>
        </CardBody>
      </Card>
    </>
  )
}
export default createStudent