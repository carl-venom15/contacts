import axios from 'axios';

export const instance = axios.create({
    baseURL: `https://localhost:7071/v1/`
});

// Contacts API
export const getContactsAPI = async(params = {}) => {
    return await instance.get("contact", { params })
}

export const insertContactsAPI = async(form) => {
    return await instance.post("contact", form)
}

export const editContactsAPI = async(form) => {
    return await instance.put(`contact/${form.id}`, form)
}

export const deleteContactsAPI = async(id) => {
    return await instance.delete(`contact/${id}`)
}

export default instance;