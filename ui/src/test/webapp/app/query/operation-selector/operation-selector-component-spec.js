describe('Operation Selector Component', function() {
    
    var ctrl;

    var $componentController, $q;
    var scope;
    var operationService;
    var $routeParams;

    var availableOperations = [
        {name: "op Name 1", description: "OP description 1"},
        {name: "op Name 2", description: "OP description 2"},
        {name: "op Name 3", description: "OP description 3"}
    ];
    
    beforeEach(module('app'));

    beforeEach(module(function($provide) {
        $provide.factory('config', function($q) {
            var get = function() {
                return $q.when({});
            }

            return {
                get: get
            }
        });

        $provide.factory('schema', function($q) {
            return {
                get: function() {
                    return $q.when({});
                }
            }
        });
    }));
        

    beforeEach(inject(function(_$componentController_, _$rootScope_, _$q_, _operationService_, _$routeParams_) {
        $componentController = _$componentController_;
        scope = _$rootScope_.$new();
        $q = _$q_;
        operationService = _operationService_;
        $routeParams = _$routeParams_;
    }));

    beforeEach(function() {
        ctrl = $componentController('operationSelector', {$scope: scope});
    });

    beforeEach(function() {
        spyOn(operationService, 'reloadOperations').and.callFake(function() {
            return $q.when(availableOperations);
        });
    })

    it('should exist', function() {
        expect(ctrl).toBeDefined();
    });

    describe('ctrl.getOperations()', function() {

        it('should load the operations', function() {
            var ctrl = $componentController('operationSelector', { $scope: scope });

            ctrl.getOperations();
            scope.$digest();

            expect(operationService.reloadOperations).toHaveBeenCalledTimes(1);
        });

        it('should select the operation defined in the query operation parameter', function() {
            $routeParams.operation = "operationX";
            var ctrl = $componentController('operationSelector', { $scope: scope });
            var availableOperations = [
                {name: "GetElements"},
                {name: "operationX"}
            ];
            spyOn(operationService, 'getAvailableOperations').and.returnValue($q.when(availableOperations));

            ctrl.getOperations();
            scope.$digest();

            expect(ctrl.model.name).toEqual('operationX');
        });

        it('should select the operation defined in the query operation parameter case insensitive and strip symbols', function() {
            $routeParams.operation = "operation-x.";
            var ctrl = $componentController('operationSelector', { $scope: scope });
            var availableOperations = [
                {name: "GetElements"},
                {name: "operationX"}
            ];
            spyOn(operationService, 'getAvailableOperations').and.returnValue($q.when(availableOperations));

            ctrl.getOperations();
            scope.$digest();

            expect(ctrl.model.name).toEqual('operationX');
        });

        it('should select the operation defined in the query op parameter', function() {
            $routeParams.op = "operationX";
            var ctrl = $componentController('operationSelector', { $scope: scope });
            var availableOperations = [
                {name: "GetElements"},
                {name: "operationX"}
            ];
            spyOn(operationService, 'getAvailableOperations').and.returnValue($q.when(availableOperations));

            ctrl.getOperations();
            scope.$digest();

            expect(ctrl.model.name).toEqual('operationX');
        });

        it('should not select an operation', function() {
            $routeParams.op = "unknownOp";
            var ctrl = $componentController('operationSelector', { $scope: scope });
            ctrl.selectedOp = undefined;
            var availableOperations = [
                {name: "GetElements"},
                {name: "operationX"}
            ];
            spyOn(operationService, 'getAvailableOperations').and.returnValue($q.when(availableOperations));

            ctrl.getOperations();
            scope.$digest();

            expect(ctrl.model).not.toBeDefined();
        });

        it('should populate and sort operations as NamedOps first and in alphabetical name order', function() {
            var operationsInWrongOrder = [
                {namedOp: false, name: 'Get All Elements', description: 'Gets all elements'},
                {namedOp: true, name: 'Op Name 4', description: 'OP description 4'},
                {namedOp: true, name: 'Op Name 3', label: null, description: 'OP description 3'},
                {namedOp: true, name: 'Op Name 2', label: 'Group 1', description: 'OP description 2'},
                {namedOp: true, name: 'Op Name 1', label: 'Group 1', description: 'OP description 1'}
            ];
            spyOn(operationService, 'getAvailableOperations').and.returnValue($q.when(operationsInWrongOrder));

            ctrl.getOperations();
            scope.$digest();

            var firstOp = {displayName: '[Group 1] Op Name 1', namedOp: true, name: 'Op Name 1', label:'Group 1', description: 'OP description 1', formattedName: '[group1]opname1', formattedDescription: 'opdescription1'};
            var secondOp = {displayName: '[Group 1] Op Name 2', namedOp: true, name: 'Op Name 2', label:'Group 1', description: 'OP description 2', formattedName: '[group1]opname2', formattedDescription: 'opdescription2'};
            var thirdOp = {displayName: 'Op Name 3', namedOp: true, name: 'Op Name 3', label: null, description: 'OP description 3', formattedName: 'opname3', formattedDescription: 'opdescription3'};
            var fourthOp = {displayName: 'Op Name 4', namedOp: true, name: 'Op Name 4', description: 'OP description 4', formattedName: 'opname4', formattedDescription: 'opdescription4'};
            var fifthOp = {displayName: 'Get All Elements', namedOp: false, name: 'Get All Elements', description: 'Gets all elements', formattedName: 'getallelements', formattedDescription: 'getsallelements'};
            expect(ctrl.availableOperations[0]).toEqual(firstOp);
            expect(ctrl.availableOperations[1]).toEqual(secondOp);
            expect(ctrl.availableOperations[2]).toEqual(thirdOp);
            expect(ctrl.availableOperations[3]).toEqual(fourthOp);
            expect(ctrl.availableOperations[4]).toEqual(fifthOp);
        });
    });

    describe('ctrl.reloadOperations()', function() {

        beforeEach(function() {
            ctrl.reloadOperations();
        });

        it('should refresh the operations', function() {
            expect(operationService.reloadOperations).toHaveBeenCalled();
        });

        it('should populate and sort operations as NamedOps first and in alphabetical name order', function() {
            availableOperations = [
                {namedOp: false, name: 'Get All Elements', description: 'Gets all elements'},
                {namedOp: true, name: 'Op Name 4', description: 'OP description 4'},
                {namedOp: true, name: 'Op Name 3', label: null, description: 'OP description 3'},
                {namedOp: true, name: 'Op Name 2', label: 'Group 1', description: 'OP description 2'},
                {namedOp: true, name: 'Op Name 1', label: 'Group 1', description: 'OP description 1'}
            ];

            ctrl.reloadOperations();
            scope.$digest();

            var firstOp = {displayName: '[Group 1] Op Name 1', namedOp: true, name: 'Op Name 1', label:'Group 1', description: 'OP description 1', formattedName: '[group1]opname1', formattedDescription: 'opdescription1'};
            var secondOp = {displayName: '[Group 1] Op Name 2', namedOp: true, name: 'Op Name 2', label:'Group 1', description: 'OP description 2', formattedName: '[group1]opname2', formattedDescription: 'opdescription2'};
            var thirdOp = {displayName: 'Op Name 3', namedOp: true, name: 'Op Name 3', label: null, description: 'OP description 3', formattedName: 'opname3', formattedDescription: 'opdescription3'};
            var fourthOp = {displayName: 'Op Name 4', namedOp: true, name: 'Op Name 4', description: 'OP description 4', formattedName: 'opname4', formattedDescription: 'opdescription4'};
            var fifthOp = {displayName: 'Get All Elements', namedOp: false, name: 'Get All Elements', description: 'Gets all elements', formattedName: 'getallelements', formattedDescription: 'getsallelements'};
            expect(ctrl.availableOperations[0]).toEqual(firstOp);
            expect(ctrl.availableOperations[1]).toEqual(secondOp);
            expect(ctrl.availableOperations[2]).toEqual(thirdOp);
            expect(ctrl.availableOperations[3]).toEqual(fourthOp);
            expect(ctrl.availableOperations[4]).toEqual(fifthOp);
        });

        describe('should order by', function() {
            it('named operation first', function() {
                availableOperations = [
                    {name: 'abc', description: 'abc' },
                    {name: 'xyz', description: 'xyz', namedOp: true}
                ];

                ctrl.reloadOperations();
                scope.$digest();

                expect(ctrl.availableOperations[0].name).toEqual('xyz');
            });

            it('operation name second', function() {
                availableOperations = [
                    {name: 'abc', description: 'xyz'},
                    {name: 'xyz', description: 'abc'}
                ];

                ctrl.reloadOperations();
                scope.$digest();

                expect(ctrl.availableOperations[0].name).toEqual('abc');
            });

            it('operation description third', function() {
                availableOperations = [
                    {name: 'abc', description: 'xyz'},
                    {name: 'abc', description: 'abc'}
                ];

                ctrl.reloadOperations();
                scope.$digest();

                expect(ctrl.availableOperations[0].description).toEqual('abc');
            });

            it('the order it came in if all the above are the equal', function() {
                availableOperations = [
                    {name: 'abc', description: 'abc', passed: true},
                    {name: 'abc', description: 'abc'}
                ];

                ctrl.reloadOperations();
                scope.$digest();

                expect(ctrl.availableOperations[0].passed).toBeTruthy();
            });
        });
    });
});
