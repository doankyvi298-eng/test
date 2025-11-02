"use client";

import Link from "next/link";
import { useState, useRef } from "react";

export default function RemoveBgPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [resultUrl, setResultUrl] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setResultUrl("");
      setError("");
    }
  };

  const handleRemoveBg = async () => {
    if (!selectedFile) return;

    setIsProcessing(true);
    setError("");

    try {
      // 创建 FormData
      const formData = new FormData();
      formData.append("image_file", selectedFile);

      // 调用我们的 API 路由
      const response = await fetch("/api/remove-bg", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "处理失败");
      }

      // 获取返回的图片 blob
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setResultUrl(url);
    } catch (err) {
      console.error("Error removing background:", err);
      setError(err instanceof Error ? err.message : "处理失败，请重试");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = `no-bg_${selectedFile?.name.replace(/\.[^/.]+$/, ".png") || "image.png"}`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            ✂️ 抠图去背景
          </h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Upload Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {!selectedFile ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center cursor-pointer hover:border-purple-500 dark:hover:border-purple-400 transition-colors"
            >
              <div className="text-6xl mb-4">📁</div>
              <p className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                点击上传图片
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                支持人像、物体等各类图片（JPG、PNG）
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* File Info */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>文件名：</strong> {selectedFile.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>文件大小：</strong> {(selectedFile.size / 1024).toFixed(2)} KB
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleRemoveBg}
                  disabled={isProcessing}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      处理中...
                    </>
                  ) : (
                    "✂️ 开始抠图"
                  )}
                </button>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl("");
                    setResultUrl("");
                    setError("");
                  }}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  重新选择
                </button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-sm text-red-800 dark:text-red-200">
                    ❌ {error}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Preview and Results */}
        {selectedFile && (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Original Image */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                原始图片
              </h3>
              <div className="relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Original"
                  className="w-full h-auto"
                />
              </div>
            </div>

            {/* Result Image */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                抠图结果
              </h3>
              {resultUrl ? (
                <div className="space-y-4">
                  {/* Transparent Background Pattern */}
                  <div
                    className="relative rounded-lg overflow-hidden"
                    style={{
                      backgroundImage: `linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)`,
                      backgroundSize: "20px 20px",
                      backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px"
                    }}
                  >
                    <img
                      src={resultUrl}
                      alt="Result"
                      className="w-full h-auto"
                    />
                  </div>
                  <button
                    onClick={handleDownload}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    💾 下载结果
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-400">
                  <div className="text-center">
                    <div className="text-4xl mb-2">⏳</div>
                    <p>等待处理</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
            💡 使用提示
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• 支持 JPG、PNG 格式的图片</li>
            <li>• 建议上传清晰的人像或物体照片</li>
            <li>• AI 将自动识别并移除背景</li>
            <li>• 处理后的图片为 PNG 格式，支持透明背景</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
