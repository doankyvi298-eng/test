"use client";

import Link from "next/link";
import { useState, useRef } from "react";

interface RecognitionResult {
  description: string;
  raw?: any;
}

export default function RecognitionPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<RecognitionResult | null>(null);
  const [error, setError] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setResult(null);
      setError("");
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image_file", selectedFile);

      const response = await fetch("/api/recognition", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "识别失败");
      }

      const data = await response.json();
      setResult({
        description: data.description,
        raw: data.raw,
      });
    } catch (err) {
      console.error("Error analyzing image:", err);
      setError(err instanceof Error ? err.message : "识别失败，请重试");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="text-gray-600 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            🔍 图片识别
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
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center cursor-pointer hover:border-green-500 dark:hover:border-green-400 transition-colors"
            >
              <div className="text-6xl mb-4">📁</div>
              <p className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                点击上传图片
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                支持JPG、PNG等格式，AI将为您分析图片内容
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
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      分析中...
                    </>
                  ) : (
                    "🔍 开始识别"
                  )}
                </button>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl("");
                    setResult(null);
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
            {/* Image Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                图片预览
              </h3>
              <div className="relative bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                <img src={previewUrl} alt="Preview" className="w-full h-auto" />
              </div>
            </div>

            {/* Recognition Results */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                识别结果
              </h3>
              {result ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      AI 分析
                    </h4>
                    <div className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap leading-relaxed">
                      {result.description}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-100 dark:bg-gray-700 rounded-lg text-gray-400">
                  <div className="text-center">
                    <div className="text-4xl mb-2">⏳</div>
                    <p>等待识别</p>
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
            <li>• 支持 JPG、PNG、WebP 等格式的图片</li>
            <li>• AI 将自动识别图片中的元素、主题、场景和风格</li>
            <li>• 建议上传清晰、内容丰富的图片以获得更准确的分析</li>
            <li>• 识别结果由火山引擎 AI 提供</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
