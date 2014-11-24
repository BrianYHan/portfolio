(function ($) {
  $(document).ready(function(){
    //addEditLink($('td.edit-vote-link'));

    //Allows iPhones and iPads to interact with app
    if((navigator.userAgent.match(/iPhone/i)) || (navigator.userAgent.match(/iPod/i)) || (navigator.userAgent.match(/iPad/i))) {
      $(".page-qac .queen-ranking-cover").click(function(){  
      });
    }

    //Cover radio buttons with attractive cover for ipad rank page
    $('.page-qac .queen-ranking-cover').click(function(){
      $('.page-qac .queen-ranking-cover').removeClass('selected');
      $(this).addClass('selected');
      $('#edit-queen-rankings input').removeAttr('checked');
      $('#edit-queen-rankings input[value="' + $(this).attr('value') + '"]').attr('checked', true);
    });


  });//end of doc ready

  function addEditLink(element){
    element.each(function(){
      var link = $(this).attr('attribute');
      var anchor = $(document.createElement('a'));
      anchor.attr('href', link).html('EDIT').addClass('edit-vote-link');
      $(this).append(anchor);
    });
  }

})(jQuery);