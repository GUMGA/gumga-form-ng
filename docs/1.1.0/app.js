angular.module('app', ['gumga.form'])
  .controller('Ctrl', function ($http) {
    var ctrl = this;
    ctrl.entity = ctrl.entity || { name: "" };

    ctrl.validate = function(name){
      return {
        error: name.length < 5,
        message: "Informe um nome com mais de 5 letras"
      }
    }

  })
