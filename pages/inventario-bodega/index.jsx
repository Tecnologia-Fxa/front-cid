import { Dialog } from 'primereact/dialog'
import React, { useEffect, useRef, useState } from 'react'
import ContentDialogInventarioBodega from '../../components/inventario-bodega/ContentDialogInventarioBodega'
import ProductoBodegaService from '../../service/ProductoBodegaService'
import { Paginator } from 'primereact/paginator'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { OverlayPanel } from 'primereact/overlaypanel'
import { Divider } from 'primereact/divider';
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'
import DialogRelacionIndividual from '../../components/inventario-bodega/DialogRelacionIndividual'
import { Toast } from 'primereact/toast'
import KardexData from '../../components/inventario-bodega/KardexData'
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';



const InventarioBodega = () => {
  
  const toast = useRef(null);
  
  let op = useRef();
  let opOrdenarPor = useRef();
  let opFiltrarPor = useRef();

  const [visibilidadDialogKardex, setVisibilidadDialogKardex] = useState(false)
  const [idProductoBodega, setIdProductoBodega] = useState(false)

  const [visibilidadDialogSelectAlmacen, setVisibilidadDialogSelectAlmacen] = useState(true)
  const [relacionIndividualDialog, setRelacionIndividualDialog] = useState(false)

  const [bodegaSeleccionada, setBodegaSeleccionada] = useState(0)

  const [productos, setProductos] = useState([])
  const [resultQueryProductos, setResultQueryProductos] = useState({})

  //Pagination config
  const [basicFirst, setBasicFirst] = useState(0);
  const [basicRows, setBasicRows] = useState(15);

  const consultarProductosBodega = (queryData) =>{
    ProductoBodegaService.obtenerProductosPorBodega(bodegaSeleccionada.id_bodega, queryData).then(response=>{
      setProductos(response.data.productosBodega.data)
      setResultQueryProductos(response.data.productosBodega)
    })
  }

  //Order Config
  const [fieldSelected, setFieldSelected] = useState({});
  const [orderParameterValue, setOrderParameterValue] = useState({});
  const [orderState, setOrderState] = useState(false)

  //Filter Config
  const [fieldSelectedFilter, setFieldSelectedFilter] = useState({});
  const [valueFilter, setvalueFilter] = useState("");
  const [filterState, setFilterState] = useState(false)

  const [reload, setReload] = useState(0)

  useEffect(() => {
    if(bodegaSeleccionada){
      consultDataProducts()
    }
  }, [bodegaSeleccionada, orderState, filterState, reload]) //eslint-disable-line
  
  const fieldsTable = [
    { name: 'Sku', code: 'sku' },
    { name: 'Nombre', code: 'nombre_producto' },
    { name: 'Precio', code: 'precio_venta' },
    { name: 'Stock', code: 'stock' },
    { name: 'Fecha creación', code: 'createdAt' },
    { name: 'Fecha ultima modificación', code: 'updatedAt' },
  ]

  const orderParameter = [
    { name: 'Ascendente', code: 'asc' },
    { name: 'Descendente', code: 'desc' },
  ]

  const showKardex = (options) =>{
    setVisibilidadDialogKardex(true)
    setIdProductoBodega(options.id_producto_bodega)
  }

  const accionesTabla = rowData =>{
    return (<>
      <Button className='p-button-text' icon='pi pi-clock' tooltip='Ver Kardex' tooltipOptions={{position:"top"}} onClick={()=>showKardex(rowData)}/>      
    </>)
  }


  const setQ_FieldData = () =>{
    if(fieldSelectedFilter.code === "sku" || fieldSelectedFilter.code === "nombre_producto"){
      return {
        q_field_include:fieldSelectedFilter.code?fieldSelectedFilter.code:"",
        q_include:valueFilter?valueFilter:"",
      }
    }else{
      return {
        q_field:fieldSelectedFilter.code?fieldSelectedFilter.code:"",
        q:valueFilter?valueFilter:"",
      }
    }
  }

  const setOrderData = () =>{
    if(fieldSelected.code === "sku" || fieldSelected.code === "nombre_producto"){
      return {
        order_by_include: fieldSelected.code?fieldSelected.code:'',
        order_by_direction: orderParameterValue.code?orderParameterValue.code:''
      }
    }else{
      return {
        order_by: fieldSelected.code?fieldSelected.code:'',
        order_direction: orderParameterValue.code?orderParameterValue.code:''
      }
    }
  }



  const onBasicPageChange = (event) => {
    let queryData={
      page:event.page+1,
      limit:event.rows,
      ...setQ_FieldData(),
      ...setOrderData()
    }
    setBasicFirst(event.first);
    setBasicRows(event.rows);
    consultarProductosBodega(queryData)
  }


  const openOpOrdenarPor = e =>{
    setFieldSelected({});
    setOrderParameterValue({});
    opOrdenarPor.current.toggle(e)
  }

  const consultDataProducts= ()=>{
    setBasicFirst(0)
    let queryData={
      page:1,
      limit:basicRows,
      ...setQ_FieldData(),
      ...setOrderData()
    }
    consultarProductosBodega(queryData)
  }

  const changeOrder = () =>{
    opOrdenarPor.current.hide()
    setOrderState(true)
    consultDataProducts()
  }

  const borrarOrden = () => {
    setFieldSelected({});
    setOrderParameterValue({})
    setOrderState(false)
  }

  const openOpFiltrarPor = e =>{
    opFiltrarPor.current.toggle(e)
  }

  const changeFilter = () =>{
    opFiltrarPor.current.hide()
    setFilterState(true)
    consultDataProducts()
  }

  const borrarFiltro = () => {
    setFieldSelectedFilter({});
    setvalueFilter("");
    setFilterState(false);
  };

  const exportDataExcel = () => {
    console.log("OK!")
  }

  const confirmExport = (event) => {
    confirmPopup({
        target: event.currentTarget,
        message: '¿Está seguro de exportar la información?',
        icon: 'pi pi-info-circle',
        acceptLabel:'Descargar',
        accept: exportDataExcel
    });
  };


  return (
    <div className='card'>
        <h2>Inventario {bodegaSeleccionada?bodegaSeleccionada.nombre_bodega:"..."}<i className='pi pi-replay cursor-pointer mh-4' onClick={()=>setVisibilidadDialogSelectAlmacen(true)}/></h2>
        <div>

          <div className="grid mt-2 mb-4">
            <div className="col-12 md:col-6 flex justify-content-start align-items-center">
             {orderState && <Button icon="pi pi-sort-alt-slash" onClick={borrarOrden} className='p-button-text p-button-raised p-button-danger' tooltip='Quitar Filtro' tooltipOptions={{position:"bottom"}}/>}
              <Button icon="pi pi-sort-alpha-down-alt" label='Ordenar Por' onClick={(e) => openOpOrdenarPor(e)} className='p-button-text p-button-raised p-button-secondary mx-2'/>
              {filterState && <Button icon="pi pi-filter-slash" onClick={borrarFiltro} className='p-button-text p-button-raised p-button-danger' tooltip='Quitar Filtro' tooltipOptions={{position:"bottom"}}/>}
              <Button icon="pi pi-filter" label='Filtrar Por' onClick={openOpFiltrarPor} className='p-button-text p-button-raised p-button-secondary mx-2'/>
            </div>
            <div className="col-12 md:col-6 flex justify-content-end align-items-center">
              {/* <Button label='Exportar Información' icon="pi pi-file-pdf" className='p-button-text p-button-raised mx-4' /> */}
              <Button label='Exportar Información' icon="pi pi-file-excel" className='p-button-text p-button-raised mx-4 p-button-success' onClick={(e) => confirmExport(e)}/>
              <Button label='Relacionar Producto' icon="pi pi-plus-circle" className='p-button-text p-button-raised mx-4' onClick={(e) => op.current.toggle(e)}/>
            </div>
          </div>

          <DataTable value={productos} size="small" emptyMessage="No se encontro información" >
            <Column field="sku" header="Sku" />
            <Column field="nombre_producto" header="Nombre" />
            <Column field="precio_venta" header="Precio" />
            <Column field="fecha_creacion" header="Fecha Creacion" />
            <Column field="fecha_actualizacion" header="Fecha Ultimo Cambio" />
            <Column field="stock" header="Stock" />
            <Column  body={accionesTabla} />
          </DataTable>

          <Paginator first={basicFirst} rows={basicRows} totalRecords={resultQueryProductos.total} rowsPerPageOptions={[15, 30, 60, 120, 240]} onPageChange={onBasicPageChange}/>

        </div>


      <Dialog header="Consultar Inventario Bodega" visible={visibilidadDialogSelectAlmacen} onHide={() => setVisibilidadDialogSelectAlmacen(false)}
        style={{ width: '30vw' }} breakpoints={{ '960px': '50vw', '641px': '100vw' }} closable={false}>
          <ContentDialogInventarioBodega hide={()=>setVisibilidadDialogSelectAlmacen(false)} setBodegaSeleccionada={setBodegaSeleccionada}/>
      </Dialog>

      <OverlayPanel ref={op} style={{width: '250px', maxWidth:'300px'}}>
        <Button className='w-full p-button-text p-button-secondary' label='Relación Individual' icon='pi pi-plus-circle' onClick={() => setRelacionIndividualDialog(true)}/>
        <Divider className='m-0'/>
        {/* <Button className='w-full p-button-text p-button-secondary' label='Cargar Archivo' icon='pi pi-file-o'/> */}
      </OverlayPanel>


      <OverlayPanel ref={opOrdenarPor} showCloseIcon style={{width: '300px', maxWidth:'350px'}}>
        <h5 className='text-center'>Ordenar Por:</h5>
        <Dropdown  options={fieldsTable} value={fieldSelected} onChange={e=>setFieldSelected(e.value)} optionLabel="name" placeholder="Seleccione un campo"  className='w-full my-2'/>
        <Dropdown  options={orderParameter} value={orderParameterValue} onChange={e=>setOrderParameterValue(e.value)} optionLabel="name" placeholder="Establecer orden"  className='w-full my-2'/>
        <Button label='Generar Orden' className='w-full mt-2' onClick={changeOrder}/>
      </OverlayPanel>

      <OverlayPanel ref={opFiltrarPor} showCloseIcon style={{width: '300px', maxWidth:'350px'}}>
        <h5 className='text-center'>Filtrar Por:</h5>
        <Dropdown  options={fieldsTable} value={fieldSelectedFilter} onChange={e=>setFieldSelectedFilter(e.value)} optionLabel="name" placeholder="Seleccione un campo"  className='w-full my-2'/>
        <InputText value={valueFilter} onChange={(e) => setvalueFilter(e.target.value)} className='w-full' placeholder='Valor a consultar'/>
        <Button label='Generar Filtro' className='w-full mt-2' onClick={changeFilter}/>
      </OverlayPanel>

      <Dialog header="Relacionar Productos Bodega" visible={relacionIndividualDialog} onHide={() => setRelacionIndividualDialog(false)}
        style={{ width: '50vw' }} breakpoints={{ '960px': '80vw', '641px': '100vw' }}>
          <DialogRelacionIndividual bodegaSeleccionada={bodegaSeleccionada} toast={toast} hide={()=>setRelacionIndividualDialog(false)} reloadData={()=>setReload(reload+1)}/>
      </Dialog>

      <Dialog header="Kardex - Historico Movimientos" visible={visibilidadDialogKardex} onHide={()=>setVisibilidadDialogKardex(false)} breakpoints={{'960px': '85vw', '640px': '100vw'}} style={{width: '70vw'}}>
        <KardexData idProductoBodega={idProductoBodega}/>
      </Dialog>


      <Toast ref={toast} position="bottom-right"/>
      <ConfirmPopup />
    </div>
  )
}

export default InventarioBodega