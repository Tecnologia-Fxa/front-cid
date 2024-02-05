import { useFormik } from 'formik';
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { classNames } from 'primereact/utils';
import React from 'react'
import BodegaService from '../../service/BodegaService';

const UpdateCredencialesBodega = (params) => {
    
    const toast = params.toast; // Obtener la referencia a la función showToast

    const formik = useFormik({
        initialValues: {
            id_comercial_clover:'',
            token_clover:''
        },
        validate: (data) => {
            let errors = {};
            
            if (!data.id_comercial_clover) {
                errors.id_comercial_clover = 'El id de clover es obligatorio';
            } else if (!(data.id_comercial_clover.length >= 4 && data.id_comercial_clover.length <= 50)) {
                errors.id_comercial_clover = 'Cantidad de caracteres de 4 a 50.';
            }      

            if (!data.token_clover) {
                errors.token_clover = 'El id de clover es obligatorio';
            } else if (!(data.token_clover.length >= 4 && data.token_clover.length <= 50)) {
                errors.token_clover = 'Cantidad de caracteres de 4 a 50.';
            }      
            
            
            return errors;
        },
        onSubmit: async (data) => {
            let dataForm = {
                ...data,
                id_credencial_fk:params.id_credencial_fk
            }
            console.log(dataForm)
            const resultUpdate = await BodegaService.updateCloverCredencials(dataForm)

            if (resultUpdate.status === 201) {
                toast.current.show({ severity: 'success', summary: 'Sin novedades', detail: resultUpdate.data.message, life: 3000 });
                params.hide()
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: resultUpdate.data.message, life: 3000 });
            }
        }
    });


    
    const isFormFieldValid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formik.errors[name]}</small>;
    };

  return (
    <div>
        <form onSubmit={formik.handleSubmit}>
            <p className='text-sm text-center card p-3'>En esta sección podra ingresar el id comercial y el token de acceso en dado caso que este haya cambiado en Clover. <br/><b>Por favor, no actualizar si no es necesario.</b></p>
            <span className="p-float-label col-12">
                <InputText
                    className={classNames({ 'p-invalid': isFormFieldValid('id_comercial_clover') })+' w-full'}
                    id="id_comercial_clover" 
                    name='id_comercial_clover' 
                    onChange={formik.handleChange}
                    value={formik.values.id_comercial_clover}
                    />
                <label htmlFor="id_comercial_clover">ID Comercial</label>
            </span>
            {<p className="mx-2" style={{top:'3rem'}}>{getFormErrorMessage('id_comercial_clover')}</p>}

            <span className="p-float-label mt-4 col-12">
                <InputText 
                    className={classNames({ 'p-invalid': isFormFieldValid('token_clover') })+' w-full'}
                    id="token_clover" 
                    name='token_clover' 
                    onChange={formik.handleChange}
                    value={formik.values.token_clover}
                    />
                <label htmlFor="token_clover">Token Clover</label>
            </span>
            {<p className="mx-2" style={{top:'3rem'}}>{getFormErrorMessage('token_clover')}</p>}
            <Button className='w-full mt-3' label='Actualizar Credenciales' type='submit'/>
        </form>
    </div>
  )
}

export default UpdateCredencialesBodega