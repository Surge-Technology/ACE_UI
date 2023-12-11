import React,{useState, useEffect } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { Col, Label,Card,CardBody,CardFooter, Row,Input, Button,Spinner, CardHeader } from "reactstrap";
import { Formik,Form ,  ErrorMessage, } from "formik";
import * as Yup from 'yup';
import Select from 'react-select';
import Axios from "../../../hoc/axiosConfig";
import Swal from 'sweetalert2';
import moment from 'moment/moment';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import "./certification.css";
 const Fields={programName:"",selectAwards:"",awardsOptions:[],backgroundImage:"",bodyCopy:"",stname:"Student name",
imageName:"",loader:false}
const createCertification = () => {
  const [createinitalData,setState] =useState(Fields);
  const [studentImage, setStudentImage] = useState("");
  const{programName,selectAwards,awardsOptions, backgroundImage,bodyCopy,stname,imageName,loader}=createinitalData;
  const navigate = useNavigate();
  const params = useParams();
 
  const submitCertification =(e)=>{
    if(imageName===""){
      Swal.fire("Please Select Background Image");
    }
    if(params.id !== "new"){
      let payload = {
        "name": e.programName,
        "backgroundPhoto": e.imageName,
        "templateBody": e.bodyCopy
      }
      axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token");
      axios.put(`${process.env.REACT_APP_BASE_URL_BASE}api/level/${selectAwards.value}/certificate/${params.id}`, payload).then((res) => {
             toast.info(`Updated successfully`, { theme: "colored" });
             setTimeout(() => {
              navigate("/certifications");
            }, 1000);
        }).catch((err) => {
            Swal.fire(err.response.data.message, 'Please try again later');
        })
    }else{
      setState((prevState)=>({...prevState,loader:true}));
      let payload = {
        "name": e.programName,
        "backgroundPhoto": e.imageName,
        "templateBody": e.bodyCopy
      }
      axios.defaults.headers.common['Authorization'] =  "Bearer " + localStorage.getItem("token");
      axios.post(`${process.env.REACT_APP_BASE_URL}/level/${selectAwards.value}/certificate`,payload).then((res)=>{
         toast.success("Registered successfully", { theme: "colored" })
         setState((prevState)=>({...prevState,loader:false}));
          setTimeout(() => {
            navigate("/certifications");
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
  const ValidationSchema = () => Yup.object().shape({
    programName: Yup.string().required('Program Name is Required'),
    selectAwards: Yup.object().required('Awards is Required'),
     bodyCopy: Yup.string().required('Body is Required'),
  });
  const fileHandleChange=(e)=>{
     let file =URL.createObjectURL(e.target.files[0]);
    setStudentImage(file);
     let formdata = new FormData();
    formdata.append('image', e.target.files[0]);
     axios.defaults.headers.common['Authorization'] =  "Bearer " + localStorage.getItem("token");
    axios.post(`${process.env.REACT_APP_BASE_URL}/certificate/image/upload`,formdata).then((res)=>{
         setState((prevState)=>({
        ...prevState,
        imageName:res.data.imageName 
      })) 
    }).catch(err=>{
      Swal.fire( err.response.data.message, 'Please try again '  ) 
    })  
  }
  const FieldHandleChange=(name,e)=>{
      setState((prevState)=>({
        ...prevState,
        [name]:e.target.value
      })) 
  }
  const selectFieldHandleChange=(name,e)=>{
       setState((prevState)=>({
        ...prevState,
        [name]:e
      })) 
  } 
  useEffect(() => {
    if(params.id !== "new"){
      Axios.get(`/certificate/${params.id}`).then((res)=>{
        setState((prevState)=>({
         ...prevState,
         programName:res.data.name,
         selectAwards:{ value: res.data.level.id, label:res.data.level.name },
         imageName:res.data.backgroundPhoto,
         bodyCopy:res.data.templateBody, 
       }))
       setStudentImage(process.env.REACT_APP_BASE_URL_BASE+"auth/certificate/image/"+res.data.backgroundPhoto)
        }).catch(err=>{
        Swal.fire( err.response.data.message, 'Please try again '  ) 
      })
    }
    Axios.get(`level`).then((res)=>{
      let  levels = []     
      res.data.map((mapdata,index)=>{
        levels.push( { value: mapdata.id, label: mapdata.name })
         })  
      setState((prevState)=>({
       ...prevState,
       awardsOptions:levels
     }))
   }).catch(err=>{
    Swal.fire( err.response.data.message, 'Please try again '  ) 
   })
  }, []);
   
  return (
    <> {loader?<Spinner
      className='loaderr'
       color="primary"
      > 
      Loading...
    </Spinner>:null} 
     <ToastContainer /> 
     <Card className='cardm'>
          <CardBody className='cardbg' >
            <Formik
              enableReinitialize={true}
             initialValues={createinitalData}
              validationSchema={ValidationSchema}
             onSubmit={submitCertification} 
              >           
            {({ values,setFieldValue,handleChange,handleSubmit,handleBlur,errors,touched }) => (
              <Form onSubmit={handleSubmit} >
                <Card className='cardbgw'> 
                  <CardHeader> <h5><strong>Certification</strong></h5> </CardHeader>                          
                    <CardBody>
                      <Row>
                        <Col md={12}>
                        <Label for="programName"> Program Name </Label>
                          <Input name="programName" type="text" value={values.programName} onChange={(e)=>(FieldHandleChange("programName",e))}/>
                          <ErrorMessage name="programName" component="div"  className='errmsg'></ErrorMessage>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={5}>
                          <Label for="selectName">Awards</Label>
                          <Select
                            name="selectAwards"
                            value={selectAwards}
                            onChange={(e)=>{setFieldValue("selectAwards",e),selectFieldHandleChange("selectAwards",e)}}
                            options={awardsOptions}
                            />
                          <ErrorMessage name="selectAwards" component="div"  className='errmsg'></ErrorMessage>
                        </Col>
                        <Col md={7}>
                          <Label for="programName"> BackGround Image </Label>
                          <Input name="backgroundImage" type="file"  accept=".jpg, .jpeg, .png" value={values.backgroundImage} onChange={(e)=>(fileHandleChange(e))}/>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={12}>
                          <Label for="bodyCopy">Body Copy </Label>
                          <Input  name="bodyCopy"  type="textarea" value={values.bodyCopy} onChange={(e)=>(FieldHandleChange("bodyCopy",e))} placeholder='content display in certification...'  rows="2 " />  
                          <ErrorMessage name="bodyCopy" component="div"  className='errmsg'></ErrorMessage>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={4}>
                          <Label for="preview">Preview </Label>
                            <div className="App">
                              <div id="downloadWrapper">
                                <div id="certificateWrapper">
                                  <p className='name'>{stname}</p> 
                                  <img src={studentImage==""?"https://i.imgur.com/Toz3PUWh.png":studentImage} alt="Certificate"  />
                                  <p className='bodyCopy'>{bodyCopy}</p>
                                </div>
                              </div>
                            </div>
                        </Col>
                      </Row>
                  </CardBody>
                    <CardFooter className='centerTextalign'>
                      <Button type="button" color='secondary' className='btnbg' size="sm"  onClick={()=>{navigate("/certifications")}}>Cancel</Button>
                      <Button type="submit" color='primary'  size="sm"  >Save</Button>
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

export default createCertification