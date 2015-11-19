// by dribehance <dribehance.kksdapp.com>
angular.module("kkshop").factory("SharedState", function($rootScope) {
    return {
        turnOn: function(state) {
            if (!state) return;
            $rootScope[state] = true;
        },
        turnOff: function(state) {
            if (!state) return;
            $rootScope[state] = false;
        },
        isActive:function(state) {
        	if (!state) return;
        	return $rootScope[state];
        }
    }
});
