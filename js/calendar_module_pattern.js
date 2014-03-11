/*global $:false */
$(function () {
    "use strict";

    var s;
    var d;
    var AddCalendar = {
        settings: {
            monthsOnDisplay: 1,
            monthList: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
            weekdayList: {
                "0": "Sunday",
                "1": "Monday",
                "2": "Tuesday",
                "3": "Wednesday",
                "4": "Thursday",
                "5": "Friday",
                "6": "Saturday"
            },
            domElements: function () {
                return {
                    monthTitleContainer: $('.month_year'),
                    calendarContainer: $('.calendar'),
                    daysContainer: $('.days'),
                    daysInMonthContainer: $('.days .inMonth'),
                    eventInput: $('.add_calendar_event'),
                    openCloseIdentifier: $("#openCloseIdentifier"),
                    createEventButton: $('.create_event'),
                    importanceSelector: $('.importance'),
                    eventsOnCalendarContainer: $('.days .events'),
                    eventSlider: $("#slider"),
                    addEventContainer: $('.eventholder'),
                    closeEventButton: $(".close_event")
                };
            }
        },

        init: function () {
            s = this.settings;
            this.populateCalendar();
            d = s.domElements();
            this.checkPlaceholder();
        },

        //Function that to get the current month details, used to populate the calendar. 
        getMonthDetails: function () {
            var dy = new Date();
            var months = s.monthList;
            var firstDay = new Date(dy.getFullYear(), dy.getMonth(), 1).getDay();
            var lastDay = new Date(dy.getFullYear(), dy.getMonth() + 1, 1).getDay();
            var daysInMonth = new Date(dy.getFullYear(), dy.getMonth() + 1, 0).getDate();
            var dateDetailsObj = {
                todaysDate: dy.getDate(),
                today: dy.getDay(),
                monthName: months[dy.getMonth()],
                thisYear: dy.getFullYear(),
                totalDays: daysInMonth,
                firstDayOfMonth: firstDay,
                lastDayOfMonth: lastDay
            };
            return dateDetailsObj;
        },

        //Populate calendar function grabs the month details, then generates a loop to populate the list items
        populateCalendar: function () {
            d = s.domElements();
            var md = this.getMonthDetails();
            var days = d.daysContainer;
            var filler = false;
            var fill;
            var i;
            var dayClassName;
            var dayCount = md.firstDayOfMonth; //set counter to the first day of the month
            var weekDays = s.weekdayList;

            //Print current month and year
            d.monthTitleContainer.html(md.monthName + md.thisYear);

            //Loop throught total days of month and append to DOM
            for (i = 1; i <= md.totalDays; i++) {
                if (filler === false) {
                    //Filler for days of last month
                    for (fill = 0; fill < md.firstDayOfMonth; fill++) {
                        days.append('<li class="calendar_day empty_day"><div class="events"></div>&nbsp;</li>');
                    }
                    filler = true;
                }
                //Detection of today's date is the current value of itteration
                i === md.todaysDate ? dayClassName = "calendar_day_today" : dayClassName = "calendar_day";
                days.append('<li class="' + dayClassName + ' inMonth"><div class="date"><span class="long day">' + weekDays[dayCount] + '</span> <span class="date">' + i + '</span></div><div class="events"></div></li>');
                //Check resetter for day counter
                dayCount === 6 ? dayCount = 0 : dayCount++;
            }

            //Filler for days of next month month
            if (filler === true) {
                for (fill = 7; fill > md.lastDayOfMonth; fill--) {
                    days.append('<li class="calendar_day empty_day"><div class="events"></div>&nbsp;</li>');
                }
            }
            //Inititilise the calendar event adder. 
            this.bindUIEvents();
        },

        //Functionality to add event to the DOM
        bindUIEvents: function () {
            var dayClickedEle;
            var d = s.domElements();
            var eventDetails = d.eventInput;
            var t = this;

            //Get current day selected
            d.daysInMonthContainer.on('click', function () {
                d.addEventContainer.show();
                dayClickedEle = $(this).find('.events');
                eventDetails.val("");
                //Find the event element, and check how mayc events are added. If 5 show error flash
                if ($(this).find('.events .event').length < 5) {
                    if (!d.openCloseIdentifier.is(":hidden")) {
                        t.showEventAdder();
                    }
                } else {
                    t.hideEventAdder();
                    dayClickedEle.parent().css('background-color', "#f00");
                    setTimeout(function () { dayClickedEle.parent().css('background-color', "#fff"); }, 500);
                }

                if (typeof document.createElement("input").placeholder === 'undefined') {
                    if (d.eventInput.val() === '' || d.eventInput.val() === d.eventInput.attr('placeholder')) {
                        d.eventInput.addClass('placeholder');
                        d.eventInput.val(d.eventInput.attr('placeholder'));
                    }
                }
            });

            //Add event to the DOM if it'c clicked and has value.
            d.createEventButton.on('click', function () {
                if (eventDetails.val().trim() && eventDetails.val().trim() !== d.eventInput.attr('placeholder')) {
                    var eventValLong = eventDetails.val();
                    var eventValShort = eventDetails.val().substr(0, 14);
                    dayClickedEle.append('<div class="event ' + $('.importance').val() + '"><a href="#" title="' + eventDetails.val() + '"><span class="short">' + eventValShort + '</span><span class="long">' + eventValLong + '</span></a></div>');

                    if (d.openCloseIdentifier.is(":hidden")) {
                        t.hideEventAdder();
                    }
                    if (t.matchHeights() > d.eventsOnCalendarContainer.height() && d.eventsOnCalendarContainer.height() < 102) {
                        d.eventsOnCalendarContainer.css('height', t.matchHeights());
                    }
                }
            });

            //close event if close button is clicked
            d.closeEventButton.on('click', function () {
                t.hideEventAdder();
            });
        },

        //function to check tallest li and adjust the others, then returns calculated height. 
        matchHeights: function () {
            var maxHeight = 0;
            d.daysContainer.find('li').each(function () {
                if (maxHeight < $(this).height()) {
                    maxHeight = $(this).height();
                }
            });
            return (maxHeight - 10);
        },

        //Show event input 
        showEventAdder: function () {
            d.eventSlider.animate({ marginBottom: "0px" }, 500);
            d.openCloseIdentifier.hide();
        },

        //Hide event input
        hideEventAdder: function () {
            d.eventSlider.animate({ marginBottom: "-159px" }, 500);
            d.openCloseIdentifier.show();
            setTimeout(function () { d.addEventContainer.hide(); }, 500);
        },


        //Unsupported browsers placeholder check function to improve user interaction. 
        checkPlaceholder: function () {
            if (typeof document.createElement("input").placeholder === 'undefined') {
                $('[placeholder]').focus(function () {
                    var input = $(this);
                    if (input.val() === input.attr('placeholder')) {
                        input.val('');
                        input.removeClass('placeholder');

                    }
                }).blur(function () {
                    var input = $(this);
                    if (input.val() === '' || input.val() === input.attr('placeholder')) {
                        input.addClass('placeholder');
                        input.val(input.attr('placeholder'));
                    }
                });
            }
        }

    };

    AddCalendar.init();
});