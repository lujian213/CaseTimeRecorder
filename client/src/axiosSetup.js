import axios from 'axios';

// Base URL per environment
axios.defaults.baseURL = process.env.NODE_ENV === 'development'
  ? window.userConfig.api                       // dev: go through CRA proxy
  : window.userConfig.api;    // prod: direct API

// Default timeout
axios.defaults.timeout = 30000;

// Inject a global Basic Authorization header for all axios requests
axios.interceptors.request.use((config) => {
  if (!config.headers) {
    config.headers = {};
  }
  if (!config.headers['Authorization']) {
    config.headers['Authorization'] = 'Basic YWRtaW46YWRtaW4=';
  }
  return config;
});
