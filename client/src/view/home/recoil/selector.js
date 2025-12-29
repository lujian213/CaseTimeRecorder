import axios from 'axios';
import { selector } from 'recoil';

export const categoriesValue = selector({
    key: 'categories', // unique ID (with respect to other atoms/selectors)
    get: async ({ get }) => {
        try {
            const resposne = await axios.get(`${window.userConfig.api}/categories`);
            return resposne.data
        } catch (e) {
            return []
        }
    },
});