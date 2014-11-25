describe('dashboardControllerLoggedInPhysician', function(){

    beforeEach(module('dashboardPageModule')); 

    var ctrl, scope, $httpBackend, $location, userResponse;
    // inject the $controller and $rootScope services
    // in the beforeEach block
    beforeEach(inject(function($controller, $rootScope, _$httpBackend_, _$location_) {
    // Create a new scope that's a child of the $rootScope
        scope = $rootScope.$new();
       
      // Create the controller
        dashCtrl = $controller('dashboardController', {
            $scope : scope
        });
        userResponse = { "userType": "Physician", "email": "asd@asd.com", "password": "hash", "tableSettings" : {"showAge": true, "showWeight": true, "showEmail": true}};
        $httpBackend = _$httpBackend_; 
        $httpBackend.when('POST', '/auth/isLogged').respond( function() {
            return [200, userResponse];
        }); 
        $httpBackend.when('GET', '/auth/logout').respond(200, "OK"); 
        $httpBackend.flush();
        $location = _$location_; 
    }));

    it('should be able to instantiate a copy of the dashboardController', function() {
        expect(dashCtrl).toExist; 
    });

    it('should have access to the dashboardControllers scope', function() {
        expect(scope.activeTab).toExist; 
    });

    // the first thing a physician should see when they log in is a table of their patients
    it('should display a table of the physicians patients immediately when they log in to the dashboard', function() {
        expect(scope.contentUrl).toBe('views/dashPartials/dashMyPatients.html'); 
    }); 

    it('should check the page number is active', function() {
        expect(scope.isActive).toBeTruthy(); 
    });

    it('should successfully be able to log out a user', function() {
        scope.logoutAttempt(); 
        $httpBackend.flush();

        expect($location.url()).toBe('/'); 
    });

    it('should fail to log out if scope.loggedUser is empty', function() {
        scope.loggedUser = undefined; 
        scope.logoutAttempt(scope.loggedUser); 
        expect(scope.error).toBe("Attempt to log out failed because no one is logged in!"); 
    });

    it('should change the content url when a new tab is selected, and should be able to switch back', function() {
        scope.activeTab = 2;
        expect(scope.contentUrl).toBe('views/dashPartials/dashMyPatients.html'); 
        scope.switchTab(3);
        expect(scope.contentUrl).toBe('views/dashPartials/dashCharts.html'); 
        scope.switchTab(2);
        expect(scope.contentUrl).toBe('views/dashPartials/dashMyPatients.html'); 

    }); 

   it('should change the content url to any other url', function() {
        scope.switchTab(3);  
        expect(scope.contentUrl).toBe('views/dashPartials/dashCharts.html'); 
        scope.switchTab(1);
        expect(scope.contentUrl).toBe('views/dashPartials/dashMain.html'); 
        scope.switchTab(2); 
        expect(scope.contentUrl).toBe('views/dashPartials/dashMyPatients.html'); 
    });

   it('should have three tabs in the navigation bar', function() {
        expect(scope.navItems.length).toBe(3);
   });
});

describe('dashboardControllerLoggedInParent', function(){

    beforeEach(module('dashboardPageModule')); 

    var ctrl, scope, $httpBackend, $location, userResponse;
    // inject the $controller and $rootScope services
    // in the beforeEach block
    beforeEach(inject(function($controller, $rootScope, _$httpBackend_, _$location_) {
    // Create a new scope that's a child of the $rootScope
        scope = $rootScope.$new();
       
      // Create the controller
        dashCtrl = $controller('dashboardController', {
            $scope : scope
        });
        userResponse = { "userType": "Parent", "email": "a@a.com", "password": "hash", "tableSettings" : {"showAge": true, "showWeight": true, "showEmail": true}};
        $httpBackend = _$httpBackend_; 
        $httpBackend.when('POST', '/auth/isLogged').respond( function() {
            return [200, userResponse];
        }); 
        $httpBackend.flush();
        $location = _$location_; 
    }));

    it('should be able to instantiate a copy of the dashboardController', function() {
        expect(dashCtrl).toExist; 
    });

    it('should have access to the dashboardControllers scope', function() {
        expect(scope.activeTab).toExist; 
    });

    // the first thing a physician should see when they log in is a table of their patients
    it('should display a table of the physicians patients immediately when they log in to the dashboard', function() {
        expect(scope.contentUrl).toBe('views/dashPartials/dashMain.html'); 
    });
    it('should have one tab in the navigation bar', function() {
        expect(scope.navItems.length).toBe(1);
   });
}); 

describe('dashboardControllerNotLoggedIn', function(){

    beforeEach(module('dashboardPageModule')); 

    var ctrl, scope, $httpBackend, $location;
    // inject the $controller and $rootScope services
    // in the beforeEach block
    beforeEach(inject(function($controller, $rootScope, _$httpBackend_, _$location_) {
        // Create a new scope that's a child of the $rootScope
        scope = $rootScope.$new();
       
        // Create the controller
        dashCtrl = $controller('dashboardController', {
            $scope : scope
        });

        $httpBackend = _$httpBackend_; 
        $httpBackend.when('POST', '/auth/isLogged').respond(200, 'false'); 
        $location = _$location_; 
    }));

    it('should kick a user out of the dashboard if the controller is loaded and no one is logged in', function() {
        scope.checkLogged();
        $httpBackend.flush();
        expect($location.url()).toBe('/'); 
    });

});
