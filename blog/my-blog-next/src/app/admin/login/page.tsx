'use client';

import { useActionState } from 'react';
import { authenticate } from '@/app/lib/actions';
import { motion } from 'framer-motion';
import { Lock, KeyRound, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-900 selection:bg-blue-500/30">
      {/* 动态背景效果 */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        {/* 网格背景 */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-4"
      >
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl sm:p-10">
          {/* 顶部装饰线 */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />

          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20">
              <Lock className="h-6 w-6" />
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl font-display">
              Admin Access
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Enter your secure credentials to continue
            </p>
          </div>

          <form action={formAction} className="space-y-6">
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative group">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <KeyRound className="h-5 w-5 text-gray-500 transition-colors group-focus-within:text-blue-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="block w-full rounded-lg border-0 bg-white/5 py-3 pl-10 text-white ring-1 ring-inset ring-white/10 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-blue-500/50 sm:text-sm sm:leading-6 transition-all duration-200"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="flex items-center space-x-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20"
              >
                <p>{errorMessage}</p>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="relative flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:from-blue-500 hover:to-indigo-500 hover:shadow-blue-500/25 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        </div>
        
        <p className="mt-6 text-center text-xs text-gray-500">
          Protected by secure authentication system
        </p>
      </motion.div>
    </div>
  );
}

