import React, { useEffect, useRef, useState } from 'react'
import AppConfig from '../../layout/AppConfig';
import Image from 'next/image';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { useFormik } from 'formik';
import LoginFormik from '../../helper/formik/LoginFormik';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast'
import Router from 'next/router';


const Login = () => {

    const toast = useRef(null);
    

    useEffect(()=>{
        localStorage.removeItem('token')
    },[]) //eslint-disable-line

    const formikLogin = useFormik(LoginFormik({ showToast: toast, history: Router }));
    

    const isFormFieldValid = (name) => !!(formikLogin.touched[name] && formikLogin.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formikLogin.errors[name]}</small>;
    };

    

  return (
    <div className='flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden'>
        {<div className='card' style={{width:"40vh"}}>
            <div className='relative w-full flex justify-content-center'>
                <div className='card absolute p-3' style={{top:"-5rem", borderRadius:"50%", backgroundColor:"rgba(250, 250, 250, 0.9)"}}>
                    <Image src="/util/fxa-cbs-dark.svg" width={60} height={55} alt='Logo'/>
                </div>
            </div>
            <form onSubmit={formikLogin.handleSubmit} className='w-full'>
                <span className="p-float-label mt-7 w-full">
                    <InputText 
                        className={classNames({ 'p-invalid': isFormFieldValid('usuario_acceso') })+' w-full'}
                        id="Nombre Usuario" 
                        name='usuario_acceso'
                        value={formikLogin.values.usuario_acceso} 
                        onChange={formikLogin.handleChange}
                    />
                    <label htmlFor="Nombre Usuario">Nombre Usuario</label>
                </span>
                <p className="mx-2" style={{top:'3rem'}}>{getFormErrorMessage('usuario_acceso')}</p>
                
                <span className="p-float-label mt-6 w-full">
                    <Password 
                        value={formikLogin.values.contraseña}
                        onChange={formikLogin.handleChange}
                        name='contraseña'
                        className={classNames({ 'p-invalid': isFormFieldValid('contraseña') })+' w-full'}  
                        inputId="password" 
                        inputClassName="w-full p-3 md:w-30rem"
                        feedback={false}
                        toggleMask  
                    />
                    <label htmlFor="password">Contraseña</label>
                </span>
                <p className="mx-2" style={{top:'3rem'}}>{getFormErrorMessage('contraseña')}</p>


                <Button label='Ingresar' type='submit' className='p-button-text p-button-raised w-full mt-4'/>
            </form>
        </div>}

        <Toast ref={toast} position="bottom-right"/>

    </div>
  )
}

Login.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig />
        </React.Fragment>
    );
};

export default Login