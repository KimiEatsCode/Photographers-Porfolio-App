/******************************************************************************
 *	JAIPHO BETA, version 0.52.00
 *	(c) 2009 jaipho.com
 *
 *	JAIPHO is freely used under the terms of an LGPL license.
 *	For details, see the JAIPHO web site: http://www.jaipho.com/
 ******************************************************************************/
				
function JphSlider_Slider( app)
 {
 	this.mrApp				=	app;
	
 	this.mhSliderTable		=	null;
 	this.mhSliderDiv		=	null;
	this.mhSliderOverlay	=	null;
	

	this.mrToolbars			=	null;	
	this.mrSliderNavi		=	null;
	this.mrSlideshow		=	null;
	this.mrCompnents		=	null;
	
	this.mCurrent			=	0;
	this.mrCurrentSlide		=	null;
	
	this.mInitialized		=	false;
	
	this.maSlides			=	new Array();
	
	this.mhTopBar			=	null;
	this.mhBottomBar		=	null;
	
	this.mrPreloader		=	null;
	this.mrImageQueue		=	null;	
	this.mrBehavior			=	null;
	
	this.mVisible			=	true;
	this.mReverse			=	false;
 }
 

 JphSlider_Slider.prototype.Create		=	function()
 {
 	debug('slider: Create()');
	
	debug('slider: initializing preloader');
	this.mrPreloader			=	new JphUtil_Preloader( MAX_CONCURENT_LOADING_SLIDE);
	this.mrImageQueue			=	new JphSlider_ImageQueue( SLIDE_MAX_IMAGE_ELEMENS);	
 	
	debug('slider: creaiting slides');
	var last_slide	=	null;
	for (var i in this.mrApp.mrDao.maImages)
	{
		var image 	=	this.mrApp.mrDao.maImages[i];
		var slide	=	new JphSlider_Slide( this.mrPreloader, this.mrImageQueue, image);	
		this.maSlides[image.mIndex]	=	slide;
		
		if (last_slide != null)
		{
			last_slide.mrNext 	= 	slide;
			slide.mrPrevious	=	last_slide;	
		}
		
		last_slide	=	slide;
	} 	
	
	this.mhSliderOverlay	=	document.getElementById('slider-overlay');
	this.mhSliderDiv		=	document.getElementById('slider-container');
	
	this.mrSlideshow		=	new JphSlider_SlideShow( this);
	this.mrSliderNavi		=	new JphSlider_SliderControls( this);
	this.mrBehavior			=	new JphSlider_Behavior( this);
	this.mrBehavior.Init();
 }
 
 
 JphSlider_Slider.prototype.Init		=	function()
 {
 	debug('slider: Init()');
	
	this.mhTopBar				=	document.getElementById('slider-toolbar-top');
	this.mhBottomBar			=	document.getElementById('slider-toolbar-bottom');

	this.mrDescription			=	new JphSlider_Description( this.mrApp);
	this.mrDescription.Init();
	
	this.mrToolbars				=	new JphSlider_ToolbarsManager();
	this.mrToolbars.Show();
	
	
	this.mhSliderDiv.innerHTML	=	this._HtmlSlider();
	
	this.mhSliderTable			=	document.getElementById('slider-table');
	this.mhSliderTable.style.webkitTransitionProperty	=	'margin-left';
	this.mhSliderTable.style.webkitTransitionDuration	=	SLIDE_SCROLL_DURATION;
	
 	this.mrToolbars.Register( this.mhSliderOverlay);
	
	this.mrSliderNavi.Init();
	
	debug('slider: initializing slides');
	for (var i in this.maSlides) 
	{
		this.maSlides[i].Init();
	}
	
	this.mrCurrentSlide		=	this.maSlides[this.mCurrent];	
	
	this.mrCompnents		=	new JphSlider_ComponentVisibility( this);
	
	// TODO: refactor
	var top_tool_touch		= 	new JphUtil_Touches( this.mhTopBar, false);
	top_tool_touch.AttachListener( 'TouchEnd', this.mrBehavior, 'ToolbarTouched');
	top_tool_touch.Init();
	
	var bottom_tool_touch	= 	new JphUtil_Touches( this.mhBottomBar, false);
	bottom_tool_touch.AttachListener( 'TouchEnd', this.mrBehavior, 'ToolbarTouched');
	bottom_tool_touch.Init();
	
	var slider_mover		= 	new JphUtil_Touches( this.mhSliderDiv, true);
	slider_mover.AttachListener( 'TouchEnd', this.mrBehavior, 'SlideTouched');
	slider_mover.AttachListener( 'MovedLeft', this.mrBehavior, 'SlideDraggedLeft');
	slider_mover.AttachListener( 'MovedRight', this.mrBehavior, 'SlideDraggedRight');
	slider_mover.Init();

	var desc_mover			= 	new JphUtil_Touches( this.mrDescription.mhDescContainer, true);
	desc_mover.AttachListener( 'TouchEnd', this.mrBehavior, 'SlideTouched');	
	desc_mover.AttachListener( 'MovedLeft', this.mrBehavior, 'SlideDraggedLeft');
	desc_mover.AttachListener( 'MovedRight', this.mrBehavior, 'SlideDraggedRight');
	desc_mover.Init();

	var text_mover			= 	new JphUtil_Touches( this.mrDescription.mhDescTitle, true);
	text_mover.AttachListener( 'TouchEnd', this.mrBehavior, 'DescriptionTouched');	
	text_mover.Init();
	
	var title_mover			= 	new JphUtil_Touches( this.mrDescription.mhDescText, true);
	title_mover.AttachListener( 'TouchEnd', this.mrBehavior, 'DescriptionTouched');	
	title_mover.Init();

	this.mInitialized		=	true;

	debug('slider: Init() - End');
 }


 JphSlider_Slider.prototype._HtmlSlider		=	function()
 {
 	debug('slider: Html()');
 	
 	var str		=	new Array();
 	var str_1	=	new Array();
 	var str_2	=	new Array();
	var cnt_1	=	0;
			
	for (var i in this.maSlides)
	{
		var slide 		=	this.maSlides[i];
		str_1[cnt_1++]	=	slide.HtmlSlide();
		str_2[cnt_1++]	=	slide.HtmlSpace();
	} 	
	
	str[str.length]	=	'<table cellpadding="0" cellspacing="0" border="0" id="slider-table">';
	str[str.length]	=	'<tr>';
	str[str.length]	=	str_1.join('');
	str[str.length]	=	'</tr>';
	str[str.length]	=	'<tr>';
	str[str.length]	=	str_2.join('');
	str[str.length]	=	'</tr>';
	str[str.length]	=	'</table>';
	
	return str.join('');
 } 
 
 
 /*******************************************/
 /*			SLIDER - NAVIGATION				*/
 /*******************************************/  
 
 // ACTINS
 JphSlider_Slider.prototype.Hide			=	function()
 {
 	debug('slider: Hide()');
	if (!this.mInitialized)
		this.Init();
		
	this.mhSliderDiv.style.display			=	'none';
	this.mhSliderOverlay.style.display		=	'none';
	this.mhSliderTable.style.display		=	'none';
	this.mVisible							=	false;
		
	this.mrDescription.Hide();
	debug('slider: Hide() - End');
 }
 
 JphSlider_Slider.prototype.Show			=	function()
 {
 	debug('slider: Show()');
	if (!this.mInitialized)
		this.Init();
	
	document.body.className					=	'slider';
		
	this.mhSliderDiv.style.display			=	'block';
	this.mhSliderOverlay.style.display		=	'block';
	this.mhSliderTable.style.display		=	'block';
	this.mVisible							=	true;
	
	this.mrCompnents.Show();
	this.mrApp.NormalizeVertical();
	this.SelectSlide( this.mCurrent);
	debug('slider: Show() - End');
 }
 
 JphSlider_Slider.prototype.Previous		=	function()
 {
 	debug('slider: Previous()');
 	if (this.IsFirst())
	{
		this.mrToolbars.Show();
		return ;
	}
	
	this.mReverse	=	true;
	this.SelectSlide( this.mCurrent - 1);
 }
 
 JphSlider_Slider.prototype.Next			=	function()
 {
 	debug('slider: Next()');
 	if (this.IsLast())
	{
		this.mrToolbars.Show();
		return ;
	}
	
	this.mReverse	=	false;
	this.SelectSlide( this.mCurrent + 1);
 }

 JphSlider_Slider.prototype.SelectSlide		=	function( index)
 { 	
	debug('slider: SelectSlide() ['+index+']');
	debug('slider: this.mVisible ['+this.mVisible+']');
		
	if (!this.mInitialized)
		this.Init();
		
 	var last_slide			=	this.mrCurrentSlide;
 	this.mrCurrentSlide		=	this.maSlides[index];	
	this.mCurrent			=	index;

	if (!this.mrCurrentSlide)
		throw Error('Slide not found by index ['+index+']');

	this.mrCurrentSlide.SetActive();
	
	if (last_slide)
		last_slide.SetInactive();
	
	this.RepaintPosition();
	
	this.mrDescription.SetDescription( this.mrCurrentSlide.mrImage);
	this.mrCompnents.FirstTimeTextFix();
	
	this._RepaintInfo();
	this.mrSliderNavi.CheckButons();
	
	this.mrApp.mrHistory.SelectSlide( this.mCurrent);
	this.mrApp.NormalizeVertical();
 }
 
 
// INFO
 JphSlider_Slider.prototype.IsLast	=	function()
 {
 	if ((this.mCurrent + 1) == this.mrApp.mrDao.GetImagesCount())
		return true;	
	return false;
 }
 
 JphSlider_Slider.prototype.IsFirst	=	function()
 {
 	if (this.mCurrent == 0)
		return true;	
	return false;
 }
 
 
 // UTIL

 JphSlider_Slider.prototype.RepaintPosition	=	function()
 {
 	var	left	=	this._GetPositionLeft( this.mCurrent);
	this.mhSliderTable.style.marginLeft	=	left + "px";
 }
 
 JphSlider_Slider.prototype._RepaintInfo		=	function()
 {
 	var count	=	this.mrApp.mrDao.GetImagesCount();
 	var current	=	this.mCurrent + 1;
	this.mrSliderNavi.mhInfo.innerHTML	=	current + ' of ' + count;
 }
 
 JphSlider_Slider.prototype._GetPositionLeft	=	function( index)
 {
	 var space_width	=	20;
	 var width	=	
		 this.mrApp.mrOrientation.mWidth + space_width;
	 return width * index * -1;
 } 
