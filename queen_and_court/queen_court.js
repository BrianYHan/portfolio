(function ($) {
  $(document).ready(function(){
    $('.page-qac-review').on('click', '.editable', function(){
      var aid = $(this).closest('tr').attr('aid');
      var uid = $(this).attr('uid');
      $(this).attr('originalValue', $(this).html());

      // Remove any other instances of the score options that have been unselected.
      $('.scoreOption').each(function(){
        var parent = $(this).parent().parent();
        var originalValue = parent.attr('originalValue');
        parent.empty().append(originalValue);
      });

      $(this).empty().append('<div><div class="scoreOption">RC</div><div class="scoreOption">DQ</div><br/><div class="scoreOption">0</div><div class="scoreOption">1</div><div class="scoreOption">2</div><div class="scoreOption">3</div></div>');
    });

    $('.page-qac-review .editable').on('click', '.scoreOption', function(){
      var cell = $(this).parent().parent();
      var value = $(this).html();
      var aid = cell.closest('tr').attr('aid');
      var uid = cell.attr('uid');
      var rid = cell.closest('table').attr('rid');
      $(this).parent().remove();
      cell.append(value);
      cell.addClass('processing');
      $.ajax({
        url: '/qac/review/' + aid + '/' + uid + '/' + rid + '/' + value,
        cache: false
      })
        .done(function( html ) {
          if(html == 1){
            cell.removeClass('processing');
            var average = 0;
            var count = 0;
            cell.parent().children('.editable').each(function(){
              if($(this).html() == 'DQ' || average == 'DQ'){
                average = 'DQ';
              }else if($(this).html() == 'RC'){
                // Do Nothing
              }else{
                average += ($(this).html() * 1);
                count++;
              }
            });
            if(average != 'DQ'){
              average = (average / count).toFixed(3);
            }
            cell.parent().children('.average').empty().append(average);
          }else{
            cell.removeClass('processing');
            cell.empty().append(cell.attr('originalValue'));
          }
        });
    });

    // Enable previous and next buttons.
    $('.page-qac').on('click', '.previous, .next', function(){
      $(this).addClass('processing');
      var tofr_number = $(this).attr('tofr_number');
      $.ajax({
        url: '/qac/' + tofr_number + '/' + 1,
        cache: false
      })
        .done(function( html ) {
          $('.ajaxToReplace').empty().append(html);
        });
    });

    // Make the quickjump work.
    $('.page-qac').on('click', '.applicantContainer', function(){
      if($('.result').length > 0){
        return;
      }
      var keypad = '<div class="result">&nbsp;</div><div class="keypad">';
      for(i = 1; i <= 10; i++){
        num = i;
        if(num == 10){
          num = 0;
        }
        keypad += '<div class="key" number="' + num + '">' + num + '</div>';
      }
      keypad += '<div class="key go">Go!</div>';
      keypad += '<div class="key clear">Clear</div>';
      keypad += '</div>';
      $(this).empty().append(keypad);
      $('.key').click(function(){
        if($('.result').html() == '&nbsp;'){
          $('.result').empty();
        }
        if($(this).hasClass('clear')){
          $('.result').html('&nbsp;');
          return;
        }
        $('.result').append($(this).attr('number'));
        if($('.result').html().length >= 4 || $(this).hasClass('go')){
          $.ajax({
            url: '/qac/' + $('.result').html() + '/' + 1,
            cache: false
          })
            .done(function( html ) {
              $('.ajaxToReplace').empty().append(html);
            });
        }
      });
    });

    // Enable scoring buttons.
    $('.page-qac').on('click', '.scoreButton', function(){
      var thisButton = $(this);
      $(this).addClass('processing');
      var aid = $('.voteContainer').attr('aid');
      var rid = $('.voteContainer').attr('rid');
      var uid = $('.voteContainer').attr('uid');
      var sid = $(this).attr('sid');
      var vid = $(this).parent().attr('vid');
      $.ajax({
        url: '/qac/vote/' + aid + '/' + uid + '/' + rid + '/' + sid,
        cache: false
      })
        .done(function( html ) {
          if(html == 1){
            $('.scoreButton').removeClass('selected');
            $('.scoreButton').removeClass('processing');
            thisButton.addClass('selected');
          }else{
            $('.scoreButton').removeClass('processing');
          }
        });
    });

    // Enable keyboard navigation
    if($('.ajaxToReplace').length > 0){
      $(window).keyup(function(e){
        if(!e.ctrlKey && !e.altKey && !e.shiftKey && $('.keypad').length == 0){
          if(e.keyCode == 82){
            $('.score_RC').click();
          }else if(e.keyCode == 68){
            $('.score_DQ').click();
          }else if(e.keyCode == 96 || e.keyCode == 48){
            $('.score_0').click();
          }else if(e.keyCode == 97 || e.keyCode == 49){
            $('.score_1').click();
          }else if(e.keyCode == 98 || e.keyCode == 50){
            $('.score_2').click();
          }else if(e.keyCode == 99 || e.keyCode == 51){
            $('.score_3').click();
          }else if(e.keyCode == 39){
            $('.next').click();
          }else if(e.keyCode == 37){
            $('.previous').click();
          }else if(e.keyCode == 74){
            $('.applicantContainer').click();
          }
        }else if(!e.ctrlKey && !e.altKey && !e.shiftKey && $('.keypad').length > 0){
          if(e.keyCode == 96 || e.keyCode == 48){
            $('.key[number="0"]').click();
          }else if(e.keyCode == 97 || e.keyCode == 49){
            $('.key[number="1"]').click();
          }else if(e.keyCode == 98 || e.keyCode == 50){
            $('.key[number="2"]').click();
          }else if(e.keyCode == 99 || e.keyCode == 51){
            $('.key[number="3"]').click();
          }else if(e.keyCode == 100 || e.keyCode == 52){
            $('.key[number="4"]').click();
          }else if(e.keyCode == 101 || e.keyCode == 53){
            $('.key[number="5"]').click();
          }else if(e.keyCode == 102 || e.keyCode == 54){
            $('.key[number="6"]').click();
          }else if(e.keyCode == 103 || e.keyCode == 55){
            $('.key[number="7"]').click();
          }else if(e.keyCode == 104 || e.keyCode == 56){
            $('.key[number="8"]').click();
          }else if(e.keyCode == 105 || e.keyCode == 57){
            $('.key[number="9"]').click();
          }
        }
      });
    }

    // Enable check-in autocomplete.
    var xhr;
    $('.page-qac-check-in').on('keyup', '#quickSearch', function(){
      if($(this).val() != ''){
        searchVar = $(this).val();
      }else{
        searchVar = '[NULL]';
      }
      if(xhr && xhr.readystate != 4){
          xhr.abort();
      }
      xhr = $.ajax({
        url: '/qac/check-in/search/' + searchVar,
        cache: false
      })
        .done(function( html ) {
          $('#resultTableWrapper').empty().append(html);
        });
    });

    $('.page-qac-check-in').on('click', '.checkInRow', function(){
      var row = $(this);
      var aid = $(this).attr('aid');

      if(row.hasClass('laterRound')){
        var timeSlot = $(this).attr('time_slot');
        $('<div title="Check In Applicant?" class="qacCheckin"><div class="statusMessage">Are you sure you want to check<br/><strong>' + row.find('td').eq(2).html() + ' ' + row.find('td').eq(1).html() + '</strong><br/> in for the <br/><strong>' + row.find('td').eq(3).html() + '</strong> time slot?<br/>This cannot be undone.</div></div>').dialog({
          modal: true,
          buttons: {
            'Ok': function() {
              $( this ).dialog( "close" );
              $.ajax({
                url: '/qac/check-in/get-number/' + aid,
                cache: false
              })
                .done(function( html ) {
                  $('<div title="Applicant Checked In" class="qacCheckin"><div class="statusMessage"><strong>' + row.find('td').eq(2).html() + ' ' + row.find('td').eq(1).html() + '</strong><br/>has been checked in successfully.</div></div>').dialog({
                    modal: true,
                    buttons: {
                      Ok: function() {
                        //$( this ).dialog( "close" );
                        location.href = '/qac/check-in';
                      }
                    }
                  });
                });
            },
            'Cancel': function() {
              $( this ).dialog( "close" );
              return;
            }
          }
        });
      }else{
        $('<div title="Check In Applicant?" class="qacCheckin"><div class="statusMessage">Are you sure you want to check <strong>' + row.find('td').eq(1).html() + ' ' + row.find('td').eq(0).html() + '</strong> in? This cannot be undone.</div></div>').dialog({
          modal: true,
          buttons: {
            'Ok': function() {
              $( this ).dialog( "close" );
              $.ajax({
                url: '/qac/check-in/get-number/' + aid,
                cache: false
              })
                .done(function( html ) {
                  $('<div title="Applicant Checked In" class="qacCheckin"><div class="statusMessage"><strong>' + row.find('td').eq(1).html() + ' ' + row.find('td').eq(0).html() + '</strong><br/>has been checked in successfully.<br/><br/><table style="border: 0; width: 100%"><tr><th>DOB</th><td> ' + row.find('td').eq(2).html() + '</td></tr><tr><th>Address</th><td> ' + row.find('td').eq(3).html() + '</td></tr><tr><th>City</th><td> ' + row.find('td').eq(4).html() + '</td></tr><tr><th>School</th><td> ' + row.find('td').eq(5).html() + '</td></tr><tr><th>Email</th><td> ' + row.find('td').eq(6).html() + '</td></tr></table><br/><br/>The badge number is:</div><div class="badgeNumber">' + html + '</div></div>').dialog({
                    modal: true,
                    buttons: {
                      Ok: function() {
                        //$( this ).dialog( "close" );
                        location.href = '/qac/check-in';
                      }
                    }
                  });
                });
            },
            'Cancel': function() {
              $( this ).dialog( "close" );
              return;
            }
          }
        });
      }
    });

    // Enable the accept/reject buttons in the admin interface.

    $('.page-qac-tofr-review').on('click', 'div.form-submit', function(){
      var thisButton = $(this);
      var aid = $(this).closest('tr').attr('aid');
      $.ajax({
        url: '/qac/tofr-review/' + aid + '/' + $(this).attr('action'),
        cache: false
      })
        .done(function( html ) {
          if(thisButton.attr('action') == 'D'){
            thisButton.attr('action', 'A').empty().append('Accept').addClass('accept');
            thisButton.closest('tr').removeClass('pass').addClass('doNotPass');
          }else{
            thisButton.attr('action', 'D').empty().append('Reject').removeClass('accept');
            thisButton.closest('tr').removeClass('doNotPass').addClass('pass');
          }
        });
    });

    // Detect AJAX to remove closing of round.
    $(document).ajaxStart(function(){
      $('.close-round').attr('href', '#');
    });

    $('.close-round').click(function(e){
      var link = $(this);
      e.preventDefault();
      if($(this).attr('href') == '#'){
        $('<div title="Cannot Close Round">You have made a change on this page, making it out of date. Please refresh the page before closing the round.</div>').dialog({
            modal: true,
            buttons: {
              Ok: function() {
                $( this ).dialog( "close" );
              }
            }
          });
      }else{
        $('<div title="Are You Sure?">Are you sure you wish to close the round? <strong>You cannot undo this.</strong></div>').dialog({
            modal: true,
            buttons: {
              Ok: function() {
                var passArray = new Array();
                $('.pass').each(function(){
                  passArray.push($(this).attr('aid'));
                });
                $.ajax({
                  type: "POST",
                  url: "/qac/close-round",
                  data: {passData: JSON.stringify(passArray)}
                })
                  .done(function( msg ) {
                    location.href = '/qac/review';
                  });
              },
              Cancel: function() {
                $( this ).dialog( "close" );
              }
            }
          });
      }
    });

    // Detect AJAX to remove sending to sports systems.
    $(document).ajaxStart(function(){
      $('.sports-systems').attr('href', '#');
    });

    $('.sports-systems').click(function(e){
      var link = $(this);
      e.preventDefault();
      if($(this).attr('href') == '#'){
        $('<div title="Cannot Send to Sports Systems">You have made a change on this page, making it out of date. Please refresh the page before sending the data to Sports Systems.</div>').dialog({
            modal: true,
            buttons: {
              Ok: function() {
                $( this ).dialog( "close" );
              }
            }
          });
      }else{
        $('<div title="Are You Sure?">Are you sure you wish to send this information to Sports Systems? <strong>You cannot undo this.</strong></div>').dialog({
            modal: true,
            buttons: {
              Ok: function() {
                var passArray = new Array();
                var timeArray = new Array();
                $('.pass').each(function(){
                  passArray.push($(this).attr('aid'));
                  timeArray.push($(this).find('.time').attr('time'));
                });
                $.ajax({
                  type: "POST",
                  url: "/qac/sports-systems",
                  data: {passData: JSON.stringify(passArray), timeData: JSON.stringify(timeArray)}
                })
                  .done(function( msg ) {
                    console.log(msg);
                    //location.href = '/qac/tofr-review';
                    location.href = msg;
                    $( this ).dialog( "close" );
                  });
              },
              Cancel: function() {
                $( this ).dialog( "close" );
              }
            }
          });
      }
    });

    // Geo Eligible Ajax
    $('.geoEligible').click(function(){
      $('<div title="Address Information" class="addressInformation">Loading...</div>').dialog({
        close: function(event, ui){
          $(this).dialog('destroy').remove();
        }
      });
      var aid = $(this).closest('tr').attr('aid');
      $.ajax({
        url: '/qac/tofr-review/' + aid + '/geo-eligible',
        cache: false
      })
        .done(function( html ) {
          $('.addressInformation').empty().append(html);
        });
    });









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