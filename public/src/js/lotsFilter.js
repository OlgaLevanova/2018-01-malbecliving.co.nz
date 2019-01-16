var $ = require('jquery');
var noUiSlider = require('nouislider');
var masterplan = require('./masterplan/masterplan-new');

function LotsFilter() {

    // Filter's variables
    var slider = document.getElementById('slider-handles'),
        classLevel = 'lots-filter--level',
        classStatus = 'lots-filter--status',
        levelCheckboxes = document.getElementsByClassName(classLevel),
        statusCheckboxes = document.getElementsByClassName(classStatus),
        areaMinField = document.getElementById('slider-input-min'),
        areaMaxField = document.getElementById('slider-input-max'),
        $filterButton = $('#lots-filter-button'),
        $filter = $('#lots-filter'),
        filterOpenClass = 'filter-open';

    // Ajax's variables
    var page = 2,
        itemsPerPage = 20,
        level = '',
        status = '',
        area  = '',
        searchString = '',
        itemsOnPage = '',
        $button = $('#loadMore'),
        $locale = $button.attr('data-locale'),
        $loading = $('#loading'),
        $itemsContainer = $("#lots-table"),
        $itemLast = $('#item-last'),
        $itemsTotal = $('#items-total'),
        $pagination = $('.pagination'),
        $singleItem = $('.single-item'),
        $suffixItem = $('.suffix-item'),
        itemsTotal = $itemsContainer.find('tr:first-child').data('items-total');

    this.init = function() {

        // Set variables
        searchString = setSearchString();
        itemsOnPage = getItemsOnPage();

        // Create Slider and listen for changes
        if( (typeof(slider) != 'undefined' && slider != null) ) initSlider(slider);

        // Listen for checkboxes changes
        initCheckboxes();

        // Listen Pagination button
        if( $itemsContainer.length > 0 ){

            $button.click (function (e) {
                e.preventDefault();

                showNewItems();
            });

        }

        $filterButton.click (function () {
            toggleFilter();
        });

        $('body').on('click', '[data-lot]', function(){
            masterplan.showLotInfo( $(this).data('lot-marker'), $(this).data('lot') );
        });

    };

    function initSlider(slider){

        var minVal = Number(areaMinField.dataset.rangemin);
        var maxVal = Number(areaMaxField.dataset.rangemax);

        noUiSlider.create(slider, {
            start: [ minVal, maxVal ],
            range: {
                min: minVal,
                max: maxVal
            }
        });

        // Update input field when slider is moving
        slider.noUiSlider.on('update', function( values, handle ) {

            var value = Math.round( values[handle] );

            if ( handle == 0 ) {
                areaMinField.textContent = value + 'm2';
            } else {
                areaMaxField.textContent = value + 'm2';
            }

        });

        // Set new search when slider stop moving
        slider.noUiSlider.on('end', function() {
            resetFilter();
        });
    }

    // Set new search when checkbox is changed it's state
    function initCheckboxes(){
        [].forEach.call(levelCheckboxes, function (checkbox) {
            checkbox.onchange = resetFilter;
        });

        [].forEach.call(statusCheckboxes, function (checkbox) {
            checkbox.onchange = resetFilter;
        });
    }

    function resetFilter(){

        // Remove all items
        clearItems();

        // Reset Ajax's param
        resetParam();

        // Set new string for Ajax search
        setSearchString();

        // Show new items according to new param
        showNewItems();
    }

    function showNewItems(){

        $loading.show();

        var $lang = $locale === 'zh' ? '/cn' : '';

        $.get( $lang + "/masterplan/" + searchString, function( data ) {

            // Show next lots
            $itemsContainer.find('tbody').append( data );

            // Reset total number of items
            // Hide 'Load more' button if all items are visible
            updatePagination();

            // Hide preloader
            $loading.hide();

            page++;

            // Update string for Ajax search (page is updated)
            setSearchString();

        });
    }

    function resetParam(){
        // Start pagination from first page
        page = 1;

        // Reset level and status search string
        resetLevelStatus( classLevel, 'level' );

        resetLevelStatus( classStatus, 'status' );

        // Reset area search string
        resetArea();
    }

    function resetLevelStatus( elClass, param ){

        var str = '';

        $('.' + elClass + ':checked').each(function(){
            str += $(this).data('checkbox') + ',';
        });

        str = str.substring(0, str.length - 1);

        if( param == 'level' ) {
            level = str;

            // If all levels are unchecked, set level to 0
            // In this case filter won't find anything
            // Otherwise it'll show all entries
            if(level == '') level = '0';
        }
        else {
            status = str;

            // If all status are unchecked, set status to forSale
            // Filter will find only forSale entries
            // Otherwise it'll show all entries
            if(status == '') status = 'forSale';
        }
    }

    function resetArea(){
        var areaMinVal = areaMinField.textContent;
        var areaMaxVal = areaMaxField.textContent;
        area = areaMinVal.substring(0, areaMinVal.length - 2) + ',' +
            areaMaxVal.substring(0, areaMaxVal.length - 2);
    }

    function setSearchString(){
        searchString = 'p' + page;

        if( level != '' ) searchString += '&level=' + level;

        if( status != '' ) searchString += '&status=' + status;

        if( area != '' ) searchString += '&area=' + area;

        return searchString;
    }

    function clearItems(){
        /*$itemsContainer.find('tr').fadeOut(300, function(){
            $(this).remove();
        });*/
        $itemsContainer.find('tr').remove();
    }

    function updatePagination(){

        itemsTotal = $itemsContainer.find('tr:first-child').data('items-total');

        itemsOnPage = getItemsOnPage();

        // Toggle whole pagination section
        // If nothing is found, hide pagination section
        togglePagination();

        // Toggle More button
        // If all found lots are visible, hide button
        toggleButton();

        // If only 1 lot was found, change text in pagination block
        toggleSingleItem();

        // If total number of found lots is less then 10, hide first 0 in pagination
        toggleSuffix();

        // Update counter of visible lots on page
        $itemLast.text( itemsOnPage );

        // Update total number of found items
        $itemsTotal.text( itemsTotal );
    }

    function getItemsOnPage(){

        itemsOnPage = page*itemsPerPage;

        if(itemsOnPage > itemsTotal){
            itemsOnPage = itemsTotal;
        }

        return itemsOnPage;
    }

    function toggleFilter(){
        if( $filter.hasClass(filterOpenClass)) {
            $filter.removeClass(filterOpenClass);
            $filter.fadeOut();
            $filterButton.removeClass('active');
        } else {
            $filter.addClass(filterOpenClass);
            $filter.fadeIn();
            $filterButton.addClass('active');
        }
    }

    function togglePagination(){
        // Toggle whole pagination section
        // If nothing is found, hide pagination section
        if( itemsTotal == 0 ) $pagination.hide();
        else{
            if( $pagination.is(':hidden') ) $pagination.show();
        }
    }

    function toggleButton(){
        // Toggle More button
        // If all found lots are visible, hide button
        if(itemsOnPage == itemsTotal){
            $button.hide();
        } else {
            $button.show();
        }
    }

    function toggleSingleItem(){

        if( itemsTotal == 1) {
            $singleItem.hide();
        } else {
            if( $singleItem.is(':hidden') ) $singleItem.show();
        }
    }

    function toggleSuffix(){

        if( itemsTotal < 10 ) {
            $suffixItem.hide();
        } else {
            if( $suffixItem.is(':hidden') ) $suffixItem.show();
        }
    }
}

(function() {
    var filter = document.getElementById('lots-filter');

    if( (typeof(filter) != 'undefined' && filter != null) )  var lotsFilter = new LotsFilter().init();
})();