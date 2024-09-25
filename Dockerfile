# مرحله نهایی
FROM mcr.microsoft.com/windows/nanoserver:ltsc2019

# تنظیم دایرکتوری کاری
WORKDIR C:/app

# کپی فایل‌های ساخته شده
COPY ./dist ./dist
COPY ./node_modules ./node_modules

# نمایش پورت اپلیکیشن
EXPOSE 5173

# اجرای برنامه با استفاده از Vite
CMD ["npm", "run", "preview", "--", "--host"]
