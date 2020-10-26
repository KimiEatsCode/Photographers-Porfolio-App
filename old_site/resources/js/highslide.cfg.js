hs.graphicsDir = 'resources/js/graphics/';

hs.onKeyDown = function(sender, e) {
if (e.keyCode == 32) return false;
};

hs.Expander.prototype.onImageClick = function (sender) {
   return false;
};

hs.showCredits = false;

hs.align = 'center';

hs.marginTop = 2;
hs.marginRight = 2;
hs.marginBottom = 2;
hs.marginLeft = 2;

hs.dimmingOpacity = 0.50;
hs.dimmingDuration = 0;

hs.lang = {
   loadingText :     '',
   loadingTitle :    ''
};

hs.captionId = 'nav';