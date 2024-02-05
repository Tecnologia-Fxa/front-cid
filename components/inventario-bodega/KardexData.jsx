/* eslint-disable react-hooks/exhaustive-deps */
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React, { useEffect, useState } from 'react'
import DetalleMovimientoInvService from '../../service/DetalleMovimientoInv'
import { Button } from 'primereact/button'
import { Calendar } from 'primereact/calendar';

const KardexData = params => {

    let hoy = new Date()

    const [dataKardex, setDataKardex] = useState({})
    const [dataKardexTable, setDataKardexTable] = useState([])

    const establecerFormato = fecha => `${fecha.getFullYear()}-${(fecha.getMonth()+1).toString().padStart(2, "0")}-${(fecha.getDate()).toString().padStart(2, "0")}`

    const [fechaIni, setfechaIni] = useState(hoy)
    const [fechaFin, setfechaFin] = useState(hoy)

    const [reload, setReload] = useState(0)

    useEffect(() => {
        if(params.idProductoBodega){
            DetalleMovimientoInvService.getKardex(params.idProductoBodega, establecerFormato(fechaIni), establecerFormato(fechaFin)).then(response=>{
                
                let objetDataKardexTable = []

                response.data?.resultadosKardex.map((el,id)=>{
                    
                    if(el.id_venta_fk){
                        objetDataKardexTable.push({
                            "encargado":"Venta Clover",
                            "tipo_movimiento":"MV",
                            "fecha_hora": new Date(el.venta_clover.createdAt),
                            "descripcion":"Salida",
                            "cantidad" : el.cantidad_mov,
                            "restante" : el.cantidad_res,
                        })
                    }else{
                        objetDataKardexTable.push({
                            "encargado":el.movimiento_inventario?.usuario.nombres_usuario,
                            "tipo_movimiento":el.movimiento_inventario?.tipo_movimiento.titulo,
                            "fecha_hora": new Date(el.createdAt),
                            "descripcion":el.tipoMov,
                            "cantidad" : el.cantidad_mov,
                            "restante" : el.cantidad_res,
                        })
                    }

                    return false
                })
                
                const objetDataKardex = {
                    "sku": response.data?.dataProd.producto.sku,
                    "nombre_producto":response.data?.dataProd.producto.nombre_producto
                }

                setDataKardex(objetDataKardex)
                setDataKardexTable(objetDataKardexTable)
            })
        }
    
      return () => {
        
      }
    }, [params.idProductoBodega, reload])

    const fechaTabla = rowData =>{
        const date = new Date(rowData.fecha_hora);
        const formattedDate = date.toISOString().slice(0, 19).replace("T", " ");
        return formattedDate
    }

  return (
    <div>

        <div className='w-full grid my-2'>
            <Calendar className='mx-2' value={fechaIni} onChange={(e) => setfechaIni(e.value)} dateFormat="yy/mm/dd" maxDate={fechaFin}/>
            <Calendar className='mx-2' value={fechaFin} onChange={(e) => setfechaFin(e.value)} dateFormat="yy/mm/dd" minDate={fechaIni}/>
            <Button icon="pi pi-search" onClick={()=>setReload(reload+1)}/>
        </div>

        <DataTable value={dataKardexTable} paginator rows={10} dataKey="id_detalle_movimiento_inventario"
                emptyMessage="No se han realizado movimientos para las fechas establecidas">
            <Column field="encargado" header="Encargado"/>
            <Column body={()=>dataKardex?.sku} header="SKU"/>
            <Column body={()=>dataKardex?.nombre_producto} header="Nombre"/>
            <Column field="tipo_movimiento" header="Tipo Movimiento"/>
            <Column field="fecha_hora" body={fechaTabla} header="Fecha y hora mov" sortable/>
            <Column field="descripcion" header="Descripción"/>
            <Column field="cantidad" header="Cantidad"/>
            <Column field="restante" header="Restante"/>
            
        </DataTable>
    </div>
  )
}

export default KardexData