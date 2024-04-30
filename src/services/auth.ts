import axios from 'axios';
import Cookies from 'js-cookie';

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

export async function signUp(formData: any) {
  try {
    const response = await axios.post(`${backendUrl}/api/member/signup`, formData);
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error(`Error during signup: ${error}`);
  }
};

export async function Login(memberId: string, password: string) {
    try {
      const response = await axios.post(`${backendUrl}/api/member/login`, { memberId, password });
      console.log(response.data);
      return response.data;
    } catch (error) {
      throw new Error(`Error during login: ${error}`);
    }
};

export const isLoggedIn = () => {
    const accessToken = Cookies.get('accessToken');
    const refreshToken = Cookies.get('refreshToken');
    return !!accessToken && !!refreshToken;
};
  