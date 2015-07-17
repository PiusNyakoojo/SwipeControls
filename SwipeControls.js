/* Phaseshifter: spacepi.me */

THREE.SwipeControls = function( camera, domElement ) {

	this.camera = camera;
	this.domElement = ( domElement !== undefined ) ? domElement : document;

	this.speed = 0.01; // speed of swipe
	this.swipeBuffer = 0.85; // reduction of speed after swipe is released ( between 0 and 1 )

	var mouseDown = false;
	var timer;

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

	};

	onMouseDown = function( event ) {

		if ( event.button === 0 ) {

			mouseDown = true;

			oldMouseX = event.clientX;
			oldMouseY = event.clientY;

		}

	};

	onMouseUp = function( event ) {

		if ( event.button === 0 ) {
			mouseDown = false;
		}

	};

	onMouseMove = function( event ) {

		if ( mouseDown ) {
		
			newMouseX = event.clientX;
			deltaMouseX = oldMouseX - newMouseX;
			oldMouseX = newMouseX;
			
			newMouseY = event.clientY;
			deltaMouseY = oldMouseY - newMouseY;
			oldMouseY = newMouseY;

			clearTimeout(timer);
			
			timer = setTimeout(mouseStopped, 20);
			
		}

	};

	mouseStopped = function() {
		
		if ( mouseDown ) {

			deltaMouseX = 0;
			deltaMouseY = 0;

		}
		
	};

	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );
    this.domElement.addEventListener( 'mousedown', onMouseDown, false );
    this.domElement.addEventListener( 'mouseup', onMouseUp, false );
    this.domElement.addEventListener( 'mousemove', onMouseMove, false );

};

THREE.SwipeControls.prototype = Object.create( THREE.EventDispatcher.prototype );