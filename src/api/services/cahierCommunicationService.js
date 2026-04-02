import api from '../axios';

const cahierCommunicationService = {
    getAll: (params) => api.get('/cahier-communications', { params }),
    getById: (id) => api.get(`/cahier-communications/${id}`),
    create: (data) => api.post('/cahier-communications', data),
    update: (id, data) => api.put(`/cahier-communications/${id}`, data),
    delete: (id) => api.delete(`/cahier-communications/${id}`),
};

export default cahierCommunicationService;
