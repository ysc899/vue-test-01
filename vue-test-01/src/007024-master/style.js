// STYLE COMMON API
var StyleCommon = StyleCommon || {};
StyleCommon = (function(doc, global) {
	// PRIVATE VARIABLE
	var obj = {};

	// PRIVATE METHOD
	function preventDefault(_evt){
		_evt.preventDefault();
	}

	function preventMomentumScroll(_el){
		var scrollTop = _el.scrollTop,
			offsetHeight = _el.offsetHeight,
			scrollHeight = _el.scrollHeight;
		if(scrollTop == 0){
			_el.scrollTo(0, 1);
			return true;
		}

		if(scrollTop + offsetHeight >= scrollHeight) {
			_el.scrollTo(0, scrollHeight - offsetHeight -1);
			return true;
		}
		return false;
	}

	function pinchZoomHandler(_evt){
		if(_evt.touches.length > 1) _evt.preventDefault();
	}

	function doubleTabZoomHandler(_evt){
		if(!global.lastTouchEnd) global.lastTouchEnd = 0;
		var now = (new Date()).getTime();
		if(now - global.lastTouchEnd <= 300){
			_evt.preventDefault();
		}
		global.lastTouchEnd = now;
	}

	// PUBLIC METHOD
	obj.scrollLock = function(_flag){
		['scroll', 'touchmove', 'mousewheel'].forEach(function(_evtNm){
			if(_flag) window.addEventListener(_evtNm, preventDefault, {passive:false});
			else window.removeEventListener(_evtNm, preventDefault);
		});
	};

	obj.forceScroller = function(_el){
		_el.onscroll = function(_evt){
			preventMomentumScroll(_evt.currentTarget);
		};
		_el.ontouchmove = function(_evt){
			if(!preventMomentumScroll(_evt.currentTarget)){
				_evt.stopPropagation();
			}
		};
		_el.onmousewheel = function(_evt){
			if(!preventMomentumScroll(_evt.currentTarget)){
				_evt.stopPropagation();
			}	
		}
	};

	obj.scrollToSmooth = function(_top){
		var headerHeight = doc.querySelector('.header-wrap') ? doc.querySelector('.header-wrap').offsetHeight : 0;
		window.scrollTo({
			top: _top - headerHeight,
			behavior: 'smooth'
		});
	};

	obj.pinchZoom = function(_use){
		if(_use) doc.addEventListener('touchstart', pinchZoomHandler, {passive:false});
		else doc.removeEventListener('touchstart', pinchZoomHandler);
	};

	obj.doubleTabZoom = function(_use){
		if(_use) doc.addEventListener('touchend', doubleTabZoomHandler, {passive:false});
		else doc.removeEventListener('touchend', doubleTabZoomHandler);
	};
	
	return obj;
})(document, window);

