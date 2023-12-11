import React, { useEffect, useState } from 'react'
import Axios from "../../../hoc/axiosConfig";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { Col, Label,Card,CardImg,CardTitle,CardHeader,CardBody,CardFooter, Row,Table,Input,FormFeedback, Modal, ModalBody, ModalFooter,Button } from "reactstrap";
import moment from 'moment';
import Swal from 'sweetalert2';
const historyData = {historyList:[]}
export default function HistoryModal(props) {
  const [initialState,setState] = useState(historyData);
  const {historyList} = initialState;
  useEffect(()=>{
    Axios.get(`/student/${props.studentId}/contract`).then((res)=>{
      let historyListData = []
     res.data.map((historyMapdata)=>{
      historyListData.push({name : historyMapdata.contractPromotion.name,
        membersAndFrequency : historyMapdata.membersAndFrequency,
        startDate : historyMapdata.startDate,
        endDate   : historyMapdata.endDate,
        totalFee  : historyMapdata.totalFee,
        fee       : historyMapdata.fee,
        discount  : historyMapdata.discount,
        creationDate : historyMapdata.creationDate,
      })
     })
     historyListData.pop();
     setState((prevState)=>({
      ...prevState,
      historyList:historyListData
  })) 
    }).catch(err=>{
      Swal.fire(err.response.data.message,'Please try again later');
    })
  },[])
  
  const displayDate = (date)=>{
    return(<>{moment(date).format("MM/DD/YYYY")}</>)
  }
  return (
    <> 
      <ModalBody >
        <BootstrapTable data={historyList} hover multiColumnSearch={true} version='4' search>
              <TableHeaderColumn width="140" dataField='name'  dataSort isKey>Name</TableHeaderColumn>
              <TableHeaderColumn width="200" dataField='membersAndFrequency' dataSort>Members & Frequency</TableHeaderColumn>
              <TableHeaderColumn width="100" dataField='startDate'  dataSort>Start Date</TableHeaderColumn>
              <TableHeaderColumn width="100" dataField='endDate'  dataSort>End Date</TableHeaderColumn>
              <TableHeaderColumn width="100" dataField='totalFee' dataAlign='right' dataSort>Total Fee</TableHeaderColumn>
              <TableHeaderColumn width="100" dataField='fee' dataAlign='right' dataSort>Fee</TableHeaderColumn>
              <TableHeaderColumn width="100" dataField='discount' dataAlign='center' dataSort>Discount</TableHeaderColumn>
              <TableHeaderColumn width="140" dataField='creationDate' dataFormat={displayDate}  dataSort>Creation Date</TableHeaderColumn>
          </BootstrapTable>
      </ModalBody>
      <ModalFooter>
          <Button type="button" color='primary' size="sm" onClick={()=> props.callBackmodel("history")}  > Back</Button>
      </ModalFooter>
    </>
  )
}
