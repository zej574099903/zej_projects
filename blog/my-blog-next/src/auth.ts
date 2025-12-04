import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // 显示在默认登录页上的表单字段
      credentials: {
        password: { label: "Password", type: "password" }
      },
      // 认证逻辑
      authorize: async (credentials) => {
        // 简单的密码验证
        if (credentials?.password === process.env.ADMIN_PASSWORD) {
          // 验证成功，返回用户对象
          // 注意：Auth.js v5 要求必须返回一个对象
          return { id: "1", name: "Admin", email: "admin@example.com" };
        }
        
        // 验证失败，返回 null
        return null;
      },
    }),
  ],
  pages: {
    signIn: '/admin/login', // 自定义登录页面路径
  },
});
