import React, { useEffect, useState } from 'react'
import { Link, useNavigate ,useParams} from "react-router-dom";
 import { Card ,CardBody,CardFooter, Row,  Input,  Button,Spinner } from "reactstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
 import Axios from "../../../hoc/axiosConfig";
 import "../Studentevent/studentEvent.css"
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Swal from 'sweetalert2';
const stEventField={studentList:"",selectedStudents:[],name:"",loader:false}
export default function EventAudienceGroup() { 
    const [eventGroupData,setState] =useState(stEventField);
   const{studentList,selectedStudents,name ,loader}=eventGroupData;
   const navigate = useNavigate();
   const params = useParams();
   const selectedRow = {
    mode: 'checkbox',
    showOnlySelected: true,
    onSelect: (row, isSelected, rowIndex, e) => {
        if (isSelected) {
        const data = selectedStudents
        data.push(row)
        setState((prevState)=>({
          ...prevState,selectedStudents:data
        }))
      } else {
        const selectedData= []
        selectedStudents.map((mapdata,index)=>{
          if(mapdata.id!==row.id){
            selectedData.push(mapdata)
          }
        })
        setTimeout(() => {
          setState((prevState)=>({
            ...prevState,selectedStudents:selectedData
          }))
        }, 500);
      }
    },
    onSelectAll: (isSelect, rows, e) => {
      if (isSelect) {
        setState((prevState)=>({
          ...prevState,
          selectedStudents:rows
        }))
      }
      else {
        setState((prevState)=>({
          ...prevState,
          selectedStudents:[]
        }))
      }
    }
  };
  useEffect(()=>{
    Axios.get(`event/${params.id}/event-registration`).then((res) => {
       let eventDat = []
      res.data.map((mapData)=>{
        if(mapData.guestStudent){
             eventDat.push({
              "id": mapData.id,
              "guestStudent": {
                  "id":mapData.guestStudent.id,
                  "firstName": mapData.guestStudent.firstName,
                  "lastName": mapData.guestStudent.lastName,
                  "phone": mapData.guestStudent.phone,
                  "email": mapData.guestStudent.email
              },
              "totalFee": mapData.totalFee
          })
          }else{
            eventDat.push({
                  "id": mapData.id,
                  "student": {
                      "id":mapData.student.id,
                      "firstName": mapData.student.firstName,
                      "lastName": mapData.student.lastName,
                      "phone": mapData.student.phone,
                      "email": mapData.student.email
                  },
                  "totalFee": mapData.totalFee
              })
          }
      })
    setState((prevState)=>({
      ...prevState,
      studentList:eventDat
    }))
    }).catch((err) => {
      Swal.fire( err?err.response.data.message:null, 'Please try again '  ) 
    })
  },[])
  const nameHandleChange= (e)=>{
    setState((prevState)=>({
      ...prevState,
      name:e.target.value
    }))
  }
  const createCustomShowSelectButton = (onClick, showSelected) => {
    return (
      < >
      <Input name="name" type="text" value={name} placeholder="Enter Group Name" onChange={nameHandleChange} invalid={name===""?true:false}/>
    </>
    );
  }
  const options = {
    showSelectedOnlyBtn: createCustomShowSelectButton
  };
  const displayFullName = (cell, row) => {
    return(<span>{row.student===undefined?`${row.guestStudent.firstName} ${row.guestStudent.lastName}`:`${row.student.firstName} ${row.student.lastName}`}</span>)
  }
  const displayEmail = (cell, row) => {
    return(<span>{row.student===undefined?`${row.guestStudent.email}`:`${row.student.email}`}</span>)
  }
  const displayPhone = (cell, row) => {
    return(<span>{row.student===undefined?`${row.guestStudent.phone}`:`${row.student.phone}`}</span>)
  }
  const saveAudienceDataHandle = ()=>{
     if(name!==""){
      setState((prevState)=>({...prevState,loader:true}));
      const payload = {
        "name":name,
        "eventRegistration":selectedStudents,
      }
      axios.defaults.headers.common['Authorization'] =  "Bearer " + localStorage.getItem("token");
      axios.post(`${process.env.REACT_APP_BASE_URL}/primary-audience`,payload).then((res)=>{
          toast.success("Created successfully", { theme: "colored" })
         setState((prevState)=>({...prevState,loader:false}));
         setTimeout(() => {
          navigate(`/events/createcommunication/${params.id}/${name}/${res.data.id}`)
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
       <CardBody className='cardbg' >
       <h5><strong>New Audience</strong></h5>
         <Card className='cardbgw'>                           
           <CardBody>
             <Row className='rowborder1'>
                <BootstrapTable data={studentList} options={options} hover multiColumnSearch={false} id="stickyid"  selectRow={selectedRow}  tableContainerClass='my-custom-class1' version='4'>
                    <TableHeaderColumn width="140" dataField='firstName'  dataSort dataFormat={displayFullName}>Student Name</TableHeaderColumn>
                    <TableHeaderColumn width="180" dataField='email' dataSort  dataFormat={displayEmail}>Email</TableHeaderColumn>
                    <TableHeaderColumn width="120" dataField='phone'  dataSort dataFormat={displayPhone}>Phone</TableHeaderColumn>
                    <TableHeaderColumn width="5" dataField='id'  dataSort hidden isKey>unique field</TableHeaderColumn>
                </BootstrapTable>
             </Row><div className='height15'></div>
            </CardBody>
              <CardFooter className='centerTextalign'>
                <Button type="button" color='primary' className='btnbg' size="sm" onClick={()=>navigate(`/events/eventregister/${params.id}`)}  >Cancel</Button>
                <Button type="button" color='primary'  size="sm" onClick={()=>{saveAudienceDataHandle()}}  >Save Audience</Button>
              </CardFooter>      
         </Card>
        </CardBody>
     </Card>
    </>
  )
}
