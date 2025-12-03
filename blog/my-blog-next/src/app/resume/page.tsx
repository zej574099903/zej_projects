import Image from 'next/image';
import styles from './resume.module.css';

export const metadata = {
  title: '个人简历 | My Blog',
  description: '前端开发工程师个人简历',
};

export default function ResumePage() {
  return (
    <div className={styles.container}>
      {/* 头部信息 */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">Liora</h1>
          <p className="text-xl text-gray-600 mb-4">高级前端开发工程师</p>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              📧 574099903@qq.com
            </span>
            <span className="flex items-center gap-1">
              📍 中国 · 杭州
            </span>
            <span className="flex items-center gap-1">
              🔗 github.com/zej
            </span>
          </div>
        </div>
        
        {/* 头像 */}
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-100 shadow-sm">
          <Image
            src="/avatar.jpg"
            alt="Liora Avatar"
            fill
            className="object-cover"
            sizes="96px"
            priority
          />
        </div>
      </header>

      <div className="grid md:grid-cols-[300px_1fr] gap-12">
        {/* 左侧边栏 */}
        <aside className="space-y-8">
          <section>
            <h2 className={styles.sectionTitle}>技能清单</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">前端核心</h3>
                <div className="flex flex-wrap gap-2">
                  {['React', 'Next.js', 'TypeScript', 'Vue3', 'TailwindCSS'].map(skill => (
                    <span key={skill} className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-2">工程化</h3>
                <div className="flex flex-wrap gap-2">
                  {['Webpack', 'Vite', 'Docker', 'CI/CD'].map(skill => (
                    <span key={skill} className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className={styles.sectionTitle}>教育经历</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-bold">某某大学</h3>
                <p className="text-gray-600 text-sm">计算机科学与技术 / 本科</p>
                <p className="text-gray-500 text-sm">2016 - 2020</p>
              </div>
            </div>
          </section>
        </aside>

        {/* 右侧主要内容 */}
        <main className="space-y-10">
          <section>
            <h2 className={styles.sectionTitle}>个人简介</h2>
            <p className="text-gray-600 leading-relaxed">
              5年前端开发经验，热衷于探索前沿技术。擅长 React 生态系统和前端性能优化。
              具备良好的工程化思维，主导过多个大型 Web 应用的架构设计与重构。
              追求极致的用户体验和代码质量。
            </p>
          </section>

          <section>
            <h2 className={styles.sectionTitle}>工作经历</h2>
            <div className="space-y-8">
              <div className={styles.timelineItem}>
                <div className={styles.timelineDot}></div>
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-xl font-bold">高级前端工程师</h3>
                  <span className="text-sm text-gray-500">2023.03 - 至今</span>
                </div>
                <h4 className="text-lg text-gray-700 mb-3">某某科技有限公司</h4>
                <ul className="list-disc list-outside ml-4 space-y-2 text-gray-600">
                  <li>负责公司核心 SaaS 产品的重构工作，使用 Next.js 提升首屏加载速度 40%。</li>
                  <li>设计并落地通用组件库，覆盖 30+ 业务组件，提升团队开发效率。</li>
                  <li>优化 CI/CD 流程，将构建部署时间从 15 分钟缩短至 5 分钟。</li>
                </ul>
              </div>

              <div className={styles.timelineItem}>
                <div className={styles.timelineDot}></div>
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-xl font-bold">前端工程师</h3>
                  <span className="text-sm text-gray-500">2020.07 - 2023.02</span>
                </div>
                <h4 className="text-lg text-gray-700 mb-3">某某创新网络公司</h4>
                <ul className="list-disc list-outside ml-4 space-y-2 text-gray-600">
                  <li>独立负责公司官网及管理后台的前端开发，使用 Vue3 + TypeScript 技术栈。</li>
                  <li>实现复杂的图表可视化需求，处理千万级数据渲染性能问题。</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className={styles.sectionTitle}>项目经历</h2>
            <div className="grid gap-4">
              <a href="/projects/ecommerce" className="block p-4 border rounded-lg hover:border-blue-500 transition-colors group">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg group-hover:text-blue-600">企业级电商管理后台</h3>
                  <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded">查看详情 →</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  基于 React + Ant Design 开发的大型中台系统，包含商品管理、订单处理、数据分析等模块。
                </p>
                <div className="flex gap-2">
                  <span className="text-xs text-gray-500">React</span>
                  <span className="text-xs text-gray-500">Redux</span>
                  <span className="text-xs text-gray-500">AntD</span>
                </div>
              </a>

              <a href="#" className="block p-4 border rounded-lg hover:border-blue-500 transition-colors group">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg group-hover:text-blue-600">个人博客系统</h3>
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">开发中</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  基于 Next.js App Router 开发的静态博客，支持 Markdown 渲染、暗色模式和 SEO 优化。
                </p>
                <div className="flex gap-2">
                  <span className="text-xs text-gray-500">Next.js</span>
                  <span className="text-xs text-gray-500">Tailwind</span>
                  <span className="text-xs text-gray-500">Vercel</span>
                </div>
              </a>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
