import api from '../axios';

const imprimeurService = {
    getAll: (params) => api.get('/imprimeurs', { params }),
    getById: (id) => api.get(`/imprimeurs/${id}`),
    create: (data) => api.post('/imprimeurs', data),
    update: (id, data) => api.put(`/imprimeurs/${id}`, data),
    delete: (id) => api.delete(`/imprimeurs/${id}`),
};

export default imprimeurService;
