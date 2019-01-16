var $ = require('jquery');

function SendForm() {

    var _this = this,
        fieldParentClass = '.hidden_label', // Wrapper of each field
        $captchaParent = $('.g-recaptcha-wrapper'),
        $form = $( '#enquire-form'),
        errorClass ='field-error',
        isValid = true,
        isCaptchaChecked = false;

    _this.init = function(){
        $form.submit(function( e ) {
            //e.preventDefault();

            if (!validateForm()) {
                e.preventDefault();
            }
        });
    };

    var validateForm = function() {

        $form.find('[data-required]').each(function(){

            var isThisFieldValid = true;

            isValid = true;

            // Validate different type of form's fields
            switch($(this).attr('type')) {
                case 'email':
                    isThisFieldValid = isEmailValid( $(this) );
                    break;
                case 'checkbox':
                    isThisFieldValid = isCheckboxValid( $(this) );
                    break;
                default:
                    isThisFieldValid = isFieldValid( $(this) );
            }

            // Show/Hide error on each field
            toggleError( isThisFieldValid, $(this) );
        });

        // Validate gCaptcha and show/hide error
        if( !isCaptchaChecked ) {
            toggleError(isCaptchaValid(), $captchaParent);
        }

        return isValid;
    };

    // Email field
    var isEmailValid = function($field) {
        var regex = /\S+@\S+\.\S+/;
        return regex.test( $field.val() );
    };

    // Common text field
    var isFieldValid = function($field) {
        return $field.val() != '';
    };

    // Checkbox
    var isCheckboxValid = function($field) {
        return $field.is(":checked");
    };

    var isCaptchaValid = function() {

        var response = grecaptcha.getResponse(),
            isResponseValid = response.length != 0;

        //reCaptcha verified. Don't need to check it again
        if(isResponseValid) isCaptchaChecked = true;

        return isResponseValid;
    };

    var showError = function($field) {
        $field.parents(fieldParentClass).addClass(errorClass);
    };

    var hideError = function($field) {
        $field.parents(fieldParentClass).removeClass(errorClass);
    };

    var isHasError = function($field) {
        return $field.parents(fieldParentClass).hasClass(errorClass);
    };

    var toggleError = function( isThisFieldValid, $elem ) {

        if( !isThisFieldValid ) {
            showError( $elem );
            isValid = false;
        } else {
            if( isHasError( $elem ) ) hideError( $elem );
        }
    }

}
$(function(){

    var sendForm = new SendForm();
    sendForm.init();

});