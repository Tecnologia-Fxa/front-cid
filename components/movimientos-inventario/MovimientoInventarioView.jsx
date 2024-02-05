import React, { useEffect, useState } from 'react'
import MovimientoInvService from '../../service/MovimientoInvService'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import GenerarMovimientoInventario from '../../helper/export-templates/GenerarMovimientoInventario';
import exportarDataAlmacenesAExcel from '../../helper/export-templates/GenerarExcelMovimientoInv';

const MovimientoInventarioView = params => {

    const [dataMov, setDataMov] = useState({})
    const [dataMovTable, setDataMovTable] = useState([])

    const filters={
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        'producto_bodega.producto.sku': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'producto_bodega.producto.nombre_producto': { value: null, matchMode: FilterMatchMode.CONTAINS  },
        cantidad_mov: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
    }

    useEffect(() => {
        if(params.idMov){
          console.log(params.almacen)
            MovimientoInvService.getOne(params.idMov).then(response=>{
                setDataMov(response.data.movEncontrado)
                setDataMovTable(retornarArregloSinDuplicados(response.data.movEncontrado.detalle_movimiento_inventario))
            })
        }
    
      return () => {
        
      }
    }, [params.idMov]) //eslint-disable-line
    
    const retornarArregloSinDuplicados = (arreglo) =>{
        const productosProcesados = {}; // Mapa para realizar el seguimiento de productos procesados

        const resultadoSinDuplicados = arreglo.filter((detalle) => {
          const { sku, producto_bodega: { producto: { nombre_producto } } } = detalle;
          const clave = `${sku}_${nombre_producto}`;
        
          if (!productosProcesados[clave]) {
            productosProcesados[clave] = true;
            return true;
          }
        
          return false;
        });
        console.log(arreglo)
        console.log(resultadoSinDuplicados)
        return resultadoSinDuplicados
    }

    const obtenerNombreAlmacenPorId = (id) => {
      const almacen = params.almacen.find(item => item.id_bodega === id);
      return almacen ? almacen.nombre_bodega : 'Almacén no encontrado';
    }

    const generarPdf = () =>{
      GenerarMovimientoInventario(dataMov, dataMovTable, obtenerNombreAlmacenPorId)
    }
    const generarXlsx = () =>{
      exportarDataAlmacenesAExcel(dataMov, dataMovTable, obtenerNombreAlmacenPorId)
    }



  return (
    <div >
        <div className='w-full grid mt-2 justify-content-between'>
            <span className='col-6'><b>Código: </b>{dataMov.codigo_movimiento}</span>
            <span className='col-6'>
                <Button className='p-button-text p-button-success p-2 p-button-raised mx-3' icon="pi pi-file-excel" label='Exportar Excel' onClick={generarXlsx}/>
                <Button className='p-button-text p-button-danger p-2 p-button-raised' icon="pi pi-file-pdf" label='Exportar Pdf' onClick={generarPdf}/>
            </span>
        </div>
        <div className='mb-3'><b>Encargado: </b>{dataMov.usuario?dataMov.usuario.nombres_usuario:""}</div>
        <div className='my-3'><b>Tipo Movimiento: </b>{dataMov.tipo_movimiento?dataMov.tipo_movimiento.titulo:""}</div>
        <div className='w-full grid my-2'>
            <span className='col-6'><b>Almacen Origen: </b>{obtenerNombreAlmacenPorId(dataMov.almacen_origen)}</span>
            <span className='col-6'><b>Almacen Destino: </b>{obtenerNombreAlmacenPorId(dataMov.almacen_destino)}</span>
        </div>

        <DataTable value={dataMovTable} paginator rows={10} dataKey="id_detalle_movimiento_inventario" filters={filters} filterDisplay="row"
                globalFilterFields={['name', 'country.name', 'representative.name', 'status']} emptyMessage="No customers found.">
            <Column field="producto_bodega.producto.sku" header="SKU" filter filterPlaceholder="Buscar Por SKU" style={{ minWidth: '12rem' }} />
            <Column field="producto_bodega.producto.nombre_producto" header="Nombre" filter filterPlaceholder="Buscar Por Nombre" style={{ minWidth: '12rem' }} />
            <Column field="cantidad_mov" header="Cantidad" filter filterPlaceholder="Buscar Por Cantidad" style={{ minWidth: '12rem' }} />
            
        </DataTable>
    </div>
  )
}

export default MovimientoInventarioView