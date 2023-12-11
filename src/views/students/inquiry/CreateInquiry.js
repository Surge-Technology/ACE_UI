 
import React,{useState,memo, useEffect} from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { Col, Label,Card,CardBody,CardFooter, Row,Input,FormFeedback, Modal,   ModalHeader, FormGroup,Button,Spinner } from "reactstrap";
import { Formik,Form ,  ErrorMessage, } from "formik";
import * as Yup from 'yup';
import Select from 'react-select';
import Axios from "../../../hoc/axiosConfig";
import Swal from 'sweetalert2';
import moment from 'moment/moment';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import DatePicker from "react-datepicker";

let InquiryInitialData = {
  firstName:"",lastName:"",phone:"",email:"", MarketingSources:"",marketingSourceOptions:[],referedBy:"" ,referedEmail:"",
  Location:"",startDate:new Date(),inquiryType:"",inquiryTypeOptions:[],inquiryStatus:"",inquiryStatusOptions:[],
  services:"",servicesOptions:[],loader:false,uploadUrlName:"",notes:""
}
function CreateInquiry() { 
  const [initialInquiryFields,setState] = useState(InquiryInitialData);
    const {firstName,lastName, phone,email, MarketingSources,marketingSourceOptions,referedBy ,referedEmail,
      Location,startDate,inquiryType,inquiryTypeOptions,inquiryStatus,inquiryStatusOptions,services,servicesOptions,loader,
      uploadUrlName,notes} =initialInquiryFields;
   
  let Navigate = useNavigate();
  const params = useParams();

  const InquirySchema = () => Yup.object().shape({
    firstName : Yup.string().matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed").required("First Name is required"),
    lastName  : Yup.string().matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed").required("Last Name is required"),
    email     : Yup.string().required("Email is required").email("Invalid mail address"),
    phone     : Yup.string().min(10, 'Minimum 10 digits!').max(14, 'Maximum 14 digits!').required("Phone is required"),  
    inquiryType  : Yup.object().required(' Inquiry Type is required'),
    inquiryStatus: Yup.object().required('Inquiry Status is required'),
    services  : Yup.object().required('Program is required'),
    Location  : Yup.string().required('Location is required'),
    MarketingSources   : Yup.object().required("Marketing Sources is required"),
    // lengths: Yup.object().required('Length is Required')
  });
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
  const inquirySubmit=(e)=>{ 
     setState((prevState)=>({...prevState,loader:true}));
    // date: moment(values.startDate).format('YYYY-MM-DD'),
    //   checkIn: moment(values.checkIn).format("HH:mm")
    let datetim = moment(e.startDate).format('YYYY-MM-DD')+ ' ' + moment(e.startDate).format("HH:mm:ss")
      let payload ={
        "firstName" : e.firstName,
        "lastName"  : e.lastName,
        "email"     : e.email,
        "phone"     : e.phone,
        "academyLocation" : e.Location,
        "datetime"  : datetim,
        "note"      : e.notes,
        "referredBy": e.referedBy,
        "referEmail": e.referedEmail,
        "uploadUrl" : e.uploadUrlName
      }
       if(params.id==="new"){
        axios.defaults.headers.common['Authorization'] =  "Bearer " + localStorage.getItem("token");
        axios.post(`${process.env.REACT_APP_BASE_URL}/inquiry/marketing-source/${e.MarketingSources.value}/inquiry-type/${e.inquiryType.value}/inquiry-status/${e.inquiryStatus.value}/inquiry-services/${e.services.value}`,payload).then((res)=>{
          toast.success("Registered successfully", { theme: "colored" })
          setState((prevState)=>({...prevState,loader:false}));
        setTimeout(() => {
          Navigate("/studentTabs/1");
        }, 1000);
      }).catch(err=>{
           setState((prevState)=>({...prevState,loader:false}));
        Swal.fire(
                err.response.data.message,
                 'Please try again '
              )
      })
      }else{
        //inquiry//marketing-source/16/inquiry-type/3/inquiry-status/7/inquiry-services/20/inquiry/14
        axios.defaults.headers.common['Authorization'] =  "Bearer " + localStorage.getItem("token");
        axios.put(`${process.env.REACT_APP_BASE_URL}/inquiry/marketing-source/${e.MarketingSources.value}/inquiry-type/${e.inquiryType.value}/inquiry-status/${e.inquiryStatus.value}/inquiry-services/${e.services.value}/inquiry/${params.id}`,payload).then((res)=>{
          toast.success("Updated successfully", { theme: "colored" })
          setState((prevState)=>({...prevState,loader:false}));
        setTimeout(() => {
          Navigate("/studentTabs/1");
        }, 1000);
      }).catch(err=>{
          setState((prevState)=>({...prevState,loader:false}));
        Swal.fire(
                err.response.data.message,
                 'Please try again '
              )
            })
      }
  }
  useEffect(()=>{
    Axios.get("inquiry/marketing-source").then((res)=>{
      let  markectingOptins = []
         res.data.map((mapdata,index)=>{
          markectingOptins.push( { value: mapdata.id, label: mapdata.name })
         })
      setState((prevState)=>({
        ...prevState,
        marketingSourceOptions:markectingOptins,startDate:moment().format('MM/DD/YYYY')
      }))
    }).catch(err=>{
      Swal.fire(err.response.data.message,'Please try again later');
    })
    Axios.get("inquiry-type").then((res)=>{
       let  typeOptions = []
         res.data.map((mapdata,index)=>{
          typeOptions.push( { value: mapdata.id, label: mapdata.name })
         })
      setState((prevState)=>({
        ...prevState,
        inquiryTypeOptions:typeOptions
      }))
    }).catch(err=>{
      Swal.fire(err.response.data.message,'Please try again later');
    })
    Axios.get("inquiry-status").then((res)=>{
      let  StatusOptions = []
         res.data.map((mapdata,index)=>{
          StatusOptions.push( { value: mapdata.id, label: mapdata.name })
         })
      setState((prevState)=>({
        ...prevState,
        inquiryStatusOptions:StatusOptions
      }))
    }).catch(err=>{
      Swal.fire(err.response.data.message,'Please try again later');
    })
    Axios.get("inquiry-services").then((res)=>{
       let  servicesList = []
         res.data.map((mapdata,index)=>{
          servicesList.push( { value: mapdata.id, label: mapdata.name })
         })
      setState((prevState)=>({
        ...prevState,
        servicesOptions:servicesList
      }))
    }).catch(err=>{
      Swal.fire(err.response.data.message,'Please try again later');
    })
    if(params.id!=="new"){
      Axios.get(`inquiry/${params.id}`).then((res)=>{
        console.log("res",res)
         setState((prevState)=>({
          ...prevState,
        "firstName" : res.data.firstName,
        "lastName"  : res.data.lastName,
        "email"     : res.data.email,
        "phone"     : res.data.phone,
        "Location"  : res.data.academyLocation,
        "datetim"   : res.data.datetime,
        "notes"      : res.data.note,
        "referedBy": res.data.referredBy,
        "referedEmail": res.data.referEmail,
        "uploadUrl" : res.data.uploadUrlName,
       "MarketingSources": { value: res.data.marketingSource.id, label: res.data.marketingSource.name },
        inquiryType : { value: res.data.inquiryType.id, label: res.data.inquiryType.name },
        inquiryStatus : { value: res.data.inquiryStatus.id, label: res.data.inquiryStatus.name },
        services    : { value: res.data.inquiryServices.id, label: res.data.inquiryServices.name },
         }))
      }).catch(err=>{
        Swal.fire(err.response.data.message,'Please try again later');
      })
    }
  },[])
  const referedNameHandle=(event,name)=>{
    if(name==="referedBy"){
       let text = event.target.value;
      const myArray = text.split(" ");
          Axios.get(`/referral?firstName=${myArray[0]}&lastName=${myArray[1]}`).then((res)=>{
             setState((prevState)=>({
            ...prevState,
            referedEmail:res.data.length>0?res.data[0].email:""
          }))
        }).catch(err=>{
          Swal.fire(err.response.data.message,'Please try again later');
        })
    }else{
      setState((prevState)=>({
        ...prevState,
        MarketingSources:event
      }))
    }
   }
   const uploadFileHandleChange=(e)=>{
      let formdata = new FormData();
    formdata.append('image', e.target.files[0]);
     axios.defaults.headers.common['Authorization'] =  "Bearer " + localStorage.getItem("token");
    axios.post(`${process.env.REACT_APP_BASE_URL}/files/fileimage/upload`,formdata).then((res)=>{
       setState((prevState)=>({
        ...prevState,
        uploadUrlName:res.data.imageName,
      })) 
    }).catch(err=>{
      Swal.fire(err.response.data.message,'Please try again later');
    })  
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
          
     <Card className='cardm'>
        <CardBody className='cardbg'>
        <h5><strong>Create Inquiry</strong></h5>
        <Card className='cardbgw'>
          <Formik
            enableReinitialize={true}
            initialValues={initialInquiryFields}
            validationSchema={InquirySchema}
            onSubmit={inquirySubmit} 
            >           
          {({ values,setFieldValue,handleChange,handleSubmit,handleBlur,errors,touched }) => (
              <Form onSubmit={handleSubmit} >                    
                 <CardBody>
                    <Row> 
                      <Col md={6}>
                          <Label > First Name <span className='colorRed'>*</span></Label>
                          <Input name="firstName" type="text" value={values.firstName} onBlur={handleBlur} placeholder='Enter First Name' onChange={(handleChange,fieldHandleChange)}/>
                        <ErrorMessage name="firstName" component="div"  className='errmsg'></ErrorMessage>
                      </Col>
                      <Col md={6}>
                        <Label > Last Name <span className='colorRed'>*</span></Label>
                        <Input type="text" name="lastName" value={values.lastName} onBlur={handleBlur} placeholder='Enter Last Name' onChange={(handleChange,fieldHandleChange)}/>
                        <ErrorMessage name="lastName" component="div"  className='errmsg'></ErrorMessage>
                      </Col>
                    </Row>
                    <Row> 
                      <Col md={6}>
                      <Label > Phone <span className='colorRed'>*</span> </Label>
                          <Input name="phone" type="text" value={values.phone} placeholder='Enter Phone Number' onChange={(handleChange,fieldHandleChange)} onBlur={handleBlur}/>
                         <ErrorMessage name="phone" component="div"  className='errmsg'></ErrorMessage>
                      </Col>
                      <Col md={6}>
                      <Label > Email  <span className='colorRed'>*</span> </Label>
                          <Input name="email" type="text" value={values.email} placeholder='Enter Email' onChange={(handleChange,fieldHandleChange)} onBlur={handleBlur}/>
                          <ErrorMessage name="email" component="div"  className='errmsg'></ErrorMessage>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={3}>
                      <Label > Inquiry Type  <span className='colorRed'>*</span> </Label>
                            <Select
                              name="inquiryType"
                              value={inquiryType || "Select"}
                              onChange={(e)=>{setFieldValue("inquiryType",e),selectFieldHandleChange("inquiryType",e)}}
                              options={inquiryTypeOptions}
                            />
                            <ErrorMessage name="inquiryType" component="div"  className='errmsg'></ErrorMessage>
                      </Col>
                      <Col md={3}>
                      <Label > Inquiry Status  <span className='colorRed'>*</span> </Label>
                            <Select
                              name="inquiryStatus"
                              value={inquiryStatus || "Select"}
                              onChange={(e)=>{setFieldValue("inquiryStatus",e),selectFieldHandleChange("inquiryStatus",e)}}
                              options={inquiryStatusOptions}
                            />
                            <ErrorMessage name="inquiryStatus" component="div"  className='errmsg'></ErrorMessage>
                      </Col>
                      <Col md={4}>
                      <Label > Programs  <span className='colorRed'>*</span> </Label>
                            <Select
                              name="services"
                              value={services || "Select"}
                              onChange={(e)=>{setFieldValue("services",e),selectFieldHandleChange("services",e)}}
                              options={servicesOptions}
                            />
                            <ErrorMessage name="services" component="div"  className='errmsg'></ErrorMessage>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={6}>
                        <Label > Location <span className='colorRed'>*</span> </Label>
                            <Input name="Location" type="text" value={values.Location} onChange={(handleChange,fieldHandleChange)} placeholder='Enter Location' onBlur={handleBlur}/>
                          <ErrorMessage name="Location" component="div"  className='errmsg'></ErrorMessage>
                        </Col>
                        <Col md={6}>
                            <Label > Date</Label>
                               <DatePicker
                              name="startDate"
                              selected={values.startDate ? new Date(values.startDate) : null}
                              onChange={date => dateHandleChange("startDate",date)}
                             //onChange={(e)=>{setFieldValue("startDate",e)}}
                              showTimeSelect
                              dateFormat="Pp"
                              />
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                          <Label ><span>How did you hear about us? </span> <span className='colorRed'>*</span></Label>
                            <Select
                              name="MarketingSources"
                              value={MarketingSources}
                              onChange={(e)=>{(setFieldValue("MarketingSources",e),referedNameHandle(e,"MarketingSources"))}}
                              options={marketingSourceOptions}
                            />
                          <ErrorMessage name="MarketingSources" component="div"  className='errmsg'></ErrorMessage>
                        </Col> 
                      </Row> 
                   {MarketingSources.label==="Refer By Friend"?   <Row>
                        <Col md={5}>
                          <Label > Refered by  </Label>
                          <Input name="referedBy" type="text" value={referedBy} placeholder="ex: James Smith"  onBlur={(e)=>referedNameHandle(e,"referedBy")} onChange={(handleChange,fieldHandleChange)} />
                        </Col>
                        <Col md={5}>
                          <Label > Email</Label> 
                           <Input name="referedEmail" type="text" value={referedEmail} placeholder="ex: Jamesmith@gmail.com" onChange={(handleChange,fieldHandleChange)}   />
                        </Col>
                     {inquiryStatus?inquiryStatus.label==="Trial Class"?<Col md={2}>
                        <Label > Consent Form</Label>
                        <span className="btn btn-primary btn-file">
                             Upload <input type="file"   onChange={(e) =>uploadFileHandleChange(e)}/>
                          </span>
                          <span> {uploadUrlName?<b style={{color:"green"}}>Successfully Uploaded</b>:null}</span>
                        </Col>:null:null}
                      </Row>:
                      <Row> 
                        <Col md={10}>
                        <Label > Notes</Label>
                          <Input  type="textarea" name="notes" value={values.notes} onChange={(handleChange,fieldHandleChange)} placeholder='Enter some extra information...'  rows="3" />  
                        </Col>
                        {inquiryStatus?inquiryStatus.label==="Trial Class"?  <Col md={2}>
                        <Label > Consent Form</Label>
                        <span className="btn btn-primary btn-file">
                              Upload <input type="file"   onChange={(e) =>uploadFileHandleChange(e)}/>
                          </span>
                          <span> {uploadUrlName?<b style={{color:"green"}}>Successfully Uploaded</b>:null}</span>
                        </Col>:null:null}
                      </Row>}
                 </CardBody>
                <CardFooter className='centerTextalign'>
                      <Button type="button" color='secondary' className='btnbg btncncl' size="sm" onClick={()=>  Navigate("/studentTabs/1")}  >Cancel</Button>
                      <Button type="submit" color='primary' className='btnsave' size="sm"  >Save</Button>
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
export default CreateInquiry