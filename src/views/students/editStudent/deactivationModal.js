 
import React,{useEffect, useState} from 'react'
import { Col, Label,Card,CardImg,CardTitle,CardHeader,CardBody,CardFooter, Row,Table,Input,FormFeedback, Modal, ModalBody, ModalFooter, ModalHeader, InputGroup,FormGroup,CustomInput,Button } from "reactstrap";
import { Formik,Form , Field, ErrorMessage, yupToFormErrors,} from "formik";
import * as Yup from 'yup';
import Select from 'react-select';
 import axios from 'axios';
import { useNavigate } from 'react-router';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
const reason =[{value:"Medical",label:"Medical"},{value:"Other",label:"Other"}]
const deactiveInitialData = {reasonType:"",details:"",reasonTypeOptions:reason}
export default function DeactivationModal(props) {
    const [deactiveInitialStateData,setState]=useState(deactiveInitialData);
    const {reasonType ,details ,reasonTypeOptions} = deactiveInitialStateData;
    const navigate = useNavigate();
    const  onSubmitDeactivation=(data)=>{
       let payload ={
        "reasons":data.reasonType.label,
        "details":data.details
    }
       axios.defaults.headers.common['Authorization'] =  "Bearer " + localStorage.getItem("token");;
        axios.post(`${process.env.REACT_APP_BASE_URL}/deactivation/student/${props.studentId}`,payload).then((res)=>{
            toast.success("Student deactivated successfully", { theme: "colored" })
          setTimeout(() => {
            navigate("/students")
        }, 1000);
        }).catch(err=>{  
           Swal.fire(err.response.data.message,'Please try again later');
          })
     }
     const DeactivationSchema = () => Yup.object().shape({
         details: Yup.string().min(15, 'Too Short!').required('Details is required'),
        reasonType: Yup.object().required('Reason is required'),
      });
      useEffect(()=>{
       
      },[])
  return (
    <>   
      <ToastContainer />
        <Formik
          enableReinitialize={true}
          initialValues={deactiveInitialStateData}
          validationSchema={DeactivationSchema}
          onSubmit={onSubmitDeactivation} 
          >           
        {({ values,setFieldValue,handleChange,handleBlur,handleSubmit,errors,touched }) => (
            <Form > 
                <ModalBody>
                    <Row><Col>
                         <Label>Reason  </Label>                     
                            <Select
                            name="reasonType"
                            defaultValue={reasonType}
                             onChange={(e)=>{setFieldValue("reasonType",e)}}
                            options={reasonTypeOptions}
                            onBlur={handleBlur}
                        />
                        <ErrorMessage name="reasonType" component="div"  className='errmsg'></ErrorMessage> 
                        </Col>                   
                    </Row>
                    <Row>
                        <Col>
                            <Label > Details  </Label>
                            <Input  type="textarea" name="details"  placeholder='Deactivation reason information...'  rows="4"  onChange={handleChange}  onBlur={handleBlur}/>
                            <ErrorMessage name="details" component="div"  className='errmsg'></ErrorMessage>  
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button type="button" color='secondary' size="sm" onClick={()=> props.callBackmodel("deactivation")}  >Cancel</Button>
                    <Button type="submit" color='primary' size="sm" >Save</Button>
                </ModalFooter>
            </Form>
          )}
        </Formik>     
    </>
  )
}
