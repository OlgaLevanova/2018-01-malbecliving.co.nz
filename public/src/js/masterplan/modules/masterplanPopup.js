const $ = require('jquery');
const masterplanVar = require('./masterplanVar.js');
const mapboxgl = require('mapbox-gl');
const masterplanHighlight = require('./masterplanHighlight.js');
const masterplanUtilits = require('./masterplanUtilits.js');
var drag = require('./../../drag.js');

var $newPlan = null;

var MasterplanPopup = {
    createPopUp: function(map, popupInfo, lngLat){
        new mapboxgl.Popup()
            .setLngLat(lngLat)
            //.setHTML(e.features[0].properties.name)
            .setHTML( getPopUpInfo( popupInfo ) )
            .addTo(map)
            .on('close', function() {
                closePlan();
                // Remove all highlighted lots
                masterplanHighlight.removeHighlight(map);
            });

        $('body').find('.mapboxgl-popup').addClass('mapboxgl-popup-show');
    },
    showPlan: function(plan){

        var planImg = new Image() ;
        var _this = this;
        planImg.src = plan;
        planImg.onload = function() {

            var bottomOffset = masterplanVar.$body.find('.lot-popup-info-tbl').height() - 5;
            var htmlPlan = '<div class="lot-popup-plan">' +
                '<div class="lot-popup-plan-close">Close plans</div>' +
                '<div class="lot-popup-plan-inner">' +
                '<img src="' + plan + '" alt="" draggable="false"></div></div>';

            togglePDFLink();

            masterplanUtilits.toggleFullScreenButtonColor();

            if(window.innerWidth <= masterplanVar.smallBreakpoint) _this.toggleLotInfo();

            masterplanVar.$masterplanMapbox.append(htmlPlan);

            $newPlan = masterplanVar.$body.find('.lot-popup-plan');

            $newPlan.fadeIn(300);

            drag.init( $newPlan.find('img') );

            masterplanVar.$masterplanMapbox.on('click', '.lot-popup-plan-close', closePlan);
        };
    },
    toggleLotInfo: function(){
        var infoToggle = masterplanVar.$body.find('.lot-popup-info-inner--toggle');

        infoToggle.fadeToggle(100);
    }
};

function getPopUpInfo(lotInfo){
    var htmlStr = '',
        htmlStrAgent = '',
        htmlStrImage = '',
        htmlStrLotPlan = '',
        htmlStrLotPlanPdf = '',
        htmlStrImages = '',
        queryStr = '?lotGroup=' + lotInfo.lotGroup + '&lotId=' + lotInfo.lotId;

    if( lotInfo.lotAgentLogoImage != ''){
        htmlStrAgent = '<div class="lot-popup-agent lot-popup-cell"><img src="' + lotInfo.lotAgentLogoImage + '" alt=""></div>';
    }
    if( lotInfo.lotImage != ''){
        htmlStrImage = '<div class="lot-popup-image lot-popup-cell"><img src="' + lotInfo.lotImage + '" alt=""></div>';
    }
    if( lotInfo.lotAgentLogoImage != '' || lotInfo.lotImage != '' ){
        htmlStrImages = '<div class="lot-popup-images">' +
            htmlStrAgent + htmlStrImage +
            '<div class="lot-popup-images-close"></div>' +
            '</div>';
    }
    if( lotInfo.lotPlan != '' ){
        htmlStrLotPlan = '<div class="lot-popup-info-links lot-popup-info-links-plan lot-popup-cell">' +
            '<a href="#" class="lot-popup-info-view" id="view-plans" data-plan="' + lotInfo.lotPlan + '">View plans</a>' +
            '</div>';
    }
    if( lotInfo.lotPlanPdf != '' ){
        htmlStrLotPlanPdf = '<div class="lot-popup-info-links-pdf lot-popup-cell">' +
            '<a href="' + lotInfo.lotPlanPdf + '" target=”_blank”>Download plans</a>' +
            '</div>';
    }
    if(lotInfo.lotAgentEmail != ''){
        queryStr += '&email=' + lotInfo.lotAgentEmail;
    }

    var htmlStrInfo = '<div class="lot-popup-info">' +
        '<div class="lot-popup-info-tbl">' +
        htmlStrAgent +
        htmlStrImage +
        '<div class="lot-popup-info-id lot-popup-cell"><div id="lot-popup-info-id">' + lotInfo.lotTitle + '</div>' +
        '</div>' +
        '<div class="lot-popup-info-inner lot-popup-cell lot-popup-info-inner--toggle">' +
        '<div class="lot-popup-info-tbl">' +
        '<div class="lot-popup-info-inner lot-popup-cell">' +
        '<b>' + lotInfo.lotArea + 'm2</b> section <span class="lot-popup-hide-mobile">with resource consent for a <b>' + lotInfo.lotLevels + '</b> level, <b>' + lotInfo.lotBedrooms + '</b> bedroom,</span> <b>' + lotInfo.houseArea + 'm2</b> standalone house.' +
        '</div>' +
        htmlStrLotPlan +
        htmlStrLotPlanPdf +
        '<div class="lot-popup-info-links lot-popup-info-links-enquire lot-popup-cell">' +
        '<a href="' + lotInfo.contactPageURL + queryStr + '" class="lot-popup-info-enquire">Enquire</a>' +
        '</div>' +
        '<div class="lot-popup-info-empty lot-popup-cell">' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';

    htmlStr = '<div class="lot-popup">' +
        htmlStrInfo + htmlStrImages +
        '</div>';

    return htmlStr;
}

function closePlan(){

    if( $newPlan !== null ) {

        togglePDFLink();

        masterplanUtilits.toggleFullScreenButtonColor();

        drag.stopDrag( $newPlan.find('img') );

        $newPlan.fadeOut(300, function(){

            $(this).remove();
        });

        masterplanVar.$masterplanMapbox.off('click', '.lot-popup-plan-close', closePlan);

        $newPlan = null;
    }
}

function togglePDFLink(){
    var $pdfLink = masterplanVar.$body.find('.lot-popup-info-links-pdf');
    var $planLink = masterplanVar.$body.find('.lot-popup-info-links-plan');

    if( $pdfLink !== null && $pdfLink.length > 0 ){
        $pdfLink.toggleClass('show');
    }

    $planLink.toggleClass('hide');
}

module.exports = MasterplanPopup;