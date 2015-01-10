/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
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
        userResponse =  {   "userType": "Physician", "email": "asd@asd.com", "password": "hash", 
                            "phyShowAge": true, "phyShowEmail": false, "phyShowWeight": true, 
                            "children" : {"content": [
                            {"birthday":"2010-01-01", "name": "child a", 
                                "parent": {"firstName":"John", "lastName":"Smith", "username": "a@a.com"},
                                "fitbit": [{calories: 324.5683931745589,
                                            timeActiveNotStrenuous: 9.280397527252777,
                                            timeActiveStrenuous: 6.117963233962655,
                                            timeSedentary: 8.601639238784568,
                                            timestamp: "2014-01-06"}, 
                                            {calories: 324.5683931745589,
                                            timeActiveNotStrenuous: 9.280397527252777,
                                            timeActiveStrenuous: 6.117963233962655,
                                            timeSedentary: 8.601639238784568,
                                            timestamp: "2014-01-07"}]
                            }
                            ]}
                        };
        $httpBackend = _$httpBackend_; 
        $httpBackend.when('POST', '/auth/isLogged').respond( function() {
            return [200, userResponse];
        }); 
        $httpBackend.when('POST', '/users/childrenOfPhysician').respond( function() {
            return [200, {'content':[]}];
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
        scope.switchTab(4);
        expect(scope.contentUrl).toBe('views/dashPartials/dashSettings.html'); 
        scope.switchTab(2);
        expect(scope.contentUrl).toBe('views/dashPartials/dashMyPatients.html'); 

    }); 

   it('should change the content url to any other url', function() {
        scope.switchTab(4);
        expect(scope.contentUrl).toBe('views/dashPartials/dashSettings.html'); 
        scope.switchTab(2); 
        expect(scope.contentUrl).toBe('views/dashPartials/dashMyPatients.html'); 
    });

   it('should have three tabs in the navigation bar', function() {
        expect(scope.navItems.length).toBe(2);
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
        $httpBackend.when('POST', '/users/childrenOfParent').respond( function() {
            return [200, {'content':[]}];
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
    it('should display the parent page upon logging in', function() {
        expect(scope.contentUrl).toBe('views/parentPartials/dashParent.html'); 
    });
    it('should have two tabs in the navigation bar', function() {
        expect(scope.navItems.length).toBe(2);
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
        $httpBackend.when('POST', '/auth/isLogged').respond(500, {"message":"Verification Error"}); 
        $location = _$location_; 
    }));

    it('should kick a user out of the dashboard if the controller is loaded and no one is logged in', function() {
        scope.checkLogged();
        $httpBackend.flush();
        expect($location.url()).toBe('/'); 
    });
});
