angular.module('directives',[])
    .directive('ang-showtab',
    function () {
        return {
            link: function (scope, element, attrs) {
                element.click(function(event) {
                    event.preventDefault();
                    $(element).tab('show');
                });
            }
        };
    });