(function ($) {
  $(document).ready(function(){
    if($('body').hasClass('page-media-guide')){
      $('.view-media-guide .views-field-field-differences').each(function(){
        var addButton = false;
        $(this).find('.field_row').each(function(){
          if($(this).index() > 5){
            $(this).addClass('hidden');
            addButton = true;
          }
        });
        if(addButton == true){
          $(this).append('<div class="showHiddenFieldsContainer"><div class="showHiddenFields media-button off">View More Info</div></div>');
        }
      });
      $('.showHiddenFields').click(function(){
        if($(this).hasClass('off')){
          $(this).closest('.views-field-field-differences').find('.field_row.hidden').addClass('showing').removeClass('hidden');
          $(this).html('View Less Info');
          $(this).removeClass('off');
        }else{
          $(this).closest('.views-field-field-differences').find('.field_row.showing').addClass('hidden').removeClass('showing');
          $(this).html('View More Info');
          $(this).addClass('off');
        }
      });

      // Create print button.
      $('.print').click(function(){
        window.print();
      });
    }
  });
})(jQuery);