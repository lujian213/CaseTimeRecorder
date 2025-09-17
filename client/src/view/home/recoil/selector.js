import axios from 'axios';
import { selector } from 'recoil';

export const categoriesValue = selector({
    key: 'categories', // unique ID (with respect to other atoms/selectors)
    get: async ({ get }) => {
        try {
            const resposne = await axios.get('http://103.119.16.229:9733/categories');
            return resposne.data
        } catch (e) {
            return []
        }
    },
});