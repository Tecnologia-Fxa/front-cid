import { InputText } from 'primereact/inputtext'
import { classNames } from 'primereact/utils'
import React from 'react'
import TipoMovFormik from '../../helper/formik/TipoMovFormik';
import { useFormik } from 'formik';
import { Button } from 'primereact/button';

const CrearNuevoTipo = (params) => {


    const formikTipoMov = useFormik(TipoMovFormik({ toast:params.toast, hide:params.hide, reload:params.reloadData }));

    const isFormFieldValid = (name) => !!(formikTipoMov.touched[name] && formikTipoMov.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formikTipoMov.errors[name]}</small>;
    };

  return (
    <div>
        <h5 className='text-center'>Crear Nuevo Tipo:</h5>
        <form onSubmit={formikTipoMov.handleSubmit}>
            <span className="p-float-label mt-4">
                <InputText 
                    id="titulo" 
                    name='titulo' 
                    value={formikTipoMov.values.titulo} 
                    onChange={formikTipoMov.handleChange}
                    className={classNames({ 'p-invalid': isFormFieldValid('titulo') })+' w-full'}
                />
                <label htmlFor="username">Titulo</label>
            </span>
            <p className="mx-2" style={{top:'3rem'}}>{getFormErrorMessage('titulo')}</p>
            
            <span className="p-float-label mt-4">
                <InputText 
                    id="descripcion" 
                    name='descripcion' 
                    value={formikTipoMov.values.descripcion} 
                    onChange={formikTipoMov.handleChange}
                    className={classNames({ 'p-invalid': isFormFieldValid('descripcion') })+' w-full'}
                />
                <label htmlFor="username">Descripción</label>
            </span>
            <p className="mx-2" style={{top:'3rem'}}>{getFormErrorMessage('descripcion')}</p>
            <Button className='w-full mt-3' label='Crear Tipo' type='submit'/>
        </form>
    </div>
  )
}

export default CrearNuevoTipo