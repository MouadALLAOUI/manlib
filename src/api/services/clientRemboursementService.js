import api from '../axios';

const clientRemboursementService = {
    getAll: (params) => api.get('/client-remboursements', { params }),
    getById: (id) => api.get(`/client-remboursements/${id}`),
    create: (data) => api.post('/client-remboursements', data),
    update: (id, data) => api.put(`/client-remboursements/${id}`, data),
    delete: (id) => api.delete(`/client-remboursements/${id}`),
};

export default clientRemboursementService;
