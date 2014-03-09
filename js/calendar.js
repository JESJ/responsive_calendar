/*global $:false */
$(function () {
    "use strict";
	
	//Function that to get the current month details, used to populate the calendar. 
    function getMonthDetails() {
        var d = new Date();
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        var firstDay = new Date(d.getFullYear(), d.getMonth(), 1).getDay();
        var lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 1).getDay();
        var daysInMonth = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
        var dateDetailsObj = {
            todaysDate: d.getDate(),
            today: d.getDay(),
            monthName: months[d.getMonth()],
            thisYear: d.getFullYear(),
            totalDays: daysInMonth,
            firstDayOfMonth: firstDay,
            lastDayOfMonth: lastDay
        };
        return dateDetailsObj;
    }

	//Populate calendar function grabs the month details, then generates a loop to populate the list items
    function populateCalendar() {
        var md = getMonthDetails();
        var days = $('.days');
        var filler = false;
        var fill;
        var i;
        var dayClassName;
        var dayCount = md.firstDayOfMonth; //set counter to the first day of the month
        var weekDays = {
            "0": "Sunday",
            "1": "Monday",
            "2": "Tuesday",
            "3": "Wednesday",
            "4": "Thursday",
            "5": "Friday",
            "6": "Saturday"
        };
		//Print current month and year
        $('.month_year').html(md.monthName + md.thisYear);
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
        addEventInit();
    }
	//Functionality to add event to the DOM
    function addEventInit() {
        var dayClickedEle;
        var eventDetails = $('.add_calendar_event');
		
		//Get current day selected
        $('.days .inMonth').on('click', function () {
            $('.eventholder').show();
            dayClickedEle = $(this).find('.events');
            eventDetails.val("");
			//Find the event element, and check how mayc events are added. If 5 show error flash
            if ($(this).find('.events .event').length < 5) {
                if (!$("#openCloseIdentifier").is(":hidden")) {
                    showEventAdder();
                }
            } else {
                hideEventAdder();
                dayClickedEle.parent().css('background-color', "red");
                setTimeout(function () { dayClickedEle.parent().css('background-color', "#fff"); }, 500);
            }
        });
		
		//Add event to the DOM if it'c clicked and has value.
        $('.create_event').on('click', function () {
            if (eventDetails.val().trim()) {
                var eventValLong = eventDetails.val();
                var eventValShort = eventDetails.val().substr(0, 14);
                dayClickedEle.append('<div class="event ' + $('.importance').val() + '"><a href="#" title="' + eventDetails.val() + '"><span class="short">' + eventValShort + '</span><span class="long">' + eventValLong + '</span></a></div>');

                if ($("#openCloseIdentifier").is(":hidden")) {
                    hideEventAdder();
                }
                if (matchHeights() > $('.days .events').height() && $('.days .events').height() < 102) {
                    $('.days .events').css('height', matchHeights());
                }
            }
        });
		
		//function to check tallest li and adjust the others, then returns calculated height. 
	    function matchHeights() {
	        var maxHeight = 0;
	        $('.days').find('li').each(function () {
	            if (maxHeight < $(this).height()) {
	                maxHeight = $(this).height();
	            }
	        });
	        return (maxHeight - 10);
	    }
		//Show event input 
		function showEventAdder(){
			$("#slider").animate({ marginBottom: "0px" }, 500);
			$("#openCloseIdentifier").hide();
		}
		//Hide event input
		function hideEventAdder(){
			$("#slider").animate({  marginBottom: "-159px" }, 500);
            $("#openCloseIdentifier").show();
            setTimeout(function () { $('.eventholder').hide(); }, 500);
		}
		
		//close event if close button is clicked
        $(".close_event").on('click', function () {
        	hideEventAdder();
        });
    }

    populateCalendar();
});