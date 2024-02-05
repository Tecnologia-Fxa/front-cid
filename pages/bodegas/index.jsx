import { Button } from 'primereact/button'
import React, { useEffect, useRef, useState } from 'react'
import { Dialog } from 'primereact/dialog';
import NewBodega from '../../components/bodegas/NewBodega';
import { Toast } from 'primereact/toast';
import BodegaService from '../../service/BodegaService';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import UpdateCredencialesBodega from '../../components/bodegas/UpdateCredencialesBodega';

const Bodegas = () => {

    const [dialogCreateState, setDialogCreateState] = useState(false)
    const [dialogUpdateState, setDialogUpdateState] = useState(false)

    const toast = useRef(null);

    const [bodegas, setBodegas] = useState([])
    const [reload, setReload] = useState([])

    const [id_credencial_fk, setId_credencial_fk] = useState(0)

    useEffect(() => {
      BodegaService.getAll().then(bodegasResult=>{
        setBodegas(bodegasResult.data.bodegas)
      }).catch(error=>{
        console.log(error)
      })
    }, [reload])
    


    const tipoBodega = (option) =>{
        return (<>
            {!option.tipo_bodega?"Interna":"Externa"}
        </>)
    }

    const fechaCreacion = (option) =>{
        let fecha = new Date(option.createdAt)
        return (<>
            {`${fecha.getFullYear()}/${fecha.getMonth()+1}/${fecha.getDate()}`}
        </>)
    }

    const fechaActualizacion = (option) =>{
        let fecha = new Date(option.updatedAt)
        return (<>
            {`${fecha.getFullYear()}/${fecha.getMonth()+1}/${fecha.getDate()}`}
        </>)
    }

    const openDialogChangeCredentials = (idCred) =>{
      setDialogUpdateState(true)
      setId_credencial_fk(idCred)
    }

    const confirmAccion = (e) =>{
        if(e.data.nombre_bodega === e.newData.nombre_bodega) {
            toast.current.show({ severity: 'warn', summary: 'Información', detail: "No se ha realizado ningun cambio", life: 3000 });
          }else{
            console.log(e.newData)
       
            if (!e.newData.nombre_bodega) {
              toast.current.show({ severity: 'error', summary: 'Información', detail: 'El nombre de la bodega es obligatorio', life: 3000 });
            } else if (!(e.newData.nombre_bodega.length >= 4 && e.newData.nombre_bodega.length <= 50)) {
              toast.current.show({ severity: 'error', summary: 'Información', detail: 'El nombre debe tener una cantidad de caracteres de 4 a 25.', life: 3000 });
            }else{
              BodegaService.updateName(e.newData).then(responseUpdate=>{
                setReload(reload+1)
                toast.current.show({ severity: 'success', summary: 'Sin novedades', detail: responseUpdate.data.message, life: 3000 });
              }).catch(()=>{
                toast.current.show({ severity: 'error', summary: 'Error', detail: "Ocurrio un error", life: 3000 });
              })
            }
        }
    }

    const textEditor = (options) => {
        return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
    }

  return (
    <div className='card w-full'>
        <div className='w-full grid'>
            <h2 className='col-6'>Control Bodegas</h2>
            <span className='col-6 flex align-items-end justify-content-end'>
                <Button label='Crear nueva bodega' icon='pi pi-plus-circle' className='p-button-raised p-button-text' onClick={()=>setDialogCreateState(true)}/>
            </span>
        </div>

        <DataTable value={bodegas}  onRowEditComplete={confirmAccion} editMode="row" size="small" emptyMessage="No se encontro información" >
            <Column field="id_bodega" header="Id" />
            <Column editor={(options) => textEditor(options)} field="nombre_bodega" header="Nombre" />
            <Column body={tipoBodega} field="tipo_bodega" header="Tipo Bodega" />
            <Column field="createdAt"  body={fechaCreacion} header="Fecha Creacion" />
            <Column field="updatedAt" body={fechaActualizacion} header="Fecha Ultimo Cambio" />
            <Column header="Editar"  rowEditor />
        </DataTable>


        <Dialog header="Crear Bodega" visible={dialogCreateState} onHide={()=>setDialogCreateState(false)} breakpoints={{'960px': '75vw', '640px': '100vw'}} style={{width: '30vw'}}>
            <NewBodega toast={toast} hide={()=>setDialogCreateState(false)}/>
        </Dialog>

        <Dialog header="Actualizar Credenciales Bodega" visible={dialogUpdateState} onHide={()=>setDialogUpdateState(false)} breakpoints={{'960px': '75vw', '640px': '100vw'}} style={{width: '30vw'}}>
            <UpdateCredencialesBodega id_credencial_fk={id_credencial_fk} hide={()=>setDialogUpdateState(false)} toast={toast}/>
        </Dialog>

        

        <Toast ref={toast} position="bottom-right"/>


    </div>
  )
}

export default Bodegas