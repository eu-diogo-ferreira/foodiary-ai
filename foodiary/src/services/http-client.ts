import axios from 'axios';

export const httpClient = axios.create({
  baseURL: 'https://xmksx5m030.execute-api.us-east-1.amazonaws.com',
});