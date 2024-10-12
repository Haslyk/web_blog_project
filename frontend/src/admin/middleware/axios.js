import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:5000',
    withCredentials: true, 
});

export const fetchCsrfToken = async () => {
    try {
        const response = await axiosInstance.get('/csrf-token');
        axiosInstance.defaults.headers.common['X-CSRF-Token'] = response.data.csrfToken;
    } catch (error) {
        console.error('CSRF token alınırken bir hata oluştu:', error);
        throw error;
    }
};

export default axiosInstance;
