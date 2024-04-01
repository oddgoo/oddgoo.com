 var changeSpan;
 var i = 0;

 var hobbies = [
 	'Music',
	'Fantasy Consoles',
	'Learning',
	'Exploring',
	'Art',
 	'Teaching',
	'The Cosmos',
 	'Tilemaps',
	'Butterscotch',
 	'Drawing',
	'Being Underwater',
 	'Taking Photos',
	'Architecture',
	'The Poetics of Space',
 	'Making Sounds',
 	'Board games',
	'Travelling',
	'Sweetened condensed milk'
	 
 ];

 function changeWord() {
 	changeSpan.textContent = hobbies[i];
 	i++;
 	if (i >= hobbies.length) i = 0;
 }

 function init() {
 	console.log('initialising scrolling text');
 	changeSpan = document.getElementById("scrollingText");
 	nIntervId = setInterval(changeWord, 950);
 	changeWord();
 }

 if (document.addEventListener) {
 	init();
 } else {
 	init();
 }