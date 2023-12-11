import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { Col, Card, CardBody, CardFooter, Row, Button, Spinner } from "reactstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import './contract.css';
import Axios from "../../../hoc/axiosConfig";
import TablePagination from '../../../hoc/pagination';
import Swal from 'sweetalert2';
import moment from 'moment';
import Switch from "react-switch";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
const allcontracts = () => {
  const allContractsInitialData = { allContracts: [], totalPages: "", currentPage: "", loader: false ,permissions:{canCreate: true, canView: true, canUpdate: true, canDelete: true}}
  const [initialData, setState] = useState(allContractsInitialData);
  const [tenure, setTenure] = useState("")
  const { allContracts, totalPages, currentPage, loader ,permissions} = initialData
  let history = useNavigate();
  const tableList = (page) => {
    setState((prevState) => ({ ...prevState, loader: true }))
    Axios.get(`contract-promotion?page=${page - 1}&size=10&sort=id,desc`).then((res) => {
       setState((prevState) => ({
        ...prevState,
        allContracts : res.data.content,
        totalPages   : res.data.totalElements,
        currentPage  : res.data.pageNumber + 1,
        loader       : false
      }))
      res.data.content.map((tenure, index) => {
        setTenure(tenure.tenure.id)
      })
      if (res.status == 401) {
        Swal.fire({ title: "error", icon: "error", text: "Session Expired" })
        // navigate('/login')
        const additionalValue = localStorage.getItem("accode");
        const url = additionalValue ? `/login/${additionalValue}` : '/login';
        navigate(url);
      
      }
    }).catch(err => {
      Swal.fire(err.response.data.message, 'Please try again ')
      setState((prevState) => ({ ...prevState, loader: false, allContracts: [], }))
    })
  }
 
const deleteContract = (id) => {
Swal.fire({
  title: 'Are you sure?',
  text: "You won't be able to revert this!",
  type: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#3085d6',
  cancelButtonColor: '#d33',
  confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
      if (result.isConfirmed) {
        Axios.delete(`contract-promotion/${id}`)
        .then((response) => {
          tableList("1");
          if (response.status == 200) {
          Swal.fire('Record Deleted!', '', 'success')
          }
        }).catch((error) => { 
        Swal.fire( 'Please try again ' ) 
       })
      }
      else {
      Swal.fire('Your Data safe', '');
      }
    })
 }   
  useEffect(() => {
     const thead = document.getElementsByTagName("thead");
   thead[0].style.backgroundColor = localStorage.getItem('tableColor');
    tableList("1");
    let userid=localStorage.getItem("userid");
    axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token");
    axios.get(`${process.env.REACT_APP_BASE_URL_BASE}auth/users/${userid}`)
      .then((res) => {
        let permission = res.data.roles?res.data.roles[0]["contracts"]:null;
        console.log(res.data.roles);
        setState((prevState) => ({
          ...prevState, 
          permissions:permission
        }))
      }).catch((err) => {  })
  }, []);
  console.log("permissions:", permissions)

  const contractActionsHandle = (id) => {
    return (
      <span>
      {permissions.canUpdate?  <Link id={id} to={`/settings/createcontract/${id}`}>
          <i className="fa fa-pencil" id="pencilspace" aria-hidden="true"></i>
        </Link> :null}
        {permissions.canDelete?  <i className="fa fa-trash-o" aria-hidden="true" id="trashspace" onClick={() => { deleteContract(id) }}></i> :null}
      </span>
    )
  }
  const onPaginationChange = (page) => {
    tableList(page);
  }
  const indexFormat = (cell, row, enumObject, index) => {
    return (<>{index + 1}</>)
  }
  const dateDisplay = (cell, row) => {
    return cell !== null && cell !== undefined ? moment(cell).format("MM/DD/YYYY") : "";
  }
  const nameFetch = (cell, row) => {
    return (<>{cell.name}</>)
  }
  const switchHandleChange = (cell, row) => {
    return (
      <Switch onChange={() => { switchHandleChange1(cell, row) }} checked={row.activeInactive} onHandleColor='#fff' offHandleColor='#fff' onColor='#65bdf7' offColor='#dc3545' />
    )
  }
  const switchHandleChange1 = (cell, row) => {
    row.activeInactive = cell == true ? "false" : "true";
     Axios.put(`contract-tenure/${tenure}/contract-promotion/${row.id}`, row).then((res) => {
      if (res.status === 200) {
        tableList();
        toast.info("Contract updated successfully", { theme: "colored" });
      }
    }).catch((err) => {
      Swal.fire('Please try again ')
    })
  }
  return (
    <>
      <ToastContainer />
      {loader ? <Spinner
        className='loaderr'
        color="primary"
      >
        Loading...
      </Spinner> : null}
      <Card>
        <CardBody className='cardbg' style={{backgroundColor: localStorage.getItem('cardColor')}}>
          <Row>
            <Col ><h4><strong>Contracts </strong></h4></Col>
            <Col>
              {permissions.canCreate?<Button color="info" size="sm" className='buttonfloat' style={{ float: "right", backgroundColor: localStorage.getItem('btColor') }} onClick={() => history("/settings/createcontract/new")}>Add Contract</Button>:null}
            </Col>
          </Row>
          <Row>
            <Col>
              <Card >
                <BootstrapTable  data={allContracts}  headerStyle={ { background: 'red' } } keyField="name" search striped hover multiColumnSearch={true} version='4'>
                  <TableHeaderColumn width="120" dataAlign='left' dataField='sno' dataFormat={indexFormat} dataSort>S No</TableHeaderColumn>
                  <TableHeaderColumn width="130" dataAlign='left' dataField='name' dataSort>Name</TableHeaderColumn>
                  <TableHeaderColumn width="130" dataAlign='left' dataField='tenure' dataFormat={nameFetch} dataSort>Duration</TableHeaderColumn>
                  <TableHeaderColumn width="130" dataAlign='left' dataField='basePrice' dataSort>Base Price $</TableHeaderColumn>
                  <TableHeaderColumn width="140" dataAlign='left' dataField='creationDate' dataFormat={dateDisplay} dataSort>Created Date</TableHeaderColumn>
                  <TableHeaderColumn width="120" dataField="activeInactive" dataFormat={switchHandleChange}>Status</TableHeaderColumn>
                  <TableHeaderColumn width="130" dataAlign='left' dataField="id" dataFormat={(id) => contractActionsHandle(id)} >Action</TableHeaderColumn>
                </BootstrapTable>
                <CardFooter>
                  {allContracts.length >= 1 ? <TablePagination totalPages={totalPages} currentPage={currentPage} callbackfunc={onPaginationChange} defaultPageSize={"10"}></TablePagination> : null}
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </>
  )
}
export default allcontracts
