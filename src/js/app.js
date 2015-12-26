// by dribehance <dribehance.kksdapp.com>
angular.module("kkshop", [
        "ngRoute",
        "ngMaterial",
        "LocalStorageModule",
        "flow",
        // "timer"
    ])
    .config(function($routeProvider, $httpProvider, $locationProvider, localStorageServiceProvider, config) {
        var configData = [];
        for (key in config.sidebar) {
            configData = configData.concat(config.sidebar[key]);
        }
        angular.forEach(configData, function(ctrl) {
            if (ctrl.type != "link") return;
            var controllername = ctrl.url.replace(/[a-z]\/[a-z]/g, function(letter) {
                return letter.replace(/\/[a-z]/g,function(l){
                    l = l.replace("/","").toUpperCase();
                    return l;
                })
            }).replace("/","");
            controllername = controllername + "Controller";
            $routeProvider.when(ctrl.url, {
                templateUrl: ctrl.url.substring(1, ctrl.url.length) + ".html",
                reloadOnSearch: false,
                controller: controllername
            });
        })
        $routeProvider.otherwise("/consoles/welcome");
        // $httpProvider.defaults.useXDomain = true;
        // $httpProvider.defaults.withCredentials = true;
        // delete $httpProvider.defaults.headers.common["X-Requested-With"];
        localStorageServiceProvider.setStorageCookie(1 / 50);
        $httpProvider.interceptors.push('tokenInterceptor');
        // $locationProvider.html5Mode(true);

    }).run(function(appServices) {
        // init event such as routechangestart...
        appServices.init();
    });
