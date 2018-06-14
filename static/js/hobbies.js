 var changeSpan;
 var i = 0;

 var hobbies = [
 	'Music',
	'HTML5',
	'Learning',
	'Exploring',
	'Art',
 	'Teaching',
 	'Virtual Reality',
	'The Cosmos',
 	'Unity3D',
 	'Tilemaps',
	'Reading',
	'Butterscotch',
 	'Drawing',
 	'Taking Photos',
	'Smiles',
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