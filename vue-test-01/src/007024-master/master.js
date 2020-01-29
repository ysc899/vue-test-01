(function(doc){
	var full_swiper = new Swiper('.brand-slide-type .swiper-container', {
		pagination: {
			el: '.brand-slide-type .swiper-pagination',
			clickable: true
		},
		direction: 'horizontal',
		slidesPerView: 1,
		slidesPerGroup: 1,
		loop:true
	}); //MW-DI-0005.html - 브랜드 스토리

	var center_swiper = new Swiper('.tour-visit-cont .center-slide-type .swiper-container', {
		direction: 'horizontal',
		centeredSlides: true,
		slidesPerView: 'auto',
		//spaceBetween: 15,
		loop:true
	}); //다른 고객님들의 <br />방문기를 확인해보세요! slide

		
	var pick_swiper = new Swiper('.pick-prd-slide .swiper-container', {
		pagination: {
			el: '.pick-prd-slide .swiper-pagination',
			clickable: true
		},
		loop:true
	}); //MW-DI-S0031.html - pick


	var center_swiper = new Swiper('.glde-idea-slide .center-slide-type .swiper-container', {
		direction: 'horizontal',
		centeredSlides: true,
		slidesPerView: 'auto',
		//spaceBetween: 15,
		loop:true
	}); //글라이드 보이스 - 상품개발 스토리

	/* swiper.js 호출 : 추천상품 */
    var product_swiper = new Swiper('.product-list-wrap.swiper-container', {
        slidesPerView: 'auto',
        spaceBetween: 12,
    });
    
    /* swiper.js 호출 : 첨부파일 미리보기 */
    var attach_preview_swiper = new Swiper('.attach-preview-wrap.swiper-container', {
        slidesPerView: 'auto',
        spaceBetween: 8,
    });

    /* swiper.js 호출 : 포토 동영상 썸네일 리스트 */
    var thumbnail_swiper = new Swiper('.thumbnail-list-wrap.swiper-container', {
        slidesPerView: "auto",
		slidesPerColumn: 2,
        spaceBetween: 8,
    });

    /* swiper.js 호출 : 베스트리뷰 첨부 파일 */
    var revAttachSlide = new Swiper('.rev-list-sty1 .rev-attach-wrap.swiper-container', {
    	slidesPerView: 1,
		loop: false,
		autoHeight: true,
		pagination: {
			el: '.swiper-pagination',
			type: 'fraction',
		},
	});

	/* swiper.js 호출 : 전체리뷰 첨부 파일 */
    var revAttachSlide2 = new Swiper('.rev-list-sty2 .rev-attach-wrap.swiper-container', {
    	slidesPerView: "auto",
		loop: false,
		autoHeight: true,
		//slidesOffsetBefore: 16,
		spaceBetween: 8,
	});

	/* swiper.js 호출 : 첨부파일 미리보기 */
    var revdetail_swiper = new Swiper('.revdetail-img-wrap.swiper-container', {
        slidesPerView: 'auto',
        spaceBetween: 0,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        }
    });

    /* swiper.js 호출 : faq */
    var faq_swiper = new Swiper('.swiper-faq-wrap.swiper-container', {
        autoHeight: true,
        slidesPerView: 'auto',
        spaceBetween: 8,
        pagination: {
            el: '.swiper-pagination',
			clickable: true
        },
    });

    var mypage_swiper = new Swiper('.mypage-slide .swiper-container', {
		pagination: {
			el: '.mypage-slide .swiper-pagination',
			clickable: true
		},
		direction: 'horizontal',
		centeredSlides: true,
		slidesPerView: 'auto',
		loop:false
	}); // mypage-slide slide

	var pic_swiper = new Swiper('.pic-history-slide .swiper-container', {
		pagination: {
			el: '.pic-history-slide .swiper-pagination',
			clickable: true
		},
		direction: 'horizontal',
		centeredSlides: true,
		slidesPerView: 'auto',
		loop:true
	});

	var order_swiper = new Swiper('.order-delivery-slide .swiper-container', {
		pagination: {
			el: '.order-delivery-slide .swiper-pagination',
			clickable: true
		},
		direction: 'horizontal',
		slidesPerView: 1,
		slidesPerGroup: 1,
		loop:true
	}); //주문내역 - MW-OP-0030.html

    revdetail_swiper.on('slideChange', function(_swiper){
        setTitle(revdetail_swiper.activeIndex+1);
    });

    setTitle(1);

    if(doc.querySelector('.review-content-layer')) {
        var moreBtn = doc.querySelector('.review-content-layer').querySelector('.btn-line-expand');
        if(moreBtn) moreBtn.addEventListener('click', moreBtnHandler, true);
    }

    function moreBtnHandler(_evt){
        if(doc.querySelector('.review-content-layer')){
            if(doc.querySelector('.review-content-layer').classList.contains('on')) doc.querySelector('.review-content-layer').classList.remove('on');
            else doc.querySelector('.review-content-layer').classList.add('on');
        }
    }

    function setTitle(_idx){
        if(doc.querySelector('.sub-tit') && revdetail_swiper.slides) {
        	doc.querySelector('.sub-tit').innerText = _idx+'/'+revdetail_swiper.slides.length;
        }
    }

	//리뷰 작성 팝업 
	var reviewModal = new Modal(".review-modal");
	reviewModal.show();
	//reviewModal.hide(); 리뷰 작성 팝업 닫기

	//예약 내역이 없습니다. 팝업
	var reservePop = new Modal(".reserve-pop");
	reservePop.show();
	//reservePop.hide(); 예약 내역이 없습니다. 팝업 닫기

	//로그인 유도 팝업
	var loginModal = new Modal(".login-modal");
	loginModal.show();
	//loginModal.hide(); 로그인 유도 팝업 닫기

	doc.querySelectorAll('.idea-prd-btn').forEach(function(_form){
		_form.addEventListener('click', function(){
			var model = {
				_count : this.querySelector('.count'),
				_cnt : 0
			};

			model._cnt = model._count.innerText;
			if(this.classList.contains('active')){
				this.classList.remove('active');
				model._count.innerText = --model._cnt;
			}else{
				this.classList.add('active');
				model._count.innerText = ++model._cnt;
			}
		});
	});//공감 카운트

	if(doc.querySelector('.view-like-text')){
		var model = {
			_textArea : doc.querySelector('.view-like-text').querySelector('textarea')
		};

		if(model._textArea){
			model._textArea.addEventListener('focus', function(){
				doc.querySelector('.view-like-text').classList.add('focus');
			}, false);
		}
	}

	let aroundSlide = new Swiper('.detail-visual-wrap.swiper-container', {
		init: false,
    	slidesPerView: 1,
		loop: true,
		autoHeight: true,
		pagination: {
			el: '.swiper-pagination',
			type: 'fraction',
		},
	});
	aroundSlide.on('slideChange', aroundSlideHandler);
    aroundSlide.on('init', aroundSlideHandler);
    try{aroundSlide.init()}catch(e){};

    function aroundSlideHandler() {
        var activeWrap = doc.querySelector('.detail-visual-wrap.swiper-container li[data-swiper-slide-index="' + aroundSlide.realIndex + '"]');
        if (activeWrap) {
            var video = activeWrap.querySelector('video'),
                sndBtn = activeWrap.querySelector('.volum-btn');

            if (video) {
                video.volume = 0;
                video.setAttribute('muted', '');
                video.play();
            }
            if (sndBtn) sndBtn.addEventListener('click', sndBtnHandler);

            function sndBtnHandler(_evt) {
                var video = activeWrap.querySelector('video');
                if (video.getAttribute('muted') != null) {
                    video.removeAttribute('muted');
                    video.volume = 1;
                }
                else {
                    video.volume = 0;
                    video.setAttribute('muted', '');
                }
                
            }
        }

        var prevActiveWrap = doc.querySelector('.detail-visual-wrap.swiper-container li[data-swiper-slide-index="' + (aroundSlide.previousIndex - 1) + '"]');
        if (prevActiveWrap) {
            var video = prevActiveWrap.querySelector('video');
            if (video) video.pause();
        }
    }

    /* 상세 정보 펼침 */
    if(doc.querySelector('.detail-more-btn')){
	    doc.querySelector('.detail-more-btn').addEventListener('click', function(){
	        var wrap = doc.querySelector('.detail-con-wrap');
	        if(wrap.classList.contains('hide-overflow')) wrap.classList.remove('hide-overflow');
	        else wrap.classList.add('hide-overflow');
	    });
	}

    doc.querySelectorAll('.review-evaluation-wrap li').forEach(function(_li){
        var rvwEvBar = _li.querySelector('.rvw-ev-bar');
        if(rvwEvBar){
            var span = rvwEvBar.querySelector('span');
            _li.className = '';
            var val = span.innerText;
            rvwEvBar.style.width = val+'%';
            if(val < 30){
                _li.classList.add('rvw-ev-ms1');
            }else if(val < 60){
                _li.classList.add('rvw-ev-ms2');
            }else{
                _li.classList.add('rvw-ev-ms3');
            }
        }
    });

    /* 첨부파일 미리보기 */
    doc.querySelectorAll('input[type=file]').forEach(function(_file){
        var fm = new FileManager(_file, {
            lst : '.swiper-wrapper',
            item : '<div class="attach-preview-item">'+
                      '<img src="" alt="리뷰제품 이미지">'+
                      '<button type="button" class="btn-attch-del"><i class="icon-delete-white"></i><span>첨부파일삭제</span></button>'+
                      '<i class="button-movie-play"></i>'+
                  '</div>',
            onReadCallback : function(){
                attach_preview_swiper.update(true);
            }
        });
    });

    doc.querySelectorAll('.terms-select-lst a').forEach(function(_a){
		_a.addEventListener('click', function(){
			if(!_a.classList.contains('active')) _a.classList.add('active');
			else _a.classList.remove('active');
		}, false);
	});


    /** MW-DI-0001 **/
	let aroundSlide2 = new Swiper('.around-slide-type', {
		slidesPerView: 1,
		loop: true,
		pagination: {
			el: '.swiper-pagination',
			type: 'fraction',
		},

	});

	let centerCustomSlide = new Swiper('.center-custom-slide', {
		init: false,
		centeredSlides: true,
		slidesPerView: 'auto',
		on: {
			slideChange: function () {
				let currentNum = doc.querySelector('.center-custom-slide .pagination-wrap .current-num');
				let totalNum = doc.querySelector('.center-custom-slide .pagination-wrap .total-num');
				let barSelector = doc.querySelector('.center-custom-slide .pagination-wrap .swiper-pagination-bar .swiper-pagination-fill');
				currentNum.innerHTML = String(centerCustomSlide.activeIndex + 1);
				totalNum.innerHTML = String(centerCustomSlide.slides.length);
				barSelector.style.width = (100 / centerCustomSlide.slides.length) * (centerCustomSlide.activeIndex + 1) + "%";
			},
		}
	});
	centerCustomSlide.on('init', function () {
		let currentNum = doc.querySelector('.center-custom-slide .current-num');
		let totalNum = doc.querySelector('.center-custom-slide .total-num');
		let barSelector = doc.querySelector('.center-custom-slide .swiper-pagination-fill');
		currentNum.innerHTML = String(centerCustomSlide.activeIndex + 1);
		totalNum.innerHTML = String(centerCustomSlide.slides.length);
		barSelector.style.width = (100 / centerCustomSlide.slides.length) * (centerCustomSlide.activeIndex + 1) + "%";
	});
	try{centerCustomSlide.init();}catch(e){}

	let fullCustomSlide = new Swiper('.full-custom-slide', {
		init: false,
		slidesPerView: 1,
		on: {
			slideChange: function () {
				let currentNum = doc.querySelector('.full-custom-slide .pagination-wrap .current-num');
				let totalNum = doc.querySelector('.full-custom-slide .pagination-wrap .total-num');
				let barSelector = doc.querySelector('.full-custom-slide .pagination-wrap .swiper-pagination-bar .swiper-pagination-fill');
				currentNum.innerHTML = String(fullCustomSlide.activeIndex + 1);
				totalNum.innerHTML = String(fullCustomSlide.slides.length);
				barSelector.style.width = (100 / fullCustomSlide.slides.length) * (fullCustomSlide.activeIndex + 1) + "%";
			},
		}
	});
	fullCustomSlide.on('init', function () {
		let currentNum = doc.querySelector('.full-custom-slide .current-num');
		let totalNum = doc.querySelector('.full-custom-slide .total-num');
		let barSelector = doc.querySelector('.full-custom-slide .swiper-pagination-fill');
		currentNum.innerHTML = String(fullCustomSlide.activeIndex + 1);
		totalNum.innerHTML = String(fullCustomSlide.slides.length);
		barSelector.style.width = (100 / fullCustomSlide.slides.length) * (fullCustomSlide.activeIndex + 1) + "%";
	});
	try{fullCustomSlide.init();}catch(e){}

	let centerSmallSlide = new Swiper('.center-small-slide', {
		init: false,
		slidesPerView: 'auto',
		spaceBetween: 12,
		slidesOffsetBefore: 40,
		slidesOffsetAfter: 40,
		breakpoints: {
			640: {
				init: false,
				slidesPerView: 'auto',
				spaceBetween: 12,
				slidesOffsetBefore: 65,
				slidesOffsetAfter: 0,
			}
		},
		on: {
			slideChange: function () {
				let currentNum = doc.querySelector('.center-small-slide .pagination-wrap .current-num');
				let totalNum = doc.querySelector('.center-small-slide .pagination-wrap .total-num');
				let barSelector = doc.querySelector('.center-small-slide .pagination-wrap .swiper-pagination-bar .swiper-pagination-fill');
				currentNum.innerHTML = String(centerSmallSlide.activeIndex + 1);
				totalNum.innerHTML = String(centerSmallSlide.slides.length);
				barSelector.style.width = (100 / centerSmallSlide.slides.length) * (centerSmallSlide.activeIndex + 1) + "%";
			},
		}
	});
	centerSmallSlide.on('init', function () {
		let currentNum = doc.querySelector('.center-small-slide .current-num');
		let totalNum = doc.querySelector('.center-small-slide .total-num');
		let barSelector = doc.querySelector('.center-small-slide .swiper-pagination-fill');
		currentNum.innerHTML = String(centerSmallSlide.activeIndex + 1);
		totalNum.innerHTML = String(centerSmallSlide.slides.length);
		barSelector.style.width = (100 / centerSmallSlide.slides.length) * (centerSmallSlide.activeIndex + 1) + "%";
	});
	try{centerSmallSlide.init();}catch(e){}


	/** MW-DI-0002 **/
	const getHeight = () => {
        setTimeout(function () {
            const screenHeight = window.innerHeight;
            const elementHeight = doc.querySelector('.article-key-visual');
            if(elementHeight) elementHeight.style.height = screenHeight + 'px';
        }, 100);
    };
    getHeight();
    window.addEventListener('orientationchange', getHeight, true);
    const scrollBtn = doc.querySelector('.article-key-visual .icon-down-32');
    if(scrollBtn){
    	scrollBtn.addEventListener('click', function() {
	        const from     = window.scrollY;
	        const to       = window.innerHeight + 1;
	        const duration = 500;

	        const start = new Date().getTime();
	        const timer = setInterval(function() {
	            const time = new Date().getTime() - start;
	            const x = easeInOutQuart(time, from, to - from, duration);
	            window.scrollTo(0,x);
	            if (time >= duration) clearInterval(timer);
	        }, 1000 / 60);
	        window.scrollTo(0,from);
	    });

	    const easeInOutQuart =(t, b, c, d) => {
	        if ((t /= d / 2) < 1) return c / 2 * t * t * t * t + b;
	        return -c / 2 * ((t -= 2) * t * t * t - 2) + b;
	    }
    }

    let listSwiper = new Swiper('.list-swiper', {
        loop: true,
        pagination: {
            el: '.swiper-pagination',
            type: 'fraction',
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        }

    });

    var MWDI0002Model = {
        articleQuickCart : doc.querySelector('.article-quick-cart'),
        articleBtnWrap : doc.querySelector('.article-btn-wrap'),

        actionSheet: doc.querySelector('.fixed-action-sheet.article-cart-sheet'),
      	bdrdos1 : doc.querySelector('.btn-type3.bdrdos1'),
      	cartDelListener : function(){
      		var counts = MWDI0002Model.actionSheet.querySelectorAll('.button-cart-wrap .count');
      		var cnt = 0;
      		counts.forEach(function(_count){
    			if(0==_count.innerText) cnt++;
    		});
    		if(cnt==0) MWDI0002Model.bdrdos1.setAttribute('disabled', 'disabled');
    		else MWDI0002Model.bdrdos1.removeAttribute('disabled');
      	}
    };
    if(MWDI0002Model.articleQuickCart){
        Wrapper.setScollerGestureCallback(function(_stance, _scroller){
            if(_stance=='UP'){
                if(!MWDI0002Model.articleQuickCart.classList.contains('on')) MWDI0002Model.articleQuickCart.classList.add('on');
                if(_scroller.scrollTop + _scroller.clientHeight >= MWDI0002Model.articleBtnWrap.offsetTop) MWDI0002Model.articleQuickCart.classList.remove('on');
            }else{

            }
        });
    }

    if(MWDI0002Model.actionSheet && MWDI0002Model.bdrdos1){
    	Wrapper.setCartDelListener(MWDI0002Model.cartDelListener);
    	MWDI0002Model.bdrdos1.addEventListener('click', function(){
    		MWDI0002Model.actionSheet.querySelectorAll('.button-cart-wrap').forEach(function(_cartWrap){
    			var model = {
    				cnt : _cartWrap.querySelector('.count').innerText,
    				cart : _cartWrap.querySelector('.icon-button-cart')
    			};
    			if(0==model.cnt) model.cart.click();
    		});

    		MWDI0002Model.cartDelListener();
    	}, false);
    }


    /** MW-ME-0001 **/
    var MWME0001Model = {
    	loginWrap : doc.querySelector('.login_wrap.login-cont'),
    	model : {
			lgnInp : null,
			lgnDelBtn : null,
			mailFrmlst : null,

			pwdInp : null,
			pwdViewBtn : null,
			pwdView : null
		},
    	_lgnFrm : doc.querySelector('.login'),
    	_pwdFrm : doc.querySelector('.password'),
    	_lgnBtn : doc.querySelector('.btn-type11'),
    	mailLstController : function (){
			var lgnVal = MWME0001Model.model.lgnInp.value;
			if(lgnVal.length >= 2 && lgnVal.split('@').length > 1){
				MWME0001Model.model.mailFrmlst.style.display = 'block';
			}else{
				MWME0001Model.model.mailFrmlst.style.display = 'none';
			}
		},
		btnValidate : function (_evt){
			var lgnVal = MWME0001Model.model.lgnInp.value,
				pwdVal = MWME0001Model.model.pwdInp.value;
			if(lgnVal != '' && pwdVal != '') MWME0001Model._lgnBtn.removeAttribute('disabled');
			else MWME0001Model._lgnBtn.setAttribute('disabled', true);

			if(_evt.target == MWME0001Model.model.pwdInp){
				if(pwdVal.length > 0) {
					MWME0001Model.model.pwdViewBtn.style.display = 'block';
				}else{
					MWME0001Model.model.pwdViewBtn.style.display = 'none';
					MWME0001Model.model.pwdView.style.display = 'none';
				}
				MWME0001Model.model.pwdView.innerText = pwdVal;
			}
		}
    }
    if(MWME0001Model.loginWrap) {
    	//MWME0001Model.loginWrap.style.height = (window.innerHeight - 50) + 'px';

    	// 이메일 입력 박스 처리
		if(MWME0001Model._lgnFrm){
			MWME0001Model.model.lgnInp = MWME0001Model._lgnFrm.querySelector('.login_input');
			MWME0001Model.model.lgnDelBtn = MWME0001Model._lgnFrm.querySelector('.btn-input-id');
			MWME0001Model.model.mailFrmlst = MWME0001Model._lgnFrm.querySelector('.id-select-lst');
			MWME0001Model.model.lgnInp.addEventListener('focus', function(){
				if(!MWME0001Model._lgnFrm.classList.contains('focus')) MWME0001Model._lgnFrm.classList.add('focus');
			});
			MWME0001Model.model.lgnInp.addEventListener('blur', function(){
				if(MWME0001Model._lgnFrm.classList.contains('focus')) setTimeout(function(){MWME0001Model._lgnFrm.classList.remove('focus')});
				setTimeout(function(){MWME0001Model.model.mailFrmlst.style.display = 'none';});
			});

			MWME0001Model.model.lgnInp.addEventListener('input', MWME0001Model.mailLstController, false);
			MWME0001Model.model.lgnInp.addEventListener('input', MWME0001Model.btnValidate, false);

			MWME0001Model.model.lgnDelBtn.addEventListener('click', function(){
				MWME0001Model.model.lgnInp.value = '';
			});

			MWME0001Model.model.mailFrmlst.querySelectorAll('button').forEach(function(_btn){
				_btn.addEventListener('click', function(_evt){
					var txt = MWME0001Model.model.lgnInp.value,
						lstIndex = txt.lastIndexOf('@'),
						character = _btn.innerText;
					MWME0001Model.model.lgnInp.value = txt.substr(0, lstIndex) + character + txt.substr(lstIndex+character.length);
					MWME0001Model.model.mailFrmlst.style.display = 'none';
				});
			});
		}

		// 비밀번호 입력 박스 처리
		if(MWME0001Model._pwdFrm){
			MWME0001Model.model.pwdInp = MWME0001Model._pwdFrm.querySelector('.login_input');
			MWME0001Model.model.pwdViewBtn = MWME0001Model._pwdFrm.querySelector('.btn-input-pw');
			MWME0001Model.model.pwdView = MWME0001Model._pwdFrm.querySelector('.pw-clear');
			MWME0001Model.model.pwdInp.addEventListener('focus', function(){
				if(!MWME0001Model._pwdFrm.classList.contains('focus')) MWME0001Model._pwdFrm.classList.add('focus');
			});
			MWME0001Model.model.pwdInp.addEventListener('blur', function(){
				if(MWME0001Model._pwdFrm.classList.contains('focus')) setTimeout(function(){MWME0001Model._pwdFrm.classList.remove('focus')});
			});

			MWME0001Model.model.pwdInp.addEventListener('input', MWME0001Model.btnValidate, false);
			MWME0001Model.model.pwdViewBtn.addEventListener('click', function(){
				MWME0001Model.model.pwdView.innerText = MWME0001Model.model.pwdInp.value;
				if(MWME0001Model.model.pwdView.style.display == '' || MWME0001Model.model.pwdView.style.display == 'none') MWME0001Model.model.pwdView.style.display = 'block';
				else MWME0001Model.model.pwdView.style.display = '';
			}, false);
		}
    }


	/** MW-ME-0015 **/
	var MWME0015Model = {
		loginMembersipCont : doc.querySelector('.login_wrap.membership-cont'),
		_lgnFrm : doc.querySelector('.login'),
		_pwdFrm : doc.querySelector('.password'),
		_nmFrm : doc.querySelector('.name'),
		_phnFrm : doc.querySelector('.phone'),
		_lgnBtn : doc.querySelector('.btn-type11'),
		_MembershipFrm : doc.querySelector('.login_membersip-cont'),
		model : {
			lgnInp : null,
			lgnDelBtn : null,
			mailFrmlst : null,

			pwdInp : null,
			pwdViewBtn : null,
			pwdView : null,

			nmInp : null,
			nmDelBtn : null,

			phnInp : null,
			phnDelBtn : null
		},
		mailLstController : function (){
			var lgnVal = MWME0015Model.model.lgnInp.value;
			if(lgnVal.length >= 2 && lgnVal.split('@').length > 1){
				MWME0015Model.model.mailFrmlst.style.display = 'block';
			}else{
				MWME0015Model.model.mailFrmlst.style.display = 'none';
			}
		},
		btnValidate : function (_evt){
			var lgnVal = MWME0015Model.model.lgnInp.value,
				pwdVal = MWME0015Model.model.pwdInp.value,
				nmVal = MWME0015Model.model.nmInp.value,
				phnVal = MWME0015Model.model.phnInp.value;
			phnVal = phnVal.replace(/[^0-9]/g, '');
			phnVal = phnVal.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/, '$1-$2-$3');
			if(lgnVal != '' && pwdVal != '' && nmVal != '' && phnVal != '') MWME0001Model._lgnBtn.removeAttribute('disabled');
			else MWME0001Model._lgnBtn.setAttribute('disabled', true);

			if(_evt.target == MWME0015Model.model.pwdInp){
				if(pwdVal.length > 0) {
					MWME0015Model.model.pwdViewBtn.style.display = 'block';
				}else{
					MWME0015Model.model.pwdViewBtn.style.display = 'none';
					MWME0015Model.model.pwdView.style.display = 'none';
				}
				MWME0015Model.model.pwdView.innerText = pwdVal;
			}else if(_evt.target == MWME0015Model.model.phnInp){
				MWME0015Model.model.phnInp.value = phnVal;
			}
		}
	};

	if(MWME0015Model.loginMembersipCont) {
		//MWME0015Model._MembershipFrm.style.height = (window.innerHeight - 196) + 'px';

		// 이메일 입력 박스 처리
		if(MWME0015Model._lgnFrm){
			MWME0015Model.model.lgnInp = MWME0015Model._lgnFrm.querySelector('.login_input');
			MWME0015Model.model.lgnDelBtn = MWME0015Model._lgnFrm.querySelector('.btn-input-id');
			MWME0015Model.model.mailFrmlst = MWME0015Model._lgnFrm.querySelector('.id-select-lst');
			MWME0015Model.model.lgnInp.addEventListener('focus', function(){
				if(!MWME0015Model._lgnFrm.classList.contains('focus')) MWME0015Model._lgnFrm.classList.add('focus');
			});
			MWME0015Model.model.lgnInp.addEventListener('blur', function(){
				if(MWME0015Model._lgnFrm.classList.contains('focus')) setTimeout(function(){MWME0015Model._lgnFrm.classList.remove('focus')});
				setTimeout(function(){MWME0015Model.model.mailFrmlst.style.display = 'none';});
			});

			MWME0015Model.model.lgnInp.addEventListener('input', MWME0015Model.mailLstController, false);
			MWME0015Model.model.lgnInp.addEventListener('input', MWME0015Model.btnValidate, false);

			MWME0015Model.model.lgnDelBtn.addEventListener('click', function(){
				MWME0015Model.model.lgnInp.value = '';
			});

			MWME0015Model.model.mailFrmlst.querySelectorAll('button').forEach(function(_btn){
				_btn.addEventListener('click', function(_evt){
					var txt = MWME0015Model.model.lgnInp.value,
						lstIndex = txt.lastIndexOf('@'),
						character = _btn.innerText;
					MWME0015Model.model.lgnInp.value = txt.substr(0, lstIndex) + character + txt.substr(lstIndex+character.length);
					MWME0015Model.model.mailFrmlst.style.display = 'none';
				});
			});
		}

		// 비밀번호 입력 박스 처리
		if(MWME0015Model._pwdFrm){
			MWME0015Model.model.pwdInp = MWME0015Model._pwdFrm.querySelector('.login_input');
			MWME0015Model.model.pwdViewBtn = MWME0015Model._pwdFrm.querySelector('.btn-input-pw');
			MWME0015Model.model.pwdView = MWME0015Model._pwdFrm.querySelector('.pw-clear');
			MWME0015Model.model.pwdInp.addEventListener('focus', function(){
				if(!MWME0015Model._pwdFrm.classList.contains('focus')) MWME0015Model._pwdFrm.classList.add('focus');
			});
			MWME0015Model.model.pwdInp.addEventListener('blur', function(){
				if(MWME0015Model._pwdFrm.classList.contains('focus')) setTimeout(function(){MWME0015Model._pwdFrm.classList.remove('focus')});
			});

			MWME0015Model.model.pwdInp.addEventListener('input', MWME0015Model.btnValidate, false);
			MWME0015Model.model.pwdViewBtn.addEventListener('click', function(){
				MWME0015Model.model.pwdView.innerText = MWME0015Model.model.pwdInp.value;
				if(MWME0015Model.model.pwdView.style.display == '' || MWME0015Model.model.pwdView.style.display == 'none') MWME0015Model.model.pwdView.style.display = 'block';
				else MWME0015Model.model.pwdView.style.display = '';
			}, false);
		}

		// 이름 입력 박스 처리
		if(MWME0015Model._nmFrm){
			MWME0015Model.model.nmInp = MWME0015Model._nmFrm.querySelector('.login_input');
			MWME0015Model.model.nmDelBtn = MWME0015Model._nmFrm.querySelector('.btn-input-id');

			if(MWME0015Model.model.nmInp){
				MWME0015Model.model.nmInp.addEventListener('focus', function(){
					if(!MWME0015Model._nmFrm.classList.contains('focus')) MWME0015Model._nmFrm.classList.add('focus');
				});
				MWME0015Model.model.nmInp.addEventListener('blur', function(){
					if(MWME0015Model._nmFrm.classList.contains('focus')) setTimeout(function(){MWME0015Model._nmFrm.classList.remove('focus')});
				});

				MWME0015Model.model.nmInp.addEventListener('input', MWME0015Model.btnValidate, false);
			}

			if(MWME0015Model.model.nmDelBtn){
				MWME0015Model.model.nmDelBtn.addEventListener('click', function(){
					MWME0015Model.model.nmInp.value = '';
				});
			}
		}

		// 핸드폰 입력 박스 처리
		if(MWME0015Model._phnFrm){
			MWME0015Model.model.phnInp = MWME0015Model._phnFrm.querySelector('.login_input');
			MWME0015Model.model.phnDelBtn = MWME0015Model._phnFrm.querySelector('.btn-input-id');

			MWME0015Model.model.phnInp.addEventListener('focus', function(){
				if(!MWME0015Model._phnFrm.classList.contains('focus')) MWME0015Model._phnFrm.classList.add('focus');
			});
			MWME0015Model.model.phnInp.addEventListener('blur', function(){
				if(MWME0015Model._phnFrm.classList.contains('focus')) setTimeout(function(){MWME0015Model._phnFrm.classList.remove('focus')});
			});

			MWME0015Model.model.phnInp.addEventListener('input', MWME0015Model.btnValidate, false);

			MWME0015Model.model.phnDelBtn.addEventListener('click', function(){
				MWME0015Model.model.phnInp.value = '';
			});
		}
	}


	/** MW-CS-0001 **/
	var MWCS0001Model = {
		_faqBtns : doc.querySelectorAll('.faq-select-lst button'),
		_actEl : null,
		faqBtnHandler : function (_evt){
			var el = _evt.target;
			if(MWCS0001Model._actEl) MWCS0001Model._actEl.classList.remove('active');

			el.classList.add('active');

			MWCS0001Model._actEl = el;
		}
	};
	MWCS0001Model._faqBtns.forEach(function(_faqBtn){
		if(_faqBtn.classList.contains('active')) MWCS0001Model._actEl = _faqBtn;
		_faqBtn.addEventListener('click', MWCS0001Model.faqBtnHandler, true);
	});

	
	/**  MW-CS-0005 **/
	var MWCS0005Model = {
		counselCont : doc.querySelector('.counsel-cont')
	};

	//if(MWCS0005Model.counselCont) MWCS0005Model.counselCont.style.minHeight = (window.innerHeight - 139) + 'px'; //컨텐츠 높이값


	/** MW-ME-0019, 0019-1 **/
	doc.querySelectorAll('.input-ul-wrap > li').forEach(function(_li){
        var sty1 = _li.querySelector('.input-txt-sty1'),
                edtBtn = _li.querySelector('.btn-input-edit'),
                cclBtn = _li.querySelector('.btn-input-cancle'),
                conWrap = _li.querySelector('.input-confirm-wrap');
        if(edtBtn){
            edtBtn.addEventListener('click', function(){
                sty1.classList.remove('ipt-fix-mode');
                sty1.classList.add('ipt-edit-mode');
                edtBtn.classList.remove('on');
                if(cclBtn) cclBtn.classList.add('on');
                if(conWrap) conWrap.classList.add('on');
            });
        }
        if(cclBtn){
            cclBtn.addEventListener('click', function(){
                sty1.classList.add('ipt-fix-mode');
                sty1.classList.remove('ipt-edit-mode');
                cclBtn.classList.remove('on');
                if(edtBtn) edtBtn.classList.add('on');
                if(conWrap) conWrap.classList.remove('on');
            });
        }
    });


	/** MW-ME-0026 **/
	var MWME0026Model = {
		model : {
	        _addBtn : doc.querySelector('.btn-add-plus'),
	        _delBtn : doc.querySelector('.btn-del-minus'),
	        _phSub : doc.querySelector('.dlvr-phone-sub'),
	    },
	    model2 : {
	        _input : doc.querySelector('.input-form'),
	        _orqBx : doc.querySelector('.order-request-bx'),
	        _dim : doc.querySelector('.order-request-dim'),
	        _toggleBtns : doc.querySelectorAll('.btn-toggle')
	    },
	    // 주소 정보 연계 후 해당 함수를 호출해야함
	    addrValidate : function (){
	        var cnt = 0;
	        doc.querySelectorAll('.input-txt-address input').forEach(function(_input){
	            if(_input.value != '') cnt++;
	        });
	        if(cnt == 3) doc.querySelector('.input-txt-address').classList.add('inputed');
	    }
	};

    if(MWME0026Model.model._addBtn){
        MWME0026Model.model._addBtn.addEventListener('click', function(){
            MWME0026Model.model._addBtn.classList.remove('on');
            MWME0026Model.model._delBtn.classList.add('on');
            MWME0026Model.model._phSub.classList.remove('dN');
        }, false);
    }

    if(MWME0026Model.model._delBtn){
        MWME0026Model.model._delBtn.addEventListener('click', function(){
            MWME0026Model.model._addBtn.classList.add('on');
            MWME0026Model.model._delBtn.classList.remove('on');
            MWME0026Model.model._phSub.classList.add('dN');
        });
    }

    if(MWME0026Model.model2._input){
        MWME0026Model.model2._input.addEventListener('input', function(){
            if(this.value){
                MWME0026Model.model2._orqBx.classList.add('active');
                StyleCommon.scrollLock(true);
            }else{
                MWME0026Model.model2._orqBx.classList.remove('active');
                StyleCommon.scrollLock(false);
            }
        }, false);
    }

    if(MWME0026Model.model2._dim){
        MWME0026Model.model2._dim.addEventListener('click', function(){
            MWME0026Model.model2._orqBx.classList.remove('active');
            StyleCommon.scrollLock(false);
        });
    }

    if(MWME0026Model.model2._toggleBtns){
        MWME0026Model.model2._toggleBtns.forEach(function(_btn){
            _btn.addEventListener('click', function(){
                MWME0026Model.model2._input.value = this.innerText;
                MWME0026Model.model2._orqBx.classList.remove('active');
                StyleCommon.scrollLock(false);
            }, false);
        });
    }
  	

    /** MW-DI-S0023 **/
    var swiper = new SwiperWrapper('.top-header-slide .swiper-container');
	swiper.init('category');


	/** MW-OP-0001 **/
	var MWOP0001Model = {
		tabJs : doc.querySelector('.tab-js'),
		tabBtns : null,
		tabCon : null,
		onTabBtnHandler : function(_evt, _idx){
			MWOP0001Model.tabBtns.forEach(function(_btn){
				_btn.classList.remove('on');
			});
			_evt.target.classList.add('on');
			if(MWOP0001Model.tabCon){
				MWOP0001Model.tabCon.forEach(function(_con){
					_con.classList.remove('on');
				});
				MWOP0001Model.tabCon[_idx].classList.add('on');
			}
		}
	};
	if(MWOP0001Model.tabJs){
		MWOP0001Model.tabBtns = MWOP0001Model.tabJs.querySelectorAll('.tab-btn button');
		MWOP0001Model.tabCon = MWOP0001Model.tabJs.querySelectorAll('.tab-con');
		MWOP0001Model.tabBtns.forEach(function(_btn, _idx){
			_btn.addEventListener('click', function(_evt){
				MWOP0001Model.onTabBtnHandler(_evt, _idx);
			}, false);
		});
	}
	
	
})(document);