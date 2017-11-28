/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 17);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function () {
	'use strict';

	Error.$inject = ['$compile', '$timeout', '$rootScope'];

	function Error($compile, $timeout, $rootScope) {
		return {
			restrict: 'A',
			scope: false,
			require: ['ngModel', '^?gumgaForm'],
			link: function link(scope, elm, attrs, controllers) {
				scope['' + attrs.name.concat('errors')] = {};
				var nameOfInput = attrs.name,
				    translationField = attrs.translationField,
				    ngModel = controllers[0],
				    gumgaCtrl = controllers[1],
				    template = '<ol class="list-errors text-danger"><li ng-repeat="(key, value) in ' + nameOfInput.concat('errors') + '" ><label>{{ value }}</li></ol>',
				    err = scope['' + nameOfInput.concat('errors')];

				elm.scope().$watch(attrs.ngModel, function (value) {
					if (attrs.gumgaError) {
						var result = elm.scope().$eval(attrs.gumgaError);
						if (result.error) {
							err["gumgaerror"] = result.message;
						} else {
							err['gumgaerror'] ? delete err['gumgaerror'] : angular.noop;
						}
						var index = scope.$index || '';
						gumgaCtrl.updateFormErrors(attrs.name + index, 'gumgaerror', !result.error, result.message);
						ngModel.$setValidity(attrs.name + index, !result.error);
						$rootScope.$broadcast('form-changed');
					}
				});

				scope.$on(nameOfInput + '-valid', function (ev, data) {
					err[data.validationType] ? delete err[data.validationType] : angular.noop;
				});

				scope.$on(nameOfInput + '-invalid', function (ev, data) {
					if (!err[data.validationType]) err[data.validationType] = data.message;
				});

				elm.after($compile(template)(scope));
			}
		};
	}
	angular.module('gumga.form.error', []).directive('gumgaError', Error);
})();

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function () {
	'use strict';

	Errors.$inject = ['$compile'];

	function Errors($compile) {
		return {
			restrict: 'E',
			scope: {
				errors: '=?'
			},
			require: '?^gumgaForm',
			link: function link(scope, elm, attrs, gumgaFormController) {
				var title = attrs.title || 'Erros',
				    placement = attrs.placement || 'bottom';
				scope.errors = {};

				function hasError() {
					return Object.keys(scope.errors).length > 0;
				}

				function flatObject(obj, newObj, str) {
					for (var key in obj) {
						if (obj.hasOwnProperty(key)) {
							if (_typeof(obj[key]) == 'object') {
								flatObject(obj[key], newObj, key);
							} else {
								newObj[str.concat(key)] = obj[key];
							}
						}
					}return newObj;
				}

				scope.$on('form-changed', function (ev, data) {
					var newErros = flatObject(gumgaFormController.getFormErrors(), {}, 'main');
					if (!angular.equals(newErros, scope.errors)) {
						scope.errors = newErros;
					}
					scope.hasError = hasError();
				});

				function hasIcon() {
					if (attrs.noErrorIcon && attrs.icon) return 'ng-class="hasError ? \'' + attrs.icon + '\' : \'' + attrs.noErrorIcon + '\' "';
					if (!attrs.noErrorIcon && attrs.icon) return 'ng-class="hasError ? \'' + attrs.icon + '\' : \'glyphicon glyphicon-ok\' "';
					if (attrs.noErrorIcon && !attrs.icon) return 'ng-class="hasError ? \'glyphicon glyphicon-info-sign\' : \'' + attrs.noErrorIcon + '\' "';
					return 'ng-class="hasError ? \'glyphicon glyphicon-info-sign\' : \'glyphicon glyphicon-ok\' "';
				}

				var template = '\n\t\t\t\t<script type="text/ng-template" id="templatePopover.html">\n\t\t\t\t\t<ol class="list-errors text-danger">\n\t\t\t\t\t\t<li ng-repeat="(key, value) in errors">{{ value }}</li>\n\t\t\t\t\t\t</ol>\n\t\t\t\t</script>\n\t\t\t\t<button popover-placement="' + placement + '" uib-popover-template="\'templatePopover.html\'" popover-title="' + title + '" type="button" ng-class="hasError ? \'btn btn-sm btn-danger\' : \'btn btn-sm btn-success\'">';
				if (attrs.hasOwnProperty('labelHidden')) {
					template += '<i ' + hasIcon() + '></i>';
				} else {
					template += '<i ' + hasIcon() + '></i> {{ hasError ? \'' + (attrs.label ? attrs.label : 'Lista de erros') + '\' : \'Formul\xE1rio sem erros\' }}';
				}
				template += '</button>';
				elm.append($compile(template)(scope));
			}
		};
	}
	angular.module('gumga.form.errors', ['ui.bootstrap']).directive('gumgaErrors', Errors);
})();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function () {
  'use strict';

  FormClass.$inject = ['$compile'];

  function FormClass($compile) {

    function link($scope, $element, $attrs) {
      if (!$attrs.gumgaFormClass) throw 'É necessário passar para a directive gumgaFormClass o nome do input com o qual ela está relacionada.';

      var isValidGreen = $element[0].outerHTML.split('\n')[0].indexOf('valid-green') != -1;

      var formName = findParentRecursively('form', $element[0]).name,
          name = $attrs.gumgaFormClass;

      function findParentRecursively(wanted, actual) {
        if (actual.nodeName.toLowerCase() != wanted) {
          return findParentRecursively(wanted, actual.parentNode);
        }
        return actual;
      }

      $scope.$watch(formName + '.' + name + '.$invalid', function () {
        try {
          if ($scope[formName][name].$valid) {
            $attrs.$set('class', isValidGreen ? 'form-group has-success' : 'form-group');
            return;
          }
          $attrs.$set('class', 'form-group has-error');
        } catch (e) {
          console.error('O componente GumgaFormClass necessita que o nome passada como parâmetro seja igual ao nome do input.');
        }
      });
    }

    var ddo = {
      restrict: 'A',
      link: link,
      scope: false
    };

    return ddo;
  }

  angular.module('gumga.form.class', []).directive('gumgaFormClass', FormClass);
})();

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function () {
	'use strict';

	Form.$inject = [];

	function Form() {
		return {
			restrict: 'A',
			scope: false,
			priority: 501,
			require: 'form',
			transclude: false,
			controller: ['$scope', '$element', '$attrs', '$timeout', '$rootScope', function ($scope, $element, $attrs, $timeout, $rootScope) {
				var ctrl = this;

				window.gumgaForms = window.gumgaForms || [];

				window.gumgaForms.push({
					element: $element,
					scope: ctrl
				});

				var defaultMessages = {
					maxdate: 'A data especificada no campo {0} não deve ultrapassar o limite de: {1}.',
					maxlength: 'O texto especificado no campo {0} não deve ultrapassar o limite de: {1}.',
					maxnumber: 'O número especificado no campo {0} não deve ultrapassar o limite de: {1}.',
					mindate: 'A data especificada no campo {0} não deve ser menor que o limite mínimo de: {1}.',
					minlength: 'O texto especificado no campo {0} não deve ser menor que o limite mínimo de: {1}.',
					minnumber: 'O número especificado no campo {0} não deve ser menor que o limite mínimo de: {1}.',
					pattern: 'O texto especificado no campo {0} deve estar dentro do padrão: {1}.',
					rangedate: 'A data especificada no campo {0} deve estar dentro do intervalo: {1}.',
					rangenumber: 'O número especificado no campo {0} deve estar dentro do intervalo: {1}.',
					validatetype: 'O valor digitado no campo {0} deve ser do tipo: {1}',
					required: 'O campo {0} é obrigatório.'
				};

				ctrl.customMessage = {};
				ctrl.formErrors = {};
				ctrl.changeInputMessage = changeInputMessage;
				ctrl.changeStateOfInput = changeStateOfInput;
				ctrl.getDefaultMessages = getDefaultMessages;
				ctrl.getFormErrors = getFormErrors;
				ctrl.getFormName = getFormName;
				ctrl.setFormValidity = setFormValidity;
				ctrl.updateFormErrors = updateFormErrors;
				ctrl.deleteErrosByInputName = deleteErrosByInputName;

				$scope.$on('$destroy', function () {
					window.gumgaForms = ($rootScope.gumgaForms || []).filter(function (form) {
						return form.$scope.$id != $scope.$id;
					});
				});

				ctrl.updateErrorsModel = function () {
					return $scope.$broadcast('form-changed');
				};

				function changeInputMessage(inputName, obj) {
					if (!inputName) throw 'É necessário passar o nome do input [changeInputMessage(inputName, messages)]';
					if (!obj) throw 'É necessário passar um objeto com as mensagens [changeInputMessage(inputName, messages)]';
					var isMessagesRight = Object.keys(obj).filter(function (key) {
						return !defaultMessages[key];
					}),
					    moreThanOne = isMessagesRight.length > 1;
					if (isMessagesRight.length > 0) {
						throw (moreThanOne ? 'Os' : 'O') + ' ' + (moreThanOne ? 'tipos' : 'tipo') + ' de valida\xE7\xE3o ' + (moreThanOne ? isMessagesRight.join(',') : isMessagesRight) + ' n\xE3o ' + (moreThanOne ? 'existem' : 'existe') + '.';
					}
					ctrl.customMessage[inputName] = obj;
					return this;
				}

				function changeStateOfInput(inputName, validationType, inputIsValid, value, field, customMessage) {
					field = field || inputName;
					if (!inputName) throw 'É necessário passar um valor válido como primeiro parâmetro [changeStateOfInput(inputName, validationType, inputIsValid, value)]';
					if (!validationType) throw 'É necessário passar um valor válido como segundo parâmetro [changeStateOfInput(inputName, validationType, inputIsValid, value)]';
					if (inputIsValid !== true && inputIsValid !== false) throw 'É necessário passar um booleano como terceiro parâmetro [changeStateOfInput(inputName, validationType, inputIsValid, value)]';

					var custom = ctrl.customMessage[inputName] ? ctrl.customMessage[inputName] : {},
					    auxString = custom[validationType] ? custom[validationType] : defaultMessages[validationType],
					    message = auxString.replace('{0}', field).replace('{1}', validationType.indexOf('range') != -1 ? 'mínimo de ' + value[0] + ' e máximo de ' + value[1] : value),
					    objectSentToGumgaError = void 0;

					objectSentToGumgaError = !inputIsValid ? { message: message, validationType: validationType } : { validationType: validationType };
					this.updateFormErrors(inputName, validationType, inputIsValid, customMessage || message);

					$scope.$broadcast('form-changed');
					if (customMessage) objectSentToGumgaError.message = customMessage;
					$scope.$broadcast(inputName + '-' + (inputIsValid ? '' : 'in') + 'valid', objectSentToGumgaError);

					return this;
				}

				function getDefaultMessages() {
					return angular.copy(defaultMessages);
				}

				function getFormErrors() {
					return angular.copy(ctrl.formErrors);
				}

				function getFormName() {
					return $attrs.name;
				}

				function updateFormErrors(inputName, validationType, isValid, message) {
					var errs = ctrl.formErrors;
					if (errs[inputName] && errs[inputName][validationType] && isValid === true) {
						delete errs[inputName][validationType];
						return this;
					}

					if (errs[inputName] && errs[inputName][validationType]) return this;

					if (!ctrl.formErrors[inputName]) ctrl.formErrors[inputName] = {};

					if (!isValid) {
						ctrl.formErrors[inputName][validationType] = message;
					}

					return this;
				}

				function deleteErrosByInputName(inputName) {
					delete ctrl.formErrors[inputName];
				}

				function setFormValidity() {
					var _this = this;

					var boolean = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

					$timeout(function () {
						var errors = $scope[$attrs.name].$error,
						    toExclude = [];
						Object.keys(errors).forEach(function (value) {
							return errors[value].forEach(function (x, idx) {
								toExclude.push(x);
								if (idx == errors[value].length - 1) {
									toExclude.forEach(function (x) {
										return x.$setValidity(value, boolean);
									});
									toExclude = [];
								}
							});
						});
						return _this;
					});
				}
			}]
		};
	}
	angular.module('gumga.form.form', []).directive('gumgaForm', Form);
})();

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function () {
	'use strict';

	MaxDate.$inject = ['$filter'];

	function MaxDate($filter) {
		return {
			restrict: 'A',
			require: ['ngModel', '?^gumgaForm'],
			link: function link(scope, elm, attrs, controllers) {
				if (attrs.type != 'date') throw 'Esta diretiva suporta apenas inputs do tipo date';
				if (!attrs.gumgaMaxDate) throw "O valor da diretiva gumga-max-date não foi informado.";

				var ngModelController = controllers[0],
				    gumgaFormController = controllers[1],
				    error = 'maxdate',
				    format = 'yyyy-MM-dd',
				    name = attrs.name,
				    field = attrs.field,
				    limitValue = attrs.gumgaMaxDate;

				function validateMaxDate(inputValue) {
					if (inputValue) {
						var input = $filter('date')(inputValue, format),
						    max = $filter('date')(limitValue, format),
						    isValid = input <= max;
						ngModelController.$setValidity(error, isValid);
						gumgaFormController.changeStateOfInput(name, error, isValid, limitValue, field);
					}
					return inputValue;
				};

				ngModelController.$parsers.unshift(validateMaxDate);
				ngModelController.$formatters.push(validateMaxDate);

				attrs.$observe('gumgaMaxDate', function () {
					validateMaxDate(ngModelController.$viewValue);
				});
			}
		};
	}
	angular.module('gumga.form.max.date', []).directive('gumgaMaxDate', MaxDate);
})();

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function () {
  'use strict';

  MaxLength.$inject = [];
  function MaxLength() {
    return {
      restrict: 'A',
      require: ['ngModel', '?^gumgaForm'],
      link: function link(scope, elm, attrs, controllers) {
        if (!attrs.gumgaMaxLength) throw "O valor da diretiva gumga-max-length não foi informado.";
        var ngModelController = controllers[0],
            gumgaFormController = controllers[1],
            error = 'maxlength',
            name = attrs.name,
            field = attrs.field,
            limitValue = parseInt(attrs.gumgaMaxLength);

        function validateMaxLength(inputValue) {
          if (inputValue) {
            var isValid = inputValue.length <= limitValue;
            ngModelController.$setValidity(error, isValid);
            gumgaFormController.changeStateOfInput(name, error, isValid, limitValue, field);
          }
          return inputValue;
        };

        ngModelController.$parsers.unshift(validateMaxLength);
        ngModelController.$formatters.push(validateMaxLength);
        attrs.$observe('gumgaMaxLength', function (x) {
          return validateMaxLength(ngModelController.$viewValue);
        });
      }
    };
  }
  angular.module('gumga.form.max.length', []).directive('gumgaMaxLength', MaxLength);
})();

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function () {
	'use strict';

	MaxNumber.$inject = [];

	function MaxNumber() {
		return {
			restrict: 'A',
			require: ['ngModel', '?^gumgaForm'],
			link: function link(scope, elm, attrs, controllers) {
				if (attrs.type != 'number') throw 'Esta diretiva suporta apenas inputs do tipo number';
				if (!attrs.gumgaMaxNumber) throw "O valor da diretiva gumga-max-number não foi informado.";

				var ngModelController = controllers[0],
				    gumgaFormController = controllers[1],
				    error = 'maxnumber',
				    name = attrs.name,
				    field = attrs.field,
				    limitValue = parseInt(attrs.gumgaMaxNumber);

				elm.attr('max', limitValue);

				function validateMaxNumber(inputValue) {
					if (inputValue) {
						var isValid = parseFloat(inputValue) <= limitValue;
						ngModelController.$setValidity(error, isValid);
						gumgaFormController.changeStateOfInput(name, error, isValid, limitValue, field);
					}
					return inputValue;
				}

				ngModelController.$parsers.unshift(validateMaxNumber);
				ngModelController.$formatters.push(validateMaxNumber);

				attrs.$observe('gumgaMaxNumber', function (x) {
					return validateMaxNumber(ngModelController.$viewValue);
				});
			}
		};
	}
	angular.module('gumga.form.max.number', []).directive('gumgaMaxNumber', MaxNumber);
})();

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function () {
	'use strict';

	MinDate.$inject = ['$filter'];

	function MinDate($filter) {
		return {
			restrict: 'A',
			require: ['ngModel', '?^gumgaForm'],
			link: function link(scope, elm, attrs, controllers) {
				if (attrs.type != 'date') throw 'Esta diretiva suporta apenas inputs do tipo date';
				if (!attrs.gumgaMinDate) throw "O valor da diretiva gumga-min-date não foi informado.";

				var ngModelController = controllers[0],
				    gumgaFormController = controllers[1],
				    error = 'mindate',
				    format = 'yyyy-MM-dd',
				    name = attrs.name,
				    field = attrs.field,
				    limitValue = attrs.gumgaMinDate;

				function validateMinDate(inputValue) {
					if (inputValue) {
						var input = $filter('date')(inputValue, format),
						    min = $filter('date')(limitValue, format),
						    isValid = input >= min;
						ngModelController.$setValidity(error, isValid);
						gumgaFormController.changeStateOfInput(name, error, isValid, limitValue, field);
					}
					return inputValue;
				};

				ngModelController.$parsers.unshift(validateMinDate);
				ngModelController.$formatters.push(validateMinDate);

				attrs.$observe('gumgaMinDate', function () {
					validateMinDate(ngModelController.$viewValue);
				});
			}
		};
	}
	angular.module('gumga.form.min.date', []).directive('gumgaMinDate', MinDate);
})();

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function () {
  'use strict';

  MinLength.$inject = [];
  function MinLength() {
    return {
      restrict: 'A',
      require: ['ngModel', '?^gumgaForm'],
      link: function link(scope, elm, attrs, controllers) {
        if (!attrs.gumgaMinLength) throw "O valor da diretiva gumga-min-length não foi informado.";
        var ngModelController = controllers[0],
            gumgaFormController = controllers[1],
            error = 'minlength',
            name = attrs.name,
            field = attrs.field,
            limitValue = parseInt(attrs.gumgaMinLength);

        function validateMinLength(inputValue) {
          if (inputValue) {
            var isValid = inputValue.length >= limitValue;
            ngModelController.$setValidity(error, isValid);
            gumgaFormController.changeStateOfInput(name, error, isValid, limitValue, field);
          }
          return inputValue;
        };

        ngModelController.$parsers.unshift(validateMinLength);
        ngModelController.$formatters.push(validateMinLength);
        attrs.$observe('gumgaMinLength', function (x) {
          return validateMinLength(ngModelController.$viewValue);
        });
      }
    };
  }
  angular.module('gumga.form.min.length', []).directive('gumgaMinLength', MinLength);
})();

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function () {
	'use strict';

	MinNumber.$inject = [];

	function MinNumber() {
		return {
			restrict: 'A',
			require: ['ngModel', '?^gumgaForm'],
			link: function link(scope, elm, attrs, controllers) {
				if (attrs.type != 'number') throw 'Esta diretiva suporta apenas inputs do tipo number';
				if (!attrs.gumgaMinNumber) throw "O valor da diretiva gumga-min-number não foi informado.";
				var ngModelController = controllers[0],
				    gumgaFormController = controllers[1],
				    error = 'minnumber',
				    name = attrs.name,
				    field = attrs.field,
				    limitValue = parseInt(attrs.gumgaMinNumber);

				elm.attr('min', limitValue);

				function validateMinNumber(inputValue) {
					if (inputValue) {
						var isValid = parseFloat(inputValue) >= limitValue;
						ngModelController.$setValidity(error, isValid);
						gumgaFormController.changeStateOfInput(name, error, isValid, limitValue, field);
					}
					return inputValue;
				}

				ngModelController.$parsers.unshift(validateMinNumber);
				ngModelController.$formatters.push(validateMinNumber);
				attrs.$observe('gumgaMinNumber', function (x) {
					return validateMinNumber(ngModelController.$viewValue);
				});
			}
		};
	}
	angular.module('gumga.form.min.number', []).directive('gumgaMinNumber', MinNumber);
})();

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

