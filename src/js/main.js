(function() {try {
	var defer = function(method) {
		window.jQuery ? method() : setTimeout(function() {
			defer(method);
		}, 50);
	};

	function execute(){
		$(document).ready(function() {
			// here put the script, you may break it into multiple files (the need to be in '/src/js')
			<!-- inject:exampleFragment.js --><!-- endinject -->

			//using templates with jQuery example
			$('#content').append('@@import promos.html');
		});
	}

	defer(execute);
}
catch (err) {
	console.error('Crashed. ERROR: ' + err);
}})()
