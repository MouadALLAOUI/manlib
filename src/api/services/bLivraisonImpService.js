import api from '../axios';

const bLivraisonImpService = {
    getAll: (params) => api.get('/b-livraison-imps', { params }),
    getById: (id) => api.get(`/b-livraison-imps/${id}`),
    create: (data) => api.post('/b-livraison-imps', data),
    update: (id, data) => api.put(`/b-livraison-imps/${id}`, data),
    delete: (id) => api.delete(`/b-livraison-imps/${id}`),
    deleteGroup: (id) => api.delete(`/b-livraison-imps/bulk-delete/${id}`),
};

export default bLivraisonImpService;