(function () {
	'use strict';

	ModelError.$inject = ['$compile'];

	function ModelError($compile) {
		return {
			restrict: 'A',
			scope: false,
			require: '^?gumgaForm',
			link: function link(scope, elm, attrs, gumgaCtrl) {
				// console.log(gumgaCtrl);

				if (!attrs.gumgaModelError) {
					throw "gumgaModelError precisa de um objeto de configuração, veja na  <a target=\"_blank\" href=\"http://gumga.github.io\">documentação</a>";
				}

				var configuration = scope[attrs.gumgaModelError];

				if (!configuration.hasOwnProperty('ngModel')) {
					throw "O Objeto de configuração precisa ter o atributo ngModel, veja na  <a target=\"_blank\" href=\"http://gumga.github.io\">documentação</a>";
				}

				if (!configuration.hasOwnProperty('options')) {
					throw "O Objeto de configuração precisa ter o atributo options, veja na  <a target=\"_blank\" href=\"http://gumga.github.io\">documentação</a>";
				}

				//VALIDA QUANDO O TYPE FOR OBJETO
				var validateObject = function validateObject(value, config) {
					if (!config.hasOwnProperty('empty')) {
						validateEmpty(value, config.empty, 'empty');
					}
					if (config.hasOwnProperty('fields')) {
						validateFields(value, config.fields);
					}
					if (config) {
						validateIsObject(value, config, 'type');
					}
				};

				scope.$on('$destroy', function () {
					gumgaCtrl.deleteErrosByInputName(configuration.ngModel);
				});

				//VALIDA QUANDO O TYPE FOR ARRAY
				var validateArray = function validateArray(value, config) {
					validateEmpty(value, config.empty, 'empty');

					if (config.hasOwnProperty('min') && value) {
						validateMin(value.length, config.min, 'min');
					}

					if (config.hasOwnProperty('max') && value) {
						validateMax(value.length, config.max, 'max');
					}

					if (config) {
						validateIsArray(value, config, 'type');
					}

					if (config && config.childs) {
						validateChilds(value, config.childs);
					}
				};

				var validateChilds = function validateChilds(value, childs) {
					childs.forEach(function (child) {
						if (value) validateModel(value[child.position], child);
					});
				};

				var validateFields = function validateFields(value, fields) {
					fields.forEach(function (field) {
						var fieldValue = value ? value[field.name] : null;
						if (field.empty && _typeof(field.empty) == 'object') {
							validateEmpty(fieldValue, field.empty, field.name + '-empty');
						}
						if (field.equal && _typeof(field.equal) == 'object') {
							validateEqual(fieldValue, field.equal, field.name + '-equal');
						}
						if (field.contains && _typeof(field.contains) == 'object') {
							validateContains(fieldValue, field.contains, field.name + '-contains');
						}
						if (field.max && _typeof(field.max) == 'object') {
							validateMax(fieldValue, field.max, field.name + '-max');
						}
						if (field.min && _typeof(field.min) == 'object') {
							validateMin(fieldValue, field.min, field.name + '-min');
						}
						if (field.regex && _typeof(field.regex) == 'object') {
							validateRegex(fieldValue, field.regex, field.name + '-regex');
						}
					});
				};

				//CRIA ERRO SE FOR VAZIO
				var validateEmpty = function validateEmpty(value, config, key) {
					var isvalid = !((value == undefined || value == '' || value.length == 0) && !config.value);
					if (config && config.message) gumgaCtrl.updateFormErrors(configuration.ngModel, key, isvalid, config.message);
				};

				//CRIA ERRO SE O VALOR NAO FOR IGUAL AO ESPERADO
				var validateEqual = function validateEqual(value, config, key) {
					var isvalid = value == config.value;
					if (config && config.message) gumgaCtrl.updateFormErrors(configuration.ngModel, key, isvalid, config.message);
				};

				//CRIA ERRO SE O VALOR NAO CONTER AO ESPERADO
				var validateContains = function validateContains(value, config, key) {
					var isvalid = value && value.indexOf(config.value) != -1;
					if (config && config.message) {
						gumgaCtrl.updateFormErrors(configuration.ngModel, key, isvalid, config.message);
					}
				};

				var validateRegex = function validateRegex(value, config, key) {
					var isvalid = RegExp(config.value).test(value);
					gumgaCtrl.updateFormErrors(configuration.ngModel, key, isvalid, config.message);
				};

				//CRIA ERRO SE O TIPO NÃO FOR OBJETO =
				var validateIsObject = function validateIsObject(value, config, key) {
					var isvalid = !(value !== Object(value));
					if (config && config.message) gumgaCtrl.updateFormErrors(configuration.ngModel, key, isvalid, config.message);
				};

				var validateIsArray = function validateIsArray(value, config, key) {
					var isvalid = Array.isArray(value);
					if (config && config.message) gumgaCtrl.updateFormErrors(configuration.ngModel, 'type', isvalid, config.message);
				};

				var validateMin = function validateMin(value, config, key) {
					var isvalid = !(value < config.value);
					if (config && config.message) gumgaCtrl.updateFormErrors(configuration.ngModel, key, isvalid, config.message);
				};

				var validateMax = function validateMax(value, config, key) {
					var isvalid = !(value > config.value);
					gumgaCtrl.updateFormErrors(configuration.ngModel, key, isvalid, config.message);
				};

				var validateModel = function validateModel(value, config) {
					switch (config.type.toLowerCase().trim()) {
						case 'object':
							validateObject(value, config);
							break;
						case 'array':
							validateArray(value, config);
							break;
					}
				};

				scope.$watch(configuration.ngModel, function (value) {
					validateModel(value, configuration.options);
					scope.$broadcast('form-changed');
				}, true);
			}
		};
	}
	angular.module('gumga.form.modelerror', []).directive('gumgaModelError', ModelError);
})();

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Provider = function Provider() {

  var GumgaModelInstance = function GumgaModelInstance(scope, model, formElement) {
    var _this = this;

    var conditions = [];

    this.condition = function (_condition, _message) {
      conditions.push({
        condition: _condition,
        message: _message,
        evals: {}
      });
      return _this;
    };

    var getFormCtrl = function getFormCtrl() {
      if (!window.gumgaForms) return;
      var forms = gumgaForms.filter(function (form) {
        return angular.element(form.element)[0] === angular.element(formElement)[0];
      });
      if (forms && forms[0]) return forms[0].scope;
    };

    var analyze = function analyze(value, indexValue) {
      conditions.forEach(function (condition) {
        condition.evals[indexValue] = false;
        if (!condition.condition.startsWith(model)) {
          condition.evals[indexValue] = scope.$eval(condition.condition, value);
        } else {
          condition.evals[indexValue] = scope.$eval(condition.condition);
        }
      });

      conditions.forEach(function (condition) {
        var error = Object.keys(condition.evals).map(function (key) {
          return condition.evals[key];
        }).filter(function (evalResult) {
          return evalResult;
        }).length > 0;

        var formScope = getFormCtrl();

        if (!formScope) {
          throw "Não identificamos o seu gumga-form.";
        }

        formScope.updateFormErrors(condition.condition, 'gumgamodel', !error, condition.message);
        formScope.updateErrorsModel();
      });
    };

    this.analyzeConditions = function (value) {
      if (angular.isArray(value)) {
        value.forEach(function (item, index) {
          analyze(item, index);
        });
      } else {
        analyze(value);
      }
      return _this;
    };

    this.removeAllConditions = function () {
      return conditions = [];
    };
  };

  var $watch = function $watch(scope, model, elm) {
    if (!scope || !model) {
      console.error("Para usar o watch do gumga model é necessário passar o scope e o nome da variavél a ser observada.");
      return;
    }
    if (!scope.$watch || !scope.hasOwnProperty('$id')) {
      console.error("Verifique se você passou um objecto do tipo scope no primeiro parâmetro.");
      return;
    }
    var form = angular.element(elm)[0] || angular.element('form[gumga-form]')[0];
    var gumgaModelInstance = new GumgaModelInstance(scope, model, form);
    scope.$watch(model, function (value) {
      return gumgaModelInstance.analyzeConditions(value);
    }, true);
    return gumgaModelInstance;
  };

  return {
    $get: function $get() {
      return {
        $watch: $watch
      };
    }
  };
};

