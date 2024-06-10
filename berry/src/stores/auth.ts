import { defineStore } from 'pinia';
import { router } from '@/router';
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';
import Cookies from 'js-cookie';

const baseUrl = `${import.meta.env.VITE_API_URL}/auth`;

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    // initialize state from local storage to enable user to stay logged in
    /* eslint-disable-next-line @typescript-eslint/ban-ts-comment */
    // @ts-ignore
    user: JSON.parse(localStorage.getItem('user')),
    returnUrl: null
  }),
  actions: {
    async login(username: string, password: string) {
      // 获取cookie
      const token = Cookies.get('token')
      let user = null

      if (!token) {
        user = await fetchWrapper.post(`${baseUrl}/example-oauth2orize`, null, {
          headers: {
            Accept: 'text/html'
          }
        });
      }else{
        user = {
          username: 'admin',
          firstName: 'Admin',
          lastName: 'User',
        }
      }
    
      // update pinia state
      this.user = user;
      // store user details and jwt in local storage to keep user logged in between page refreshes
      localStorage.setItem('user', JSON.stringify(user));
      // redirect to previous url or default to home page
      router.push(this.returnUrl || '/dashboard/default');
    },
    logout() {
      this.user = null;
      localStorage.removeItem('user');
      router.push('/auth/login');
    }
  }
});
