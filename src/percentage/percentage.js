'use strict';
Percentage.$inject = ['$filter', '$compile'];

function Percentage($filter, $compile) {
    return {
        restrict: 'A',
        require: ['ngModel', '?^gumgaForm'],
        link: (scope, element, attrs, controllers) => {
            let modelCtrl = controllers[0];

            if (!element.attr('ui-percentage-mask')) {
                element.removeAttr('gumga-percentage');
                let input = angular.element(element[0].outerHTML);
                input.attr('ui-percentage-mask', attrs.gumgaPercentage || '0');
                if(element.is('[gumga-percentage-value]')){
                    input.removeAttr('gumga-percentage-value');
                    input.attr('ui-percentage-value', '');
                }
                angular.element(element).replaceWith($compile(input)(scope));
            }

        }
    }
}

angular.module('gumga.form.percentage', [])
    .directive('gumgaPercentage', Percentage);