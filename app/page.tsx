import Link from "next/link";

export default function Home() {
  const features = [
    {
      title: "图片压缩",
      description: "快速压缩图片大小，保持高质量，支持多种格式",
      icon: "📦",
      href: "/compress",
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "抠图去背景",
      description: "智能AI抠图，一键去除背景，支持人像和物体",
      icon: "✂️",
      href: "/remove-bg",
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "图片识别",
      description: "AI识别图片内容，提供详细的图片分析结果",
      icon: "🔍",
      href: "/recognition",
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "AI 生图",
      description: "输入描述文字，AI智能生成高质量图片",
      icon: "🎨",
      href: "/ai-generate",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="pt-16 pb-8 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            图片处理工具
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            专业的图片综合处理平台，为您提供一站式图片处理解决方案
          </p>
        </div>
      </header>

      {/* Feature Cards */}
      <main className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <Link
              key={feature.href}
              href={feature.href}
              className="group relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              {/* Gradient Background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              />

              {/* Card Content */}
              <div className="relative p-8">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="text-5xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>

                  {/* Text Content */}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                      {feature.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300">
                      {feature.description}
                    </p>
                  </div>

                  {/* Arrow Icon */}
                  <div className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Bottom Border Animation */}
              <div
                className={`h-1 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}
              />
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p className="text-sm">
          © 2025 图片处理工具. 提供专业的图片处理服务
        </p>
      </footer>
    </div>
  );
}
