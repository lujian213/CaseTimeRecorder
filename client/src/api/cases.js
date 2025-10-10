import axios from 'axios';

export const fetchCases = async () => {
  const { data } = await axios.get('/cases');
  return data;
};

export const createCaseApi = async (payload) => {
  // Backend expects PUT for create
  const { data } = await axios.put('/cases', payload);
  return data;
};

export const updateCaseApi = async (id, payload) => {
  // Backend expects POST for update
  const { data } = await axios.post(`/cases/${id}`, payload);
  return data;
};

export const deleteCaseApi = async (id) => {
  const { data } = await axios.delete(`/cases/${id}`);
  return data;
};
