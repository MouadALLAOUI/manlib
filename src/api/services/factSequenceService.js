import api from '../axios';

const factSequenceService = {
    getAll: (params) => api.get('/fact-sequences', { params }),
    getById: (id) => api.get(`/fact-sequences/${id}`),
    create: (data) => api.post('/fact-sequences', data),
    update: (id, data) => api.put(`/fact-sequences/${id}`, data),
    delete: (id) => api.delete(`/fact-sequences/${id}`),
};

export default factSequenceService;