Provider.$inject = [];

angular.module('gumga.form.modelerror.provider', []).provider('$gumgaModel', Provider);

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function () {
	'use strict';

	Pattern.$inject = [];
	function Pattern() {
		return {
			restrict: 'A',
			require: ['ngModel', '?^gumgaForm'],
			link: function link(scope, elm, attrs, controllers) {
				if (!attrs.gumgaPattern) throw "O valor da diretiva gumga-pattern não foi informado.";
				var ngModelController = controllers[0],
				    gumgaFormController = controllers[1],
				    error = 'pattern',
				    name = attrs.name,
				    field = attrs.field,
				    regex = new RegExp('^' + attrs.gumgaPattern + '$');

				function validatePattern(inputValue) {
					if (inputValue) {
						var isValid = regex.test(inputValue);
						ngModelController.$setValidity(error, isValid);
						gumgaFormController.changeStateOfInput(name, error, isValid, attrs.gumgaPattern, field);
					}
					return inputValue;
				};

				ngModelController.$parsers.unshift(validatePattern);
				ngModelController.$formatters.push(validatePattern);
				attrs.$observe('gumgaPattern', function (x) {
					return validatePattern(ngModelController.$viewValue);
				});
			}
		};
	}
	angular.module('gumga.form.pattern', []).directive('gumgaPattern', Pattern);
})();

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function () {
		'use strict';

		RangeDate.$inject = ['$filter'];
		function RangeDate($filter) {
				return {
						restrict: 'A',
						require: ['ngModel', '^?gumgaForm'],
						link: function link(scope, elm, attrs, controllers) {
								if (attrs.type != 'date') throw 'Esta diretiva suporta apenas inputs do tipo date';
								if (!attrs.gumgaRangeDate) throw "O valor da diretiva gumga-range-date não foi informado.";

								var error = 'rangedate',
								    field = attrs.field,
								    name = attrs.name,
								    format = 'yyyy-MM-dd',
								    ngModelController = controllers[0],
								    gumgaFormController = controllers[1],
								    range = scope.$eval(attrs.gumgaRangeDate),
								    min = $filter('date')(range.min, format),
								    max = $filter('date')(range.max, format);

								function validateRangeDate(inputValue) {
										if (inputValue) {
												var input = $filter('date')(inputValue, format),
												    isValid = input >= min && input <= max;
												ngModelController.$setValidity(error, isValid);
												gumgaFormController.changeStateOfInput(name, error, isValid, attrs.gumgaRangeDate, field);
										}

										return inputValue;
								};

								ngModelController.$parsers.unshift(validateRangeDate);
								ngModelController.$formatters.push(validateRangeDate);
								attrs.$observe('gumgaRangeDate', function (x) {
										return validateRangeDate(ngModelController.$viewValue);
								});
						}
				};
		}
		angular.module('gumga.form.range.date', []).directive('gumgaRangeDate', RangeDate);
})();

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function () {
	'use strict';

	RangeNumber.$inject = [];
	function RangeNumber() {
		return {
			restrict: 'A',
			require: ['ngModel', '^?gumgaForm'],
			link: function link(scope, elm, attrs, controllers) {
				if (attrs.type != 'number') throw 'Esta diretiva suporta apenas inputs do tipo number';
				if (!attrs.gumgaRangeNumber) throw "O valor da diretiva gumga-range-number não foi informado.";
				var error = 'rangenumber',
				    ngModel = controllers[0],
				    gumgaForm = controllers[1],
				    range = scope.$eval(attrs.gumgaRangeNumber),
				    field = attrs.field,
				    name = attrs.name;

				function validateRangeNumber(inputValue) {
					if (inputValue) {
						var input = parseInt(inputValue),
						    isValid = input >= range.min && input <= range.max;
						ngModel.$setValidity(error, isValid);
						gumgaForm.changeStateOfInput(name, error, isValid, attrs.gumgaRangeNumber, field);
					}
					return inputValue;
				};

				ngModel.$parsers.unshift(validateRangeNumber);
				ngModel.$formatters.push(validateRangeNumber);
				attrs.$observe('gumgaRangeNumber', function (x) {
					return validateRangeNumber(ngModel.$viewValue);
				});
			}
		};
	}
	angular.module('gumga.form.range.number', []).directive('gumgaRangeNumber', RangeNumber);
})();

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function () {
  'use strict';

  Required.$inject = ['$interpolate'];
  function Required($interpolate) {
    return {
      restrict: 'A',
      require: ['ngModel', '^?gumgaForm'],
      link: function link(scope, elm, attrs, controllers) {
        var error = 'required',
            name = attrs.name,
            field = attrs.field,
            ngModel = controllers[0],
            gumgaForm = controllers[1];

        scope.$on('$destroy', function () {
          validateRequired(true);
        });

        function validateRequired(inputValue) {
          var isValid = inputValue != NaN && inputValue != undefined && inputValue != null && inputValue !== '';

          gumgaForm.changeStateOfInput(name, error, isValid, null, field);
          ngModel.$setValidity(error, isValid);
          return inputValue;
        };

        ngModel.$parsers.unshift(validateRequired);
        ngModel.$formatters.push(validateRequired);
        attrs.$observe('gumgaRequired', function (x) {
          return validateRequired(ngModel.$viewValue);
        });
        validateRequired(ngModel.$viewValue);
      }
    };
  }
  angular.module('gumga.form.required', []).directive('gumgaRequired', Required);
})();

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function () {
  'use strict';

  ValidateType.$inject = [];

  function ValidateType() {
    return {
      restrict: 'A',
      require: ['ngModel', '?^gumgaForm'],
      link: function link(scope, elm, attrs, controllers) {
        var type = void 0,
            error = 'validatetype',
            ngModel = controllers[0],
            gumgaForm = controllers[1],
            field = attrs.field,
            name = attrs.name;

        switch (attrs.type) {
          case 'date':
            type = 'data';break;
          case 'datetime-local':
            type = 'data e hora';break;
          case 'time':
            type = 'hora';break;
          case 'week':
            type = 'semana';break;
          case 'cpf':
            type = 'CPF';break;
          case 'month':
            type = 'mês';break;
          case 'number':
            type = 'número';break;
          case 'url':
            type = 'URL';break;
          case 'email':
            type = 'e-mail';break;
          default:
            type = 'unknown';
        }
        if (type == 'unknown') throw 'Esta diretiva suporta apenas inputs dos tipos date, datetime-local, time, week, month, number, url, cpf e email.';

        function validateType(inputValue) {
          if (type == 'CPF' && inputValue) {
            var isValid = window.GumgaCPF.isValid(inputValue);
            ngModel.$setValidity(error, isValid);
            gumgaForm.changeStateOfInput(name, error, isValid, type, field, 'Por favor, informe um CPF v\xE1lido.');
            return inputValue;
          }
          if (inputValue) {
            var _isValid = elm[0].validity.valid;
            ngModel.$setValidity(error, _isValid);
            gumgaForm.changeStateOfInput(name, error, _isValid, type, field);
          }
          return inputValue;
        };

        ngModel.$parsers.unshift(validateType);
        ngModel.$formatters.push(validateType);
        attrs.$observe('gumgaValidateType', function (x) {
          return validateType(ngModel.$viewValue);
        });
      }
    };
  }
  angular.module('gumga.form.validate.type', []).directive('gumgaValidateType', ValidateType);
})();

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function () {
  'use strict';

  __webpack_require__(3);
  __webpack_require__(2);
  __webpack_require__(1);
  __webpack_require__(0);
  __webpack_require__(4);
  __webpack_require__(5);
  __webpack_require__(6);
  __webpack_require__(7);
  __webpack_require__(8);
  __webpack_require__(9);
  __webpack_require__(12);
  __webpack_require__(13);
  __webpack_require__(14);
  __webpack_require__(15);
  __webpack_require__(16);
  __webpack_require__(10);
  __webpack_require__(11);

  angular.module('gumga.form', ['gumga.form.form', 'gumga.form.class', 'gumga.form.errors', 'gumga.form.error', 'gumga.form.max.date', 'gumga.form.max.length', 'gumga.form.max.number', 'gumga.form.min.date', 'gumga.form.min.length', 'gumga.form.min.number', 'gumga.form.pattern', 'gumga.form.range.date', 'gumga.form.range.number', 'gumga.form.required', 'gumga.form.validate.type', 'gumga.form.modelerror', 'gumga.form.modelerror.provider']);
})();

