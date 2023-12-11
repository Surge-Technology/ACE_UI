import React,{useEffect, useState} from 'react'
import { Col, Label , Row, Input,  ModalBody, ModalFooter,Button } from "reactstrap";
import { Formik,Form , ErrorMessage,} from "formik";
import * as Yup from 'yup';
import Select from 'react-select';
import Axios from "../../../hoc/axiosConfig";
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
const reason =[{value:"Medical",label:"white Belt"},{value:"Other",label:"Other"}]
const levels =[{value:1,label:"Form"},{value:2,label:"Self Defense"}]
const deactiveInitialData = {beltLabel:"",subLevel:"",beltLabelOptions:"",anticipated:false,approved:false,backendAnticipated:false,backApproved:false,subLevelsOptions:"" }
export default function EditStatusModal(props) {
    const [deactiveInitialStateData,setState]=useState(deactiveInitialData);
    const {beltLabel ,subLevel ,beltLabelOptions,anticipated,approved,backendAnticipated,backApproved,subLevelsOptions} = deactiveInitialStateData
     const DeactivationSchema = () => Yup.object().shape({
      subLevel: Yup.object().required('Sub Level is required'),
        beltLabel: Yup.object().required('Reason is required'),
      });
    const checkboxHandleChange=(e,name)=>{
           setState((prevState)=>({
            ...prevState,
            [name]:e.target.checked,
          }))
    }
  useEffect(()=>{
    Axios.get(`level/student/${props.studentId}`).then((res)=>{
    let  allBatches = []
        res.data.map((mapdata,index)=>{
          allBatches.push( { value: mapdata.id, label: mapdata.name })
        })
        setState((prevState)=>({
            ...prevState,
            beltLabelOptions:allBatches
        }))
    }).catch(err=>{
      Swal.fire(err.response.data.message,'Please try again later');
    })
    Axios.get(`student/${props.studentId}/student-status-history`).then((res)=>{
         let subLevel = [];
       res.data.subLevel.map((mapData,index)=>{      
        subLevel.push({value: mapData.id, label: mapData.name})
       })
       Axios.get(`level/${res.data.level.id}/sub-level`).then((response)=>{
           let  allSubLevels = []
        response.data.map((mapdata,index)=>{
              allSubLevels.push( { value: mapdata.id, label: mapdata.name })
            })
            setState((prevState)=>({
                ...prevState,
                subLevelsOptions:allSubLevels
            }))
        }).catch(err=>{
          Swal.fire(err.response.data.message,'Please try again later');
        })
       setState((prevState)=>({
        ...prevState,
        beltLabel:{ value: res.data.level.id, label: res.data.level.name },
        subLevel:subLevel[res.data.subLevel.length-1],
        anticipated:res.data.testingAnticipated,approved:res.data.testingApproved,
         backendAnticipated:res.data.testingAnticipated,
        backApproved:res.data.testingApproved,
    }))
      }).catch(err=>{
        Swal.fire("",'Please try again later');
      })
  },[])
  const beltLavelHandleChange= (name, selectedData)=>{
      if(name==="beltLabel"){
        Axios.get(`level/${selectedData.value}/sub-level`).then((res)=>{
           let  allSubLevel = []
              res.data.map((mapdata,index)=>{
                allSubLevel.push( { value: mapdata.id, label: mapdata.name })
              })
              setState((prevState)=>({
                  ...prevState,
                  subLevelsOptions:allSubLevel,beltLabel:selectedData,subLevel:{},anticipated:false,approved:false
              }))
          }).catch(err=>{
            Swal.fire(err.response.data.message,'Please try again later');
          })
      }
      if(name==="subLevel"){
        setState((prevState)=>({
          ...prevState,
          subLevel:selectedData
      }))
      }
  }
  const  onSubmitDeactivation=(data)=>{
      if(backendAnticipated===false && data.anticipated===true){ 
          let payload ={}
        axios.defaults.headers.common['Authorization'] =  "Bearer " + localStorage.getItem("token");
        axios.put(`${process.env.REACT_APP_BASE_URL}/student/${props.studentId}/student-status/testing-anticipated`,payload).then((res)=>{
          toast.success("Anticipated Successfully", { theme: "colored" })
          setTimeout(() => {
            props.callBackmodel("editStatus");
        }, 1000);      
        }).catch(err=>{
          Swal.fire(err.response.data.message,'Please try again later');
        })
    }
    if(backApproved===false&&data.approved===true){ 
         let payload ={}
        axios.defaults.headers.common['Authorization'] =  "Bearer " + localStorage.getItem("token");
        axios.put(`${process.env.REACT_APP_BASE_URL}/student/${props.studentId}/student-status/testing-approved`,payload).then((res)=>{
          toast.success("Approved Successfully", { theme: "colored" })
          setTimeout(() => {
            props.callBackmodel("editStatus");
        }, 1000);      
        }).catch(err=>{
           Swal.fire(
            err.response.data.message,
             'Please try again '
          )
        })
    }
    if(!anticipated && !approved){
         let payload = {
          "testingAnticipated" : anticipated,
          "testingApproved" : approved
        }
        axios.defaults.headers.common['Authorization'] =  "Bearer " + localStorage.getItem("token");
        axios.post(`${process.env.REACT_APP_BASE_URL}/level/${data.beltLabel.value}/sub-level/${data.subLevel.value}/student/${props.studentId}/student-status`,payload).then((res)=>{
          toast.success("Status Updated Successfully", { theme: "colored" })
          setTimeout(() => {
            props.callBackmodel("editStatus")
        }, 1000);      
        }).catch(err=>{
            Swal.fire(
            err.response.data.message,
             'Please try again '
          )
        })
    }
  }
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
                         <Label>Belt Levels  </Label>                     
                            <Select
                            name="beltLabel"
                            value={beltLabel}
                            onChange={(e)=>{setFieldValue("beltLabel",e),beltLavelHandleChange("beltLabel",e)}}
                            options={beltLabelOptions}
                            onBlur={handleBlur}
                        />
                        <ErrorMessage name="beltLabel" component="div"  className='errmsg'></ErrorMessage> 
                        </Col>                   
                    </Row>
                    <Row>
                        <Col>
                        <Label>Sub Levels  </Label>
                        <Select
                            name="subLevel"
                            value={subLevel}
                            onChange={(e)=>{setFieldValue("subLevel",e),beltLavelHandleChange("subLevel",e)}}
                            options={subLevelsOptions}
                            onBlur={handleBlur}
                        />
                        <ErrorMessage name="subLevel" component="div"  className='errmsg'></ErrorMessage> 
                        </Col>
                    </Row><hr/>
                    <Row>
                      <Col>
                        <Label check ><span>Testing Anticipated</span></Label>
                        <Input type="checkbox" name="anticipated" value={anticipated} checked={anticipated} onChange={(e)=>checkboxHandleChange(e,"anticipated")}/> 
                      </Col>
                    </Row>
                    <Row>
                      <Col>
                        <Label check ><span>Testing Approved</span></Label>
                        <Input type="checkbox" name="approved" value={approved} checked={approved} onChange={(e)=>checkboxHandleChange(e,"approved")}/>
                      </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button type="button" color='secondary' size="sm" onClick={()=> props.callBackmodel("editStatus")}  >Cancel</Button>
                    <Button type="submit" color='primary' size="sm" >Save</Button>
                </ModalFooter>
            </Form>
          )}
        </Formik>     
    </>
  )
}