// LAYOUT COMMON MOVEMENT
var Wrapper = Wrapper || {};
Wrapper = (function(doc, global) {
	// ELEMENTS INITIALIZE
	var obj = {},
		header = {
			_that : doc.querySelector('.header-wrap'),
			_back : null,
			_backBtnHandler : backBtnHandler,
			_share : null,
			_shareBtnHandler : null,
			_cart : null,
			_cartCnt : null,
			_cartBtnHandler : null,
			_close : null,
			_closeBtnHandler : closeBtnHandler,
			_sorting: null,
			_addr: null,
			_load : {
				_that : null,
				_timer : null
			}
		},
		body = doc.querySelector('body'),
		scroller = doc.querySelector('html'),
		wrapper = doc.querySelector('.wrapper'),
		container = doc.querySelector('.container'),
		tabBar = doc.querySelector('.tab-bar'),
		beforeTop = 0,
		lastScroll = 0,
		bodyHeight = body.offsetHeight,
		isScoller = false,
		// mainScrollDisabled =false,
		detailVisualWrap = doc.querySelector('.detail-visual-wrap'),
		emphasis = {
			_that :  doc.querySelector('.emphasis-btn-bx'),
			_btn : null,
			_btnHandler : function(){}
		},
		floating = {
			_btn : null,
			_btnHandler : function(){}
		},
		search = {
			_that : doc.querySelector('.header-wrap') ? doc.querySelector('.header-wrap .input-top-src') : null,
			_input : doc.querySelector('.header-wrap') ? doc.querySelector('.header-wrap .input-top-src > input') : null,
			_delBtn : doc.querySelector('.header-wrap') ? doc.querySelector('.header-wrap .input-top-src > .btn-srh-delete') : null,
			_cancelBtn : doc.querySelector('.header-wrap') ? doc.querySelector('.header-wrap .input-top-src > .btn-srh-back') : null
		},
		searchFocus = {
			_that : doc.querySelector('.header-wrap') ? doc.querySelector('.header-wrap .div-srh-focus') : null,
			_hashLst : {
				_that : doc.querySelector('.header-wrap') ? doc.querySelector('.header-wrap .div-srh-focus .hash-lst') : null,
				_data : []
			},
			_recentLst : {
				_that : doc.querySelector('.header-wrap') ? doc.querySelector('.header-wrap .div-srh-focus .recent-srh-lst') : null,
				_data : []
			}
		},
		searchKeyFrame = {
			_that : doc.querySelector('.header-wrap') ? doc.querySelector('.header-wrap .div-srh-keyframe') : null,
			_keyframeLst : doc.querySelector('.header-wrap') ? doc.querySelector('.header-wrap .div-srh-keyframe .srh-keyframe-lst') : null,
			_data : []
		},
		viewCol = {
			_that : null,
			_column1 : null,
			_column2 : null
		},
		prdtList = {
			_that : doc.querySelectorAll('.prdt-list > ul'),
			_cartWrap : []
		},
		scollerGestureCallback,
		cartDelListener;

	// PRIVATE FUNCTIONS
	function initialize(){
		StyleCommon.pinchZoom(true);
		StyleCommon.doubleTabZoom(true);

		global.addEventListener('scroll', wrapperHandler, false);

		if(doc.querySelector('.header-wrap')) {
			header._back = doc.querySelector('.header-wrap .icon-header-back');
			if(header._back) header._back.addEventListener('click', header._backBtnHandler, true);

			header._close = doc.querySelector('.header-wrap .icon-header-close');
			if(header._close) header._close.addEventListener('click', header._closeBtnHandler, true);

			header._share = doc.querySelector('.header-wrap .icon-header-share');

			header._cart = doc.querySelector('.header-wrap .icon-header-cart');
			if(header._cart){
				header._cart.addEventListener('click', cartBtnHandler, true);
				header._cartCnt = header._cart.querySelector('.header-cart-count .txt');
			}

			header._sorting = doc.querySelector('.header-wrap .sorting');
			if(!header._sorting) {
				if(container) header._sorting = container.querySelector('.sorting');
			}

			header._addr = doc.querySelector('.header-wrap .cart-add-bx');

			header._load._that = doc.querySelector('.header-wrap .head-load');
			if(header._load._that) {
				header._load._that.classList.add('open');
				header._load._timer = setTimeout(function(){
					header._load._that.classList.add('close');
					header._load._that.classList.remove('open');
				}, 5000);
			}
		}

		if(emphasis._that){
			emphasis._btn = emphasis._that.querySelector('button');
			if(emphasis._btn) isScoller = (doc.querySelector('.header-wrap') ? bodyHeight - emphasis._that.offsetHeight - doc.querySelector('.header-wrap').offsetHeight : bodyHeight) <= container.offsetHeight;

			if(isScoller) emphasis._that.classList.add('btn-static');
		}

		if(doc.querySelector('.tab-bar')){
			floating._btn = doc.querySelector('.tab-bar').querySelector('button[class=btn-type1]');
		}

		if(search._input){
			search._input.addEventListener('focus', searchFocusHandler, true);
			search._input.addEventListener('blur', searchBlurHandler, true);
			search._input.addEventListener('input', searchInputHandler, true);
			search._delBtn.addEventListener('click', searchInputClearHandler, true);
			search._cancelBtn.addEventListener('click', searchInputClearHandler, true);
			StyleCommon.forceScroller(searchFocus._that.querySelector('.div-srh-src'));
			StyleCommon.forceScroller(searchKeyFrame._that.querySelector('.div-srh-src'));
		}



		if(container){
			container.querySelectorAll('.txt-area textarea').forEach(function(_txtarea){
				var count = _txtarea.parentElement.querySelector('.txt-count'),
					maxlength = _txtarea.getAttribute('maxlength'),
					valuelength = _txtarea.value.length;
				if(!maxlength) {
					maxlength = '500';
					_txtarea.setAttribute('maxlength', maxlength);
				}
				count.innerHTML = '<em>'+valuelength.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')+'</em>/'+ maxlength.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
				_txtarea.addEventListener('input', txtAreaWrapHandler, true);
			});
		}

		global.addEventListener('orientationchange', orientationChangeHandler, true);
		body.addEventListener('load', orientationChangeHandler, true);
	}

	function wrapperHandler(_evt){
		// if(mainScrollDisabled) {
		// 	scroller.scrollTop = beforeTop;
		// 	return false;
		// }
		// doc.querySelector('.sub-tit').innerText = scroller.scrollTop + '|'+ (scroller.scrollHeight - window.innerHeight + '|'+beforeTop);
		if(scroller.scrollTop > beforeTop && scroller.scrollTop > 0){ // UP GESTURE
			if(scroller.scrollTop > 0 && !doc.querySelector('.header-wrap').classList.contains('fixed')){ // ADD HEADER FIXED
				doc.querySelector('.header-wrap').classList.add('fixed');
				// doc.querySelector('.wrapper').style.paddingTop = doc.querySelector('.header-wrap').offsetHeight + 'px';
				doc.querySelector('.wrapper').style.paddingTop = doc.querySelector('.header-wrap').clientHeight + 'px';
				
				tabBarToggle('DOWN');
			}else if(scroller.scrollTop >= scroller.scrollHeight - global.innerHeight){
				tabBarToggle('UP');
			}else{
				tabBarToggle('DOWN');
			}

			if(container && !emphasis._that) {
				// container.style.paddingBottom = '100px';
				if(!container.classList.contains('cont-type1')) container.classList.add('cont-type1');
			}
			if(container && emphasis._that) {
				// container.style.paddingBottom = '0px';
				if(!container.classList.contains('cont-type0')) container.classList.add('cont-type0');
			}

			if(detailVisualWrap){
				if(scroller.scrollTop >= detailVisualWrap.offsetHeight && !doc.querySelector('.header-wrap').classList.contains('header-type')){
					doc.querySelector('.header-wrap').classList.add('header-type');
				}
			}

			if(header._load._that) {
				header._load._that.classList.add('close');
				header._load._that.classList.remove('open');
				if(header._load._timer) clearTimeout(header._load._timer);
			}

			if(scollerGestureCallback) scollerGestureCallback('UP', scroller);
		}else{ // DOWN GESTURE
			if(scroller.scrollTop == 0 && doc.querySelector('.header-wrap').classList.contains('fixed')){ // ON TOP SCROLL POSITION REMOVE HEADER FIXED
				doc.querySelector('.header-wrap').classList.remove('fixed');
				doc.querySelector('.wrapper').style.paddingTop = '0px';
			}

			if(detailVisualWrap){
				if(scroller.scrollTop <= detailVisualWrap.offsetHeight && doc.querySelector('.header-wrap').classList.contains('header-type')){
					doc.querySelector('.header-wrap').classList.remove('header-type');
				}	
			}
			tabBarToggle('UP');

			if(scollerGestureCallback) scollerGestureCallback('DOWN', scroller);
		}

		if(doc.querySelector('.wrapper').classList.contains('banner-type')){
			let currentScroll = doc.documentElement.scrollTop || doc.body.scrollTop;
			if (currentScroll > 0 && lastScroll <= currentScroll) {
				lastScroll = currentScroll;
				header._sorting.style.position = 'static';
				header._sorting.style.top = '0px';
			}else {
				lastScroll = currentScroll;
				header._sorting.style.position = 'sticky';
				header._sorting.style.top = '50px';
				header._sorting.style.transition = '0.5s';
				header._sorting.style.zIndex = '2';
			}
		}

		// if(!mainScrollDisabled) beforeTop = scroller.scrollTop;
		beforeTop = scroller.scrollTop;
	}

	function orientationChangeHandler(){
		setTimeout(function(){
			if(body.offsetHeight < body.offsetWidth){ // LANDSCAPE
			    body.classList.add('lands')
			}else{ // PORTRATE
				body.classList.remove('lands');
			}
		}, 100);
	}

	function backBtnHandler(_evt){
		global.history.back();
	}

	function closeBtnHandler(_evt){
		global.history.back();
	}

	function cartBtnHandler(_evt){
		if(header._cartBtnHandler){
			header._cartBtnHandler(header._cartCnt.innerText);
		}
	}

	function searchInputHandler(_evt){
		if(search._input.value){
			search._delBtn.style.display = 'block';
			searchKeyFrame._that.style.display = 'block';
			StyleCommon.scrollLock(true);
			// mainScrollDisabled = true;
		}else{
			search._delBtn.style.display = 'none';
			searchKeyFrame._that.style.display = 'none';
			StyleCommon.scrollLock(false);
			// mainScrollDisabled = false;
		}
	}

	function searchInputClearHandler(_evt){
		if(search._input) {
			search._input.value = '';
			searchInputHandler();

			if(_evt.target.className == 'btn-srh-back') {
				searchFocus._that.style.display = 'none';
				search._cancelBtn.style.display = 'none';
			}else{
				search._input.focus();
			}
		}
	}

	function searchFocusHandler(_evt){
		if(searchFocus._that) {
			search._cancelBtn.style.display = 'block';
			searchFocus._that.style.display = 'block';
			StyleCommon.scrollLock(true);
			// scroller.scrollTop = 0.1;
			// mainScrollDisabled = true;

			// doc.querySelector('.header.sub').addEventListener('touchmove', function(_evt){
			// 	_evt.preventDefault();
   //         		_evt.stopPropagation();
			// });
			// doc.querySelector('.input-top-src').addEventListener('touchmove', function(_evt){
			// 	_evt.preventDefault();
   //         		_evt.stopPropagation();
			// });
		}
	}

	function searchBlurHandler(_evt){
		// if(search._input){
		// 	setTimeout(function(){scroller.scrollTop = 0;}, 500);
		// }
	}

	function tabBarToggle(_stance){
		// if(mainScrollDisabled) return;
		tabBar = doc.querySelector('.tab-bar');
		header._addr = doc.querySelector('.cart-add-bx');

		if(tabBar) {
			if(_stance == 'DOWN'){
				tabBar.classList.add('scr-tab-bar');
				tabBar.classList.remove('fixed-tab-bar');
			}else if(_stance == 'UP'){
				tabBar.classList.remove('scr-tab-bar');
				tabBar.classList.add('fixed-tab-bar');
			}
		}

		if(search._that && !doc.querySelector('.wrapper').classList.contains('srh-type01')){
			if(_stance == 'DOWN'){
				search._that.classList.add('src-srh');
				search._that.classList.remove('fixed-srh');
			}else if(_stance == 'UP'){
				search._that.classList.remove('src-srh');
				search._that.classList.add('fixed-srh');
			}
		}else if(doc.querySelector('.wrapper').classList.contains('srh-type01') ||  doc.querySelector('.wrapper').classList.contains('lst-type') || doc.querySelector('.wrapper').classList.contains('category-type')){

			if(header._sorting) {
				if(_stance == 'DOWN'){
					header._sorting.classList.add('src-srh');
					header._sorting.classList.remove('fixed-srh');
				}else if(_stance == 'UP'){
					header._sorting.classList.remove('src-srh');
					header._sorting.classList.add('fixed-srh');
				}
			}
		}

		if(doc.querySelector('.header-wrap') && header._addr){
			if(_stance == 'DOWN'){
				header._addr.classList.add('src-srh');
			}else if(_stance == 'UP'){
				header._addr.classList.remove('src-srh');
			}
		}
	}

	function viewColHandler(_evt){
		var classNm = 'view-list-type1';
		
		if(_evt.target == viewCol._column1){
			viewCol._column1.classList.add('on');
			viewCol._column2.classList.remove('on');
		}else if(_evt.target == viewCol._column2){
			viewCol._column1.classList.remove('on');
			viewCol._column2.classList.add('on');
			classNm = 'view-list-type2';
		}
		doc.querySelectorAll('.prdt-list > ul').forEach(function(_el){
			_el.className = classNm;
		});
	}

	function cartWrapHandler(_evt, _model){
		var target = _evt.target,
			count = parseInt(_model._count.innerText);
		switch(target){
			case _model._cart:
				_model._that.classList.add('get');
				setTimeout(function(){
					// _model._that.classList.add('wide-del');
					_model._that.classList.remove('get');
					_model._that.classList.add('revers-num');
				},1000);
				_model._count.innerText = 1;
				if(cartDelListener) cartDelListener();
			break;
			case _model._plus:
				_model._count.innerText = ++count;
				if(count > 1) _model._that.classList.add('wide-minus');
			break;
			case _model._minus:
				if(count >= 0) _model._count.innerText = --count;
				if(count <= 1) {
					_model._that.classList.remove('revers-num');
					_model._that.classList.remove('wide-minus');
					_model._that.classList.remove('minus');
					_model._that.classList.add('wide-del');
				}
			break;
			case _model._del:
				_model._that.classList.add('revers-cart');
				_model._that.classList.remove('wide-del');
				_model._count.innerText = 0;
				setTimeout(function(){
					_model._that.classList.remove('revers-cart');
				},1000);
				if(cartDelListener) cartDelListener();
			break;
			case _model._number:
			case _model._count:
				if(global.duplCheck) return;
				global.duplCheck = true;
				if(_model._that.classList.contains('revers-num')){
					_model._that.classList.remove('animate-none');
					_model._that.classList.remove('revers-num');
					_model._that.classList.remove('wide-del');
					if(_model._count.innerText <= 1){
						_model._that.classList.add('wide-del');
					}else{
						_model._that.classList.add('minus');
					}
				}else if(_model._count.innerText <= 1 && _model._that.classList.contains('revers-num')){
					_model._that.classList.remove('minus');
					_model._that.classList.add('wide-del');
				}else{
					_model._that.classList.remove('minus');
					_model._that.classList.add('revers-num');
				}
				setTimeout(function(){
					global.duplCheck =false;
				},200);
			break;
		}
	}

	function txtAreaWrapHandler(_evt){
		var txtarea = _evt.target
			,count = _evt.target.parentElement.querySelector('.txt-count em');
		count.innerText = txtarea.value.length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	}

	// (window.setViewCol = function(){
	// 	var context;

	// 	if (header._sorting !== null) {
	// 		context = header._sorting;
	// 	}
	// 	else {
	// 		context = doc;
	// 	}
		
	// 	viewCol._that = context.querySelector('.view-col');
	// 	if(viewCol._that) {
	// 		viewCol._column1 = viewCol._that.querySelector('.icon-view-column-1');
	// 		viewCol._column2 = viewCol._that.querySelector('.icon-view-column-2');
	// 		viewCol._column1.addEventListener('click', viewColHandler, true);
	// 		viewCol._column2.addEventListener('click', viewColHandler, true);
	// 	}
		
	// })();

	obj.setViewCol = (function(){
		return function(){
			var context;
	
			if (header._sorting !== null) {
				context = header._sorting;
			}
			else {
				context = doc;
			}
			
			viewCol._that = context.querySelector('.view-col');
			if(viewCol._that) {
				viewCol._column1 = viewCol._that.querySelector('.icon-view-column-1');
				viewCol._column2 = viewCol._that.querySelector('.icon-view-column-2');
				viewCol._column1.addEventListener('click', viewColHandler, true);
				viewCol._column2.addEventListener('click', viewColHandler, true);
			}
			
		}
	})();

	// (window.setCartBtn = function(selector){
	// 	selector = selector || '.btn-actionseet';
	
	// 	doc.querySelectorAll('.cart-button-con .button-cart-wrap').forEach(function(_wrap, _idx){
	// 		var model = {
	// 			_that : _wrap,
	// 			_plus : _wrap.querySelector('.icon-plus-white'),
	// 			_number : _wrap.querySelector('.icon-cart-number'),
	// 			_count : _wrap.querySelector('.icon-cart-number > span'),
	// 			_minus : _wrap.querySelector('.icon-minus-white'),
	// 			_del : _wrap.querySelector('.icon-cart-del'),
	// 			_cart : _wrap.querySelector('.icon-button-cart'),
	// 			_imgUrl : null,
	// 			_cartBack : _wrap.querySelector('.cart-back')
	// 		};
	// 		function handler(_evt){
	// 			cartWrapHandler(_evt, model);
	// 		}
	// 		model._plus.addEventListener('click', handler, true);
	// 		model._minus.addEventListener('click', handler, true);
	// 		model._del.addEventListener('click', handler, true);
	// 		model._cart.addEventListener('click', handler, true);
	// 		model._number.addEventListener('click', handler, true);
	// 		model._count.addEventListener('click', handler, true);
	// 		if(model._count.innerText > 0){
	// 			model._that.classList.add('animate-none');
	// 			model._that.classList.add('revers-num');
	// 		}
	// 		model._imgUrl = _wrap.parentElement.querySelector('img.thumb-type1');
	// 		if(model._imgUrl && model._cartBack) model._cartBack.style = 'background:url("'+model._imgUrl.src+'") no-repeat 50% / 150% !important;';
	// 	});
	// })('');	

	obj.setCartBtn = (function(){
		return function(selector){
			selector = selector || '.btn-actionseet';
		
			doc.querySelectorAll('.cart-button-con .button-cart-wrap').forEach(function(_wrap, _idx){
				var model = {
					_that : _wrap,
					_plus : _wrap.querySelector('.icon-plus-white'),
					_number : _wrap.querySelector('.icon-cart-number'),
					_count : _wrap.querySelector('.icon-cart-number > span'),
					_minus : _wrap.querySelector('.icon-minus-white'),
					_del : _wrap.querySelector('.icon-cart-del'),
					_cart : _wrap.querySelector('.icon-button-cart'),
					_imgUrl : null,
					_cartBack : _wrap.querySelector('.cart-back')
				};
				function handler(_evt){
					cartWrapHandler(_evt, model);
				}
				model._plus.addEventListener('click', handler, true);
				model._minus.addEventListener('click', handler, true);
				model._del.addEventListener('click', handler, true);
				model._cart.addEventListener('click', handler, true);
				model._number.addEventListener('click', handler, true);
				model._count.addEventListener('click', handler, true);
				if(model._count.innerText > 0){
					model._that.classList.add('animate-none');
					model._that.classList.add('revers-num');
				}
				model._imgUrl = _wrap.parentElement.querySelector('img.thumb-type1');
				if(model._imgUrl && model._cartBack) model._cartBack.style = 'background:url("'+model._imgUrl.src+'") no-repeat 50% / 150% !important;';
			});
		}
	})('');

	// PUBLIC FUNCTIONS
	obj.setBackBtnListener = function(_handler){
		header._back.removeEventListener('click', header._backBtnHandler, true);
		header._backBtnHandler = _handler;
		header._back.addEventListener('click', header._backBtnHandler, true);
	};

	obj.setCloseBtnListener = function(_handler){
		header._close.removeEventListener('click', header._closeBtnHandler, true);
		header._closeBtnHandler = _handler;
		header._close.addEventListener('click', header._closeBtnHandler, true);
	};

	obj.setShareBtnListener = function(_handler){
		header._share.removeEventListener('click', header._shareBtnHandler, true);
		header._shareBtnHandler = _handler;
		header._share.addEventListener('click', header._shareBtnHandler, true);
	};

	obj.setCartBtnListener = function(_handler){
		header._cartBtnHandler = _handler;
	};

	obj.setCartCnt = function(_cnt){
		if(_cnt >= 100) header._cartCnt.innerText = '99+';
		else header._cartCnt.innerText = _cnt;

		header._cartCnt.setAttribute('data-cnt', _cnt);
	};

	obj.getCartCnt = function(){
		return header._cartCnt.getAttribute('data-cnt');
	};

	obj.setEmphasisBtnListener = function(_handler){
		emphasis._btn.removeEventListener('click', emphasis._btnHandler, true);
		emphasis._btnHandler = _handler;
		emphasis._btn.addEventListener('click', emphasis._btnHandler, true);
	};

	obj.setEmpahsisDisabled = function(_disabled){
		emphasis._btn.disabled = _disabled;
	};

	obj.setFloatingBtnListener = function(_handler){
		floating._btn.removeEventListener('click', floating._btnHandler, true);
		floating._btnHandler = _handler;
		floating._btn.addEventListener('click', floating._btnHandler, true);
	};

	obj.setScollerGestureCallback = function(_callback){
		scollerGestureCallback = _callback;
	};

	obj.setCartDelListener = function(_listener){
		cartDelListener = _listener;
	};

	obj.assignSorting =  function(){
		header._sorting = doc.querySelector('.header-wrap .sorting');
	};

	obj.assignTabbar =  function(){
		tabBar = doc.querySelector('.tab-bar');
	};

	obj.assignScroll = function(){
		var timer = 0;
		timer = setInterval(() => {
			
			if (doc.querySelectorAll('.header-wrap').length) {
				global.removeEventListener('scroll', wrapperHandler);
				global.addEventListener('scroll', wrapperHandler, false);
				clearInterval(timer);
			}
		}, 10);

		setTimeout(() => {
			clearInterval(timer);
		}, 5000)
	}

	// VALIDATION
	if(doc.querySelector('.header-wrap') && wrapper) setTimeout(initialize, 0);

	return obj;
})(document, window);



