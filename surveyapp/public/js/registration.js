jQuery(function($){
	$("form.form-signin.register, form.form-profile.update-profile, form.form-profile.form-inline,form.navbar-form.form-validetta, form.form-inline.form-validetta, form.form-profile.form-horizontal.form-validetta, form.form-validetta").validetta({
		customReg : {
			strength : {
				method: /^(?=.*[.,?!])(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z]).{8,}/,
				errorMessage : 'Your password must contain at least 8 characters, 1 upper case and lower case letter and on punctuation mark.'
			}
			, phoneNumber : {
				method: /^(?:(?:\+?1\s*(?:[.-]\s*)?)?(?:\(\s*([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9])\s*\)|([2-9]1[02-9]|[2-9][02-8]1|[2-9][02-8][02-9]))\s*(?:[.-]\s*)?)?([2-9]1[02-9]|[2-9][02-9]1|[2-9][02-9]{2})\s*(?:[.-]\s*)?([0-9]{4})(?:\s*(?:#|x\.?|ext\.?|extension)\s*(\d+))?$/,
				errorMessage : 'Please use a valid phone number syntax'
			}
		}
		, realTime : true
	});
});