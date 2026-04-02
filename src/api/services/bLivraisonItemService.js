import api from '../axios';

const bLivraisonItemService = {
    getAll: (params) => api.get('/b-livraison-items', { params }),
    getById: (id) => api.get(`/b-livraison-items/${id}`),
    create: (data) => api.post('/b-livraison-items', data),
    update: (id, data) => api.put(`/b-livraison-items/${id}`, data),
    delete: (id) => api.delete(`/b-livraison-items/${id}`),
};

export default bLivraisonItemService;