/*!
*	Gerador e Validador de CPF v1.0.0
*	https://github.com/tiagoporto/gerador-validador-cpf
*	Copyright (c) 2014-2015 Tiago Porto (http://www.tiagoporto.com)
*	Released under the MIT license
*/
function CPF() {
  "user_strict";
  function r(r) {
    for (var t = null, n = 0; 9 > n; ++n) {
      t += r.toString().charAt(n) * (10 - n);
    }var i = t % 11;return i = 2 > i ? 0 : 11 - i;
  }function t(r) {
    for (var t = null, n = 0; 10 > n; ++n) {
      t += r.toString().charAt(n) * (11 - n);
    }var i = t % 11;return i = 2 > i ? 0 : 11 - i;
  }var n = false,
      i = true;this.generate = function () {
    for (var n = "", i = 0; 9 > i; ++i) {
      n += Math.floor(9 * Math.random()) + "";
    }var o = r(n),
        a = n + "-" + o + t(n + "" + o);return a;
  }, this.isValid = function (o) {
    for (var a = o.replace(/\D/g, ""), u = a.substring(0, 9), f = a.substring(9, 11), v = 0; 10 > v; v++) {
      if ("" + u + f == "" + v + v + v + v + v + v + v + v + v + v + v) return n;
    }var c = r(u),
        e = t(u + "" + c);return f.toString() === c.toString() + e.toString() ? i : n;
  };
}
window.GumgaCPF = new CPF();

/***/ })
/******/ ]);