// MODAL
var Modal = Modal || function(){};
Modal = (function(doc, global) {
	return function(_class){
		var modal = doc.querySelector(_class),
			_cont = modal ? modal.querySelector('.scr_txt') : null;
			_that = this;

		if(_cont) StyleCommon.forceScroller(_cont);

		// PRIVATE METHOD
		if(modal){
			var closeBtn = modal.querySelector('.icon-header-close, .btn-modal-close');
			if(closeBtn){
				closeBtn.onclick = function(){
					_that.hide();
				};
			}

			var dim = modal.querySelector('.dim');
			if(dim){
				dim.onclick = function(){
					_that.hide();
				};	
			}
		}

		// PUBLIC METHOD
		_that.show = function(){
			if(modal) {
				modal.style.display = 'block';
				StyleCommon.scrollLock(true);
			}
		};
		_that.hide = function(){
			if(modal) {
				modal.style.display = 'none';
				StyleCommon.scrollLock(false);
			}
		};
	};
})(document, window);

// MODAL BTN BINDING
(function(doc, global){
	var modals = doc.querySelectorAll('.btn-modal');
	if(modals){
		modals.forEach(function(_el, _idx){
			var data = _el.getAttribute('data-modal');
			if(data){
				_el.onclick = function(){
					new Modal('.modal-wrap.'+data).show();
				};
			}
		});
	}
})(document, window);


