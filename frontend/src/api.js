import axios from 'axios';

const url = process.env.REACT_APP_ENVIRONMENT === 'local ' ? 'http://localhost:3030' : ''

const api = axios.create({
  baseURL: url + '/api/',
  headers: {
    common: {
      Authorization: setHeader(),
    }
  }
});

export function setHeader() {
  if (JSON.parse(localStorage.getItem('user'))) {
    return JSON.parse(localStorage.getItem('user')).token
  } else {
    return null
  }
}

export default api;
