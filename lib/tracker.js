const { performance, PerformanceObserver } = require("perf_hooks");
const colors = require("ansi-colors");

class ExecutionTracker {
  constructor() {
    this.entries = new Map();
    this.obs = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        if (process.env.NODE_ENV !== 'test') {
          const duration = entry.duration;
          let color = colors.green;
          if (duration > 1000) color = colors.red;
          else if (duration > 100) color = colors.yellow;
          
          console.log(
            color(`[PERF] ${entry.name.padEnd(20)}`),
            `${duration.toFixed(2)}ms`.padStart(10),
            this.getPerformanceRating(duration)
          );
        }
        this.entries.set(entry.name, entry.duration);
      });
    });
    this.obs.observe({ entryTypes: ['function'] });
  }

  // Add cleanup method
  disconnect() {
    this.obs.disconnect();
  }

  getPerformanceRating(duration) {
    if (duration < 10) return "✓ Excellent";
    if (duration < 100) return "✓ Good";
    if (duration < 1000) return "⚠️ Needs optimization";
    return "❌ Critical bottleneck";
  }

  wrapFunction(fn, name) {
    const timerified = performance.timerify(fn);
    const wrapped = function (...args) {
      return timerified.apply(this, args);
    };
    Object.defineProperty(wrapped, "name", { value: name || fn.name });
    return wrapped;
  }

  generateReport() {
    return Array.from(this.entries.entries()).sort((a, b) => b[1] - a[1]); // Sort by longest duration first
  }

  generateFlamegraph() {
    const flamegraphData = {
      name: "root",
      value: 0,
      children: Array.from(this.entries.entries()).map(([name, duration]) => ({
        name,
        value: duration,
      })),
    };
    require("fs").writeFileSync(
      "flamegraph.html",
      `
    <!DOCTYPE html>
    <html>
      <head>
        <script src="https://cdn.jsdelivr.net/npm/d3-flame-graph@4.1.3/dist/d3-flame-graph.min.js"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/d3-flame-graph@4.1.3/dist/d3-flamegraph.css">
      </head>
      <body>
        <div id="chart"></div>
        <script>
          flamegraph().selfValue(false)
            .document(document.getElementById('chart'))
            .data(${JSON.stringify(flamegraphData)})();
        </script>
      </body>
    </html>
  `
    );
  }
}

module.exports = ExecutionTracker;
