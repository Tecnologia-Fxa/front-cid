import axios from "axios"

const API = process.env.NEXT_PUBLIC_API_URL + "/producto-bodega"

const ProductoBodegaService = {

    obtenerProductosPorBodega: (id_bodega, queryElements) =>{
        let queryPath = `id_bodega=${id_bodega}`
        queryElements.q_field?queryPath+=`&q_field=${queryElements.q_field}`:queryPath+="q_field="
        queryElements.q?queryPath+=`&q=${queryElements.q}`:queryPath+="q="
        queryElements.q_field_include?queryPath+=`&q_field_include=${queryElements.q_field_include}`:queryPath+="q_field_include="
        queryElements.q_include?queryPath+=`&q_include=${queryElements.q_include}`:queryPath+="q_include="
        queryElements.page?queryPath+=`&page=${queryElements.page}`:queryPath+="&page="
        queryElements.limit?queryPath+=`&limit=${queryElements.limit}`:queryPath+="&limit="
        queryElements.order_by?queryPath+=`&order_by=${queryElements.order_by}`:queryPath+="&order_by="
        queryElements.order_direction?queryPath+=`&order_direction=${queryElements.order_direction}`:queryPath+="&order_direction="
        queryElements.order_by_include?queryPath+=`&order_by_include=${queryElements.order_by_include}`:queryPath+="&order_by_include="
        queryElements.order_by_direction?queryPath+=`&order_by_direction=${queryElements.order_by_direction}`:queryPath+="&order_by_direction="

        return axios.get(`${API}/get-productos-por-bodega?${queryPath}`)
    },

    obtenerProductosPorBodegaSinRela: (id_bodega, queryElements) =>{
        let queryPath = `id_bodega=${id_bodega}`
        queryElements.q_field?queryPath+=`&q_field=${queryElements.q_field}`:queryPath+="q_field="
        queryElements.q?queryPath+=`&q=${queryElements.q}`:queryPath+="q="
        queryElements.page?queryPath+=`&page=${queryElements.page}`:queryPath+="&page="
        queryElements.limit?queryPath+=`&limit=${queryElements.limit}`:queryPath+="&limit="
        queryElements.order_by?queryPath+=`&order_by=${queryElements.order_by}`:queryPath+="&order_by="
        queryElements.order_direction?queryPath+=`&order_direction=${queryElements.order_direction}`:queryPath+="&order_direction="

        return axios.get(`${API}/get-productos-por-bodega-no-relacionados?${queryPath}`)
    },

    relacionIndividualProd: (dataBodega, productos)=>{
        return axios.post(`${API}/relacionar-individual`, {...dataBodega, productos:productos})
    }

}

export default ProductoBodegaService

