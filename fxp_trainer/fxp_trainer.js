(function($) {
    $(document).ready(function() {
      if($('body').hasClass('page-trainer-registration')){
        $('.page-trainer-registration .form-select').selectBoxIt();
      }
      if($('body').hasClass('page-fxp-trainer-edit-profile')){
        $('.page-fxp-trainer-edit-profile .form-select').selectBoxIt();
      }
    });
})(jQuery);