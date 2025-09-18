const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

// Performance testing configuration
const config = {
  extends: 'lighthouse:default',
  settings: {
    onlyAudits: [
      'first-contentful-paint',
      'largest-contentful-paint',
      'first-meaningful-paint',
      'speed-index',
      'cumulative-layout-shift',
      'total-blocking-time',
      'interactive',
      'max-potential-fid'
    ]
  }
};

async function runPerformanceTest(url) {
  console.log('🚀 Starting performance test...\n');
  
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  const options = {
    logLevel: 'info',
    output: 'html',
    onlyCategories: ['performance'],
    port: chrome.port
  };

  try {
    const runnerResult = await lighthouse(url, options, config);
    
    // Extract key metrics
    const audits = runnerResult.lhr.audits;
    const metrics = {
      'First Contentful Paint': audits['first-contentful-paint'].displayValue,
      'Largest Contentful Paint': audits['largest-contentful-paint'].displayValue,
      'First Meaningful Paint': audits['first-meaningful-paint'].displayValue,
      'Speed Index': audits['speed-index'].displayValue,
      'Cumulative Layout Shift': audits['cumulative-layout-shift'].displayValue,
      'Total Blocking Time': audits['total-blocking-time'].displayValue,
      'Time to Interactive': audits['interactive'].displayValue
    };

    console.log('📊 Performance Metrics:');
    console.log('========================');
    Object.entries(metrics).forEach(([metric, value]) => {
      console.log(`${metric}: ${value}`);
    });

    console.log(`\n📈 Overall Performance Score: ${runnerResult.lhr.categories.performance.score * 100}/100`);
    
    // Generate report
    const reportHtml = runnerResult.report;
    require('fs').writeFileSync('performance-report.html', reportHtml);
    console.log('\n📄 Detailed report saved to: performance-report.html');

    return runnerResult;
  } catch (error) {
    console.error('❌ Performance test failed:', error);
  } finally {
    await chrome.kill();
  }
}

// Run test if called directly
if (require.main === module) {
  const url = process.argv[2] || 'http://localhost:1313';
  runPerformanceTest(url);
}

module.exports = { runPerformanceTest };
