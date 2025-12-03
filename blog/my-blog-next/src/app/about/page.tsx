import styles from './about.module.css';

export default function AboutPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>关于我</h1>
      <p>这是一个使用独立样式文件的示例页面。</p>
      <p className="mt-4 text-gray-500">
        你也可以混合使用 Tailwind 类名 (比如这个段落)。
      </p>
    </div>
  );
}
