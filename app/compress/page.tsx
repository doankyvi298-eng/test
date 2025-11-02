"use client";

import Link from "next/link";
import { useState, useRef } from "react";

export default function CompressPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [compressedUrl, setCompressedUrl] = useState<string>("");
  const [quality, setQuality] = useState<number>(80);
  const [isCompressing, setIsCompressing] = useState(false);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setOriginalSize(file.size);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setCompressedUrl("");
      setCompressedSize(0);
    }
  };

  const handleCompress = async () => {
    if (!selectedFile) return;

    setIsCompressing(true);
    try {
      // 创建 canvas 进行压缩
      const img = new Image();
      img.src = previewUrl;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);

          canvas.toBlob(
            (blob) => {
              if (blob) {
                const url = URL.createObjectURL(blob);
                setCompressedUrl(url);
                setCompressedSize(blob.size);
              }
              setIsCompressing(false);
            },
            "image/jpeg",
            quality / 100
          );
        }
      };
    } catch (error) {
      console.error("压缩失败:", error);
      setIsCompressing(false);
    }
  };

  const handleDownload = () => {
    if (!compressedUrl) return;

    const a = document.createElement("a");
    a.href = compressedUrl;
    a.download = `compressed_${selectedFile?.name || "image.jpg"}`;
    a.click();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const compressionRate = originalSize && compressedSize
    ? Math.round(((originalSize - compressedSize) / originalSize) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link
            href="/"
            className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors"
          >
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            📦 图片压缩
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Upload Area */}
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
              className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <div className="text-6xl mb-4">📁</div>
              <p className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
                点击上传图片
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                支持 JPG、PNG、WebP 等格式
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Quality Slider */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  压缩质量: {quality}%
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>最小</span>
                  <span>最高质量</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleCompress}
                  disabled={isCompressing}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                >
                  {isCompressing ? "压缩中..." : "开始压缩"}
                </button>
                <button
                  onClick={() => {
                    setSelectedFile(null);
                    setPreviewUrl("");
                    setCompressedUrl("");
                    setOriginalSize(0);
                    setCompressedSize(0);
                  }}
                  className="px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  重新选择
                </button>
              </div>
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
              <img
                src={previewUrl}
                alt="Original"
                className="w-full rounded-lg mb-4"
              />
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <p>文件大小: {formatFileSize(originalSize)}</p>
                <p>文件名: {selectedFile.name}</p>
              </div>
            </div>

            {/* Compressed Image */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                压缩后
              </h3>
              {compressedUrl ? (
                <>
                  <img
                    src={compressedUrl}
                    alt="Compressed"
                    className="w-full rounded-lg mb-4"
                  />
                  <div className="space-y-2 mb-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <p>文件大小: {formatFileSize(compressedSize)}</p>
                      <p className="text-green-600 dark:text-green-400 font-semibold">
                        压缩率: {compressionRate}%
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleDownload}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                  >
                    下载压缩后的图片
                  </button>
                </>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-400 dark:text-gray-500">
                  <div className="text-center">
                    <div className="text-4xl mb-2">⏳</div>
                    <p>请先压缩图片</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
