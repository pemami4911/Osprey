'user strict'

describe('ospreyCoreApp', function() {

	browser.get('http://localhost:8080');

	//Should toss an error when attempting to register twice with the same email 
	it('should reject the same user from being registered twice', function() {
		element(by.model('initRegData.userType')).click();
		element(by.model('initRegData.email')).sendKeys('psd@psd.com');
		//next-button
		element(by.css('#next-button')).click();

		element(by.model('regData.password')).sendKeys('ilovenick');
		element(by.css('#regParent')).click();

		expect(browser.get('http://localhost:8080/#/dashboard'));
		browser.navigate().back();

		element(by.model('regData.password')).sendKeys('ilovenick');
		element(by.css('#regParent')).click();
		expect(browser.get('http://localhost:8080/#/regParent'));
	});
}); 