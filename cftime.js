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

var validUnits = microsecUnits.concat(millisecUnits,secUnits,
  minUnits,hrUnits,dayUnits,monthUnits,yearUnits);

var unitsAreValid = function(unitString) {
    if (validUnits.indexOf(unitString) >= 0) {
        return true;
    } else {
        return false;
    }
}

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

var parseUnits = function(unitString) {
    /*
    Parse a string of the form "<time-units> since <date-string>"
    Returns an object with keys 'units' and 'origin'
    */

    var split = unitString.split(' ');
    var timeUnits = split[0].toLowerCase();
    if (!unitsAreValid(timeUnits)) {
        throw Error('Units must be one of ' + validUnits.join(' '));
    }
    if (split[1].toLowerCase() !== 'since') {
        throw Error('No "since" in unit string');
    }
    var dateString = split.slice(2).join(' ');
    var cfd = parseDate(dateString);

    return {
        units: timeUnits,
        origin: cfd
    }
}

var julianDayFromDate = function(date, calendar) {
    /*
    Based on https://github.com/Unidata/netcdf4-python/blob/master/netcdftime/netcdftime.py
    */

    calendar = typeof calendar !== 'undefined' ?  calendar : 'standard';

    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();

    // Convert time to fractions of a day
    day = day + date.getHours() / 24.0 + date.getMinutes() / 1440.0 + (date.getSeconds() + date.getMilliseconds()/1.e3) / 86400.0

    if (month < 2) {
        month = month + 12;
        year = year - 1;
    }

    var A = year / 100;

    // jd = int(365.25 * (year + 4716)) + int(30.6001 * (month + 1)) + day - 1524.5
    jd = 365. * year + parseInt(0.25 * year + 2000.) + parseInt(30.6001 * (month + 1)) + day + 1718994.5

    // optionally adjust the jd for the switch from
    // the Julian to Gregorian Calendar
    // here assumed to have occurred the day after 1582 October 4

    var B;

    if (['standard', 'gregorian'].indexOf(calendar)) {
        if (jd >= 2299160.5) {
            B = 2 - A + parseInt(A/4);
        } else if (jd < 2299160.5) {
            B = 0;
        } else {
            throw Error('Impossible date (falls in gap between end of Julian calendar and beginning of Gregorian calendar');
        }
    } else if (calendar === 'proleptic_gregorian') {
        B = 2 - A + parseInt(A/4);
    } else if (calendar === 'gregorian') {
        B = 0;
    } else {
        throw Error('unknown calendar, must be one of julian,standard,gregorian,proleptic_gregorian, got: ' + calendar);
    }

    jd = jd + B;

    return jd;
}

var _NoLeapDayFromDate = function(date) {
    /*
    Creates a Julian Day for a calendar with no leap years from a CFdate object
    Returns the fractional Julian Day (resolution approx 0.1 second).
    */
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();

    // Convert time to fractions of a day
    day = day + date.getHours() / 24.0 + date.getMinutes() / 1440.0 + (date.getSeconds() + date.getMilliseconds()/1.e3) / 86400.0

    if (month < 2) {
        month = month + 12;
        year = year - 1;
    }
    jd = int(365. * (year + 4716)) + int(30.6001 * (month + 1)) +  day - 1524.5;

    return jd
}

var _AllLeapFromDate = function(date) {
    /*
    Creates a Julian Day for a calendar where all years have 366 days from
    a CFdate object.
    Returns the fractional Julian Day (resolution approx 0.1 second).
    */

    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();

    // Convert time to fractions of a day
    day = day + date.getHours() / 24.0 + date.getMinutes() / 1440.0 + (date.getSeconds() + date.getMilliseconds()/1.e3) / 86400.0

    if (month < 2) {
        month = month + 12;
        year = year - 1;
    }

    jd = int(366. * (year + 4716)) + int(30.6001 * (month + 1)) + day - 1524.5

    return jd

}

var _360DayFromDate = function(date) {
    /*
    Creates a Julian Day for a calendar where all months have 30 days from
    a CFdate object.
    Returns the fractional Julian Day (resolution approx 0.1 second).
    */

    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();

    // Convert time to fractions of a day
    day = day + date.getHours() / 24.0 + date.getMinutes() / 1440.0 + (date.getSeconds() + date.getMilliseconds()/1.e3) / 86400.0

    if (month < 2) {
        month = month + 12;
        year = year - 1;
    }

    jd = int(360. * (year + 4716)) + int(30. * (month - 1)) + day

    return jd

}

var date2num = function(date, units, calendar) {
    calendar = typeof calendar !== 'undefined' ?  calendar : 'standard';
}

module.exports = {
    cftime: cftime,
    CFdate: CFdate,
    julianDayFromDate: julianDayFromDate,
    _NoLeapDayFromDate: _NoLeapDayFromDate,
    _AllLeapFromDate: _AllLeapFromDate,
    _360DayFromDate: _360DayFromDate,
    parseDate: parseDate,
    parseUnits: parseUnits,
}
