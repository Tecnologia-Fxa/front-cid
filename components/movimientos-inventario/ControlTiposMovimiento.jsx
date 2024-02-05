import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React, { useEffect, useRef, useState } from 'react'
import TipoMovimientoService from '../../service/TipoMovimientoService'
import { InputText } from 'primereact/inputtext'
import { OverlayPanel } from 'primereact/overlaypanel'
import CrearNuevoTipo from './CrearNuevoTipo'
import { Toast } from 'primereact/toast'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'; 


const ControlTiposMovimiento = () => {

    const toast = useRef(null);

    const [tiposMovimiento, setTiposMovimiento] = useState([])

    const opCrearNuevoTipo = useRef(null);

    const [reload, setReload] = useState(0)

    useEffect(() => {
        TipoMovimientoService.getAll().then(resp=>{
            setTiposMovimiento(resp.data.tiposMovimiento)
        })
      return () => {
      }
    }, [reload])
    
    const confirmEdit = (e) =>{
        if(e.data.descripcion === e.newData.descripcion) {
            toast.current.show({ severity: 'warn', summary: 'Información', detail: "No se ha realizado ningun cambio", life: 3000 });
          }else{
            console.log(e.newData)
       
            if (!e.newData.descripcion) {
              toast.current.show({ severity: 'error', summary: 'Información', detail: 'La descripción es obligatoria', life: 3000 });
            } else if (!(e.newData.descripcion.length >= 4 && e.newData.descripcion.length <= 75)) {
              toast.current.show({ severity: 'error', summary: 'Información', detail: 'La descripción debe tener una cantidad de caracteres de 4 a 25.', life: 3000 });
            }else{
                TipoMovimientoService.update(e.newData).then(responseUpdate=>{
                    setReload(reload+1)
                    toast.current.show({ severity: 'success', summary: 'Sin novedades', detail: responseUpdate.data.message, life: 3000 });
                }).catch(()=>{
                    toast.current.show({ severity: 'error', summary: 'Error', detail: "Ocurrio un error", life: 3000 });
                })
            }
        }
    }

    const confirmAccion = (e) => {
        confirmDialog({
          header:'Editar Tipo Movimiento',
          message: '¿Está seguro de realizar esta acción?',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel:"¡Seguro!",
          accept: () => confirmEdit(e)
      });
    }

    const changeState = (options) =>{
        let data = {
            id_tipo_movimiento: options.id_tipo_movimiento,
            estado: !options.estado
        }
        TipoMovimientoService.changeState(data).then(responseUpdate=>{
            setReload(reload+1)
            toast.current.show({ severity: 'success', summary: 'Sin novedades', detail: responseUpdate.data.message, life: 3000 });
        }).catch(()=>{
            toast.current.show({ severity: 'error', summary: 'Error', detail: "Ocurrio un error", life: 3000 });
        })
    }

    const confirmChangeState = (options) => {
        confirmDialog({
          header:'Cambiar Estado Tipo Movimiento',
          message: '¿Está seguro de realizar esta acción?',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel:"¡Seguro!",
          accept: () => changeState(options)
      });
    }

    const cambiarEstadoTipoMovimiento = (options) =>{
        return (<>
            <Button icon="pi pi-sync" tooltip='Cambiar estado' className='p-button-text p-button-warning' onClick={e=>confirmChangeState(options)}/>
        </>)
    }

    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    }

    const infoEstado = (options) =>{
        return (<>
            {options.estado?"Activo":"Inactivo"}
        </>)
    }

  return (
    <div>
        <Button className='p-button-text p-button-raised mb-4 mt-2' icon='pi pi-plus-circle' label='Crear Nuevo' onClick={e=>opCrearNuevoTipo.current.toggle(e)}/>
        <DataTable value={tiposMovimiento}  onRowEditComplete={confirmAccion} editMode="row" size="small" emptyMessage="No se encontro información" >
            <Column field="id_tipo_movimiento" header="Id" />
            <Column field="titulo" header="Titulo" />
            <Column editor={(options) => textEditor(options)} field="descripcion" header="Descripcion" />
            <Column field="estado" body={infoEstado} header="Estado" />
            <Column  rowEditor />
            <Column  body={cambiarEstadoTipoMovimiento} />
        </DataTable>

        <OverlayPanel ref={opCrearNuevoTipo} showCloseIcon style={{width: '300px', maxWidth:'350px'}}>
            <CrearNuevoTipo toast={toast} hide={()=>opCrearNuevoTipo.current.hide()} reloadData={()=>setReload(reload+1)}/>
        </OverlayPanel>

        <Toast ref={toast} position="bottom-right"/>
        <ConfirmDialog />

    </div>
  )
}

export default ControlTiposMovimiento