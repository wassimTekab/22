import { Injectable, UnauthorizedException } from "@nestjs/common";
// @ts-ignore
// eslint-disable-next-line
import { UserService } from "../user/user.service";
import { Credentials } from "./Credentials";
import { PasswordService } from "./password.service";
import { TokenService } from "./token.service";
import { UserInfo, User, ApiError } from "./UserInfo";
import { EmailResetPasswordCredential, ResetPasswordCredential, UserCredentials } from "./Credentials";
import axios from 'axios';
import { createClient } from '@supabase/supabase-js'



@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService
  ) {}

  async validateUser(
    username: string,
    password: string
  ): Promise<UserInfo | null> {
    const user = await this.userService.findOne({
      where: { username },
    });
    if (user && (await this.passwordService.compare(password, user.password))) {
      const { roles } = user;
      return { username, roles };
    }
    return null;
  }
  async login(credentials: Credentials): Promise<UserInfo> {
    const { username, password } = credentials;
    const user = await this.validateUser(
      credentials.username,
      credentials.password
    );
    if (!user) {
      throw new UnauthorizedException("The passed credentials are incorrect");
    }
    //@ts-ignore
    const accessToken = await this.tokenService.createToken(username, password);
    return {
      accessToken,
      ...user,
    };
  }

  async signUp(credentials : UserCredentials):Promise<User | ApiError> {
    if(credentials.role?.toLowerCase() === "service_role" || credentials.role?.toLowerCase() === "admin" || credentials.role?.toLowerCase() === "super-admin"){
      throw new UnauthorizedException(`You can't sign up with the role ${credentials.role}`);
    }
          /* todo user create user supabase service client */
      return await axios.post('http://kong:8000/auth/v1/admin/users',
        credentials,
        {
          headers: {
            'Content-Type': 'application/json',
            'apikey': 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjI3MjA4NTQwLCJleHAiOjE5NzQzNjM3NDB9.pkT3PNpO4DtO45Ac5HK_TKCx8sGLgNtV__pr_ZrRSAU',
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjI3MjA4NTQwLCJleHAiOjE5NzQzNjM3NDB9.pkT3PNpO4DtO45Ac5HK_TKCx8sGLgNtV__pr_ZrRSAU'
          }
        })
        .then(response => {
          return response.data;
        })
        .catch(error => {
          return error.response.data;
        });
    }
  
  async sendEmailToResetPassword(credential : EmailResetPasswordCredential){
    const supabase = createClient('http://kong:8000', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjI3MjA4NTQwLCJleHAiOjE5NzQzNjM3NDB9.pkT3PNpO4DtO45Ac5HK_TKCx8sGLgNtV__pr_ZrRSAU')

    const redirectTo = 'http://localhost:3001/reset-password';
    const { data, error } = await supabase.auth.api
    .resetPasswordForEmail(credential.email,{
        redirectTo
    })
    if(data){
      return data;
    }else{
      return error;
    }
  }


  async resetPassword(credentials : ResetPasswordCredential){
  const supabase = createClient('http://kong:8000', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjI3MjA4NTQwLCJleHAiOjE5NzQzNjM3NDB9.pkT3PNpO4DtO45Ac5HK_TKCx8sGLgNtV__pr_ZrRSAU')
  const { data, error } = await supabase.auth.api
    .updateUser(credentials.access_token,{
        password: credentials.password
    })
    if(data){
      return data;
    }else{
      return error;
    }
  }
}
