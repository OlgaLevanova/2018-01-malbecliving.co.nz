const newMenu = require('./menu.js');
const newFitImage = require('./fitImage.js');
const newGallerySwiper = require('./gallerySwiper.js');
const newEqualHeight = require('./equal-height.js');
const newEnllax = require('./enllax.js');
const newReveal = require('./reveal.js');
const newAnimatedLines = require('./animatedLines.js');
const newAjaxNews = require('./ajaxNews.js');
const newSendForm = require('./sendForm.js');
const newNotification = require('./notification.js');
const newMasterplan = require('./masterplan/masterplan-new.js');
const newLotsFilter = require('./lotsFilter.js');
const newDraw = require('./mapboxDraw.js');

(function() {
	newMasterplan.init( document.getElementById('masterplan-mapbox') );
})();