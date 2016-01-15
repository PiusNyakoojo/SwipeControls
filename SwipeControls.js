/* Phaseshifter: spacepi.me */

THREE.SwipeControls = function( camera, domElement ) {

	this.camera = camera;
	this.domElement = ( domElement !== undefined ) ? domElement : document;
	
	// Set to false to disable this control
	this.enabled = true;

	this.speed = 0.01; // speed of swipe
	this.swipeBuffer = 0.85; // reduction of speed after swipe is released ( between 0 and 1 )
	this.scrollSpeed = 30;

	this.lockX = false;
	this.lockY = false;

	// internals

	var scope = this;

	var mouseDown = false;
	var timer;

	var leftLimit = -Infinity; // left limit
	var rightLimit = Infinity; // right limit

	var bottomLimit = -Infinity; // bottom limit
	var topLimit = Infinity; // top limit

	var oldMouseX = 0, oldMouseY = 0;
	var newMouseX = 0, newMouseY = 0;
	var deltaMouseX = 0, deltaMouseY = 0;

	this.update = function() {

		if ( mouseDown ) {
			
			this.camera.position.x += deltaMouseX * this.speed;
			this.camera.position.y -= deltaMouseY * this.speed;

		} else {

			if ( Math.abs( 0 - deltaMouseX ) > 0.01 ) {

				this.camera.position.x += deltaMouseX * this.speed;
				deltaMouseX *= this.swipeBuffer;

			}

			if ( Math.abs( 0 - deltaMouseY ) > 0.01 ) {

				this.camera.position.y -= deltaMouseY * this.speed;
				deltaMouseY *= this.swipeBuffer;

			}

		}

		ensureLimits();

	};

	this.setLimit = function( type, value ) {

		switch( type ) {
			case "top":
				if ( value < bottomLimit ) {
					topLimit = bottomLimit;
					bottomLimit = value;
				} else {
					topLimit = value;
				}
				break;
			case "bottom":
				if ( value > topLimit ) {
					bottomLimit = topLimit;
					topLimit = value;
				} else {
					bottomLimit = value;
				}
				break;
			case "left":
				if ( value > rightLimit ) {
					leftLimit = rightLimit;
					rightLimit = value;
				} else {
					leftLimit = value;
				}
				break;
			case "right":
				if ( value < leftLimit ) {
					rightLimit = leftLimit;
					leftLimit = value;
				} else {
					rightLimit = value;
				}
				break;
		}
	}

	function ensureLimits() {
		if ( this.camera.position.x > rightLimit ) {
			this.camera.position.x = rightLimit;
		} else if ( this.camera.position.x < leftLimit ) {
			this.camera.position.x = leftLimit;
		}

		if ( this.camera.position.y > topLimit ) {
			this.camera.position.y = topLimit;
		} else if ( this.camera.position.y < bottomLimit ) {
			this.camera.position.y = bottomLimit;
		}
	}

	function onMouseDown( event ) {

		if ( scope.enabled === false ) return;

		if ( event.button === 0 ) {

			mouseDown = true;

			oldMouseX = event.clientX;
			oldMouseY = event.clientY;

		}

		scope.domElement.addEventListener( 'mousemove', onMouseMove, false );
		scope.domElement.addEventListener( 'mouseup', onMouseUp, false );

	}

	function onMouseUp( event ) {

		if ( scope.enabled === false ) return;

		if ( event.button === 0 ) {
			mouseDown = false;
		}

		scope.domElement.removeEventListener( 'mousemove', onMouseMove, false );
		scope.domElement.removeEventListener( 'mouseup', onMouseUp, false );

	}

	function onMouseMove( event ) {

		if ( scope.enabled === false ) return;

		if ( mouseDown ) {
			
			if ( !scope.lockX ) {

				newMouseX = event.clientX;
				deltaMouseX = oldMouseX - newMouseX;
				oldMouseX = newMouseX;

			}
			
			if ( !scope.lockY ) {

				newMouseY = event.clientY;
				deltaMouseY = oldMouseY - newMouseY;
				oldMouseY = newMouseY;

			}

			clearTimeout( timer );
			
			timer = setTimeout( mouseStopped, 20 );
			
		}

	}

	function onMouseWheel( event ) {
		
		if ( scope.enabled === false ) return;

		if ( !scope.lockY && !mouseDown ) {
			newMouseY = oldMouseY + scope.scrollSpeed * ( event.deltaY > 0 ? -1 : 1 );
			deltaMouseY = oldMouseY - newMouseY;
			oldMouseY = newMouseY;
		}

	}

	function touchstart( event ) {

		if ( scope.enabled === false ) return;

		if ( event.touches.length === 1 ) { // one-fingered touch

			mouseDown = true;

			oldMouseX = event.touches[0].pageX;
			oldMouseY = event.touches[0].pageY;

		}
		
	}

	function touchmove( event ) {
		
		if ( scope.enabled === false ) return;

		event.preventDefault();
		event.stopPropagation();

		if ( mouseDown ) {
			
			if ( !scope.lockX ) {

				newMouseX = event.touches[0].pageX;
				deltaMouseX = oldMouseX - newMouseX;
				oldMouseX = newMouseX;

			}
			
			if ( !scope.lockY ) {

				newMouseY = event.touches[0].pageY;
				deltaMouseY = oldMouseY - newMouseY;
				oldMouseY = newMouseY;

			}

			clearTimeout( timer );
			
			timer = setTimeout( mouseStopped, 20 );
			
		}

	}

	function touchend( event ) {

		if ( scope.enabled === false ) return;

		mouseDown = false;

	}

	function mouseStopped() {
		
		if ( mouseDown ) {

			deltaMouseX = 0;
			deltaMouseY = 0;

		}
		
	}

	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );
    this.domElement.addEventListener( 'mousedown', onMouseDown, false );
    this.domElement.addEventListener( 'mousewheel', onMouseWheel, false );
	this.domElement.addEventListener( 'DOMMouseScroll', onMouseWheel, false ); // firefox

	this.domElement.addEventListener( 'touchstart', touchstart, false );
	this.domElement.addEventListener( 'touchend', touchend, false );
	this.domElement.addEventListener( 'touchmove', touchmove, false );

	// force an update at start
	this.update();
};

THREE.SwipeControls.prototype = Object.create( THREE.EventDispatcher.prototype );