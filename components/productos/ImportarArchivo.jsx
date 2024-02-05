import { Button } from 'primereact/button'
import React, { useState } from 'react'
import { FileUpload } from 'primereact/fileupload';
import ProductoService from '../../service/ProductoService';
import { Checkbox } from 'primereact/checkbox';

const ImportarArchivo = (params) => {

    
    const [formDataUploadFile, setFormDataUploadFile] = useState(new FormData())
    const [checkValue, setCheckValue] = useState(false);

    const [butonState, setButonState] = useState(true)
    const [loadingForm, setLoadingForm] = useState(false)

    const uploadFile = ({files}) =>{
        const formData = new FormData();
        console.log(files)
        formData.append('file', files[0])

        setFormDataUploadFile(formData)
        setButonState(false)
    }

    const uploadFileData = () =>{
        let form = formDataUploadFile.get("file")
        if(form && form !== 0){
            setLoadingForm(true)
            ProductoService.createByFile(formDataUploadFile, checkValue).then(response=>{
                console.log(response)
                params.toast.current.show({severity: 'success', summary: 'Todo Bien', detail: response.data.message});
                params.hideModal()
                setLoadingForm(false)
                params.reload()
            }).catch(err=>{
                console.log(err)
                console.log(err.message)
            })
        }else{
            params.toast.current.show({severity: 'error', summary: 'Error', detail: "Debe cargar la hoja de vida para poder aplicar"});
        }
    }

  return (
    <div>
        <div className="card">
            <p>En esta sección podra adjuntar un archivo para realizar la importación de manera masiva, es importante tener en cuenta la correcta estructura del documento. Podra descargar la plantilla bajo el siguiente enlace.</p>
            <p className='w-full text-center'><a href='/plantilla/plantillaCargueProducto.xlsx' className='cursor-pointer' style={{ color: "var(--blue-500)" }}>Descargar Plantilla</a></p>
        </div>
        <div className="w-full flex-row align-items-center">
            <div className="field-checkbox">
                <Checkbox inputId="check"  checked={checkValue} onChange={e => setCheckValue(e.checked)} />
                <label htmlFor="binary">Crear y actualizar productos por sku</label>
            </div>
            <FileUpload name="demo" url="./upload" mode="basic" accept='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                chooseLabel='Buscar documento'  onSelect={uploadFile}  customUpload uploadHandler={uploadFile} maxFileSize={1000000}
                invalidFileSizeMessageSummary='Archivo no valido' invalidFileSizeMessageDetail='Maximo de tamaño soportado es {0}'
                />


            <Button className='w-full mt-3' label='Cargar Archivo' icon="pi pi-upload" disabled={butonState} onClick={uploadFileData} loading={loadingForm}/>
        </div>
    </div>
  )
}

export default ImportarArchivo