// ACTION SEET
var ActionSheet = ActionSheet || function(){};
ActionSheet = (function(doc, global) {
	return function(_class){
		var as = doc.querySelector(_class),
			_cont = as.querySelector('.action-sheet-scr'),
			_that = this;

		if(_cont) StyleCommon.forceScroller(_cont);

		// PRIVATE METHOD
		var closeBtn = as.querySelector('.toggle-btn');
		if(closeBtn){
			closeBtn.onclick = function(){
				_that.hide();
			};
		}
		
		var dim = as.querySelector('.dim');
		if(dim){
			dim.onclick = function(){
				_that.hide();
			};	
		}

		// PUBLIC METHOD
		_that.show = function(){
			if(as) as.classList.add('seet-fixed');
			StyleCommon.scrollLock(true);
		};
		_that.hide = function(){
			if(as) as.classList.remove('seet-fixed');
			StyleCommon.scrollLock(false);
		};
	};
})(document, window);

// ACTIONSHEET BTN BINDING
(window.actionseet = function(selector, doc, global){
	doc = doc || document;
	global = global || window;
	selector = selector || '.btn-actionseet';

	doc.querySelectorAll(selector).forEach(function(_el, _idx){
		var data = _el.getAttribute('data-actionsheet');
		if(data){
			_el.onclick = function(){
				new ActionSheet('.fixed-action-sheet.'+data).show();
			};
		}
	});
})('', document, window);


