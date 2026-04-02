import api from '../axios';

const factService = {
    getAll: (params) => api.get('/factures', { params }),
    getById: (id) => api.get(`/factures/${id}`),
    create: (data) => api.post('/factures', data),
    update: (id, data) => api.put(`/factures/${id}`, data),
    delete: (id) => api.delete(`/factures/${id}`),
};

export default factService;
