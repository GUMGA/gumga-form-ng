(function () {
  'use strict';

  Required.$inject = ['$interpolate'];
  function Required($interpolate) {
    return {
      restrict: 'A',
      require: ['ngModel', '^?gumgaForm'],
      link: function (scope, elm, attrs, controllers) {
        let error = 'required',
          name = attrs.name,
          field = attrs.field,
          ngModel = controllers[0],
          gumgaForm = controllers[1];
        (function () {
          let isValid = (attrs.gumgaRequired.length == 0) ?
            !!(ngModel.$viewValue && ngModel.$viewValue.length > 0) :
            !!($interpolate(attrs.gumgaRequired)(scope))
          gumgaForm.changeStateOfInput(name, error, isValid, null, field);
          ngModel.$setValidity(error, isValid);
        }());

        function validateRequired(inputValue) {
          let isValid = (attrs.gumgaRequired.length == 0) ?
            !!(inputValue && inputValue.length > 0) :
            !!($interpolate(attrs.gumgaRequired)(scope))
          gumgaForm.changeStateOfInput(name, error, isValid, null, field);
          ngModel.$setValidity(error, isValid);
          return inputValue;
        };

        ngModel.$parsers.unshift(validateRequired);
        ngModel.$formatters.push(validateRequired);
        attrs.$observe('gumgaRequired', x => validateRequired(ngModel.$viewValue));
      }
    }
  }
  angular.module('gumga.form.required', [])
    .directive('gumgaRequired', Required);
})();
