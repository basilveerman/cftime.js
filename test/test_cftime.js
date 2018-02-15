'use strict';

var cftime = require('../cftime.js');

var chai = require('chai');
chai.use(require('chai-datetime'));
var expect = chai.expect;

describe('cftime', function() {
    var t = new cftime.cftime('days', new Date('1950-01-01T08:00:00.000Z'));
		var seconds_date = new cftime.cftime('seconds', new Date('1950-01-01T08:00:00.000Z'));
		var hours_date = new cftime.cftime('hours', new Date('1950-01-01T08:00:00.000Z'));
		var minutes_date = new cftime.cftime('minutes', new Date('1950-01-01T08:00:00.000Z'));
		var milliseconds_date = new cftime.cftime('milliseconds', new Date('1950-01-01T08:00:00.000Z'));
		var microseconds_date = new cftime.cftime('microseconds', new Date('1950-01-01T08:00:00.000Z'));
		var months_date = new cftime.cftime('months', new Date('1950-01-01T08:00:00.000Z'));
		var years_date = new cftime.cftime('years', new Date('1950-01-01T08:00:00.000Z'));

    it('Should return a new cftime object', function() {
        var t = new cftime.cftime('days', new Date('1950-01-01T08:00:00.000Z'));
        expect(t).to.exist;
    });

		it('Should return a new cftime from "days since 1-7-15 8:0:0"',function(){
			var t2 = new cftime.cftime("days since 1-7-15 8:0:0");
			expect(t2).to.exist;
			expect(t2.toDate().toUTCString()).to.equal(new Date('1901-07-15T08:00:00.000Z').toUTCString());
		});

    describe('setMaxTimeByIndex()', function() {

        it('Should exist', function() {
            expect(t.setMaxTimeByIndex).to.exist;
        });

        it('Should return Jan 31, 1950', function() {
            var t2 = t.setMaxTimeByIndex(30);
            expect(t2).to.equalDate(new Date('1950-01-31T08:00:00.000Z'));
        });
    });

    describe('toDate()', function() {

        it('Should exist', function() {
            expect(t.toDate).to.exist;
        });

        it('Should return Jan 21, 1950', function() {
            var t2 = t.toDate(20);
            expect(t2).to.equalDate(new Date('1950-01-21T08:00:00.000Z'));
        });
				it('Should return Jan 21, 1950 from seconds date', function() {
            var t2 = seconds_date.toDate(20*24*60*60);
            expect(t2).to.equalDate(new Date('1950-01-21T08:00:00.000Z'));
        });
				it('Should return Jan 21, 1950 from minutes date', function() {
            var t2 = minutes_date.toDate(20*24*60);
            expect(t2).to.equalDate(new Date('1950-01-21T08:00:00.000Z'));
        });
				it('Should return Jan 21, 1950 from hours date', function() {
            var t2 = hours_date.toDate(20*24);
            expect(t2).to.equalDate(new Date('1950-01-21T08:00:00.000Z'));
        });
				it('Should return Jan 21, 1950 from milliseconds date', function() {
            var t2 = milliseconds_date.toDate(20*24*60*60*1000);
            expect(t2).to.equalDate(new Date('1950-01-21T08:00:00.000Z'));
        });
				it('Should return Jan 21, 1950 plus one microsecond from microseconds date', function() {
            var t2 = microseconds_date.toDate(20*24*60*60*1000*1000+1);
            expect(t2).to.equalDate(new Date('1950-01-21T08:00:00.001Z'));
        });
				it('Should return Feb 1, 1950 from months date', function() {
            var t2 = months_date.toDate(1);
            expect(t2).to.equalDate(new Date('1950-02-01T08:00:00.000Z'));
        });
				it('Should return Jan 1, 1951 from years date', function() {
            var t2 = years_date.toDate(1);
            expect(t2).to.equalDate(new Date('1951-01-01T08:00:00.000Z'));
        });

        it('Should return undefined', function() {
            var t2 = t.toDate(40);
            expect(t2).to.be.undefined;
        });
    });

    describe('toIndex()', function() {

        it('Should exist', function() {
            expect(t.toIndex).to.exist;
        });

        it('Should return 15', function() {
            var index = t.toIndex(new Date('1950-01-16T08:00:00.000Z'));
            expect(index).to.equal(15);
        });
				it('Should return 2 for less than three months', function() {
            var index = months_date.toIndex(new Date('1950-03-16T08:00:00.000Z'));
            expect(index).to.equal(2);
        });

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
				it('Should parse "minutes since 1-7-15 0:0:0"', function() {
            var r = cftime.parseUnits('minutes since 1-7-15 0:0:0');
            expect(r).to.have.keys('units', 'origin');
            expect(r.units).to.equal('minutes');
            expect(r.origin.year).to.equal(1);
            expect(r.origin.month).to.equal(6);
            expect(r.origin.day).to.equal(15);
        });
				it('Should parse "second since year 1968 month 05 day 23 at 00:00"', function(){
					var r = cftime.parseUnits('second since year 1968 month 05 day 23 at 00:00');
					expect(r).to.have.keys('units', 'origin');
					expect(r.units).to.equal('second');
					expect(r.origin.year).to.equal(1968);
					expect(r.origin.month).to.equal(4);
					expect(r.origin.day).to.equal(23);
				})
    });
});
