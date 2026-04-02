import api from '../axios';

const demandeFService = {
    getAll: (params) => api.get('/demande-f', { params }),
    getById: (id) => api.get(`/demande-f/${id}`),
    create: (data) => api.post('/demande-f', data),
    update: (id, data) => api.put(`/demande-f/${id}`, data),
    delete: (id) => api.delete(`/demande-f/${id}`),
};

export default demandeFService;
