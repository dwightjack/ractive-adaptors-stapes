/*! ractive-adaptors-stapes - v0.0.1 - 2015-04-21
* Copyright (c) 2015 ; Licensed MIT */
(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['stapes', 'ractive'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('stapes'), require('ractive') || {});
    } else {
        // Browser globals (root is window)
        factory(global.Stapes, global.Ractive);
    }
}(this, function (Stapes, Ractive) {

    'use strict';

    var lockProperty = '_ractiveAdaptorsStapesLock',
        adaptor;

    function acquireLock(key) {
        key[lockProperty] = (key[lockProperty] || 0) + 1;
        return function release() {
            key[lockProperty] -= 1;
            if (!key[lockProperty]) {
                delete key[lockProperty];
            }
        };
    }

    function isLocked(key) {
        return !!key[lockProperty];
    }

    adaptor = {

        Stapes: Stapes,

        filter: function filter(object) {
            if (!adaptor.Stapes) {
                throw new Error('Could not find Stapes. You must call adaptor.init(Stapes)');
            }
            return object instanceof Stapes._.Module;
        },

        wrap: function wrap(ractive, inst, keypath, prefixer) {

            var stapesInst = inst;

            function instanceChangeHandler(values) {
                var release = acquireLock(stapesInst),
                    updateObj = {};

                updateObj[values.key] = values.newValue;
                ractive.set(prefixer(updateObj));
                release();
            }

            stapesInst.on('mutate', instanceChangeHandler);

            return {
                teardown: function teardown() {
                    stapesInst.off('mutate', instanceChangeHandler);
                },
                get: function get() {
                    return stapesInst.getAll();
                },
                set: function set(keypath, value) {
                    // Only set if the model didn't originate the change itself, and
                    // only if it's an immediate child property
                    if (!isLocked(stapesInst) && keypath.indexOf('.') === -1) {
                        stapesInst.set(keypath, value);
                    }
                },
                reset: function reset(object) {
                    // If the new object is a Backbone model, assume this one is
                    // being retired. Ditto if it's not a model at all
                    if (object instanceof Stapes._.Module || !(object instanceof Object)) {
                        return false;
                    }

                    // Otherwise if this is a POJO, reset the model
                    stapesInst.set(object);
                }
            };
        }
    };

    Ractive.adaptors.Stapes = adaptor;

}));
