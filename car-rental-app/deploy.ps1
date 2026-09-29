<#
.SYNOPSIS
  สคริปต์ Deploy ระบบเช่ารถ (Car Rental App) ขึ้น Cloudflare Pages แบบอัตโนมัติ
.DESCRIPTION
  1. Build โปรเจกต์ (Vite + React)
  2. Deploy ขึ้น Cloudflare Pages ผ่าน Wrangler CLI
#>

param(
  [string]$ProjectName = "car-rental-app"
)

$ErrorActionPreference = "Stop"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "  🚗 DriveEase — Cloudflare Auto Deploy   " -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# 1. Check Node.js
Write-Host "`n[1/3] ตรวจสอบ Node.js..." -ForegroundColor Yellow
$nodeVersion = node -v
Write-Host "✓ Node.js version: $nodeVersion" -ForegroundColor Green

# 2. Build
Write-Host "`n[2/3] กำลัง Build โปรเจกต์ (Production)..." -ForegroundColor Yellow
npm.cmd run build

if (-not (Test-Path "dist")) {
  Write-Host "❌ ข้อผิดพลาด: ไม่พบโฟลเดอร์ dist กรุณาตรวจสอบ Build error" -ForegroundColor Red
  exit 1
}
Write-Host "✓ Build สำเร็จเรียบร้อย (dist/)" -ForegroundColor Green

# 3. Deploy via Wrangler
Write-Host "`n[3/3] กำลัง Deploy สู่ Cloudflare Pages..." -ForegroundColor Yellow
Write-Host "หากยังไม่ได้ Login ระบบจะเปิด Browser ให้ยืนยันตัวตนกับ Cloudflare เพียงครั้งเดียว`n" -ForegroundColor DarkGray

npx.cmd wrangler pages deploy dist --project-name=$ProjectName

Write-Host "`n🎉 สำเร็จ! ระบบถูกส่งขึ้น Cloudflare Pages เรียบร้อยแล้ว" -ForegroundColor Green
