import React, { useEffect, useState } from 'react'
import {  useNavigate ,useParams} from "react-router-dom";
import { Formik,Form ,  ErrorMessage, } from "formik";
import * as Yup from 'yup';
import { Col, Label,Card, CardBody,CardFooter, Row, Input, Modal, Button } from "reactstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import "./studentEvent.css"
import Axios from "../../../hoc/axiosConfig";
import StudentEventModal from './studentEventModal'; 
import DatePicker from "react-datepicker";
import Swal from 'sweetalert2';
import Select from 'react-select';

const stEventFields={eventTypeStudentData:"",studentList:"",firstName:"",lastName:"",birthDate:"",email:"",phone:"",currentStudentData:"",currentStudentId:"",
studentEventRegiModalToggle:false,address:"",address2:"",city:"",state:"",zipcode:"",stateOptions:[]}
export default function studentEvent() {
     const [studeventData,setStudeventData] =useState(stEventFields);
    const{eventTypeStudentData,studentList,firstName ,lastName ,birthDate ,email ,phone ,currentStudentData,currentStudentId,studentEventRegiModalToggle,
      address,address2,city,state,zipcode,stateOptions}=studeventData;
    const navigate = useNavigate();
    const params = useParams();
    const schemaStudentEventValid = () => Yup.object().shape({
      firstName : Yup.string().required('First Name is required'),
      lastName  : Yup.string().required('Last Name is required'),
      birthDate : Yup.string().required('Birth Date is required'),
      email     : Yup.string().required('Email is required').email("Invalid mail address"),
      phone     : Yup.string().min(10, 'Minimum 10 digits!').max(14, 'Maximum 14 digits!').required('Phone is required'),
      address   : Yup.string().required("Address is required"),
      city     : Yup.string().matches(/^[aA-zZ\s]+$/, "Only alphabets are allowed").required("City is required"),
     state     : Yup.object().required("State is required"),
     zipcode   : Yup.string().min(5, 'Must be exactly 5 digits').max(5, 'Must be exactly 5 digits').required("Zipcode is required"),
    })
    const submitGuestStudent =(e)=>{
      setStudeventData((prevState)=>({
      ...prevState, 
      eventTypeStudentData:e,studentEventRegiModalToggle:!studentEventRegiModalToggle,
  }))  
    }
    const onRowSelect = (row, isSelected, e) => {
      setStudeventData((prevState)=>({
        ...prevState,
        currentStudentId: row.id,currentStudentData:row,firstName:"",lastName:"",birthDate:"",email:"",phone:""
      }))
    }
    
    const selectedRow = {
      mode: 'radio',
      showOnlySelected: true,
      onSelect: onRowSelect, 
    };
    const createCustomShowSelectButton = (onClick, showSelected) => {
      return (
         <h5><strong>Current Student</strong></h5>
      );
    }
    const options = {
      showSelectedOnlyBtn: createCustomShowSelectButton
    };
    const displayFullName = (cell, row) => {
      return (<span>{row?`${row.firstName} ${row.lastName} `:null}</span>)
    }
    const selectFieldHandleChange=(name,value)=>{ 
      setStudeventData((prevState)=>({
        ...prevState,      
        [name]:value
      }))
    }
    useEffect(()=>{
      Axios.get("all-students").then((res)=>{
         setStudeventData((prevState)=>({
          ...prevState,
          studentList:res.data
        }))  
      }).catch(err=>{ 
        Swal.fire( err.response.data.message, 'Please try again '  ) 
      })
      Axios.get("states").then((res)=>{
        let  allstatesList = []
          res.data.map((mapdata,index)=>{
            allstatesList.push( { value: mapdata.id, label: mapdata.name })
          })
          setStudeventData((prevState)=>({
         ...prevState,
         stateOptions:allstatesList 
       }))
     }).catch(err=>{
      Swal.fire(err.response.data.message,'Please try again later');
     })
    },[])
    const modalHandleChange =(data)=>{ 
      if(data==="studentEventRegi"){
        setStudeventData((prevState)=>({
              ...prevState,
              studentEventRegiModalToggle:!studentEventRegiModalToggle
          }))  
      }
    } 
    const callBackmodelHandle = (data)=>{
      modalHandleChange(data);
    }
    const dateHandleChange=(name,value)=>{
      setStudeventData((prevState)=>({
        ...prevState,      
        [name]:value
      }))
    } 
    const fieldHandleChange=(e)=>{
      const { name, value } = e.target;
      if(name ==="phone"){
        const val= value.replace(/[^0-9]/g, "");
        const formattedPhoneNumber = val.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
        setStudeventData((prevState)=>({
          ...prevState,      
          [name]:formattedPhoneNumber
        }))
      }else{
        setStudeventData((prevState)=>({
         ...prevState,      
         [name]:value
       }))
      }
    }
  return (
    <>
      <Modal isOpen={studentEventRegiModalToggle} toggle={()=>modalHandleChange("studentEventRegi")} size='lg' centered backdrop="static"> 
        <StudentEventModal eventId={params.id} studentTypeData={eventTypeStudentData} callBackmodel={callBackmodelHandle}/>
      </Modal>
      <Card className='cardm'>
       <CardBody className='cardbg' >
       <h5><strong>Register</strong></h5>
       <Formik
            enableReinitialize={true}
            initialValues={studeventData}
            validationSchema={currentStudentId===""?schemaStudentEventValid:null}
            onSubmit={submitGuestStudent} 
            >           
          {({ values,setFieldValue,handleChange,handleSubmit,handleBlur,errors,touched }) => (
              <Form onSubmit={handleSubmit} >
         <Card className='cardbgw'>                           
           <CardBody>
             <Row className='rowborder1'>
                <BootstrapTable data={studentList} hover multiColumnSearch={true} id="stickyid" options={options}  selectRow={selectedRow}  tableContainerClass='my-custom-class1' version='4' search>
                <TableHeaderColumn width="5" dataField='id'  dataSort hidden isKey>unique field</TableHeaderColumn>
                    <TableHeaderColumn width="140" dataField='firstName'  dataSort dataFormat={displayFullName}>Student Name</TableHeaderColumn>
                    <TableHeaderColumn width="180" dataField='email' dataSort >Email</TableHeaderColumn>
                    <TableHeaderColumn width="120" dataField='phone'  dataSort dataAlign='right'>Phone</TableHeaderColumn>
                    <TableHeaderColumn width="20" dataField=''   dataAlign=''></TableHeaderColumn>
                </BootstrapTable>
             </Row><div className='height15'></div>
           {currentStudentId===""?  <Row>
             <h5><strong>Guest Student</strong></h5>
              <Row>
                <Col md={5}>
                  <Label > <b>First Name</b></Label> 
                  <Input name="firstName" type="text" value={values.firstName} onChange={(handleChange,fieldHandleChange)} invalid={touched.firstName && !!errors.firstName }/>
                  <ErrorMessage name="firstName" component="div"  className='errmsg'></ErrorMessage>
                </Col>
                <Col md={5}> 
                  <Label > <b>Last Name</b> </Label>
                  <Input name="lastName" type="text" value={values.lastName} onChange={(handleChange,fieldHandleChange)} invalid={touched.lastName && !!errors.lastName }/>
                  <ErrorMessage name="lastName" component="div"  className='errmsg'></ErrorMessage>
                </Col>
                <Col md={2}>
                  <Label ><b>Birth Date</b></Label>
                  {/* <Input name="birthDate" type="date" value={values.birthDate} onChange={handleChange} invalid={touched.birthDate && !!errors.birthDate }/> */}
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
                <Col md={7}>
                  <Label > <b>Email</b> </Label>
                  <Input name="email" type="email" value={values.email} onChange={(handleChange,fieldHandleChange)} onBlur={handleBlur} invalid={touched.email && !!errors.email }/>
                  <ErrorMessage name="email" component="div"  className='errmsg'></ErrorMessage>
                </Col>
                <Col md={5}>
                  <Label ><b>Phone</b></Label>
                  <Input name="phone" type="text" value={values.phone} onChange={(handleChange,fieldHandleChange)} onBlur={handleBlur} invalid={touched.phone &&   !!errors.phone }/>
                  <ErrorMessage name="phone" component="div"  className='errmsg'></ErrorMessage>
                </Col>
              </Row>
              <Row>
                <Col  >
                    <Label > Address <span className='colorRed'>*</span></Label>
                    <Input name="address" type="text" value={values.address} onChange={(handleChange,fieldHandleChange)} invalid={touched.address &&   !!errors.address } />
                    <ErrorMessage name="address" component="div"  className='errmsg'></ErrorMessage>
                </Col>
                </Row>
                <div className='height15'></div>
              <Row>

                <Col  >
                    <Input name="address2" type="text" value={values.address2} onChange={(handleChange,fieldHandleChange)}  />
                </Col>
              </Row>
              <Row>
                        <Col md={5}>
                          <Label > City <span className='colorRed'>*</span> </Label>
                          <Input name="city" type="text" value={values.city} onChange={(handleChange,fieldHandleChange)} invalid={touched.city &&   !!errors.city } />
                          <ErrorMessage name="city" component="div"  className='errmsg'></ErrorMessage>
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
                           <ErrorMessage name="zipcode" component="div"  className='errmsg'></ErrorMessage>
                        </Col>
                      </Row>
            </Row>  :null}     
           </CardBody>
              <CardFooter className='centerTextalign'>
                <Button type="button" color='secondary' className='btnbg' size="sm" onClick={()=>navigate(`/events/eventregister/${params.id}`)}  >Cancel</Button>
                <Button type="submit" color='primary'  size="sm"  >Continue</Button>
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
