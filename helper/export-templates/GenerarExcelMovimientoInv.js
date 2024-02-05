import * as XLSX from 'xlsx';

const exportarDataAlmacenesAExcel = (info, infoTable, obtenerNombreAlmacenPorId) => {

    let arrayTable = []

    for (const rowData of infoTable) {
        arrayTable.push({
            Sku:rowData.producto_bodega.producto.sku,
            Nombre:rowData.producto_bodega.producto.nombre_producto,
            Cantidad: rowData.cantidad_mov
        })
    }

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(arrayTable);
  XLSX.utils.book_append_sheet(wb, ws, 'Productos');

  const blob = new Blob([XLSX.write(wb, { bookType: 'xlsx', type: 'array' })], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${info.codigo_movimiento}.xlsx`;
  link.click();

  URL.revokeObjectURL(url);
}

export default exportarDataAlmacenesAExcel;
