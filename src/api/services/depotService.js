import api from '../axios';

const depotService = {
    getAll: (params) => api.get('/depots', { params }),
    getById: (id) => api.get(`/depots/${id}`),
    create: (data) => api.post('/depots', data),
    update: (id, data) => api.put(`/depots/${id}`, data),
    delete: (id) => api.delete(`/depots/${id}`),
};

export default depotService;
