(function () {
	var wafflesjs = function () {
		var that = this,
			controls = null,
			waffle = null;

		that.Initialize = function () {
			controls = document.createElement('div');
			controls.setAttribute('class', 'waffles-controls waffles-controls-top waffles-controls-right');
			controls.innerHTML = '<div class="waffles-controls-text"></div><button onclick="wafflesapp.AddHorizontal();" title="Add Horizontal Waffle">&mdash;</button><button onclick="wafflesapp.AddVertical();" title="Add Vertical Waffle">|</button><button onclick="wafflesapp.Clear();" title="Clear Waffles">&cross;</button>';
			
			document.body.appendChild(controls);
			document.addEventListener('mousemove', wafflesapp.OnDragMove, false);
			document.addEventListener('mouseup', wafflesapp.OnDragStop, false);
			
			var position = document.body.style.position;
			if (position === 'static' || position === 'fixed') {
				document.body.style.position = 'relative';
			}
			
			that.LoadState();
		};

		that.Clear = function () {
			var all = document.querySelectorAll('.waffles-guidewrapper');

			for (i = 0; i < all.length; i++) {
				document.body.removeChild(all[i]);
			}

			that.SaveState();
		};

		that.Add = function (className, position) {
			var guide = document.createElement('div');
			guide.setAttribute('class', 'waffles-guide ' + className);
			
			var guideWrapper = document.createElement('div');
			guideWrapper.setAttribute('class', 'waffles-guidewrapper ' + className);

			if (className === 'waffles-guidewrapper-horizontal') {
				guideWrapper.style.top = position;
			}

			if (className === 'waffles-guidewrapper-vertical') {
				guideWrapper.style.left = position;
			}
			
			guideWrapper.addEventListener('mousedown', wafflesapp.OnDragStart);
			guideWrapper.addEventListener('dblclick', wafflesapp.Remove);
			guideWrapper.appendChild(guide)
			
			document.body.appendChild(guideWrapper);
			
			that.SaveState();
		};

		that.Remove = function (e) {
			document.body.removeChild(e.currentTarget);

			that.SaveState();
		};
		
		that.AddHorizontal = function (top) {
			// TODO: pageYOffset is not supported by older browsers
			that.Add('waffles-guidewrapper-horizontal', top || window.pageYOffset + (window.innerHeight / 2) + 'px');
		};

		that.AddVertical = function (left) {
			that.Add('waffles-guidewrapper-vertical', left || '50%');
		};

		that.SaveState = function () {
			var all = document.querySelectorAll('.waffles-guidewrapper'),
				horizontals = [],
				verticals = [],
				className = null,
				i = 0;

			for (i = 0; i < all.length; i++) {
				className = (' ' + all[i].className + ' ');
				if (className.replace(/[\n\t\r]/g, ' ').indexOf('waffles-guidewrapper-vertical') > -1) {
					verticals.push(all[i].style.left);
				} else if (className.replace(/[\n\t\r]/g, ' ').indexOf('waffles-guidewrapper-horizontal') > -1) {
					horizontals.push(all[i].style.top);
				}
			}

			document.cookie = encodeURIComponent(location.href) + '=' + horizontals.join(',') + '|' + verticals.join(',');
		};
		
		that.LoadState = function () {
			var cookies = document.cookie ? document.cookie.split(';') : [],
				cookieParts = null,
				guideParts = null,
				horizontals = null,
				verticals = null
				i = 0,
				j = 0;
				
			for (i = 0; i < cookies.length; i++) {
				cookieParts = cookies[i].split('=');
				
				if (cookieParts.length === 2 && decodeURIComponent(cookieParts[0].replace(/\s/g, '')) === location.href) {
					guideParts = cookieParts[1].split('|');

					if (guideParts.length === 2) {
						horizontals = guideParts[0] !== '' ? guideParts[0].split(',') : [];
						for (j = 0; j < horizontals.length; j++) {
							that.AddHorizontal(horizontals[j]);
						}

						verticals = guideParts[1] !== '' ? guideParts[1].split(',') : [];
						for (j = 0; j < verticals.length; j++) {
							that.AddVertical(verticals[j]);
						}
					}

					break;
				}
			}
		};
		
		that.OnDragStart = function (e) {
			waffle = this;
			e.preventDefault();	
		};
		
		that.OnDragMove = function (e) {
			if (!waffle) { 
				return; 
			}
			
			var className = (' ' + waffle.className + ' ');
			
			if (className.replace(/[\n\t\r]/g, ' ').indexOf('waffles-guidewrapper-vertical') > -1) {
				waffle.style.left = (e.clientX) + 'px';
			} else if (className.replace(/[\n\t\r]/g, ' ').indexOf('waffles-guidewrapper-horizontal') > -1) {
				waffle.style.top = (e.clientY + window.pageYOffset) + 'px';
			}
		};
		
		that.OnDragStop = function (e) {
			waffle = null;
			that.SaveState();
		};
	};

	window.wafflesapp = new wafflesjs();

	if (/in/.test(document.readyState)) {
		window.addEventListener('load', function() { wafflesapp.Initialize(); }, false);
	} else {
		wafflesapp.Initialize();
	};
})();