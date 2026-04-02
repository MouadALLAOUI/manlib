import api from '../axios';

const detFactService = {
    getAll: (params) => api.get('/det-fact', { params }),
    getById: (id) => api.get(`/det-fact/${id}`),
    create: (data) => api.post('/det-fact', data),
    update: (id, data) => api.put(`/det-fact/${id}`, data),
    delete: (id) => api.delete(`/det-fact/${id}`),
};

export default detFactService;
