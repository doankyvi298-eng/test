<<<<<<< HEAD
﻿# 汉字拼音配对（Pairs）

拼音和汉字混乱排序，当“汉字”和其对应“拼音（数字声调）”配对时消除。适合拼音-字形-声调的结合练习。

## 玩法
- 每个汉字对应一个拼音（如 妈 ↔ ma1）。
- 点击两张牌尝试配对：若一张是汉字、另一张是对应拼音，则配对成功并消除；否则短暂提示后取消选择。
- 统计用时、步数、得分；支持“提示”和“洗牌”。

## 运行
1. `cd hanzi-pinyin-match`
2. `npm start`
3. 浏览器打开：`http://localhost:5175`

## 可配置
- 棋盘：4×4（8 对）/ 6×4（12 对）/ 6×6（18 对）。
- 数据集位于 `src/lib/data.js`，可添加/替换词条（id 即拼音+数字声调）。

## 后续可拓展
- 关卡目标：限定时间/步数、要求配对指定若干音节。
- 难度曲线：从常见音节开始，逐步引入近音干扰（如 li2 vs li3）。
- 语音：点击播放对应拼音/汉字读音（需音频文件）。
- 动画与反馈：配对飞线、连击加分、错误扣分或冷却。

MIT
=======
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
>>>>>>> bd2af9470aaed9a89cb1c1f92da672640c2162dc
