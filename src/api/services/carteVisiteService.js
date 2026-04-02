import api from '../axios';

const carteVisiteService = {
    getAll: (params) => api.get('/carte-visites', { params }),
    getById: (id) => api.get(`/carte-visites/${id}`),
    create: (data) => api.post('/carte-visites', data),
    update: (id, data) => api.put(`/carte-visites/${id}`, data),
    delete: (id) => api.delete(`/carte-visites/${id}`),
};

export default carteVisiteService;
