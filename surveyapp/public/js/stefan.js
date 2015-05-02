jQuery(function($){
	$('html').on("change", "#survey input, #survey option, #survey textarea", function(e){

		if($(this).parent().data('surveystarted') == false){

			$(this).parent().data('surveystarted', true);
			var url = document.URL;
			var num = url.substring(8).indexOf('survey');

			$.ajax({
				type: "POST",
				url: "/surveyapp/incStartCount"+url.substr(num+7),
				data: { startCount : true }
			})
			.done(function(msg){
				console.log('----------------------------');
				console.log("Data send: "+ msg);

			});
		}
	});
	var jPM = $.jPanelMenu({
		trigger: '.menu-trigger'
		, direction:'right'
		, openPosition: '90%'
		, duration: 1000
		, beforeOpen: function(){
			surveyObject.team = $('#teamselect option:selected').val();

			$('button[name="saveChanges"]').each(function(){$(this).click();});
			surveyObject.questionArray=[];
			$('#surveyContainer > .row').each(function(){
				surveyObject.questionArray.push($(this).data('qobj'));
			})
			$.ajax({
				type: 'POST',
				url: '/surveyapp/preview',
				data: surveyObject,
				success: function(res) {
					$('.previewContainer').html(res);
				}
			})

		}
	});
	jPM.on()

	$('#ncontainer').parent().hammer().on('swipeleft', function(event) {
		jPM.trigger(true);
	});
	$('#jPanelMenu-menu').hammer().on('swiperight', function(event) {
		console.log('heu')
		jPM.close(true)
	});

	$('form.navbar-form.form-validetta').on('submit', function (e){
		var $el = $("#srch-term"),
		x = 1000,
		originalColor = $el.css("background")
		if($el.val() === ''){
			$el.attr("value", "Illegal search");
			$el.css("background", "#F74D4D");
			$el.attr('disabled','disabled');
			setTimeout(function(){
				$el.css("background", originalColor);
				$el.attr("value", "");
				$el.removeAttr('disabled');
				$el.focus()
			}, x);
			e.preventDefault();
		}
	})


});
