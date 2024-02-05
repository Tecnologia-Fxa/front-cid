import axios from "axios"

const API = process.env.NEXT_PUBLIC_API_URL + "/usuario"

const UsuarioService = {

    IniciarSesion:(credenciales)=>{
        return axios.post(`${API}/login`, credenciales)
    },

}

export default UsuarioService