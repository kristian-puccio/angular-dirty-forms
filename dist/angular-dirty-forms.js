(function () {
  'use strict';
  // Setup the angular app and load in any dependencies
  angular.module('angular-dirty-forms').factory('AlertFactory', AlertFactory).controller('AlertCtrl', AlertCtrl).directive('formGroup', formGroup).directive('controlGroup', controlGroup).directive('checkError', checkError).directive('checkCustomError', checkCustomError).directive('veryDirty', veryDirty).directive('number', numberValilidate).directive('notZero', notZero);
  ;
  // TODO: add timeout to remove non danger...
  function AlertFactory($timeout) {
    // types:  success, info, warning, or danger
    var alerts = [];
    return {
      alerts: alerts,
      removeAlert: function (index) {
        alerts.splice(index, 1);
      },
      removeAlerts: function () {
        alerts.splice(0, alerts.length);
      },
      addAlert: function (msg, type) {
        alerts.push({
          type: type,
          msg: msg
        });
        $timeout(function () {
          $timeout(function () {
            scrollInto('alerts');
          }, 0);
        }, 0);
      },
      replaceAlerts: function (msg, type) {
        alerts.splice(0, alerts.length);
        this.addAlert(msg, type);
      }
    };
  }
  ;
  function AlertCtrl($scope, AlertFactory) {
    $scope.alerts = AlertFactory.alerts;
    $scope.closeAlert = function (index) {
      AlertFactory.removeAlert(index);
    };
  }
  ;
  function formGroup() {
    return {
      templateUrl: 'templates/form-group.html',
      replace: true,
      require: '^form',
      transclude: true,
      scope: {
        label: '@',
        isVertical: '@'
      },
      link: function (scope, element, attrs, formController) {
        var unbind;
        // The <label> should have a `for` attribute that links it to the input.
        // Get the `id` attribute from the input element
        // and add it to the scope so our template can access it.
        var id = element.find(':input').attr('id');
        scope.for = id;
        // Get the `name` attribute of the input
        var inputName = element.find(':input').attr('name');
        unbind = scope.$watch(function () {
          return formController.veryDirty;
        }, function (isDirty) {
          if (!isDirty) {
            scope.isError = false;
            return;
          }
          unbind();
          scope.$watch(function () {
            return formController[inputName]['$invalid'];
          }, function (valid) {
            scope.isError = valid;
          });
        });
      }
    };
  }
  ;
  // Extra stuff for bootstrap forms
  function controlGroup() {
    return {
      templateUrl: 'template/form/control-group.html',
      replace: true,
      require: '^form',
      transclude: true,
      scope: {
        label: '@',
        isVertical: '@'
      },
      link: function (scope, element, attrs, formController) {
        var unbind;
        // The <label> should have a `for` attribute that links it to the input.
        // Get the `id` attribute from the input element
        // and add it to the scope so our template can access it.
        var id = element.find(':input').attr('id');
        scope.for = id;
        // Get the `name` attribute of the input
        var inputName = element.find(':input').attr('name');
        unbind = scope.$watch(function () {
          return formController.veryDirty;
        }, function (isDirty) {
          if (!isDirty) {
            scope.isError = false;
            return;
          }
          unbind();
          scope.$watch(function () {
            return formController[inputName]['$invalid'];
          }, function (valid) {
            scope.isError = valid;
          });
        });
      }
    };
  }
  ;
  function checkError() {
    return {
      template: '<span ng-show="showError" class="help-block" ng-transclude></span>',
      replace: true,
      require: '^form',
      transclude: true,
      scope: {
        msg: '@',
        field: '@'
      },
      link: function (scope, element, attrs, formController) {
        var unbind;
        scope.showError = false;
        console.log(scope.field, '<<< field');
        console.log(formController, '<<<< FC');
        // Does the field exists in the form?
        if (formController[scope.field]) {
          unbind = scope.$watch(function () {
            return formController.veryDirty;
          }, function (isDirty) {
            if (isDirty) {
              unbind();
              scope.$watch(function () {
                return formController[scope.field].$error[attrs['checkError']];
              }, function (showError) {
                scope.showError = showError;
              });
            }
          });
        } else {
          console.warn('Can\'t find field: ' + scope.field);
        }
      }
    };
  }
  ;
  function checkCustomError() {
    return {
      template: '<div check-error="email" field="{{field}}">Custom Error!!!</div>',
      link: function (scope, element, attrs, formController) {
        scope.field = 'email';  // var unbind;
                                // scope.showError = false;
                                // // Does the field exists in the form?
                                // if (formController[scope.field]) {
                                //     unbind = scope.$watch(
                                //         function() {
                                //             return formController.veryDirty;
                                //         }, function(isDirty) {
                                //             if (isDirty) {
                                //                 unbind();
                                //                 scope.$watch(
                                //                     function() {
                                //                         return formController[scope.field].$error[attrs["checkError"]];
                                //                     }, function(showError) {
                                //                         scope.showError = showError;
                                //                     }
                                //                 );
                                //             }
                                //         }
                                //     );
                                // } else {
                                //     console.warn("Can't find field: " + scope.field);
                                // }
      }
    };
  }
  ;
  function veryDirty() {
    return {
      restrict: 'A',
      require: '^form',
      link: function (scope, element, attrs, parentFormCtrl) {
        parentFormCtrl.veryDirty = false;
        parentFormCtrl.setVeryDirty = function () {
          parentFormCtrl.veryDirty = true;
        };
      }
    };
  }
  ;
  //find element with the give id of name and scroll to the first element it finds
  function scrollInto(idOrName) {
    if (!idOrName) {
      $window.scrollTo(0, 0);
    }
    //check if an element can be found with id attribute
    var el = document.getElementById(idOrName);
    if (!el) {
      //check if an element can be found with name attribute if there is no such id
      el = document.getElementsByName(idOrName);
      if (el && el.length) {
        el = el[0];
      } else {
        el = null;
      }
    }
    // if an element is found, scroll to the element
    if (el) {
      el.scrollIntoView();
    }  //otherwise, ignore
  }
  ;
  function notZero() {
    return {
      require: '?ngModel',
      link: function (scope, elm, attrs, ngModelCtrl) {
        function validateZero(myValue) {
          ngModelCtrl.$setValidity('iszero', !(myValue == 0));
          return myValue;
        }
        ngModelCtrl.$parsers.push(validateZero);
        ngModelCtrl.$formatters.push(validateZero);
      }
    };  // return
  }
  ;
  function numberValilidate() {
    function isNumber(n) {
      var v = parseFloat(n);
      return v == n;
    }
    return {
      require: '?ngModel',
      link: function (scope, elm, attrs, ngModelCtrl) {
        function validateNumber(myValue) {
          var isValid = isNumber(myValue);
          ngModelCtrl.$setValidity('number', isValid);
          if (isValid) {
            return parseFloat(myValue);
          }
          return myValue;
        }
        ngModelCtrl.$parsers.push(validateNumber);
        ngModelCtrl.$formatters.push(validateNumber);
      }
    };  // return
  }
  ;
}());
angular.module('angular-dirty-forms').run([
  '$templateCache',
  function ($templateCache) {
    $templateCache.put('templates/form-group.html', '\n    <div class="form-group" ng-class="{&apos;has-error&apos;: isError}">\n        <label for="{{for}}" ng-class="{&apos;col-sm-2&apos;:!isVertical, &apos;control-label&apos;:!isVertical}">{{label}}</label>\n        <div ng-class="{&apos;col-sm-10&apos;: !isVertical}" ng-transclude=""></div>\n    </div>\n');
    $templateCache.put('templates/control-group.html', '\n    <div class="control-group" ng-class="{&apos;error&apos;: isError}">\n        <label class="control-label" ng-if="label">{{label}}</label>\n        <div class="controls">\n            <div ng-transclude=""></div>\n        </div>\n    </div>\n');
    $templateCache.put('templates/alerts.html', '\n    <div ng-controller="AlertCtrl" id="alerts">\n        <alert ng-repeat="alert in alerts" type="{{alert.type}}" close="closeAlert($index)">\n            {{alert.msg}}\n        </alert>\n    </div>\n');
  }
]);
//# sourceMappingURL=angular-dirty-forms.js.map