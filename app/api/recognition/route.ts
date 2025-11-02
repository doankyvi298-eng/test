import { NextRequest, NextResponse } from "next/server";

const ARK_API_KEY = "a1b724fc-13c4-4332-be89-eb645d661910";
const ARK_API_URL = "https://ark.cn-beijing.volces.com/api/v3/chat/completions";
const MODEL_ID = "ep-20251011090358-srgl7";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get("image_file") as File;

    if (!imageFile) {
      return NextResponse.json(
        { error: "没有提供图片文件" },
        { status: 400 }
      );
    }

    // 将图片转换为 Base64
    const arrayBuffer = await imageFile.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    // 确定图片格式
    const imageType = imageFile.type.split("/")[1]; // image/png -> png
    const dataUrl = `data:image/${imageType};base64,${base64Image}`;

    // 调用火山引擎 API
    const response = await fetch(ARK_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ARK_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL_ID,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "请详细分析这张图片，包括：1. 图片主要包含哪些元素 2. 图片的主题和场景 3. 图片的主要颜色 4. 图片的风格特点。请用中文详细回答。"
              },
              {
                type: "image_url",
                image_url: {
                  url: dataUrl
                }
              }
            ]
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("火山引擎 API error:", errorText);
      console.error("Status:", response.status);
      console.error("API Key:", ARK_API_KEY.substring(0, 10) + "...");
      console.error("Model ID:", MODEL_ID);

      let errorMessage = "图片识别失败";
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

    // 提取识别结果
    const content = result.choices?.[0]?.message?.content || "未能识别图片内容";

    // 解析返回结果，提取关键信息
    return NextResponse.json({
      success: true,
      description: content,
      raw: result,
    });
  } catch (error) {
    console.error("Error processing image recognition:", error);
    return NextResponse.json(
      { error: "处理请求时发生错误", details: error instanceof Error ? error.message : "未知错误" },
      { status: 500 }
    );
  }
}
