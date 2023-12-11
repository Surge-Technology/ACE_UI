import React,{useState, useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import { Col,Badge, Label,Card,CardBody,CardFooter, Row,Input, Modal, ModalHeader, Button,Spinner } from "reactstrap";
import { Formik,Form,ErrorMessage } from "formik";
import * as Yup from "yup";
import Select from 'react-select';
 import Axios from "../../../hoc/axiosConfig";
import Swal from 'sweetalert2';
import moment from 'moment/moment';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { Accordion,  AccordionBody,AccordionHeader, AccordionItem,} from 'reactstrap';
import student1 from "../../../assets/images/avatars/student.jpg";
import "./student.css";
import DeactivationModal from './deactivationModal';
import EditStatusModal from './editStatusModal';
import HistoryModal from './historyModal';
import { useParams } from 'react-router-dom';
import PaymentType from 'src/hoc/paymentType';
import DatePicker from "react-datepicker";

const colorr = ["primary","success","warning","info","primary","success","warning","info"];

const initialData = {firstName:"",lastName:"",birthDate:"",dateJoined:"",address:"",address2:"",city:"",state:"",
zipcode:"",studentImageNameForApi:null,gfirstName:"",glastName:"",gaddress:"",gaddress2:"",gcity:"",gstate:"",gzipcode:"",
email:"",phone:"",contractNameSelect:"",memberFrequency:"",fee:"",discount:"",totalFee:"",startDate:"",endDate:"",contractStatus:"",contractStatusOption:"",stateOptions:"",
programNameOptions:"",sports:"",programName:"",batch:"",allBatchesOptions:"",sportsOptions:"",deactivationModalToggle:false,editStatusModalToggle:false,
contractEditButton:false,historyButtonClick:false,paymentButtonClick:false,contractNameOptions:"",contractMemberOptions:"",tenureLength:"",sameAsStudent:"",
referBy:"",gender:"",addressId:"",parentId:"",gaddressId:"",loader:false,studentStatusLevel:[],studentStatusSubLevel:[],contractId:"",chaqueId:"",cardId:"",
contractImageName:"",notes:"",member:"",memberOptions:[],sportNprogramView:false}
export default function editStudent() {
    const [initialStateData,setState]=useState(initialData);
    const [studentImage, setStudentImage] = useState("");
    const [openAccordion, setOpenAccordion] = useState('2');
    const {firstName,lastName,birthDate,dateJoined,address,address2,city,state,zipcode,studentImageNameForApi,
        gfirstName,glastName,gaddress,gaddress2,gcity,gstate,gzipcode,email,phone,contractNameSelect,memberFrequency,
        fee,discount,totalFee ,startDate,endDate,contractStatus,contractStatusOption,stateOptions,programNameOptions,sports,programName,batch,
        allBatchesOptions,sportsOptions,deactivationModalToggle,editStatusModalToggle,contractEditButton,historyButtonClick,paymentButtonClick,
        contractNameOptions,contractMemberOptions,tenureLength,sameAsStudent,referBy,gender,addressId,parentId,gaddressId,loader,studentStatusLevel,studentStatusSubLevel,
        contractId,chaqueId,cardId,contractImageName,notes,member,memberOptions,sportNprogramView} = initialStateData;
    const staticPreviewImage = student1;
    const params = useParams();
    const navigate = useNavigate();
    const toggleAccordion = (id) => {
       if (openAccordion === id) {
        setOpenAccordion("");
      } else {
        setOpenAccordion(id);
      }
    };
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
    const onSubmit=(values)=>{
        setState((prevState)=>({...prevState,loader:true}))
        let payload={
            "firstName": values.firstName,
            "lastName": values.lastName,
            "dob":  values.birthDate===null?null:moment( values.birthDate).format("YYYY-MM-DD"),
            "gender": gender,
            "photo": studentImageNameForApi,
            "sameAsStudent": sameAsStudent,
            "phone": values.phone,
            "email": values.email,
            "notes":values.notes,
            "referBy": referBy,
            "address": {
                "id":addressId,
                "addressLine1": values.address,
                "addressLine2": values.address2,
                "pinCode": values.zipcode,
                "city": values.city,
                "state"  :  { "id":values.state.value, "name": values.state.label }
            },
            "parent": {
                "id":parentId,
                "firstName": values.gfirstName,
                "lastName": values.glastName,
                "address": {
                    "id":gaddressId,
                    "addressLine1": values.gaddress,
                    "addressLine2": values.gaddress2,
                    "pinCode": values.gzipcode,
                    "city": values.gcity,
                    "state"  :  { "id":values.gstate.value, "name": values.gstate.label }
                }
            }
        }
        axios.defaults.headers.common['Authorization'] =  "Bearer " + localStorage.getItem("token");;
            axios.put(`${process.env.REACT_APP_BASE_URL}/sports/${values.sports.value}/program/${values.programName.value}/batch/${values.batch.value}/student/${params.id}/update-student`,payload).then((res)=>{
             toast.success("Student updated successfully", { theme: "colored" })
            setTimeout(() => {
                 navigate("/studentTabs/2");
            }, 1000);   
            setState((prevState)=>({...prevState,loader:false}))
        }).catch((err)=>{
            setState((prevState)=>({...prevState,loader:false}));
             Swal.fire(
                err.response.data.message,
                 'Please try again '
              )
        })
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
               allBatchesOptions:allBatches ,programName:selectedData
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
    const contractEditHandle= ()=>{
        setState((prevState)=>({
           ...prevState,
           contractEditButton:!contractEditButton
       }))  
    }   
    const fileHandleChange=(e)=>{
        let file =URL.createObjectURL(e.target.files[0])
       setStudentImage(file)
        let formdata = new FormData();
       formdata.append('image', e.target.files[0]);
        axios.defaults.headers.common['Authorization'] =  "Bearer " + localStorage.getItem("token");;
       axios.post(`${process.env.REACT_APP_BASE_URL}/student/image/upload`,formdata).then((res)=>{
         setState((prevState)=>({
           ...prevState,
           studentImageNameForApi:res.data.imageName
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
                studentImageNameForApi:null
                })) 
            }).catch((error) => {
                Swal.fire(err.response.data.message,'Please try again later');
        })
    }
    useEffect(()=>{
        studentGetApiDataHandle()
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
         Axios.get("contract-promotions/contract").then((res)=>{
             let  allcontract = []
                res.data.map((mapdata,index)=>{
                 allcontract.push( { value: mapdata.id, label: mapdata.name })
                })
             setState((prevState)=>({
               ...prevState,
               contractNameOptions:allcontract,startDate:moment().format('YYYY-MM-DD')
             }))
        }).catch(err=>{
            Swal.fire(err.response.data.message,'Please try again later');
        })
        Axios.get("contract-status/contract").then((res)=>{
                  let  allcontractStatus = []
                    res.data.map((mapdata,index)=>{
                        allcontractStatus.push( { value: mapdata.name, label: mapdata.name })
                    })
                 setState((prevState)=>({
                   ...prevState,
                   contractStatusOption:allcontractStatus   
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
    },[])
    const studentGetApiDataHandle =()=>{
        Axios.get(`student/${params.id}`).then((res)=>{
             setState((prevState)=>({
                ...prevState,
                firstName:res.data.firstName,lastName:res.data.lastName,birthDate:moment(res.data.dob).format("MM/DD/YYYY"),dateJoined:moment(res.data.creationDate).format('MM/DD/YYYY'),
                address:res.data.address.addressLine1,address2:res.data.address.addressLine2,
                city:res.data.address.city,state:{value: res.data.address.state.id,label:  res.data.address.state.name}, zipcode:res.data.address.pinCode,
                gfirstName:res.data.parent.firstName,glastName:res.data.parent.lastName,gcity:res.data.parent.address.city,
                gzipcode:res.data.parent.address.pinCode,gaddress:res.data.parent.address.addressLine1,gaddress2:res.data.parent.address.addressLine2,
                gstate:{value: res.data.parent.address.state.id,label:  res.data.parent.address.state.name},email:res.data.email,phone:res.data.phone,sports:{value: res.data.sports.id,label:  res.data.sports.name},
                programName:{value: res.data.program.id,label:  res.data.program.name},batch:{value: res.data.batch.id,label:  res.data.batch.name},
                contractNameSelect:{value: res.data.contract.contractPromotion.id,label:res.data.contract.contractPromotion.name},
             memberFrequency:{value: res.data.contract.pricing.subscriptionFrequency.id,label:  res.data.contract.pricing.subscriptionFrequency.name},    
            fee: parseInt(res.data.contract.pricing.fee) ,discount:res.data.contract.pricing.discount,totalFee:res.data.contract.pricing.total,startDate:res.data.contract.startDate,
                endDate:res.data.contract.endDate,contractStatus:{value: res.data.contract.contractStatus,label:  res.data.contract.contractStatus},
                tenureLength:res.data.contract.contractPromotion.tenure.name.slice(0, 2),sameAsStudent:res.data.sameAsStudent,
                referBy:res.data.referBy,gender:res.data.gender,studentImageNameForApi:res.data.photo,addressId:res.data.address.id,
                 parentId:res.data.parent.id,gaddressId:res.data.parent.address.id,
                studentStatusLevel:res.data.studentCurrentBeltStatus===null?[]:res.data.studentCurrentBeltStatus.level,
                studentStatusSubLevel:res.data.studentCurrentBeltStatus===null?[]:res.data.studentCurrentBeltStatus.subLevel,
                contractId:res.data.contract.id,
                // cardId:res.data.cardPaymentResponse===null?"":res.data.cardPaymentResponse.id,
                // chaqueId:res.data.chequePayment===null?"":res.data.chequePayment.id,
                contractImageName:res.data.contract.attachment,
                notes:res.data.notes,
               
                member:{value: res.data.contract.pricing.id,label:  res.data.contract.pricing.members}
               }))
              
                sportsSelectHandle({value: res.data.sports.id,label:  res.data.sports.name},"sports");
              sportsSelectHandle({value: res.data.program.id,label:  res.data.program.name},"programName");  
              Axios.get(`contract-promotions/${res.data.contract.contractPromotion.id}/members`).then((res)=>{
                let  allmembers = []
                  res.data.map((mapdata,index)=>{
                  allmembers.push( { value: mapdata.id, label: mapdata.members })
                  })
              setState((prevState)=>({
                ...prevState,
                memberOptions:allmembers
              }))
              }).catch(err=>{ }) 
              setTimeout(() => {
                sportsSelectHandle({value: res.data.batch.id,label:  res.data.batch.name},"batch");
                     Axios.get(`contract-promotion/${ res.data.contract.contractPromotion.id}/members/${res.data.contract.pricing.members}/subscription-frequency`).then((res)=>{
                        let  allmembers = []
                         res.data.map((mapdata,index)=>{
                          allmembers.push( { value: mapdata.id, label:  mapdata.name  })
                         })
                      setState((prevState)=>({
                        ...prevState,
                        contractMemberOptions:allmembers 
                      }))
                    }).catch(err=>{ })
                    Axios.get(`${process.env.REACT_APP_BASE_URL}/sports/all`).then((res) => {
                         setState((prevState)=>({
                          ...prevState,
                           sportNprogramView:res.data[0]?res.data[0].view:null
                        }))
                        sportsSelectHandle({ value: res.data[0]?res.data[0].programName[0]?res.data[0].programName[0].id:null:null, label: res.data[0]?res.data[0].programName[0]?res.data[0].programName[0].name:null:null },"programName")
                       }).catch((err) => { 
                         Swal.fire( err.response.data.message, 'Please try again '  ) 
                        })
              }, 2000);
              setStudentImage( res.data.photo===""?"":process.env.REACT_APP_BASE_URL_BASE+"auth/student/image/"+res.data.photo);
        }).catch(err=>{
            Swal.fire(err.response.data.message,'Please try again later');
        })
    }
    const modalHandleChange =(data)=>{ 
        if(data==="deactivation"){
            setState((prevState)=>({
                ...prevState,
                deactivationModalToggle:!deactivationModalToggle
            }))  
        }
        if(data==="editStatus"){
            setState((prevState)=>({
                ...prevState,
                editStatusModalToggle:!editStatusModalToggle
            }))  
            studentGetApiDataHandle()
        }
        if(data==="history"){
            setState((prevState)=>({
                ...prevState,
                historyButtonClick:!historyButtonClick
            }))  
        }  
        if(data==="payment"){
            setState((prevState)=>({
                ...prevState,
                paymentButtonClick:!paymentButtonClick
            }))  
        }          
      } 
    const callBackmodelHandle =(data)=>{
         modalHandleChange(data);
    }
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
                if(mapdata.subscriptionFrequency.id ===fieldData.value){
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
       if(type==="contractStatus"){
        setState((prevState)=>({
            ...prevState,
            contractStatus:fieldData
          }))
       }else{
        setState((prevState)=>({
            ...prevState,
            [type]:fieldData
          }))
       }
      } 

    const startDateHandleChange=(e)=>{
        let chngeDAte= moment(e).format("YYYY-MM-DD")
        let date = moment(chngeDAte).add(tenureLength, 'months').calendar();
        let dat = moment(date).subtract(1, 'day')
        let finalDate = moment(dat).format('MM/DD/YYYY');
        setState((prevState)=>({
            ...prevState,
            startDate:chngeDAte,endDate:finalDate
        }))
    } 
        const EditStudentSchema = () =>
        Yup.object().shape(
          {
            firstName: Yup.string().matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed ").required('First Name is required'),
            lastName  : Yup.string().matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed ").required("Last Name is required"),
            address   : Yup.string().required("Address is required"),
             city     : Yup.string().required("City is required"),
            state     : Yup.object().required("State is required"),
            gfirstName: Yup.string().required("First Name is required"),
            glastName : Yup.string().required("Last Name is required"),
            gaddress  : Yup.string().required("Address is required"),
             gcity    : Yup.string().required("City is required"),
            gstate    : Yup.object().required("State is required"),
            gzipcode  : Yup.string().min(5, 'Must be exactly 5 digits').max(5, 'Must be exactly 5 digits').required("Zipcode is required"),
            email     : Yup.string().required("Email is required").email("Invalid mail address"),
            phone     : Yup.string().min(10, 'Minimum 10 digits!').max(14, 'Maximum 14 digits!').required("Phone is required"),  
            birthDate : Yup.string().nullable().required("Birth Date is required").test(
                            "DOB",
                            "Age must be at least 5 years",
                            (date) => moment().diff(moment(date), "years") > 5
                        ),
            zipcode   : Yup.string().min(5, 'Must be exactly 5 digits').max(5, 'Must be exactly 5 digits').required("Zipcode is required"),
          });
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
  return (
    <>
     <ToastContainer /> 
     {loader?<Spinner
      className='loaderr'
       color="primary"
      > 
      Loading...
    </Spinner>:null}
        <Modal isOpen={deactivationModalToggle} toggle={()=>modalHandleChange("deactivation")} centered> 
            <ModalHeader className='cardbg'  toggle={()=>modalHandleChange("deactivation")}>Deactivation</ModalHeader>    
             <DeactivationModal studentId={params.id} callBackmodel={callBackmodelHandle} />    
        </Modal>
        <Modal isOpen={editStatusModalToggle} toggle={()=>modalHandleChange("editStatus")} centered> 
            <ModalHeader className='cardbg' toggle={()=>modalHandleChange("editStatus")}>Edit Status</ModalHeader>    
             <EditStatusModal studentId={params.id} callBackmodel={callBackmodelHandle} />    
        </Modal>
        <Modal isOpen={historyButtonClick} toggle={()=>modalHandleChange("history")} size="lg" centered> 
            <ModalHeader className='cardbg' toggle={()=>modalHandleChange("history")}>History</ModalHeader>    
             <HistoryModal studentId={params.id} callBackmodel={callBackmodelHandle} />    
        </Modal>
        <Modal isOpen={paymentButtonClick} toggle={()=>modalHandleChange("payment")} centered> 
            <ModalHeader className='cardbg' toggle={()=>modalHandleChange("payment")}>Payment</ModalHeader>    
             <PaymentType sendData={callBackmodelHandle} contractFee={totalFee} studentId={params.id} contractDetails={{"contractImageName":contractImageName,"contractId":contractId,"member":member,"cardId":cardId,"chaqueId":chaqueId,"contractPromotion":contractNameSelect,"contractStatus":contractStatus, "fee": fee,"discount": discount,"totalFee": totalFee, "membersAndFrequency": memberFrequency , "startDate": startDate,"endDate": endDate}}/>  
        </Modal>
         <Card >
            <CardBody className='cardbg'>
            <Row>
                <Col  ><h5><strong>Edit Student</strong></h5></Col>
                <Col  ><Button type="button" color="primary" size="sm" className='floatg' onClick={()=>modalHandleChange("deactivation")} > Deactivate Student</Button></Col>
            </Row>
            <div className='height15'></div>
            <Formik
            enableReinitialize={true}
             initialValues={initialStateData}
             validationSchema={EditStudentSchema}
             onSubmit={onSubmit} 
            >           
          {({ values,setFieldValue,handleChange,handleSubmit,handleBlur,errors,touched }) => (
              <Form onSubmit={handleSubmit} >   
                <Card className='cardbgw'>
                    <Row>
                        <Col md={6}> 
                            <Row>
                                <Col> 
                                    <Label > First Name  </Label>
                                    <Input name="firstName" type="text" value={values.firstName} onBlur={handleBlur} onChange={handleChange}/>
                                    <ErrorMessage name="firstName" component="div"  className='errmsg'></ErrorMessage>
                                </Col>
                                <Col> 
                                    <Label > Last Name  </Label>
                                    <Input name="lastName" type="text"  value={values.lastName} onBlur={handleBlur} onChange={handleChange} />
                                    <ErrorMessage name="lastName" component="div"  className='errmsg'></ErrorMessage>
                                </Col>
                            </Row> 
                            <Row>
                                <Col>
                                    <Label > Address  </Label>
                                    <Input name="address" type="text"  value={values.address} onBlur={handleBlur} onChange={handleChange} />
                                    <ErrorMessage name="address" component="div"  className='errmsg'></ErrorMessage>
                                </Col>
                            </Row><div className='height15'></div>
                            <Row>
                                <Col>
                                      <Input name="address2" type="text"  value={values.address2} onBlur={handleBlur} onChange={handleChange} />
                                </Col>
                            </Row>
                            <Row>
                                <Col md={6}>
                                    <Label > City  </Label>
                                    <Input name="city" type="text"  value={values.city} onBlur={handleBlur} onChange={handleChange} />
                                    <ErrorMessage name="city" component="div"  className='errmsg'></ErrorMessage>
                                </Col>
                                <Col md={3}>
                                    <Label > State  </Label> 
                                    <Select
                                        name="state"
                                            value={state || "Select"}
                                        onChange={(e)=>{setFieldValue("state",e),contractSelectHandle(e,"state")}}
                                        options={stateOptions}
                                    />
                                     <ErrorMessage name="state" component="div"  className='errmsg'></ErrorMessage>
                                </Col>
                                <Col md={3}>
                                    <Label > Zipcode  </Label>
                                    <Input name="zipcode" type="number"  value={values.zipcode} onBlur={handleBlur} onChange={handleChange} />
                                    <ErrorMessage name="zipcode" component="div"  className='errmsg'></ErrorMessage>
                                </Col>
                            </Row>
                            <div className='height15'></div>
                            <Row>
                                <Col>
                                    <Accordion open={openAccordion} toggle={toggleAccordion}>
                                        <AccordionItem>
                                            <AccordionHeader targetId="1"><Label >Guardian Information</Label></AccordionHeader>
                                                <AccordionBody accordionId="1">
                                                    <Row>
                                                        <Col> 
                                                            <Label > First Name  </Label>
                                                            <Input name="gfirstName" type="text" value={values.gfirstName} onChange={handleChange} />
                                                            <ErrorMessage name="gfirstName" component="div"  className='errmsg'></ErrorMessage>
                                                        </Col>
                                                        <Col> 
                                                            <Label > Last Name  </Label>
                                                            <Input name="glastName" type="text" value={values.glastName} onChange={handleChange} />
                                                            <ErrorMessage name="glastName" component="div"  className='errmsg'></ErrorMessage>
                                                        </Col>
                                                    </Row> 
                                                    <Row>
                                                        <Col>
                                                            <Label > Address  </Label>
                                                            <Input name="gaddress" type="text" value={values.gaddress} onChange={handleChange} />
                                                            <ErrorMessage name="gaddress" component="div"  className='errmsg'></ErrorMessage>
                                                        </Col>
                                                    </Row><div className='height15'></div>
                                                    <Row>
                                                        <Col>
                                                            <Input name="gaddress2" type="text"  value={values.gaddress2} onChange={handleChange}/>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col md={6}>
                                                            <Label > City  </Label>
                                                            <Input name="gcity" type="text" value={values.gcity} onChange={handleChange} />
                                                            <ErrorMessage name="gcity" component="div"  className='errmsg'></ErrorMessage>
                                                        </Col>
                                                        <Col md={3}>
                                                            <Label > State  </Label>
                                                            <Select
                                                                name="gstate"
                                                                 value={gstate || "Select"}
                                                                onChange={(e)=>{setFieldValue("gstate",e),contractSelectHandle(e,"gstate")}}
                                                                options={stateOptions}
                                                            />
                                                            <ErrorMessage name="gstate" component="div"  className='errmsg'></ErrorMessage>
                                                        </Col>
                                                        <Col md={3}>
                                                            <Label > Zipcode  </Label>
                                                            <Input name="gzipcode" type="number" value={values.gzipcode} onChange={handleChange} />
                                                            <ErrorMessage name="gzipcode" component="div"  className='errmsg'></ErrorMessage>
                                                        </Col>
                                                    </Row>
                                                    <Row>
                                                        <Col> 
                                                            <Label > Email  </Label>
                                                            <Input name="email" type="email" value={values.email} onChange={handleChange} />
                                                            <ErrorMessage name="email" component="div"  className='errmsg'></ErrorMessage>
                                                        </Col>
                                                        <Col> 
                                                            <Label > Phone  </Label>
                                                            <Input name="phone" type="text"  value={values.phone} onChange={(handleChange,fieldHandleChange)}/>
                                                            <ErrorMessage name="phone" component="div"  className='errmsg'></ErrorMessage>
                                                        </Col>
                                                    </Row> 
                                                </AccordionBody>
                                            </AccordionItem>
                                        <AccordionItem>
                                        <AccordionHeader targetId="2"><Label>Contract Information</Label></AccordionHeader>
                                            <AccordionBody accordionId="2">
                                                <Row> 
                                                      
                                                     <Col>
                                                        <Button type="button" color="primary" size="sm" className='floatg' onClick={contractEditHandle}>Edit</Button>
                                                        <Button type="button" color="primary" size="sm" className='floatgM' onClick={()=>modalHandleChange("history")}>History</Button>
                                                      {contractEditButton?  <Button type="button" color="primary" size="sm" className='floatgM' onClick={()=>modalHandleChange("payment")}>Payment Change</Button>:null}
                                                     </Col>
                                                </Row>
                                                <Row><Col>
                                                    <Label > Name</Label>
                                                    <Select
                                                        name="contractNameSelect"
                                                        isDisabled={!contractEditButton}
                                                        value={contractNameSelect || "Select"}
                                                        onChange={(e)=>{setFieldValue("contractNameSelect",e),contractSelectHandle(e,"getMembers")}}
                                                        options={contractNameOptions}
                                                    />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                <Col  md={3}> 
                                                    <Label > Member </Label> 
                                                        <Select
                                                            name="member"
                                                            isDisabled={!contractEditButton}
                                                            value={member}
                                                            onChange={(e)=>{setFieldValue("member",e),contractSelectHandle(e,"getFrequency")}}
                                                            options={memberOptions}
                                                        />
                                                        <ErrorMessage name="member" component="div"  className='errmsg'></ErrorMessage>
                                                    </Col>
                                                    <Col  md={5}>
                                                    <Label >Frequency</Label>
                                                         <Select
                                                            name="memberFrequency"
                                                            isDisabled={!contractEditButton}
                                                            value={memberFrequency || "Select"}
                                                            onChange={(e)=>{setFieldValue("memberFrequency",e),contractSelectHandle(e,"getFee")}}
                                                            options={contractMemberOptions}
                                                        />
                                                    </Col>
                                                    <Col md={4}>
                                                        <Label > Base Fee $ </Label>
                                                        <Input name="fee" type="number" placeholder='$' value={values.fee} onChange={handleChange} disabled />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md={4}>
                                                        <Label > Discount % </Label>
                                                        <Input name="discount" type="number" value={values.discount} onChange={handleChange} placeholder='%' disabled   />
                                                    </Col>
                                                    <Col md={4}>
                                                        <Label > Total Fee $ </Label> 
                                                        <Input name="totalFee" type="number" value={values.totalFee} onChange={handleChange} placeholder='$' disabled />
                                                        </Col>
                                                    <Col md={4}>
                                                        <Label > Status </Label>
                                                        <Select
                                                            name="contractStatus"
                                                            isDisabled={!contractEditButton}
                                                            value={contractStatus || "Select"}
                                                            onChange={(e)=>{setFieldValue("contractStatus",e),contractSelectHandle(e,"contractStatus")}}
                                                            options={contractStatusOption}
                                                        />
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md={4}>
                                                        <Label > Start Date  </Label>
                                                        <DatePicker
                                                            name="startDate"
                                                            selected={values.startDate?new Date(values.startDate):null}
                                                            onChange={(e)=>{setFieldValue("startDate",e) ,startDateHandleChange(e)}}
                                                            onBlur={handleBlur}
                                                            placeholderText="mm/dd/yyyy"
                                                            disabled={!contractEditButton}
                                                        />
                                                    </Col>
                                                    <Col md={4}>
                                                        <Label > End Date  </Label>
                                                        <DatePicker
                                                            name="endDate"
                                                            selected={values.endDate?new Date(values.endDate):null}
                                                            onChange={(e)=>{setFieldValue("endDate",e) }}
                                                            onBlur={handleBlur}
                                                            placeholderText="mm/dd/yyyy"
                                                            disabled
                                                        />
                                                    </Col>
                                                    <Col md={4}>
                                                    <span className="btn btn-primary btn-file" style={{marginTop:"12px"}}>
                                                        Contract Upload <input type="file"   onChange={(e) =>ContractFileHandleChange(e)}/>
                                                    </span>
                                                       <span> {contractImageName?<b style={{color:"green"}}>Uploaded</b>:null}</span>
                                                     </Col>
                                                </Row>
                                            </AccordionBody>
                                        </AccordionItem>
                                    </Accordion>
                                </Col>
                            </Row>                        
                        </Col>
                        <Col md={3}>
                            <Row>
                                <Col>
                                    <Label > Birth Date  </Label>
                                    <DatePicker
                                        name="birthDate"
                                        selected={values.birthDate?new Date(values.birthDate):null}
                                        onChange={(e)=>{setFieldValue("birthDate",e) }}
                                        onBlur={handleBlur}
                                        placeholderText="mm/dd/yyyy"
                                    />
                                    <ErrorMessage name="birthDate" component="div"  className='errmsg'></ErrorMessage>   
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                <div className='height15'></div>
                                    <Card>
                                        <CardBody>
                                          <Row>
                                          <Col  ><h5><strong>Status</strong></h5> </Col>
                                            <Col><Button type="button" color="primary" size="sm" className='floatg' onClick={()=>modalHandleChange("editStatus")} >Edit</Button></Col>
                                          </Row>
                                          {
                                            studentStatusSubLevel.map((mapData,index)=>{
                                           return <span key={index}> 
                                                {index===0?<Badge className='badgesize'   color={colorr[0]}>
                                                        {studentStatusLevel.name}
                                                    </Badge>:null}
                                                    <Badge className='badgesize' color={colorr[index+1]}>
                                                    {mapData.name}
                                                     </Badge>
                                            </span>
                                            })
                                          }
                                          </CardBody>
                                    </Card>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Card>
                                        <CardBody>
                                        {values.sportNprogramView?<>  <Row>
                                            <Col >
                                            <h5><strong>Sports</strong></h5>
                                            <Select
                                                name="sports"
                                                value={sports || "Select"}
                                                onChange={(e)=>{setFieldValue("sports",e),sportsSelectHandle(e,"sports")}}
                                                options={sportsOptions}
                                            />
                                             </Col>
                                        </Row>
                                        <Row>
                                            <Col  >
                                            <Label > Program Name</Label>
                                            <Select
                                                name="programName"
                                                value={programName || "Select"}
                                                onChange={(e)=>{setFieldValue("programName",e),sportsSelectHandle(e,"programName")}}
                                                options={programNameOptions}
                                            />
                                            </Col>
                                            </Row>
                                            </>:null}
                                            <Row>
                                            <Col  >
                                            <Label > Batch </Label>
                                                <Select
                                                    name="batch"
                                                    value={batch || "Select"}
                                                    onChange={(e)=>{setFieldValue("batch",e),sportsSelectHandle(e,"batch")}}
                                                    options={allBatchesOptions}
                                                />
                                             </Col>
                                        </Row>
                                        </CardBody>
                                    </Card>
                                </Col>
                            </Row>                          
                        </Col>
                        <Col md={3}>
                            <Row>
                                <Col>
                                    <Label > Date Joined  </Label>
                                   <DatePicker
                                        name="dateJoined"
                                        selected={values.dateJoined?new Date(values.dateJoined):null}
                                        onChange={(e)=>{setFieldValue("dateJoined",e) }}
                                        onBlur={handleBlur}
                                        placeholderText="mm/dd/yyyy"
                                        disabled
                                    />
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <div className="card" style={{marginTop: "16px"}}>
                                        <img   src={studentImage != ""?studentImage:staticPreviewImage} style={{width:"100%",height:"250px",objectFit: "cover", margin: "4px 0 2px",borderRadius:"50%"}}/>
                                        <div className="card-footer cardimgv" >
                                       <Row>
                                            <Col md={6}>
                                                {studentImage != ""?<Button type="button" color="primary" className='floatl' onClick={(e) =>removeFileHandleChange(e)}  >Remove </Button>:null} 
                                            </Col>
                                            <Col md={6}>
                                            {studentImage != ""?null:    <span className="btn btn-primary btn-file">
                                                Upload<input type="file" accept=".jpg, .jpeg, .png"  onChange={(e) =>fileHandleChange(e)}/>
                                                </span>}
                                            </Col>
                                       </Row>
                                        </div>
                                    </div>       
                                </Col> 
                            </Row>
                            <Row>
                                <Col>
                                    <Label > Notes  </Label>
                                    <Input  type="textarea" name="notes"  value={values.notes} onBlur={handleBlur} onChange={handleChange}  placeholder='Student extra information...'  rows="8" />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <div className='height15'></div>
                    <CardFooter>
                        <Button type="button" color='secondary' size="sm" onClick={()=> navigate("/studentTabs/2")}  className="floatg">Cancel</Button>
                        <Button type="submit" color='primary' size="sm" className='floatgM'>Save</Button>
                    </CardFooter>   
                </Card>
                </Form>
            )}
          </Formik>
            </CardBody>
        </Card>
    </>
  )
}
