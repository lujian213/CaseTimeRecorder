import axios from 'axios';

export const fetchRecords = async (id) => {
  const { data } = await axios.get(`/records/${id}`);
  return data;
};

export const createRecordApi = async (payload) => {
  // Backend expects PUT for create
  const { data } = await axios.put('/records', payload);
  return data;
};

export const updateRecordApi = async (id, payload) => {
  // Backend expects POST for update
  const { data } = await axios.post(`/records/${id}`, payload);
  return data;
};

export const deleteRecordApi = async (id) => {
  const { data } = await axios.delete(`/records/${id}`);
  return data;
};

export const fetchRecordsByCaseId = async (caseId) => {
  const { data } = await axios.get(`/case/${caseId}/records`);
  return data;
};
