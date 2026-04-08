import api from '../axios';

const banqueService = {
    getAll: (params) => api.get('/banques', { params }),
    getById: (id) => api.get(`/banques/${id}`),
    create: (data) => api.post('/banques', data),
    update: (id, data) => api.put(`/banques/${id}`, data),
    delete: (id) => api.delete(`/banques/${id}`),
};

export default banqueService;
