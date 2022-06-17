import { AuthProvider } from "react-admin";
import {
  CREDENTIALS_LOCAL_STORAGE_ITEM,
  USER_DATA_LOCAL_STORAGE_ITEM,
} from "../constants";
import { Credentials } from "../types";

async function loginUser(credentials: Credentials) {
  return fetch('http://localhost:8000/auth/v1/token?grant_type=password', {
    method: 'POST',
    headers: {
      'apikey': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjI3MjA4NTQwLCJleHAiOjE5NzQzNjM3NDB9.pkT3PNpO4DtO45Ac5HK_TKCx8sGLgNtV__pr_ZrRSAU'
    },
    body: JSON.stringify({email : credentials.username, password :credentials.password})
  })  
    .then(data => data.json())
 }

export const jwtAuthProvider: AuthProvider = {
  login: async (credentials: Credentials) => {
   const response = await loginUser(credentials);
    if (response.access_token) {
      localStorage.setItem(
        CREDENTIALS_LOCAL_STORAGE_ITEM,
        createBearerAuthorizationHeader(response.access_token)
      );
      localStorage.setItem(
        USER_DATA_LOCAL_STORAGE_ITEM,
        JSON.stringify(response)
      );
      return Promise.resolve();
    }
    return Promise.reject();
  },
  logout: () => {
    localStorage.removeItem(CREDENTIALS_LOCAL_STORAGE_ITEM);
    return Promise.resolve();
  },
  checkError: ({ status }: any) => {
    if (status === 401 || status === 403) {
      localStorage.removeItem(CREDENTIALS_LOCAL_STORAGE_ITEM);
      return Promise.reject();
    }
    return Promise.resolve();
  },
  checkAuth: () => {
    return localStorage.getItem(CREDENTIALS_LOCAL_STORAGE_ITEM)
      ? Promise.resolve()
      : Promise.reject();
  },
  getPermissions: () => Promise.reject("Unknown method"),
  getIdentity: () => {
    const str = localStorage.getItem(USER_DATA_LOCAL_STORAGE_ITEM);
    const userData: any = JSON.parse(str || "");
    return Promise.resolve({
      id: userData.user.id,
      fullName: userData.user.email,
      avatar: undefined,
    });
  },
};

export function createBearerAuthorizationHeader(accessToken: string) {
  return `Bearer ${accessToken}`;
}
