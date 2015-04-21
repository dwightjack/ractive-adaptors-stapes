/*global describe, it, expect, jasmine, spyOn, loadFixtures, beforeEach */

describe('Adaptor Tests', function () {

    var Model;

    beforeEach(function () {
        Model = Stapes.subclass({});
        Ractive.DEBUG = false;
        loadFixtures('fragment.html');
        document.getElementById('container1').innerHTML = '';
    });

    it('should attach a new adaptor to ractive', function () {

        expect(Ractive.adaptors.Stapes).toBeDefined();

    });

    it('should render Stapes data to Ractive instance', function () {

        var container1 = document.getElementById('container1');

        var model = new Model();

        model.set({
            name: 'John',
            surname: 'Doe'
        });

        var view = new Ractive({
            el: container1,
            data: {
                user: model
            },
            template: '#container1-tmpl',
            adapt: ['Stapes']
        });

        expect(container1.innerHTML.trim()).toBe('John Doe');


        model.set({
            name: 'Jane'
        });

        expect(container1.innerHTML.trim()).toBe('Jane Doe');

    });


    it('should enhance Stapes UI with custom render method', function () {
        var module = new Stapes.Ui.Module({
            $el: jQuery('#container1'),
            template: '#stapes-ui-container1-tmpl',
            data: {
               name: 'Steve',
               surname: 'Doe'
            }
        }).render();

        expect(jQuery('#container1').html().trim()).toBe('Steve Doe');
    });

});