import api from '../axios';

const livreService = {
    getAll: (params) => api.get('/livres', { params }),
    getById: (id) => api.get(`/livres/${id}`),
    create: (data) => api.post('/livres', data),
    update: (id, data) => api.put(`/livres/${id}`, data),
    delete: (id) => api.delete(`/livres/${id}`),
};

export default livreService;
