import axios from 'axios';

export const fetchRecords = async (id) => {
  const { data } = await axios.get(`/records/${id}`);
  return data;
};

export const createRecordApi = async (payload) => {
  // Backend expects PUT for create
  const { data } = await axios.put('/record', payload);
  return data;
};

export const updateRecordApi = async (payload) => {
  // Backend expects POST for update
  const { data } = await axios.post(`/record`, payload);
  return data;
};

export const deleteRecordApi = async (caseId, recordId) => {
  const { data } = await axios.delete(`/record?caseId=${caseId}&recordId=${recordId}`);
  return data;
};

export const fetchRecordsByCaseId = async (caseId) => {
  const { data } = await axios.get(`/case/${caseId}/record`);
  return data;
};
