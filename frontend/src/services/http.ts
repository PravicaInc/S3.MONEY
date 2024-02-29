import axios from 'axios';
import { setupCache } from 'axios-cache-interceptor';

const globalAxiosInstance = setupCache(
  axios.create({
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  }),
  {
    ttl: 0,
  }
);

export default globalAxiosInstance;
