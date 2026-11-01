'use client';

import React from 'react';
import Link from 'next/link';
import { Building2, Search, Database, ShieldCheck, Sparkles } from 'lucide-react';

interface HeaderProps {
  totalCount?: number;
}

export function Header({ totalCount }: HeaderProps) {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm/50 backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-slate-900 tracking-tight">
                  TraCuu<span className="text-indigo-600">DoanhNghiep</span>
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                  VN
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Cổng thông tin & Tra cứu danh bạ doanh nghiệp Việt Nam
              </p>
            </div>
          </Link>

          {/* Quick stats badge & info */}
          <div className="flex items-center space-x-3">
            {totalCount !== undefined && (
              <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                <Database className="w-3.5 h-3.5 text-indigo-500" />
                <span>Tổng dữ liệu:</span>
                <span className="font-bold text-indigo-600">{totalCount.toLocaleString('vi-VN')}</span>
                <span>doanh nghiệp</span>
              </div>
            )}
            <div className="flex items-center space-x-1.5 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Dữ liệu thực</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
