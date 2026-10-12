# 🚀 Ứng Dụng Quản Lý Công Việc & Lập Kế Hoạch Sprint (BMad & TEA Compliant)

Ứng dụng này được xây dựng tuân thủ nghiêm ngặt theo quy trình **Enterprise Agentic SDLC Instructions** [ID:475], tích hợp các kỹ năng lập kế hoạch Sprint (`$bmad-sprint-planning`) [ID:132] và rà soát chất lượng mã nguồn (`$bmad-code-review`) [ID:102].

## 📝 Kịch Bản Nghiệp Vụ (Business Scenario)
Hệ thống cho phép Quản lý dự án (PM) và Đội ngũ phát triển:
1. **Quản lý User Stories**: Thêm, sửa, xóa và ước lượng Story Points [ID:132].
2. **Lập Kế Hoạch Sprint**: Tự động phân bổ các User Stories vào các Sprint dựa trên Velocity (Năng suất tối đa của Sprint) [ID:132].
3. **Rà Soát Mã Nguồn Tự Động (Mock Code Review)**: Chạy bộ kiểm tra chất lượng mã nguồn để phát hiện lỗi bảo mật, logic và code smell trước khi bàn giao [ID:102].
4. **Báo Cáo Chất Lượng & Traceability**: Xuất báo cáo kiểm thử và truy vết yêu cầu (Traceability Matrix) đáp ứng tiêu chuẩn Quality Gates [ID:475].

---

## 🛠️ Hướng Dẫn Cài Đặt & Khởi Chạy

### 1. Cài đặt các thư viện phụ thuộc (Dependencies)
Cài đặt Node.js (phiên bản 16 trở lên), sau đó chạy lệnh sau tại thư mục gốc của dự án:
```bash
npm install
```

### 2. Khởi chạy ứng dụng (Start Server)
Khởi chạy máy chủ Node.js Express:
```bash
npm start
```
Sau khi khởi chạy thành công, truy cập ứng dụng tại địa chỉ: [http://localhost:3000](http://localhost:3000)

### 3. Chạy kiểm thử tự động (Run Tests)
Chạy bộ kiểm thử tích hợp và unit test để xác minh chất lượng phần mềm:
```bash
npm test
```

---

## 🗂️ Cấu Trúc Thư Mục Dự Án (Project Structure)
Tuân thủ cấu trúc thư mục chuẩn hóa của hệ sinh thái Vibecode Starter-Kit [ID:450][ID:475]:

```text
├── README.md                     # Hướng dẫn và tài liệu dự án [ID:475]
├── package.json                  # Cấu hình dự án và dependencies
├── server.js                     # Máy chủ backend Node.js Express
├── AGENTS.md                     # Chỉ dẫn chung cho Agent & Quality Gates [ID:475]
├── docs/
│   ├── product/
│   │   └── prd.md                # Tài liệu đặc tả yêu cầu sản phẩm (PRD) [ID:475]
│   ├── sprint/
│   │   └── sprint-plan.md        # Kế hoạch phân bổ Sprint [ID:132]
│   └── quality/
│       └── test-report.json      # Báo cáo kết quả kiểm thử [ID:475]
├── public/                       # Giao diện người dùng (Frontend)
│   ├── index.html                # Giao diện chính của ứng dụng
│   ├── style.css                 # Định dạng giao diện hiện đại
│   └── app.js                    # Logic xử lý phía Client
└── tests/
    └── app.test.js               # Bộ kiểm thử tự động (Integration & Unit Tests)
```
```

---