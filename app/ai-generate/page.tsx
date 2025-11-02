"use client";

import Link from "next/link";
import { useState } from "react";

export default function AIGeneratePage() {
  const [prompt, setPrompt] = useState("");
  const [imageSize, setImageSize] = useState("2K");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("请输入提示词");
      return;
    }

    setIsGenerating(true);
    setError("");
    setGeneratedImageUrl("");

    try {
      const response = await fetch("/api/ai-generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt,
          size: imageSize,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "生成失败");
      }

      const data = await response.json();
      setGeneratedImageUrl(data.imageUrl);
    } catch (err) {
      console.error("Error generating image:", err);
      setError(err instanceof Error ? err.message : "生成失败，请重试");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    if (!generatedImageUrl) return;

    try {
      const response = await fetch(generatedImageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ai-generated-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      setError("下载失败，请重试");
    }
  };

  const presetPrompts = [
    "星际穿越，黑洞，黑洞里冲出一辆快支离破碎的复古列车，强视觉冲击力，电影大片，末日既视感",
    "一只可爱的猫咪坐在窗台上看风景，油画风格，温暖的阳光",
    "未来科技城市，赛博朋克风格，霓虹灯光，高楼大厦",
    "宁静的日式庭院，樱花飘落，水墨画风格，禅意",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="text-gray-600 hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            🎨 AI 生图
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Input Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-6">
          <div className="space-y-6">
            {/* Prompt Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                描述你想生成的图片 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="例如：一只可爱的柴犬在海边奔跑，蓝天白云，阳光明媚，高清摄影..."
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white resize-none"
                rows={4}
              />
            </div>

            {/* Preset Prompts */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                快速选择
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {presetPrompts.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(preset)}
                    className="text-left px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-orange-100 dark:hover:bg-orange-900/30 rounded-lg text-sm text-gray-700 dark:text-gray-300 transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Image Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                图片尺寸
              </label>
              <select
                value={imageSize}
                onChange={(e) => setImageSize(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="1K">1K (1024×1024)</option>
                <option value="2K">2K (2048×2048)</option>
                <option value="4K">4K (4096×4096)</option>
              </select>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 disabled:from-gray-400 disabled:to-gray-400 text-white font-medium py-4 px-6 rounded-lg transition-all transform hover:scale-[1.02] disabled:scale-100 flex items-center justify-center gap-2"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  生成中...
                </>
              ) : (
                "🎨 生成图片"
              )}
            </button>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-sm text-red-800 dark:text-red-200">
                  ❌ {error}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Generated Image */}
        {generatedImageUrl && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">
              生成结果
            </h3>
            <div className="space-y-4">
              <img
                src={generatedImageUrl}
                alt="Generated"
                className="w-full rounded-lg shadow-md"
              />
              <button
                onClick={handleDownload}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                💾 下载图片
              </button>
            </div>

            <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <strong>使用的提示词：</strong> {prompt}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                <strong>图片尺寸：</strong> {imageSize}
              </p>
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
            💡 使用提示
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• 详细描述您想要的图片内容、风格和氛围</li>
            <li>• 可以指定艺术风格，如油画、水墨画、赛博朋克等</li>
            <li>• 生成时间约需要 10-30 秒，请耐心等待</li>
            <li>• 生成的图片由火山引擎 AI 提供</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
