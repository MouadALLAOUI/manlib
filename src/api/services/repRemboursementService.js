import api from '../axios';

const repRemboursementService = {
    getAll: (params) => api.get('/rep-remboursements', { params }),
    getById: (id) => api.get(`/rep-remboursements/${id}`),
    create: (data) => api.post('/rep-remboursements', data),
    update: (id, data) => api.put(`/rep-remboursements/${id}`, data),
    delete: (id) => api.delete(`/rep-remboursements/${id}`),
};

export default repRemboursementService;
