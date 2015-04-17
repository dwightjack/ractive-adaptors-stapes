/*global describe, it, expect, jasmine, spyOn, loadFixtures, beforeEach */

describe('Adaptor Tests', function () {

    beforeEach(function () {
        //loadFixtures('core.html');
    });

    it('should attach a new adaptor to ractive', function () {

        expect(Ractive.adaptors.Stapes).toBeDefined();

    });

});