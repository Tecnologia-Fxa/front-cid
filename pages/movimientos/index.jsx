import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import React, { useEffect, useRef, useState } from 'react'
import ControlTiposMovimiento from '../../components/movimientos-inventario/ControlTiposMovimiento'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Paginator } from 'primereact/paginator'
import MovimientoInvService from '../../service/MovimientoInvService'
import BodegaService from '../../service/BodegaService'
import TipoMovimientoService from '../../service/TipoMovimientoService'
import NuevoMovimiento from '../../components/movimientos-inventario/NuevoMovimiento'
import { Toast } from 'primereact/toast'
import MovimientoInventarioView from '../../components/movimientos-inventario/MovimientoInventarioView'


const Movimientos = () => {

  const toast = useRef(null);

  const [dialogControlTipos, setDialogControlTipos] = useState(false)
  const [dialogNuevoMovimiento, setDialogNuevoMovimiento] = useState(false)
  const [dialogMovimientoInventario, setDialogMovimientoInventario] = useState(false)
  
  const [movimientos, setMovimientos] = useState([])
  const [resultQueryMovimientos, setResultQueryMovimientos] = useState([])

  const [reload, setReload] = useState(0)

    //Filter Config
    const [fieldSelectedFilter, setFieldSelectedFilter] = useState({});
    const [valueFilter, setvalueFilter] = useState("");
    const [filterState, setFilterState] = useState(false)

  //Pagination config
  const [basicFirst, setBasicFirst] = useState(0);
  const [basicRows, setBasicRows] = useState(15);

  //Data tablasExtra
  const [almacen, setAlmacen] = useState([])
  const [tipoMov, setTipoMov] = useState([])

  //Data vista de movimiento
  const [idMovimiento, setIdMovimiento] = useState(0)

  useEffect(() => {
    BodegaService.getAll().then(resultB =>{
      let bodegas = resultB.data.bodegas
      bodegas.push({id_bodega:0,nombre_bodega:"N/A"})
      setAlmacen(resultB.data.bodegas)
      console.log(resultB.data.bodegas)
    })
    TipoMovimientoService.getAll().then(resultTM=>{
      setTipoMov(resultTM.data.tiposMovimiento)
      console.log(resultTM.data.tiposMovimiento)
    })
    return () => {  
    }
  }, [])
  

  useEffect(() => {
    if(!filterState){
      consultDataProducts()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterState, reload]) 
  

  const verMovimeintoInventario = options =>{
    setDialogMovimientoInventario(true)
    setIdMovimiento(options.id_movimiento)
  }

  const accionesTabla = (options) =>{
    return (<>
      <Button  className='p-button-text' icon='pi pi-eye' onClick={()=>verMovimeintoInventario(options)}/>
    </>)
  }

  const consultDataProducts= ()=>{
    setBasicFirst(0)
    let queryData={
      page:1,
      limit:basicRows,
      q_field:fieldSelectedFilter.code?fieldSelectedFilter.code:"",
      q:valueFilter?valueFilter:""
    }
    setProducts(queryData)
  }

  const setProducts = (queryData) =>{
    MovimientoInvService.getAll(queryData).then(resultProducts=>{
      setMovimientos(resultProducts.data.movimientos.data)
      setResultQueryMovimientos(resultProducts.data.movimientos)
    })
  }

  const onBasicPageChange = (event) => {
    let queryData={
      page:event.page+1,
      limit:event.rows,
      q_field:fieldSelectedFilter.code?fieldSelectedFilter.code:"",
      q:valueFilter?valueFilter:""
    }
    setBasicFirst(event.first);
    setBasicRows(event.rows);
    setProducts(queryData)
  }

  const obtenerNombreAlmacenPorId = (id) => {
    const almacenE = almacen.find(item => item.id_bodega === id);
    return almacenE ? almacenE.nombre_bodega : 'Almacén no encontrado';
  }

  const obtenerAlmacenOrigen = (dataItem)=>{
    return obtenerNombreAlmacenPorId(dataItem.almacen_origen)
  }
  const obtenerAlmacenDestino = (dataItem)=>{
    return obtenerNombreAlmacenPorId(dataItem.almacen_destino)
  }

  return (
    <div className='card'>
        <div className='w-full grid'>
          <h2 className='col-6'>Control Movimientos</h2>
          <span className='col-6 flex align-items-end justify-content-end'>
              <Button label='Control Tipos' icon='pi pi-cog' className='p-button-raised p-button-text mx-4' onClick={()=>setDialogControlTipos(true)} />
              <Button label='Nuevo Movimiento' icon='pi pi-plus-circle' className='p-button-raised p-button-text' onClick={()=>setDialogNuevoMovimiento(true)} />
          </span>
        </div>

        <DataTable value={movimientos} size="small" emptyMessage="No se encontro información" >
          <Column field="codigo_movimiento" header="Código" />
          <Column field="usuario.nombres_usuario" header="Usuario" />
          <Column body={e=>obtenerAlmacenOrigen(e)} field="almacen_origen" header="Almacen Origen" />
          <Column body={e=>obtenerAlmacenDestino(e)} field="almacen_destino" header="Almacen Destino" />
          <Column field="tipo_movimiento.titulo" header="Tipo Mov" />
          <Column field="fecha_actualizacion" header="Fecha Actualización" />
          <Column  body={accionesTabla} />
        </DataTable>
        <Paginator first={basicFirst} rows={basicRows} totalRecords={resultQueryMovimientos.total} rowsPerPageOptions={[15, 30, 60, 120, 240]} onPageChange={onBasicPageChange}></Paginator>


        <Dialog header="Control Tipos Movimiento" visible={dialogControlTipos} onHide={()=>setDialogControlTipos(false)} breakpoints={{'960px': '75vw', '640px': '100vw'}} style={{width: '40vw'}}>
          <ControlTiposMovimiento />
        </Dialog>

        <Dialog header="Nuevo Movimiento" visible={dialogNuevoMovimiento} onHide={()=>setDialogNuevoMovimiento(false)} breakpoints={{'960px': '75vw', '640px': '100vw'}} style={{width: '40vw'}}>
          <NuevoMovimiento almacen={almacen} tipoMov={tipoMov} toast={toast} reloadData={()=>setReload(reload+1)} hide={()=>setDialogNuevoMovimiento(false)}/>
        </Dialog>

        <Dialog header="Movimiento de inventario" visible={dialogMovimientoInventario} onHide={()=>setDialogMovimientoInventario(false)} breakpoints={{'960px': '75vw', '640px': '100vw'}} style={{width: '60vw'}}>
          <MovimientoInventarioView idMov={idMovimiento} almacen={almacen}/>
        </Dialog>



        <Toast ref={toast} position="bottom-right"/>


    </div>
  )
}

export default Movimientos