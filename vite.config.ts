import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// GitHub Pages 배포용 설정
// - 리포지토리명이 hangul-first일 때 base는 반드시 "/hangul-first/"
// - 정적 배포 환경이므로 절대 경로(/assets, /img 등) 대신 상대 import/경로만 사용하세요
//   예) import img from "./assets/logo.svg"  (O)
//      import img from "/assets/logo.svg"   (X)
// - PWA/서비스워커는 사용하지 않습니다
export default defineConfig({
	base: "/hangul-first/",
	plugins: [react()],
});


