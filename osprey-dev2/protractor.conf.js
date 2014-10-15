//proctractor configuration

exports.config = {
  
  // The address of a running selenium server.
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['public/tests/e2e/*.js'],
 
};