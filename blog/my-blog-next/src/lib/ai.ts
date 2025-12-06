import OpenAI from 'openai';
import { HttpsProxyAgent } from 'https-proxy-agent';

// 代理地址：只从环境变量读取，绝不硬编码默认值，否则会影响 Vercel 生产环境
const PROXY_URL = process.env.https_proxy || process.env.http_proxy;

// 只有在配置了代理环境变量时才使用 Agent
const agent = PROXY_URL ? new HttpsProxyAgent(PROXY_URL) : undefined;

// 确保在 .env.local 中配置了 OPENAI_API_KEY
// 如果使用第三方代理（如 OneAPI），可以配置 baseURL
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL, // Vercel 上通常不需要这个，除非用第三方
  timeout: 60000, // 设置超时时间为 60秒
  maxRetries: 3, // 失败重试次数
  // @ts-ignore - OpenAI Node SDK 支持 httpAgent 但类型定义可能未更新
  httpAgent: agent, // 仅当 agent 存在时生效
});

/**
 * 将文本转换为向量
 * 使用 text-embedding-3-small 模型 (性价比最高)
 */
export async function getEmbeddings(text: string): Promise<number[]> {
  // 移除换行符，减少干扰
  const cleanText = text.replace(/\n/g, ' ');
  
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: cleanText,
    encoding_format: 'float',
  });

  return response.data[0].embedding;
}

export default openai;
