import { NextRequest, NextResponse } from "next/server";

const ARK_API_KEY = "a1b724fc-13c4-4332-be89-eb645d661910";
const ARK_API_URL = "https://ark.cn-beijing.volces.com/api/v3/images/generations";
const MODEL_ID = "ep-20251011095405-sqtwc";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, size = "2K" } = body;

    if (!prompt || !prompt.trim()) {
      return NextResponse.json(
        { error: "请提供提示词" },
        { status: 400 }
      );
    }

    console.log("Generating image with prompt:", prompt);

    // 调用火山引擎 AI 生图 API
    const response = await fetch(ARK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${ARK_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL_ID,
        prompt: prompt,
        sequential_image_generation: "disabled",
        response_format: "url",
        size: size,
        stream: false,
        watermark: true,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("火山引擎 AI 生图 API error:", errorText);
      console.error("Status:", response.status);

      let errorMessage = "图片生成失败";
      if (response.status === 403) {
        errorMessage = "API访问被拒绝，请检查API Key和模型权限";
      } else if (response.status === 401) {
        errorMessage = "API认证失败，请检查API Key是否正确";
      }

      return NextResponse.json(
        { error: errorMessage, details: errorText },
        { status: response.status }
      );
    }

    const result = await response.json();
    console.log("AI generation result:", result);

    // 提取生成的图片 URL
    const imageUrl = result.data?.[0]?.url;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "未能获取生成的图片", details: result },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      imageUrl: imageUrl,
      raw: result,
    });
  } catch (error) {
    console.error("Error processing AI image generation:", error);
    return NextResponse.json(
      {
        error: "处理请求时发生错误",
        details: error instanceof Error ? error.message : "未知错误"
      },
      { status: 500 }
    );
  }
}
