import TipoMovimientoService from "../../service/TipoMovimientoService";

const TipoMovFormik = (params) => {
    const toast = params.toast; // Obtener la referencia a la función showToast

    return {
        initialValues: {
            titulo: '',
            descripcion: ''
        },
        validate: (data) => {
            let errors = {};
            
            if (!data.titulo) {
                errors.titulo = 'El titulo es obligatorio';
            } else if (!(data.titulo.length >= 1 && data.titulo.length <= 8)) {
                errors.titulo = 'Cantidad de caracteres de 1 a 8.';
            }
            
            if (!data.descripcion) {
                errors.descripcion = 'La descripcion es obligatoria';
            } else if (!(data.descripcion.length >= 4 && data.descripcion.length <= 75)) {
                errors.descripcion = 'Cantidad de caracteres de 1 a 8.';
            }


            
            return errors;
        },
        onSubmit: async (data) => {
            const resultCreate = await TipoMovimientoService.create(data)

            if (resultCreate.status === 201) {
                params.reload()
                toast.current.show({ severity: 'success', summary: 'Sin novedades', detail: resultCreate.data.message, life: 3000 });
                params.hide()
            } else {
                toast.current.show({ severity: 'error', summary: 'Error', detail: resultCreate.data.message, life: 3000 });
            }
        }
    };
};

export default TipoMovFormik;
