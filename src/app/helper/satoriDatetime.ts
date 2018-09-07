export class SatoriDateTime {
    public year: number;
    public month: number;
    public day: number;
    public hour: number;
    public minute: number;
    public second: number;

    constructor(
        private str: string
    ) {
        this.parse(str);
    }

    // Convert satori datetime to readable datetime
    // e.g. "#507268224000004" = > 2010-5-4
    parse(str: string) {
        str = str.substring(1, str.indexOf("\"^^mso:datetime"));

        var ticks = parseInt(str.substring(1));

        if (ticks) {
            var month = 1;
            var day = 1;
            var hour = 0;
            var minute = 0;
            var sec = 0;

            var dateTimeTicks = this.getDateTimeTicks(ticks);

            var out = this.decodeYear(dateTimeTicks);

            var num1 = out.ticks;
            var year = out.year;

            if (num1 > 0) {
                if (dateTimeTicks < 0) {
                    num1 = ((this.isLeapYear(year) ? 366 : 365) * 86400000 - num1);
                }

                while (num1 > 0) {
                    var num2 = this.daysPerMonth(year, month) * 86400000;
                    if (num1 >= num2) {
                        num1 -= num2;
                        ++month;
                    }
                    else
                        break;
                }
                day = Math.floor(num1 / 86400000) + 1;
                var num3 = num1 % 86400000;
                hour = Math.floor(num3 / 3600000);
                var num4 = num3 % 3600000;
                minute = Math.floor(num4 / 60000);
                var num5 = num4 % 60000;
                sec = Math.floor(num5 / 1000);
                var num6 = num5 % 1000;
            }

            this.year = year;
            this.month = month;
            this.day = day;
            this.hour = hour;
            this.minute = minute;
            this.second = sec;
        }
    }

    daysPerMonth(year: number, month: number): number {
        switch (month) {
            case 1:
            case 3:
            case 5:
            case 7:
            case 8:
            case 10:
            case 12:
                return 31;
            case 2:
                return !this.isLeapYear(year) ? 28 : 29;
            case 4:
            case 6:
            case 9:
            case 11:
            default:
                return 30;
        }
    }

    isLeapYear(year: number): boolean {
        var num = year >= 0 ? year : -year;
        return num % 400 === 0 || num % 100 !== 0 && num % 4 === 0;
    }

    getDateTimeTicks(ticks: number): number {
        return Math.floor(ticks / 8);
    }

    decodeYear(ticks: number): any {
        var num1 = ticks > 0 ? ticks : -ticks;
        var year = 1;
        year += Math.floor(num1 / 12622780800000) * 400;
        var num2 = num1 % 12622780800000;
        var num3;
        var num4;
        if (num2 > 9467020800000) {
            num3 = 3;
            num4 = num2 - 9467020800000;
        }
        else {
            num3 = Math.floor(num2 / 3155673600000);
            num4 = num2 % 3155673600000;
        }
        year += num3 * 100;
        year += Math.floor(num4 / 126230400000) * 4;
        var num5 = num4 % 126230400000;
        var num6;
        if (num5 > 94608000000) {
            year += 3;
            num6 = num5 - 94608000000;
        }
        else {
            year += Math.floor(num5 / 31536000000);
            num6 = num5 % 31536000000;
        }
        if (ticks < 0)
            year = num6 == 0 ? -year + 1 : -year;
        return {
            ticks: num6,
            year: year
        };
    }
    

    toStringYear(): string {
        return this.year + "";
    }

    toStringMonth(): string {
        return this.year + "-" + this.month;
    }

    toStringDay(): string {
        return this.year + "-" + this.month + "-" + this.day;
    }

    toStringSecond(): string {
        return this.year + "-" + this.month + "-" + this.day + " " + this.hour +":" + this.minute + ":" + this.second;
    }
}