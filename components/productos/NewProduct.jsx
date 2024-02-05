import React, { useRef } from 'react'
import ProductoFormik from '../../helper/formik/ProductoFormik';
import { useFormik } from 'formik';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';

const NewProduct = (params) => {



    const formikProd = useFormik(ProductoFormik({ toast:params.toast, reload:params.reloadData, opCreateNew:params.opCreateNew }));

    const isFormFieldValid = (name) => !!(formikProd.touched[name] && formikProd.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldValid(name) && <small className="p-error">{formikProd.errors[name]}</small>;
    };

  return (
    <div>
        <h5 className='text-center'>Craer Nuevo Producto</h5>
        <form onSubmit={formikProd.handleSubmit}>
            <span className="p-float-label mt-4">
                <InputText 
                    id="sku" 
                    name='sku' 
                    value={formikProd.values.sku} 
                    onChange={formikProd.handleChange}
                    className={classNames({ 'p-invalid': isFormFieldValid('sku') })+' w-full'}
                />
                <label htmlFor="username">Sku</label>
            </span>
            <p className="mx-2" style={{top:'3rem'}}>{getFormErrorMessage('sku')}</p>
            
            <span className="p-float-label mt-4">
                <InputText 
                    id="nombre_producto" 
                    name='nombre_producto' 
                    value={formikProd.values.nombre_producto} 
                    onChange={formikProd.handleChange}
                    className={classNames({ 'p-invalid': isFormFieldValid('nombre_producto') })+' w-full'}
                />
                <label htmlFor="username">Nombre Producto</label>
            </span>
            <p className="mx-2" style={{top:'3rem'}}>{getFormErrorMessage('nombre_producto')}</p>
            
            <span className="p-float-label mt-4">
                <InputText 
                    id="costo" 
                    name='costo' 
                    value={formikProd.values.costo} 
                    onChange={formikProd.handleChange}
                    className={classNames({ 'p-invalid': isFormFieldValid('costo') })+' w-full'}
                />
                <label htmlFor="username">Costo</label>
            </span>
            <p className="mx-2" style={{top:'3rem'}}>{getFormErrorMessage('costo')}</p>


            <Button type='submit' label='Crear Producto' className='w-full'/>

        </form>


    </div>
  )
}

export default NewProduct