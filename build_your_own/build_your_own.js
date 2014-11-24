(function($) {
    Drupal.behaviors.build_your_own = {
        attach: function(context, settings){
            if($('body', context).hasClass('page-products-build-your-own')){
                // Initialize price trigger
                $('#edit-trigger-the-price').trigger('trigger-the-prices');
            }
        }
    };

    $(document).ready(function() {
        build_your_own_tab_behavior();
        if($('body').hasClass('page-products-build-your-own')){
            // var counter = 0;
            var browser = navigatorSaysWho(); 
            var browser = splitString(browser, ' ');
            var browser = browser[0];
            // console.log(browser);
            if(browser == 'Firefox'){
                $('#build-your-own-price input').css('margin', '-2px 0px 0px -3px');
            }
            // Add focus class on page load so function can detect change
            $('#edit-build-your-own-dvd-options-oneSelectBoxItOptions, #edit-build-your-own-dvd-options-twoSelectBoxItOptions').children().each(function(){
                if(!$(this).hasClass('selectboxit-focus')){
                    if($(this).hasClass('selectboxit-selected')){
                        $(this).addClass('selectboxit-focus');
                    }
                }
            });

            // On select change, run different dvd options func
            $(document).on('change', '.form-item-build-your-own-dvd-options-one, .form-item-build-your-own-dvd-options-two', function(e){
                
                build_your_own_different_dvd_options($("#edit-build-your-own-dvd-options-oneSelectBoxItOptions"), $("#edit-build-your-own-dvd-options-twoSelectBoxItOptions"));
            });
        }
    });
    
    $(document).ajaxStart(function() {
        build_your_own_tab_behavior();
    });

    $(document).ajaxComplete(function() {
        build_your_own_tab_behavior();            
    });

    $(document).ajaxStop(function(){
        build_your_own_tab_behavior();
        
        //Initialize and set price    
        var price = $('#build-your-own-price-catcher input').prop('value');                
        $('#edit-build-your-own-item-price').prop('value', price);
        if($('body').hasClass('page-products-build-your-own')){
            build_your_own_different_dvd_options($("#edit-build-your-own-dvd-options-oneSelectBoxItOptions"), $("#edit-build-your-own-dvd-options-twoSelectBoxItOptions"));        
                // console.log('ready');
        }

        var browser = navigatorSaysWho(); 
        var browser = splitString(browser, ' ');
        var browser = browser[0];
        // console.log(browser);
        if(browser == 'Firefox'){
            $('#build-your-own-price input').css('margin', '-2px 0px 0px -3px');
        }
    });
    
    // Functions
    // Doesn't allow the two dvd selections to be the same
    function build_your_own_different_dvd_options(optionSet1, optionSet2){
            var focus = 'selectboxit-focus';
            var selected = 'selectboxit-selected';        
            window.firstDvdSelection = false;
            window.seconDDvdSelection = false;

            // Find element in first select
            optionSet1.children().each(function(){
                if($(this).hasClass(focus)){
                    window.firstDvdSelection = $(this);
                }    
            });
            // Find element in second select
            optionSet2.children().each(function(){
                if($(this).hasClass(focus)){
                    window.seconDDvdSelection = $(this);
                }    
            });

            // If they are not undefined and if they are the same
            if(window.firstDvdSelection != false && window.seconDDvdSelection != false){
                if(window.firstDvdSelection.text() == window.seconDDvdSelection.text()){
                    // Initialize selectboxit
                    var selectBox = $('#build-your-own-two select').selectBoxIt().data('selectBox-selectBoxIt');
                    selectBox.selectOption(0);
                }    
            }
    }

    // Changes tabs and mimic's quicktabs module functionality
    function build_your_own_tab_behavior(){   
        // Change the select boxes in the checkout pages.
        if($('body').hasClass('page-products-build-your-own')){
            $('.page-products-build-your-own select').selectBoxIt();
            // Add text for Hula Hoop Descriptions
            $('.add-on-product-info .BLUE.product-name').html('Hula Hoop <sup>®</sup> - 20% OFF');

            $(document).on('click', '#build-your-own-include-tab .item-list li a', function(e){
                e.preventDefault();
                e.stopPropagation();
                var thisID = $(e.target).parent().attr('id');
                // Remove class from anchors
                $(this).parent().siblings().removeClass('active');   
                $(this).parent().addClass('active');
         
                // Remove active from content
                $(e.target).parent().parent().parent().siblings().removeClass('active');
                $(e.target).parent().parent().parent().siblings().each(function(){
                    if(thisID == $(this).attr('id')){
                        $(this).addClass('active');
                    }
                });
                return false;
            }); 
        }
    }

    // String splitter
    function splitString(stringToSplit, separator) {
      var arrayOfStrings = stringToSplit.split(separator);

      return arrayOfStrings;
        
    }

    // Browser Detection
    function navigatorSaysWho(){
        var ua= navigator.userAgent, tem, 
        M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if(/trident/i.test(M[1])){
            tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE '+(tem[1] || '');
        }
        if(M[1]=== 'Chrome'){
            tem= ua.match(/\bOPR\/(\d+)/)
            if(tem!= null) return 'Opera '+tem[1];
        }
        M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
        if((tem = ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
        return M.join(' ');
    }

})(jQuery);