// ACCORDION PANEL
var AccordionPanel = AccordionPanel || function(){};
AccordionPanel = (function(doc, global) {
	return function(_class){
		var	_that = doc.querySelector(_class),
			_lis = doc.querySelectorAll(_class+' > li'),
			_onEl = null;

		// PRIVATE METHOD
		function initialize(){
			_lis.forEach(function(_el){
				_el.querySelector('.slide-list-btn').addEventListener('click', function(_evt){
					if(_el == _onEl || !_onEl){
						if(_el.classList.contains('on')){
							off(_el);
						}else{
							on(_el);
						}
					}else if(_onEl){
						_onEl.classList.remove('on');
						on(_el);
					}
				});

				if(_el.classList.contains('on')){
					on(_el);
				}
			});
		}

		function on(_el){
			_el.classList.add('on');
			if(!_that.classList.contains('slide-list-wrap')) StyleCommon.scrollToSmooth(_el.offsetTop);
			new Swiper(_el.querySelector('.swiper-container'), {
	            slidesPerView: 'auto',
	            spaceBetween: 8
	        });
	        _onEl = _el;
		}

		function off(_el){
			_el.classList.remove('on');
		}

		initialize();
	};
})(document, window);

(function(){
	new AccordionPanel('.slide-list-wrap');
})();


