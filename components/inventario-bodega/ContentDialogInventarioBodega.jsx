import React, { useEffect, useState } from 'react'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button';
import BodegaService from '../../service/BodegaService'

const ContentDialogInventarioBodega = params => {

    const [bodegaSelectedValue, setBodegaSelectedValue] = useState(null)

    const [bodegasExistentes, setBodegasExistentes] = useState([])

    useEffect(() => {
      BodegaService.getAll().then(result=>{
        setBodegasExistentes(result.data.bodegas)
      })
    
      return () => {
      }
    }, [])
    
    const SeleccionarBodega = () =>{
        params.hide()
        params.setBodegaSeleccionada(bodegaSelectedValue)
    }

  return (
    <div className='w-full'>
        <p>Por favor, seleccione una bodega a la cual se va a consultar el inventario</p>
        <Dropdown value={bodegaSelectedValue} onChange={(e) => setBodegaSelectedValue(e.value)} options={bodegasExistentes} optionLabel="nombre_bodega" placeholder="Selecione la bodega" 
            filter className="w-full"/>
        <Button label='Consultar Inventario' className='w-full mt-4' disabled={bodegaSelectedValue?false:true} onClick={SeleccionarBodega}/>
    </div>
  )
}

export default ContentDialogInventarioBodega