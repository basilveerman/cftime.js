"use strict";

var cftime = function(units, sDate) {
    this.units = units;
    this.sDate = sDate;
};

cftime.prototype.setMaxTimeByIndex = function(index) {
    this.maxIndex =  index;
    this.eDate = this.toDate(index);
    return this.eDate;
};

cftime.prototype.toDate = function(index) {
    if (index === undefined) {
        return this.sDate;
    }
    if (this.units === "days") {
        var d = new Date(this.sDate.getTime());
        d.setDate(this.sDate.getDate() + index);
        if (this.eDate && d > this.eDate) {
            return undefined;
        }
        return d;
    }
};

cftime.prototype.toIndex = function(d) {
    if (d < this.sDate || (this.eDate && this.eDate < d)) {
        return;
    }

    if (this.units === "days") {
        var msPerDay = 1000 * 60 * 60 * 24;
        var msDiff = d.getTime() - this.sDate.getTime();
        var days = msDiff / msPerDay;
        return Math.floor(days);
    }
};

var CFdate = function(year, month, day, hour, minute, second, millisecond) {
    this.year = year;
    this.month = month;
    this.day = day;
    this.hour = hour;
    this.minute = minute;
    this.second = second;
    this.millisecond = millisecond;

    this.getFullYear = function() { return this.year; }
    this.getMonth = function() { return this.month; }
    this.getDate = function() { return this.day; }
    this.getHours = function() { return this.hour; }
    this.getMinutes = function() { return this.minute; }
    this.getSeconds = function() { return this.second; }
    this.getMilliseconds = function() { return this.millisecond; }

}


var microsecUnits = ['microseconds','microsecond', 'microsec', 'microsecs'],
  millisecUnits = ['milliseconds', 'millisecond', 'millisec', 'millisecs'],
  secUnits =      ['second', 'seconds', 'sec', 'secs', 's'],
  minUnits =      ['minute', 'minutes', 'min', 'mins'],
  hrUnits =       ['hour', 'hours', 'hr', 'hrs', 'h'],
  dayUnits =      ['day', 'days', 'd'],
  monthUnits =    ['month', 'months', 'mon', 'mons'],
  yearUnits =     ['year', 'years', 'yr', 'yrs']

var units = microsecUnits.concat(millisecUnits,secUnits,
  minUnits,hrUnits,dayUnits,monthUnits,yearUnits);

var calendars = ['standard', 'gregorian', 'proleptic_gregorian',
  'noleap', 'julian', 'all_leap', '365_day', '366_day', '360_day']

var verifyCalendar = function(calendar) {
  if (calendars.indexOf(calendar) >= 0) {
    return true;
  }
  return false;
}

/*

Date regex build as such:

/^(\d{1,4})
(?:
    -(\d{1,2})
    (?:
        -(\d{1,2})
    )?
)?
(?:
    (?: |T)
    (\d{1,2})
    :
    (\d{1,2})
    (?::
        (\d{1,2})
        (?:\.(\d+))?
    )?
)?$
/g;


http://www.pelagodesign.com/blog/2009/05/20/iso-8601-date-validation-that-doesnt-suck/
^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$

*/

var ISO8601_REGEX = /^(\d{1,4})(?:-(\d{1,2})(?:-(\d{1,2}))?)?(?:(?: |T)(\d{1,2}):(\d{1,2})(?::(\d{1,2})(?:\.(\d+))?)?)?$/;

var parseDate = function(dateString) {
    var m = ISO8601_REGEX.exec(dateString);
    if (m) {
        return new CFdate(parseInt(m[1]), parseInt(m[2]-1), parseInt(m[3]), parseInt(m[4]), parseInt(m[5]), parseInt(m[6]), parseInt(m[7]));
    } else {
        return false;
    }
}

module.exports = {
    cftime: cftime,
    CFdate: CFdate,
    parseDate: parseDate,
}