// HASH TAG
var HashTag = HashTag || function(){};
HashTag = (function(doc, global) {
	return function(_class){
		var _that = doc.querySelector(_class),
			_btns = doc.querySelectorAll(_class + '> button');

		// PRIVATE METHOD
		function initialize(){
			_btns.forEach(function(_btn){
				_btn.addEventListener('click', function(_evt){
					var parent = _that.parentElement;
					if(parent.classList.contains('tag-keyword-block')){
						if(_btn.classList.contains('highlight')) _btn.classList.remove('highlight');
						else _btn.classList.add('highlight');
					}else if(parent.classList.contains('review-keyword-block')){
						if(_btn.classList.contains('selected')) _btn.classList.remove('selected');
						else _btn.classList.add('selected');
					}					
				});
			});
		}

		initialize();
	}
})(document, window);

(function(){
	new HashTag('.tag-keyword-area');
})();


// ASSENT TOGGLE
var AssentToggle = AssentToggle || function(){};
AssentToggle = (function(doc, global) {
	return function(_class){
		var _that = doc.querySelector(_class + ' > div'),
			_btn = doc.querySelector(_class + ' > div button');

		// PRIVATE METHOD
		function initialize(){
			if(_that){
				_btn.addEventListener('click', function(_evt){
					if(_that.classList.contains('active')) _that.classList.remove('active');
					else _that.classList.add('active');
				});
			}
		}

		initialize();
	}
})(document, window);

