// import axios from 'axios';

// const api = axios.create({
//     baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:1100/api'
// });

// export const attachToken = (token) => {
//     api.interceptors.request.use((config) => {
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//         return config;
//     });
// };

// export default api;

// frontend/src/api/axios.js
import axios from 'axios';

// Prefer production env var, fall back to local only when nothing is set
const baseURL =
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    'http://localhost:1100/api';

const api = axios.create({
    baseURL,
});

export const attachToken = (token) => {
    api.interceptors.request.use((config) => {
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });
};

export default api;
