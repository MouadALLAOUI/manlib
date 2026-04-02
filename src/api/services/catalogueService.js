import api from '../axios';

const catalogueService = {
    getAll: (params) => api.get('/catalogues', { params }),
    getById: (id) => api.get(`/catalogues/${id}`),
    create: (data) => api.post('/catalogues', data),
    update: (id, data) => api.put(`/catalogues/${id}`, data),
    delete: (id) => api.delete(`/catalogues/${id}`),
};

export default catalogueService;
