const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Đảm bảo các thư mục lưu trữ dữ liệu tồn tại
const dirs = [
  path.join(__dirname, 'docs', 'product'),
  path.join(__dirname, 'docs', 'sprint'),
  path.join(__dirname, 'docs', 'quality')
];
dirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Đường dẫn file dữ liệu
const SPRINT_PLAN_PATH = path.join(__dirname, 'docs', 'sprint', 'sprint-plan.md');
const TEST_REPORT_PATH = path.join(__dirname, 'docs', 'quality', 'test-report.json');

// API 1: Lấy danh sách User Stories hiện tại từ file kế hoạch (nếu có)
app.get('/api/sprint-plan', (req, res) => {
  if (fs.existsSync(SPRINT_PLAN_PATH)) {
    const content = fs.readFileSync(SPRINT_PLAN_PATH, 'utf8');
    res.json({ success: true, markdown: content });
  } else {
    res.json({ success: true, markdown: '# Chưa có kế hoạch Sprint được lập.' });
  }
});

// API 2: Thực hiện lập kế hoạch Sprint tự động ($bmad-sprint-planning)
app.post('/api/sprint-plan', (req, res) => {
  try {
    const { stories, velocity } = req.body;

    if (!stories || !Array.isArray(stories) || stories.length === 0) {
      return res.status(400).json({ success: false, error: 'Danh sách User Stories không hợp lệ.' });
    }

    const maxVelocity = parseInt(velocity, 10);
    if (isNaN(maxVelocity) || maxVelocity <= 0) {
      return res.status(400).json({ success: false, error: 'Năng suất Sprint (Velocity) phải là số dương.' });
    }

    // Kiểm tra AC-01: Không có task nào lớn hơn Velocity
    const oversizedTask = stories.find(s => parseInt(s.points, 10) > maxVelocity);
    if (oversizedTask) {
      return res.status(400).json({ 
        success: false, 
        error: `Task "${oversizedTask.title}" có Story Points (${oversizedTask.points}) lớn hơn năng suất tối đa của Sprint (${maxVelocity}).` 
      });
    }

    // Thuật toán phân bổ Sprint (Bin Packing Greedy)
    let sprints = [];
    let currentSprint = { id: 1, stories: [], totalPoints: 0 };

    stories.forEach((story) => {
      const points = parseInt(story.points, 10);
      if (currentSprint.totalPoints + points <= maxVelocity) {
        currentSprint.stories.push(story);
        currentSprint.totalPoints += points;
      } else {
        sprints.push(currentSprint);
        currentSprint = { id: sprints.length + 1, stories: [story], totalPoints: points };
      }
    });
    if (currentSprint.stories.length > 0) {
      sprints.push(currentSprint);
    }

    // Tạo nội dung Markdown lưu trữ
    let markdownContent = `# 📅 Kế Hoạch Phân Bổ Sprint\n\n`;
    markdownContent += `*Ngày lập: ${new Date().toLocaleString()}*\n`;
    markdownContent += `*Năng suất tối đa mỗi Sprint (Velocity Limit): ${maxVelocity} SP*\n\n`;

    sprints.forEach(s => {
      markdownContent += `## 🏃 Sprint ${s.id} (Tổng số điểm: ${s.totalPoints} SP)\n`;
      s.stories.forEach(story => {
        markdownContent += `- **[${story.points} SP]** ${story.title}: ${story.description}\n`;
      });
      markdownContent += `\n`;
    });

    fs.writeFileSync(SPRINT_PLAN_PATH, markdownContent, 'utf8');

    res.json({ success: true, sprints, markdown: markdownContent });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// API 3: Thực hiện rà soát mã nguồn tự động ($bmad-code-review)
app.post('/api/code-review', (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, error: 'Nội dung mã nguồn không được để trống.' });
    }

    const findings = [];
    
    // Kiểm tra các lỗi nghiêm trọng (BLOCKER)
    if (code.includes('eval(')) {
      findings.push({
        severity: 'BLOCKER',
        message: 'Phát hiện hàm nguy hiểm eval(). Có nguy cơ bị tấn công thực thi mã từ xa (RCE).'
      });
    }
    if (code.includes('password') || code.includes('secret_key') || code.includes('apiKey')) {
      findings.push({
        severity: 'BLOCKER',
        message: 'Phát hiện thông tin nhạy cảm (Secret/Password/API Key) được viết trực tiếp trong mã nguồn.'
      });
    }

    // Kiểm tra các cảnh báo (WARNING)
    if (code.includes('var ')) {
      findings.push({
        severity: 'WARNING',
        message: 'Sử dụng "var" để khai báo biến. Khuyến nghị thay thế bằng "let" hoặc "const" để tránh lỗi scope.'
      });
    }
    if (code.includes('console.log')) {
      findings.push({
        severity: 'WARNING',
        message: 'Còn tồn tại lệnh console.log trong mã nguồn production.'
      });
    }

    // Ghi nhận kết quả kiểm tra
    const reviewPassed = !findings.some(f => f.severity === 'BLOCKER');
    const report = {
      timestamp: new Date().toISOString(),
      passed: reviewPassed,
      findings: findings.length > 0 ? findings : [{ severity: 'INFO', message: 'Mã nguồn sạch, đạt chuẩn chất lượng!' }]
    };

    fs.writeFileSync(TEST_REPORT_PATH, JSON.stringify(report, null, 2), 'utf8');

    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Khởi chạy server nếu file được chạy trực tiếp
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(`🚀 BMad Sprint Planner Server is running on port ${PORT}`);
    console.log(`👉 Access: http://localhost:${PORT}`);
    console.log(`==================================================`);
  });
}

module.exports = app;
```

---