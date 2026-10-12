const request = require('supertest');
const fs = require('fs');
const path = require('path');
const app = require('../server');

describe('🧪 Bộ Kiểm Thử Tích Hợp Hệ Thống (Integration Tests)', () => {
  
  describe('POST /api/sprint-plan - Lập Kế Hoạch Sprint', () => {
    it('Nên phân bổ thành công các User Stories khi Story Points hợp lệ', async () => {
      const payload = {
        velocity: 10,
        stories: [
          { title: 'Task 1', points: 5, description: 'Desc 1' },
          { title: 'Task 2', points: 4, description: 'Desc 2' },
          { title: 'Task 3', points: 3, description: 'Desc 3' }
        ]
      };

      const res = await request(app)
        .post('/api/sprint-plan')
        .send(payload)
        .expect(200);

      expect(res.