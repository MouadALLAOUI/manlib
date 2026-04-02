import api from '../axios';

const bVentesClientService = {
    getAll: (params) => api.get('/b-ventes-clients', { params }),
    getById: (id) => api.get(`/b-ventes-clients/${id}`),
    create: (data) => api.post('/b-ventes-clients', data),
    update: (id, data) => api.put(`/b-ventes-clients/${id}`, data),
    delete: (id) => api.delete(`/b-ventes-clients/${id}`),
};

export default bVentesClientService;
