const sonarqubeScanner = require('sonarqube-scanner');

sonarqubeScanner({
  serverUrl: 'http://localhost:9000',
  token: 'sqp_de87a903e6692ee5aef7cc5ae427c62676b4a893',
  options : {
    "sonar.login":"admin",
    "sonar.password":"password",
    'sonar.sources': '.',
    'sonar.inclusions' : 'model/**,controllers/**,config/**,middleware/**,routes/**,test/**', // Entry point of your code
    'sonar.test.inclusions': '/backend/test/**',  // Tests files
    'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info', // LCOV coverage report
    // 'sonar.testExecutionReportPaths': 'reports/test-report.xml', // Test report
  },
}, () => {});