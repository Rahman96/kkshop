// by dribehance <dribehance.kksdapp.com>
angular.module("kkshop").controller("sidebarController", function($scope, $rootScope, $location, $timeout, $mdSidenav, sidebarServices, errorServices, toastServices, localStorageService, config) {
    $scope.menu = sidebarServices;
    // Methods used by menuLink and menuToggle directives
    this.isOpen = isOpen;
    this.isSelected = isSelected;
    this.toggleOpen = toggleOpen;
    this.autoFocusContent = false;
    $scope.$on('$locationChangeSuccess', onLocationChange);

    var current_path = last_path = "consoles";

    function onLocationChange() {
        openPage();
        last_path = current_path;
        current_path = $location.path().split("/")[1];
        if (last_path == current_path) {
            return;
        }
        $scope.menu.sections = config.sidebar[current_path] || config.sidebar[last_path];
    }
    var mainContentArea = document.querySelector("[role='main']");

    // *********************
    // Internal methods
    // *********************

    function closeMenu() {
        $timeout(function() {
            $mdSidenav('left').close();
        });
    }

    function openMenu() {
        $timeout(function() {
            $mdSidenav('left').open();
        });
    }

    function path() {
        return $location.path();
    }

    function goHome($event) {
        $scope.menu.selectPage(null, null);
        $location.path('/');
    }

    function openPage() {
        closeMenu();

        if (self.autoFocusContent) {
            focusMainContent();
            self.autoFocusContent = false;
        }
    }

    function focusMainContent($event) {
        // prevent skip link from redirecting
        if ($event) {
            $event.preventDefault();
        }

        $timeout(function() {
            mainContentArea.focus();
        }, 90);

    }

    function isSelected(page) {
        return $scope.menu.isPageSelected(page);
    }

    function isSectionSelected(section) {
        var selected = false;
        var openedSection = $scope.menu.openedSection;
        if (openedSection === section) {
            selected = true;
        } else if (section.children) {
            section.children.forEach(function(childSection) {
                if (childSection === openedSection) {
                    selected = true;
                }
            });
        }
        return selected;
    }

    function isOpen(section) {
        return $scope.menu.isSectionSelected(section);
    }

    function toggleOpen(section) {
        $scope.menu.toggleSelectSection(section);
    }
})
