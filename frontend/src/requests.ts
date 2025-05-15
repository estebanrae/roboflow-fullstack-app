import type { Pantry, PantryItem } from './types'
import axios from 'axios'

const base_url = "http://127.0.0.1:5000/api"

const fetchPantryItems = async (id: string): Promise<Pantry> => {
    const res = await axios.get(`${base_url}/pantry/${id}`)
    return res.data    
}

const fetchPantries = async (): Promise<Pantry[]> => {
    const res = await axios.get(`${base_url}/pantries/`)
    return res.data
    
}

const createPantry = async ({name}: {name: string}): Promise<string> => {
    // const res = await axios.get('/api/pantry')
    const res = await axios.post(`${base_url}/pantry`, { name })
    if (res.status === 200 || res.status === 201){
        return res.data.id
    }else{
        throw Error("Flunk")
    }   
}

const consumeItems = async (items: { [id: number]: PantryItem; }): Promise<string> => {

    const res = await axios.post(`${base_url}/consume`, { items })
    if (res.status === 200 || res.status === 201){
        return res.data.id
    }else{
        throw Error("Flunk")
    }   
}


const uploadImages = async (files:  File[], id: string): Promise<boolean> => {
    // const res = await axios.get('/api/pantry')
    const formData = new FormData()
    files.forEach((file) => {
        formData.append('files', file)
    })
    formData.append('pantry_id', id)

    const res = await axios.post(`${base_url}/upload`, formData, {headers: {
        'Content-Type': 'multipart/form-data'
    }})
    if (res.status === 200 || res.status === 201){
        return res.data.id
    }else{
        throw Error("Flunk")
    }   
}

export {fetchPantryItems, fetchPantries, consumeItems, createPantry, uploadImages}