(function(){
	new AssentToggle('.member-assent-bx');
})();


// SWIPER WRAPPER
var SwiperWrapper = SwiperWrapper || function(){};
SwiperWrapper = (function(doc, global){
	return function(_className, _options){
		var _that = this,
			_swiper,
			_options = _options,
			_categoryOptions = {
				slidesPerView: 5,
				loop: true,
				centeredSlides:true,
				loopAdditionalSlides:doc.querySelectorAll('.swiper-slide').length * 2,
				initialSlide : 2
			},
			_evt = {
				click : null
			};

		// PRIVATE METHOD
		function initItems(){
			doc.querySelectorAll('.swiper-slide').forEach(function(_el, _idx){
				_el.addEventListener('click', function(){
					slideTo(_idx);
					if(_evt.click) _evt.click(_idx, _el);
				});
			});
		}

		function slideTo(_idx){
			if(_swiper) _swiper.slideTo(_idx, 400, false);
		}

		// PUBLIC METHOD
		_that.init = function(_optionName){
			if(!doc.querySelector(_className)) return;
			if(_optionName == 'category') _options = _categoryOptions;
			_swiper = new Swiper(_className, _options);
			if(_swiper) initItems();
		};

		_that.setClickEvent = function(_evtCallback){
			_evt.click = _evtCallback;
		};
	}
})(document, window);


