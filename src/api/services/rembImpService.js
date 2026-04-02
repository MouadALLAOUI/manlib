import api from '../axios';

const rembImpService = {
    getAll: (params) => api.get('/remb-imps', { params }),
    getById: (id) => api.get(`/remb-imps/${id}`),
    create: (data) => api.post('/remb-imps', data),
    update: (id, data) => api.put(`/remb-imps/${id}`, data),
    delete: (id) => api.delete(`/remb-imps/${id}`),
};

export default rembImpService;
