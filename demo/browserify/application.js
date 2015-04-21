var Stapes = require('stapes');
var Ractive = require('ractive');

require('../../dist/ractive-adaptors-stapes.browser');

var model = new (Stapes.subclass({}))();

model.set({
    name: 'John',
    surname: 'Doe'
});

var view = new Ractive({
    el: document.getElementById('container1'),
    //uses https://www.npmjs.com/package/ractivate
    template: require('./template.html'),
    data: {
        user: model
    },
    adapt: ['Stapes']
});