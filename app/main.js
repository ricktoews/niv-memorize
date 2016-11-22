	var app = angular.module('Memorize', []);

	var text_table = 'bible_niv';
	var fb_user_id = 11011;
	var user_id;

	app.value('text_table', text_table);
	app.value('restBase', '//memorize.toewsweb.net/rest.php');

	app.run(function(login) {
		console.log('entered app.run');
		login.in(fb_user_id).then(function (response) {
console.log('logged in', response);
			user_id = response.id;
		});
	});

	var ref = {
		book: 'Revelation',
		chapter: '22'
	};
