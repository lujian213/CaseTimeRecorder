import axios from 'axios';

export const fetchCategories = async () => {
  const { data } = await axios.get('/categories');
  return data;
};
