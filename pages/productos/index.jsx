import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { OverlayPanel } from 'primereact/overlaypanel'
import { Dropdown } from 'primereact/dropdown'
import ProductoService from '../../service/ProductoService'
import { Paginator } from 'primereact/paginator'
import { InputText } from 'primereact/inputtext'
import NewProduct from '../../components/productos/NewProduct'
import { Toast } from 'primereact/toast'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'; 
import { Dialog } from 'primereact/dialog'
import ImportarArchivo from '../../components/productos/ImportarArchivo'
const Productos = () => {

  const toast = useRef(null);
  

  const opOrdenarPor = useRef(null);
  const opFiltrarPor = useRef(null);
  const opCreateNew = useRef(null);

  //Pagination config
  const [basicFirst, setBasicFirst] = useState(0);
  const [basicRows, setBasicRows] = useState(15);

  //Order Config
  const [fieldSelected, setFieldSelected] = useState({});
  const [orderParameterValue, setOrderParameterValue] = useState({});
  const [orderState, setOrderState] = useState(false)

  //Filter Config
  const [fieldSelectedFilter, setFieldSelectedFilter] = useState({});
  const [valueFilter, setvalueFilter] = useState("");
  const [filterState, setFilterState] = useState(false)
  

  const [productos, setProductos] = useState([])
  const [resultQueryProductos, setResultQueryProductos] = useState({})

  //Gancho para recargar la pagina
  const [reload, setReload] = useState(0)


  //Gancho que controla la visibilidad de la ventana modal de importar archivo
  const [displayImportarArchivoDialog, setDisplayImportarArchivoDialog] = useState(false)

  const setProducts = (queryData) =>{
    ProductoService.getAllProducts(queryData).then(resultProducts=>{
      setProductos(resultProducts.data.productos.data)
      setResultQueryProductos(resultProducts.data.productos)
    })
  }
  

  const onBasicPageChange = (event) => {
    let queryData={
      page:event.page+1,
      limit:event.rows,
      q_field:fieldSelectedFilter.code?fieldSelectedFilter.code:"",
      q:valueFilter?valueFilter:"",
      order_by: fieldSelected.code?fieldSelected.code:'',
      order_direction: orderParameterValue.code?orderParameterValue.code:''
    }
    setBasicFirst(event.first);
    setBasicRows(event.rows);
    setProducts(queryData)
  }
  

  const fieldsTable = [
    { name: 'Sku', code: 'sku' },
    { name: 'Nombre', code: 'nombre_producto' },
    { name: 'Costo', code: 'costo' },
    { name: 'Fecha creación', code: 'createdAt' },
    { name: 'Fecha ultima modificación', code: 'updatedAt' },
  ]

  const orderParameter = [
    { name: 'Ascendente', code: 'asc' },
    { name: 'Descendente', code: 'desc' },
  ]


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
      q_field:fieldSelectedFilter.code?fieldSelectedFilter.code:"",
      q:valueFilter?valueFilter:"",
      order_by:fieldSelected.code?fieldSelected.code:"",
      order_direction:orderParameterValue.code?orderParameterValue.code:""
    }
    setProducts(queryData)
  }

  const changeOrder = () =>{
    opOrdenarPor.current.hide()
    setOrderState(true)
    consultDataProducts()
  }

  const openOpFiltrarPor = e =>{
    opFiltrarPor.current.toggle(e)
  }

  const changeFilter = () =>{
    opFiltrarPor.current.hide()
    setFilterState(true)
    consultDataProducts()
  }

  const borrarOrden = () => {
    setFieldSelected({});
    setOrderParameterValue({})
    setOrderState(false)
  }

  const borrarFiltro = () => {
    setFieldSelectedFilter({});
    setvalueFilter("");
    setFilterState(false);
  };


  useEffect(() => {
    if(!filterState || !orderState){
      consultDataProducts()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterState, orderState, reload]) 
  
  const textEditor = (options) => {
    return <InputText type="text" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
  }

  const confirmEdit = e=>{
    if(e.data.costo === e.newData.costo && e.data.nombre_producto === e.newData.nombre_producto && e.data.sku === e.newData.sku) {
      toast.current.show({ severity: 'warn', summary: 'Información', detail: "No se ha realizado ningun cambio", life: 3000 });
    }else{
      console.log(e.newData)
 
      if (!e.newData.sku) {
        toast.current.show({ severity: 'error', summary: 'Información', detail: 'El sku es obligatorio', life: 3000 });
      }else if (!e.newData.nombre_producto) {
        toast.current.show({ severity: 'error', summary: 'Información', detail: 'El nombre del producto es obligatorio', life: 3000 });
      } else if (!(e.newData.nombre_producto.length >= 2 && e.newData.nombre_producto.length <= 50)) {
        toast.current.show({ severity: 'error', summary: 'Información', detail: 'El nombre debe tener una cantidad de caracteres de 2 a 25.', life: 3000 });
      }else if (!e.newData.costo) {
        toast.current.show({ severity: 'error', summary: 'Información', detail: 'El costo del producto es obligatorio', life: 3000 });
      } else if (!/^\d+(\.\d+)?$/.test(e.newData.costo)) {
        toast.current.show({ severity: 'error', summary: 'Información', detail: 'El costo debe ser un número válido', life: 3000 });
      }else{
        ProductoService.updateOneProduct(e.newData).then(responseUpdate=>{
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
      header:'Editar Producto',
      message: '¿Está seguro de realizar esta acción?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel:"¡Seguro!",
      accept: () => confirmEdit(e)
  });

};

  return (
    <div className='w-full card'>

      <h2>Control Productos</h2>        

      <div className='w-full'>
        <div className="grid mt-2 mb-4">
          <div className="col-12 md:col-6 flex justify-content-start align-items-center">
            {orderState && <Button icon="pi pi-sort-alt-slash" onClick={borrarOrden} className='p-button-text p-button-raised p-button-danger' tooltip='Quitar Filtro' tooltipOptions={{position:"bottom"}}/>}
            <Button icon="pi pi-sort-alpha-down-alt" label='Ordenar Por' onClick={(e) => openOpOrdenarPor(e)} className='p-button-text p-button-raised p-button-secondary mx-2'/>
            {filterState && <Button icon="pi pi-filter-slash" onClick={borrarFiltro} className='p-button-text p-button-raised p-button-danger' tooltip='Quitar Filtro' tooltipOptions={{position:"bottom"}}/>}
            <Button icon="pi pi-filter" label='Filtrar Por' onClick={openOpFiltrarPor} className='p-button-text p-button-raised p-button-secondary mx-2'/>
          </div>
          <div className="col-12 md:col-6 flex justify-content-end align-items-center">
            <Button label='Importar Archivo' icon="pi pi-file-o" className='p-button-text p-button-raised mx-4' onClick={()=>setDisplayImportarArchivoDialog(true)}/>
            <Button label='Crear Nuevo' icon="pi pi-plus-circle" className='p-button-text p-button-raised mx-4' onClick={e=>opCreateNew.current.toggle(e)}/>
          </div>
        </div>

        <DataTable value={productos}  onRowEditComplete={confirmAccion} editMode="row" size="small" emptyMessage="No se encontro información" >
            <Column editor={(options) => textEditor(options)} field="sku" header="Sku" />
            <Column editor={(options) => textEditor(options)} field="nombre_producto" header="Nombre" />
            <Column editor={(options) => textEditor(options)} field="costo" header="Costo" />
            <Column field="fecha_creacion" header="Fecha Creacion" />
            <Column field="fecha_actualizacion" header="Fecha Ultimo Cambio" />
            <Column  rowEditor />
        </DataTable>
        <Paginator first={basicFirst} rows={basicRows} totalRecords={resultQueryProductos.total} rowsPerPageOptions={[15, 30, 60, 120, 240]} onPageChange={onBasicPageChange}></Paginator>
      </div>

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

      <OverlayPanel ref={opCreateNew} showCloseIcon style={{width: '350px', maxWidth:'400px'}}>
        <NewProduct reloadData={()=>setReload(reload+1)} opCreateNew={opCreateNew} toast={toast}/>
      </OverlayPanel>

      <Dialog header="Importar Archivo" visible={displayImportarArchivoDialog}  breakpoints={{'960px': '50vw', '640px': '90vw'}} style={{width: '30vw'}} onHide={() => setDisplayImportarArchivoDialog(false)}>
        <ImportarArchivo toast={toast} hideModal={()=>setDisplayImportarArchivoDialog(false)} reload={()=>setReload(reload+1)}/>
      </Dialog>

      <Toast ref={toast} position="bottom-right"/>

      <ConfirmDialog />
    </div>
  )
}

export default Productos

