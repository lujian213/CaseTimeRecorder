import axios from 'axios';

export const fetchCases = async () => {
  const { data } = await axios.get('/cases');
  return data;
};

export const createCaseApi = async (payload) => {
  // Backend expects PUT for create
  const { data } = await axios.put('/case', payload);
  return data;
};

export const updateCaseApi = async (payload) => {
  // Backend expects POST for update
  const { data } = await axios.post(`/case`, payload);
  return data;
};

export const deleteCaseApi = async (id) => {
  const { data } = await axios.delete(`/case/${id}`);
  return data;
};
