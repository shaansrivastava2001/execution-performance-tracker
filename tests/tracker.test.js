const ExecutionTracker = require('../lib/tracker');

describe('ExecutionTracker', () => {
  let tracker;

  beforeEach(() => {
    tracker = new ExecutionTracker();
  });

  afterEach(() => {
    tracker.disconnect();
  });

  test('getPerformanceRating returns correct ratings', () => {
    expect(tracker.getPerformanceRating(5)).toBe('✓ Excellent');
    expect(tracker.getPerformanceRating(50)).toBe('✓ Good');
    expect(tracker.getPerformanceRating(500)).toBe('⚠️ Needs optimization');
    expect(tracker.getPerformanceRating(1500)).toBe('❌ Critical bottleneck');
  });
});
