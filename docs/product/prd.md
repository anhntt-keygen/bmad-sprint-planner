# 📝 Đặc Tả Yêu Cầu Sản Phẩm (PRD) - Sprint Planner

## 1. Mục Tiêu Hệ Thống
Hệ thống giúp tự động hóa quy trình lập kế hoạch Sprint dựa trên năng suất (Velocity) và thực hiện rà soát chất lượng mã nguồn tự động để đảm bảo an sau khi triển khai [ID:132][ID:475].

## 2. Luồng Nghiệp Vụ Chính
1. **Nhập danh sách User Stories**: Người dùng nhập tiêu đề, mô tả và Story Points [ID:132].
2. **Phân bổ Sprint tự động**: Thuật toán phân bổ tối ưu hóa số lượng công việc vào các Sprint sao cho không vượt quá giới hạn Velocity [ID:132].
3. **Kiểm tra chất lượng (Code Review)**: Chạy phân tích tĩnh giả lập để phát hiện các lỗi bảo mật và cấu trúc code [ID:102].

## 3. Tiêu Chí Nghiệm Thu (Acceptance Criteria)
- **AC-01**: Hệ thống phải từ chối phân bổ nếu Velocity cấu hình nhỏ hơn Story Point của bất kỳ task đơn lẻ nào.
- **AC-02**: Trình rà soát mã nguồn phải phát hiện và chặn (`BLOCKER`) các đoạn mã chứa từ khóa nhạy cảm như `password`, `secret_key`, hoặc `eval()` [ID:102].
```

---