// FILE MANAGER
var FileManager = FileManager || function(){};
FileManager = (function(doc, global){
	return function(_el, _options){
		var _that = this,
			_el = _el;
			_options = _options;

		// PRIVATE METHOD
		function initialize(){
			if(typeof _el == 'string')  _el = doc.querySelector(_el);
			if(typeof _options.lst == 'string') _options.lst = doc.querySelector(_options.lst);

			_el.addEventListener('change', onFileChangeHandler, true);
		}

		function onFileChangeHandler(_evt){
			var fileList = _evt.target.files;
			for(var idx = 0; idx < fileList.length; idx++){
				readURL(fileList[idx], idx, fileList.length);
			}
		}

		function readURL(_file, _idx, _length){
			var reader = new FileReader();

			var item = doc.createElement('li');
			item.className = 'swiper-slide';
			item.innerHTML = _options.item;
			item.querySelector('button').addEventListener('click', function(){
				removeChild(item);
			});

			if(_file.type.indexOf('image') > -1){
				reader.readAsDataURL(_file);
				reader.onload = function(){
					item.querySelector('img').setAttribute('src', reader.result);
					item.querySelector('.button-movie-play').style.display = 'none';

					_options.lst.appendChild(item);

					if(_idx == _length-1){
						_options.onReadCallback();
					}
				}
			}else if(_file.type.indexOf('video') > -1){
				reader.onload = function(){
					var blob = new Blob([reader.result], {type: _file.type});
					var url = URL.createObjectURL(blob);
					var video = document.createElement('video');
					var timeupdate = function() {
						if (snapImage()) {
							video.removeEventListener('timeupdate', timeupdate);
							video.pause();
						}
					};
					video.addEventListener('loadeddata', function() {
						if (snapImage()) {
							video.removeEventListener('timeupdate', timeupdate);
						}
					});
					var snapImage = function() {
						var canvas = document.createElement('canvas');
				        canvas.width = video.videoWidth;
				        canvas.height = video.videoHeight;
				        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
				        var image = canvas.toDataURL();
				        var success = image.length > 100000;
				        if (success) {
				          item.querySelector('img').setAttribute('src', image);

				          _options.lst.appendChild(item);

							if(_idx == _length-1){
								_options.onReadCallback();
							}

				          URL.revokeObjectURL(url);
				        }
				        return success;
					};
					video.addEventListener('timeupdate', timeupdate);
					video.preload = 'metadata';
				    video.src = url;
				    // Load video in Safari / IE11
				    video.muted = true;
				    video.playsInline = true;
				    video.play();	
				}
				
			    reader.readAsArrayBuffer(_file);
			}
		}

		function removeChild(_child){
			_options.lst.removeChild(_child);
		}

		initialize();
	}
})(document, window);