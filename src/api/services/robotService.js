import api from '../axios';

const robotService = {
    getAll: (params) => api.get('/robots', { params }),
    getById: (id) => api.get(`/robots/${id}`),
    create: (data) => api.post('/robots', data),
    update: (id, data) => api.put(`/robots/${id}`, data),
    delete: (id) => api.delete(`/robots/${id}`),
};

export default robotService;
