
var surveyObject = {
		'surveyName':"",
		'questionArray':[],
		'team':"",
		'comments':""
}

var surveyCreator = {
	toggleQuestion: function() {
		$('div.surveyTools > button').each(function () {
			var those = $('div.surveyTools > div')
			, classes = $(this).attr("class").split(" ")
			, thisClass = classes[classes.length-1]
			, container = $('div.surveyTools > div.' + thisClass);
			$(this).on('click',function () {
				those.addClass('hide');
				container.removeClass('hide');
			});
		});
	},

	addChoice:function() {
		$('button[name="add"]').unbind().on('click', function() {
			var container = document.getElementById('choicesForm')
			, 	that = this.parentNode
			,	child = document.getElementsByName('add')
			,	input = document.createElement('input')
			,	del = document.createElement('input')
			,	group = document.createElement('div');

			input.name = 'inputvalue';
			input.type = 'text';
			input.placeholder = 'Choice';

			del.name = 'del'
			del.type = 'button';
			del.value = 'Delete';
			del.className = 'btn btn-default btn-xs';

			group.appendChild(input);
			group.appendChild(del);
			$('button[name="add"]').before(group);
			$('add[name="inputvalue"]').unbind().on('change', function(){
				$(this).data('name', $(this).val());
			});
		});
	},

	addEditChoice: function() {
		$('html').unbind().on('click','button[name="editAdd"]', function(){
			var group = document.createElement('div')
			,	input = document.createElement('input')
			, 	del = document.createElement('input');

			input.name = 'editAnswer';
			input.type = 'text';

			del.name = 'del';
			del.type = 'Button';
			del.value = 'Delete';

			del.classname = 'btn btn-default btn-xs';
			group.appendChild(input);
			group.appendChild(del);
			$('button[name="editAdd"]').before(group);
			$('input[name="editAnswer"]').unbind().on('change', function(){
				$(this).data('name', $(this).val());
			})
		})
	},

	questionType:function() {
	 	$('#saveCheckbox').on('click',function(){
	 		surveyCreator.addQuestion('checkbox');
	 	})
	 	$('#saveRadio').on('click',function(){
	 		surveyCreator.addQuestion('radio');
	 	})
	 	$('#saveDroplist').on('click',function(){
	 		surveyCreator.addQuestion('select');
	 	})
	 	$('#saveTextarea').on('click',function(){
	 		surveyCreator.addQuestion('textarea');
	 	})
	 	$('#saveText').on('click',function(){
	 		surveyCreator.addQuestion('text');
	 	})
	 	$('#saveNumber').on('click', function(){
	 		surveyCreator.addQuestion('number');
	 	})
	},

	addQuestion:function(type) {
		var form = document.getElementById('surveyContainer')
		,	questionObject = {
				'questionName': String,
				'answerArray': new Array()
			}
		,	qdiv = document.createElement('div')
		,	options = document.createElement('div')
		, 	edit = document.createElement('button')
		, 	del = document.createElement('button')
		,	up = document.createElement('button')
		,	down = document.createElement('button')
		,   element = document.createElement('div');
		qdiv.className = 'col-md-5';
		options.className = 'col-md-3';
		element.name = 'sElement';
		element.className = 'row';
		element.display = 'inline';
		edit.innerHTML = 'Edit';
		edit.className = 'btn btn-xs';
		edit.name = 'edit';
		edit.type = 'button';
		del.innerHTML = 'Delete';
		del.className = 'btn btn-xs';
		del.name = 'del';
		del.type = 'button';
		up.innerHTML = '^';
		up.className = 'btn btn-xs';
		up.name = 'up';
		up.type = 'button';
		down.innerHTML = 'v';
		down.className = 'btn btn-xs';
		down.name = 'down';
		down.type = 'button';
		options.appendChild(edit);
		options.appendChild(del);
		options.appendChild(up);
		options.appendChild(down);
		if(type == 'checkbox') {
			$('#editCheckbox input[name="questionName"]').each(function(){
				var question = document.createElement('h3');
				question.innerHTML = $(this).val();
				questionObject.questionName = $(this).val();
				element.appendChild(question);
			})
			$('#editCheckbox input[name="inputvalue"]').each(function(){
				var choice = document.createElement('input');
				var label = document.createElement('label');
				questionObject.type = type;
				questionObject.answerArray.push($(this).val());
				choice.name = questionObject.questionName;
				choice.type = type;
				choice.value = $(this).val();
				choice.disabled = 'disabled';
				label.innerHTML = $(this).val();
				qdiv.appendChild(label);
				qdiv.appendChild(choice);
				element.appendChild(qdiv);
			});
			element.appendChild(options);
			form.appendChild(element);
		}
		else if(type == 'radio') {
			$('#editRadio input[name="questionName"]').each(function(){
				var question = document.createElement('h3');
				question.innerHTML = $(this).val();
				questionObject.questionName = $(this).val();
				element.appendChild(question);
			})
			$('#editRadio input[name="inputvalue"]').each(function(){
				var choice = document.createElement('input');
				var label = document.createElement('label');
				questionObject.type = type;
				questionObject.answerArray.push($(this).val());
				choice.name = questionObject.questionName;
				choice.type = type;
				choice.value = $(this).val();
				choice.disabled = 'disabled';
				label.innerHTML = $(this).val();
				qdiv.appendChild(label);
				qdiv.appendChild(choice);
				element.appendChild(qdiv);
			});
			element.appendChild(options);
			form.appendChild(element);
		}
		else if(type == 'text') {
			$('#editText input[name="questionName"]').each(function(){
				var question = document.createElement('h3');
				question.innerHTML = $(this).val();
				questionObject.questionName = $(this).val();
				questionObject.type = type;
				element.appendChild(question);
			})
			var input = document.createElement('input');
			input.name = questionObject.questionName;
			input.disabled = 'disabled';
			qdiv.appendChild(input);
			element.appendChild(qdiv);
			element.appendChild(options);
			form.appendChild(element);
		}
		else if(type == 'textarea') {
			$('#editTextarea input[name="questionName"]').each(function(){
				var question = document.createElement('h3');
				question.innerHTML = $(this).val();
				questionObject.questionName = $(this).val();
				questionObject.type = type;
				element.appendChild(question);
			})
			var input = document.createElement('textarea');
			input.name = questionObject.questionName;
			input.disabled = 'disabled';
			qdiv.appendChild(input);
			element.appendChild(qdiv);
			element.appendChild(options);
			form.appendChild(element);
		}
		else if(type == 'select') {
			$('#editDroplist input[name="questionName"]').each(function(){
				var question = document.createElement('h3');
				question.innerHTML = $(this).val();
				questionObject.questionName = $(this).val();
				element.appendChild(question);
			})
			var input = document.createElement('select');
			input.name = questionObject.questionName;
			input.disabled = 'disabled';
			qdiv.appendChild(input);
			$('#editDroplist input[name="inputvalue"]').each(function() {
				var option = document.createElement('option');
				option.innerHTML = $(this).val();
				questionObject.type = type;
				questionObject.answerArray.push($(this).val());
				input.appendChild(option);
			})
			element.appendChild(qdiv);
			element.appendChild(options);
			form.appendChild(element);
		}
		element.dataset.qobj = JSON.stringify(questionObject);
	},

	removeChoice:function() {
		$('html').on('click', 'input[name="del"]', function() {
			$(this).parent().remove();
		});
	},

	removeElement: function() {
		$('html').on('click', 'button[name="del"]', function(){
			$(this).parent().parent().remove();
		});
	},

	editElement: function() {
		$('html').on('click', 'button[name="edit"]', function() {
			var object = $(this).parent().parent().data('qobj')
			,	add = document.createElement('button')
			,	save = document.createElement('button')
			,	close = document.createElement('button')
			,	editDiv = document.createElement('div')
			,	questionName = document.createElement('input');
			$('button[name="edit"]').attr('disabled', true);
			$('button[name="del"').attr('disabled', true);
			$('button[name="up"]').attr('disabled', true);
			$('button[name="down"').attr('disabled', true);
			editDiv.name = 'editDiv';
			add.innerHTML = '+';
			add.type = 'button';
			add.name = 'editAdd';
			save.type = 'button';
			save.name = 'saveChanges';
			close.type = 'button';
			close.name = 'closeEdit';
			close.innerHTML = 'Close';
			save.innerHTML = 'Save Changes';
			questionName.name = 'editQuestion';
			questionName.value = object.questionName;
			editDiv.appendChild(questionName);
			if(object.type == 'text' || object.type == 'textarea') {
				$(this).parent().parent().after(editDiv);
				editDiv.appendChild(document.createElement('br'));
				editDiv.appendChild(close);
				editDiv.appendChild(save);
			}
			else {
				for(answer in object.answerArray) {
					var answers = document.createElement('input')
					,	choice = document.createElement('div')
					,	del = document.createElement('input');
					del.name = 'del';
					del.type = 'button'
					del.className = 'btn btn-default btn-xs';
					del.value = 'Delete';
					answers.name = 'editAnswer';
					answers.value = object.answerArray[answer];
					choice.appendChild(answers);
					choice.appendChild(del);
					editDiv.appendChild(choice);
				}
				editDiv.appendChild(add);
				editDiv.appendChild(document.createElement('br'));
				editDiv.appendChild(close);
				editDiv.appendChild(save);
				$(this).parent().parent().after(editDiv);
			}
		})
	},

	moveUp: function() {
		$('html').on('click', 'button[name="up"]', function(){
			$(this).parent().parent().insertBefore($(this).parent().parent().prev());
		})
	},

	moveDown: function() {
		$('html').on('click', 'button[name="down"]', function() {
			$(this).parent().parent().insertAfter($(this).parent().parent().next());
		})
	},

	saveLast: function() {
		var obj = {
			'questionName':"",
			'answerArray':[]
		}
		,	newQuestion = document.createElement('div');
		$('input[name="editQuestion"').each(function(){
			obj.questionName = $(this).val();
		})
		$('input[name="editAnswer"]').each(function(){
			obj.answerArray.push($(this).val());
		})
		$(this).parent().prev().children().remove('.col-md-5');
		$(this).parent().prev().children('h3').html(obj.questionName);
		var type = $(this).parent().prev().data('qobj').type;
		var that = $(this).parent().prev();
		obj.type = type;
		newQuestion.className = 'col-md-5';
		if(type == 'checkbox' || type == 'radio') {
			for(answer in obj.answerArray){
				var input = document.createElement('input');
				var label = document.createElement('label');
				input.name = obj.questionName;
				input.type = type;
				input.disabled = 'disabled';
				label.innerHTML = (obj.answerArray[answer]);
				newQuestion.appendChild(label);
				newQuestion.appendChild(input);
			}
			that.children('.col-md-3').before(newQuestion);
		}
		else if(type == 'select') {
			var input = document.createElement('select');
			input.name = obj.questionName;
			input.disabled = 'disabled';
			for(answer in obj.answerArray){
				var item = document.createElement('option');
				item.innerHTML = obj.answerArray[answer];
				input.appendChild(item);
			}
			newQuestion.appendChild(input);
			that.children('.col-md-3').before(newQuestion);
		}
		else if(type == 'text') {
			var input = document.createElement('input');
			input.name = obj.questionName;
			newQuestion.appendChild(input);
			that.children('.col-md-3').before(newQuestion);
		}
		else if(type == 'textarea') {
			var textarea = document.createElement('textarea');
			input.name = obj.questionName;
			newQuestion.appendChild(textarea);
			that.children('.col-md-3').before(newQuestion);
		}
		console.log(obj);
		$(this).parent().prev().data('qobj', obj);
		$(this).parent().remove();
		$('button[name="edit"]').attr('disabled', false);
		$('button[name="del"]').attr('disabled', false);
		$('button[name="up"]').attr('disabled', false);
		$('button[name="down"]').attr('disabled', false);
			// document.getElementsByName('del').disabled='false';
	},

	closeEdit: function() {
		$('html').on('click', 'button[name="closeEdit"]', function(){
			$(this).parent().remove();
			$('button[name="edit"]').attr('disabled', false);
			$('button[name="del"]').attr('disabled', false);
			$('button[name="up"]').attr('disabled', false);
			$('button[name="down"]').attr('disabled', false);
		})
	},

	saveChanges: function() {
		$('html').on('click', 'button[name="saveChanges"]', surveyCreator.saveLast)
	},

	submitSurvey:function() {
		surveyObject.team = $('#teamselect option:selected').val();
		$('#surveyName').on('change', function() {
			 surveyObject.surveyName = $(this).val();
		});
		$('#teamselect').on('change', function() {
			surveyObject.team = $('#teamselect option:selected').val();
		});
		$('#saveSurvey').on('click', function (e) {
			$('button[name="saveChanges"]').each(function(){$(this).click();});
			surveyObject.questionArray=[];
			$('#surveyContainer > .row').each(function(){
				surveyObject.questionArray.push($(this).data('qobj'));
			})
			var $el = $("#surveyName"),
			x = 1500,
			originalColor = $el.css("background")

			if($el.val() === ''){
				$el.attr("placeholder", "Required Field");
				$el.css("background", "#F74D4D");
				setTimeout(function(){
					$el.css("background", originalColor);
				}, x);
				e.preventDefault();
			}
			else{
				surveyCreator.postJSON(surveyObject);
			}
		})
	},

	previewSurvey:function() {
		surveyObject.team = $('#teamselect option:selected').val();
		$('#surveyName').on('change', function() {
			 surveyObject.surveyName = $(this).val();
		});
		$('#teamselect').on('change', function() {
			surveyObject.team = $('#teamselect option:selected').val();
		});
		$('#preview').on('click', function () {
			$('button[name="saveChanges"]').each(function(){$(this).click();});
			surveyObject.questionArray=[];
			$('#surveyContainer > .row').each(function(){
				surveyObject.questionArray.push($(this).data('qobj'));
			})
			console.log('surveyObject is: ')
			console.log(surveyObject)
		})
	},

	postJSON: function(object) {
		$.ajax({
			type: 'POST',
			url: '',
			data: surveyObject,
			success: function(res) {
				window.location.href ='/surveyapp/';
			}
		})
	},

	loadSurvey: function() {
		var i = 0;
		if(typeof surveyCollection != 'undefined') {
			var questionObject = {
				'questionName': String,
				'answerArray': new Array()
			};
			console.log(surveyCollection);
			var form = document.getElementById('surveyContainer');
			var name = surveyCollection.surveyName;
			var questions = surveyCollection.questions;
			document.getElementById('surveyName').value = name;
			for(question in questions) {
				var element = document.createElement('div'),
					tools = document.createElement('div'),
					questionName = document.createElement('h3'),
					edit = document.createElement('button'),
					del = document.createElement('button'),
					up = document.createElement('button'),
					down = document.createElement('button'),
					type = questions[question].type;
				element.className = 'row';
				edit.innerHTML = 'Edit'
				edit.className = 'btn btn-xs';
				edit.name = 'edit';
				edit.type = 'button';
				del.innerHTML = 'Delete';
				del.className = 'btn btn-xs';
				del.name = 'del';
				del.type = 'button';
				up.innerHTML = '^';
				up.className = 'btn btn-xs';
				up.name = 'up';
				up.type = 'button';
				down.innerHTML = 'v';
				down.className = 'btn btn-xs';
				down.name = 'down';
				down.type = 'button';
				tools.className = 'col-md-3';
				questionName.innerHTML = questions[question].questionName;
				questionObject.questionName = questions[question].questionName;
				questionObject.type = type;
				tools.appendChild(edit);
				tools.appendChild(del);
				tools.appendChild(up);
				tools.appendChild(down);
				element.appendChild(questionName);
				if(type == 'checkbox' || type == 'radio') {
					var qdiv = document.createElement('div');
					for(answer in questions[question].answerArray) {
						console.log(questions[question].answerArray[answer]);
						var input = document.createElement('input');
						var label = document.createElement('label');
						qdiv.className = 'col-md-5';
						input.type = type;
						input.disabled = 'disabled';
						label.innerHTML = questions[question].answerArray[answer];
						questionObject.answerArray.push(questions[question].answerArray[answer]);
						qdiv.appendChild(input);
						qdiv.appendChild(label);
					}
					element.appendChild(qdiv);
				}
				else if (type == 'select'){
					var div = document.createElement('div');
					var select = document.createElement('select');
					select.name = 'select' + i;
					select.disabled = 'disabled';
					for(answer in questions[question].answerArray){
						var option = document.createElement('option');
						div.className = 'col-md-5';
						option.innerHTML = questions[question].answerArray[answer];
						select.appendChild(option);
						questionObject.answerArray.push(questions[question].answerArray[answer]);
					}
					div.appendChild(select);
					element.appendChild(div);
				}
				else if(type == 'text') {
					var input = document.createElement('input');
					input.name = 'input' + i;
					var div = document.createElement('div');
					input.disabled = 'disabled';
					div.className = 'col-mid-5';
					div.appendChild(input);
					element.appendChild(div);
				}
				else if(type == 'textarea'){
					var textarea = document.createElement('textarea');
					textarea.name = 'textarea' + i;
					var div = document.createElement('div');
					div.className = 'col-mid-5';
					textarea.disabled = 'disabled';
					div.appendChild(textarea);
					element.appendChild(div);
				}
				element.dataset.qobj = JSON.stringify(questionObject);
				element.appendChild(tools);
				form.appendChild(element);
				questionObject.answerArray = [];
			}
		}
	},

	init:jQuery(function($) {
		surveyCreator.toggleQuestion();
		surveyCreator.addChoice();
		surveyCreator.addEditChoice();
		surveyCreator.questionType();
		surveyCreator.removeChoice();
		surveyCreator.removeElement();
		surveyCreator.editElement();
		surveyCreator.closeEdit();
		surveyCreator.moveUp();
		surveyCreator.moveDown();
		surveyCreator.saveChanges();
		surveyCreator.submitSurvey();
		surveyCreator.loadSurvey();
	})
};

/**
 * Render modals
 */
jQuery(function ($) {
	$('.modal.fade.no-trigger').modal();
});
