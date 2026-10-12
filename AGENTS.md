# 🏛️ Agentic SDLC Governance & Quality Gates

Tài liệu này định nghĩa các cổng kiểm soát chất lượng (Quality Gates) bắt buộc đối với Agent và Nhà phát triển khi thực hiện thay đổi trên hệ thống [ID:475].

## 🚦 Quy Trình Kiểm Soát Cổng (Gate Control)

### Cổng G1: Xác Nhận Yêu Cầu (Requirements Approved)
- **Tiêu chí**: Toàn bộ User Stories phải có mô tả rõ ràng, Acceptance Criteria (AC) và ước lượng Story Points [ID:132][ID:475].
- **Trạng thái**: `APPROVED` trước khi đưa vào lập kế hoạch Sprint.

### Cổng G3: Kế Hoạch Triển Khai (Sprint Planning Gate)
- **Tiêu chí**: Tổng số Story Points trong một Sprint không được vượt quá năng suất (Velocity) của đội ngũ [ID:132].
- **Trạng thái**: `READY_FOR_BUILD`.

### Cổng G4: Rà Soát Chất Lượng & UAT (Code Review & Verification)
- **Tiêu chí**: 
  - Không còn lỗi nghiêm trọng mức `BLOCKER` từ công cụ `$bmad-code-review` [ID:102].
  - 100% các ca kiểm thử tự động (Unit/Integration Tests) phải vượt qua (`PASS`) [ID:475].
- **Trạng thái**: `VERIFIED`.
```

---