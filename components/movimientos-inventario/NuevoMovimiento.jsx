import React, { useState } from 'react'

import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown';
import { FileUpload } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import MovimientoInvService from '../../service/MovimientoInvService';


const NuevoMovimiento = (params) => {

    const [selectedTipoMov, setSelectedTipoMov] = useState(null)
    const [selectedAlmacenOrigen, setSelectedAlmacenOrigen] = useState(null)
    const [selectedAlmacenDestino, setSelectedAlmacenDestino] = useState(null)
    const [fileUp, setFileUp] = useState(null)


    const uploadFile = ({files}) =>{
        setFileUp(files[0])
    }
    
    const crearMovimiento = () =>{
        const formData = new FormData();
        console.log(fileUp)
        formData.append('id_tipo_movimiento_fk', selectedTipoMov.id_tipo_movimiento)
        formData.append('titulo', selectedTipoMov.titulo)
        formData.append('almacen_origen', selectedAlmacenOrigen.id_bodega)
        formData.append('almacen_destino', selectedAlmacenDestino.id_bodega)
        formData.append('file', fileUp)
    
        MovimientoInvService.createMov(formData).then(resultCreate=>{
            params.toast.current.show({ severity: 'success', summary: 'Sin novedades', detail: resultCreate.data.message, life: 3000 });
            params.reloadData()
            params.hide()
        }).catch(err=>{
            params.toast.current.show({ severity: 'error', summary: 'Ocurrio un error', detail: "error:"+err.data.message, life: 3000 });
            console.log(err)
        })
    }

  return (
    <div>
        <div className="card">
            <p>En esta sección, podrás generar los movimientos de inventario entre almacenes y/o gestionar el inventario de un único almacén. Es de vital importancia recordar que la plantilla solo requiere sku y cantidad, y que el sistema es sensible a mayúsculas y minúsculas.</p>
            <p className='w-full text-center'><a href='/plantilla/plantillaNuevoMovimiento.xlsx' className='cursor-pointer' style={{ color: "var(--blue-500)" }}>Descargar Plantilla</a></p>
        </div>
        <Divider />

        <div className='grid w-full justify-content-between	'>

            <Dropdown value={selectedTipoMov} filter onChange={(e) => setSelectedTipoMov(e.value)} options={params.tipoMov} optionLabel="titulo" placeholder="Tipo Movimiento" 
                className="w-full mx-3"/>
        
            <Dropdown value={selectedAlmacenOrigen} filter onChange={(e) => setSelectedAlmacenOrigen(e.value)} options={params.almacen} optionLabel="nombre_bodega" placeholder="Almacen Origen" 
                className="col-12 md:col-5 mx-3 my-3"/>
            <Dropdown value={selectedAlmacenDestino} filter onChange={(e) => setSelectedAlmacenDestino(e.value)} options={params.almacen} optionLabel="nombre_bodega" placeholder="Almacen Destino" 
                className="col-12 md:col-5 mx-3 my-3"/>

            <FileUpload className='w-full mb-3 mx-3' name="demo" url="./upload" mode="basic" accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                chooseLabel='Buscar documento'  onSelect={uploadFile}  customUpload uploadHandler={uploadFile} maxFileSize={1000000}
                invalidFileSizeMessageSummary='Archivo no valido' invalidFileSizeMessageDetail='Maximo de tamaño soportado es {0}'
                />

            <Button className='w-full mx-3' label='Crear Movimiento' onClick={crearMovimiento}/>
        </div>
    </div>
  )
}

export default NuevoMovimiento