import axios from "axios";


const client = axios.create({
    baseURL: 'http://localhost/my_contact/my_contact/public/api',
    timeout: 1000
  });

export { client }