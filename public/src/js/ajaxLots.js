var $ = require('jquery');

function AjaxLots(){

    var _this = this,
        page = 2,
        itemsPerPage = 2,
        $button = $('#loadMore'),
        $loading = $('#loading'),
        $itemsContainer = $("#lots-table"),
        $itemLast = $('#item-last'),
        $locale = $('#loadMore').attr('data-locale'),
        itemsTotal = $itemsContainer.data('items-total');

    this.init = function(){
        if( $itemsContainer.length > 0 ){

            $button.click (function (e) {
                e.preventDefault();

                _this.showNewItems();
            });

        }
    };

    this.showNewItems = function(){

        $loading.show();

        var $locale = this.$locale === 'zh' ? '/cn' : '/en';

        $.get(`${$locale}/masterplan/p${page}&level=2,3`, function( data ) {

            var itemsOnPage = page*itemsPerPage;

            if(itemsOnPage > itemsTotal){
                itemsOnPage = itemsTotal;
            }

            // Show next news
            $itemsContainer.append( data );

            // Hide preloader
            $loading.hide();

            // Update counter of visible news on page
            $itemLast.text( itemsOnPage );

            // Hide 'Load more' button if all news are visible
            if(itemsOnPage == itemsTotal){
                $button.hide();
            }

            page++;

        });
    }
}

$(function(){
    new AjaxLots().init();
});