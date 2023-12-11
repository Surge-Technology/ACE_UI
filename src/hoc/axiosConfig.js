import axios from 'axios';
import Swal from 'sweetalert2';

const instance = axios.create({
  baseURL : process.env.REACT_APP_BASE_URL,
  timeout: 15000,
});
//let token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJtYW5pQGdtYWlsLmNvbSIsImV4cCI6MTY3NDE1MDUxNiwiaWF0IjoxNjc0MTMyNTE2fQ.iUjf7VthLeRVJ9Pk1i1L-M2jBfRqxaVrzcArNXthBolHozbhTeR1ieIEZrjnNjEs2e9fje-oysfm_aMNZhEmiw"
instance.defaults.headers.common['Authorization'] =  "Bearer " + localStorage.getItem("token");
//instance.defaults.headers.common['Authorization'] =  "Bearer " + token;
console.log("localStorage.getItem",localStorage.getItem("token"))
instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

instance.interceptors.response.use(function (config) {
   let token =localStorage.getItem('token');
        if(token<10){
            console.log("token cleared");
         localStorage.clear();
        window.location.reload(false);
          //this.props.history.push("/auth/Login");
       }   
    if(config.status ===200 || config.status===201 || config.status===204){
      return config;
    }else{
      console.log("success code must me 200 , 201 or 204");
    }
   // return config;
  }, function (error) {
      console.log(error.response);
    
    // if(error.response){
      if(error.response===undefined){
        //connection refused
        console.log("Connection refused");
         localStorage.clear();
        window.location.reload(false);
      }
        if(error.response.status === 401){
          Swal.fire(
            '401 session expired..!',
            'Please re-login',
            'question'
          )
          console.log("config 401");
           localStorage.clear()
           window.location.reload(false);
         //  window.location = '/login';  
         
                 //this.props.history.push("/login");
        }
        if(error.response.status === 500){
            Swal.fire(
                error.response.data.message,
                 'Please try again '
              )
              return error.response;
          } 
          if(error.response.status === 404){
            Swal.fire("Requested URL not found",error.response.data.message);   
          }
          return error.response;
      //    let token =localStorage.getItem('token');
      //   if(token<10){
      //     console.log("token 401",this.props.history)
      //     //window.location = '/auth/Login';
      //      localStorage.clear();
      //     this.props.history.push("/login");
      //  }   
    //      if(error.response.status === 400){
    //       Swal.fire({
    //         position: 'center',
    //         icon: 'question',
    //         title: error.response.data.password,
    //         showConfirmButton: false,
    //         timer: 1500
    //       })
    //     }
    //     if(error.response.status === 403){
    //       console.log("You don't have permission to access on this server",error.response);       
    //     }
       
    //     if(error.response.status === 405){
    //       console.log("This request method not allowed",error.response);
    //     }
      
    //     else{
    //       console.log(error.response);
    //       //return error;
    //       // Swal.fire(
    //       //   error.response.data.message,
    //       //    'question'
    //       // )
    //     }
    // }
    // if(!error.response){
    //   //console.log("token",token);
    //   // window.location = '/auth/Login';
    // }
    return Promise.reject(error);
  });
export default instance;