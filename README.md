# Tra Cứu Doanh Nghiệp Việt Nam 🏢

Trang web tra cứu thông tin doanh nghiệp, mã số thuế (MST), người đại diện pháp luật, địa chỉ và ngành nghề kinh doanh được kết nối trực tiếp với cơ sở dữ liệu PostgreSQL (~90.000 doanh nghiệp).

---

## 🌟 Các Tính Năng Nổi Bật

1. **Bộ lọc & Tìm kiếm đa tiêu chí đầy đủ:**
   - **Tìm kiếm từ khóa**: Tìm nhanh theo Tên doanh nghiệp, Mã số thuế (MST), Tên người đại diện, Số điện thoại hoặc Địa chỉ.
   - **Lọc theo Tỉnh / Thành phố**: Lựa chọn 63 tỉnh/thành phố kèm số lượng doanh nghiệp tương ứng.
   - **Lọc theo Trạng thái hoạt động**: *Đang hoạt động*, *Ngừng hoạt động*, *Tạm ngừng kinh doanh*... với nhãn màu trực quan (xanh lá, đỏ, cam).
   - **Lọc theo Loại hình doanh nghiệp**: Cty TNHH 1TV, Cty TNHH 2TV trở lên, Cty Cổ phần, Doanh nghiệp tư nhân, Hợp tác xã...
   - **Lọc theo Năm thành lập / Ngày hoạt động**: Lọc theo từng năm hoặc khoảng thời gian.
   - **Lọc chỉ doanh nghiệp có Số điện thoại**: Tiện lợi cho liên hệ, đối tác, sales.
   - **Xóa nhanh bộ lọc** (Reset all filters) chỉ với 1 click.

2. **Chế độ hiển thị linh hoạt:**
   - **Dạng Bảng (Table View)**: Đầy đủ cột dữ liệu, có nút copy nhanh MST, click số điện thoại để gọi.
   - **Dạng Thẻ (Cards View)**: Thiết kế dạng lưới đẹp mắt, tối ưu cho màn hình di động / tablet.

3. **Xem Chi Tiết Doanh Nghiệp:**
   - **Popup Modal**: Xem nhanh đầy đủ thông tin mà không mất trang/vị trí cuộn.
   - **Trang Chi Tiết Riêng (`/companies/[id]`)**: Hỗ trợ copy link chia sẻ, xem bản đồ Google Maps, cơ quan thuế quản lý.
   - **Bảng Danh Mục Ngành Nghề Kinh Doanh (`industry_codes`)**: Tra cứu toàn bộ các mã ngành nghề kinh doanh đã đăng ký, đánh dấu nổi bật ngành nghề chính.
   - **Gợi ý Doanh nghiệp liên quan**: Danh sách các doanh nghiệp cùng khu vực hoặc ngành nghề.

4. **Thống Kê Tổng Quan (Dashboard Cards):**
   - Tổng số doanh nghiệp trong hệ thống (~90.000 DN).
   - Tỷ lệ & số lượng doanh nghiệp đang hoạt động.
   - Số doanh nghiệp ngừng hoạt động / chấm dứt hiệu lực MST.
   - Số lượng doanh nghiệp có thông tin số điện thoại liên lạc.

5. **Xuất Dữ Liệu Ra Excel / CSV:**
   - Xuất dữ liệu theo đúng kết quả bộ lọc hiện tại.
   - Định dạng UTF-8 BOM chuẩn để mở trong Microsoft Excel hiển thị đầy đủ tiếng Việt không bị lỗi font chữ.

6. **Phân Trang Hiệu Suất Cao:**
   - Hỗ trợ chọn số lượng kết quả trên mỗi trang: 10, 20, 50, 100 dòng.
   - Nút chuyển trang đầu, trang cuối, trang kế tiếp mượt mà.

---

## 🚀 Cấu Hình & Khởi Chạy

Dự án đã được cấu hình sẵn biến môi trường kết nối database trong file `.env` và `.env.local`:

```env
DB_NAME=companies
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
DB_HOST=138.2.86.218
DB_PORT=5432
```

### Chạy ở môi trường Development:
```bash
npm run dev
```
Truy cập tại: `http://localhost:3000`

### Chạy ở môi trường Production (nhanh & tối ưu nhất):
```bash
npm run build
npm run start
```
Truy cập tại: `http://localhost:3000`
