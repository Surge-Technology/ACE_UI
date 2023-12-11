import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { AppContent, AppSidebar, AppFooter, AppHeader } from '../components/index'

const colorss = ["blue","green","red","black","primary","success","warning","info"];
const DefaultLayout = () => {
  const navigate = useNavigate();
  useEffect(() => {
    

    let token =localStorage.getItem('token');
    if(token<10){
    //  navigate('/login')
    const additionalValue = localStorage.getItem("accode");
    const url = additionalValue ? `/login/${additionalValue}` : '/login';
    navigate(url);
   }  
   }, []);
   
  return (
    <>
     {/* <div style={{backgroundColor:`${colorss[3]}`,backgroundSize:"cover"}}> */}
    <AppHeader />
        <AppSidebar />
       
        <AppContent />
        {/* </div> */}
          
        {/* <AppFooter /> */}
    </>
        
  )
}

export default DefaultLayout
