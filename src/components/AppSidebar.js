import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { AppSidebarNav } from './AppSidebarNav'
import { logoNegative } from 'src/assets/brand/logo-negative'
import { sygnet } from 'src/assets/brand/sygnet'
import SimpleBar from 'simplebar-react'
import Axios from "../hoc/axiosConfig"
import 'simplebar/dist/simplebar.min.css' 
import navigation from '../_nav'
import { adminMenu, staffMenu } from '../new_nav';
import axios from 'axios'
const AppSidebar = () => {
  const [newNav, setNewNav] = useState(navigation) ;
  useEffect(() => {
    let userId = localStorage.getItem('userid'); 
    axios.defaults.headers.common['Authorization'] = "Bearer " + localStorage.getItem("token");
    axios.get(`${process.env.REACT_APP_BASE_URL_BASE}auth/user/${userId}`).then((res)=>{
       let permission = res.data.roles[0];
      let arr = [];
      navigation.map((mapd)=>{
         let dataa = permission[mapd.identifier]?permission[mapd.identifier].parent:{}
        if(mapd.identifier===dataa){
         if(permission[mapd.identifier].canView===true){
             arr.push(mapd);
          }else{
            console.log("canview false",mapd.identifier )
          }
        }
      })  
      setNewNav(arr);
    }).catch(err=>{console.log(err)})
  }, []);
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)
  return (
    <>
      <nav className="dashboard-nav"
        unfoldable={unfoldable}
        visible={sidebarShow}
        onVisibleChange={(visible) => {
          dispatch({ type: 'set', sidebarShow: visible })
        }}
      >
        {/* <CSidebar
      visible={sidebarShow}
    > */}
        {/* <CSidebarBrand className="d-none d-md-flex" to="/">
        <CIcon className="sidebar-brand-full" icon={logoNegative} height={35} />
        <CIcon className="sidebar-brand-narrow" icon={sygnet} height={35} />
      </CSidebarBrand> */}
        {/* <CSidebarNav>
        <SimpleBar> */}
        {/* <AppSidebarNav items={newNav} /> */}
        <AppSidebarNav items={newNav} />
        {/* </SimpleBar>
      </CSidebarNav> */}
        <CSidebarToggler
          // className="d-none d-lg-flex"
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
        {/* </CSidebar> */}
      </nav>
    </>
  )
}
export default React.memo(AppSidebar)
