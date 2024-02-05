import React, { useState } from 'react'
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Divider } from 'primereact/divider';
import { Button } from 'primereact/button';
import BodegaFormik from '../../helper/formik/BodegaFormik';
import { useFormik } from 'formik';
import { classNames } from 'primereact/utils';

const NewBodega = (params) => {



    const selectOptions = [
        {name:"Interna", state:false},
        {name:"Externa", state:true}
    ]

    const changeCredencialCloverState = (e) =>{
        console.log(e.value)
        formikBod.handleChange(e)
    }

    const formikBod = useFormik(BodegaFormik({ toast:params.toast, hide:params.hide /* reload:params.reloadData  */}));

    const isFormFieldValid = (name) => !!(formikBod.touched[name] && formikBod.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formikBod.errors[name]}</small>;
    };

  return (
    <div className='w-full grid mt-1'>
        <form onSubmit={formikBod.handleSubmit}>
            
            <p className='text-sm text-center card p-3'>En esta sección podra crear las bodegas para su respectiva gestión de inventario, teniendo la opción de elegir si es bodega interna o externa</p>
            <span className="p-float-label col-12">
                <InputText 
                    className={classNames({ 'p-invalid': isFormFieldValid('nombre_bodega') })+' w-full'}
                    id="nombre_bodega" 
                    name='nombre_bodega' 
                    value={formikBod.values.nombre_bodega} 
                    onChange={formikBod.handleChange}
                    />
                <label htmlFor="nombre_bodega">Nombre bodega</label>
            </span>
            <p className="mx-2" style={{top:'3rem'}}>{getFormErrorMessage('nombre_bodega')}</p>
            <p className='ml-3 text-sm'>Tipo Bodega</p>
            <Dropdown 
                className={classNames({ 'p-invalid': isFormFieldValid('tipo_bodega') })+' w-12 mx-1'}
                options={selectOptions} 
                optionLabel="name" 
                name='tipo_bodega'
                id='tipo_bodega'
                optionValue='state' 
                placeholder="Seleccione Un tipo" 
                onChange={changeCredencialCloverState}
                value={formikBod.values.tipo_bodega}
                />
            <p className="mx-2" style={{top:'3rem'}}>{getFormErrorMessage('tipo_bodega')}</p>

            <Button className='w-full mt-3' label='Crear Bodega' type='submit'/>

        </form>
    </div>
  )
}

export default NewBodega