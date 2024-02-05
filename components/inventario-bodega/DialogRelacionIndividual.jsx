import { Button } from 'primereact/button'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import { Paginator } from 'primereact/paginator'
import React, { useEffect, useRef, useState } from 'react'
import ProductoBodegaService from '../../service/ProductoBodegaService'
import { OverlayPanel } from 'primereact/overlaypanel'
import { Dropdown } from 'primereact/dropdown'
import { InputText } from 'primereact/inputtext'

const DialogRelacionIndividual = params => {

    const opOrdenarPor = useRef(null);
    const opFiltrarPor = useRef(null);


    const [selectedProducts, setSelectedProducts] = useState([]);


    const [productos, setProductos] = useState([])
    const [resultQueryProductos, setResultQueryProductos] = useState({})


    //Pagination config
    const [basicFirst, setBasicFirst] = useState(0);
    const [basicRows, setBasicRows] = useState(5);

    //Order Config
    const [fieldSelected, setFieldSelected] = useState({});
    const [orderParameterValue, setOrderParameterValue] = useState({});
    const [orderState, setOrderState] = useState(false)

    //Filter Config
    const [fieldSelectedFilter, setFieldSelectedFilter] = useState({});
    const [valueFilter, setvalueFilter] = useState("");
    const [filterState, setFilterState] = useState(false)

    const setProducts = (queryData) =>{
        ProductoBodegaService.obtenerProductosPorBodegaSinRela(params.bodegaSeleccionada.id_bodega, queryData).then(resultProducts=>{
            setProductos(resultProducts.data.productos.data)
            setResultQueryProductos(resultProducts.data.productos)
        })
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

    useEffect(() => {
        consultDataProducts()
      return () => {
        
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filterState, orderState]) 
    
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

      const selectionChangeProduct = (e) =>{
        if(e.type === "all"){
            setSelectedProducts([...selectedProducts, ...e.value])
        }else{
            setSelectedProducts(e.value)
        }
      }

      const openOpOrdenarPor = e =>{
        setFieldSelected({});
        setOrderParameterValue({});
        opOrdenarPor.current.toggle(e)
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

    const changeFilter = () =>{
        opFiltrarPor.current.hide()
        setFilterState(true)
        consultDataProducts()
    }

    const openOpFiltrarPor = e =>{
        opFiltrarPor.current.toggle(e)
    }

    const borrarFiltro = () => {
        setFieldSelectedFilter({});
        setvalueFilter("");
        setFilterState(false);
    };

    const  relacionarProductosBodega = () => {
        ProductoBodegaService.relacionIndividualProd(params.bodegaSeleccionada, selectedProducts).then(response=>{
            params.reloadData()
            params.toast.current.show({ severity: 'success', summary: 'Sin novedades', detail: response.data.message, life: 3000 });
            setTimeout(()=>{
                params.toast.current.show({ severity: 'info', summary: 'Info', detail: "Recordar que el proceso es asincrono y se va ejecutando de a poco en el sistema", life: 3000 });
            },400)
            params.hide()
        }).catch(err=>{
            console.log(err)
            params.toast.current.show({ severity: 'error', summary: 'Ocurrio un error', detail: err.data.message, life: 3000 });
        })
    }

  return (
    <div className='w-full'>
        <div className="grid mt-2 mb-4">
          <div className="col-12 flex justify-content-start align-items-center">
            {orderState && <Button icon="pi pi-sort-alt-slash" onClick={borrarOrden} className='p-button-text p-button-raised p-button-danger' tooltip='Quitar Filtro' tooltipOptions={{position:"bottom"}}/>}
            <Button icon="pi pi-sort-alpha-down-alt" label='Ordenar Por' onClick={(e) => openOpOrdenarPor(e)} className='p-button-text p-button-raised p-button-secondary mx-2'/>
            {filterState && <Button icon="pi pi-filter-slash" onClick={borrarFiltro} className='p-button-text p-button-raised p-button-danger' tooltip='Quitar Filtro' tooltipOptions={{position:"bottom"}}/>}
            <Button icon="pi pi-filter" label='Filtrar Por' onClick={openOpFiltrarPor} className='p-button-text p-button-raised p-button-secondary mx-2'/>
            {selectedProducts[0] && <Button icon="pi pi-trash" label='Borrar Selección' onClick={()=>setSelectedProducts([])} className='p-button-text p-button-raised p-button-secondary mx-2'/>}
          </div>
        </div>

        <DataTable value={productos} size="small" emptyMessage="No se encontro información"  selectionMode={'checkbox'} selection={selectedProducts} onSelectionChange={(e) => selectionChangeProduct(e)} dataKey="id_producto">
            <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
            <Column header="Sku" />
            <Column field="sku" header="Sku" />
            <Column field="nombre_producto" header="Nombre" />
            <Column field="costo" header="Costo" />
        </DataTable>
        <Paginator first={basicFirst} rows={basicRows} totalRecords={resultQueryProductos.total} rowsPerPageOptions={[5, 10, 20, 40, 80, 160]} onPageChange={onBasicPageChange}></Paginator> 
    
        <Button label='Relacionar Productos' className='w-full mt-3' disabled={!selectedProducts[0]?true:false} onClick={relacionarProductosBodega}/>
    
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
    </div>
  )
}

export default DialogRelacionIndividual