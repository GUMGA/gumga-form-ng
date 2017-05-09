(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

(function () {
	'use strict';

	Error.$inject = ['$compile'];

	function Error($compile) {
		return {
			restrict: 'A',
			scope: false,
			require: '^?gumgaForm',
			link: function link(scope, elm, attrs, gumgaCtrl) {
				scope['' + attrs.name.concat('errors')] = {};
				var nameOfInput = attrs.name,
				    translationField = attrs.translationField,
				    template = '<ol class="list-errors text-danger"><li ng-repeat="(key, value) in ' + nameOfInput.concat('errors') + '" ><label>{{ value }}</li></ol>',
				    err = scope['' + nameOfInput.concat('errors')];
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

},{}],2:[function(require,module,exports){
'use strict';

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
					scope.errors = flatObject(gumgaFormController.getFormErrors(), {}, 'main');
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

},{}],3:[function(require,module,exports){
'use strict';

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

},{}],4:[function(require,module,exports){
'use strict';

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
			controller: ['$scope', '$element', '$attrs', '$timeout', function ($scope, $element, $attrs, $timeout) {
				var ctrl = this;

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

				function changeStateOfInput(inputName, validationType, inputIsValid, value, field) {
					field = field || inputName;
					if (!inputName) throw 'É necessário passar um valor válido como primeiro parâmetro [changeStateOfInput(inputName, validationType, inputIsValid, value)]';
					if (!validationType) throw 'É necessário passar um valor válido como segundo parâmetro [changeStateOfInput(inputName, validationType, inputIsValid, value)]';
					if (inputIsValid !== true && inputIsValid !== false) throw 'É necessário passar um booleano como terceiro parâmetro [changeStateOfInput(inputName, validationType, inputIsValid, value)]';

					var custom = ctrl.customMessage[inputName] ? ctrl.customMessage[inputName] : {},
					    auxString = custom[validationType] ? custom[validationType] : defaultMessages[validationType],
					    message = auxString.replace('{0}', field).replace('{1}', validationType.indexOf('range') != -1 ? 'mínimo de ' + value[0] + ' e máximo de ' + value[1] : value),
					    objectSentToGumgaError = void 0;

					objectSentToGumgaError = !inputIsValid ? { message: message, validationType: validationType } : { validationType: validationType };
					this.updateFormErrors(inputName, validationType, inputIsValid, message);

					$scope.$broadcast('form-changed');

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

},{}],5:[function(require,module,exports){
'use strict';

(function () {
  'use strict';

  require('./form/form.js');
  require('./form-class/form-class.js');
  require('./errors/errors.js');
  require('./error/error.js');
  require('./max/date.js');
  require('./max/length.js');
  require('./max/number.js');
  require('./min/date.js');
  require('./min/length.js');
  require('./min/number.js');
  require('./pattern/pattern.js');
  require('./range/date.js');
  require('./range/number.js');
  require('./required/required.js');
  require('./validate/type.js');
  require('./model-error/model-error.js');

  angular.module('gumga.form', ['gumga.form.form', 'gumga.form.class', 'gumga.form.errors', 'gumga.form.error', 'gumga.form.max.date', 'gumga.form.max.length', 'gumga.form.max.number', 'gumga.form.min.date', 'gumga.form.min.length', 'gumga.form.min.number', 'gumga.form.pattern', 'gumga.form.range.date', 'gumga.form.range.number', 'gumga.form.required', 'gumga.form.validate.type', 'gumga.form.modelerror']);
})();

},{"./error/error.js":1,"./errors/errors.js":2,"./form-class/form-class.js":3,"./form/form.js":4,"./max/date.js":6,"./max/length.js":7,"./max/number.js":8,"./min/date.js":9,"./min/length.js":10,"./min/number.js":11,"./model-error/model-error.js":12,"./pattern/pattern.js":13,"./range/date.js":14,"./range/number.js":15,"./required/required.js":16,"./validate/type.js":17}],6:[function(require,module,exports){
'use strict';

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

},{}],7:[function(require,module,exports){
'use strict';

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

},{}],8:[function(require,module,exports){
'use strict';

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

				function validateMaxNumber(inputValue) {
					if (inputValue) {
						var isValid = parseInt(inputValue) <= limitValue;
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

},{}],9:[function(require,module,exports){
'use strict';

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

},{}],10:[function(require,module,exports){
'use strict';

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

},{}],11:[function(require,module,exports){
'use strict';

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

				function validateMinNumber(inputValue) {
					if (inputValue) {
						var isValid = parseInt(inputValue) >= limitValue;
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

},{}],12:[function(require,module,exports){
'use strict';

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

},{}],13:[function(require,module,exports){
'use strict';

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

},{}],14:[function(require,module,exports){
'use strict';

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

},{}],15:[function(require,module,exports){
'use strict';

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

},{}],16:[function(require,module,exports){
'use strict';

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
        (function () {
          var isValid = attrs.gumgaRequired.length == 0 ? !!(ngModel.$viewValue && ngModel.$viewValue.length > 0) : !!$interpolate(attrs.gumgaRequired)(scope);
          gumgaForm.changeStateOfInput(name, error, isValid, null, field);
          ngModel.$setValidity(error, isValid);
        })();

        function validateRequired(inputValue) {
          var isValid = attrs.gumgaRequired.length == 0 ? !!(inputValue && inputValue.length > 0) : !!$interpolate(attrs.gumgaRequired)(scope);
          gumgaForm.changeStateOfInput(name, error, isValid, null, field);
          ngModel.$setValidity(error, isValid);
          return inputValue;
        };

        ngModel.$parsers.unshift(validateRequired);
        ngModel.$formatters.push(validateRequired);
        attrs.$observe('gumgaRequired', function (x) {
          return validateRequired(ngModel.$viewValue);
        });
      }
    };
  }
  angular.module('gumga.form.required', []).directive('gumgaRequired', Required);
})();

},{}],17:[function(require,module,exports){
'use strict';

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
        if (type == 'unknown') throw 'Esta diretiva suporta apenas inputs dos tipos date, datetime-local, time, week, month, number, url e email.';

        function validateType(inputValue) {
          if (inputValue) {
            var isValid = elm[0].validity.valid;
            ngModel.$setValidity(error, isValid);
            gumgaForm.changeStateOfInput(name, error, isValid, type, field);
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

},{}]},{},[5]);
