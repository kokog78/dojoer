var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('app',["require", "exports", "aurelia-framework", "aurelia-fetch-client"], function (require, exports, aurelia_framework_1, aurelia_fetch_client_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var App = (function () {
        function App() {
            this.maxValue = 0;
            this.client = new aurelia_fetch_client_1.HttpClient();
        }
        Object.defineProperty(App.prototype, "isNormalUser", {
            get: function () {
                return this.name && this.name !== 'admin';
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(App.prototype, "isAdminUser", {
            get: function () {
                return this.name === 'admin';
            },
            enumerable: true,
            configurable: true
        });
        App.prototype.attached = function () {
            this.getMaxValue();
            this.reload();
        };
        App.prototype.increment = function () {
            var _this = this;
            this.client.fetch("/api/counters/" + this.name, {
                method: 'put'
            }).then(function (response) { return _this.reload(); });
        };
        App.prototype.decrement = function () {
            var _this = this;
            this.client.fetch("/api/counters/" + this.name, {
                method: 'delete'
            }).then(function (response) { return _this.reload(); });
        };
        App.prototype.setMaxValue = function () {
            var _this = this;
            this.client.fetch("/api/max-counter/" + (this.maxValue ? this.maxValue : 0), {
                method: 'post'
            }).then(function (response) { return _this.reload(); });
        };
        App.prototype.getMaxValue = function () {
            var _this = this;
            this.client.fetch('/api/max-counter', {
                method: 'get'
            })
                .then(function (response) { return response.json(); })
                .then(function (response) { return _this.maxValue = response; });
        };
        App.prototype.reload = function () {
            var _this = this;
            this.client.fetch('/api/counters', {
                method: 'get'
            })
                .then(function (response) { return response.json(); })
                .then(function (response) {
                _this.counters = response;
                var max = 0;
                for (var _i = 0, _a = _this.counters; _i < _a.length; _i++) {
                    var counter = _a[_i];
                    if (counter.value > max) {
                        max = counter.value;
                    }
                    if (counter.max > max) {
                        max = counter.max;
                    }
                    if (counter.max <= 0) {
                        counter.class = 'success';
                    }
                    else if (counter.value < counter.max) {
                        counter.class = 'danger';
                    }
                    else if (counter.value === counter.max) {
                        counter.class = 'success';
                    }
                    else if (counter.value > counter.max) {
                        counter.class = 'warning';
                    }
                }
                for (var _b = 0, _c = _this.counters; _b < _c.length; _b++) {
                    var counter = _c[_b];
                    counter.percent = 100.0 * counter.value / max;
                    counter.style = "width: " + counter.percent + "%";
                }
            });
        };
        App.prototype.clear = function () {
            var _this = this;
            this.client.fetch('/api/counters', {
                method: 'delete'
            }).then(function (response) { return _this.reload(); });
        };
        __decorate([
            aurelia_framework_1.computedFrom('name'),
            __metadata("design:type", Boolean),
            __metadata("design:paramtypes", [])
        ], App.prototype, "isNormalUser", null);
        __decorate([
            aurelia_framework_1.computedFrom('name'),
            __metadata("design:type", Boolean),
            __metadata("design:paramtypes", [])
        ], App.prototype, "isAdminUser", null);
        return App;
    }());
    exports.App = App;
});



define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});



define('main',["require", "exports", "./environment"], function (require, exports, environment_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .feature('resources');
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        if (environment_1.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }
        aurelia.start().then(function () { return aurelia.setRoot(); });
    }
    exports.configure = configure;
});



define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
    }
    exports.configure = configure;
});



define('text!app.html', ['module'], function(module) { module.exports = "<template><div class=\"panel panel-default\"><div class=\"panel-body\"><form class=\"form-inline\"><button class=\"btn btn-danger\" if.bind=\"isAdminUser\" click.trigger=\"clear()\">Clear</button> <button class=\"btn btn-primary\" click.trigger=\"reload()\">Reload</button><div class=\"form-group\"><div class=\"input-group\"><span class=\"input-group-addon\">Name</span> <input type=\"text\" id=\"name\" class=\"form-control\" placeholder=\"Your Name\" required autofocus value.bind=\"name\"></div></div><button class=\"btn btn-success\" if.bind=\"isNormalUser\" click.trigger=\"increment()\">Done</button> <button class=\"btn btn-warning\" if.bind=\"isNormalUser\" click.trigger=\"decrement()\">Oops</button><div class=\"form-group\" if.bind=\"isAdminUser\"><div class=\"input-group\"><span class=\"input-group-addon\">Max</span> <input type=\"number\" id=\"maxValue\" class=\"form-control\" value.bind=\"maxValue\" if.bind=\"isAdminUser\"> <span class=\"input-group-btn\"><button class=\"btn btn-warning\" click.trigger=\"setMaxValue()\">Set Max</button></span></div></div></form></div></div><div class=\"panel panel-default\"><div class=\"panel-body\"><table style=\"width:100%\" class=\"table table-ellipsis\"><tr repeat.for=\"counter of counters\" class=\"counter\"><td>${counter.key}</td><td><div class=\"progress\"><div class=\"progress-bar\" class.bind=\"'progress-bar-' + counter.class\" role=\"progressbar\" style.bind=\"counter.style\">${counter.value}</div></div></td></tr></table></div></div></template>"; });
//# sourceMappingURL=app-bundle.js.map