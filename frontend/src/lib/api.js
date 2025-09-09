import { axiosInstance } from "./axios.js";
export const signup = async (signupData) => {
          const response = await axiosInstance.post('/auth/signup', signupData);
          return response.data;
        }

export const login = async (loginData) => {
          const response = await axiosInstance.post('/auth/login', loginData);
          return response.data;
        }
export const logout = async () => {
          try {
            const response = await axiosInstance.post('/auth/logout');
          return response.data;
          } catch (error) {
            console.log("Logout error:", error);
            return null;
          }
        }
export const getAuthUser = async () => {
      
         try {
             const res = await axiosInstance.get('/auth/me')
        return res.data
          } catch (error) {
            console.log("error in get authUser:", error);
            return null;
          }
      }

export const completeOnboarding = async (userData) => {
        const res = await axiosInstance.post('/auth/onboarding', userData)
        return res.data
      }
