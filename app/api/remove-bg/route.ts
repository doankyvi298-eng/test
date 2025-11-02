import { NextRequest, NextResponse } from "next/server";

const REMOVE_BG_API_KEY = "9tNs3Q8KY8BRbpKUgCe3cFo3";

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

    // 创建新的 FormData 用于发送到 remove.bg
    const removeBgFormData = new FormData();
    removeBgFormData.append("image_file", imageFile);
    removeBgFormData.append("size", "auto");

    // 调用 remove.bg API
    const response = await fetch("https://api.remove.bg/v1.0/removebg", {
      method: "POST",
      headers: {
        "X-Api-Key": REMOVE_BG_API_KEY,
      },
      body: removeBgFormData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Remove.bg API error:", errorText);
      return NextResponse.json(
        { error: "背景移除失败", details: errorText },
        { status: response.status }
      );
    }

    // 获取处理后的图片数据
    const imageBuffer = await response.arrayBuffer();

    // 返回图片数据
    return new NextResponse(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
      },
    });
  } catch (error) {
    console.error("Error processing remove background:", error);
    return NextResponse.json(
      { error: "处理请求时发生错误" },
      { status: 500 }
    );
  }
}
