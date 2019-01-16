var $ = require('jquery');
var EqualHeight = require('./equal-height.js');

function AjaxNews(){

    var page = 2,
        newsPerPage = 3,
        newsTotal = $('.news-listing').data('news-total'),
        $button = $('#loadMore'),
        $loading = $('#loading'),
        $newsContainer = $("#news-container"),
        $newsLast = $('#item-last');

    this.init = function(){
        if( $newsContainer.length > 0 ){

            $button.click (function (e) {
                e.preventDefault();

                showNewsBlock();
            });

            // Show news 3 - 6
            showNewsBlock();

        }
    };

    function showNewsBlock(){

        $loading.show();

        $.get( "/community/p"+page, function( data ) {

            var newsOnPage = page*newsPerPage;

            if(newsOnPage > newsTotal){
                newsOnPage = newsTotal;
            }

            // Show next news
            $newsContainer.append( data );

            // Hide preloader
            $loading.hide();

            // Update counter of visible news on page
            $newsLast.text( newsOnPage );

            // Hide 'Load more' button if all news are visible
            if(newsOnPage == newsTotal){
                $button.hide();
            }

            // Find images' blocks that should have equal heights
            var newImages = $newsContainer.find('[data-equal="image-' + page + '"]');

            // Init script only if there are 2 blocks that should have equal heights
            if( newImages.length > 1 ) new EqualHeight().init( newImages );

            // If there is only 1 block add class to add gap between first and second images
            if( newImages.length == 1 ) newImages.addClass('news-3blocks-image--single');

            page++;

        });
    }
}

$(function(){
    new AjaxNews().init();
});