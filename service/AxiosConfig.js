import axios from "axios";

const redirecciona = async(params) =>{
  return params.router.push('/login')
}

const axiosMethod = (params) =>{
  let token = "";

  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  axios.defaults.headers.common['token'] = token

  let errTest = 0


  axios.interceptors.response.use(config=>{
    if (typeof window !== "undefined") {
      token = localStorage.getItem("token");
    }
    axios.defaults.headers.common['token'] = token
    return config;
  }, err=> {
    // Do something with request error
    if ((err.response.status === 401 || err.response.status === 408) && errTest===0) {
        localStorage.removeItem('token')
        alert(err.response.data.error)
        redirecciona(params).then(()=>{
          params.router.reload(window.location.pathname)
        })
        errTest++
    }else if (err.response.status === 403  && errTest===0) {
        alert(err.response.data.error)
        params.router.push('/')
        errTest++
    }
  });
}

  
export default axiosMethod