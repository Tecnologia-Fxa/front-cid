import jsPDF from 'jspdf'
import 'jspdf-autotable'; 

const GenerarMovimientoInventario = (info, infoTable, obtenerNombreAlmacenPorId) =>{
    let newInfoTable = []
    let totalUnits = 0
    for (const element of infoTable) {
        totalUnits += element.cantidad_mov
        newInfoTable.push([element.producto_bodega.producto.sku,element.producto_bodega.producto.nombre_producto,element.cantidad_mov])
    }

    const fechaCompleta = info.createdAt.split("T"); // Dividir en "T"
    const fechaSolo = fechaCompleta[0];
    
    let doc = new jsPDF('p','pt')
    
    doc.setFontSize(12)
    
    
    doc.autoTable({
        head: [['Date', 'Code']],
        body:[[fechaSolo, info.codigo_movimiento]],
        startY: 20, // Posición vertical de inicio de la tabla
        theme: 'plain', // Estilo de la tabla,
        styles: {
            lineColor: [0, 0, 0], // Color de los bordes de las celdas
            lineWidth: 0.5, // Ancho de los bordes
        },
        tableWidth:160
    });
    
    doc.setFontSize(14)
    doc.text("Inventory Movement -", 300, 35)
    doc.text(info.tipo_movimiento.titulo, 440, 35)
    doc.setFontSize(12)
    doc.text(info.tipo_movimiento.descripcion, 300, 55)


    doc.text("Origin Store: "+ obtenerNombreAlmacenPorId(info.almacen_origen), 45, 100)
    doc.text("Destination Store: "+ obtenerNombreAlmacenPorId(info.almacen_destino), 330, 100)


    doc.autoTable({
        head: [['SKU', 'Description', 'QTY'/* , 'Unit Price', 'Total Price' */]],
        body: newInfoTable,
        startY: 130, // Posición vertical de inicio de la tabla
        theme: 'plain', // Estilo de la tabla,
        styles: {
            lineColor: [0, 0, 0], // Color de los bordes de las celdas
            lineWidth: 0.5, // Ancho de los bordes
        },
        tableWidth:'auto'
    });

    doc.text('Total Ref: ' + newInfoTable.length, 40, doc.internal.pageSize.height - 40);
    doc.text('Total Units: ' + totalUnits, 340, doc.internal.pageSize.height - 40);

    doc.save(`FXA_DOC_${info.codigo_movimiento}.pdf`)

}

export default GenerarMovimientoInventario