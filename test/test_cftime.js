'use strict';

var cftime = require('../cftime.js');

var chai = require('chai');
chai.use(require('chai-datetime'));
var expect = chai.expect;

describe('cftime', function() {
    var t = new cftime.cftime('days', new Date('1950-01-01T08:00:00.000Z'));

    it('Should return a new cftime object', function() {
        var t = new cftime.cftime('days', new Date('1950-01-01T08:00:00.000Z'));
        expect(t).to.exist;
    });

    it('Should have setMaxTimeByIndex', function() {
        expect(t.setMaxTimeByIndex).to.exist;
    });
    describe('setMaxTimeByIndex()', function() {
        it('Should return Jan 31, 1950', function() {
            var t2 = t.setMaxTimeByIndex(30);
            expect(t2).to.equalDate(new Date('1950-01-31T08:00:00.000Z'));
        });
    });

    it('Should have toDate', function() {
        expect(t.toDate).to.exist;
    });
    describe('toDate()', function() {
        it('Should return Jan 31, 1950', function() {
            var t2 = t.toDate(20);
            expect(t2).to.equalDate(new Date('1950-01-21T08:00:00.000Z'));
        });
    });
    describe('toDate()', function() {
        it('Should return undefined', function() {
            var t2 = t.toDate(40);
            expect(t2).to.be.undefined;
        });
    });

    it('Should have toIndex', function() {
        expect(t.toIndex).to.exist;
    });
    describe('toIndex()', function() {
        it('Should return 15', function() {
            var index = t.toIndex(new Date('1950-01-16T08:00:00.000Z'));
            expect(index).to.equal(15);
        });
    });
    describe('toIndex()', function() {
        it('Should return undefined', function() {
            var index = t.toIndex(new Date('1950-02-16T08:00:00.000Z'));
            expect(index).to.be.undefined;
        });
    });

    describe('parseDate', function() {

        it('Should exist', function() {
            expect(cftime.parseDate).to.exist;
        });

        it('Should parse 2000', function() {
            var cfd = cftime.parseDate('2000');
            expect(cfd.year).to.equal(2000);
        });

        it('Should parse 2000-05', function() {
            var cfd = cftime.parseDate('2000-05');
            expect(cfd.year).to.equal(2000);
            expect(cfd.month).to.equal(4);
        });

        it('Should parse 2000-05-15', function() {
            var cfd = cftime.parseDate('2000-05-15');
            expect(cfd.year).to.equal(2000);
            expect(cfd.month).to.equal(4);
            expect(cfd.day).to.equal(15);
        });

        it('Should parse 2000-05-15T14:39', function() {
            var cfd = cftime.parseDate('2000-05-15T14:39');
            expect(cfd.year).to.equal(2000);
            expect(cfd.month).to.equal(4);
            expect(cfd.day).to.equal(15);
            expect(cfd.hour).to.equal(14);
            expect(cfd.minute).to.equal(39);
        });

        it('Should parse 2000-05-15 14:39', function() {
            var cfd = cftime.parseDate('2000-05-15 14:39');
            expect(cfd.year).to.equal(2000);
            expect(cfd.month).to.equal(4);
            expect(cfd.day).to.equal(15);
            expect(cfd.hour).to.equal(14);
            expect(cfd.minute).to.equal(39);
        });

        it('Should parse 2000-05-15 14:39:52', function() {
            var cfd = cftime.parseDate('2000-05-15 14:39:52');
            expect(cfd.year).to.equal(2000);
            expect(cfd.month).to.equal(4);
            expect(cfd.day).to.equal(15);
            expect(cfd.hour).to.equal(14);
            expect(cfd.minute).to.equal(39);
            expect(cfd.second).to.equal(52);
        });

        it('Should parse 2000-05-15 14:39:52.489', function() {
            var cfd = cftime.parseDate('2000-05-15 14:39:52.489');
            expect(cfd.year).to.equal(2000);
            expect(cfd.month).to.equal(4);
            expect(cfd.day).to.equal(15);
            expect(cfd.hour).to.equal(14);
            expect(cfd.minute).to.equal(39);
            expect(cfd.second).to.equal(52);
            expect(cfd.millisecond).to.equal(489);
        });

        it('Should parse 0000-01', function() {
            var cfd = cftime.parseDate('0000-01');
            expect(cfd.year).to.equal(0);
            expect(cfd.month).to.equal(0);
        });

        it('Should parse 1-7-15 0:0:0', function() {
            var cfd = cftime.parseDate('1-7-15 0:0:0');
            expect(cfd.year).to.equal(1);
            expect(cfd.month).to.equal(6);
            expect(cfd.day).to.equal(15);
            expect(cfd.hour).to.equal(0);
            expect(cfd.minute).to.equal(0);
            expect(cfd.second).to.equal(0);
        });

        it('Should not parse 2001/7/15', function() {
            var cfd = cftime.parseDate('2001/7/15');
            expect(cfd).to.not.be.ok;
        });
    });

    describe('parseUnits', function() {

        it('Should exist', function() {
            expect(cftime.parseUnits).to.exist;
        });

        it('Should parse "days since 1-7-15 0:0:0"', function() {
            var r = cftime.parseUnits('days since 1-7-15 0:0:0');
            expect(r).to.have.keys('units', 'origin');
            expect(r.units).to.equal('days');
            expect(r.origin.year).to.equal(1);
            expect(r.origin.month).to.equal(6);
            expect(r.origin.day).to.equal(15);
        });
    });
});
