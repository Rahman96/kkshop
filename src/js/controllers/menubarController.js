angular.module('kkshop').controller('menubarController', function($scope, $timeout, $mdSidenav, $log, $location, config) {
    $scope.toggleLeft = buildDelayedToggler('left');
    $scope.toggleRight = buildToggler('right');
    var menubars = [];
    angular.forEach(config.sidebar, function(sidebar) {
        sidebar[1].name = sidebar[0].name;
        menubars.push(sidebar[1])
    })
    $scope.menubars = menubars;
    $scope.$on('$locationChangeSuccess', onLocationChange);
    $scope.highlight = function(url) {
        return url.split("/")[1];
    }
    function onLocationChange() {
        $scope.current_path = $location.path().split("/")[1]
    }
    $scope.isOpenRight = function() {
        return $mdSidenav('right').isOpen();
    };
    /**
     * Supplies a function that will continue to operate until the
     * time is up.
     */
    function debounce(func, wait, context) {
        var timer;
        return function debounced() {
            var context = $scope,
                args = Array.prototype.slice.call(arguments);
            $timeout.cancel(timer);
            timer = $timeout(function() {
                timer = undefined;
                func.apply(context, args);
            }, wait || 10);
        };
    }
    /**
     * Build handler to open/close a SideNav; when animation finishes
     * report completion in console
     */
    function buildDelayedToggler(navID) {
        return debounce(function() {
            $mdSidenav(navID)
                .toggle()
                .then(function() {
                    $log.debug("toggle " + navID + " is done");
                });
        }, 200);
    }

    function buildToggler(navID) {
        return function() {
            $mdSidenav(navID)
                .toggle()
                .then(function() {
                    $log.debug("toggle " + navID + " is done");
                });
        }
    }
})
