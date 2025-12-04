'use server';
 
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
 
export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', {
      password: formData.get('password'),
      redirectTo: '/admin', // 登录成功后跳转到后台首页
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return '密码错误，请重试。';
        default:
          return '发生了未知错误。';
      }
    }
    throw error;
  }
}
