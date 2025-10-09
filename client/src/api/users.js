import axios from 'axios';

export const fetchUsers = async () => {
  const { data } = await axios.get('/users');
  return data;
};

export const createUserApi = async (payload) => {
  // Backend expects PUT for create
  const { data } = await axios.put('/users', payload);
  return data;
};

export const updateUserApi = async (id, payload) => {
  // Backend expects POST for update
  const { data } = await axios.post(`/users/${id}`, payload);
  return data;
};

export const deleteUserApi = async (id) => {
  const { data } = await axios.delete(`/users/${id}`);
  return data;
};
