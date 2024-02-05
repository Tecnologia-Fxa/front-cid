import BodegaService from '../../service/BodegaService';

const BodegaFormik = (params) => {
    const toast = params.toast; // Obtener la referencia a la función showToast

    return {
        initialValues: {
            nombre_bodega: '',
            tipo_bodega: false
        },
        validate: (data) => {
            let errors = {};
            
            if (!data.nombre_bodega) {
                errors.nombre_bodega = 'El nombre es obligatorio';
            } else if (!(data.nombre_bodega.length >= 4 && data.nombre_bodega.length <= 50)) {
                errors.nombre_bodega = 'Cantidad de caracteres de 4 a 25.';
            }
            
            return errors;
        },
        onSubmit: async (data) => {
            const resultCreate = await BodegaService.create(data)

            if (resultCreate.status === 201) {
                //params.reload()
                toast.current.show({ severity: 'success', summary: 'Sin novedades', detail: resultCreate.data.message, life: 3000 });
                params.hide()
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: resultCreate.data.message, life: 3000 });
            }
        }
    };
};

export default BodegaFormik;
