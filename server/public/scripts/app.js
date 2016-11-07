/*******************************************************************************
Challenge Overview
I created a new JSON data file and inside it you will find an array of objects.
Each object, is each one of you!

*************
AJAX Request
*************
Your first task is to make an AJAX call from the client side app.js using the
.ajax method. The AJAX call will be a GET request that accesses the /data URL.
Upon success, it should bring the data back down.

*************
On the DOM
*************
On the DOM should be:
One person's information
A series of 22 (or the number of people in the data array) index points with
the first person's index highlighted or called out in style differently than the
 others.
A 'Next' button and a 'Previous' button
Clicking on the Next button should navigate to the next person, clicking on the
 Previous button should navigate to the previous person. The highlighted index
 point should update also as you click through to other people.

***************
Person Display
***************
When a person is displayed, show their name, their Github link, and their piece
of shoutout feedback. Only one person should be showcased at any given time.

You will need to combine everything you learned this week to accomplish this
task, and each of the challenges you have completed this week play a part in
this task.

****************
Working Example
****************
Here is a similar example from Zeta so you can see the functionality. It's
really ugly, however. The code is also minified (no cheating!):

https://polar-ravine-37299.herokuapp.com/

HARD MODE
Include a fade out and fade in animation in-between transitioning people.

PRO MODE
Include a timer that moves to the next person if the user is not clicking on
next or prev. If the user clicks on next or prev, the timer should be reset.
The timer should transition between people every 10 seconds.
*******************************************************************************/

/****************
GLOBAL VARIABLES
*****************/
var studentsObject = {}; //store students data from ajax request here
var currentStudent = {}; //store current student to display here
var indexId = 0; //keeps track of which student in the array we are looking at
var timer;
var firstInitial;
var secondInitial;
var INTERVAL = 10000;


/*****************
On document ready
*****************/
$(document).ready(function(){

  $.ajax({
    type: "GET",
    url: "/data",
    success: function(data){
      studentsObject = data; //assign student data from ajax request to studentsObject
      init();
    },
    error: function() {
      alert("You are not connected to the server!");
    }
  });

  $("#next").on('click', nextStudent);
  $("#previous").on('click', prevStudent);
  $("#carousel").on('click', '.student', selectStudent);
//Things to do when data is successfully received
  function init() {
    makeStudent();
    appendToDom();
    carouselMaker();
    moveCarousel();
    timer = setInterval(nextStudent, INTERVAL);
  }
  //Assign student data at current indexId to global currentStudent variable
  function makeStudent() {
    currentStudent = studentsObject.sigmanauts[indexId];
  }
  //Add info from currentStudent to DOM
  function appendToDom() {
    $("#student").children().css("display", "none");
    $("#studentName").text(currentStudent.name).fadeIn(1200);
    $("#gitUsername").text("GIT Username: " + currentStudent.git_username).fadeIn(1200);
    $("#shoutout").text(currentStudent.shoutout).fadeIn(1200);
  }
  //Increment indexId and new student at that ID to currentStudent global variable
  function nextStudent() {
    if (indexId < studentsObject.sigmanauts.length - 1) {
      indexId ++; //increment indexId if < total student in studentsObject
    } else {
      indexId = 0; //if at end of array, set indexId back to 0
    }
    makeStudent(); //reassign new student to currentStudent
    appendToDom(); //add info from currentStudent to DOM
    resetTimer(); //reset timer :)
    moveCarousel();
  }

  function prevStudent() {
    if (indexId > 0) {
      indexId --; //increment indexId if < total student in studentsObject
    } else {
      indexId = studentsObject.sigmanauts.length - 1; //if at end of array, set indexId back to 0
    }
    makeStudent(); //reassign new student to currentStudent
    appendToDom(); //add info from currentStudent to DOM
    resetTimer();
    moveCarousel();
  }

  function resetTimer() {
    clearInterval(timer); //clears current interval
    timer = setInterval(nextStudent, INTERVAL); //restarts interval from time function is called
  }

  function carouselMaker() {
    for(var i = 0; i < studentsObject.sigmanauts.length; i ++) { //loops through sigmanauts array
      initialsFinder(studentsObject.sigmanauts[i].name) //assigns initials of current student to initials variables
      $("#carousel").append('<div class="student slide" id="student' + i + '"><p>' + firstInitial + secondInitial + '</p></div>'); //add a new div for each student in array
      $("#student" + i).data("studentNumber", i);
    }
  }

  function initialsFinder(name) {
    firstInitial = name.charAt(0); //sets first initial equal to first char in name string
    if(name.indexOf(" ") > -1) { // if there is a space in the string:
      secondInitial = name.charAt((name.search(" ") + 1)); //set second initial equal to character after space
    } else {
      secondInitial = ""; //else set second intial to an empty string
    }
  }

  function moveCarousel() {
    $("#carousel").children().css('background-color', 'white'); //change all background colors to white
    $("#student" + indexId).css('background-color', 'yellow'); //change background color of current student to yellow
  }

  function selectStudent() {
    indexId = $(this).data("studentNumber");
    makeStudent();
    appendToDom();
    resetTimer();
    moveCarousel();
  }



});
