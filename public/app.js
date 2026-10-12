// Quản lý danh sách User Stories tạm thời ở Client
let backlogStories = [
  { title: "Thiết lập cấu trúc thư mục dự án", points: 2, description: "Tạo khung thư mục chuẩn hóa theo Vibecode Starter-Kit." },
  { title: "Xây dựng API lập kế hoạch Sprint", points: 5, description: "Hiện thực hóa thuật toán phân bổ Sprint tự động." },
  { title: "Tích hợp bộ kiểm tra mã nguồn", points: 3, description: "Phát hiện các lỗi bảo mật nghiêm trọng (eval, secret keys)." }
];

// DOM Elements
const velocityInput = document.getElementById('velocity');
const storyTitleInput = document.getElementById('story-title');
const storyPointsInput = document.getElementById('story-points');
const storyDescInput = document.getElementById('story-desc');
const btnAddStory = document.getElementById('btn-add-story');
const backlogList = document.getElementById('backlog-list');
const btnPlanSprints = document.getElementById('btn-plan-sprints');
const sprintResultSection = document.getElementById('sprint-result');
const sprintMarkdownOutput = document.getElementById('sprint-markdown-output');

const codeInput = document.getElementById('code-input');
const btnRunReview = document.getElementById('btn-run-review');
const reviewResultSection = document.getElementById('review-result');
const reviewStatusBadge = document.getElementById('review-status-badge');
const findingsList = document.getElementById('findings-list');

// Render danh sách Backlog hiện tại
function renderBacklog() {
  backlogList.innerHTML = '';
  backlogStories.forEach((story, index) => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.innerHTML = `
      <div>
        <strong>${story.title}</strong> <span class="badge" style="background-color: #0066cc;">${story.points} SP</span>
        <p style="font-size: 0.85rem; color: #666; margin-top: 4px;">${story.description}</p>
      </div>
      <button class="btn btn-danger" style="padding: 4px 8px; font-size: 0.8rem;" onclick="removeStory(${index})">Xóa</button>
    `;
    backlogList.appendChild(li);
  });
}

// Thêm User Story mới
btnAddStory.addEventListener('click', () => {
  const title = storyTitleInput.value.trim();
  const points = parseInt(storyPointsInput.value, 10);
  const description = storyDescInput.value.trim();

  if (!title || isNaN(points) || points <= 0) {
    alert('Vui lòng nhập đầy đủ tiêu đề và Story Points hợp lệ (số dương).');
    return;
  }

  backlogStories.push({ title, points, description: description || 'Không có mô tả.' });
  
  // Reset form
  storyTitleInput.value = '';
  storyPointsInput.value = '';
  storyDescInput.value = '';
  
  renderBacklog();
});

// Xóa User Story khỏi Backlog
window.removeStory = function(index) {
  backlogStories.splice(index, 1);
  renderBacklog();
};

// Gửi yêu cầu phân bổ Sprint lên Server
btnPlanSprints.addEventListener('click', async () => {
  if (backlogStories.length === 0) {
    alert('Danh sách chờ (Backlog) đang trống. Vui lòng thêm User Story.');
    return;
  }

  const velocity = parseInt(velocityInput.value, 10);
  if (isNaN(velocity) || velocity <= 0) {
    alert('Năng suất Sprint (Velocity) phải là số dương.');
    return;
  }

  try {
    const response = await fetch('/api/sprint-plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stories: backlogStories, velocity })
    });

    const data = await response.json();
    if (data.success) {
      sprintMarkdownOutput.textContent = data.markdown;
      sprintResultSection.classList.remove('hidden');
      sprintResultSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      alert(`Lỗi phân bổ: ${data.error}`);
    }
  } catch (error) {
    alert(`Lỗi kết nối hệ thống: ${error.message}`);
  }
});

// Gửi yêu cầu rà soát mã nguồn lên Server
btnRunReview.addEventListener('click', async () => {
  const code = codeInput.value.trim();
  if (!code) {
    alert('Vui lòng nhập hoặc dán mã nguồn cần rà soát.');
    return;
  }

  try {
    const response = await fetch('/api/code-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    });

    const data = await response.json();
    if (data.success) {
      const { passed, findings } = data.report;
      
      // Render trạng thái tổng quan
      reviewStatusBadge.innerHTML = '';
      const banner = document.createElement('div');
      banner.className = `status-banner ${passed ? 'status-passed' : 'status-failed'}`;
      banner.textContent = passed 
        ? '✅ ĐẠT CHẤT LƯỢNG (PASSED) - Sẵn sàng bàn giao!' 
        : '❌ BỊ CHẶN (BLOCKED) - Phát hiện lỗi bảo mật nghiêm trọng!';
      reviewStatusBadge.appendChild(banner);

      // Render danh sách lỗi chi tiết
      findingsList.innerHTML = '';
      findings.forEach(finding => {
        const li = document.createElement('li');
        li.className = `finding-item finding-${finding.severity}`;
        li.innerHTML = `<strong>[${finding.severity}]</strong> ${finding.message}`;
        findingsList.appendChild(li);
      });

      reviewResultSection.classList.remove('hidden');
      reviewResultSection.scrollIntoView({ behavior: 'smooth' });
    } else {
      alert(`Lỗi rà soát: ${data.error}`);
    }
  } catch (error) {
    alert(`Lỗi kết nối hệ thống: ${error.message}`);
  }
});

// Khởi tạo ứng dụng ban đầu
renderBacklog();
```

---