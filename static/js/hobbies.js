 var changeSpan;
 var i = 0;

 var hobbies = [
 	'Music',
	'Improvised Theatre',
	'Fantasy Consoles',
	'Learning',
	'Art',
 	'Medium-bending experiences',
	'The Cosmos',
 	'Tilemaps',
	'Butterscotch',
	'Performance',
 	'Drawing',
	'Being Underwater',
 	'Taking Photos',
	'Architecture',
	'The Poetics of Space',
 	'Making Sounds',
 	'Board games',
	'Traveling',
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