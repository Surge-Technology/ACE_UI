import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { CAvatar, CBadge, CDropdown, CDropdownDivider, CDropdownHeader, CDropdownItem, CDropdownMenu, CDropdownToggle, } from '@coreui/react'
import { cilBell, cilCreditCard, cilCommentSquare, cilEnvelopeOpen, cilFile, cilLockLocked, cilSettings, cilTask, cilUser, } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import avatar8 from './../../assets/images/avatars/userempty.jpg'
import { useNavigate } from 'react-router'
import { Label } from 'reactstrap'
import { Button ,Modal, ModalHeader, ModalBody, ModalFooter,Row,Col, Input} from 'reactstrap';
import { SketchPicker } from 'react-color';

const appInitialData= {bgcolor:"",btcolor:"",cardcolor:"",tablecolor:"",colorHexCode:""} 
const AppHeaderDropdown = () => {
  const [modal, setModal] = useState(false);
  const [initialData,setState] = useState(appInitialData);
  const {bgcolor,btcolor,cardcolor,tablecolor,colorHexCode} = initialData

  const toggle = () => setModal(!modal);
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const navigate = useNavigate()
  const username = localStorage.getItem("username");
  const role = localStorage.getItem("role");
  const additionalValue = localStorage.getItem("accode");
  const logout = () => {
    localStorage.clear();
    //navigate('/login')
    const url = additionalValue ? `/login/${additionalValue}` : '/login';
    navigate(url);
  }
  const backGrdcolr=()=>{
    const collection = document.getElementsByTagName("body");
    localStorage.setItem('bgColor', bgcolor);
    collection[0].style.backgroundColor = bgcolor;
    localStorage.setItem('btColor', btcolor);
    localStorage.setItem('cardColor', cardcolor);
    localStorage.setItem('tableColor', tablecolor);
    toggle();
//      var btnn = document.getElementsByClassName("btn");
//   console.log("btn",btnn,btnn.length)
//   btnn[0].style.backgroundColor="black"
  
//   const elements = document.querySelectorAll(["className=btn"])
//  console.log("ele",elements)
    //toggle();
  }
  const handleChangee =(name, value)=>{
     setState((prevState)=>({
      ...prevState,      
      [name]:value
    }))
   // backGrdcolr(value);
  }
  useEffect(()=>{
  
    
    const collection = document.getElementsByTagName("body");
   // const thead = document.getElementsByTagName("thead");
    //let thead = document.getElementsByClassName('thead')[0]
   // console.log("thead",collection[0] )
    collection[0].style.backgroundColor = localStorage.getItem('bgColor');
   // const thead = document.getElementsByTagName("thead");
   // thead[0].style.backgroundColor = localStorage.getItem('bgColor');
  // var btnn = document.getElementsByClassName("btn");
  // console.log("btn",btnn.length)
  // btnn[0].style.backgroundColor="black"
  },[])
  return (<>
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <Label> {username}</Label> <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">Account</CDropdownHeader>
        <CDropdownItem  onClick={toggle} style={{cursor:"pointer"}}>
          <CIcon  icon={cilSettings} className="me-2" />
          Theme
        </CDropdownItem>
        <CDropdownItem onClick={logout} style={{cursor:"pointer"}}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Log Out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
    <Modal isOpen={modal} toggle={toggle} size="lg" centered>
        <ModalHeader toggle={toggle}>Color</ModalHeader>
        <ModalBody>
          <Row>
            <Col md={4}>
            <SketchPicker
              color={colorHexCode}
              onChange={e => handleChangee('colorHexCode',e.hex)} />
              <b>Color Code : {colorHexCode}</b>
            </Col>
            <Col md={8}>
            <b><h4>Background color</h4></b>
        <Button type='button'  onClick={()=>{handleChangee("bgcolor","#60bcf4")}} style={{backgroundColor:"#60bcf4",color:"white",margin:"0px 5px"}}>Blue</Button>
        <Button type='button' onClick={()=>{handleChangee("bgcolor","green")}} style={{backgroundColor:"green",color:"white",margin:"0px 5px"}}>Green</Button>
         <Button type='button' onClick={()=>{handleChangee("bgcolor","#808080")}} style={{backgroundColor:"#808080",color:"white",margin:"0px 5px"}}>Black</Button>
        <Button type='button' onClick={()=>{handleChangee("bgcolor","#8a2be2")}} style={{backgroundColor:"#8a2be2",color:"white",margin:"0px 5px"}}>Blue Violet</Button>
        <Button type='button' onClick={()=>{handleChangee("bgcolor","#66023c")}} style={{backgroundColor:"#66023c",color:"white",margin:"0px 5px"}}>Tyrian Purple</Button>
        <Input type="text" name="bgcolor" value={bgcolor} style={{marginTop:"10px"}} onChange={(e)=>handleChangee(e.target.name,e.target.value)} placeholder='You can enter color codes also'/>
        <hr/>
        <b><h4>Button color</h4></b>
        <Button type='button'  onClick={()=>{handleChangee("btcolor","#60bcf4")}} style={{backgroundColor:"#60bcf4",color:"white",margin:"0px 5px"}}>Blue</Button>
        <Button type='button' onClick={()=>{handleChangee("btcolor","green")}} style={{backgroundColor:"green",color:"white",margin:"0px 5px"}}>Green</Button>
         <Button type='button' onClick={()=>{handleChangee("btcolor","orange")}} style={{backgroundColor:"orange",color:"white",margin:"0px 5px"}}>Orange</Button>
        <Button type='button' onClick={()=>{handleChangee("btcolor","#808080")}} style={{backgroundColor:"#808080",color:"white",margin:"0px 5px"}}>Black</Button>
        <Button type='button' onClick={()=>{handleChangee("btcolor","#8a2be2")}} style={{backgroundColor:"#8a2be2",color:"white",margin:"0px 5px"}}>Blue Violet</Button>
        <Input type="text" name="btcolor" value={btcolor}  style={{marginTop:"10px"}} onChange={(e)=>handleChangee(e.target.name,e.target.value)} placeholder='You can enter color codes also'/>
        <b><h4>Card color</h4></b>
        <Button type='button'  onClick={()=>{handleChangee("cardcolor","#60bcf4")}} style={{backgroundColor:"#60bcf4",color:"white",margin:"0px 5px"}}>Blue</Button>
        <Button type='button' onClick={()=>{handleChangee("cardcolor","green")}} style={{backgroundColor:"green",color:"white",margin:"0px 5px"}}>Green</Button>
        <Button type='button' onClick={()=>{handleChangee("cardcolor","red")}} style={{backgroundColor:"red",color:"white",margin:"0px 5px"}}>Red</Button>
        <Button type='button' onClick={()=>{handleChangee("cardcolor","white")}} style={{backgroundColor:"white",color:"black",margin:"0px 5px"}}>White</Button>
        <Button type='button' onClick={()=>{handleChangee("cardcolor","orange")}} style={{backgroundColor:"orange",color:"white",margin:"0px 5px"}}>Orange</Button>
        <Button type='button' onClick={()=>{handleChangee("cardcolor","#808080")}} style={{backgroundColor:"#808080",color:"white",margin:"0px 5px"}}>Black</Button>
        <Input type="text" name="cardcolor" value={cardcolor}  style={{marginTop:"10px"}} onChange={(e)=>handleChangee(e.target.name,e.target.value)} placeholder='You can enter color codes also'/>
        <b><h4>Table color</h4></b>
        <Button type='button'  onClick={()=>{handleChangee("tablecolor","#60bcf4")}} style={{backgroundColor:"#60bcf4",color:"white",margin:"0px 5px"}}>Blue</Button>
        <Button type='button' onClick={()=>{handleChangee("tablecolor","green")}} style={{backgroundColor:"green",color:"white",margin:"0px 5px"}}>Green</Button>
        <Button type='button' onClick={()=>{handleChangee("tablecolor","red")}} style={{backgroundColor:"red",color:"white",margin:"0px 5px"}}>Red</Button>
         <Button type='button' onClick={()=>{handleChangee("tablecolor","orange")}} style={{backgroundColor:"orange",color:"white",margin:"0px 5px"}}>Orange</Button>
        <Button type='button' onClick={()=>{handleChangee("tablecolor","#808080")}} style={{backgroundColor:"#808080",color:"white",margin:"0px 5px"}}>Black</Button>
        <Button type='button' onClick={()=>{handleChangee("tablecolor","#8a2be2")}} style={{backgroundColor:"#8a2be2",color:"white",margin:"0px 5px"}}>Blue Violet</Button>
        <Input type="text" name="tablecolor" value={tablecolor}  style={{marginTop:"10px"}} onChange={(e)=>handleChangee(e.target.name,e.target.value)} placeholder='You can enter color codes also'/>
            </Col>
          </Row>
        

       
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
          <Button color="primary" onClick={backGrdcolr}>
           save
          </Button>{' '}
        </ModalFooter>
      </Modal>
    </>
  )
}
export default AppHeaderDropdown
