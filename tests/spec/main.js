/* jshint global: describe, beforeEach, module, it, inject, expect*/

'use strict';

describe('Controller: GithubStatus', function () {
    var $httpBackend, $rootScope,
        GithubStatus, createController,
        statusHandler, messagesHandler;

    // load the controller's module
    beforeEach(module('GithubApi'));
    
    beforeEach(inject(function ($injector) {
        var $controller = $injector.get('$controller');
        
        $httpBackend = $injector.get('$httpBackend');
        statusHandler = $httpBackend.when('GET', '/status.json')
            .respond({
                'status': 'good',
                'last_updated': '2015-11-10T12:46:18Z'
            });
        messagesHandler = $httpBackend.when('GET', '/messages.json')
            .respond([{
                'status': 'good',
                'body': 'Message 1.',
                'created_on': '2015-11-09T21:10:09Z'
            }, {
                'status': 'minor',
                'body': 'Message 2.',
                'created_on': '2015-11-09T20:54:59Z'
            }, {
                'status': 'minor',
                'body': 'Message 3.',
                'created_on': '2015-11-09T20:50:37Z'
            }, {
                'status': 'good',
                'body': 'Message 4.',
                'created_on': '2015-11-04T03:51:41Z'
            }, {
                'status': 'minor',
                'body': 'Message 5.',
                'created_on': '2015-11-04T03:34:08Z'
            }, {
                'status': 'minor',
                'body': 'Message 6.',
                'created_on': '2015-11-04T03:18:48Z'
            }, {
                'status': 'minor',
                'body': 'Message 7.',
                'created_on': '2015-11-04T03:00:27Z'
            }]);

        $rootScope = $injector.get('$rootScope');

        createController = function () {
            return $controller('GithubStatus', { '$scope' : $rootScope });
        };
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    it('should load Github status', function () {
        $httpBackend.expectGET('/status.json');
        $httpBackend.expectGET('/messages.json');
        var controller = createController();
        $httpBackend.flush();
        expect($rootScope.status).toBe('good');
        expect($rootScope.messages.length).toBe(7);
    });
});
