import axios from 'axios';
import UsuarioService from '../../service/UsuarioService';

const LoginFormik = (params) => {
    const toast = params.showToast; // Obtener la referencia a la función showToast

    return {
        initialValues: {
            usuario_acceso: '',
            contraseña: ''
        },
        validate: (data) => {
            let errors = {};
            
            if (!data.usuario_acceso) {
                errors.usuario_acceso = 'Ingrese su usuario';
            } else if (!(data.usuario_acceso.length >= 3 && data.usuario_acceso.length <= 25)) {
                errors.usuario_acceso = 'Cantidad de caracteres de 3 a 25.';
            }

            if (!data.contraseña) {
                errors.contraseña = 'Ingrese su contraseña';
            }

            return errors;
        },
        onSubmit: async (data) => {
            const resultadoLogin = await UsuarioService.IniciarSesion(data);

            if (resultadoLogin.status === 201) {
                localStorage.setItem('token', resultadoLogin.data.tokenlog);
                axios.defaults.headers.common['token-login'] = localStorage.getItem('token');
                params.history.push(`/dashboard?rol=${resultadoLogin.data.tipoUsuario}`);
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: resultadoLogin.data.message, life: 3000 });
            }
        }
    };
};

export default LoginFormik;
