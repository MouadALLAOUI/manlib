import api from '../axios';

const bLivraisonService = {
    getAll: (params) => api.get('/b-livraisons', { params }),
    getById: (id) => api.get(`/b-livraisons/${id}`),
    create: (data) => api.post('/b-livraisons', data),
    update: (id, data) => api.put(`/b-livraisons/${id}`, data),
    delete: (id) => api.delete(`/b-livraisons/${id}`),
};


export default bLivraisonService;
