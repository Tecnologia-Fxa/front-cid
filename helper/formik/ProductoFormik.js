import ProductoService from '../../service/ProductoService';

const ProductoFormik = (params) => {
    const toast = params.toast; // Obtener la referencia a la función showToast

    return {
        initialValues: {
            sku: '',
            nombre_producto: '',
            costo:''
        },
        validate: (data) => {
            let errors = {};
            
            if (!data.sku) {
                errors.sku = 'El sku es obligatorio';
            } 
            
            if (!data.nombre_producto) {
                errors.nombre_producto = 'El nombre del producto es obligatorio';
            } else if (!(data.nombre_producto.length >= 2 && data.nombre_producto.length <= 50)) {
                errors.nombre_producto = 'Cantidad de caracteres de 2 a 25.';
            }
            
            if (!data.costo) {
                errors.costo = 'El costo del producto es obligatorio';
            } else if (!/^\d+(\.\d+)?$/.test(data.costo)) {
                errors.costo = 'El costo debe ser un número válido';
            }

            return errors;
        },
        onSubmit: async (data) => {

            const resultadoCreate = await ProductoService.createNewProduct(data);

            if (resultadoCreate.status === 201) {
                params.reload()
                toast.current.show({ severity: 'success', summary: 'Sin novedades', detail: resultadoCreate.data.message, life: 3000 });
                params.opCreateNew.current.hide()
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: resultadoCreate.data.message, life: 3000 });
            }
        }
    };
};

export default ProductoFormik;
