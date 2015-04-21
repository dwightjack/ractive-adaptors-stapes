/*! ractive-adaptors-stapes - v0.0.1 - 2015-04-21
* Copyright (c) 2015 ; Licensed MIT */
(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['stapes-ui', 'ractive'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('stapes-ui'), require('ractive') || {});
    } else {
        // Browser globals (root is window)
        factory(global.Stapes.Ui, global.Ractive);
    }
}(this, function (Ui, Ractive) {

    Ui.Module.prototype.render = function () {
        var _this = this;

        this._view = new Ractive({
            el: this.el,
            //silently fail
            template: this.options.template || '',
            data: {
                data: _this
            },
            adapt: ['Stapes']
        });
        return this;
    };

    Ui.Module.prototype.destroy = function () {
        this._view.teardown();
    };

}));
