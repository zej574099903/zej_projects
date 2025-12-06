---
title: "Next.js 全栈进阶(5)：从零实现 AI 语义搜索 (RAG)"
date: "2025-12-06"
category: "全栈开发"
tags: ["Next.js", "AI", "RAG", "Vector Search", "MongoDB"]
description: "详细记录了如何为个人博客打造 ChatGPT 级别的 AI 搜索体验。涵盖了从文本向量化 (Embedding)、MongoDB Atlas 向量索引配置、到 cmdk 前端交互的完整 RAG 链路实现。"
---

传统的关键词搜索（如 Algolia 或 ElasticSearch）只能匹配字面意思，当你搜“React 状态管理”时，它可能搜不到只写了“Zustand”或“Redux”但没写“状态管理”的文章。

而 **AI 语义搜索 (Semantic Search)** 能理解意图。今天，我们利用 **RAG (检索增强生成)** 技术，把博客的搜索体验提升一个维度。

## 1. 架构设计

我们采用最轻量级的 RAG 架构：

*   **Embedding 模型**：OpenAI `text-embedding-3-small` (性价比之王)。
*   **向量数据库**：直接复用 **MongoDB Atlas** (通过 Vector Search 索引)，无需引入 Pinecone 或 Milvus 等额外设施。
*   **交互 UI**：基于 `cmdk` 实现类似 macOS Spotlight 的全局搜索指令。

## 2. 核心实现

### 2.1 数据向量化 (Embedding)

我们编写了一个 Admin API 脚本，遍历所有文章（包括本地 Markdown 和数据库文章），将其切分为 500-1000 字符的片段 (Chunks)。

```typescript
// src/lib/ai.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getEmbeddings(text: string) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text.replace(/\n/g, ' '),
  });
  return response.data[0].embedding; // 返回 1536 维向量
}
```

### 2.2 MongoDB 向量索引

在 MongoDB Atlas 中，我们需要创建一个 `vectorSearch` 类型的索引，告诉它哪个字段存的是向量，以及维度是多少。

```json
{
  "fields": [
    {
      "numDimensions": 1536,
      "path": "embedding",
      "similarity": "cosine",
      "type": "vector"
    }
  ]
}
```

### 2.3 搜索 API

当用户输入查询词时，后端会执行以下步骤：
1.  调用 OpenAI 将查询词也转为向量。
2.  使用 MongoDB 的 `$vectorSearch` 聚合管道，寻找最相似的文章片段。

```typescript
// src/app/api/search/route.ts
const results = await PostChunk.aggregate([
  {
    $vectorSearch: {
      index: 'vector_index',
      path: 'embedding',
      queryVector: queryEmbedding,
      limit: 5
    }
  },
  {
    $project: { title: 1, content: 1, score: { $meta: 'vectorSearchScore' } }
  }
]);
```

## 3. 前端交互

我们使用了 `cmdk` 库来实现无障碍友好的 Command Menu。支持 `Cmd+K` 快捷键呼出，配合防抖 (Debounce) 减少 API 调用频率。

```tsx
// src/components/ai-search.tsx
export function AISearch() {
  // ...状态管理与防抖逻辑
  
  return (
    <Command.Dialog open={open} onOpenChange={setOpen}>
      <Command.Input placeholder="问点什么..." />
      <Command.List>
        {results.map(item => (
          <Command.Item onSelect={() => router.push(item.slug)}>
            {item.title}
          </Command.Item>
        ))}
      </Command.List>
    </Command.Dialog>
  )
}
```

## 4. 遇到的坑与解决方案

1.  **本地代理问题**：在国内开发环境下，Node.js 进程连接 OpenAI 容易超时。我们通过 `https-proxy-agent` 库显式配置了本地代理。
2.  **混合数据源**：本地 Markdown 文章没有数据库 ID。我们在同步脚本中采用了 `upsert` 策略，为本地文章自动创建了数据库占位记录，保证了数据一致性。

## 5. 总结

通过这次改造，博客不再是一个静态的展示柜，而变成了一个可以“对话”的知识库。这正是 AI 时代个人博客该有的样子。
