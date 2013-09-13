/**
 * Created by JetBrains WebStorm.
 * User: C4RL05
 * Date: 25/07/2011
 * Time: 11:38
 * To change this template use File | Settings | File Templates.
 */

LIGHTS.GUI = function( go ) {

	this.initialize( go );
};

LIGHTS.GUI.prototype = {

	shareLeft:          49,

    // _______________________________________________________________________________________ Constructor

	initialize: function( go ) {

		LIGHTS.GUI.instance = this;

		this.setup();

        if( go )
            this.setupGo();
		else
            this.setupFail();
	},

	setup: function() {
/*
		this.logo = document.getElementById( 'lights_logo' );
		this.hey = document.getElementById( 'lights_helloenjoy' );
		this.share = document.getElementById( 'lights_share' );
		this.credits = document.getElementById( 'lights_credits' );

		this.logo.style.visibility =
		this.hey.style.visibility =
		this.share.style.visibility =
		this.credits.style.visibility = 'hidden';

		this.share.style.display = 'none';
*/
	},

	setupGo: function() {
		console.log("Setup go");
/*
		this.info = document.getElementById( 'lights_info' );
		this.info.style.visibility = 'hidden';

		this.div = document.getElementById( 'lights_outer' );
		this.active = false;
*/
	},

	setupFail: function() {
		console.log("Setup fail");
		// document.body.style.backgroundImage = "url('images/home/background.jpg')";

		// this.logo.style.visibility =
		// this.hey.style.visibility =
		// this.share.style.visibility =
		// this.credits.style.visibility = 'visible';

		// document.getElementById( 'lights_fail' ).style.visibility = 'visible';

		// this.share.style.display = 'inline';
		// this.share.style.left = this.shareLeft + 'px';
	},

	fade: function( alpha ) {

/*
		if( alpha > 0 ) {

			this.logo.style.visibility =
			this.hey.style.visibility =
			this.info.style.visibility =
			this.share.style.visibility =
			this.credits.style.visibility = 'visible';

			this.setOpacity( this.logo, Math.max( 0, Math.min( 1, alpha * 2 ) ) );
			this.setOpacity( this.hey, Math.max( 0, Math.min( 1, alpha * 2 - 0.5 ) ) );
			this.setOpacity( this.info, Math.max( 0, Math.min( 1, alpha * 2 - 0.25 ) ) );
			this.setOpacity( this.share, Math.max( 0, Math.min( 1, alpha * 2 - 1 ) ) );
			this.setOpacity( this.credits, Math.max( 0, Math.min( 1, alpha * 2 - 0.75 ) ) );

			this.share.style.display = 'inline';
			this.share.style.left = this.shareLeft + 'px';
		}
		else {

			this.logo.style.visibility =
			this.hey.style.visibility =
			this.info.style.visibility =
			this.share.style.visibility =
			this.credits.style.visibility = 'hidden';
		}
*/
	},

	setOpacity: function( div, opacity ) {

		div.style.opacity = opacity;

		if( div.filters !== undefined )
			div.filters.alpha.opacity = opacity * 100;
	}
};
/**
 * Created by JetBrains WebStorm.
 * User: C4RL05
 * Date: 11/07/2011
 * Time: 17:43
 * To change this template use File | Settings | File Templates.
 */

LIGHTS.releaseBuild = true;
//LIGHTS.releaseBuild = false;

LIGHTS.time = 0;
LIGHTS.deltaTime = 0;

LIGHTS.colors = [ 0xFF1561, 0xFFF014, 0x14FF9D, 0x14D4FF, 0xFF9D14 ];
LIGHTS.hues = [ 341/360, 56/360, 155/360, 191/360, 35/360 ];

LIGHTS.colorBlack = new THREE.Color( 0x000000 );
LIGHTS.colorWhite = new THREE.Color( 0xFFFFFF );

// _______________________________________________________________________________________ Start

document.onselectstart = function() { return false; }; // ie
document.onmousedown = function() { return false; }; // mozilla

function bind( scope, fn ) {

    return function() {

        fn.apply( scope, arguments );
    };
}

window.onload = function() {

	this.lights = new LIGHTS.Lights();
}

// _______________________________________________________________________________________ Lights

LIGHTS.Lights = function() {

    LIGHTS.Lights.instance = this,

	this.initialize();
};

LIGHTS.Lights.prototype = {

    // _______________________________________________________________________________________ Constructor

	initialize: function() {
		console.log("initialize");
        if( Detector.webgl ) {
	        console.log("Detected webgl");
	        this.renderManager = new LIGHTS.RenderManager();
	        this.input = new LIGHTS.Input();
	        this.gui = new LIGHTS.GUI( true );
	        this.home = new LIGHTS.Home( this.renderManager, this.gui, bind( this, this.launchHome ) );
	        this.loader = new LIGHTS.Loader( bind( this, this.launch ) );

        }
        else {
	        console.log("Cannot find webgl");
	        this.gui = new LIGHTS.GUI( false );
        }
	},

    // _______________________________________________________________________________________ Launch

	launchHome: function() {
		console.log("launch home");
		this.home.launchIntro();
		this.experiencePlaying = false;
		this.animateLights();
	},

    launch: function() {
	  	console.log("launch");  
	    LIGHTS.stopwatch = new LIGHTS.Stopwatch();

        this.view = new LIGHTS.View( this.renderManager );
        this.director = new LIGHTS.Director( this.view );
	    this.home.launchPlay();
    },

	playExperience: function() {
		console.log("playExperience");
		this.home.stop();
		this.director.start();
		this.experiencePlaying = true;
	},

	playHome: function() {
		console.log("play home");
		this.director.stop();
		this.home.start();
		this.experiencePlaying = false;
	},

    // _______________________________________________________________________________________ Update

	animateLights: function() {

		requestAnimationFrame( bind( this, this.animateLights ) );

		if( this.experiencePlaying ) {

			this.view.clear();
			this.director.update();
			this.view.update();
			this.director.postUpdate();
		}
		else {
			// console.log("update home");
			this.home.update();
		}
    }
};

var rad45 = Math.PI / 4,
    rad90 = Math.PI / 2,
    rad180 = Math.PI,
    rad360 = Math.PI * 2,
    deg2rad = Math.PI / 180,
    rad2deg = 180 / Math.PI,
	phi = 1.618033988749;

//LIGHTS.guiOptions = {
//    particleX:	            0,
//    particleY:	            0,
//    particleZ:	            0,
//    particleScreenX: 		0,
//    particleScreenY: 		0
//};


/**
 * Created by JetBrains WebStorm.
 * User: C4RL05
 * Date: 12/08/2011
 * Time: 10:15
 * To change this template use File | Settings | File Templates.
 */

LIGHTS.images =  {};

LIGHTS.Loader = function( callback ) {

	this.initialize( callback );
};

LIGHTS.Loader.prototype = {

    // _______________________________________________________________________________________ Vars

	totalTweets:    9,

    // _______________________________________________________________________________________ Constructor

	initialize: function( callback ) {

		this.callback = callback;

		LIGHTS.Loader.prototype.instance = this;

		this.avatarsLoaded = false;
		this.loadMusic();
	},

    // _______________________________________________________________________________________ Load Tweets

	loadMusic: function() {

		var audio = document.createElement('audio'),
			musicSrc = null;

	    if( audio.canPlayType ) {

			if( audio.canPlayType( 'audio/mpeg' ) != "" )
				musicSrc = LIGHTS.Config.musicMP3;
		    else if ( audio.canPlayType( 'audio/ogg; codecs="vorbis"' ) != "" )
				musicSrc = LIGHTS.Config.musicOGG;
        }

		if( musicSrc !== null ) {

			// for Ejecta
			audio.preload = true;
			audio.src = "assets/snd/music.mp3"
			// audio.setAttribute( 'preload', 'auto' );
			// audio.setAttribute( 'src', musicSrc );
			this.canPlayThroughListener = bind( this, this.loadTweets );
			audio.addEventListener( "canplaythrough", this.canPlayThroughListener, true );
			audio.load();

			LIGHTS.musicAudio = audio;
		}
		else
			console.error( "Error: loadMusic" );
	},

    // _______________________________________________________________________________________ Load Tweets

	loadTweets: function() {

		var ok = false;

		LIGHTS.musicAudio.removeEventListener( "canplaythrough", this.canPlayThroughListener, true );

		LIGHTS.tweets = [];
		this.isServerOk = false;

		if( ! LIGHTS.releaseBuild ) {

			this.onLoadTweetsError();
		}
		else {

			try {
				/*
				var script = document.createElement( 'script' );
				script.type = 'text/javascript';
				script.src = LIGHTS.Config.tweetsFeed;
				document.body.appendChild( script );
				*/

				this.timeout = setTimeout( 'LIGHTS.Loader.prototype.instance.onLoadTweetsError()', 5000 );
			}
			catch( error ) {

				console.error( "Error: loadTweets", error );
				this.onLoadTweetsError();
			}
		}
	},

	onLoadTweetsError: function() {

		this.loadAvatarImages( [] );
	},

	onTweetsLoaded: function( json ) {

		clearTimeout( this.timeout );

		var avatars = [],
			tweet = 0,
			username, actor, i, il;

		if( json.result == 'error' ) {

			console.error( "Error: onTweetsLoaded", json );
		}
		else {

			if( ! LIGHTS.releaseBuild )
				console.log( "onTweetsLoaded!", json.entries[0] );

			var entries = json.entries;

			for( i = 0, il = entries.length; i < il; i++ ) {

				actor = entries[ i ].actor;
				username = actor.id.substr( actor.id.lastIndexOf( '/' ) + 1 );

				if( LIGHTS.tweets.indexOf( username ) == -1 ) {

					LIGHTS.tweets.push( username );
					avatars.push( actor.avatar );

					if( ! LIGHTS.releaseBuild )
						console.log( username, actor.avatar );
				}
			}
		}

		// Add handler
		for( i = 0, il = avatars.length; i < il; i++ )
			avatars[ i ] = LIGHTS.Config.avatarHandler + encodeURI( avatars[ i ] );

		this.loadAvatarImages( avatars );

	},

	loadAvatarImages: function( avatars ) {

		if( this.avatarsLoaded )
			return;

		this.avatarsLoaded = true;

		if( ! LIGHTS.releaseBuild )
			console.log( "loadAvatarImages" );

		var	tweet = 0,
			i, il;

		// Complete usernames + avatars
		for( i = LIGHTS.tweets.length, il = this.totalTweets; i < il; i++ ) {

			avatars.push( LIGHTS.Config.defaultAvatars[ tweet ] );
			LIGHTS.tweets.push( LIGHTS.Config.defaultTweets[ tweet ] );
			tweet++;
		}

		// Add to images
		for( i = 0, il = this.totalTweets; i < il; i++ )
			LIGHTS.Config.images[ 'avatar' + i ] = avatars[ i ];

		this.loadImages();
	},

	strip: function( html ) {

	   var div = document.createElement( 'div' );
	   div.innerHTML = html;

	   return div.textContent || div.innerText;
	},

    // _______________________________________________________________________________________ Load Images

	loadImages: function () {

		var callback = bind( this, this.loadFont ),
			loadedImages = 0,
			numImages = 0;

		for( var src in LIGHTS.Config.images ) {

			numImages++;

			LIGHTS.images[ src ] = new Image();

			LIGHTS.images[ src ].onload = function() {

				if( ++loadedImages >= numImages )
					 callback();
			};

			LIGHTS.images[ src ].src = LIGHTS.Config.images[ src ];
		}
	},

    // _______________________________________________________________________________________ Load Font

	loadFont: function() {

		var callback = bind( this, this.onLoaderComplete );
			client = new XMLHttpRequest();

		client.open( 'GET', LIGHTS.Config.font );

		client.onreadystatechange = function( event ) {

			if( event.currentTarget.readyState == XMLHttpRequest.DONE ) {

				LIGHTS.DotsFont = new LIGHTS.BitmapFont( client.responseText, LIGHTS.images.font );
				callback();
			}
		};

		client.send();
	},

    // _______________________________________________________________________________________ Complete

	onLoaderComplete: function() {

		this.callback();
	}
};

function onTweetsLoaded( json ) {

	LIGHTS.Loader.prototype.instance.onTweetsLoaded( json );
}
/**
 * Created by JetBrains WebStorm.
 * User: C4RL05
 * Date: 25/07/2011
 * Time: 10:41
 * To change this template use File | Settings | File Templates.
 */

LIGHTS.BeatEvents = function( director ) {

	this.initialize( director );
};

LIGHTS.BeatEvents.prototype = {

//    colorsA:    [ 0xFF1561, 0x1a0209 ],
//    colorsB:    [ 0x1a1002, 0xFF9D14 ],
//    colorsC:    [ 0xFF1561, 0xFF9D14 ],
//    colorsA:    [ 0xff2000, 0x1a0300 ],
//    colorsB:    [ 0x40ff00, 0x031a00 ],
//    colorsC:    [ 0x40ff00, 0xff2000, 0x0020ff ],
//    colors:    [ 0x40ff00, 0xff2000, 0x0020ff ],
//    colors:    [ 0x104000, 0x400800, 0x000840 ],
    colors:    [ 0x000080, 0x400080, 0x004080 ],


    // _______________________________________________________________________________________ Constructor

	initialize: function( director ) {

        this.director = director;

		this.terrain = director.terrain;
		this.displacement = director.terrain.displacement;
        this.tileManager = director.tileManager;
		this.player = director.player;
		this.skybox = director.skybox;
		this.vox = director.vox;

        this.stars = this.tileManager.stars;
        this.terrainDots = this.tileManager.terrainDots;
        this.terrainMesh = this.tileManager.terrainMesh;
        this.balls = this.tileManager.balls;
        this.cannons = this.tileManager.cannons;
//        this.tubes = this.tileManager.tubes;

        this.beatData = LIGHTS.Music.beatData;
        this.beats = 0;
    },

    // _______________________________________________________________________________________ Start

    start: function() {

	    if( LIGHTS.Music.startTime > 0 )
            this.lastTime = LIGHTS.Music.startTime;
	    else
	        this.lastTime = this.beatData.start - this.beatData.freq;

        this.nextIncluded = 0;
        this.included = true;

        this.color = 0;
	    this.beats = 0;
    },

	stop: function() {

		this.vox.stop();
	},

    // _______________________________________________________________________________________ Update

    update: function() {

        if( this.included  &&  LIGHTS.time > this.beatData.included[ this.nextIncluded ] ) {

            this.nextIncluded++;
            this.included = (this.nextIncluded < this.beatData.included.length);
        }

        if( LIGHTS.time >= this.beatData.start  &&  LIGHTS.time < this.beatData.end  &&  LIGHTS.time - this.lastTime > this.beatData.freq ) {

            this.lastTime += this.beatData.freq;

            if( this.beatData.excluded.indexOf( this.lastTime ) == -1 )
                this.beat();
        }
    },

    // _______________________________________________________________________________________ Launch Phase

   /*
        A1: 0
        B1: 1,2
        C1: 3,4
        B2: 5,6
        C2: 7,8
        D1: 9
        C3: 10,11
        D2: 12
        A2: 13
    */

    launch: function() {

        switch( LIGHTS.Music.phase.index ) {

            case 0:
	            this.terrain.reset();
	            this.terrainMesh.active = false;
	            this.displacement.active = false;
	            this.cannons.active = false;
//	            this.tubes.active = false;

	            this.balls.active = true;
	            this.balls.launch();
	            this.stars.active = true;
	            this.stars.launch();
	            this.terrainDots.launch();
                this.terrainDots.active = true;
	            this.tileManager.apply();

	            this.player.launch();
	            this.skybox.mesh.visible = false;
	            this.director.spectrumEvents.start( 1 / 4000, 8 );
                break;

            case 1:
	            this.terrainMesh.active = true;
	            this.terrainMesh.launch();
	            this.vox.start();
	            this.nextBeat = 3;
                break;

            case 2:
	            this.terrainMesh.launch();
	            this.terrainDots.launch();
                this.balls.launch();
                break;

            case 3:
	            this.balls.launch();
	            this.terrainDots.launch();
	            this.terrainMesh.launch();
                this.terrainDots.active = true;
                this.tileManager.apply();

		        this.player.launch();
	            this.skybox.mesh.visible = true;
                break;

	        case 4:
            case 5:
            case 6:
                this.terrainDots.launch();
	            this.balls.launch();
//	            this.tileManager.apply();
                break;

	        case 7: // B2
		        this.balls.launch();
		        this.terrainMesh.launch();
		        this.terrainDots.launch();
	            this.tileManager.apply();

			    this.player.launch();
		        this.skybox.mesh.visible = false;
	            break;

	        case 8: // B2b
		        this.balls.launch();
		        this.terrainMesh.launch();
	            this.terrainDots.active = false;
			    this.tileManager.apply();
		        break;

	        case 9: // B2c
		        this.player.launch();
		        this.balls.launch();
			    this.tileManager.apply();
		        break;

	        case 10: // B2d
	            this.balls.launch();
		        this.tileManager.apply();
	            break;

	        case 11: // C2
		        this.balls.launch();
		        this.player.launch();
		        this.terrainMesh.launch();
		        this.terrainDots.active = true;
		        this.terrainDots.launch();
		        this.tileManager.apply();

		        this.skybox.mesh.visible = true;
		        break;

	        case 12: // C2b
		        this.balls.launch();
		        this.terrainDots.launch();
			    this.tileManager.apply();
		        break;

	        case 13: // C2c
	            this.balls.launch();
		        this.terrainMesh.launch();
		        this.terrainDots.launch();
		        this.tileManager.apply();

		        this.player.launch();
	            break;

	        case 14: // C2d
		        this.terrainMesh.launch();
//		        this.tileManager.apply();
//		        this.tubes.active = true;
//		        this.tubes.launch();
//		        this.tileManager.apply();
		        break;

	        case 15: // D1
	            this.balls.launch();
		        this.terrainDots.launch();
		        this.terrainMesh.launch();
//		        this.terrainDots.active = false;
		        this.tileManager.apply();

		        this.displacement.active = true;
		        this.director.spectrumEvents.start( 1 / 2000, 4 );
		        this.player.launch();
	            break;

	        case 16: // S!
		        this.terrainMesh.launch();
		        this.terrainDots.launch();
	            this.balls.launch();
		        this.tileManager.apply();

		        this.player.launch();
		        this.skybox.mesh.visible = false;
	            break;

	        case 17: // C3
		        this.terrainMesh.launch();
		        this.terrainDots.launch();
	            this.balls.launch();
		        this.cannons.active = true;
		        this.cannons.launch();
		        this.tileManager.apply();

		        this.player.launch();
		        this.displacement.launchFlat2Terrain();
		        this.skybox.mesh.visible = true;
	            break;

	        case 18: // C3b
		        this.terrainMesh.launch();
		        this.terrainDots.launch();
	            this.balls.launch();

		        this.player.launch();
		        this.displacement.active = false;
		        break;

	        case 19: // C3c
		        this.cannons.launch();
		        this.terrainMesh.launch();
		        this.terrainDots.launch();
	            this.balls.launch();
				break;

	        case 20: // C3d
		        this.terrainMesh.launch();
		        this.terrainDots.launch();
	            this.balls.launch();
				break;

	        case 21: // D2
		        this.terrainDots.active = true;
		        this.terrainDots.launch();
		        this.balls.launch();
		        this.terrainMesh.launch();
		        this.tileManager.apply();

		        this.displacement.active = true;
		        this.director.spectrumEvents.start( 1 / 4000, 4 );
		        this.player.launch();
	            break;

	        case 22: // A2
		        this.skybox.mesh.visible = false;
		        this.balls.launch();
		        this.terrainMesh.launch();
		        this.player.launch();
				this.terrainDots.launch();
		        this.cannons.launch();
		        this.stars.launch();
		        this.vox.finish();
		        break;

	        case 23: // END
		        this.cannons.active = false;
		        this.terrainDots.active = false;
		        this.terrainMesh.active = false;
		        this.balls.active = false;
		        this.tileManager.apply();

	            LIGHTS.Lights.instance.playHome();
	            break;
        }
    },

    // _______________________________________________________________________________________ Beat

    beat: function() {

        switch( LIGHTS.Music.phase.index ) {

	        case 1:
				if( this.nextBeat == 0 ) {

					this.balls.beat();
					this.terrainDots.beat();
		        }
		        else if( this.nextBeat == 1 ) {
					this.vox.launch();

					this.balls.launch();
					this.terrainDots.launch();
					this.terrainMesh.launch();
				    this.balls.active = true;
					this.terrainMesh.active = true;
				    this.tileManager.apply();
					this.player.launch();

			        this.nextBeat--;
		        }
		        else {

			        this.nextBeat--;
		        }
				break;

	        case 2:
            case 3:
            case 4:
            case 5:
                this.balls.beat();
                this.terrainDots.beat();
                break;

            case 6:
	            this.balls.beat();
	            this.terrainDots.beat();
                this.terrainMesh.beat();
                break;

            case 7: // B2
	            this.terrainMesh.beat();
                break;

	        case 8: // B2b
	        case 9: // B2c
	        case 10: // B2d
		        this.balls.beat();
		        this.terrainMesh.beat();
	            break;

	        case 11: // C2
	        case 12: // C2b
		        this.balls.beat();
		        this.terrainMesh.beat();
		        this.terrainDots.beat();
	            break;

	        case 13: // C2c
		        this.terrainDots.beat();
		        break;

	        case 14: // C2d
		        this.terrainMesh.beat();
		        this.terrainDots.beat();
	            break;

	        case 15: // D1
//		        this.balls.beat();
		        this.terrainMesh.beat();
		        this.terrainDots.beat();
	            break;

	        case 17: // C3
	        case 18: // C3b
	        case 19: // C3c
	        case 20: // C3d
	            this.balls.beat();
	            this.terrainMesh.beat();
		        this.terrainDots.beat();
                break;

	        case 21: // D2
//	            this.displacement.createBump( Math.random() * 40 + 10 );
		        this.balls.beat();
		        this.terrainMesh.beat();
	            this.terrainDots.beat();
	            break;

	        case 22: // A2
	            this.terrainDots.beat();
//		        this.director.view.scene.fog = null;
//		        this.director.view.scene.fog.setFog( 0.0001 );
	            break;
        }

        this.beats++;
    }
};
/**
 * Created by JetBrains WebStorm.
 * User: C4RL05
 * Date: 18/07/2011
 * Time: 18:56
 * To change this template use File | Settings | File Templates.
 */

LIGHTS.Music = {

    startTime: 0,   //  0 A1
//    startTime: 6,   //  1 B1
//    startTime: 20,  //  2 B1a
//    startTime: 36,  //  3 C1
//    startTime: 42,  //  4 C1a
//    startTime: 50,  //  5 C1c
//    startTime: 54,  //  5 C1c+
//    startTime: 68,  //  7 B2
//    startTime: 82,  //  9 B2c
//    startTime: 98, // 11 C2
//    startTime: 116, // 13 C2c
//    startTime: 124, // 14 C2d
//    startTime: 130, // 15 D1
//    startTime: 142, // 16 S!
//    startTime: 149, // 17 C3
//    startTime: 161, // 19 C3c
//    startTime: 178, // 21 D2
//    startTime: 195, // 22 A2

//    mute: true,
    mute: false,

    /*
        A1: 0
        B1: 1,2
        C1: 3,4,5,6
        B2: 7,8,9,10
        C2: 11,12,13,14
        D1: 15
        S!: 16
        C3: 17,18,19,20
        D2: 21
        A2: 22
    */
    phase: {
        //   A1  B1       C1                B2              C2                  D1   S!      C3                  D2   A2   END
        times: [ 7, 24.5, 40, 48, 55.5, 64, 72, 80, 88, 96, 104, 112, 120, 128, 136, 149.75, 152, 160, 168, 176, 184, 200, 210 ],
        index: 0
    },

    beatData: {
        start:      7,
        go:         24,
        end:        204,
        freq:       0.5,
        excluded:   [ 40, 48, 55.5, 64, 70, 70.5, 71, 104, 112, 120, 128, 136, 150, 150.5, 151, 151.5, 152, 160, 168, 176, 184, 200 ],
        included:   [ 69.75, 71.25, 71.375, 71.75, 149.75  ]
    }
};

LIGHTS.Director = function( view ) {

	this.initialize( view );
};

LIGHTS.Director.prototype = {

    // _______________________________________________________________________________________ Constructor

	initialize: function( view ) {

        this.view = view;

        // Stage
		this.player = new LIGHTS.Player( this );
		this.vox = new LIGHTS.Vox( this );
		this.materialCache = new LIGHTS.MaterialCache( this );

        this.terrain = new LIGHTS.Terrain( this );
        this.tileManager = new LIGHTS.TileManager( this );

        this.skybox = new LIGHTS.Skybox( this );
//		this.stars = new LIGHTS.Stars( this );

        // Events
        this.beatEvents = new LIGHTS.BeatEvents( this );
		this.volumeEvents = new LIGHTS.VolumeEvents( this );
		this.spectrumEvents = new LIGHTS.SpectrumEvents( this );

        this.music = LIGHTS.musicAudio;
	},

    // _______________________________________________________________________________________ Start

    start: function() {

//        this.lastTime = -1;
	    this.lastTime = new Date().getTime();

        // Music
		this.music.currentTime = LIGHTS.time = LIGHTS.Music.startTime;
        this.music.play();
        this.music.volume = LIGHTS.Music.mute? 0 : 1;
	    LIGHTS.deltaTime = 0;

	    this.view.start();

        // Phase
        LIGHTS.Music.phase.index = 0;
        this.launch();

        // Events
        this.beatEvents.start();
	    this.volumeEvents.start();

	    this.isFast = false;
	    this.active = true;

    },

    stop: function() {

		this.active = false;
	    this.music.pause();

	    this.view.stop();

        // Stage
        this.vox.stop();

//        this.terrain.stop();
//        this.tileManager.stop();

        // Events
        this.beatEvents.stop();
//	    this.volumeEvents.stop();
//	    this.spectrumEvents.stop();

//this.stars.stop();

//        this.skybox.stop();
//	    console.log("DIRECTOR STOP");
    },

    // _______________________________________________________________________________________ Update

    update: function() {

	    if( ! LIGHTS.releaseBuild && LIGHTS.Input.keySpace )
	        LIGHTS.Lights.instance.playHome();

        // Time
        var time = new Date().getTime();

        if( this.lastTime != -1 ) {

	        if( ! LIGHTS.releaseBuild && LIGHTS.Input.keyUp ) {

		        if( ! this.isFast ) {

			        this.isFast = true;
			        this.music.volume = 0;
		        }

		        LIGHTS.deltaTime = (time - this.lastTime) / 1000 + 0.1;
				LIGHTS.time += LIGHTS.deltaTime;
	        }
	        else {

		        LIGHTS.deltaTime = (time - this.lastTime) / 1000;

		        if( this.isFast ) {

			        this.isFast = false;
			        this.music.volume = LIGHTS.Music.mute? 0 : 1;
			        this.music.currentTime = LIGHTS.time + LIGHTS.deltaTime;
		        }
		        else {

			        // Sync with music
			        LIGHTS.time = this.music.currentTime;

			        // Sync with time
//			        LIGHTS.time += LIGHTS.deltaTime;
		        }
	        }
        }
	    else {

	        LIGHTS.time = LIGHTS.deltaTime = this.music.currentTime;
        }

	    LIGHTS.deltaTime = Math.min( LIGHTS.deltaTime, 0.2 );

        this.lastTime = time;

        // Phase
        if( LIGHTS.time > LIGHTS.Music.phase.times[ LIGHTS.Music.phase.index ] ) {

            LIGHTS.Music.phase.index++;
            this.launch();

	        if( LIGHTS.time > LIGHTS.Music.phase.times[ LIGHTS.Music.phase.index ] ) {

		        this.beatEvents.beat();
		        this.beatEvents.beat();
		        this.beatEvents.beat();
		        this.beatEvents.beat();
	        }
        }

        // Stage
        this.player.update();
        this.vox.update();
        this.terrain.update();
        this.tileManager.update();

        // Events
        this.beatEvents.update();
	    this.volumeEvents.update();
	    this.spectrumEvents.update();

        this.skybox.update();
    },

	postUpdate: function() {

		this.tileManager.balls.raycast();
	},

    // _______________________________________________________________________________________ Private

    launch: function() {

        this.beatEvents.launch();

	    if( ! LIGHTS.releaseBuild )
            console.log( "Phase: " + LIGHTS.Music.phase.index );
    }
};
/**
 * Created by JetBrains WebStorm.
 * User: C4RL05
 * Date: 22/08/2011
 * Time: 12:37
 * To change this template use File | Settings | File Templates.
 */

LIGHTS.SpectrumEvents = function( director ) {

	this.initialize( director );
};

LIGHTS.SpectrumEvents.prototype = {

	amplitudeTarget:    1 / 4096,

	spectrumData:       [],

    // _______________________________________________________________________________________ Constructor

	initialize: function( director ) {

        this.director = director;

		this.displacement = director.terrain.displacement;
		this.vox = director.vox;

		this.displacement.spectrum = [];
		this.averageSpectrum = [];

		this.createSpectrumData();
    },

	createSpectrumData: function() {

		var image = LIGHTS.images.spectrumData,
			lineLength = 64,
			imageCanvas = document.createElement( 'canvas' ),
			imageContext = imageCanvas.getContext( '2d' ),
			imageData, i, il, j, d, r, g, b, a, line;

		// HACK
		imageCanvas.width = 200; //image.width;
		imageCanvas.height = 200; //image.height;
		imageContext.drawImage( image, 0, 0 );
		imageData = imageContext.getImageData( 0, 0, 200, 200 ).data;
		// imageData = imageContext.getImageData( 0, 0, image.width, image.height ).data;
		
		//document.body.appendChild( imageCanvas )

		d = 0;

		for( i = 0, il = Math.floor( imageData.length / (lineLength * 4)); i < il; i++ ) {

			line = this.spectrumData[ i ] = [];

			for( j = 0; j < lineLength; j++ ) {

				r = imageData[ d++ ];
				g = imageData[ d++ ];
				b = imageData[ d++ ];
				a = imageData[ d++ ];

				line[ j ] = (r << 16) + (g << 8) + b;
			}
		}
	},

    // _______________________________________________________________________________________ Start

    start: function( target, blur ) {

	    this.amplitudeTarget = target;
	    this.blur = blur;
	    this.offset = 0;
	    this.amplitude = 0;

	    var displacementSpectrum = this.displacement.spectrum,
	        i, il;

		for( i = 0, il = this.spectrumData[ 0 ].length; i < il; i++ )
			displacementSpectrum[ i ] = 0;
    },

    // _______________________________________________________________________________________ Update

    update: function() {

	    if( LIGHTS.Music.phase.index < 23 ) {

		    var deltaTime = LIGHTS.deltaTime,
		        easingMore = deltaTime * 20,
		        easingLess = deltaTime * 10,
			    spectrumData = this.spectrumData,
		        averageSpectrum = this.averageSpectrum,
		        displacementSpectrum = this.displacement.spectrum,
		        voxSpectrum = this.vox.spectrum,
			    offset = this.offset,
			    frame = Math.floor( LIGHTS.time * 60 ),
		        spectrum = spectrumData[ frame ],
		        blur = this.blur,
		        averageCount = (blur * 2 + 1),
		        averageMult = this.amplitude / averageCount,
			    average, i, il, j, jl, index, alpha, disp;

		    if( frame > 0 ) {

			    for( i = 0, il = spectrum.length; i < il; i++ ) {

				    average = 0;

				    for( j = i - blur, jl = i + blur; j <= jl; j++ ) {

					    if( j >= 0 )
					        average += spectrum[ j % il ];
					    else
					        average += spectrum[ (j + il) % il ];
				    }

				    averageSpectrum[ i ] = average * averageMult;
			    }

			    for( i = 0, il = spectrum.length; i < il; i++ ) {

					alpha = i + offset * il;
					index = Math.floor( alpha );
				    alpha = alpha - index;

				    average = averageSpectrum[ index % il ] * (1 - alpha) + averageSpectrum[ (index + 1) % il ] * alpha;
				    disp = displacementSpectrum[ i ];

				    if( disp > average )
				        displacementSpectrum[ i ] -= (disp - average) * easingMore;
				    else
				        displacementSpectrum[ i ] -= (disp - average) * easingLess;

				    voxSpectrum[ i ] = displacementSpectrum[ i ];
			    }

			    this.offset = (this.offset + LIGHTS.deltaTime) % 1;
			    this.amplitude -= (this.amplitude - this.amplitudeTarget) * (LIGHTS.deltaTime / 4);
		    }
	    }
    }
};

/**
 * Created by JetBrains WebStorm.
 * User: C4RL05
 * Date: 10/08/2011
 * Time: 18:38
 * To change this template use File | Settings | File Templates.
 */

LIGHTS.VolumeData = {

	vox: [
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 6, 7, 28, 54, 144, 247, 302, 306, 337, 327, 330, 302, 322, 295, 282, 267, 249, 249, 243, 263, 280, 284, 293, 291, 308, 282, 301, 303, 288, 311, 289,
		308, 237, 159, 198, 210, 217, 233, 234, 266, 278, 276, 281, 314, 283, 269, 281, 267, 250, 288, 299, 338, 354, 379, 336, 369, 360, 343, 347, 341, 361, 316, 354, 318,
		313, 323, 312, 331, 311, 322, 286, 304, 298, 295, 286, 255, 283, 280, 291, 315, 280, 260, 255, 220, 253, 257, 285, 269, 261, 216, 178, 162, 149, 129, 114, 122, 467,
		558, 612, 553, 443, 419, 445, 537, 546, 486, 458, 463, 474, 487, 485, 476, 476, 466, 452, 429, 414, 421, 423, 444, 442, 457, 450, 452, 443, 425, 396, 413, 405, 400,
		424, 440, 442, 455, 437, 430, 439, 441, 437, 452, 452, 447, 447, 439, 426, 416, 424, 423, 434, 426, 426, 431, 439, 417, 335, 426, 433, 403, 402, 405, 396, 382, 387,
		385, 386, 396, 404, 391, 351, 335, 296, 310, 330, 343, 347, 332, 317, 324, 304, 297, 307, 337, 361, 364, 366, 360, 368, 337, 312, 243, 188, 138, 65, 34, 34, 41,
		77, 96, 113, 113, 102, 91, 96, 91, 90, 86, 74, 47, 31, 19, 16, 26, 53, 63, 134, 772, 753, 584, 467, 382, 363, 402, 434, 487, 470, 478, 457, 461, 489,
		482, 491, 468, 478, 449, 418, 398, 345, 194, 224, 248, 253, 187, 97, 730, 614, 511, 463, 419, 404, 398, 395, 375, 389, 427, 407, 398, 440, 473, 483, 473, 473, 432,
		418, 409, 413, 442, 426, 395, 388, 401, 398, 376, 362, 491, 512, 508, 475, 494, 483, 493, 452, 408, 375, 359, 370, 366, 303, 291, 283, 399, 523, 465, 420, 402, 389,
		381, 367, 389, 397, 374, 359, 358, 403, 460, 480, 474, 440, 428, 435, 418, 422, 346, 341, 361, 376, 396, 387, 390, 382, 383, 399, 417, 410, 389, 384, 393, 387, 371,
		245, 101, 52, 31, 36, 33, 32, 214, 484, 522, 455, 427, 431, 436, 423, 440, 440, 441, 423, 393, 388, 413, 414, 414, 393, 389, 402, 409, 404, 383, 383, 393, 398,
		382, 388, 381, 380, 382, 390, 404, 403, 395, 392, 389, 384, 372, 382, 369, 375, 370, 376, 393, 323, 430, 417, 401, 390, 391, 358, 366, 368, 359, 392, 385, 383, 381,
		350, 396, 356, 339, 341, 321, 344, 300, 320, 307, 315, 287, 220, 284, 252, 315, 346, 347, 317, 334, 294, 262, 198, 109, 69, 78, 72, 67, 73, 73, 60, 67, 66,
		61, 62, 60, 62, 61, 56, 54, 65, 57, 60, 45, 59, 36, 41, 45, 44, 42, 38, 37, 41, 38, 30, 33, 28, 30, 30, 33, 28, 31, 33, 35, 33, 37,
		44, 46, 48, 48, 47, 54, 56, 59, 68, 71, 77, 73, 76, 62, 59, 69, 62, 48, 15, 14, 18, 187, 45, 110, 265, 249, 277, 303, 334, 368, 380, 340, 356,
		284, 298, 254, 241, 243, 241, 259, 264, 266, 251, 250, 262, 247, 269, 301, 320, 286, 142, 87, 195, 240, 225, 239, 212, 203, 222, 223, 220, 215, 196, 194, 130, 144,
		145, 143, 162, 209, 324, 368, 360, 338, 351, 327, 377, 351, 379, 333, 370, 316, 312, 318, 284, 292, 253, 259, 216, 218, 188, 198, 159, 145, 147, 164, 160, 156, 149,
		116, 121, 133, 132, 146, 132, 134, 123, 107, 100, 119, 129, 134, 139, 209, 457, 547, 531, 559, 509, 449, 405, 444, 558, 530, 479, 485, 456, 457, 463, 462, 455, 451,
		473, 466, 481, 459, 375, 349, 396, 414, 471, 466, 334, 380, 394, 362, 360, 391, 399, 411, 402, 400, 388, 379, 399, 380, 375, 375, 364, 348, 403, 458, 457, 443, 416,
		399, 416, 409, 431, 421, 420, 426, 419, 396, 358, 348, 353, 338, 304, 246, 168, 84, 34, 26, 31, 48, 70, 90, 110, 142, 145, 165, 137, 137, 141, 119, 118, 61,
		18, 18, 17, 20, 162, 239, 508, 563, 486, 451, 409, 294, 101, 78, 74, 94, 143, 149, 154, 220, 332, 548, 545, 361, 308, 322, 199, 35, 24, 24, 21, 34, 157,
		116, 55, 59, 376, 725, 579, 465, 426, 374, 363, 351, 361, 424, 455, 446, 420, 411, 423, 449, 473, 513, 487, 365, 299, 342, 400, 469, 267, 101, 141, 169, 337, 360,
		389, 388, 365, 326, 284, 265, 255, 243, 228, 213, 186, 180, 208, 287, 563, 556, 503, 472, 437, 411, 414, 418, 411, 447, 497, 509, 504, 465, 448, 487, 464, 420, 325,
		370, 386, 438, 488, 444, 345, 223, 134, 63, 76, 224, 305, 461, 463, 424, 393, 388, 374, 349, 334, 330, 320, 327, 325, 327, 321, 312, 316, 331, 315, 302, 307, 299,
		297, 250, 115, 63, 60, 75, 84, 144, 231, 268, 267, 220, 136, 73, 84, 74, 87, 84, 64, 62, 92, 84, 67, 182, 219, 277, 337, 347, 350, 352, 320, 361, 347,
		335, 335, 321, 364, 311, 337, 321, 352, 344, 335, 361, 320, 338, 331, 334, 355, 334, 348, 376, 375, 378, 370, 336, 338, 360, 324, 348, 326, 335, 359, 321, 343, 319,
		327, 355, 335, 382, 389, 368, 392, 367, 362, 372, 340, 373, 375, 362, 389, 368, 376, 392, 368, 370, 375, 351, 371, 399, 380, 359, 384, 382, 359, 367, 414, 412, 430,
		403, 372, 348, 350, 343, 329, 335, 312, 326, 315, 338, 349, 334, 340, 337, 336, 334, 342, 329, 336, 312, 297, 262, 211, 150, 99, 36, 20, 22, 24, 23, 25, 25,
		28, 28, 25, 24, 24, 34, 35, 35, 33, 30, 31, 29, 26, 30, 27, 28, 32, 30, 28, 31, 32, 32, 34, 32, 31, 33, 34, 35, 38, 37, 41, 38, 40,
		40, 39, 41, 42, 39, 43, 34, 42, 34, 30, 23, 13, 6, 7, 10, 57, 98, 13, 8, 7, 6, 7, 11, 25, 370, 511, 595, 565, 543, 521, 502, 490, 456,
		399, 423, 392, 419, 445, 446, 470, 467, 418, 362, 337, 309, 308, 349, 369, 384, 403, 417, 428, 437, 448, 445, 444, 441, 435, 456, 453, 450, 464, 433, 369, 420, 418,
		424, 575, 597, 462, 455, 439, 465, 539, 534, 539, 478, 427, 427, 416, 292, 38, 31, 85, 251, 249, 287, 285, 304, 295, 334, 310, 294, 281, 190, 208, 77, 64, 282,
		784, 638, 557, 511, 498, 499, 545, 516, 507, 498, 490, 503, 478, 493, 484, 494, 458, 460, 434, 341, 31, 33, 45, 47, 53, 47, 58, 91, 73, 97, 793, 623, 507,
		461, 437, 463, 479, 478, 485, 510, 492, 500, 483, 428, 406, 427, 431, 451, 440, 448, 478, 418, 424, 388, 412, 384, 344, 370, 344, 576, 566, 536, 364, 307, 289, 303,
		289, 351, 446, 452, 445, 479, 444, 414, 406, 439, 438, 441, 453, 447, 439, 437, 437, 420, 436, 454, 442, 433, 449, 444, 413, 465, 440, 405, 412, 416, 425, 442, 455,
		428, 397, 388, 375, 381, 401, 383, 406, 458, 467, 443, 423, 389, 381, 448, 473, 519, 518, 482, 480, 460, 457, 490, 505, 497, 462, 443, 414, 427, 431, 395, 411, 412,
		398, 279, 157, 162, 193, 162, 176, 158, 135, 121, 114, 113, 116, 115, 134, 122, 123, 121, 126, 150, 153, 150, 138, 134, 107, 98, 110, 98, 67, 93, 85, 87, 663,
		787, 591, 489, 474, 490, 483, 512, 421, 332, 155, 153, 160, 145, 145, 136, 77, 859, 521, 640, 658, 523, 467, 433, 435, 438, 442, 436, 432, 445, 462, 469, 412, 376,
		341, 358, 359, 336, 257, 207, 82, 81, 85, 84, 85, 131, 140, 168, 219, 372, 468, 458, 409, 376, 406, 444, 421, 406, 411, 337, 227, 231, 238, 217, 236, 270, 242,
		82, 50, 48, 77, 183, 252, 239, 282, 225, 138, 416, 535, 490, 433, 411, 388, 383, 396, 392, 377, 371, 364, 374, 375, 316, 226, 149, 132, 148, 153, 144, 155, 143,
		146, 165, 161, 190, 288, 457, 572, 507, 470, 424, 449, 493, 449, 378, 295, 271, 304, 282, 260, 239, 245, 227, 236, 234, 227, 220, 195, 92, 37, 33, 31, 26, 30,
		29, 31, 145, 207, 127, 63, 179, 301, 318, 334, 331, 331, 327, 325, 321, 336, 338, 321, 321, 271, 163, 90, 68, 30, 23, 20, 21, 21, 22, 22, 26, 64, 292,
		414, 388, 378, 383, 403, 407, 398, 405, 389, 374, 366, 358, 348, 362, 348, 349, 379, 390, 406, 394, 390, 387, 365, 365, 372, 379, 375, 384, 380, 361, 361, 348, 365,
		353, 342, 337, 312, 286, 207, 109, 30, 20, 24, 48, 110, 67, 34, 35, 51, 62, 68, 72, 76, 85, 87, 92, 89, 91, 91, 90, 101, 100, 106, 108, 100, 105,
		106, 94, 75, 40, 15, 12, 18, 151, 57, 308, 678, 621, 569, 552, 549, 425, 345, 444, 453, 364, 226, 177, 191, 302, 694, 560, 577, 459, 427, 498, 643, 674, 572,
		513, 472, 438, 457, 464, 437, 429, 383, 381, 370, 380, 359, 330, 303, 369, 395, 297, 167, 151, 194, 256, 651, 822, 707, 498, 487, 478, 512, 507, 429, 375, 348, 159,
		64, 48, 36, 41, 45, 53, 49, 51, 49, 49, 44, 37, 34, 43, 37, 31, 28, 120, 119, 104, 88, 160, 989, 783, 583, 527, 475, 459, 423, 435, 480, 498, 478,
		479, 471, 473, 421, 392, 322, 70, 43, 53, 46, 43, 33, 47, 86, 89, 267, 919, 621, 518, 461, 463, 453, 464, 472, 476, 471, 466, 439, 407, 432, 441, 429, 437,
		438, 429, 408, 408, 412, 392, 422, 397, 417, 395, 446, 595, 371, 341, 355, 325, 344, 377, 380, 399, 395, 391, 380, 402, 428, 418, 410, 416, 419, 422, 417, 401, 412,
		400, 415, 395, 407, 422, 433, 394, 404, 400, 408, 409, 405, 417, 425, 418, 426, 427, 438, 437, 440, 471, 473, 473, 470, 437, 462, 470, 459, 440, 463, 424, 444, 450,
		460, 461, 446, 408, 395, 397, 400, 452, 448, 431, 425, 358, 342, 357, 404, 437, 435, 433, 438, 339, 156, 48, 53, 48, 40, 33, 52, 60, 81, 84, 80, 70, 75,
		76, 87, 75, 70, 73, 68, 94, 72, 62, 58, 54, 68, 54, 38, 29, 68, 115, 434, 577, 511, 408, 307, 300, 305, 288, 291, 300, 315, 281, 154, 105, 112, 337,
		717, 842, 436, 541, 721, 683, 618, 545, 536, 501, 500, 504, 425, 427, 419, 365, 219, 135, 62, 102, 82, 62, 65, 86, 84, 70, 72, 63, 82, 53, 81, 376, 744,
		617, 564, 383, 360, 375, 379, 403, 406, 408, 454, 449, 422, 391, 345, 336, 291, 199, 339, 469, 462, 494, 425, 395, 377, 383, 376, 413, 429, 443, 403, 364, 345, 365,
		395, 451, 398, 357, 345, 341, 316, 300, 364, 454, 450, 399, 339, 323, 267, 176, 131, 74, 67, 64, 60, 56, 60, 53, 121, 258, 269, 171, 181, 314, 356, 390, 419,
		376, 273, 143, 58, 66, 75, 75, 75, 82, 108, 89, 70, 61, 59, 60, 48, 52, 77, 72, 46, 78, 76, 229, 484, 515, 496, 469, 411, 405, 358, 336, 314, 258,
		209, 162, 232, 312, 302, 342, 337, 344, 346, 278, 242, 104, 211, 240, 275, 283, 308, 309, 359, 427, 397, 392, 375, 373, 387, 367, 396, 372, 359, 347, 332, 329, 341,
		370, 378, 380, 361, 399, 424, 368, 350, 400, 381, 313, 286, 294, 182, 113, 92, 85, 58, 29, 56, 61, 56, 51, 84, 80, 61, 70, 92, 89, 92, 98, 103, 113,
		107, 94, 105, 91, 75, 58, 47, 29, 30, 96, 609, 834, 817, 690, 679, 497, 496, 491, 522, 503, 485, 563, 562, 583, 550, 430, 661, 505, 816, 700, 823, 724, 774,
		696, 855, 832, 778, 841, 522, 350, 288, 644, 659, 724, 672, 731, 799, 618, 539, 411, 504, 544, 671, 895, 872, 868, 703, 603, 789, 673, 626, 664, 716, 648, 713, 732,
		628, 680, 833, 812, 656, 345, 130, 139, 203, 358, 446, 469, 461, 425, 374, 310, 269, 142, 77, 95, 139, 613, 893, 714, 752, 664, 778, 632, 718, 693, 662, 361, 195,
		99, 277, 325, 434, 379, 406, 465, 462, 432, 432, 419, 421, 357, 199, 86, 69, 128, 352, 717, 814, 743, 521, 664, 737, 741, 631, 499, 202, 137, 138, 277, 422, 557,
		666, 684, 850, 872, 713, 681, 746, 658, 881, 609, 523, 402, 215, 91, 103, 139, 209, 243, 203, 162, 135, 90, 90, 86, 81, 73, 98, 330, 412, 708, 680, 748, 787,
		769, 761, 766, 766, 693, 758, 758, 769, 790, 833, 688, 616, 521, 566, 513, 447, 371, 294, 190, 123, 88, 88, 134, 258, 416, 483, 294, 460, 694, 759, 782, 681, 619,
		743, 718, 732, 641, 556, 327, 262, 172, 110, 119, 129, 108, 104, 133, 192, 253, 301, 395, 418, 343, 235, 116, 49, 204, 771, 891, 744, 726, 688, 610, 766, 782, 713,
		762, 818, 702, 573, 505, 689, 773, 723, 719, 673, 714, 767, 691, 707, 745, 707, 712, 778, 768, 702, 599, 605, 758, 773, 749, 845, 813, 721, 667, 698, 729, 677, 514,
		397, 493, 679, 797, 622, 679, 578, 524, 419, 402, 567, 723, 682, 572, 462, 636, 445, 367, 435, 504, 601, 624, 377, 367, 435, 467, 480, 524, 509, 529, 558, 449, 452,
		849, 679, 780, 826, 755, 813, 770, 720, 758, 729, 758, 734, 643, 617, 699, 621, 555, 586, 553, 332, 269, 182, 119, 82, 83, 92, 173, 285, 524, 563, 788, 798, 738,
		681, 657, 682, 560, 620, 538, 501, 266, 150, 74, 76, 89, 149, 231, 271, 298, 314, 278, 202, 189, 155, 123, 59, 51, 47, 106, 660, 1005, 922, 856, 746, 668, 714,
		631, 585, 674, 657, 563, 593, 557, 755, 792, 755, 795, 705, 611, 703, 777, 829, 770, 697, 672, 502, 518, 516, 620, 850, 695, 636, 667, 760, 807, 761, 727, 651, 711,
		816, 788, 735, 586, 863, 752, 699, 675, 713, 789, 724, 773, 763, 710, 766, 843, 839, 898, 744, 724, 703, 750, 816, 778, 710, 668, 643, 618, 598, 736, 781, 815, 784,
		777, 716, 776, 710, 717, 779, 742, 581, 618, 721, 742, 808, 889, 769, 613, 626, 459, 471, 457, 491, 518, 425, 337, 317, 283, 184, 140, 143, 127, 120, 99, 99, 96,
		97, 92, 85, 83, 86, 82, 88, 74, 75, 73, 64, 67, 61, 70, 69, 82, 81, 80, 82, 94, 72, 104, 90, 88, 60, 63, 48, 31, 108, 452, 742, 670, 614,
		493, 397, 364, 368, 398, 373, 397, 408, 390, 410, 362, 452, 696, 854, 700, 712, 687, 790, 685, 619, 762, 702, 720, 621, 758, 734, 776, 866, 718, 752, 717, 673, 591,
		649, 366, 105, 99, 79, 244, 424, 365, 286, 596, 876, 863, 756, 790, 743, 701, 888, 806, 678, 487, 462, 496, 650, 751, 669, 691, 529, 483, 511, 127, 77, 80, 83,
		80, 94, 175, 411, 542, 675, 767, 710, 575, 486, 650, 639, 589, 598, 591, 494, 452, 490, 430, 458, 380, 351, 390, 358, 289, 278, 241, 220, 255, 312, 354, 374, 381,
		352, 322, 486, 814, 747, 732, 590, 605, 671, 692, 613, 456, 351, 152, 150, 110, 97, 307, 891, 835, 738, 785, 707, 742, 837, 834, 547, 504, 317, 113, 92, 134, 182,
		213, 238, 247, 246, 232, 239, 286, 283, 218, 119, 76, 78, 94, 182, 465, 884, 844, 801, 798, 743, 854, 672, 625, 530, 534, 644, 893, 781, 545, 708, 740, 657, 536,
		382, 181, 123, 76, 76, 77, 87, 120, 140, 138, 297, 768, 683, 590, 469, 446, 521, 739, 746, 657, 480, 325, 207, 116, 115, 166, 191, 187, 173, 162, 118, 92, 70,
		172, 337, 419, 419, 375, 374, 326, 463, 825, 766, 864, 852, 754, 723, 733, 701, 695, 772, 739, 669, 878, 845, 793, 692, 624, 554, 750, 857, 904, 817, 729, 825, 858,
		799, 578, 753, 741, 663, 694, 745, 612, 831, 813, 619, 599, 757, 719, 694, 770, 651, 508, 395, 501, 803, 690, 619, 682, 716, 680, 714, 693, 669, 634, 708, 544, 584,
		717, 618, 717, 761, 695, 572, 550, 512, 492, 464, 363, 264, 212, 156, 352, 383, 323, 505, 686, 950, 982, 898, 918, 877, 739, 718, 743, 701, 700, 839, 840, 763, 678,
		586, 521, 532, 656, 778, 481, 352, 265, 132, 158, 200, 491, 607, 512, 791, 891, 615, 566, 630, 613, 711, 744, 647, 773, 664, 795, 712, 437, 333, 162, 84, 115, 182,
		209, 222, 222, 214, 197, 157, 98, 59, 63, 58, 66, 345, 759, 722, 755, 697, 738, 613, 650, 726, 739, 744, 704, 535, 621, 666, 744, 766, 779, 737, 824, 794, 770,
		830, 646, 528, 397, 318, 144, 81, 103, 152, 215, 223, 240, 210, 209, 160, 146, 101, 63, 145, 231, 225, 229, 340, 821, 935, 594, 824, 732, 603, 659, 706, 769, 728,
		745, 636, 526, 739, 817, 541, 486, 686, 868, 904, 867, 851, 831, 850, 857, 753, 730, 795, 723, 671, 725, 775, 607, 676, 562, 687, 803, 810, 790, 705, 460, 393, 309,
		148, 139, 131, 166, 204, 205, 238, 242, 223, 172, 100, 72, 75, 80, 81, 152, 456, 502, 863, 841, 849, 790, 752, 730, 700, 795, 710, 637, 653, 649, 743, 802, 734,
		423, 389, 361, 326, 352, 350, 356, 328, 294, 244, 163, 101, 102, 139, 673, 786, 803, 736, 819, 753, 698, 688, 710, 600, 565, 781, 706, 629, 647, 628, 552, 750, 620,
		469, 400, 334, 104, 63, 65, 71, 94, 114, 240, 434, 456, 878, 641, 826, 886, 853, 883, 871, 827, 702, 620, 662, 660, 690, 872, 804, 750, 752, 705, 778, 902, 810,
		750, 727, 771, 675, 638, 642, 586, 626, 721, 715, 606, 613, 680, 553, 547, 531, 523, 713, 603, 350, 377, 263, 198, 136, 187, 244, 230, 217, 202, 175, 134, 98, 64,
		59, 54, 360, 367, 425, 666, 802, 746, 821, 765, 790, 788, 661, 777, 740, 729, 753, 720, 663, 845, 837, 746, 851, 887, 814, 819, 734, 657, 820, 883, 716, 606, 725,
		689, 619, 674, 698, 744, 701, 659, 584, 591, 623, 665, 698, 662, 578, 462, 406, 287, 157, 159, 177, 169, 169, 170, 157, 111, 94, 109, 94, 74, 75, 315, 412, 648,
		682, 751, 932, 766, 635, 725, 715, 700, 693, 724, 803, 813, 818, 823, 833, 821, 793, 752, 770, 868, 953, 930, 868, 816, 797, 637, 463, 648, 742, 853, 801, 782, 733,
		690, 704, 703, 803, 785, 700, 587, 359, 171, 88, 96, 143, 211, 216, 207, 185, 160, 140, 108, 102, 87, 83, 91, 85, 228, 387, 812, 869, 882, 897, 934, 927, 713,
		884, 790, 742, 792, 842, 724, 506, 192, 82, 65, 102, 132, 128, 127, 131, 115, 127, 91, 91, 92, 110, 164, 359, 819, 769, 716, 666, 700, 702, 726, 659, 741, 712,
		676, 383, 372, 379, 388, 239, 246, 248, 261, 242, 191, 134, 110, 139, 73, 80, 69, 71, 304, 485, 500, 929, 766, 757, 724, 690, 691, 641, 656, 720, 850, 796, 773,
		712, 731, 653, 710, 596, 773, 734, 754, 810, 686, 786, 788, 563, 547, 608, 632, 735, 590, 571, 644, 729, 753, 735, 754, 850, 616, 473, 449, 538, 480, 291, 178, 107,
		186, 206, 206, 222, 220, 204, 154, 99, 66, 68, 64, 51, 379, 459, 546, 647, 567, 751, 821, 817, 808, 719, 728, 689, 596, 501, 502, 657, 522, 568, 630, 664, 773,
		694, 655, 699, 643, 708, 626, 786, 692, 686, 812, 716, 788, 780, 669, 738, 671, 655, 655, 745, 747, 772, 678, 434, 438, 308, 250, 148, 178, 221, 224, 195, 178, 151,
		108, 100, 113, 96, 83, 84, 299, 405, 595, 686, 818, 881, 785, 626, 676, 681, 632, 719, 827, 790, 579, 651, 524, 575, 508, 590, 604, 645, 745, 685, 756, 544, 584,
		708, 578, 718, 718, 726, 720, 752, 684, 657, 671, 723, 764, 666, 466, 401, 435, 318, 171, 162, 170, 199, 218, 230, 208, 233, 218, 182, 151, 122, 89, 81, 213, 435,
		538, 742, 804, 828, 855, 788, 880, 861, 774, 811, 761, 667, 634, 659, 746, 720, 805, 793, 817, 687, 768, 759, 682, 596, 554, 642, 587, 489, 530, 469, 547, 568, 734,
		657, 694, 694, 637, 633, 614, 630, 681, 626, 629, 634, 605, 583, 563, 612, 734, 818, 843, 850, 730, 729, 807, 755, 663, 670, 741, 651, 480, 503, 613, 877, 807, 730,
		796, 848, 782, 739, 696, 765, 864, 873, 851, 841, 833, 716, 679, 815, 797, 706, 791, 662, 776, 708, 715, 663, 583, 638, 564, 533, 190, 116, 142, 235, 379, 454, 435,
		420, 403, 324, 243, 141, 75, 87, 456, 745, 849, 752, 696, 638, 767, 625, 612, 530, 489, 314, 125, 80, 128, 305, 298, 330, 272, 284, 325, 305, 275, 253, 340, 393,
		371, 288, 287, 191, 200, 503, 936, 780, 781, 797, 775, 676, 680, 683, 402, 163, 58, 160, 259, 449, 523, 856, 797, 734, 860, 864, 835, 841, 799, 551, 407, 404, 329,
		188, 98, 122, 179, 196, 197, 183, 158, 123, 115, 92, 76, 94, 75, 95, 323, 436, 622, 810, 854, 757, 700, 742, 676, 705, 623, 659, 719, 726, 677, 705, 657, 581,
		732, 606, 366, 314, 243, 157, 91, 79, 63, 73, 145, 301, 370, 396, 677, 840, 851, 796, 637, 589, 805, 709, 619, 512, 517, 499, 427, 454, 357, 321, 246, 180, 202,
		207, 223, 267, 335, 375, 397, 395, 365, 348, 376, 397, 643, 922, 863, 783, 790, 773, 725, 737, 837, 754, 824, 818, 900, 819, 837, 830, 677, 752, 785, 870, 680, 762,
		826, 765, 801, 846, 715, 886, 700, 813, 768, 858, 840, 805, 790, 731, 797, 756, 657, 803, 822, 710, 584, 539, 668, 742, 702, 637, 522, 638, 630, 707, 714, 647, 712,
		559, 406, 774, 732, 885, 657, 786, 789, 731, 710, 587, 502, 522, 542, 555, 565, 577, 625, 550, 461, 472, 757, 861, 701, 794, 886, 644, 701, 873, 734, 670, 597, 526,
		591, 677, 721, 636, 614, 578, 566, 578, 484, 493, 290, 297, 390, 404, 381, 408, 599, 728, 668, 478, 526, 592, 559, 692, 609, 608, 396, 169, 102, 92, 123, 152, 151,
		183, 204, 209, 197, 191, 173, 145, 109, 99, 71, 56, 57, 223, 535, 928, 917, 693, 795, 818, 759, 784, 706, 640, 697, 769, 549, 549, 689, 714, 818, 709, 759, 828,
		872, 772, 750, 740, 630, 569, 647, 684, 536, 488, 432, 563, 799, 831, 905, 951, 705, 558, 643, 781, 862, 850, 782, 623, 898, 858, 758, 701, 722, 706, 727, 852, 781,
		847, 885, 807, 841, 722, 808, 707, 750, 709, 698, 734, 711, 681, 760, 786, 688, 726, 788, 739, 710, 676, 698, 741, 715, 661, 711, 771, 758, 812, 879, 833, 795, 879,
		879, 843, 786, 782, 836, 840, 809, 750, 746, 757, 727, 694, 625, 596, 696, 789, 828, 767, 696, 724, 751, 788, 786, 688, 791, 766, 607, 773, 802, 729, 682, 732, 771,
		702, 751, 716, 756, 695, 710, 693, 806, 643, 802, 684, 702, 780, 764, 784, 711, 837, 726, 849, 776, 767, 789, 809, 794, 782, 793, 861, 841, 802, 865, 784, 723, 772,
		708, 737, 807, 855, 817, 712, 730, 664, 676, 729, 688, 676, 760, 738, 720, 730, 707, 689, 648, 781, 779, 683, 746, 690, 733, 714, 622, 572, 717, 555, 505, 649, 695,
		700, 665, 553, 538, 637, 625, 542, 462, 531, 580, 509, 566, 549, 559, 558, 588, 517, 394, 345, 404, 279, 243, 278, 189, 295, 263, 287, 245, 184, 220, 140, 179, 171,
		199, 265, 232, 303, 389, 405, 393, 435, 380, 238, 749, 723, 749, 681, 548, 558, 615, 520, 596, 620, 662, 693, 700, 733, 708, 690, 629, 545, 605, 665, 681, 621, 654,
		482, 433, 470, 493, 537, 539, 568, 565, 528, 533, 520, 541, 516, 528, 543, 539, 503, 520, 484, 520, 531, 505, 544, 553, 551, 546, 530, 517, 529, 531, 530, 535, 514,
		511, 511, 518, 525, 537, 514, 498, 480, 462, 456, 456, 483, 475, 393, 457, 497, 467, 455, 448, 411, 376, 314, 244, 303, 329, 338, 206, 54, 29, 71, 153, 214, 265,
		271, 254, 251, 203, 186, 184, 142, 111, 68, 25, 43, 65, 212, 656, 829, 737, 680, 644, 663, 686, 447, 42, 24, 27, 30, 37, 41, 121, 113, 69, 532, 809, 796,
		733, 696, 704, 659, 646, 641, 615, 582, 544, 529, 526, 595, 652, 738, 727, 712, 688, 627, 551, 246, 107, 133, 177, 136, 113, 89, 118, 317, 577, 682, 675, 669, 611,
		568, 562, 578, 550, 528, 527, 508, 501, 530, 558, 555, 522, 406, 162, 190, 182, 186, 196, 179, 158, 132, 131, 154, 187, 334, 699, 768, 584, 618, 631, 634, 619, 562,
		547, 534, 537, 550, 562, 572, 524, 496, 504, 481, 424, 442, 449, 478, 505, 459, 489, 465, 446, 426, 367, 357, 308, 352, 361, 368, 343, 352, 365, 370, 379, 373, 378,
		343, 329, 319, 308, 290, 292, 319, 340, 333, 321, 297, 262, 233, 155, 99, 91, 113, 194, 400, 396, 368, 408, 416, 387, 397, 372, 372, 370, 337, 321, 289, 272, 250,
		257, 267, 292, 307, 331, 337, 308, 318, 339, 376, 408, 394, 302, 269, 291, 306, 336, 358, 407, 412, 448, 447, 428, 420, 446, 417, 399, 431, 401, 381, 381, 420, 455,
		474, 451, 477, 446, 438, 468, 445, 453, 436, 455, 441, 462, 487, 459, 470, 475, 454, 459, 495, 503, 505, 499, 480, 486, 441, 413, 445, 471, 451, 420, 347, 299, 299,
		321, 349, 358, 286, 273, 244, 224, 172, 180, 212, 245, 172, 205, 219, 226, 228, 219, 205, 198, 203, 188, 173, 150, 173, 216, 201, 196, 216, 210, 211, 207, 212, 203,
		177, 169, 174, 260, 309, 317, 344, 331, 324, 319, 333, 341, 346, 318, 294, 288, 245, 241, 213, 182, 177, 171, 153, 132, 115, 118, 105, 103, 98, 95, 88, 100, 113,
		143, 184, 134, 381, 288, 388, 420, 386, 391, 423, 353, 341, 316, 322, 276, 179, 86, 67, 64, 53, 57, 59, 104, 250, 472, 435, 401, 376, 405, 327, 190, 95, 162,
		189, 193, 186, 186, 187, 227, 242, 254, 284, 324, 268, 154, 64, 42, 34, 316, 374, 339, 336, 336, 354, 380, 375, 357, 385, 352, 389, 343, 353, 351, 328, 336, 282,
		285, 260, 270, 274, 287, 267, 228, 178, 189, 203, 229, 224, 235, 248, 216, 177, 167, 236, 331, 276, 290, 288, 270, 287, 288, 194, 27, 29, 211, 347, 637, 539, 663,
		677, 647, 607, 629, 613, 587, 570, 588, 590, 568, 555, 565, 577, 560, 573, 573, 572, 593, 585, 549, 553, 551, 543, 588, 566, 513, 511, 461, 479, 501, 518, 541, 516,
		529, 513, 511, 509, 532, 531, 522, 548, 518, 488, 470, 475, 494, 466, 546, 600, 591, 577, 581, 588, 548, 518, 543, 479, 430, 346, 215, 91, 44, 36, 58, 84, 110,
		128, 127, 144, 145, 151, 146, 160, 156, 159, 150, 178, 173, 114, 55, 37, 54, 71, 84, 714, 717, 583, 498, 452, 441, 467, 500, 518, 476, 397, 298, 358, 65, 48,
		48, 83, 115, 145, 177, 166, 112, 56, 29, 49, 112, 152, 205, 514, 804, 804, 755, 706, 660, 654, 648, 587, 576, 572, 565, 561, 548, 551, 536, 535, 553, 537, 539,
		503, 71, 64, 61, 46, 41, 43, 64, 39, 96, 102, 705, 838, 648, 561, 553, 536, 542, 529, 535, 533, 505, 467, 451, 487, 567, 544, 536, 526, 528, 542, 590, 608,
		520, 179, 231, 239, 252, 233, 250, 223, 120, 55, 100, 543, 837, 659, 638, 574, 513, 506, 517, 491, 469, 489, 469, 397, 363, 392, 439, 489, 481, 468, 475, 472, 470,
		474, 407, 141, 54, 62, 52, 49, 293, 683, 586, 522, 473, 462, 509, 543, 546, 554, 557, 541, 570, 614, 635, 617, 622, 583, 494, 358, 169, 35, 48, 40, 35, 43,
		50, 43, 46, 64, 433, 629, 611, 573, 550, 549, 537, 529, 518, 514, 526, 514, 506, 480, 521, 631, 591, 593, 585, 583, 584, 568, 568, 573, 579, 573, 567, 581, 547,
		586, 564, 573, 557, 515, 533, 532, 514, 509, 487, 467, 495, 474, 439, 465, 499, 517, 519, 551, 557, 542, 544, 508, 519, 548, 551, 573, 550, 550, 498, 415, 242, 78,
		74, 108, 116, 116, 103, 88, 86, 70, 51, 51, 45, 42, 31, 26, 23, 25, 28, 36, 27, 21, 22, 26, 23, 15, 14, 16, 16, 18, 19, 18, 19, 14, 9,
		11, 13, 17, 18, 11, 9, 10, 12, 12, 12, 12, 13, 10, 12, 13, 14, 14, 15, 17, 18, 20, 25, 31, 31, 36, 43, 56, 55, 51, 60, 63, 70, 63,
		77, 85, 98, 96, 117, 120, 132, 136, 146, 146, 120, 97, 87, 72, 60, 23, 11, 20, 8, 7, 174, 518, 652, 653, 620, 583, 568, 457, 385, 418, 438, 472, 470,
		473, 473, 478, 523, 541, 540, 530, 561, 570, 615, 600, 464, 210, 169, 417, 658, 280, 85, 149, 499, 682, 711, 645, 558, 527, 545, 598, 568, 512, 494, 470, 468, 461,
		504, 569, 557, 514, 303, 171, 111, 109, 105, 111, 89, 84, 91, 169, 140, 310, 761, 627, 566, 570, 564, 552, 521, 542, 531, 521, 532, 613, 497, 276, 111, 69, 57,
		66, 112, 104, 113, 87, 75, 58, 50, 44, 38, 87, 336, 470, 866, 615, 611, 667, 584, 579, 568, 562, 569, 556, 554, 565, 575, 559, 542, 454, 435, 269, 112, 61,
		45, 41, 53, 49, 41, 39, 114, 286, 315, 327, 860, 736, 637, 567, 507, 525, 507, 527, 520, 517, 564, 555, 537, 567, 550, 585, 585, 582, 531, 547, 534, 578, 584,
		502, 259, 120, 91, 111, 431, 861, 625, 538, 541, 571, 608, 599, 582, 575, 581, 581, 584, 579, 595, 591, 596, 603, 600, 597, 587, 580, 596, 599, 592, 594, 590, 581,
		580, 576, 564, 565, 589, 606, 612, 640, 616, 577, 548, 557, 607, 631, 610, 569, 544, 541, 556, 496, 614, 594, 619, 631, 620, 620, 609, 563, 531, 546, 517, 484, 448,
		263, 170, 148, 151, 160, 170, 215, 409, 322, 142, 138, 153, 155, 177, 205, 161, 158, 154, 158, 147, 151, 149, 150, 123, 87, 72, 74, 73, 151, 328, 604, 727, 683,
		687, 594, 598, 581, 586, 581, 561, 548, 529, 515, 498, 478, 447, 468, 460, 484, 598, 615, 602, 358, 244, 250, 151, 62, 52, 51, 188, 716, 624, 623, 590, 598, 588,
		581, 607, 601, 610, 613, 582, 588, 599, 563, 582, 580, 584, 545, 559, 558, 527, 549, 279, 107, 86, 100, 105, 103, 63, 50, 202, 667, 617, 573, 586, 584, 591, 531,
		503, 532, 520, 473, 248, 104, 45, 52, 75, 90, 106, 125, 138, 201, 117, 69, 42, 42, 38, 34, 94, 624, 599, 540, 533, 506, 465, 500, 583, 632, 637, 598, 505,
		399, 380, 329, 334, 331, 322, 309, 286, 261, 254, 263, 265, 302, 314, 317, 325, 325, 336, 351, 442, 392, 348, 338, 332, 337, 355, 355, 346, 351, 350, 360, 407, 473,
		524, 406, 232, 236, 289, 324, 293, 301, 303, 283, 286, 292, 295, 293, 264, 225, 332, 670, 692, 659, 659, 503, 480, 473, 469, 491, 466, 414, 223, 218, 308, 288, 297,
		303, 281, 280, 286, 286, 270, 256, 111, 37, 31, 94, 146, 397, 600, 477, 425, 394, 383, 368, 384, 396, 410, 407, 381, 277, 170, 167, 250, 294, 292, 313, 302, 301,
		302, 317, 297, 278, 216, 159, 135, 220, 352, 480, 450, 458, 542, 568, 529, 512, 489, 460, 426, 398, 424, 437, 439, 537, 678, 670, 654, 593, 571, 582, 548, 482, 492,
		475, 438, 423, 249, 140, 58, 38, 41, 116, 103, 45, 48, 71, 91, 131, 128, 163, 177, 177, 184, 198, 183, 193, 181, 186, 169, 158, 129, 154, 175, 78, 28, 68,
		38, 84, 93, 265, 696, 640, 806, 739, 645, 629, 570, 579, 580, 635, 602, 587, 618, 554, 562, 613, 518, 501, 521, 457, 493, 521, 484, 485, 544, 456, 497, 416, 599,
		592, 541, 599, 594, 590, 585, 567, 587, 518, 594, 371, 400, 236, 58, 56, 115, 165, 221, 269, 251, 267, 248, 209, 250, 202, 52, 92, 172, 220, 132, 831, 850, 738,
		636, 589, 608, 609, 628, 635, 608, 610, 597, 588, 606, 604, 600, 515, 558, 578, 464, 467, 485, 541, 617, 549, 374, 430, 584, 554, 558, 555, 579, 567, 612, 577, 619,
		621, 572, 561, 587, 580, 572, 578, 567, 578, 585, 569, 575, 559, 562, 563, 526, 441, 147, 66, 40, 55, 79, 180, 309, 999, 723, 553, 623, 649, 630, 664, 632, 593,
		607, 619, 643, 610, 602, 599, 584, 627, 611, 612, 622, 627, 611, 610, 608, 584, 578, 598, 628, 606, 541, 604, 667, 592, 507, 518, 487, 544, 556, 554, 558, 560, 553,
		535, 507, 531, 538, 471, 435, 497, 478, 465, 499, 471, 511, 508, 502, 560, 498, 507, 497, 369, 411, 337, 277, 307, 411, 393, 366, 374, 387, 415, 394, 365, 373, 369,
		239, 164, 153, 158, 139, 131, 131, 150, 170, 158, 174, 161, 177, 198, 194, 178, 168, 183, 192, 180, 160, 153, 161, 149, 147, 139, 141, 154, 375, 847, 811, 729, 627,
		648, 630, 629, 611, 585, 477, 400, 390, 308, 537, 560, 557, 633, 622, 627, 644, 643, 609, 600, 605, 593, 578, 574, 585, 563, 547, 524, 517, 507, 516, 493, 527, 405,
		209, 239, 322, 320, 325, 368, 266, 469, 592, 574, 542, 543, 534, 525, 477, 518, 489, 490, 489, 502, 475, 425, 460, 358, 132, 81, 80, 91, 81, 75, 197, 336, 317,
		207, 247, 437, 479, 320, 434, 496, 581, 541, 590, 614, 653, 599, 547, 502, 466, 480, 451, 366, 375, 348, 320, 366, 406, 405, 424, 397, 321, 296, 308, 314, 307, 302,
		315, 332, 387, 417, 381, 365, 337, 320, 311, 311, 336, 335, 357, 350, 323, 198, 138, 147, 152, 150, 145, 163, 156, 126, 108, 92, 78, 71, 67, 75, 108, 156, 209,
		294, 494, 576, 510, 544, 494, 437, 456, 502, 557, 638, 528, 439, 363, 308, 266, 219, 256, 267, 295, 313, 319, 300, 293, 300, 261, 280, 298, 275, 213, 452, 644, 489,
		426, 442, 415, 441, 472, 480, 527, 502, 471, 423, 443, 442, 474, 457, 478, 494, 474, 486, 559, 552, 429, 415, 397, 378, 356, 356, 377, 405, 420, 424, 424, 382, 318,
		268, 224, 213, 242, 257, 262, 251, 238, 233, 279, 288, 284, 284, 246, 239, 192, 141, 253, 221, 249, 222, 243, 598, 820, 640, 461, 395, 551, 683, 467, 537, 503, 515,
		542, 535, 582, 538, 443, 761, 586, 761, 820, 770, 704, 744, 680, 833, 818, 688, 754, 480, 346, 335, 554, 699, 738, 768, 720, 623, 606, 605, 704, 781, 813, 787, 740,
		820, 852, 843, 692, 768, 605, 677, 723, 620, 813, 715, 653, 542, 653, 719, 742, 775, 340, 149, 166, 232, 362, 457, 471, 445, 434, 378, 332, 282, 156, 97, 95, 169,
		751, 954, 831, 736, 743, 656, 654, 680, 784, 597, 428, 195, 125, 282, 325, 422, 363, 433, 443, 475, 421, 418, 452, 432, 371, 220, 105, 91, 135, 375, 884, 786, 830,
		767, 761, 698, 717, 541, 488, 246, 153, 164, 277, 427, 585, 924, 647, 669, 582, 671, 651, 675, 693, 595, 481, 561, 423, 222, 89, 99, 150, 194, 230, 205, 175, 136,
		103, 86, 73, 75, 73, 88, 320, 426, 727, 694, 809, 754, 804, 835, 737, 750, 766, 718, 670, 742, 813, 750, 611, 700, 724, 606, 454, 425, 368, 292, 186, 112, 85,
		85, 136, 274, 412, 442, 303, 406, 677, 835, 802, 575, 604, 654, 854, 816, 714, 576, 354, 268, 171, 111, 120, 126, 104, 102, 134, 188, 250, 316, 406, 432, 355, 243,
		122, 58, 210, 766, 830, 799, 746, 815, 710, 744, 756, 706, 685, 767, 727, 709, 654, 632, 815, 770, 758, 711, 717, 788, 637, 693, 768, 778, 792, 730, 716, 780, 758,
		752, 846, 804, 767, 671, 679, 626, 606, 597, 702, 616, 573, 494, 503, 639, 770, 661, 517, 550, 491, 558, 559, 521, 639, 626, 647, 623, 677, 671, 799, 765, 663, 579,
		526, 334, 339, 439, 475, 451, 507, 511, 500, 512, 447, 428, 863, 793, 782, 716, 794, 769, 759, 694, 737, 728, 726, 677, 572, 460, 604, 671, 602, 487, 476, 374, 272,
		192, 121, 77, 76, 100, 169, 286, 484, 595, 859, 912, 702, 634, 624, 800, 637, 543, 448, 477, 272, 155, 94, 81, 99, 148, 222, 267, 287, 306, 266, 211, 202, 165,
		119, 68, 51, 48, 104, 643, 1020, 855, 886, 703, 677, 695, 606, 598, 712, 733, 528, 508, 630, 677, 861, 756, 728, 745, 775, 823, 864, 709, 662, 732, 806, 661, 571,
		567, 516, 689, 670, 668, 548, 614, 752, 599, 509, 476, 563, 697, 767, 820, 892, 812, 556, 731, 648, 748, 836, 670, 788, 681, 756, 701, 761, 764, 864, 774, 713, 706,
		759, 779, 791, 751, 644, 559, 523, 543, 703, 873, 809, 740, 732, 741, 778, 767, 721, 792, 782, 732, 686, 666, 591, 758, 806, 769, 667, 697, 469, 446, 467, 491, 523,
		419, 339, 322, 270, 183, 141, 143, 121, 98, 103, 101, 95, 87, 83, 80, 79, 84, 83, 85, 72, 69, 67, 64, 64, 60, 70, 68, 74, 77, 77, 80, 100, 129,
		158, 129, 120, 111, 75, 43, 29, 52, 476, 682, 568, 688, 688, 516, 368, 370, 386, 385, 385, 396, 374, 383, 361, 297, 603, 899, 710, 712, 674, 738, 766, 697, 821,
		751, 613, 591, 739, 789, 679, 729, 703, 736, 727, 713, 707, 661, 318, 112, 95, 91, 247, 408, 369, 289, 554, 882, 776, 747, 780, 812, 541, 648, 798, 779, 743, 789,
		842, 835, 862, 798, 654, 564, 439, 478, 146, 73, 81, 94, 91, 93, 181, 413, 545, 677, 783, 687, 712, 659, 640, 599, 552, 576, 579, 558, 452, 510, 456, 440, 374,
		359, 389, 358, 291, 280, 243, 220, 260, 316, 343, 385, 370, 353, 330, 484, 800, 682, 754, 746, 656, 631, 625, 532, 568, 339, 150, 146, 115, 100, 299, 867, 867, 751,
		761, 675, 772, 762, 767, 726, 568, 296, 119, 91, 138, 176, 201, 245, 243, 250, 233, 234, 296, 277, 220, 119, 66, 68, 98, 171, 505, 929, 812, 708, 745, 761, 710,
		690, 843, 763, 544, 602, 800, 743, 674, 551, 571, 598, 458, 407, 171, 116, 79, 69, 76, 83, 116, 143, 136, 288, 736, 660, 679, 694, 627, 437, 663, 794, 708, 466,
		319, 209, 115, 114, 162, 183, 197, 184, 161, 115, 80, 66, 167, 351, 419, 414, 368, 379, 320, 439, 825, 812, 850, 838, 805, 744, 726, 774, 717, 701, 746, 733, 714,
		753, 763, 744, 685, 673, 671, 736, 791, 670, 613, 752, 744, 801, 741, 669, 680, 808, 805, 671, 707, 721, 679, 605, 634, 749, 701, 568, 704, 593, 472, 424, 497, 821,
		813, 686, 594, 722, 678, 678, 738, 632, 636, 755, 603, 536, 764, 703, 768, 847, 786, 637, 519, 522, 489, 461, 363, 261, 208, 160, 360, 382, 308, 507, 672, 826, 794,
		797, 875, 945, 836, 786, 871, 865, 802, 884, 926, 908, 838, 797, 661, 620, 565, 687, 462, 374, 273, 148, 172, 209, 498, 603, 540, 951, 948, 682, 618, 774, 735, 656,
		796, 693, 671, 699, 886, 706, 439, 331, 170, 96, 115, 173, 210, 226, 233, 220, 207, 153, 100, 59, 62, 55, 70, 389, 608, 850, 683, 653, 781, 795, 778, 825, 607,
		587, 722, 564, 601, 549, 780, 675, 712, 793, 819, 869, 828, 799, 505, 484, 396, 320, 147, 89, 113, 147, 217, 229, 238, 224, 209, 167, 151, 109, 71, 151, 232, 226,
		233, 345, 888, 875, 793, 716, 716, 684, 735, 643, 787, 805, 877, 789, 638, 689, 808, 630, 674, 779, 846, 802, 733, 662, 631, 701, 748, 692, 644, 815, 714, 660, 785,
		695, 708, 585, 654, 779, 742, 744, 716, 654, 457, 398, 315, 180, 173, 183, 202, 236, 233, 242, 246, 219, 169, 96, 70, 65, 70, 148, 307, 531, 567, 839, 896, 847,
		800, 830, 868, 823, 826, 795, 681, 673, 703, 708, 814, 818, 440, 400, 388, 356, 372, 352, 352, 334, 301, 246, 157, 103, 106, 219, 732, 794, 823, 759, 772, 707, 696,
		653, 745, 722, 579, 739, 726, 666, 644, 679, 550, 700, 638, 546, 440, 355, 157, 148, 85, 80, 91, 133, 324, 497, 506, 909, 698, 819, 846, 764, 817, 802, 925, 836,
		782, 795, 758, 715, 796, 841, 799, 790, 742, 757, 855, 810, 842, 793, 771, 607, 654, 746, 706, 746, 782, 751, 582, 655, 661, 658, 588, 545, 516, 699, 676, 440, 470,
		340, 270, 216, 223, 244, 233, 225, 208, 200, 152, 117, 84, 57, 62, 356, 369, 457, 630, 815, 821, 760, 774, 724, 825, 690, 662, 682, 693, 704, 730, 673, 679, 767,
		732, 723, 801, 768, 848, 864, 734, 744, 744, 575, 664, 669, 751, 625, 780, 770, 746, 711, 663, 663, 672, 646, 600, 672, 672, 601, 526, 445, 326, 194, 187, 202, 170,
		176, 185, 182, 150, 137, 136, 94, 77, 70, 328, 448, 634, 650, 705, 842, 793, 755, 710, 703, 719, 750, 799, 809, 731, 720, 728, 764, 761, 706, 693, 691, 697, 811,
		829, 763, 691, 791, 563, 500, 589, 806, 813, 830, 782, 734, 760, 746, 756, 831, 804, 684, 571, 350, 269, 199, 156, 158, 225, 265, 216, 196, 184, 156, 132, 116, 93,
		88, 114, 213, 419, 546, 904, 875, 957, 938, 960, 938, 714, 879, 798, 758, 828, 819, 716, 514, 259, 188, 131, 123, 159, 149, 146, 151, 141, 149, 121, 105, 101, 118,
		191, 449, 868, 763, 711, 686, 756, 777, 690, 721, 785, 776, 651, 451, 411, 522, 517, 357, 330, 315, 311, 316, 249, 221, 214, 201, 111, 90, 75, 77, 351, 506, 568,
		925, 779, 717, 771, 778, 828, 715, 769, 753, 782, 718, 706, 721, 792, 703, 796, 709, 675, 638, 708, 788, 785, 724, 709, 520, 570, 662, 664, 735, 708, 664, 659, 729,
		754, 744, 748, 838, 657, 541, 533, 576, 468, 284, 180, 115, 188, 214, 221, 240, 241, 221, 189, 144, 96, 77, 65, 60, 399, 480, 545, 661, 589, 812, 880, 833, 801,
		807, 795, 712, 670, 583, 640, 646, 567, 565, 717, 720, 823, 766, 733, 801, 705, 773, 671, 789, 723, 717, 807, 704, 801, 791, 666, 742, 700, 659, 677, 755, 750, 711,
		704, 475, 442, 325, 253, 147, 177, 226, 237, 214, 197, 178, 141, 114, 123, 106, 87, 88, 342, 443, 644, 751, 787, 858, 778, 728, 645, 673, 708, 778, 875, 708, 562,
		479, 584, 622, 542, 556, 613, 670, 673, 668, 672, 567, 522, 644, 690, 771, 735, 696, 733, 772, 667, 599, 695, 788, 703, 562, 454, 504, 450, 444, 312, 207, 209, 226,
		259, 250, 245, 271, 239, 197, 171, 141, 105, 85, 193, 446, 579, 734, 818, 868, 840, 850, 900, 816, 787, 838, 768, 723, 729, 728, 755, 770, 809, 794, 824, 722, 769,
		764, 716, 608, 598, 656, 594, 518, 555, 483, 550, 639, 625, 639, 744, 690, 639, 630, 614, 639, 674, 647, 624, 628, 615, 579, 564, 693, 805, 845, 864, 842, 742, 663,
		729, 765, 664, 700, 693, 608, 504, 502, 589, 734, 703, 723, 789, 804, 672, 735, 667, 741, 881, 962, 929, 839, 789, 626, 678, 789, 831, 687, 779, 688, 777, 736, 741,
		683, 722, 826, 657, 509, 165, 88, 134, 238, 376, 449, 426, 437, 404, 320, 240, 142, 84, 99, 466, 745, 837, 770, 711, 543, 745, 705, 636, 524, 496, 317, 125, 83,
		133, 304, 296, 336, 273, 289, 325, 305, 275, 258, 340, 393, 381, 280, 299, 190, 195, 395, 875, 911, 852, 749, 819, 665, 622, 656, 425, 157, 66, 158, 260, 453, 522,
		848, 873, 815, 868, 961, 975, 866, 705, 526, 428, 408, 332, 193, 122, 149, 191, 209, 215, 198, 165, 138, 127, 105, 84, 86, 67, 90, 328, 435, 821, 744, 771, 807,
		761, 796, 722, 789, 687, 698, 751, 717, 652, 646, 610, 652, 701, 624, 376, 311, 240, 154, 94, 84, 72, 76, 136, 295, 370, 401, 603, 826, 684, 654, 569, 568, 695,
		685, 521, 514, 518, 501, 423, 479, 369, 323, 241, 175, 204, 204, 218, 260, 319, 361, 398, 402, 353, 349, 376, 397, 665, 947, 847, 847, 754, 731, 729, 723, 835, 750,
		783, 802, 874, 840, 826, 794, 728, 799, 753, 839, 783, 822, 812, 697, 740, 818, 686, 838, 710, 845, 823, 850, 796, 754, 817, 668, 777, 785, 758, 735, 841, 709, 602,
		535, 631, 722, 762, 732, 608, 617, 593, 649, 753, 775, 850, 761, 660, 697, 682, 700, 520, 679, 732, 763, 684, 470, 520, 512, 542, 551, 561, 582, 612, 530, 491, 470,
		760, 829, 773, 778, 812, 759, 799, 709, 686, 823, 756, 653, 644, 735, 857, 750, 666, 606, 641, 709, 556, 438, 301, 284, 367, 405, 402, 454, 522, 850, 749, 644, 600,
		581, 657, 583, 486, 384, 368, 190, 113, 103, 127, 155, 155, 179, 202, 216, 200, 195, 181, 151, 111, 102, 77, 48, 57, 170, 555, 778, 776, 739, 914, 871, 797, 755,
		688, 592, 665, 808, 610, 642, 730, 735, 615, 705, 741, 767, 795, 738, 709, 621, 598, 689, 680, 637, 583, 671, 635, 664, 915, 911, 869, 766, 722, 818, 909, 900, 880,
		860, 977, 883, 712, 904, 616, 677, 665, 659, 662, 503, 774, 577, 635, 678, 706, 713, 739, 774, 803, 821, 746, 677, 714, 788, 727, 644, 674, 705, 655, 662, 739, 776,
		773, 738, 667, 699, 764, 662, 614, 692, 730, 687, 674, 693, 666, 582, 594, 666, 735, 754, 707, 707, 753, 755, 793, 876, 852, 778, 699, 697, 740, 714, 712, 714, 747,
		784, 764, 710, 854, 835, 796, 796, 743, 842, 756, 810, 794, 780, 793, 780, 834, 857, 768, 780, 779, 798, 701, 764, 782, 743, 600, 713, 836, 817, 782, 728, 780, 749,
		737, 686, 759, 720, 724, 698, 788, 739, 705, 727, 747, 762, 765, 705, 700, 716, 784, 874, 868, 841, 849, 784, 826, 836, 782, 784, 781, 796, 798, 798, 804, 819, 639,
		785, 764, 740, 651, 700, 628, 523, 529, 543, 716, 695, 643, 679, 648, 641, 611, 565, 560, 498, 528, 559, 484, 467, 463, 470, 467, 439, 390, 331, 298, 295, 232, 172,
		148, 141, 95, 69, 69, 61, 62, 63, 61, 57, 52, 47, 57, 48, 39, 48, 39, 40, 39, 42, 45, 39, 34, 41, 41, 35, 29, 27, 27, 24, 24, 20, 18,
		24, 23, 258, 647, 593, 555, 612, 522, 515, 517, 408, 367, 328, 292, 248, 97, 58, 56, 58, 78, 90, 92, 85, 98, 96, 94, 88, 80, 66, 43, 49, 47, 37,
		45, 40, 39, 37, 32, 31, 36, 31, 24, 30, 26, 25, 24, 23, 26, 27, 25, 34, 34, 30, 20, 20, 19, 16, 14, 13, 12, 14, 13, 258, 648, 594, 556,
		613, 522, 514, 516, 409, 366, 326, 293, 250, 96, 57, 56, 59, 78, 90, 92, 84, 97, 95, 94, 87, 80, 66, 43, 49, 46, 36, 45, 40, 39, 37, 32, 30,
		36, 31, 23, 30, 26, 25, 24, 119, 310, 452, 348, 292, 32, 102, 255, 451, 321, 17, 185, 453, 365, 256, 47, 246, 804, 634, 678, 663, 478, 561, 617, 457, 408,
		331, 269, 285, 146, 106, 166, 314, 496, 363, 358, 374, 371, 399, 393, 275, 289, 344, 302, 208, 62, 152, 443, 331, 286, 384, 188, 177, 218, 298, 445, 380, 386, 331,
		344, 330, 291, 249, 321, 237, 230, 242, 202, 242, 265, 156, 140, 162, 166, 113, 70, 258, 572, 514, 479, 554, 529, 519, 542, 425, 422, 361, 332, 324, 196, 162, 163,
		131, 161, 138, 116, 127, 134, 130, 139, 118, 101, 77, 75, 73, 47, 61, 97, 77, 79, 83, 58, 43, 49, 66, 108, 86, 84, 82, 77, 80, 61, 57, 63, 61,
		60, 56, 41, 53, 53, 30, 29, 28, 27, 22, 15, 256, 631, 579, 541, 603, 526, 516, 522, 410, 374, 330, 290, 249, 97, 55, 62, 59, 82, 89, 89, 83, 99,
		93, 95, 91, 81, 64, 43, 49, 46, 38, 45, 40, 40, 35, 34, 29, 36, 34, 30, 34, 25, 26, 24, 29, 27, 29, 26, 35, 36, 32, 20, 22, 21, 16,
		15, 12, 12, 14, 13, 258, 645, 591, 553, 611, 524, 514, 517, 410, 368, 327, 290, 250, 96, 63, 58, 60, 83, 90, 92, 85, 98, 96, 95, 88, 81, 66, 43,
		52, 48, 38, 371, 490, 383, 331, 352, 441, 324, 263, 366, 380, 294, 254, 357, 324, 265, 237, 326, 244, 223, 261, 286, 195, 184, 230, 166, 80, 56, 73, 64, 237,
		739, 692, 513, 567, 629, 594, 589, 491, 582, 573, 432, 454, 311, 378, 339, 408, 402, 381, 417, 433, 463, 360, 410, 268, 200, 174, 172, 196, 206, 236, 304, 343, 317,
		334, 395, 236, 284, 197, 166, 407, 504, 605, 692, 615, 503, 742, 739, 621, 516, 478, 491, 486, 578, 487, 496, 533, 594, 579, 592, 607, 794, 744, 670, 702, 683, 692,
		645, 628, 559, 607, 566, 544, 507, 531, 552, 563, 503, 368, 407, 479, 538, 589, 588, 499, 456, 391, 558, 527, 546, 573, 554, 557, 516, 537, 544, 556, 565, 549, 506,
		486, 413, 380, 335, 269, 286, 331, 364, 309, 277, 341, 392, 458, 468, 437, 431, 389, 467, 439, 435, 525, 705, 675, 651, 683, 642, 622, 605, 539, 510, 504, 482, 404,
		423, 387, 381, 420, 436, 439, 425, 411, 418, 398, 406, 323, 289, 198, 201, 182, 200, 241, 264, 301, 314, 336, 343, 340, 324, 273, 209, 172, 152, 176, 287, 423, 362,
		276, 894, 927, 620, 513, 464, 419, 465, 506, 508, 533, 577, 530, 547, 578, 748, 671, 654, 731, 660, 649, 680, 642, 656, 572, 583, 539, 437, 459, 537, 524, 495, 434,
		553, 588, 555, 517, 527, 563, 533, 375, 510, 495, 529, 524, 515, 529, 547, 524, 510, 535, 537, 533, 484, 377, 425, 334, 316, 360, 481, 502, 446, 258, 329, 494, 533,
		470, 380, 435, 529, 456, 531, 376, 445, 646, 742, 656, 761, 610, 543, 639, 646, 590, 629, 592, 494, 438, 425, 422, 506, 539, 560, 533, 527, 526, 576, 444, 474, 488,
		493, 458, 433, 410, 422, 421, 480, 608, 541, 511, 421, 421, 422, 486, 576, 511, 553, 527, 484, 480, 419, 426, 491, 406, 473, 461, 433, 423, 432, 414, 424, 413, 402,
		375, 374, 516, 707, 731, 671, 681, 563, 588, 590, 494, 470, 431, 438, 392, 314, 287, 261, 237, 250, 212, 202, 224, 187, 198, 194, 187, 200, 167, 173, 160, 173, 170,
		178, 194, 195, 207, 179, 175, 151, 158, 160, 151, 146, 133, 128, 108, 101, 101, 104, 87, 97, 99, 79, 78, 80, 80, 79, 68, 76, 63, 76, 246, 717, 629, 575,
		666, 538, 582, 573, 442, 436, 427, 381, 344, 279, 288, 271, 240, 255, 248, 253, 223, 236, 232, 212, 201, 225, 183, 154, 174, 165, 158, 275, 241, 190, 188, 161, 183,
		176, 168, 161, 173, 159, 148, 142, 157, 156, 131, 141, 143, 140, 108, 129, 112, 112, 101, 118, 99, 83, 82, 91, 82, 119, 103, 83, 81, 61, 81, 75, 73, 64,
		80, 73, 62, 57, 70, 67, 54, 60, 60, 60, 47, 55, 51, 49, 39, 53, 43, 37, 35, 39, 36, 50, 43, 36, 36, 27, 35, 33, 31, 28, 33, 30, 27,
		24, 30, 29, 24, 25, 26, 25, 20, 23, 22, 21, 17, 22, 18, 16, 14, 17, 15, 20, 17, 15, 15, 11, 14, 14, 13, 11, 14, 12, 12, 90, 566, 638,
		930, 910, 774, 584, 388, 468, 476, 502, 515, 574, 571, 555, 546, 463, 526, 482, 761, 815, 728, 758, 733, 724, 506, 677, 694, 669, 499, 358, 313, 649, 756, 852, 872,
		788, 689, 693, 480, 572, 748, 883, 933, 874, 755, 692, 724, 712, 790, 707, 647, 698, 624, 559, 626, 682, 575, 662, 758, 749, 775, 333, 144, 132, 205, 355, 452, 478,
		461, 434, 378, 324, 271, 139, 76, 84, 139, 758, 916, 733, 628, 675, 736, 678, 647, 698, 639, 480, 204, 115, 287, 324, 415, 368, 419, 462, 426, 416, 419, 417, 415,
		367, 200, 87, 60, 129, 467, 892, 765, 816, 742, 770, 675, 666, 631, 465, 259, 138, 148, 265, 420, 623, 883, 567, 703, 589, 644, 734, 786, 762, 654, 494, 561, 413,
		222, 74, 90, 145, 206, 210, 208, 164, 135, 90, 82, 71, 82, 71, 90, 338, 425, 715, 685, 797, 756, 820, 720, 743, 789, 696, 599, 662, 766, 908, 904, 731, 785,
		694, 603, 450, 410, 359, 286, 185, 107, 70, 76, 132, 277, 407, 455, 301, 601, 837, 721, 582, 633, 671, 565, 700, 754, 786, 558, 366, 272, 171, 113, 124, 125, 105,
		104, 137, 185, 251, 322, 396, 426, 366, 242, 118, 60, 201, 758, 958, 743, 785, 861, 773, 778, 747, 791, 770, 846, 849, 822, 734, 758, 775, 752, 735, 712, 719, 754,
		639, 821, 815, 666, 616, 714, 641, 698, 743, 820, 808, 618, 584, 656, 741, 758, 758, 718, 671, 663, 595, 515, 497, 622, 769, 683, 679, 613, 633, 548, 643, 624, 580,
		669, 628, 743, 691, 824, 797, 752, 756, 631, 534, 478, 339, 430, 455, 482, 497, 492, 517, 520, 474, 423, 858, 777, 763, 724, 830, 668, 715, 571, 753, 768, 665, 726,
		773, 753, 781, 729, 727, 708, 595, 426, 254, 179, 119, 73, 82, 106, 165, 316, 486, 601, 928, 799, 539, 585, 543, 742, 779, 714, 591, 463, 292, 141, 85, 83, 97,
		144, 217, 265, 289, 300, 277, 219, 192, 171, 111, 74, 69, 52, 100, 640, 1040, 908, 870, 661, 741, 637, 620, 706, 705, 666, 640, 688, 558, 764, 681, 804, 788, 820,
		760, 734, 796, 796, 695, 654, 667, 621, 526, 600, 487, 701, 540, 641, 774, 631, 609, 801, 763, 750, 733, 753, 686, 768, 817, 816, 532, 715, 729, 667, 730, 874, 658,
		749, 713, 704, 698, 712, 726, 777, 744, 729, 787, 817, 728, 773, 788, 806, 804, 822, 720, 741, 669, 706, 698, 679, 551, 642, 541, 471, 693, 767, 769, 808, 839, 710,
		640, 671, 667, 674, 468, 456, 482, 499, 532, 424, 338, 326, 252, 188, 143, 137, 126, 106, 100, 89, 106, 99, 87, 83, 79, 84, 87, 83, 79, 76, 72, 67, 63,
		61, 69, 66, 72, 75, 77, 78, 102, 131, 152, 131, 118, 111, 72, 46, 30, 52, 437, 714, 856, 901, 822, 600, 345, 361, 389, 368, 378, 387, 378, 382, 380, 450,
		661, 620, 778, 710, 715, 758, 753, 719, 732, 629, 706, 643, 756, 767, 700, 654, 612, 712, 680, 720, 674, 613, 374, 104, 103, 74, 231, 414, 362, 287, 564, 957, 863,
		803, 783, 786, 657, 719, 649, 593, 705, 747, 708, 608, 636, 687, 739, 567, 506, 500, 133, 89, 84, 83, 80, 93, 182, 412, 552, 674, 787, 750, 632, 556, 628, 602,
		570, 570, 594, 493, 442, 496, 515, 384, 344, 370, 391, 353, 291, 276, 234, 216, 263, 305, 333, 392, 368, 371, 308, 486, 732, 779, 700, 689, 636, 674, 689, 617, 460,
		355, 158, 146, 111, 100, 381, 872, 833, 729, 776, 749, 754, 812, 805, 539, 492, 320, 110, 90, 138, 181, 210, 239, 238, 246, 224, 234, 288, 279, 224, 125, 74, 74,
		94, 183, 464, 851, 879, 829, 789, 807, 847, 652, 591, 613, 643, 648, 840, 715, 514, 669, 760, 667, 548, 384, 188, 130, 73, 73, 77, 89, 123, 142, 135, 303, 777,
		681, 586, 485, 453, 523, 708, 752, 671, 474, 322, 209, 112, 115, 166, 185, 191, 175, 157, 120, 93, 69, 174, 360, 443, 409, 390, 372, 328, 472, 829, 762, 862, 902,
		781, 728, 723, 688, 711, 756, 746, 639, 879, 837, 803, 694, 617, 544, 738, 869, 922, 768, 682, 851, 833, 833, 566, 746, 730, 688, 681, 756, 594, 802, 799, 676, 598,
		766, 737, 673, 746, 617, 512, 406, 483, 807, 671, 644, 690, 737, 668, 717, 700, 657, 636, 698, 526, 607, 689, 583, 690, 723, 687, 583, 553, 510, 490, 454, 368, 264,
		213, 153, 351, 381, 301, 499, 709, 1002, 998, 870, 904, 857, 724, 725, 729, 682, 683, 815, 831, 759, 687, 569, 513, 544, 688, 791, 476, 342, 262, 133, 174, 212, 497,
		596, 505, 812, 802, 592, 465, 569, 701, 696, 695, 623, 735, 516, 599, 656, 529, 426, 274, 201, 224, 235, 273, 296, 298, 295, 259, 188, 105, 76, 77, 91, 107, 382,
		806, 770, 749, 660, 707, 680, 723, 782, 701, 774, 670, 623, 598, 679, 781, 757, 752, 649, 758, 805, 703, 732, 721, 602, 425, 321, 152, 80, 101, 150, 224, 234, 240,
		220, 198, 169, 157, 120, 76, 149, 236, 231, 247, 329, 831, 880, 682, 912, 817, 809, 829, 880, 678, 851, 694, 701, 725, 738, 519, 586, 732, 744, 711, 634, 623, 685,
		807, 862, 875, 831, 760, 646, 758, 618, 653, 756, 627, 673, 595, 702, 800, 771, 710, 640, 483, 426, 332, 184, 164, 175, 212, 237, 230, 252, 251, 222, 166, 100, 63,
		71, 63, 144, 304, 537, 553, 844, 801, 726, 794, 645, 544, 760, 779, 714, 669, 690, 694, 816, 836, 700, 450, 407, 387, 353, 356, 363, 344, 321, 306, 226, 157, 110,
		119, 220, 715, 765, 790, 768, 777, 783, 745, 738, 653, 582, 691, 794, 742, 681, 625, 668, 729, 777, 610, 517, 449, 346, 170, 151, 78, 69, 96, 137, 308, 495, 502,
		882, 675, 852, 906, 881, 860, 668, 589, 593, 563, 712, 722, 691, 709, 652, 627, 593, 601, 596, 626, 703, 610, 670, 660, 757, 813, 764, 547, 506, 706, 767, 688, 623,
		662, 548, 606, 689, 696, 744, 594, 500, 445, 323, 270, 200, 213, 234, 238, 227, 199, 194, 148, 122, 93, 75, 60, 356, 389, 486, 696, 815, 805, 842, 837, 791, 823,
		744, 754, 740, 752, 773, 727, 761, 783, 749, 691, 673, 655, 698, 652, 702, 700, 684, 750, 861, 803, 762, 711, 696, 723, 712, 776, 777, 721, 724, 709, 721, 706, 780,
		735, 593, 518, 499, 431, 354, 376, 370, 386, 363, 401, 334, 363, 360, 334, 375, 341, 346, 439, 532, 685, 755, 756, 809, 819, 877, 842, 794, 740, 775, 651, 642, 692,
		743, 741, 687, 762, 743, 728, 664, 691, 700, 729, 762, 744, 701, 749, 623, 852, 785, 763, 766, 728, 707, 749, 736, 735, 744, 735, 666, 578, 417, 262, 209, 159, 178,
		231, 263, 222, 216, 192, 174, 139, 111, 78, 90, 119, 216, 421, 543, 878, 855, 766, 672, 644, 785, 810, 840, 859, 822, 814, 852, 816, 569, 244, 174, 128, 109, 117,
		124, 123, 119, 121, 132, 94, 82, 97, 114, 174, 427, 848, 858, 802, 734, 741, 757, 705, 737, 616, 661, 744, 575, 423, 491, 497, 367, 333, 310, 310, 320, 252, 218,
		212, 193, 109, 81, 70, 66, 354, 501, 535, 879, 676, 790, 790, 835, 758, 820, 757, 768, 695, 774, 736, 787, 781, 764, 775, 826, 854, 749, 762, 722, 746, 665, 799,
		823, 787, 691, 660, 676, 664, 646, 690, 658, 725, 799, 763, 766, 716, 679, 521, 556, 469, 274, 181, 106, 187, 209, 220, 251, 238, 216, 194, 138, 87, 79, 76, 79,
		409, 469, 564, 641, 638, 768, 846, 797, 792, 792, 711, 879, 806, 861, 839, 808, 809, 906, 782, 816, 786, 774, 847, 707, 808, 716, 754, 761, 732, 736, 709, 699, 666,
		737, 761, 777, 754, 694, 776, 804, 821, 646, 621, 520, 477, 329, 253, 162, 198, 232, 244, 226, 203, 182, 153, 129, 114, 97, 79, 77, 319, 451, 601, 662, 760, 870,
		823, 848, 825, 898, 866, 738, 592, 795, 897, 808, 897, 813, 842, 826, 856, 840, 801, 745, 759, 857, 887, 709, 722, 736, 773, 696, 814, 751, 657, 672, 726, 809, 827,
		842, 702, 626, 393, 396, 300, 205, 198, 224, 253, 248, 251, 271, 235, 205, 181, 160, 117, 115, 229, 443, 559, 760, 856, 795, 728, 771, 777, 773, 749, 729, 726, 853,
		779, 817, 763, 750, 823, 807, 744, 711, 823, 751, 687, 620, 608, 650, 576, 504, 578, 482, 551, 560, 673, 680, 752, 669, 646, 650, 593, 628, 683, 629, 625, 631, 605,
		590, 548, 608, 698, 858, 796, 786, 795, 765, 776, 633, 685, 838, 744, 538, 506, 492, 634, 931, 856, 734, 692, 737, 676, 598, 554, 657, 776, 766, 753, 650, 611, 697,
		840, 757, 585, 824, 767, 699, 764, 804, 680, 668, 583, 736, 739, 602, 146, 93, 128, 226, 376, 447, 426, 413, 402, 335, 250, 149, 89, 88, 464, 742, 897, 861, 725,
		777, 668, 700, 583, 521, 487, 327, 137, 93, 144, 310, 304, 348, 274, 290, 327, 306, 289, 256, 333, 384, 389, 302, 291, 192, 199, 455, 914, 818, 731, 681, 694, 742,
		724, 604, 368, 156, 65, 164, 262, 456, 571, 916, 823, 751, 894, 933, 791, 673, 510, 400, 472, 414, 339, 195, 94, 121, 196, 195, 197, 186, 153, 130, 109, 77, 66,
		87, 66, 89, 339, 449, 674, 618, 664, 665, 722, 784, 733, 671, 757, 684, 568, 581, 620, 627, 549, 541, 871, 601, 375, 303, 236, 149, 88, 65, 57, 70, 130, 296,
		373, 392, 676, 667, 705, 857, 739, 652, 774, 685, 566, 550, 553, 550, 484, 480, 351, 312, 244, 182, 204, 212, 220, 252, 336, 375, 383, 398, 337, 347, 378, 398, 654,
		949, 836, 792, 826, 817, 757, 860, 717, 741, 792, 830, 878, 812, 820, 750, 696, 738, 829, 899, 749, 738, 659, 702, 823, 888, 727, 787, 745, 761, 773, 856, 748, 763,
		821, 709, 726, 653, 577, 803, 774, 755, 606, 546, 647, 768, 686, 630, 549, 723, 628, 704, 699, 654, 793, 679, 441, 783, 757, 929, 703, 812, 823, 784, 727, 567, 508,
		515, 548, 568, 578, 589, 626, 557, 475, 470, 737, 816, 751, 754, 826, 574, 760, 895, 662, 691, 655, 555, 623, 735, 733, 611, 569, 563, 572, 584, 482, 492, 290, 297,
		387, 406, 379, 414, 626, 779, 702, 487, 546, 588, 576, 666, 563, 575, 412, 170, 104, 88, 126, 158, 153, 201, 202, 215, 193, 193, 178, 138, 104, 95, 71, 56, 56,
		223, 541, 935, 931, 723, 812, 839, 749, 780, 728, 672, 691, 776, 603, 616, 738, 732, 823, 750, 718, 741, 688, 725, 637, 629, 710, 693, 711, 728, 601, 620, 541, 651,
		675, 738, 858, 706, 562, 729, 645, 842, 780, 801, 782, 782, 530, 801, 620, 668, 665, 612, 677, 696, 661, 701, 667, 697, 810, 724, 729, 748, 757, 754, 667, 674, 688,
		748, 691, 647, 627, 723, 628, 580, 708, 730, 783, 724, 700, 725, 707, 636, 607, 646, 706, 749, 698, 704, 681, 630, 623, 571, 720, 607, 711, 721, 755, 823, 869, 920,
		836, 787, 750, 731, 769, 703, 704, 757, 763, 802, 797, 760, 890, 900, 794, 863, 802, 838, 790, 807, 835, 764, 814, 814, 814, 853, 753, 924, 857, 765, 634, 725, 798,
		753, 640, 742, 771, 843, 833, 739, 768, 739, 819, 653, 721, 703, 755, 728, 821, 772, 750, 779, 769, 799, 742, 754, 751, 758, 803, 881, 893, 833, 775, 835, 748, 789,
		731, 779, 791, 817, 816, 879, 825, 899, 746, 816, 802, 748, 761, 730, 820, 787, 819, 745, 811, 830, 780, 783, 832, 807, 771, 780, 701, 685, 767, 675, 661, 681, 733,
		726, 707, 522, 571, 618, 724, 748, 713, 722, 616, 553, 745, 657, 696, 744, 703, 710, 678, 683, 699, 716, 726, 703, 651, 623, 526, 519, 421, 357, 356, 425, 500, 424,
		373, 454, 520, 599, 611, 582, 563, 516, 620, 580, 562, 637, 721, 725, 730, 737, 730, 703, 696, 631, 612, 605, 572, 514, 540, 514, 502, 565, 571, 568, 556, 534, 546,
		518, 531, 424, 374, 254, 271, 243, 279, 332, 367, 418, 429, 453, 462, 460, 436, 368, 283, 234, 207, 247, 391, 580, 487, 366, 932, 989, 831, 688, 624, 565, 618, 671,
		673, 696, 740, 686, 697, 708, 806, 747, 731, 779, 737, 739, 771, 790, 803, 716, 725, 679, 576, 608, 699, 678, 639, 564, 717, 755, 707, 658, 675, 724, 688, 486, 667,
		649, 688, 677, 665, 684, 703, 676, 659, 691, 691, 685, 626, 496, 560, 445, 417, 460, 541, 589, 513, 457, 443, 513, 542, 639, 528, 527, 564, 590, 603, 545, 562, 595,
		827, 790, 746, 766, 666, 699, 750, 662, 656, 620, 585, 554, 556, 547, 588, 665, 631, 607, 573, 587, 614, 626, 622, 599, 571, 591, 572, 550, 548, 507, 659, 582, 560,
		595, 525, 547, 552, 615, 657, 635, 593, 611, 597, 568, 498, 477, 565, 485, 534, 560, 554, 587, 582, 506, 527, 515, 494, 495, 480, 604, 656, 705, 623, 748, 672, 651,
		678, 547, 585, 483, 434, 429, 376, 344, 349, 273, 303, 234, 216, 262, 255, 258, 248, 238, 243, 207, 217, 222, 225, 237, 249, 240, 264, 273, 247, 243, 205, 218, 221,
		203, 180, 159, 151, 142, 129, 122, 121, 95, 109, 125, 108, 118, 110, 106, 104, 91, 99, 88, 100, 240, 631, 581, 545, 614, 535, 525, 520, 420, 379, 323, 289, 258,
		111, 75, 75, 79, 98, 100, 95, 99, 113, 105, 107, 100, 96, 82, 66, 69, 68, 61, 61, 54, 57, 56, 55, 54, 52, 52, 47, 46, 42, 40, 35, 38, 34,
		42, 50, 52, 50, 49, 38, 40, 37, 37, 33, 31, 31, 28, 32, 264, 645, 591, 556, 612, 524, 516, 517, 412, 367, 326, 295, 247, 97, 61, 62, 62, 83, 92,
		94, 88, 100, 97, 96, 90, 143, 72, 49, 53, 48, 39, 370, 492, 382, 333, 353, 442, 326, 264, 366, 379, 294, 257, 357, 325, 264, 241, 330, 248, 221, 264, 288,
		195, 185, 231, 170, 81, 56, 78, 69, 244, 741, 692, 513, 566, 632, 599, 593, 498, 588, 575, 442, 463, 324, 389, 347, 411, 405, 375, 411, 432, 457, 346, 415, 237,
		117, 86, 82, 118, 135, 147, 267, 303, 283, 309, 377, 230, 382, 343, 244, 400, 294, 380, 583, 698, 607, 601, 616, 905, 900, 774, 721, 660, 674, 553, 598, 638, 670,
		615, 681, 744, 781, 742, 736, 801, 748, 809, 752, 754, 748, 732, 728, 665, 604, 649, 677, 703, 668, 702, 542, 610, 738, 707, 560, 624, 745, 752, 648, 680, 680, 690,
		660, 679, 696, 707, 668, 617, 595, 491, 511, 493, 537, 412, 381, 330, 368, 389, 585, 546, 557, 438, 529, 535, 484, 497, 561, 600, 536, 547, 550, 588, 739, 745, 716,
		747, 662, 699, 666, 620, 579, 552, 574, 584, 440, 483, 511, 533, 528, 495, 461, 527, 559, 522, 483, 531, 574, 440, 337, 310, 266, 221, 234, 260, 296, 365, 403, 431,
		384, 349, 267, 254, 259, 245, 232, 418, 486, 384, 557, 990, 952, 815, 639, 603, 649, 699, 714, 768, 697, 686, 693, 697, 820, 800, 781, 798, 787, 746, 817, 746, 756,
		752, 773, 687, 665, 610, 631, 721, 648, 776, 525, 548, 678, 742, 737, 555, 798, 634, 685, 663, 668, 706, 702, 679, 689, 687, 619, 305, 335, 375, 422, 428, 478, 450,
		410, 388, 778, 968, 841, 721, 653, 614, 586, 717, 735, 706, 729, 752, 709, 657, 665, 721, 872, 813, 821, 817, 752, 699, 839, 726, 693, 688, 670, 708, 606, 586, 728,
		697, 668, 735, 748, 719, 724, 653, 702, 678, 689, 675, 613, 682, 664, 660, 712, 647, 578, 638, 643, 639, 627, 681, 721, 724, 686, 703, 660, 707, 624, 640, 655, 652,
		686, 699, 657, 610, 633, 611, 644, 632, 634, 698, 651, 659, 749, 662, 692, 722, 741, 752, 753, 672, 682, 707, 489, 475, 516, 469, 487, 491, 493, 521, 538, 573, 566,
		575, 565, 587, 593, 603, 591, 616, 585, 543, 542, 535, 593, 587, 560, 593, 578, 559, 569, 615, 582, 602, 573, 518, 495, 530, 529, 520, 579, 564, 569, 591, 588, 541,
		509, 472, 512, 530, 523, 680, 806, 658, 655, 814, 579, 612, 741, 607, 599, 704, 677, 640, 485, 500, 507, 524, 553, 571, 598, 611, 609, 596, 569, 530, 474, 453, 441,
		500, 545, 501, 554, 559, 547, 551, 519, 489, 500, 545, 622, 604, 589, 559, 518, 513, 534, 498, 517, 528, 562, 564, 515, 519, 535, 534, 502, 459, 473, 486, 505, 621,
		833, 682, 753, 665, 579, 654, 686, 398, 434, 570, 710, 626, 471, 432, 452, 443, 411, 419, 420, 409, 346, 237, 192, 206, 215, 180, 198, 228, 233, 212, 395, 414, 380,
		377, 354, 367, 393, 381, 384, 399, 388, 336, 361, 352, 336, 324, 310, 291, 302, 270, 260, 231, 224, 216, 212, 192, 173, 197, 190, 317, 700, 607, 589, 614, 538, 543,
		541, 418, 423, 351, 316, 278, 217, 191, 199, 172, 178, 186, 179, 163, 173, 155, 150, 125, 144, 119, 100, 117, 112, 115, 152, 130, 116, 107, 97, 100, 114, 112, 102,
		106, 113, 100, 101, 93, 94, 82, 80, 87, 87, 69, 71, 59, 61, 55, 58, 51, 45, 48, 52, 56, 65, 54, 48, 47, 40, 48, 53, 55, 47, 49, 53, 46,
		48, 43, 40, 36, 39, 37, 38, 29, 30, 26, 27, 23, 27, 22, 20, 23, 25, 26, 29, 23, 22, 21, 19, 21, 26, 27, 23, 23, 26, 23, 24, 20, 19,
		17, 18, 18, 18, 15, 14, 11, 12, 11, 12, 9, 9, 11, 12, 12, 13, 10, 10, 10, 9, 10, 13, 13, 11, 11, 13, 11, 12, 10, 9, 8, 9, 9,
		9, 8, 7, 5, 5, 6, 6, 4, 4, 5, 6, 6, 6, 5, 5, 5, 4, 5, 6, 7, 6, 5, 6, 6, 6, 5, 4, 4, 4, 4, 4, 4, 3,
		2, 2, 3, 3, 2, 2, 3, 3, 3, 3, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1,
		1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
	]
};


/**
 * Created by JetBrains WebStorm.
 * User: C4RL05
 * Date: 10/08/2011
 * Time: 15:44
 * To change this template use File | Settings | File Templates.
 */


LIGHTS.VolumeEvents = function( director ) {

	this.initialize( director );
};

LIGHTS.VolumeEvents.prototype = {


    // _______________________________________________________________________________________ Constructor

	initialize: function( director ) {

        this.director = director;

		this.vox = director.vox;
    },

    // _______________________________________________________________________________________ Start

    start: function() {

	    this.voxVolume = 0;
    },

    // _______________________________________________________________________________________ Update

    update: function() {

	    var voxData = LIGHTS.VolumeData.vox,
		    voxVolume = voxData[ frame ] / 512,
		    frame = Math.floor( LIGHTS.time * 60 ),
			voxAverageVolume = 0,
	        voxPeakEase = 5 * LIGHTS.deltaTime,
	        i;

	    if( frame > 0 ) {

		    for( i = Math.max( 0, frame - 6 ); i <= frame; i++ ) {

			    voxAverageVolume += voxData[ i ] / 512;
		    }

		    voxAverageVolume /= Math.min( 6, frame );

//		    voxDeltaVolume = voxVolume - voxData[ frame - 3 ] / 512;

		    voxVolume = voxAverageVolume;

		    if( this.voxVolume < voxVolume )
		        this.voxVolume = voxVolume;
		    else
				this.voxVolume -= (this.voxVolume - voxVolume) * voxPeakEase;

		    // Assign
		    this.vox.volume = this.voxVolume;
	    }
    },
};

/**
 * Created by JetBrains WebStorm.
 * User: C4RL05
 * Date: 25/08/2011
 * Time: 12:37
 * To change this template use File | Settings | File Templates.
 */


LIGHTS.Home = function( renderManager, gui, callback ) {

	this.initialize( renderManager, gui, callback );
};

LIGHTS.Home.prototype = {

	fadeValue:          0.5,
	hitRadius2:         50 * 50,
	circleCount:        64,
	replayButtonsX:     64,
	mouseOverScale:     1.1,
	buttonOpacity:      0.3,
	buttonY:            -46,

    // _______________________________________________________________________________________ Constructor

	initialize: function( renderManager, gui, callback ) {

		this.renderManager = renderManager;
        this.renderer = renderManager.renderer;
		this.gui = gui;
		this.callback = callback;

		this.loadImages();
	},

	loadImages: function () {

		var callback = bind( this, this.setup ),
			loadedImages = 0,
			numImages = 0;

		this.images = {};

		for( var src in LIGHTS.Config.homeImages ) {

			numImages++;

			this.images[ src ] = new Image();

			this.images[ src ].onload = function() {

				if( ++loadedImages >= numImages )
					 callback();
			};

			this.images[ src ].src = LIGHTS.Config.homeImages[ src ];
		}
	},

	setup: function () {

		this.setupScene();

		this.callback();
	},

	setupScene: function () {
		console.log("Setting up scene");
		// Camera
		this.camera = new THREE.Camera();
		this.camera.projectionMatrix = THREE.Matrix4.makeOrtho( window.innerWidth / - 2, window.innerWidth / 2,  window.innerHeight / 2, window.innerHeight / - 2, -10000, 10000 );
		this.camera.position.z = 1000;

		// Scene
		this.scene = new THREE.Scene();

		var sphereColors = LIGHTS.BallGeometries.prototype.sphereColors,
			geometries = [],
			geometry, material, texture, colors, i;

		// Geometries
		for( i = 0; i < sphereColors.length; i++ ) {

			geometry = new THREE.PlaneGeometry( 1, 1 );
			colors = sphereColors[ i ];
			THREE.MeshUtils.createVertexColorGradient( geometry, [ colors[ 0 ], colors[ 1 ] ] );
			geometries.push( geometry );
		}

		// Materials
		texture = new THREE.Texture( this.images.bokeh );
		texture.needsUpdate = true;

		this.circles = [];

		for( i = 0; i < this.circleCount; i++ ) {

			geometry = geometries[ Math.floor( Math.random() * geometries.length ) ];

			material = new THREE.MeshBasicMaterial( {

				map:            texture,
				color:          0x000000,
				vertexColors:   THREE.VertexColors,
				blending:       THREE.AdditiveBlending,
				transparent:    true
			} );

			var mesh = new THREE.Mesh( geometry, material );
			mesh.position.z = -1000;
			mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 100 + 50;
			mesh.rotation.z = Math.random() * rad360;

			this.circles.push( new LIGHTS.HomeCircle( mesh, material ) );
			this.scene.addChild( mesh );
		}

		// Loading
		texture = new THREE.Texture( this.images.loadingButton );
		texture.needsUpdate = true;

		material = new THREE.MeshBasicMaterial( {

			map:            texture,
			color:          0x000000,
			transparent:    true
		} );

		this.loadingColor = material.color;

		this.loading = new THREE.Mesh( new THREE.PlaneGeometry( 128, 128 ), material );
		this.loading.position.y = this.buttonY;
		this.loading.position.z = 200;
		this.loadingRot = this.loading.rotation;
		this.loadingRot.y = rad180;
		this.scene.addChild( this.loading );

		// Play
		texture = new THREE.Texture( this.images.playButton );
		texture.needsUpdate = true;

		this.playMaterial = new THREE.MeshBasicMaterial( {

			map:            texture,
			color:          0x000000,
			opacity:        1 - this.buttonOpacity,
			transparent:    true
		} );

		this.playColor = this.playMaterial.color;

		this.play = new THREE.Mesh( new THREE.PlaneGeometry( 128, 128 ), this.playMaterial );
		this.play.position.y = this.buttonY;
		this.play.position.z = 400;
		this.playRot = this.play.rotation;
		this.playRot.y = rad180;
		this.scene.addChild( this.play );

		// Fade
		material = new THREE.MeshBasicMaterial( {

			color:          0x000000,
			opacity:        0.5,
			blending:       THREE.MultiplyBlending,
			transparent:    true
		} );

		this.fadeColor = material.color;
		this.fade = new THREE.Mesh( new THREE.PlaneGeometry( 1, 1 ), material );
		this.scene.addChild( this.fade );
		
		// Resize
		this.onWindowResizeListener = bind( this, this.onWindowResize );
		this.onWindowResize();

		// Click
		this.onClickListener = bind( this, this.onClick );
				
	},

	setupReplay: function() {

		// Replay
		texture = new THREE.Texture( LIGHTS.images.replayButton );
		texture.needsUpdate = true;

		this.replayMaterial = new THREE.MeshBasicMaterial( {

			map:            texture,
			color:          0x000000,
			opacity:        1 - this.buttonOpacity,
			transparent:    true
		} );

		this.replayColor = this.replayMaterial.color;

		this.replay = new THREE.Mesh( new THREE.PlaneGeometry( 128, 128 ), this.replayMaterial );
		this.replay.position.x = -this.replayButtonsX;
		this.replay.position.y = this.buttonY;
		this.replay.position.z = 200;
		this.replayRot = this.replay.rotation;
		this.replayRot.y = rad180;
		this.scene.addChild( this.replay );

		// Tweet
		texture = new THREE.Texture( LIGHTS.images.tweetButton );
		texture.needsUpdate = true;

		this.tweetMaterial = new THREE.MeshBasicMaterial( {

			map:            texture,
			color:          0x000000,
			opacity:        1 - this.buttonOpacity,
			transparent:    true
		} );

		this.tweetColor = this.tweetMaterial.color;

		this.tweet = new THREE.Mesh( new THREE.PlaneGeometry( 128, 128 ), this.tweetMaterial );
		this.tweet.position.x = this.replayButtonsX;
		this.tweet.position.y = this.buttonY;
		this.tweet.position.z = 200;
		this.tweetRot = this.tweet.rotation;
		this.tweetRot.y = rad180;
		this.scene.addChild( this.tweet );
	},

    // _______________________________________________________________________________________ Start

    start: function() {

	    this.time = new Date().getTime();
	    this.isReplay = true;
	    this.tweetReady = true;
	    this.openTweetThis = false;
	    this.isClosing = false;
	    this.isOpening = true;
	    this.alpha = 0;
	    this.delay = 1;

	    window.addEventListener( 'resize', this.onWindowResizeListener, false );
	    this.onWindowResize();

	    window.addEventListener( 'click', this.onClickListener, false );

	    var circles = this.circles,
		    i, il, circle;

	    for( i = 0, il = circles.length; i < il; i++ ) {

	        circle = circles[ i ];

			circle.life = 0;
			circle.lifeTime = 0;
			circle.fadeIn = 0;
			circle.fadeOut = 0;
			circle.delay = Math.random() * 4 + 1;
			circle.rotSpeed = Math.random() * 2 - 1;
		    circle.color.setHex( 0x000000 );
	    }
    },

	stop: function() {

		window.removeEventListener( 'resize', this.onWindowResizeListener, false );

		if( this.isReplay )
			window.removeEventListener( 'resize', this.onClickListener, false );
	},

	launchIntro: function() {
		console.log("launchIntro() ");
		this.time = new Date().getTime();
		this.isIntro = true;
		this.isReplay = false;
		this.isClosing = false;
		this.isOpening = true;
		this.isLoaded = false;
		this.isLoading = true;
		this.alpha = 0;
		this.delay = 1;
		this.introDelay = 1000;

		window.addEventListener( 'resize', this.onWindowResizeListener, false );
		this.onWindowResize();
		
	},

	launchPlay: function() {
		console.log("launchPlay() loaded: " + this.isLoaded);
		if( this.alpha < 1 ) {

			this.isLoaded = true;
		}
		else {

			this.isLoading = false;
			this.alpha = 0;
		}

		this.setupReplay();
	},

    // _______________________________________________________________________________________ Update

    update: function() {
	    
	    var w = window.innerWidth,
		    h = window.innerHeight,
		    deltaTime = new Date().getTime() - this.time,
	        circles = this.circles,
		    circle, i, il, hit;

	    if( this.introDelay < 0 ) {
		    // console.log("update() this.introDelay: " + this.introDelay);
			this.time += deltaTime;
			deltaTime /= 1000;

			// Meshes
			for( i = 0, il = circles.length; i < il; i++ ) {

				circle = circles[ i ];

				if( circle.delay < 0 ) {

					circle.life += deltaTime;

					if( circle.life > circle.lifeTime ) {

						circle.position.x = (Math.random() - 0.5) * w;
						circle.position.y = (Math.random() - 0.5) * h;
						circle.color.setHex( 0x000000 );
						circle.life = 0;
						circle.lifeTime = Math.random() * 4 + 2;
						circle.fadeIn = (Math.random() * 0.5 + 0.5) * circle.lifeTime;
						circle.fadeOut = (Math.random() * 0.5 + 0.5) * (circle.lifeTime - circle.fadeIn);
						circle.fadeOutTime = circle.lifeTime - circle.fadeOut;
					}

					if( circle.life < circle.fadeIn )
						circle.color.setHex( 0x010101 * Math.floor( 256 * circle.life / circle.fadeIn ));
					else if( circle.life > circle.fadeOutTime )
						circle.color.setHex( 0x010101 * Math.floor( 256 * (1 - (circle.life - circle.fadeOutTime) / circle.fadeOut ) ) );

					circle.rotation.z += deltaTime * circle.rotSpeed;
				}
				else {

					circle.delay -= deltaTime;
				}
			}

			this.updateButtons( deltaTime );

			// Render
			this.renderer.render( this.scene, this.camera );
			this.renderManager.update();
	    }
	    else {

		    this.introDelay -= deltaTime;
	    }
    },

	updateButtons: function( deltaTime ) {
		// console.log("Updating buttons");
		var input = LIGHTS.Input,
			buttonY = this.buttonY,
			hit, hit2, scale, alpha;

	    // Loading / Play
	    if( this.isOpening ) {
		    // console.log("this.isOpening: " + this.isOpening);
		    // Opening
		    this.alpha += deltaTime * 0.5;

		    if( this.alpha >= 1 ) {

			    this.playScale = 1;
			    this.replayScale = 1;
			    this.tweetScale = 1;
			    this.isOpening = false;
			    this.alpha = 1;
		    }

		    if( ! this.isIntro ) {

			    alpha = Math.min( this.alpha * 4, 1 ) - 1;
			    this.replayRot.y = rad180 * alpha;
			    this.tweetRot.y = rad180 * alpha;
		    }

		    this.gui.fade( this.alpha );
		    this.fadeColor.setHSV( 0, 0, this.alpha * this.fadeValue );

		    if( this.alpha == 1 )
			    this.alpha = 0;
	    }
		else if( this.isIntro ) {
			// console.log("this.isIntro this.delay: " + this.delay);
			// Intro
			if( this.delay < 0 ) {
				// console.log("this.isLoading: " + this.isLoading);
				if( this.isLoading ) {

					// Loading
					// console.log("this.alpha: " + this.alpha);
					if( this.alpha < 1 ) {

						this.alpha += deltaTime * 2;

						if( this.alpha >= 1 ) {
							this.alpha = 1;
							// console.log("this.lights: " + this.lights);
							// this.lights.launch();	
						}
						
						this.loadingRot.y = rad180 * (this.alpha - 1);

						if( this.isLoaded && this.alpha == 1 ) {

							this.isLoading = false;
							this.alpha = 0;
						}
					}
				}
				else {

					// Intro Play
					this.alpha += deltaTime * 2;

					if( this.alpha >= 1 ) {

						this.playScale = 1;
						this.isIntro = false;
						this.alpha = 1;
					}

					this.loadingRot.y = rad180 * this.alpha;
					this.playRot.y = rad180 * (this.alpha - 1);
				}
			}
			else {

				this.delay -= deltaTime;
			}
	    }
	    else {
		    console.log("else this.isClosing: " + this.isClosing + "this.isReplay: " + this.isReplay);
		    // Home
		    if( this.isReplay ) {

			    if( this.isClosing ) {

				    // Closing
					this.alpha += deltaTime * 2;

					if( this.alpha >= 1 ) {
						console.log("play experience");
						LIGHTS.Lights.instance.playExperience();
						this.alpha = 1;
					}

					this.replayRot.y = this.tweetRot.y = rad180 * this.alpha;

				    scale = this.mouseOverScale - this.alpha * (this.mouseOverScale - 1);
				    this.replayScale = Math.min( this.replayScale, scale );
				    this.tweetScale = Math.min( this.tweetScale, scale );

				    alpha = 1 - this.buttonOpacity * this.alpha;
				    this.replayMaterial.opacity = Math.min( this.replayMaterial.opacity, alpha );
				    this.tweetMaterial.opacity = Math.min( this.replayMaterial.opacity, alpha );

				    this.gui.fade( 1 - this.alpha );
					this.fadeColor.setHSV( 0, 0, (1 - this.alpha) * this.fadeValue );
			    }
			    else {

					// Replay Button
					hit = (input.pointerX + this.replayButtonsX) * (input.pointerX + this.replayButtonsX) + (input.pointerY + buttonY ) * (input.pointerY + buttonY );
					hit2 = (input.pointerX - this.replayButtonsX) * (input.pointerX - this.replayButtonsX) + (input.pointerY + buttonY ) * (input.pointerY + buttonY );

					if( hit < this.hitRadius2 || input.keyReturn ) {

						this.replayScale -= (this.replayScale - this.mouseOverScale) * deltaTime * 8;
						this.replayMaterial.opacity -= (this.replayMaterial.opacity - 1) * deltaTime * 8;
						// document.body.style.cursor = 'pointer';

						if( LIGHTS.Input.mouseDown || input.keyReturn ) {

							// document.body.style.cursor = 'auto';
							this.isClosing = true;
							this.alpha = 0;
						}
					}
					else {

						this.replayScale -= (this.replayScale - 1) * deltaTime * 8;
						this.replayMaterial.opacity -= (this.replayMaterial.opacity - (1 - this.buttonOpacity)) * deltaTime * 8;
					}

				    if( this.tweetReady && hit2 < this.hitRadius2 ) {

						this.tweetScale -= (this.tweetScale - this.mouseOverScale) * deltaTime * 8;
					    this.tweetMaterial.opacity -= (this.tweetMaterial.opacity - 1) * deltaTime * 8;
						// document.body.style.cursor = 'pointer';

						if( LIGHTS.Input.mouseDown ) {

							this.openTweetThis = true;
							this.tweetReady = false;
							// document.body.style.cursor = 'auto';
						}
					}
				    else {

						this.tweetScale -= (this.tweetScale - 1) * deltaTime * 8;
					    this.tweetMaterial.opacity -= (this.tweetMaterial.opacity - (1 - this.buttonOpacity)) * deltaTime * 8;
					}

				    if( ! this.tweetReady )
					    this.tweetReady = (hit2 >= this.hitRadius2);

				    // if( hit >= this.hitRadius2 && hit2 >= this.hitRadius2 )
				        // document.body.style.cursor = 'default';
			    }

			    this.replay.scale.x = this.replay.scale.y = this.replay.scale.z = this.replayScale;
			    this.tweet.scale.x = this.tweet.scale.y = this.tweet.scale.z = this.tweetScale;
		    }
		    else {

			    if( this.isClosing ) {

				    // Closing
					this.alpha += deltaTime * 2;

					if( this.alpha >= 1 ) {

						LIGHTS.Lights.instance.playExperience();
						this.alpha = 1;
					}

					this.playRot.y = rad180 * this.alpha;
					this.playScale = this.mouseOverScale - this.alpha * (this.mouseOverScale - 1);
				    this.playMaterial.opacity = 1 - this.buttonOpacity * this.alpha;
				    this.gui.fade( 1 - this.alpha );
					this.fadeColor.setHSV( 0, 0, (1 - this.alpha) * this.fadeValue );
			    }
			    else {

					// Play Button
					hit = input.pointerX * input.pointerX + (input.pointerY + buttonY ) * (input.pointerY + buttonY );

					if( hit < this.hitRadius2 || input.keyReturn ) {

						this.playScale -= (this.playScale - this.mouseOverScale) * deltaTime * 8;
						this.playMaterial.opacity -= (this.playMaterial.opacity - 1) * deltaTime * 8;
						// document.body.style.cursor = 'pointer';

						if( LIGHTS.Input.mouseDown || input.keyReturn ) {

							// document.body.style.cursor = 'auto';
							this.isClosing = true;
							this.alpha = 0;
						}

					} else {

						this.playScale -= (this.playScale - 1) * deltaTime * 8;
						this.playMaterial.opacity -= (this.playMaterial.opacity - (1 - this.buttonOpacity)) * deltaTime * 8;
						// document.body.style.cursor = 'default';
					}
			    }

			    this.play.scale.x = this.play.scale.y = this.play.scale.z = this.playScale;
		    }
	    }

		this.loadingColor.r = this.loadingColor.g = this.loadingColor.b = Math.sin( this.loadingRot.y + rad90 );
		this.playColor.r = this.playColor.g = this.playColor.b = Math.sin( this.playRot.y + rad90 );

		if( this.isReplay ) {

			this.replayColor.r = this.replayColor.g = this.replayColor.b = Math.sin( this.replayRot.y + rad90 );
			this.tweetColor.r = this.tweetColor.g = this.tweetColor.b = Math.sin( this.tweetRot.y + rad90 );
		}
    },

    // _______________________________________________________________________________________ Private

	onClick: function( event ) {

		if( this.openTweetThis ) {

			this.openTweetThis = false;
			window.open( LIGHTS.Config.tweetThis, '_blank', LIGHTS.Config.tweetThisSpecs );
		}
	},

	onWindowResize: function() {

		var w = window.innerWidth,
			h = window.innerHeight,
			w2 = w / 2,
			h2 = h / 2;

// HACK
//		this.fade.scale.x = window.innerWidth;
//		this.fade.scale.y = window.innerHeight;
		this.renderer.setSize( w, h );
		
		console.log("this.camera.projectionMatrix: " + this.camera.projectionMatrix);
		this.camera.projectionMatrix = THREE.Matrix4.makeOrtho( -w2, w2, h2, -h2, -10000, 10000 );
			/*
		setTimeout(function () {
			console.log("this.camera.projectionMatrix: " + this.camera.projectionMatrix);
			this.camera.projectionMatrix = THREE.Matrix4.makeOrtho( -w2, w2, h2, -h2, -10000, 10000 );
		}, 100)
		*/
		
		// console.log("this.camera.projectionMatrix: ",this.camera.projectionMatrix);
		
//
//		this.offsetHeight = (h - 490) / 2;
//
//		if( this.offsetHeight < 0 )
//			this.offsetHeight = 0;
//
//		this.gui.onWindowResize();
	}
};

LIGHTS.HomeCircle = function( mesh, material ) {

	this.position = mesh.position;
	this.rotation = mesh.rotation;
	this.color = mesh.materials[ 0 ].color;
	this.life = 0;
	this.lifeTime = 0;
	this.fadeIn = 0;
	this.fadeOut = 0;
	this.delay = Math.random() * 4 + 1;
	this.rotSpeed = Math.random() * 2 - 1;
};
/**
 * Created by JetBrains WebStorm.
 * User: C4RL05
 * Date: 11/07/2011
 * Time: 17:14
 * To change this template use File | Settings | File Templates.
 */

LIGHTS.Player = function( director ) {

	this.initialize( director );
};

LIGHTS.Player.prototype = {

    playerPan:          0.25,
    playerPanFast:      0.75,

    // _______________________________________________________________________________________ Constructor

	initialize: function( director ) {

		this.director = director;

		this.isCamera = ! LIGHTS.View.prototype.options.debugView;

		if( this.isCamera ) {

			this.camera = director.view.camera;
			this.cameraPosition = this.camera.position;
			this.targetPosition = this.camera.target.position;
			this.targetPosition.x = 0;
			this.targetPosition.y = 60;
			this.targetPosition.z = -100;
			this.camera.useTarget = false;
			this.camera.matrixAutoUpdate = false;
		}
		else {

			this.camera = new THREE.Object3D();
			var trident = new THREE.Trident();
			trident.position.y = 100;
			this.camera.addChild( trident );
		    director.view.scene.addChild( this.camera );
			this.targetPosition = new THREE.Object3D().position;
		}

        this.frustum = 60 * deg2rad;
        this.angle = 30 * deg2rad;
        this.forward = new THREE.Vector2( 0, -1 );
        this.right = new THREE.Vector2( 1, 0 );
        this.cameraUp = new THREE.Vector3();
		this.rollAxis = new THREE.Vector3();
		this.auxMatrix = new THREE.Matrix4();

		this.altitude = this.altitudeOrigin = this.altitudeTarget = 0;
		this.fov = this.fovOrigin = this.fovTarget = 0;
		this.tilt = this.tiltOrigin = this.tiltTarget = 0;
		this.velocity = this.velocityOrigin = this.velocityTarget = 0;
		this.cameraTilt = this.roll = 0;

		this.turbo = 1;
		this.alpha = 1;
		this.duration = 1;
	},

    // _______________________________________________________________________________________ Update

    update: function( immediate ) {

        var input = LIGHTS.Input,
            deltaTime = LIGHTS.deltaTime,
            move = 0,
	        userMult;

        if( ! LIGHTS.releaseBuild && input.keyDown )
            return;

	    immediate = (immediate !== undefined);
	    userMult = immediate? 0 : 1;
	    deltaTime *= userMult;

	    if( ! immediate ) {

		    // Tween
		    if( this.alpha < 1 && ! immediate ) {

			    // Alpha
			    this.alpha += deltaTime / this.duration;

			    if( this.alpha > 1 )
			        this.alpha = 1;

			    var alpha = (Math.sin( this.alpha * rad180 - rad90 ) + 1) * 0.5,
			        alphaMinus = 1 - alpha;

			    this.altitude = this.altitudeOrigin * alphaMinus + this.altitudeTarget * alpha;
			    this.tilt = this.tiltOrigin * alphaMinus + this.tiltTarget * alpha;
			    this.velocity = this.velocityOrigin * alphaMinus + this.velocityTarget * alpha;

			    if( this.isCamera ) {

				    this.fov = this.fovOrigin * alphaMinus + this.fovTarget * alpha;

				    if( this.camera.fov != this.fov ) {

					    this.camera.fov = this.fov;
			            this.camera.updateProjectionMatrix();
					}
			    }
		    }

		    // Turbo
		    if( input.mouseDown )
				this.turbo -= (this.turbo - 2.5) * deltaTime * 4;
		    else
				this.turbo -= (this.turbo - 1) * deltaTime * 2;

			// Move
			move = deltaTime * this.velocity * this.turbo;

			// Steer
			this.angle -= input.mouseX * this.turbo * deltaTime * this.velocity * 0.001;
	    }

		// Update
        this.cameraPosition.x += this.forward.x * move;
	    this.cameraPosition.y = this.altitude;
        this.cameraPosition.z += this.forward.y * move;

		this.targetPosition.x = this.cameraPosition.x - Math.sin( this.angle ) * this.targetDistance;
		this.targetPosition.y = this.cameraPosition.y;
		this.targetPosition.z = this.cameraPosition.z - Math.cos( this.angle ) * this.targetDistance;

        if( ! this.isCamera ) {

			this.director.view.camera.position.x = this.cameraPosition.x;
			this.director.view.camera.position.z = this.cameraPosition.z;
        }

	    // Roll
	    this.roll -= (this.roll - (userMult * input.mouseX * this.velocity * 0.001)) * deltaTime * 0.3 * this.turbo;
	    this.rollAxis.sub( this.cameraPosition, this.targetPosition );
	    this.rollAxis.normalize();
	    this.cameraUp.x = this.cameraUp.z = 0; this.cameraUp.y = 1;
	    this.auxMatrix.setRotationAxis( this.rollAxis, -this.roll );
	    this.auxMatrix.rotateAxis( this.cameraUp );
	    this.camera.matrix.lookAt( this.cameraPosition, this.targetPosition, this.cameraUp );

	    // Tilt
	    this.cameraTilt -= (this.cameraTilt + (userMult * input.mouseY * this.velocity * 0.0005) + this.tilt) * deltaTime * 2;
	    this.auxMatrix.setRotationX( this.cameraTilt );
	    this.camera.matrix.multiply( this.camera.matrix, this.auxMatrix );

	    // Position
	    this.camera.matrix.setPosition( this.cameraPosition );
	    this.camera.update( null, true, this.camera );

	    // Update target
	    this.targetPosition.x = this.targetPosition.y = 0;
	    this.targetPosition.z = -this.targetDistance;// * this.velocity * 0.1;
	    this.camera.matrix.multiplyVector3( this.targetPosition );

	    // Update FWD>>
	    this.forward.x = -Math.sin( this.angle );
	    this.forward.y = -Math.cos( this.angle );

	    this.right.x = -Math.sin( this.angle + rad90 );
	    this.right.y = -Math.cos( this.angle + rad90 );
    },

    // _______________________________________________________________________________________ Launch

	launch: function() {

		this.targetDistance = 150;

		if( this.isCamera ) {

			switch( LIGHTS.Music.phase.index ) {

				case 0:
					this.camera.fov = this.fov = this.fovTarget = 25;
					this.camera.updateProjectionMatrix();

					this.cameraPosition.y = this.altitude = -40;
					this.altitudeTarget = 60;
					this.cameraTilt = this.tilt = -rad90 * 0.1;
					this.tiltTarget = rad90 * 0.1;
					this.velocity = this.velocityTarget = 0;
					this.alpha = 1;

					this.targetPosition.x = this.cameraPosition.x - Math.sin( this.angle ) * this.targetDistance;
					this.targetPosition.y = this.cameraPosition.y;
					this.targetPosition.z = this.cameraPosition.z - Math.cos( this.angle ) * this.targetDistance;

					this.update( true );
					this.tween( 8 );
					break;

				case 1:
//					this.fovTarget = 25;
					this.velocityTarget = 150;
//					this.tiltTarget = rad90 * 0.1;
					this.tween( 1 );
					break;

				case 3:
					this.fovTarget = 30;
					this.altitudeTarget = 110;
//					this.tiltTarget = rad90 * 0.15;
					this.velocityTarget = 250;
					this.tween( 4 );
					break;

				case 7:
					this.altitudeTarget = 80;
					this.tiltTarget = rad90 * 0.1;
					this.velocityTarget = 150;
					this.tween( 2 );
					break;

				case 9:
					this.altitudeTarget = 120;
					this.tiltTarget = rad90 * 0.15;
					this.velocityTarget = 200;
					this.tween( 4 );
					break;

				case 11:
					this.altitudeTarget = 80;
					this.tiltTarget = rad90 * 0.1;
					this.velocityTarget = 250;
					this.tween( 4 );
					break;

				case 13:
					this.altitudeTarget = 200;
					this.fovTarget = 40;
					this.tiltTarget = rad90 * 0.3;
					this.velocityTarget = 200;
					this.tween( 4 );
					break;

				case 15:
					this.altitudeTarget = 200;
					this.fovTarget = 40;
					this.tiltTarget = rad90 * 0.2;
					this.velocityTarget = 200;
					this.tween( 8 );
					break;

				case 16:
//					this.altitudeTarget = 80;
//					this.fovTarget = 30;
//					this.tiltTarget = rad90 * 0.1;
					this.velocityTarget = 0;
					this.tween( 3 );
					break;

				case 17:
					this.altitudeTarget = 90;
					this.fovTarget = 30;
					this.tiltTarget = rad90 * 0.1;
					this.velocityTarget = 200;
					this.tween( 2 );
					break;

				case 18:
					this.altitudeTarget = 130;
					this.tiltTarget = rad90 * 0.15;
					this.velocityTarget = 200;
					this.tween( 4 );
					break;

				case 21:
					this.altitudeTarget = 100;
					this.fovTarget = 40;
					this.tiltTarget = rad90 * 0.1;
					this.velocityTarget = 200;
					this.tween( 4 );
					break;

				case 22:
					this.velocityTarget = 100;
					this.altitudeTarget = 200;
					this.tiltTarget = rad90 * 0.3;
					this.tween( 8 );
					break;
			}
		}
	},

	tween: function( duration ) {

		this.duration = duration;

		if( ! LIGHTS.releaseBuild )
			console.log( "CAMERA: vel:", this.velocityTarget, "alt:", this.altitudeTarget, "tilt:", this.tiltTarget, "fov:", this.fovTarget );

		this.altitudeOrigin = this.altitude;
		this.fovOrigin = this.fov;
		this.tiltOrigin = this.tilt;
		this.velocityOrigin = this.velocity;
		this.alpha = 0;
	}
};
/**
 * Created by JetBrains WebStorm.
 * User: C4RL05
 * Date: 25/08/2011
 * Time: 14:28
 * To change this template use File | Settings | File Templates.
 */

LIGHTS.RenderManager = function() {

	this.initialize();
};

LIGHTS.RenderManager.prototype = {

	initialize: function() {
/*
		var container = document.createElement('div'),
			style = container.style;

		style.position = 'absolute';
		style.top = '0px';
		style.left = '0px';
		style.zIndex = '-100';
		style.margin = '0';
		style.padding = '0';
		document.body.appendChild( container );
*/

		var _canvas = document.getElementById('canvas');

		var error = "";
		var retrieveError = function(e) { error = e.statusMessage || "unknown error"; };

		_canvas.addEventListener("webglcontextcreationerror", retrieveError, false);
		var ctx = _canvas.getContext("experimental-webgl");
		_canvas.removeEventListener("webglcontextcreationerror", retrieveError, false);

		if( ctx ) {

			var renderer = new THREE.WebGLRenderer( { canvas: _canvas, clearColor: 0x000000, clearAlpha: 1, antialias: false } );
			renderer.setSize( window.innerWidth, window.innerHeight );
			renderer.autoClear = false;
			// container.appendChild( renderer.domElement );

			this.renderer = renderer;
		}
		else {

			alert("WebGL error: " + error);
		}

        // Stats
        /*
		if( ! LIGHTS.releaseBuild ) {

			this.renderStats = new THREE.RenderStats( this.renderer );

	        this.stats = new Stats();
	        this.stats.domElement.style.position = 'absolute';
	        this.stats.domElement.style.top = '-42px';
	        // this.renderStats.container.appendChild( this.stats.domElement );
		}
		*/
	},

	update: function() {

		if( ! LIGHTS.releaseBuild ) {

			this.renderStats.update();
			this.stats.update();
		}
	}
};

/**
 * Created by JetBrains WebStorm.
 * User: C4RL05
 * Date: 23/07/2011
 * Time: 13:27
 * To change this template use File | Settings | File Templates.
 */

LIGHTS.Skybox = function( director ) {

	this.initialize( director );
};

LIGHTS.Skybox.prototype = {

    // _______________________________________________________________________________________ Constructor

	initialize: function( director ) {

        this.view = director.view;
        this.cameraPosition = director.player.camera.position;

        var geometry, material, texture;

		// Geometry
        geometry = new LIGHTS.CapsuleGeometry( 1280, 1280, 640, 16, [ 0, 1 ], true, 640, 8, false );
		THREE.MeshUtils.translateVertices( geometry, 0, -640, 0 );
		THREE.MeshUtils.transformUVs( geometry, 0, 1, 1, -1 );

		// Texture
		texture = new THREE.Texture( LIGHTS.images.skybox );
		texture.needsUpdate = true;
		texture.repeat.x = 4;
		texture.wrapS = THREE.RepeatWrapping;
//        texture.magFilter = THREE.LinearMipMapLinearFilter;
//        texture.minFilter = THREE.LinearMipMapLinearFilter;

		// Material
        material = new THREE.MeshBasicMaterial( {

//	        wireframe: true,
            map: texture,
            color: 0xFF0000
//            color: 0x808080
//            color: 0x000000
        } );

		this.color = material.color;

		// Mesh
        this.mesh = new THREE.Mesh( geometry, material );
        this.mesh.flipSided = true;

        this.view.renderer.initMaterial( material, {}, null, null );

		if( ! LIGHTS.View.prototype.options.debugView )
            this.view.scene.addChild( this.mesh );
	},

    update: function() {

        this.mesh.position.copy( this.cameraPosition );

//	    var colorPhase = (Math.sin( LIGHTS.time * rad360 * 0.5 ) + 1) * 0.5;

	    var colorPhase = (LIGHTS.time * 0.3) % 2;

	    if( colorPhase > 1 )
	        colorPhase = 1 - (colorPhase - 1);

	    this.color.setHSV( 0.6 + colorPhase * 0.35, 1, 1 );
//	    this.color.r *= 2;
//	    this.color.g *= 2;
//	    this.color.b *= 2;
    }
};

/**
 * Created by JetBrains WebStorm.
 * User: C4RL05
 * Date: 18/07/2011
 * Time: 18:28
 * To change this template use File | Settings | File Templates.
 */
/**
 * Created by JetBrains WebStorm.
 * User: C4RL05
 * Date: 22/07/2011
 * Time: 11:03
 * To change this template use File | Settings | File Templates.
 */

LIGHTS.Stars = function( director ) {

	this.initialize( director );
};

LIGHTS.Stars.particleCount = 10;//24;
LIGHTS.Stars.particleSize = 4;

LIGHTS.Stars.prototype = {

    // _______________________________________________________________________________________ Constructor

	initialize: function( director ) {

        this.terrain = director.terrain;
        this.player = director.player;

        var p, star, material;

        // Geometry
        this.particles = new THREE.Geometry();
        this.particles.dynamic = true;
        this.particles.colors = [];
        this.stars = [];

        // Materials
        material = new THREE.ParticleBasicMaterial({
                vertexColors: true,
                size: LIGHTS.Stars.particleSize * 2,
//                map: this.getCircleTexture( 32 ),
                map: LIGHTS.TextureUtils.getCircleTexture( 32 ),
//                map: THREE.ImageUtils.loadTexture( "images/BluePlasmaBall.png" ),
                blending: THREE.AdditiveBlending,
                transparent: true
        });

        for( p = 0; p < LIGHTS.Stars.particleCount; p++ ) {

            star = new LIGHTS.Star();
            star.position = new THREE.Vector3( 999999, 0, 999999 );
            star.color = new THREE.Color( 0xFF0000 );
            this.stars.push( star );

            this.particles.vertices.push( new THREE.Vertex( star.position ) );
            this.particles.colors.push( star.color );
        }

        this.particleSystem = new THREE.ParticleSystem( this.particles, material );
        this.particleSystem.sortParticles = false;
        this.particleSystem.dynamic = true;
        director.view.scene.addChild( this.particleSystem );
    },

   // _______________________________________________________________________________________ Update

    lifeFade:    0.5,

    update: function() {

        var i, star;

        this.particles.__dirtyColors = true;

        for( i = 0; i < LIGHTS.Stars.particleCount; i++ ) {

            star = this.stars[ i ];

            star.life += LIGHTS.deltaTime;

            if( star.life < star.fadeIn )
                star.color.setHex( 0x010101 * Math.floor( 256 * star.life / star.fadeIn ));
            else if( star.life > star.fadeOut )
                star.color.setHex( 0x010101 * Math.floor( 256 * (1 - (star.life - star.fadeOut) / star.fadeOutTime ) ) );

            if( star.life > star.lifeTime || ! this.terrain.isVisible( star.position.x, star.position.z ) ) {

//                this.terrain.selectRandomTileAtRadius( 1 );
	            this.terrain.selectCenterTile();
//                this.terrain.selectRandomTileAtRadius( 1 + Math.ceil( Math.random() * (this.terrain.gridRadius - 3) ) );
                this.terrain.selectTerrainRandomVertex( false );

                star.position.copy( this.terrain.randomPosition );
                star.position.y += 50 + 150 * Math.random();
                star.color.setHex( 0x000000 );
                star.life = 0;
                star.lifeTime = 0.5 + Math.random() * 0.5;
                star.fadeIn = (0.5 + Math.random() * 0.5) * star.lifeTime;
                star.fadeOut = (0.5 + Math.random() * 0.5) * (star.lifeTime - star.fadeIn);
                star.fadeOutTime = star.lifeTime - star.fadeOut;

                this.particles.__dirtyVertices = true;
            }
        }
    }
};

// _______________________________________________________________________________________ STAR

LIGHTS.Star = function() {

	this.initialize();
};

LIGHTS.Star.prototype = {

    // _______________________________________________________________________________________ Constructor

	initialize: function() {

        this.position = null;
        this.color = null;
        this.life = 0;
        this.lifeTime = 0;
        this.fadeIn = 0;
        this.fadeOut = 0;
    }
};

/**
 * Created by JetBrains WebStorm.
 * User: C4RL05
 * Date: 16/07/2011
 * Time: 13:54
 * To change this template use File | Settings | File Templates.
 */

LIGHTS.View = function( renderManager ) {

	this.initialize( renderManager );
};

LIGHTS.View.prototype = {

    // _______________________________________________________________________________________ Constructor

    options: {

        debugView:      false,
//        debugView:      true,
	    debugViewY:     5000,

	    antialias:      false,
//        fog:            false,
        fog:            true,
        fogAmount:      0.002
    },

    postprocessing: {

//        enabled:        false,
        enabled:        true,
        blurAmount:     0.0015
    },

	initialize: function( renderManager ) {

		this.renderManager = renderManager;
		this.renderer = renderManager.renderer;

        // Camera
        if( this.options.debugView ) {

	        this.camera = new THREE.Camera( 33, window.innerWidth / window.innerHeight, 1, 16000 );
	        this.camera.position.x = 0;
	        this.camera.position.y = this.options.debugViewY;
	        this.camera.position.z = 700;
	        this.camera.rotation.x = -rad90;
            this.camera.useTarget = false;
        }
        else {

	        this.camera = new THREE.Camera( 30, window.innerWidth / window.innerHeight, 1, 1600 );
        }

        // Scene
        this.scene = new THREE.Scene();

        if( ! this.options.debugView && this.options.fog )
            this.scene.fog = new THREE.FogExp2( 0x000000, this.options.fogAmount );
//            this.scene.fog = new THREE.Fog( 0x000000, this.camera.near, this.camera.far );

		this.sceneVox = new THREE.Scene();

        this.initPostprocessing();

		this.onWindowResizeListener = bind( this, this.onWindowResize );
	},

    // _______________________________________________________________________________________ Public

    clear: function() {

        this.renderer.clear();
    },

    setFog: function( fogAmount ) {

        if( ! this.options.debugView && this.options.fog )
            this.scene.fog.fogAmount = fogAmount;
    },

	start: function() {

		window.addEventListener( 'resize', this.onWindowResizeListener, false );
		this.onWindowResize();
	},

	stop: function() {

		window.removeEventListener( 'resize', this.onWindowResizeListener, false );
	},

    update: function() {

        if( this.postprocessing.enabled ) {

            // Render scene into texture
            this.renderer.render( this.scene, this.camera, this.postprocessing.rtTexture1, true );
            this.renderManager.update();

            // Render quad with blured scene into texture (convolution pass 1)
            this.postprocessing.quad.materials[ 0 ] = this.postprocessing.materialConvolution;
            this.postprocessing.materialConvolution.uniforms.tDiffuse.texture = this.postprocessing.rtTexture1;
            this.postprocessing.materialConvolution.uniforms.uImageIncrement.value = this.postprocessing.blurx;
            this.renderer.render( this.postprocessing.scene, this.postprocessing.camera, this.postprocessing.rtTexture2, true );

            // Render quad with blured scene into texture (convolution pass 2)
            this.postprocessing.materialConvolution.uniforms.tDiffuse.texture = this.postprocessing.rtTexture2;
            this.postprocessing.materialConvolution.uniforms.uImageIncrement.value = this.postprocessing.blury;
            this.renderer.render( this.postprocessing.scene, this.postprocessing.camera, this.postprocessing.rtTexture3, true );

            // Render original scene with superimposed blur to texture
            this.postprocessing.quad.materials[ 0 ] = this.postprocessing.materialScreen;
            this.postprocessing.materialScreen.uniforms.tDiffuse.texture = this.postprocessing.rtTexture3;
            this.postprocessing.materialScreen.uniforms.opacity.value = 1.3;
            this.renderer.render( this.postprocessing.scene, this.postprocessing.camera, this.postprocessing.rtTexture1, false );

            // Render to screen
	        this.postprocessing.materialVignette.uniforms.tDiffuse.texture = this.postprocessing.rtTexture1;
            this.renderer.render( this.postprocessing.sceneScreen, this.postprocessing.camera );

	        // Render vox
	        this.renderer.render( this.sceneVox, this.camera );

        } else {

            this.renderer.render( this.scene, this.camera );
	        this.renderer.render( this.sceneVox, this.camera );
            this.renderManager.update();
        }
    },

    initPostprocessing: function() {

        this.postprocessing.scene = new THREE.Scene();
        this.postprocessing.sceneScreen = new THREE.Scene();

        this.postprocessing.camera = new THREE.Camera();
	    this.postprocessing.camera.projectionMatrix = THREE.Matrix4.makeOrtho( window.innerWidth / - 2, window.innerWidth / 2,  window.innerHeight / 2, window.innerHeight / - 2, -10000, 10000 );
	    this.postprocessing.camera.position.z = 100;

        var pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat };
//	    var pars = { minFilter: THREE.LinearMipMapLinearFilter, magFilter: THREE.LinearMipMapLinearFilter, format: THREE.RGBFormat };

        this.postprocessing.rtTexture1 = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, pars );
        this.postprocessing.rtTexture2 = new THREE.WebGLRenderTarget( 512, 512, pars );
        this.postprocessing.rtTexture3 = new THREE.WebGLRenderTarget( 512, 512, pars );

        var screen_shader = THREE.ShaderUtils.lib["screen"];
        var screen_uniforms = THREE.UniformsUtils.clone( screen_shader.uniforms );

        screen_uniforms["tDiffuse"].texture = this.postprocessing.rtTexture1;
        screen_uniforms["opacity"].value = 1.0;

        this.postprocessing.materialScreen = new THREE.MeshShaderMaterial( {

            uniforms: screen_uniforms,
            vertexShader: screen_shader.vertexShader,
            fragmentShader: screen_shader.fragmentShader,
            blending: THREE.AdditiveBlending,
            transparent: true
        } );

		// Vignette
		var vignetteFragmentShader = [

			"varying vec2 vUv;",
			"uniform sampler2D tDiffuse;",

			"void main() {",

				"vec4 texel = texture2D( tDiffuse, vUv );",
				"vec2 coords = (vUv - 0.5) * 2.0;",
				"float coordDot = dot (coords,coords);",
				"float mask = 1.0 - coordDot * 0.36;",
				"gl_FragColor = texel * mask;",
			"}"

		].join("\n");

	    this.postprocessing.materialVignette = new THREE.MeshShaderMaterial( {

	        uniforms: screen_uniforms,
	        vertexShader: screen_shader.vertexShader,
	        fragmentShader: vignetteFragmentShader,
		    blending: THREE.AdditiveBlending,
		    transparent: true
	    } );

		// Convolution
        var convolution_shader = THREE.ShaderUtils.lib["convolution"];
        var convolution_uniforms = THREE.UniformsUtils.clone( convolution_shader.uniforms );

        this.postprocessing.blurx = new THREE.Vector2( this.postprocessing.blurAmount, 0.0 ),
        this.postprocessing.blury = new THREE.Vector2( 0.0, this.postprocessing.blurAmount );

        convolution_uniforms["tDiffuse"].texture = this.postprocessing.rtTexture1;
        convolution_uniforms["uImageIncrement"].value = this.postprocessing.blurx;
        convolution_uniforms["cKernel"].value = THREE.ShaderUtils.buildKernel( 8 );

        this.postprocessing.materialConvolution = new THREE.MeshShaderMaterial( {

            uniforms: convolution_uniforms,
            vertexShader:   "#define KERNEL_SIZE 25.0\n" + convolution_shader.vertexShader,
            fragmentShader: "#define KERNEL_SIZE 25\n"   + convolution_shader.fragmentShader
        } );

        this.postprocessing.quad = new THREE.Mesh( new THREE.PlaneGeometry( 1, 1 ), this.postprocessing.materialConvolution );
	    this.postprocessing.quad.scale.x = window.innerWidth;
	    this.postprocessing.quad.scale.y = window.innerHeight;
        this.postprocessing.quad.position.z = -500;
        this.postprocessing.scene.addObject( this.postprocessing.quad );

        this.postprocessing.quadScreen = new THREE.Mesh( new THREE.PlaneGeometry( 1, 1 ), this.postprocessing.materialVignette );
	    this.postprocessing.quadScreen.scale.x = window.innerWidth;
	    this.postprocessing.quadScreen.scale.y = window.innerHeight;
        this.postprocessing.quadScreen.position.z = -500;
        this.postprocessing.sceneScreen.addObject( this.postprocessing.quadScreen );
    },

	onWindowResize: function() {

		this.renderer.setSize( window.innerWidth, window.innerHeight );
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();

		// Postprocessing
		this.postprocessing.camera.projectionMatrix = THREE.Matrix4.makeOrtho( window.innerWidth / - 2, window.innerWidth / 2,  window.innerHeight / 2, window.innerHeight / - 2, -10000, 10000 );
		this.postprocessing.quad.scale.x = window.innerWidth;
		this.postprocessing.quad.scale.y = window.innerHeight;
		this.postprocessing.quadScreen.scale.x = window.innerWidth;
		this.postprocessing.quadScreen.scale.y = window.innerHeight;

		var pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat };
		this.postprocessing.rtTexture1 = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, pars );
	}
};
/**
 * Created by JetBrains WebStorm.
 * User: C4RL05
 * Date: 30/07/2011
 * Time: 15:13
 * To change this template use File | Settings | File Templates.
 */

LIGHTS.Vox = function( director ) {

	this.initialize( director );
};

LIGHTS.Vox.prototype = {

    // _______________________________________________________________________________________ Vars

    particleCount:      256,
	trailCountAdd:      24,
	trailCountAlpha:    24,
	spectrumLength:     64,

    // _______________________________________________________________________________________ Constructor

	initialize: function( director ) {

        this.director = director;
		this.player = director.player;
		this.targetPosition = this.player.targetPosition;

        this.vox = new THREE.Object3D();
        director.view.sceneVox.addChild( this.vox );

		this.voxPosition = this.vox.position;
		this.voxPositionY = 0;
        this.position = new THREE.Vector3();
        this.velocity = new THREE.Vector3();

        this.createParticles();
		this.createTrails();
		this.createBengal();

		this.volume = 1;
		this.time = 0;
		this.isIntro = false;
		this.isOutro = false;
		this.active = false;
    },

    // _______________________________________________________________________________________ Update

	update: function() {

		if( this.active ) {

			var easing = LIGHTS.deltaTime * (this.player.velocity * this.player.turbo / 40);

			this.velocity.x = (this.targetPosition.x - this.position.x) * easing;
			this.velocity.y = (this.targetPosition.y - this.position.y) * easing;
			this.velocity.z = (this.targetPosition.z - this.position.z) * easing;

			this.position.x += this.velocity.x;
			this.position.y += this.velocity.y;
			this.position.z += this.velocity.z;

			this.voxPositionY -= ( this.voxPositionY - (this.player.cameraTilt + this.player.tilt) * 64 ) * easing * 0.5;
			this.voxPosition.x = this.position.x + this.player.right.x * this.player.roll * 128;
			this.voxPosition.y = this.position.y + this.voxPositionY;
			this.voxPosition.z = this.position.z + this.player.right.y * this.player.roll * 128;

			if( this.bengal.visible )
				this.updateBengal();

			if( this.isIntro ) {

				this.updateParticlesIntro();
			}
			else if( this.isOutro ) {

				this.updateParticlesOutro();
			}
			else {

				this.updateTrailPositions();
				this.updateTrailGeometry( this.trailGeometryAdd );
				this.updateTrailGeometry( this.trailGeometryAlpha );
			}
		}
    },

	finish: function() {

		this.lineSystem.visible = true;
		this.isOutro = true;

		this.bengalAlpha = 0;

		this.setupParticlesOutro();
//		this.trailSystemAdd.visible = false;
//		this.trailSystemAlpha.visible = false;
//		this.bengal.visible = false;
//		this.bengalShadow.visible = false;
	},

	stop: function() {

		this.lineSystem.visible = false;
		this.trailSystemAdd.visible = false;
		this.trailSystemAlpha.visible = false;
		this.bengal.visible = false;
		this.bengalShadow.visible = false;
		this.active = false;

	},

	start: function() {

		this.active = true;
		this.lineSystem.visible = true;
		this.trailSystemAdd.visible = false;
		this.trailSystemAlpha.visible = false;
		this.bengal.visible = false;
		this.bengalShadow.visible = false;
		this.position.copy( this.director.player.targetPosition );
		this.isIntro = true;
		this.isOutro = false;
		this.introTime = 0;
		this.bengalMaterialCache.visible = true;

		this.setupParticlesIntro();
	},

	launchBengal: function() {

		this.bengal.visible = true;
		this.bengalShadow.visible = true;

		this.bengalTime = 0;
		this.bengalAlpha = 0;
		this.bengal.scale.x = this.bengal.scale.y = 0.001;
		this.bengalShadow.scale.x = this.bengalShadow.scale.y = this.bengal.scale.x;
	},

	launch: function() {

		if( LIGHTS.Music.startTime > 0 )
			this.launchBengal();

		this.isIntro = false;
		this.lineSystem.visible = false;
		this.trailSystemAdd.visible = true;
		this.trailSystemAlpha.visible = true;

		this.setupTrailGeometry( this.trailGeometryAdd );
		this.setupTrailGeometry( this.trailGeometryAlpha );
		this.setupTrailPositions();

		this.bengalMaterialCache.visible = false;
	},

    // _______________________________________________________________________________________ Trails

	createTrails: function() {

		var scene = this.director.view.sceneVox,
			material, i, il;

		var texture = new THREE.Texture( LIGHTS.images.spotLine );
		texture.needsUpdate = true;

		// Add
		this.trailGeometryAdd = new LIGHTS.SpotGeometry( 10, 10, 64, 64, this.trailCountAdd );
		this.trailGeometryAdd.computeBoundingSphere();
		this.trailGeometryAdd.boundingSphere.radius = Number.MAX_VALUE;
		this.trailGeometryAdd.trailCount = this.trailCountAdd;

		for( i = 0, il = this.trailGeometryAdd.vertices.length; i < il; i++ )
			this.trailGeometryAdd.vertices[ i ].linePosition = new THREE.Vector3();

//		i = this.trailGeometryAdd.vertices.length / this.trailCountAdd;

		material = new THREE.MeshBasicMaterial( {

			map:            texture,
//			color:          0x202020,
			blending:       THREE.AdditiveBlending,
			transparent:    true
		} );

		this.trailSystemAdd = new THREE.Mesh( this.trailGeometryAdd, material );
		this.trailSystemAdd.renderDepth = 0;
		this.trailSystemAdd.dynamic = true;
		this.trailSystemAdd.doubleSided = true;
		scene.addChild( this.trailSystemAdd );

		// Lines
		this.trailGeometryAdd.trailDatas = [];

		for( i = 0, il = this.trailCountAdd; i < il; i++ )
			this.trailGeometryAdd.trailDatas.push( this.createTrailData( 3 ) );

		// Color
		texture = new THREE.Texture( LIGHTS.images.spotLineAlpha );
		texture.needsUpdate = true;

		this.trailGeometryAlpha = new LIGHTS.SpotGeometry( 10, 10, 64, 64, this.trailCountAlpha );
		this.trailGeometryAlpha.computeBoundingSphere();
		this.trailGeometryAlpha.boundingSphere.radius = Number.MAX_VALUE;
		this.trailGeometryAlpha.trailCount = this.trailCountAdd;

		for( i = 0, il = this.trailGeometryAlpha.vertices.length; i < il; i++ )
			this.trailGeometryAlpha.vertices[ i ].linePosition = new THREE.Vector3();

		this.setupTrailVertexColors( this.trailGeometryAlpha );

		material = new THREE.MeshBasicMaterial( {

			vertexColors:   THREE.VertexColors,
			map:            texture,
			opacity:        0.75,
//			blending:       THREE.AdditiveBlending,
			transparent:    true
		} );

		this.trailSystemAlpha = new THREE.Mesh( this.trailGeometryAlpha, material );
		this.trailSystemAlpha.renderDepth = 20;
		this.trailSystemAlpha.dynamic = true;
		this.trailSystemAlpha.doubleSided = true;
		scene.addChild( this.trailSystemAlpha );

		// Lines
		this.trailGeometryAlpha.trailDatas = [];

		for( i = 0, il = this.trailCountAlpha; i < il; i++ )
			this.trailGeometryAlpha.trailDatas.push( this.createTrailData( 6 ) );

		// Trail
		this.trailPositions = [];

		for( i = 0; i <= 70; i++ )
			this.trailPositions[ i ] = new THREE.Vector3();

		// Spectrum
		this.spectrum = [];

		for( i = 0; i < this.spectrumLength; i++ )
			this.spectrum[ i ] = 0;

		this.spectrumIndex = 0;

	},

	setupTrailVertexColors: function( geometry ) {

		var trailCount = geometry.trailCount,
			faces = geometry.faces,
			faceCount = faces.length,
			planeOffset = faceCount / trailCount,
			colorTop = [ 1, 0, 0 ],
			colorBottom = [ 1, 0, 0 ],
			f = 0,
			i, j, color, alpha, alphaMinus;

		for( i = 0; i < trailCount; i++ ) {

			colorBottom[ 1 ] = Math.random() * 0.5 + 0.5;
			colorBottom[ 2 ] = Math.random() * 0.5;

			colorTop[ 1 ] = Math.random() * 0.5 + 0.5;
			colorTop[ 2 ] = Math.random() * 0.5;

			for( j = 0; j < planeOffset; j++ ) {

				face = faces[ f++ ];

				alpha = j / planeOffset;
				alphaMinus = 1 - alpha;
				color = new THREE.Color();
				color.r = alphaMinus * colorBottom[ 0 ] + alpha * colorTop[ 0 ];
				color.g = alphaMinus * colorBottom[ 1 ] + alpha * colorTop[ 1 ];
				color.b = alphaMinus * colorBottom[ 2 ] + alpha * colorTop[ 2 ];

				face.vertexColors.push( color );
				face.vertexColors.push( color );

				alpha = (j + 1) / planeOffset;
				alphaMinus = 1 - alpha;
				color = new THREE.Color();
				color.r = alphaMinus * colorBottom[ 0 ] + alpha * colorTop[ 0 ];
				color.g = alphaMinus * colorBottom[ 1 ] + alpha * colorTop[ 1 ];
				color.b = alphaMinus * colorBottom[ 2 ] + alpha * colorTop[ 2 ];

				face.vertexColors.push( color );
				face.vertexColors.push( color );
			}
		}

		geometry.__dirtyColors = true;
	},

	setupTrailGeometry: function( geometry ) {

		var vertices = geometry.vertices,
			vertexCount = vertices.length,
			v, pos;

		for( v = 0; v < vertexCount; v++ ) {

			pos = vertices[ v ].linePosition;
			pos.x = 0;
			pos.y = 0;
			pos.z = 0;
		}

		geometry.__dirtyVertices = true;
	},

	setupTrailPositions: function() {

		var trail = this.trailPositions,
			posX = this.voxPosition.x,
			posY = this.voxPosition.y,
			posZ = this.voxPosition.z,
			i, il, pos;

		for( i = 0, il = trail.length; i < il; i++ ) {

			pos = trail[ i ];
			pos.x = posX;
			pos.y = posY;
			pos.z = posZ;
			pos.active = false;
		}
	},

	updateTrailPositions: function() {

		var thisPos = this.voxPosition,
			pos = this.trailPositions.pop();

		pos.x = thisPos.x;
		pos.y = thisPos.y;
		pos.z = thisPos.z;
		pos.active = true;

		this.trailPositions.unshift( pos );

		this.time += LIGHTS.deltaTime;
	},

	createTrailData: function( headNoise ) {

		return {

			offset:             Math.random() * rad360,
			offsetZ:            Math.random() * rad360,
			freq:               rad180 * (Math.random() * 2 + 0.5),
			amp:                (Math.random() - 0.5) * 10,
			rows:               Math.floor( Math.random() * 8 ) + 4,
			spectrumOffset:     Math.floor( Math.random() * 64 ),
			head:               [ (Math.random() - 0.5) * headNoise,
								  (Math.random() - 0.5) * headNoise,
								  (Math.random() - 0.5) * headNoise ] };
	},

	updateTrailGeometry: function( geometry ) {

		var lineBodyRnd = 0.1; //0.5 * (this.volume + 1);

		var time = this.time,
			spectrum = this.spectrum,
			spectrumLength = this.spectrumLength,
			trailPositions = this.trailPositions,
			trailDatas = geometry.trailDatas,
			trailCount = geometry.trailCount,
			posX = this.voxPosition.x,
			posY = this.voxPosition.y,
			posZ = this.voxPosition.z,
			vertices = geometry.vertices,
			vertexCount = vertices.length,
			planeOffset = vertexCount / trailCount,
			v, l, vertex, pos, linePos, a, index, head, spectrumIndex, spectrumRnd, data, offset, freq, amp;

		// Shift positions
		for( v = planeOffset - 1; v > 2; v -= 2 ) {

			for( l = 0; l < trailCount; l++ ) {

				vertex = v + l * planeOffset;

				pos = vertices[ vertex ].linePosition;
				linePos = vertices[ vertex - 2 ].linePosition;
				pos.x = linePos.x;
				pos.y = linePos.y;
				pos.z = linePos.z;

				pos = vertices[ vertex - 1 ].linePosition;
				linePos = vertices[ vertex - 3 ].linePosition;
				pos.x = linePos.x;
				pos.y = linePos.y;
				pos.z = linePos.z;
			}
		}

		// Head
		for( l = 0; l < trailCount; l++ ) {

			vertex = planeOffset * l;

			data = trailDatas[ l ];
			amp = data.amp;
			freq = data.freq;
			offset = data.offset;
			head = data.head;

			a = time * freq + offset;

			linePos = vertices[ vertex ].linePosition;
			linePos.x = amp * Math.sin( a );
			linePos.y = amp * Math.cos( a );
			linePos.z = amp * Math.sin( a + data.offsetZ );

			pos = vertices[ vertex + 1 ].linePosition;
			pos.x = linePos.x + head[ 0 ];
			pos.y = linePos.y + head[ 1 ];
			pos.z = linePos.z + head[ 2 ];
		}

		// Body
		this.spectrumIndex += LIGHTS.deltaTime * 10;
		spectrumIndex = Math.floor( this.spectrumIndex );

		for( v = 0; v < vertexCount; v += 2 ) {

			data = trailDatas[ Math.floor( v / planeOffset ) ];
			spectrumRnd = spectrum[ ((v % planeOffset) + spectrumIndex + data.spectrumOffset) % spectrumLength ];
			freq = data.freq;
			offset = data.offset;

			var row = (v/2) % (planeOffset/2);
			var trailPos = trailPositions[ row ];
			amp = Math.sin( Math.min( row / 16, 1 ) * rad90 ) * (0.15 + spectrumRnd * 0.005) * this.volume + 0.1;

			if( trailPos.active ) {

				pos = vertices[ v ].position;
				linePos = vertices[ v ].linePosition;
				pos.x = trailPos.x + linePos.x * amp;
				pos.y = trailPos.y + linePos.y * amp;
				pos.z = trailPos.z + linePos.z * amp;

				pos = vertices[ v + 1 ].position;
				linePos = vertices[ v + 1 ].linePosition;
				pos.x = trailPos.x + linePos.x * amp;
				pos.y = trailPos.y + linePos.y * amp;
				pos.z = trailPos.z + linePos.z * amp;
			}
			else {

				pos = vertices[ v ].position;
				pos.x = posX;
				pos.y = posY;
				pos.z = posZ;

				pos = vertices[ v + 1 ].position;
				pos.x = posX;
				pos.y = posY;
				pos.z = posZ;
			}
		}

		geometry.__dirtyVertices = true;
	},

    // _______________________________________________________________________________________ Bengal

	createBengal: function() {

		this.bengalIndex = 0;
		this.bengalTexture = new THREE.Texture( LIGHTS.images.bengalSeq );
		this.bengalTexture.repeat.x = this.bengalTexture.repeat.y = 0.25;
		this.bengalTexture.needsUpdate = true;

		var material = new THREE.MeshBasicMaterial( {

			map:            this.bengalTexture,
			blending:       THREE.AdditiveBlending,
			transparent:    true,
			depthTest:      false
		} );

		this.bengal = new THREE.Mesh( new THREE.PlaneGeometry( 20, 20 ), material );
		this.bengal.doubleSided = true;
		this.bengal.renderDepth = 10;
		this.director.view.sceneVox.addChild( this.bengal );

		this.bengalPosition = this.bengal.position;

		// Shadow
		var texture = new THREE.Texture( LIGHTS.images.bengalShadow );
		texture.needsUpdate = true;

		material = new THREE.MeshBasicMaterial( {

			map:            texture,
			blending:       THREE.MultiplyBlending,
			transparent:    true
		} );

		this.bengalShadow = new THREE.Mesh( new THREE.PlaneGeometry( 20, 20 ), material );
		this.bengalShadow.doubleSided = true;
		this.bengalShadow.renderDepth = 40;
		this.director.view.sceneVox.addChild( this.bengalShadow );

		// Cache material
		this.bengalMaterialCache = new THREE.Mesh( new THREE.PlaneGeometry( 0, 0 ), material );
		this.bengalMaterialCache.doubleSided = true;
		this.vox.addChild( this.bengalMaterialCache );
	},

	updateBengal: function() {

		var deltaTime = LIGHTS.deltaTime;

		// Anim texture
		this.bengalTime += deltaTime;

		if( this.bengalTime >= 1/30 ) {

			this.bengalTime -= 1/30;
			this.bengalIndex++;

			if( this.bengalIndex >= 16 )
				this.bengalIndex = 0;

			this.bengalTexture.offset.x = (this.bengalIndex % 4) * 0.25;
			this.bengalTexture.offset.y = Math.floor( this.bengalIndex / 4 ) * 0.25;
		}

		// Scale
		if( this.bengalAlpha < 1 ) {

			this.bengalAlpha += deltaTime;

			if( this.isIntro ) {

				this.bengal.scale.x -= ( this.bengal.scale.x - 1 ) * deltaTime * 4;
			}
			else if( this.isOutro  && this.bengal.scale.x > 0 ) {

				this.bengal.scale.x = Math.max( 0.001, this.bengal.scale.x - deltaTime * 2 );
				this.bengalShadow.scale.x = this.bengalShadow.scale.y = this.bengal.scale.x;
			}

			this.bengal.scale.y = this.bengal.scale.x;
		}
		else if( ! this.isOutro ) {

			this.bengal.scale.x = this.bengal.scale.y = 0.25 + 0.5 * this.volume;
		}

		this.bengalShadow.scale.x = this.bengalShadow.scale.y = this.bengal.scale.x;

		// Position + rotation
		this.bengalPosition.x = this.voxPosition.x;
		this.bengalPosition.y = this.voxPosition.y;
		this.bengalPosition.z = this.voxPosition.z;
		this.bengal.lookAt( this.director.view.camera.position );

		this.bengalShadow.position.x = this.voxPosition.x;
		this.bengalShadow.position.y = this.voxPosition.y;
		this.bengalShadow.position.z = this.voxPosition.z;
		this.bengalShadow.lookAt( this.director.view.camera.position );
	},

    // _______________________________________________________________________________________ Particles

	createParticles: function() {

	    var p, pl, particle, vertices, particles;

	    // Geometry
	    this.particleGeometry = new THREE.Geometry();
		vertices = this.particleGeometry.vertices;
	    particles = this.particles = [];

	    // Particles
	    for( p = 0, pl = this.particleCount; p < pl; p++ ) {

	        particle = new LIGHTS.VoxParticle();

	        vertices.push( new THREE.Vertex( particle.positionStart ) );
	        vertices.push( new THREE.Vertex( particle.positionEnd ) );
	        particles.push( particle );
	    }

	    // Material
		this.lineMaterial = new THREE.LineBasicMaterial( {

			color:          0xFF8040,
			linewidth:      1,
			blending:       THREE.AdditiveBlending,
			transparent:    true,
			depthTest:      false
		} );

		// Line System
		this.lineSystem = new THREE.Line( this.particleGeometry, this.lineMaterial, THREE.LinePieces );
		this.lineSystem.dynamic = true;
		this.lineSystem.visible = false;
	    this.director.view.scene.addChild( this.lineSystem );
	},

	setupParticlesIntro: function() {

		var particles = this.particles,
			positionX = this.voxPosition.x,
			positionY = this.voxPosition.y,
			positionZ = this.voxPosition.z,
			u, a, r, s, p, pl, particle, pos, normal;

		for( p = 0, pl = this.particleCount; p < pl; p++ ) {

			particle = particles[ p ];

			u = Math.random() * 2 - 1;
			a = Math.random() * rad360;
			r = Math.sqrt( 1 - u * u );

			normal = particle.normal;
			normal.x = Math.cos( a ) * r;
			normal.y = Math.sin( a ) * r;
			normal.z = u;

			s = Math.random() * 50 + 100;

			pos = particle.positionStart;
			pos.x = positionX + normal.x * s;
			pos.y = positionY + normal.y * s;
			pos.z = positionZ + normal.z * s;

			pos = particle.positionEnd;
			pos.x = positionX + normal.x * s;
			pos.y = positionY + normal.y * s;
			pos.z = positionZ + normal.z * s;

			particle.end = particle.start = s;
			particle.startVelocity = Math.random() * s * 0.5 + s;
			particle.endVelocity = Math.random() * s * 0.5 + s;
		}

		this.particleGeometry.__dirtyVertices = true;

		this.lineMaterial.color.setHex( 0xFF8040 );

		this.introTime = 0;
	},

	updateParticlesIntro: function() {

		var deltaTime = LIGHTS.deltaTime,
			particles = this.particles,
			positionX = this.voxPosition.x,
			positionY = this.voxPosition.y,
			positionZ = this.voxPosition.z,
			p, pl, particle, pos, normal, radius;

		for( p = 0, pl = this.particleCount; p < pl; p++ ) {

			particle = particles[ p ];

			particle.start = Math.max( 0, particle.start - deltaTime * particle.startVelocity );
			particle.end = Math.max( 0, particle.end - deltaTime * particle.endVelocity );

			normal = particle.normal;

			radius = particle.start;
			pos = particle.positionStart;
			pos.x = positionX + normal.x * radius;
			pos.y = positionY + normal.y * radius;
			pos.z = positionZ + normal.z * radius;

			radius = particle.end;
			pos = particle.positionEnd;
			pos.x = positionX + normal.x * radius;
			pos.y = positionY + normal.y * radius;
			pos.z = positionZ + normal.z * radius;
		}

		this.particleGeometry.__dirtyVertices = true;

		this.introTime += deltaTime;

		if( this.introTime > 0.75 && ! this.bengal.visible )
			this.launchBengal();
	},

	setupParticlesOutro: function() {

		var particles = this.particles,
			positionX = this.voxPosition.x,
			positionY = this.voxPosition.y,
			positionZ = this.voxPosition.z,
			p, pl, particle, pos;

		for( p = 0, pl = this.particleCount; p < pl; p++ ) {

			particle = particles[ p ];

			pos = particle.positionStart;
			pos.x = positionX;
			pos.y = positionY;
			pos.z = positionZ;

			pos = particle.positionEnd;
			pos.x = positionX;
			pos.y = positionY;
			pos.z = positionZ;

			particle.end = particle.start = 50 - Math.random() * 100;
		}

		this.particleGeometry.__dirtyVertices = true;

		this.outroTime = 0;
	},

	updateParticlesOutro: function() {

		var deltaTime = LIGHTS.deltaTime,
			particles = this.particles,
			positionX = this.voxPosition.x,
			positionY = this.voxPosition.y,
			positionZ = this.voxPosition.z,
			p, pl, particle, pos, normal, radius, color, dark;

		for( p = 0, pl = this.particleCount; p < pl; p++ ) {

			particle = particles[ p ];

			particle.start += deltaTime * particle.startVelocity;
			particle.end += deltaTime * particle.endVelocity;

			if( particle.start > 0 && particle.end > 0 ) {

				normal = particle.normal;

				radius = particle.start;
				pos = particle.positionStart;
				pos.x = positionX + normal.x * radius;
				pos.y = positionY + normal.y * radius;
				pos.z = positionZ + normal.z * radius;

				radius = particle.end;
				pos = particle.positionEnd;
				pos.x = positionX + normal.x * radius;
				pos.y = positionY + normal.y * radius;
				pos.z = positionZ + normal.z * radius;
			}
		}

		this.particleGeometry.__dirtyVertices = true;

		this.outroTime += deltaTime;

		if( this.outroTime > 1 ) {

			color = this.lineMaterial.color;
			dark = 1 - deltaTime * 4;
			color.r *= dark;
			color.g *= dark;
			color.b *= dark;

			if( this.outroTime > 1.7 )
				this.stop();
		}
	}
};

LIGHTS.VoxParticle = function() {

    this.positionStart = new THREE.Vector3();
    this.positionEnd = new THREE.Vector3();
	this.normal = new THREE.Vector3();
};


/*
var vs = [-0.6636053, -5.478144, -0.3831328, -0.3831328, -5.478144, -0.6636053, 0, -5.478144, -0.7662655, 0.3831328, -5.478144, -0.6636053, 0.6636053, -5.478144, -0.3831328, 0.7662655, -5.478144, 0, 0.6636053, -5.478144, 0.3831328, 0.3831328, -5.478144, 0.6636053, 0, -5.478144, 0.7662655, -0.3831328, -5.478144, 0.6636053, -0.6636053, -5.478144, 0.3831328, -0.7662655, -5.478144, 0, -0.318938, -5.07377, -0.1841387, -0.1841387, -5.07377, -0.318938, 0, -5.07377, -0.3682775, 0.1841387, -5.07377, -0.318938, 0.318938, -5.07377, -0.1841387, 0.3682775, -5.07377, 0, 0.318938, -5.07377, 0.1841387, 0.1841387, -5.07377, 0.318938, 0, -5.07377, 0.3682775, -0.1841387, -5.07377, 0.318938, -0.318938, -5.07377, 0.1841387, -0.3682775, -5.07377, 0, -0.1413497, -4.691051, -0.08160831, -0.08160831, -4.691051, -0.1413497, 0, -4.691051, -0.1632166, 0.08160831, -4.691051, -0.1413497, 0.1413497, -4.691051, -0.08160831, 0.1632166, -4.691051, 0, 0.1413497, -4.691051, 0.08160831, 0.08160831, -4.691051, 0.1413497, 0, -4.691051, 0.1632166, -0.08160831, -4.691051, 0.1413497, -0.1413497, -4.691051, 0.08160831, -0.1632166, -4.691051, 0, -0.05908209, -4.24158, -0.03411123, -0.03411123, -4.24158, -0.05908209, 0, -4.24158, -0.06822246, 0.03411123, -4.24158, -0.05908209, 0.05908209, -4.24158, -0.03411123, 0.06822246, -4.24158, 0, 0.05908209, -4.24158, 0.03411123, 0.03411123, -4.24158, 0.05908209, 0, -4.24158, 0.06822246, -0.03411123, -4.24158, 0.05908209, -0.05908209, -4.24158, 0.03411123, -0.06822246, -4.24158, 0, -0.05801314, -2.686576, -0.03349382, -0.03349382, -2.686576, -0.05801314, 0, -2.686576, -0.06698763, 0.03349382, -2.686576, -0.05801314, 0.05801314, -2.686576, -0.03349382, 0.06698763, -2.686576, 0, 0.05801314, -2.686576, 0.03349382, 0.03349382, -2.686576, 0.05801314, 0, -2.686576, 0.06698763, -0.03349382, -2.686576, 0.05801314, -0.05801314, -2.686576, 0.03349382, -0.06698763, -2.686576, 0, -0.09132248, -1.885502, -0.05272526, -0.05272526, -1.885502, -0.09132248, 0, -1.885502, -0.1054505, 0.05272526, -1.885502, -0.09132248, 0.09132248, -1.885502, -0.05272526, 0.1054505, -1.885502, 0, 0.09132248, -1.885502, 0.05272526, 0.05272526, -1.885502, 0.09132248, 0, -1.885502, 0.1054505, -0.05272526, -1.885502, 0.09132248, -0.09132248, -1.885502, 0.05272526, -0.1054505, -1.885502, 0, -0.3026648, -1.103645, -0.1747438, -0.1747438, -1.103645, -0.3026648, 0, -1.103645, -0.3494877, 0.1747438, -1.103645, -0.3026648, 0.3026648, -1.103645, -0.1747438, 0.3494877, -1.103645, 0, 0.3026648, -1.103645, 0.1747438, 0.1747438, -1.103645, 0.3026648, 0, -1.103645, 0.3494877, -0.1747438, -1.103645, 0.3026648, -0.3026648, -1.103645, 0.1747438, -0.3494877, -1.103645, 0, -0.4618769, -0.8792522, -0.2666648, -0.2666648, -0.8792522, -0.4618769, 0, -0.8792522, -0.5333297, 0.2666648, -0.8792522, -0.4618769, 0.4618769, -0.8792522, -0.2666648, 0.5333297, -0.8792522, 0, 0.4618769, -0.8792522, 0.2666648, 0.2666648, -0.8792522, 0.4618769, 0, -0.8792522, 0.5333297, -0.2666648, -0.8792522, 0.4618769, -0.4618769, -0.8792522, 0.2666648, -0.5333297, -0.8792522, 0, -0.1686042, -1.457074, 0.09734389, -0.09734389, -1.457074, 0.1686042, 0, -1.457074, 0.1946878, 0.09734389, -1.457074, 0.1686042, 0.1686042, -1.457074, 0.09734389, 0.1946878, -1.457074, 0, 0.1686042, -1.457074, -0.09734389, 0.09734389, -1.457074, -0.1686042, 0, -1.457074, -0.1946878, -0.09734389, -1.457074, -0.1686042, -0.1686042, -1.457074, -0.09734389, -0.1946878, -1.457074, 0, -0.6123724, -0.7001067, -0.3535534, -0.3535534, -0.7001067, -0.6123724, 0, -0.7001067, -0.7071068, 0.3535534, -0.7001067, -0.6123724, 0.6123724, -0.7001067, -0.3535534, 0.7071068, -0.7001067, 0, 0.6123724, -0.7001067, 0.3535534, 0.3535534, -0.7001067, 0.6123724, 0, -0.7001067, 0.7071068, -0.3535534, -0.7001067, 0.6123724, -0.6123724, -0.7001067, 0.3535534, -0.7071068, -0.7001067, 0, -0.75, -0.493, -0.4330127, -0.4330127, -0.493, -0.75, 0, -0.493, -0.8660254, 0.4330127, -0.493, -0.75, 0.75, -0.493, -0.4330127, 0.8660254, -0.493, 0, 0.75, -0.493, 0.4330127, 0.4330127, -0.493, 0.75, 0, -0.493, 0.8660254, -0.4330127, -0.493, 0.75, -0.75, -0.493, 0.4330127, -0.8660254, -0.493, 0, -0.8365163, -0.2518191, -0.4829629, -0.4829629, -0.2518191, -0.8365163, 0, -0.2518191, -0.9659258, 0.4829629, -0.2518191, -0.8365163, 0.8365163, -0.2518191, -0.4829629, 0.9659258, -0.2518191, 0, 0.8365163, -0.2518191, 0.4829629, 0.4829629, -0.2518191, 0.8365163, 0, -0.2518191, 0.9659258, -0.4829629, -0.2518191, 0.8365163, -0.8365163, -0.2518191, 0.4829629, -0.9659258, -0.2518191, 0, -0.8660254, 0.007, -0.5, -0.5, 0.007, -0.8660254, 0, 0.007, -1, 0.5, 0.007, -0.8660254, 0.8660254, 0.007, -0.5, 1, 0.007, 0, 0.8660254, 0.007, 0.5, 0.5, 0.007, 0.8660254, 0, 0.007, 1, -0.5, 0.007, 0.8660254, -0.8660254, 0.007, 0.5, -1, 0.007, 0, -0.8365163, 0.2658191, -0.4829629, -0.4829629, 0.2658191, -0.8365163, 0, 0.2658191, -0.9659258, 0.4829629, 0.2658191, -0.8365163, 0.8365163, 0.2658191, -0.4829629, 0.9659258, 0.2658191, 0, 0.8365163, 0.2658191, 0.4829629, 0.4829629, 0.2658191, 0.8365163, 0, 0.2658191, 0.9659258, -0.4829629, 0.2658191, 0.8365163, -0.8365163, 0.2658191, 0.4829629, -0.9659258, 0.2658191, 0, -0.75, 0.507, -0.4330127, -0.4330127, 0.507, -0.75, 0, 0.507, -0.8660254, 0.4330127, 0.507, -0.75, 0.75, 0.507, -0.4330127, 0.8660254, 0.507, 0, 0.75, 0.507, 0.4330127, 0.4330127, 0.507, 0.75, 0, 0.507, 0.8660254, -0.4330127, 0.507, 0.75, -0.75, 0.507, 0.4330127, -0.8660254, 0.507, 0, -0.6123724, 0.7141068, -0.3535534, -0.3535534, 0.7141068, -0.6123724, 0, 0.7141068, -0.7071068, 0.3535534, 0.7141068, -0.6123724, 0.6123724, 0.7141068, -0.3535534, 0.7071068, 0.7141068, 0, 0.6123724, 0.7141068, 0.3535534, 0.3535534, 0.7141068, 0.6123724, 0, 0.7141068, 0.7071068, -0.3535534, 0.7141068, 0.6123724, -0.6123724, 0.7141068, 0.3535534, -0.7071068, 0.7141068, 0, -0.4330127, 0.8730254, -0.25, -0.25, 0.8730254, -0.4330127, 0, 0.8730254, -0.5, 0.25, 0.8730254, -0.4330127, 0.4330127, 0.8730254, -0.25, 0.5, 0.8730254, 0, 0.4330127, 0.8730254, 0.25, 0.25, 0.8730254, 0.4330127, 0, 0.8730254, 0.5, -0.25, 0.8730254, 0.4330127, -0.4330127, 0.8730254, 0.25, -0.5, 0.8730254, 0, -0.2241439, 0.9729258, -0.1294095, -0.1294095, 0.9729258, -0.2241439, 0, 0.9729258, -0.258819, 0.1294095, 0.9729258, -0.2241439, 0.2241439, 0.9729258, -0.1294095, 0.258819, 0.9729258, 0, 0.2241439, 0.9729258, 0.1294095, 0.1294095, 0.9729258, 0.2241439, 0, 0.9729258, 0.258819, -0.1294095, 0.9729258, 0.2241439, -0.2241439, 0.9729258, 0.1294095, -0.258819, 0.9729258, 0, 0, 1.007, 0, -0.9387715, -6.245, -0.542, -0.542, -6.245, -0.9387715, 0, -6.245, -1.084, 0.542, -6.245, -0.9387715, 0.9387715, -6.245, -0.542, 1.084, -6.245, 0, 0.9387715, -6.245, 0.542, 0.542, -6.245, 0.9387715, 0, -6.245, 1.084, -0.542, -6.245, 0.9387715, -0.9387715, -6.245, 0.542, -1.084, -6.245, 0, -0.9067836, -5.96444, -0.5235318, -0.5235318, -5.96444, -0.9067836, 0, -5.96444, -1.047064, 0.5235318, -5.96444, -0.9067836, 0.9067836, -5.96444, -0.5235318, 1.047064, -5.96444, 0, 0.9067836, -5.96444, 0.5235318, 0.5235318, -5.96444, 0.9067836, 0, -5.96444, 1.047064, -0.5235318, -5.96444, 0.9067836, -0.9067836, -5.96444, 0.5235318, -1.047064, -5.96444, 0, -0.813, -5.703, -0.4693858, -0.4693858, -5.703, -0.813, 0, -5.703, -0.9387716, 0.4693858, -5.703, -0.813, 0.813, -5.703, -0.4693858, 0.9387716, -5.703, 0, 0.813, -5.703, 0.4693858, 0.4693858, -5.703, 0.813, 0, -5.703, 0.9387716, -0.4693858, -5.703, 0.813, -0.813, -5.703, 0.4693858, -0.9387716, -5.703, 0, 0, -5.478144, -0.7662655, 0, -5.07377, -0.3682775, 0, -4.691051, -0.1632166, 0, -4.24158, -0.06822246, 0, -2.686576, -0.06698763, 0, -1.885502, -0.1054505, 0, -1.457074, -0.1946878, 0, -1.103645, -0.3494877, 0, -0.8792522, -0.5333297, -0.4618769, -0.8792522, -0.2666648, -0.2666648, -0.8792522, -0.4618769, 0, -0.8792522, -0.5333297, 0.2666648, -0.8792522, -0.4618769, 0.4618769, -0.8792522, -0.2666648, 0.5333297, -0.8792522, 0, 0.4618769, -0.8792522, 0.2666648, 0.2666648, -0.8792522, 0.4618769, 0, -0.8792522, 0.5333297, -0.2666648, -0.8792522, 0.4618769, -0.4618769, -0.8792522, 0.2666648, -0.5333297, -0.8792522, 0, -0.6123724, -0.7001067, -0.3535534, -0.4618769, -0.8792522, -0.2666648, -0.75, -0.493, -0.4330127, -0.8365163, -0.2518191, -0.4829629, -0.8660254, 0.007, -0.5, -0.8365163, 0.2658191, -0.4829629, -0.75, 0.507, -0.4330127, -0.6123724, 0.7141068, -0.3535534, -0.4330127, 0.8730254, -0.25, -0.2241439, 0.9729258, -0.1294095, 0, 1.007, 0, 0, 1.007, 0, 0, 1.007, 0, 0, 1.007, 0, 0, 1.007, 0, 0, 1.007, 0, 0, 1.007, 0, 0, 1.007, 0, 0, 1.007, 0, 0, 1.007, 0, 0, 1.007, 0, -0.9067836, -5.96444, -0.5235318, -0.9387715, -6.245, -0.542, -0.813, -5.703, -0.4693858, -0.3831328, -5.478144, -0.6636053, -0.6636053, -5.478144, -0.3831328, 0, -5.478144, -0.7662655, 0.3831328, -5.478144, -0.6636053, 0.6636053, -5.478144, -0.3831328, 0.7662655, -5.478144, 0, 0.6636053, -5.478144, 0.3831328, 0.3831328, -5.478144, 0.6636053, 0, -5.478144, 0.7662655, -0.3831328, -5.478144, 0.6636053, -0.6636053, -5.478144, 0.3831328, -0.7662655, -5.478144, 0, -0.6636053, -5.478144, -0.3831328 ];

var refVerts = [];
for( i = 0, il = vs.length; i < il; i += 3 )
	refVerts.push( new THREE.Vector3( vs[ i ], vs[ i+1 ], vs[ i+2 ] ));


var yList = [];
var oList = [];

for( i = 0, il = refVerts.length; i < il; i++ ) {
//		for( i = 0, il = vertices.length; i < il; i++ ) {

	pos = refVerts[ i ];
//			pos = vertices[ i ].position;

	if(  yList.indexOf( pos.y ) == -1 ) {
//			if( pos.y <= rangeMax && yList.indexOf( pos.y ) == -1 )
		yList.push( pos.y );
		oList.push( { y: pos.y, r: Math.sqrt( pos.x * pos.x + pos.z * pos.z ) } );
	}

	if( pos.y > rangeMax && pos.y < radiusY ) {

		radiusY = Math.min( pos.y, radiusY );
		radiusMax = Math.sqrt( pos.x * pos.x + pos.z * pos.z );
	}
}

oList.sort( function sort( a, b ) { return b.y - a.y; } );
lastIndex = yList.length - 1;

var output = "";
for( i = 0; i < oList.length; i++ )
	output += "{ y: " + oList[ i ].y + ", r: " + oList[ i ].r + " }, ";

console.log( output)
*/
/**
 * @author alteredq / http://alteredqualia.com/
 * @author mr.doob / http://mrdoob.com/
 */

Detector = {

	canvas : !! window.CanvasRenderingContext2D,
	webgl : ( function () { try { return true; /*!! window.WebGLRenderingContext && !! document.getElementById('canvas').getContext( 'experimental-webgl' );*/ } catch( e ) { return false; } } )(),
	workers : !! window.Worker,
	fileapi : window.File && window.FileReader && window.FileList && window.Blob,

	getWebGLErrorMessage : function () {

		var domElement = document.createElement( 'div' );

		domElement.style.fontFamily = 'monospace';
		domElement.style.fontSize = '13px';
		domElement.style.textAlign = 'center';
		domElement.style.shadow = '#eee';
		domElement.style.color = '#000';
		domElement.style.padding = '1em';
		domElement.style.width = '475px';
		domElement.style.margin = '5em auto 0';

		if ( ! this.webgl ) {

			domElement.innerHTML = window.WebGLRenderingContext ? [
				'Sorry, your graphics card doesn\'t support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">WebGL</a>'
			].join( '\n' ) : [
				'Sorry, your browser doesn\'t support <a href="http://khronos.org/webgl/wiki/Getting_a_WebGL_Implementation">WebGL</a><br/>',
				'Please try with',
				'<a href="http://www.google.com/chrome">Chrome</a>, ',
				'<a href="http://www.mozilla.com/en-US/firefox/new/">Firefox 4</a> or',
				'<a href="http://nightly.webkit.org/">Webkit Nightly (Mac)</a>'
			].join( '\n' );

		}

		return domElement;

	},

	addGetWebGLMessage : function ( parameters ) {

		var parent, id, domElement;

		parameters = parameters || {};

		parent = parameters.parent !== undefined ? parameters.parent : document.body;
		id = parameters.id !== undefined ? parameters.id : 'oldie';

		domElement = Detector.getWebGLErrorMessage();
		domElement.id = id;

		parent.appendChild( domElement );

	}

};

/**
 * Provides requestAnimationFrame in a cross browser way.
 * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 */

if ( !window.requestAnimationFrame ) {

	window.requestAnimationFrame = ( function() {

		return window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element ) {

			window.setTimeout( callback, 1000 / 60 );

		};

	} )();

}

// stats.js r6 - http://github.com/mrdoob/stats.js
var Stats=function(){function s(a,g,d){var f,c,e;for(c=0;c<30;c++)for(f=0;f<73;f++)e=(f+c*74)*4,a[e]=a[e+4],a[e+1]=a[e+5],a[e+2]=a[e+6];for(c=0;c<30;c++)e=(73+c*74)*4,c<g?(a[e]=b[d].bg.r,a[e+1]=b[d].bg.g,a[e+2]=b[d].bg.b):(a[e]=b[d].fg.r,a[e+1]=b[d].fg.g,a[e+2]=b[d].fg.b)}var r=0,t=2,g,u=0,j=(new Date).getTime(),F=j,v=j,l=0,w=1E3,x=0,k,d,a,m,y,n=0,z=1E3,A=0,f,c,o,B,p=0,C=1E3,D=0,h,i,q,E,b={fps:{bg:{r:16,g:16,b:48},fg:{r:0,g:255,b:255}},ms:{bg:{r:16,g:48,b:16},fg:{r:0,g:255,b:0}},mb:{bg:{r:48,g:16,
b:26},fg:{r:255,g:0,b:128}}};g=document.createElement("div");g.style.cursor="pointer";g.style.width="80px";g.style.opacity="0.9";g.style.zIndex="10001";g.addEventListener("click",function(){r++;r==t&&(r=0);k.style.display="none";f.style.display="none";h.style.display="none";switch(r){case 0:k.style.display="block";break;case 1:f.style.display="block";break;case 2:h.style.display="block"}},!1);k=document.createElement("div");k.style.backgroundColor="rgb("+Math.floor(b.fps.bg.r/2)+","+Math.floor(b.fps.bg.g/
2)+","+Math.floor(b.fps.bg.b/2)+")";k.style.padding="2px 0px 3px 0px";g.appendChild(k);d=document.createElement("div");d.style.fontFamily="Helvetica, Arial, sans-serif";d.style.textAlign="left";d.style.fontSize="9px";d.style.color="rgb("+b.fps.fg.r+","+b.fps.fg.g+","+b.fps.fg.b+")";d.style.margin="0px 0px 1px 3px";d.innerHTML='<span style="font-weight:bold">FPS</span>';k.appendChild(d);a=document.createElement("canvas");a.width=74;a.height=30;a.style.display="block";a.style.marginLeft="3px";k.appendChild(a);
m=a.getContext("2d");m.fillStyle="rgb("+b.fps.bg.r+","+b.fps.bg.g+","+b.fps.bg.b+")";m.fillRect(0,0,a.width,a.height);y=m.getImageData(0,0,a.width,a.height);f=document.createElement("div");f.style.backgroundColor="rgb("+Math.floor(b.ms.bg.r/2)+","+Math.floor(b.ms.bg.g/2)+","+Math.floor(b.ms.bg.b/2)+")";f.style.padding="2px 0px 3px 0px";f.style.display="none";g.appendChild(f);c=document.createElement("div");c.style.fontFamily="Helvetica, Arial, sans-serif";c.style.textAlign="left";c.style.fontSize=
"9px";c.style.color="rgb("+b.ms.fg.r+","+b.ms.fg.g+","+b.ms.fg.b+")";c.style.margin="0px 0px 1px 3px";c.innerHTML='<span style="font-weight:bold">MS</span>';f.appendChild(c);a=document.createElement("canvas");a.width=74;a.height=30;a.style.display="block";a.style.marginLeft="3px";f.appendChild(a);o=a.getContext("2d");o.fillStyle="rgb("+b.ms.bg.r+","+b.ms.bg.g+","+b.ms.bg.b+")";o.fillRect(0,0,a.width,a.height);B=o.getImageData(0,0,a.width,a.height);try{performance&&performance.memory&&performance.memory.totalJSHeapSize&&
(t=3)}catch(G){}h=document.createElement("div");h.style.backgroundColor="rgb("+Math.floor(b.mb.bg.r/2)+","+Math.floor(b.mb.bg.g/2)+","+Math.floor(b.mb.bg.b/2)+")";h.style.padding="2px 0px 3px 0px";h.style.display="none";g.appendChild(h);i=document.createElement("div");i.style.fontFamily="Helvetica, Arial, sans-serif";i.style.textAlign="left";i.style.fontSize="9px";i.style.color="rgb("+b.mb.fg.r+","+b.mb.fg.g+","+b.mb.fg.b+")";i.style.margin="0px 0px 1px 3px";i.innerHTML='<span style="font-weight:bold">MB</span>';
h.appendChild(i);a=document.createElement("canvas");a.width=74;a.height=30;a.style.display="block";a.style.marginLeft="3px";h.appendChild(a);q=a.getContext("2d");q.fillStyle="#301010";q.fillRect(0,0,a.width,a.height);E=q.getImageData(0,0,a.width,a.height);return{domElement:g,update:function(){u++;j=(new Date).getTime();n=j-F;z=Math.min(z,n);A=Math.max(A,n);s(B.data,Math.min(30,30-n/200*30),"ms");c.innerHTML='<span style="font-weight:bold">'+n+" MS</span> ("+z+"-"+A+")";o.putImageData(B,0,0);F=j;if(j>
v+1E3){l=Math.round(u*1E3/(j-v));w=Math.min(w,l);x=Math.max(x,l);s(y.data,Math.min(30,30-l/100*30),"fps");d.innerHTML='<span style="font-weight:bold">'+l+" FPS</span> ("+w+"-"+x+")";m.putImageData(y,0,0);if(t==3)p=performance.memory.usedJSHeapSize*9.54E-7,C=Math.min(C,p),D=Math.max(D,p),s(E.data,Math.min(30,30-p/2),"mb"),i.innerHTML='<span style="font-weight:bold">'+Math.round(p)+" MB</span> ("+Math.round(C)+"-"+Math.round(D)+")",q.putImageData(E,0,0);v=j;u=0}}}};


/**
 * Created by JetBrains WebStorm.
 * User: Apple
 * Date: 01/09/2011
 * Time: 13:54
 * To change this template use File | Settings | File Templates.
 */

LIGHTS.MapCircles = function( map ) {

	this.initialize( map );
};

LIGHTS.MapCircles.prototype = {

	circleCount:    64,

//    colors:         [ 0xFFFF00, 0x00FFFF, 0xFF00FF, 0xFF0000, 0x00FF00, 0x0000FF ],
//    colors:         [ 0x808000, 0x008080, 0x800080, 0x800000, 0x008000, 0x000080 ],
//    colors:         [ 0x404000, 0x004040, 0x400040, 0x400000, 0x004000, 0x000040 ],
    colors:         [ 0x303000, 0x003030, 0x300030, 0x300000, 0x003000, 0x000030 ],

    circles:        [],

    // _______________________________________________________________________________________ Constructor

	initialize: function( map ) {

        this.map = map;

        // Circle texture
        var mapSize = LIGHTS.TerrainMap.size,
            i, mesh, materials, material, texture, geometry;

		texture = new THREE.Texture( LIGHTS.images.circle );
		texture.minFilter = THREE.LinearMipMapLinearFilter;
		texture.magFilter = THREE.LinearMipMapLinearFilter;
        texture.needsUpdate = true;

		// Materials
		materials = [];

		for( i = 0; i < this.colors.length; i++ ) {

			materials.push( new THREE.MeshBasicMaterial( {

				color:          this.colors[ i ],
				map:            texture,
				blending:       THREE.AdditiveBlending,
				transparent:    true
			} ) );
		}

        // Planes
		geometry = new THREE.PlaneGeometry( mapSize, mapSize );

        for( i = 0; i < this.circleCount; i++ ) {

	        material = materials[ Math.floor( Math.random() * materials.length ) ];
            mesh = new THREE.Mesh( geometry, material );
            this.circles.push( new LIGHTS.MapCircle( mesh, material ) );
        }
    },

    // _______________________________________________________________________________________ Public

    launch: function() {

	    var circles = this.circles,
	        mapSize = LIGHTS.TerrainMap.size,
		    i, il, circle, size, posMax;

		for( i = 0, il = this.circleCount; i < il; i++ ) {

			size = 0.05 + 0.15 * Math.random();
            posMax = this.map.viewRadius - mapSize * size * 0.5;

            circle = this.circles[ i ];
			circle.size = size;
			circle.posMax = posMax;

			this.resetCircle( circle );

            this.map.scene.addChild( circle.mesh );
        }
    },

	clear: function() {

		var circles = this.circles,
			i, il;

	    for( i = 0, il = this.circleCount; i < il; i++ )
	        this.map.scene.removeChild( circles[ i ].mesh );
	},

    update: function() {

	    var circles = this.circles,
	        deltaTime = LIGHTS.deltaTime,
		    i, il;

        for( i = 0, il = this.circleCount; i < il; i++ ) {

	        circle = this.circles[ i ];

	        circle.life -= deltaTime;

	        if( circle.life < 0 )
	            this.resetCircle( circle );

	        circle.radius += deltaTime * circle.speed;
	        circle.scale.x = circle.scale.y = circle.radius * circle.size;
        }
    },

    // _______________________________________________________________________________________ Private

	resetCircle: function( circle ) {

		var posMax = circle.posMax;

		circle.life = Math.random() * 4 + 4;
		circle.position.x = Math.random() * 2 * posMax - posMax;
		circle.position.y = Math.random() * 2 * posMax - posMax;
		circle.radius = 0.001;
		circle.scale.x = circle.scale.y = circle.radius * circle.size;
		circle.speed = Math.random() * 0.15 + 0.15;
	}
};

LIGHTS.MapCircle = function( mesh ) {

	this.mesh = mesh;
	this.position = mesh.position;
	this.scale = mesh.scale;

	this.life =
	this.size =
	this.posMax =
	this.radius =
	this.speed = 0;
};
/**
 * Created by JetBrains WebStorm.
 * User: C4RL05
 * Date: 27/07/2011
 * Time: 11:32
 * To change this template use File | Settings | File Templates.
 */

LIGHTS.MapDots = function( map ) {

	this.initialize( map );
};

LIGHTS.MapDots.prototype = {

//    colors:         [ 0xFFFF00, 0x00FFFF, 0xFF00FF, 0xFF0000, 0x00FF00, 0x0000FF ],
	colors:         [ 0x808000, 0x008080, 0x800080, 0x800000, 0x008000, 0x000080 ],
//    colors:         [ 0xFF1561, 0x1a0209, 0x1a1002, 0xFF9D14 ],
	dotCount:       64,

	colorIndex:     0,
	drawCount:      0,
	dots:           [],
	dotMaterials:   [],
	addDot:         false,
	removeDot:      false,

	// _______________________________________________________________________________________ Constructor

	initialize: function( map ) {

	    this.map = map;

	    // Dot texture
	    var r = LIGHTS.TerrainMap.size * 0.5,
	        i, dot, dotMaterial, texture;

		texture = new THREE.Texture( LIGHTS.images.dot );
		texture.minFilter = THREE.LinearMipMapLinearFilter;
		texture.magFilter = THREE.LinearMipMapLinearFilter;
	    texture.needsUpdate = true;

	    // Plane
	    for( i = 0; i < this.dotCount; i++ ) {

	        dotMaterial = new THREE.MeshBasicMaterial( {
		        color:          0xFFFFFF,
		        map:            texture,
		        blending:       THREE.AdditiveBlending,
		        transparent:    true
	        } );

	        dot = new THREE.Mesh( new THREE.PlaneGeometry( LIGHTS.TerrainMap.size, LIGHTS.TerrainMap.size ), dotMaterial  );

	        this.dots.push( dot );
	        this.dotMaterials.push( dotMaterial );
	    }
	},

	// _______________________________________________________________________________________ Update

	drawDots: function( count ) {

	    this.drawCount = count;

	    var i, dot, scale, size, posMax;

	    for( i = 0; i < count; i++ ) {

	        scale = 0.05 + 0.15 * Math.random(),
	        size = LIGHTS.TerrainMap.size * scale,
	        posMax = this.map.viewRadius - size * 0.5;

	        dot = this.dots[ i ];
	        dot.position.x = Math.random() * 2 * posMax - posMax;
	        dot.position.y = Math.random() * 2 * posMax - posMax;
	        dot.scale.x = dot.scale.y = scale;

	        this.map.scene.addChild( dot );
	        this.dotMaterials[ i ].color.setHex( this.colors[ (this.colorIndex++) % this.colors.length ] );
	    }

		this.addDot = true;
		this.removeDot = false;
	},

	clear: function() {

		for( var i = 0; i < this.dotCount; i++ )
		    this.map.scene.removeChild( this.dots[ i ] );
	},

	update: function() {

	    if( this.addDot ) {

		    this.addDot = false;
	        this.removeDot = true;
	    }
	    else if( this.removeDot ) {

	        for( var i = 0; i < this.drawCount; i++ )
	            this.map.scene.removeChild( this.dots[ i ] );

	        this.removeDot = false;
	    }
	}
};
/**
 * Created by JetBrains WebStorm.
 * User: Apple
 * Date: 04/09/2011
 * Time: 11:57
 * To change this template use File | Settings | File Templates.
 */

LIGHTS.MapGlows = function( map ) {

	this.initialize( map );
};

LIGHTS.MapGlows.prototype = {

    colors:       [ [ [ 1, 1, 0 ], [ 1, 0, 0 ] ],
					[ [ 1, 0, 1 ], [ 1, 0, 0 ] ],
					[ [ 1, 1, 0 ], [ 0, 1, 0 ] ],
					[ [ 0, 1, 1 ], [ 0, 1, 0 ] ],
	                [ [ 0, 1, 1 ], [ 0, 0, 1 ] ],
	                [ [ 1, 0, 1 ], [ 0, 0, 1 ] ] ],

    glows:        [],

    // _______________________________________________________________________________________ Constructor

	initialize: function( map ) {

        this.map = map;
		this.ballSize = LIGHTS.BallGeometries.prototype.ballSize;

        // Glow texture
        var i, material;

        // Texture
		this.texture = new THREE.Texture( LIGHTS.images.glow );
		this.texture.minFilter = THREE.LinearMipMapLinearFilter;
		this.texture.magFilter = THREE.LinearMipMapLinearFilter;
        this.texture.needsUpdate = true;

        // Geometry
		this.glowCount = LIGHTS.BallsManager.prototype.ballsPerTile;
		this.geometry = new LIGHTS.SpotGeometry( 1, 1, 1, 1, this.glowCount );

		material = new THREE.MeshBasicMaterial( {

			vertexColors:   THREE.FaceColors,
			map:            this.texture,
			blending:       THREE.AdditiveBlending,
			transparent:    true
		} );

		this.mesh = new THREE.Mesh( this.geometry, material );
		this.mesh.dynamic = true;

        for( i = 0; i < this.glowCount; i++ )
            this.glows.push( new LIGHTS.MapGlow( i, this.geometry ) );
    },

    // _______________________________________________________________________________________ Public

    launch: function( balls ) {

	    this.balls = balls;

	    var glows = this.glows,
	        terrainSize = LIGHTS.Terrain.prototype.tileSize,
	        mapSize = this.map.viewRadius * 2,
		    i, il, glow, ballPos, ball, behaviour, colorIndex;

		for( i = 0, il = this.glowCount; i < il; i++ ) {

			behaviour = balls.behaviours[ i ];
			ballPos = behaviour.position;

            glow = this.glows[ i ];
			glow.behaviour = behaviour;

			glow.position.x = (ballPos.x / terrainSize) * mapSize;
			glow.position.y = (ballPos.z / terrainSize) * mapSize;
        }

        this.map.glowScene.addChild( this.mesh );
    },

	clear: function() {

        this.map.scene.removeChild( this.mesh );
	},

    update: function() {

	    var glows = this.glows,
		    ballSize = this.ballSize,
	        colors = this.colors,
		    i, il, glow, glowColor, ballColors, topColor, bottomColor, behaviour, mult, add, grow, scale, growMinus,
		    posX, posY, glowSize2;

        for( i = 0, il = this.glowCount; i < il; i++ ) {

	        glow = this.glows[ i ];
	        behaviour = glow.behaviour;

	        if( behaviour.visible && behaviour.state < 2 ) {

		        mult = behaviour.multiply;
		        add = behaviour.additive;
		        grow = behaviour.grow;
		        scale = behaviour.scale;

		        glow.visible = true;

		        if( glow.scale != scale || glow.grow != grow || glow.multiply != mult || glow.additive != add ) {

					glowColor = glow.color;
					ballColors = colors[ behaviour.colorIndex ];
					bottomColor = ballColors[ 0 ];
					topColor = ballColors[ 1 ];
					growMinus = 1 - grow;

					glowColor.r = (topColor[ 0 ] * growMinus + bottomColor[ 0 ] * grow) * mult + add;
					glowColor.g = (topColor[ 1 ] * growMinus + bottomColor[ 1 ] * grow) * mult + add;
					glowColor.b = (topColor[ 2 ] * growMinus + bottomColor[ 2 ] * grow) * mult + add;

					posX = glow.position.x;
					posY = glow.position.y;

					glowSize2 = 3 * ( behaviour.scale * ballSize * (1 - grow * 0.5) - add );

					glow.posA.x = posX - glowSize2;
					glow.posA.y = posY - glowSize2;
					glow.posB.x = posX + glowSize2;
					glow.posB.y = posY - glowSize2;
					glow.posC.x = posX - glowSize2;
					glow.posC.y = posY + glowSize2;
					glow.posD.x = posX + glowSize2;
					glow.posD.y = posY + glowSize2;

					glow.scale = scale;
					glow.grow = grow;
					glow.multiply = mult;
					glow.additive = add;

					this.geometry.__dirtyVertices = true;
					this.geometry.__dirtyColors = true;
		        }
	        }
	        else if( glow.visible ) {

		        glow.visible = false;
		        glow.scale = 0;

		        glow.posA.x = glow.posA.y =
		        glow.posB.x = glow.posB.y =
		        glow.posC.x = glow.posC.y =
		        glow.posD.x = glow.posD.y = 0;

		        this.geometry.__dirtyVertices = true;
	        }
        }
    }
};

LIGHTS.MapGlow = function( index, geometry ) {

	this.position = new THREE.Vector3();

	this.posA = geometry.vertices[ index * 4 ].position;
	this.posB = geometry.vertices[ index * 4 + 1 ].position;
	this.posC = geometry.vertices[ index * 4 + 2 ].position;
	this.posD = geometry.vertices[ index * 4 + 3 ].position;

	this.posA.z = 10;
	this.posB.z = 10;
	this.posC.z = 10;
	this.posD.z = 10;

	geometry.faces[ index ].color = this.color = new THREE.Color();

	this.scale = 0;
	this.grow = 0;
	this.multiply = 0;
	this.additive = 0;
	this.visible = false;
};
/**
 * Created by JetBrains WebStorm.
 * User: C4RL05
 * Date: 27/07/2011
 * Time: 17:06
 * To change this template use File | Settings | File Templates.
 */

LIGHTS.MapLines = function( map ) {

	this.initialize( map );
};

LIGHTS.MapLines.prototype = {

    colors:         [ 0xFFFF00, 0x00FFFF, 0xFF00FF, 0xFF0000, 0x00FF00, 0x0000FF ],
    lineCount:      64,

    colorIndex:     0,
    drawCount:      0,
    lines:          [],
    lineMaterials:  [],
    addLine:        false,
    removeLine:     false,

    // _______________________________________________________________________________________ Constructor

	initialize: function( map ) {

        this.map = map;

        // Circle texture
        var r = LIGHTS.TerrainMap.size * 0.5,
            i, line, material, height;

		var sizes = [ 2, 4, 8, 16, 32, 64 ];
        // Plane
        for( i = 0; i < this.lineCount; i++ ) {

            material = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } );
	        height = Math.ceil( Math.random() * 4 );
//	        height = LIGHTS.TerrainMap.size / 16;
//	        height = sizes[ Math.floor( i / 4 ) ];
            line = new THREE.Mesh( new THREE.PlaneGeometry( LIGHTS.TerrainMap.size, height ), material  );

            this.lines.push( line );
            this.lineMaterials.push( material );
        }
    },

    // _______________________________________________________________________________________ Update

    drawLines: function( count ) {

        this.drawCount = count;

        var i, line, scale, size, posMax;

        for( i = 0; i < count; i++ ) {

            scale = 0.05 + 0.1 * Math.random(),
            size = LIGHTS.TerrainMap.size * scale,
            posMax = this.map.viewRadius - size * 0.5;

            line = this.lines[ i ];
            line.position.x = 0;
            line.position.y = Math.random() * 2 * posMax - posMax;
//            line.position.y = Math.floor( Math.random() * 16 ) * LIGHTS.TerrainMap.size / 16;
			line.speed = 0; //Math.random() * 32 + 32;
			line.speed *= (line.position.y > 0)? -1 : 1;

            this.map.scene.addChild( line );
            this.lineMaterials[ i ].color.setHex( this.colors[ (this.colorIndex++) % this.colors.length ] );

            this.addLine = true;
            this.removeLine = false;
        }
    },

	// TODO
	moveLines: function() {

		for( var i = 0; i < this.lineCount; i++ )
			this.lines[ i ].rotation.z += Math.random() * 0.1;

	},

	clear: function() {

		for( var i = 0; i < this.lineCount; i++ )
			this.map.scene.removeChild( this.lines[ i ] );
	},

	update: function() {

		for( var i = 0; i < this.lineCount; i++ )
			this.lines[ i ].position.y += this.lines[ i ].speed * LIGHTS.deltaTime;

return;
		/*
        if( this.addLine ) {

		    this.addLine = false;
            this.removeLine = true;
        }
        else if( this.removeLine ) {

            for( var i = 0; i < this.drawCount; i++ )
                this.map.scene.removeChild( this.lines[ i ] );

            this.removeLine = false;
        }
        */
    }
}
/**
 * Created by JetBrains WebStorm.
 * User: C4RL05
 * Date: 17/07/2011
 * Time: 10:59
 * To change this template use File | Settings | File Templates.
 */

LIGHTS.Terrain = function( director ) {

	this.initialize( director );
};

LIGHTS.Terrain.prototype = {

    mapResolution:          66,//32,
    tileSize:               480, //320,//640,
    gridSize:               5,
    height:                 140, // 256,

    selectedTile:           null,
    randomVertexIndex:      null,
    randomVertexPosition:   new THREE.Vector3(),
    randomPosition:         new THREE.Vector3(),
    randomNormal:           new THREE.Vector3(),
	randomX:                null,
	randomY:                null,

    tiles:                  [],
    tileIdSet:              {},
	usedVertices:           [],

    // _______________________________________________________________________________________ Constructor

	initialize: function( director ) {

        this.director = director;

        this.scene = director.view.scene;
        this.player = director.player;
        this.camera = this.player.camera;
        this.gridRadius = Math.floor( this.gridSize / 2 );

        // Create tiles
        var x, y, tile;

        for( x = 0; x < this.gridSize; x++ ) {

            this.tiles[ x ] = [];

            for( y = 0; y < this.gridSize; y++ ) {

                tile = new THREE.Object3D();
                tile.visible = false;
                tile.justOn = tile.justOff = tile.justMoved = false;
                this.tiles[ x ][ y ] = tile;
            }
        }

        // TerrainPlane
        this.terrainPlane = new LIGHTS.TerrainPlane( this.tileSize, this.mapResolution, this.height, LIGHTS.images[ 'terrain' + this.mapResolution ] );
		this.displacement = new LIGHTS.TerrainDisplacement( this );

		// usedVertices
		for( x = 0; x <= this.terrainPlane.resolution; x++ ) {

			this.usedVertices[ x ] = [];

			for( y = 0; y <= this.terrainPlane.resolution; y++ )
				this.usedVertices[ x ][ y ] = false;
		}
	},

    // _______________________________________________________________________________________ Update

    update: function() {

        // Tiles
        var cameraX = this.camera.position.x,
            cameraY = this.camera.position.z,
            sin = Math.sin( this.player.angle ),
            cos = Math.cos( this.player.angle ),
            x, y, r, angle, deltaX, deltaY, tile, tileX, tileY, tileId, tileVisible;

        this.cameraTileX = (Math.round( cameraX / this.tileSize ) - this.gridRadius) * this.tileSize;
        this.cameraTileY = (Math.round( cameraY / this.tileSize ) - this.gridRadius) * this.tileSize;

        // Clear idTableSet
        for( tileId in this.tileIdSet )
            delete this.tileIdSet[ tileId ];

        // Update grid
        for( x = 0; x < this.gridSize; x++ ) {

            for( y = 0; y < this.gridSize; y++ ) {

                tileX = this.cameraTileX + this.tileSize * x;
                tileY = this.cameraTileY + this.tileSize * y;
                deltaX = (tileX - cameraX);
                deltaY = (tileY - cameraY);
                angle = Math.atan2( deltaX, deltaY );

                r = Math.floor( Math.max( Math.abs( x - this.gridRadius ), Math.abs( y - this.gridRadius ) ) );

                // Visible?
                /*
                    // sin (s – t) = sin s cos t – cos s sin t
                    cos (s – t) = cos s cos t + sin s sin t
                 */
                if( r > 1 )
                    tileVisible = (cos * Math.cos( angle ) + sin * Math.sin( angle )) < -0.5; // Far cull angle delta cos
                else if( r == 1 )
                    tileVisible = (cos * Math.cos( angle ) + sin * Math.sin( angle )) < 0.5; // Near cull angle delta cos
                else
                    tileVisible = true;

                // Update tile
                tile = this.tiles[ x ][ y ];

                if( tileVisible ) {

                    tile.justOff = false;
                    tile.justOn = ! tile.visible;

                    if( tile.justOn ) {

                        this.scene.addChild( tile );
                        tile.visible = true;
                    }

                    tileId = tileX + "/" + tileY;
                    this.tileIdSet[ tileId ] = true;
                    tile.justMoved = (tile.tileId != tileId);

                    if( tile.justMoved ) {

                        tile.position.x = tileX;
                        tile.position.z = tileY;
                        tile.tileId = tileId;
                    }
                }
                else {

                    tile.justOff = tile.visible;
                    tile.justOn = false;

                    if( tile.justOff ) {

                        this.scene.removeChild( tile );
                        tile.visible = false;
                    }
                }
            }
        }

	    // Displacement
	    if( this.displacement.active )
	        this.displacement.update();
    },

    // _______________________________________________________________________________________ Public

    isVisible: function( posX, posY ) {

        var posTileX = (Math.round( posX / this.tileSize ) - this.gridRadius) * this.tileSize,
            posTileY = (Math.round( posY / this.tileSize ) - this.gridRadius) * this.tileSize,
            x = (posTileX - this.cameraTileX) / this.tileSize + this.gridRadius,
            y = (posTileY - this.cameraTileY) / this.tileSize + this.gridRadius;

        if( isNaN( x ) || isNaN( y ) || x < 0 || x >= this.gridSize || y < 0 || y >= this.gridSize )
            return false;
        else
            return this.tiles[ x ][ y ].visible;
    },

	reset: function() {

		var x, y;

		for( x = 0; x <= this.terrainPlane.resolution; x++ )
			for( y = 0; y <= this.terrainPlane.resolution; y++ )
				this.usedVertices[ x ][ y ] = false;

		this.terrainPlane.resetVertices();
	},

    // _______________________________________________________________________________________ Select

    selectTile: function( x, y ) {

        this.selectedTile = this.tiles[ x ][ y ];
    },

    selectTileById: function( tileId ) {

        var x, y, tilesX;

        for( x = 0; x < this.gridSize; x++ ) {

            tilesX = this.tiles[ x ];

            for( y = 0; y < this.gridSize; y++ ) {

                if( tilesX[ y ].tileId == tileId ) {

                    this.selectedTile = tilesX[ y ];
                    return true;
                }
            }
        }

        return false;
    },

    selectCenterTile: function() {

        this.selectedTile = this.tiles[ this.gridRadius ][ this.gridRadius ];
    },

    selectRandomTile: function( radius ) {

        this.selectRandomTileAtRadius( Math.floor( Math.random() * this.gridRadius ) );
    },

    selectRandomTileAtRadius: function( radius ) {

        var tries = 100,
	        x, y, t;

        do {
            x = this.gridRadius + radius * ((Math.random() > 0.5)? 1 : -1);
            y = this.gridRadius - radius + Math.floor( Math.random() * radius * 2 );

            // Swap X/Y
            if( Math.random() > 0.5 ) {

                t = x;
                x = y;
                y = t;
            }

            this.selectedTile = this.tiles[ x ][ y ];

        } while( --tries > 0 && ! this.selectedTile.visible );

		if( tries == 0 ) {

			console.log( this.selectedTile.visible, x, y, radius );
			console.error( "ERROR: Terrain.selectRandomTileAtRadius: Not found" );
		}
    },

    selectTerrainRandomVertex: function( empty, radius, border ) {

	    this.selectTerrainRandomCoords( empty, radius, border );

	    if( empty )
			this.usedVertices[ this.randomX ][ this.randomY ] = true;

        this.randomVertexIndex = this.terrainPlane.indexGrid[ this.randomX ][ this.randomY ];
//        this.randomVertexIndex = Math.floor( Math.random() * this.terrainPlane.vertices.length );
	    this.randomVertex = this.terrainPlane.vertices[ this.randomVertexIndex ];
        this.randomVertexPosition.copy( this.randomVertex.position );
        this.randomPosition.add( this.selectedTile.position, this.randomVertexPosition );
        this.randomNormal = this.terrainPlane.vertexNormals[ this.randomVertexIndex ];
    },

	selectTerrainRandomCoords: function( empty, radius, border ) {

	    var resolution = this.terrainPlane.resolution,
	        usedVertices = this.usedVertices,
		    tries = 100,
	        radius2 = empty? radius * radius : 0,
	        stillEmpty, x, y, ix, iy, ixl, iyl, dx, dy;

		if( border === undefined ) border = 0;

		do {
			var log = Math.random() > 0.98;

		    x = border + Math.floor( Math.random() * (resolution - border * 2) );
		    y = border + Math.floor( Math.random() * (resolution - border * 2) );

			if( empty ) {

				stillEmpty = true;

				for( ix = x - radius, ixl = x + radius; ix < ixl && stillEmpty; ix++ ) {

					dx = (x - ix) * (x - ix);

					for( iy = y - radius, iyl = y + radius; iy < iyl && stillEmpty; iy++ ) {

						dy = (y - iy) * (y - iy);

						if( dx + dy <= radius2 )
							stillEmpty = ! usedVertices[ Math.abs( ix % resolution ) ][ Math.abs( iy % resolution ) ];
					}
				}
			}
			else stillEmpty = false;

	    } while( --tries > 0 && empty && ! stillEmpty );

		if( tries == 0 ) {

			console.log( "ERROR: Terrain.selectTerrainRandomCoords: Not found" );
		}
		else if( empty ) {

			for( ix = x - radius, ixl = x + radius; ix < ixl && stillEmpty; ix++ ) {

				dx = x - ix;

				for( iy = y - radius, iyl = y + radius; iy < iyl && stillEmpty; iy++ )

					dy = y - iy;

					if( dx * dx + dy * dy <= radius2 )
						usedVertices[ Math.abs( ix % resolution ) ][ Math.abs( iy % resolution ) ] = true;
			}
		}

		this.randomX = x;
		this.randomY = y;
    }
};
/**
 * Created by JetBrains WebStorm.
 * User: C4RL05
 * Date: 06/08/2011
 * Time: 19:45
 * To change this template use File | Settings | File Templates.
 */

LIGHTS.TerrainDisplacement = function( terrain ) {

	this.initialize( terrain );
};

LIGHTS.TerrainDisplacement.prototype = {

    // _______________________________________________________________________________________ Group

    active:         false,

    // _______________________________________________________________________________________ Constructor

	initialize: function( terrain ) {

		this.terrain = terrain;
        this.terrainPlane = terrain.terrainPlane;
		this.spectrum = null;

		// Flat2Terrain
		this.velocities = [];

		var xl = this.terrainPlane.resolution,
			x;

		for( x = 0; x < xl; x++ )
			this.velocities[ x ] = [];
	},

    update: function() {

	    switch( LIGHTS.Music.phase.index ) {

			case 15:
			case 21:
		        this.updateSpectrum();
		        break;

			case 16:
			case 22:
		        this.updateFlat();
		        break;

			case 17:
		        this.updateTerrain();
		        break;
	    }
    },

	updateSpectrum: function() {

		var grid = this.terrainPlane.grid,
		    heightGrid = this.terrainPlane.heightGrid,
		    spectrum = this.spectrum,
			resolution = this.terrainPlane.resolution,
		    r2 = resolution / 2,
			x, xl, y, yl, gridX, heightGridX, dx2, dy2, i;

		for( x = 0, xl = resolution; x < xl; x++ ) {

			gridX = grid[ x ];
			heightGridX = heightGrid[ x ];
			dx2 = (x - r2) * (x - r2);

			for( y = 0, yl = resolution; y < yl; y++ ) {

				dy2 = (y - r2) * (y - r2);
				i = Math.floor( Math.sqrt( dx2 + dy2 ) );
				gridX[ y ].y = heightGridX[ y ] + spectrum[ i ];
			}
		}
//console.log( spectrum[ 0 ], spectrum[ 1 ], spectrum[ 2 ], spectrum[ 3 ] );
		this.terrainPlane.tileBorders();
		this.terrainPlane.computeFaceNormals();
		this.terrainPlane.computeVertexNormals();
    },

	updateTerrain: function() {

		var grid = this.terrainPlane.grid,
		    heightGrid = this.terrainPlane.heightGrid,
			resolution = this.terrainPlane.resolution,
			velocities = this.velocities,
			deltaTime = LIGHTS.deltaTime * 0.5,
			drag = 1 - LIGHTS.deltaTime * 5,
			x, xl, y, yl, gridX, gridXY, posY, heightGridX, velocity, velocityX;

		for( x = 0, xl = resolution; x < xl; x++ ) {

			gridX = grid[ x ];
			heightGridX = heightGrid[ x ];
			velocityX = velocities[ x ];

			for( y = 0, yl = resolution; y < yl; y++ ) {

				gridXY = gridX[ y ];
				posY = gridXY.y;
				velocityX[ y ] *= drag;
				velocityX[ y ] += (heightGridX[ y ] - posY) * (Math.abs( posY ) * deltaTime);
				gridXY.y += velocityX[ y ];

//				gridXY.y -= (gridXY.y - heightGridX[ y ]) * ease;
			}
		}

		this.terrainPlane.tileBorders();
		this.terrainPlane.computeFaceNormals();
		this.terrainPlane.computeVertexNormals();
    },

	updateFlat: function() {

		var grid = this.terrainPlane.grid,
			resolution = this.terrainPlane.resolution,
			ease = LIGHTS.deltaTime * 4,
			x, xl, y, yl, gridX, gridXY;

		for( x = 0, xl = resolution; x < xl; x++ ) {

			gridX = grid[ x ];

			for( y = 0, yl = resolution; y < yl; y++ ) {

				gridXY = gridX[ y ];
				gridXY.y -= gridXY.y * ease;
			}
		}

		this.terrainPlane.tileBorders();
		this.terrainPlane.computeFaceNormals();
		this.terrainPlane.computeVertexNormals();
    },

	launchFlat2Terrain: function() {

		var resolution = this.terrainPlane.resolution,
			heightGrid = this.terrainPlane.heightGrid,
			x, xl, y, yl;

		for( x = 0, xl = resolution; x < xl; x++ )
			for( y = 0, yl = resolution; y < yl; y++ )
//				this.velocities[ x ][ y ] = heightGrid[ x ][ y ] / 100;
				this.velocities[ x ][ y ] = 0;
	}
};

    // _______________________________________________________________________________________ Update
/*
	// update() on bump
	update_Bump: function() {

		this.active = (this.bumps.length > 0);

		if( this.active ) {

			for( var i = 0; i < this.bumps.length; i++ )
				this.updateBump( this.bumps[ i ] );

			this.terrainPlane.computeFaceNormals();
			this.terrainPlane.computeVertexNormals();
		}
	},

	createBump: function( h ) {

		this.terrain.selectTerrainRandomCoords( false );

		var x = this.terrain.randomX,
			y = this.terrain.randomY,
			r = 10;

//		console.log( this.terrainPlane.grid[ x ][ y ].y );

		if( this.terrainPlane.grid[ x ][ y ].y > 20 )
			h = -h;

		if( this.bumps === undefined )
			this.bumps = [];

		this.bumps.push( new LIGHTS.Bump( x, y, r, h ) );
	},

	updateBump: function( bump ) {

		var a = bump.a - (bump.a - 1) * LIGHTS.deltaTime;

		this.terrainPlane.displaceVertex( bump.x, bump.y, bump.r, bump.h * (a - bump.a) );
		bump.a = a;

		if( bump.a > 0.99 ) {

			this.bumps.splice( this.bumps.indexOf( bump ), 1 );
			delete bump;
		}
	}
};

LIGHTS.Bump = function( x, y, r, h ) {

	this.x = x;
	this.y = y;
	this.r = r;
	this.h = h;
	this.a = 0;
};
*/
/**
 * Created by JetBrains WebStorm.
 * User: C4RL05
 * Date: 26/07/2011
 * Time: 14:14
 * To change this template use File | Settings | File Templates.
 */

LIGHTS.TerrainMap = function( renderer ) {

	this.initialize( renderer );
};

LIGHTS.TerrainMap.size = 512;
LIGHTS.TerrainMap.uvOffset = 0.2;

LIGHTS.TerrainMap.prototype = {

	post:       true,
    opacity:    0.98,
    subtract:   0.005,

    // _______________________________________________________________________________________ Constructor

	initialize: function( renderer ) {

        this.renderer = renderer;

        var size = LIGHTS.TerrainMap.size,
	        sizeHalf = size / 2,
            postSize = size * (1 + 2 * LIGHTS.TerrainMap.uvOffset),
            postSizeHalf = postSize * 0.5,
            postTextureParams = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat },
            textureParams = { minFilter: THREE.LinearMipMapLinearFilter, magFilter: THREE.LinearMipMapLinearFilter, format: THREE.RGBFormat },
            screenShader, screenUniforms, screenFragmentShader, texturedUniforms, texturedFragmentShader, combinedUniforms, combinedMaterial, texturedQuad, planeGeometry;

        this.offset = size * LIGHTS.TerrainMap.uvOffset;
        this.viewRadius = postSizeHalf;

        this.camera = new THREE.Camera();
        this.camera.projectionMatrix = THREE.Matrix4.makeOrtho( -postSizeHalf, postSizeHalf, postSizeHalf, -postSizeHalf, -10000, 10000 ),
        this.camera.position.z = 100;

		this.scene = new THREE.Scene();
        this.postTexture = new THREE.WebGLRenderTarget( postSize, postSize, postTextureParams );

        // Postprocessing
        this.postCamera = new THREE.Camera();
        this.postCamera.projectionMatrix = THREE.Matrix4.makeOrtho( -sizeHalf, sizeHalf, sizeHalf, -sizeHalf, -10000, 10000 ),
        this.postCamera.position.z = 100;

        this.postScene = new THREE.Scene();
        this.glowScene = new THREE.Scene();

		// Textures
        this.texture = new THREE.WebGLRenderTarget( size, size, textureParams );
		this.combinedTexture = new THREE.WebGLRenderTarget( size, size, postTextureParams );
        this.canvasTexture = new THREE.WebGLRenderTarget( size, size, postTextureParams );

        // Screen Material
        screenShader = THREE.ShaderUtils.lib["screen"];
		screenUniforms = { tDiffuse: { type: "t", value: 0, texture: this.postTexture }	};

		screenFragmentShader = [

			"varying vec2 vUv;",
			"uniform sampler2D tDiffuse;",

			"void main() {",

				"gl_FragColor = texture2D( tDiffuse, vUv );",
			"}"

		].join("\n");

        this.screenMaterial = new THREE.MeshShaderMaterial( {

            uniforms: screenUniforms,
            vertexShader: screenShader.vertexShader,
            fragmentShader: screenFragmentShader,
            blending: THREE.AdditiveBlending,
            transparent: true
        } );

        // Textured Material
        texturedUniforms = {

            tDiffuse:   { type: "t", value: 0, texture: this.canvasTexture },
            opacity:    { type: "f", value: this.opacity },
            subtract:   { type: "f", value: this.subtract }
        };

        texturedFragmentShader = [

            "varying vec2 vUv;",
            "uniform sampler2D tDiffuse;",
            "uniform float opacity;",
            "uniform float subtract;",

            "void main() {",

                "vec4 texel = texture2D( tDiffuse, vUv );",
                "texel.r = min( texel.r - subtract, texel.r * opacity );",
                "texel.g = min( texel.g - subtract, texel.g * opacity );",
                "texel.b = min( texel.b - subtract, texel.b * opacity );",
                "gl_FragColor = texel;",
            "}"

        ].join("\n");

        this.texturedMaterial = new THREE.MeshShaderMaterial( {

            uniforms: texturedUniforms,
            vertexShader: screenShader.vertexShader,
            fragmentShader: texturedFragmentShader
        } );

		// Combined Material
        combinedUniforms = THREE.UniformsUtils.clone( screenUniforms );
        combinedUniforms["tDiffuse"].texture = this.combinedTexture;

		combinedMaterial = new THREE.MeshShaderMaterial( {

		    uniforms: combinedUniforms,
		    vertexShader: screenShader.vertexShader,
		    fragmentShader: screenFragmentShader
		} );

		// Quads
		planeGeometry = new THREE.PlaneGeometry( size, size );
        texturedQuad = new THREE.Mesh( planeGeometry, this.texturedMaterial );
        texturedQuad.position.z = -10;
        this.postScene.addObject( texturedQuad );

        // Tiled quads
        this.setupTiledQuad();

        // Combined
        this.combinedScene = new THREE.Scene();

		// Combined Quad
        this.combinedQuad = new THREE.Mesh( planeGeometry, combinedMaterial );
		this.combinedScene.addObject( this.combinedQuad );

		var canvasQuad = new THREE.Mesh( new THREE.PlaneGeometry( postSize, postSize ), new THREE.MeshBasicMaterial( { map: this.canvasTexture } ) );
		canvasQuad.z = -10;
		this.glowScene.addObject( canvasQuad );

		// Combined Black
		this.combinedColor = new THREE.Mesh( planeGeometry, new THREE.MeshBasicMaterial( { color: 0x000000 } ) );
		this.combinedColor.position.z = 10;
		this.combinedColor.visible = false;
		this.combinedScene.addObject( this.combinedColor );

        // Test
//        this.tests = [];
//        var colors = [ 0xFFFF00, 0x00FFFF, 0xFF00FF, 0xFF0000, 0x00FF00, 0x0000FF ];
//
//        for( var i = 0; i < colors.length; i++ ) {
//
//            var test = new THREE.Mesh( new THREE.SphereGeometry( 300, 10, 10 ), new THREE.MeshBasicMaterial( {wireframe: true, color: colors[ i ] } ) );
//            test.position.x = Math.random() * 200 - 100;
//            test.position.y = Math.random() * 200 - 100;
//            test.speed = 0.005 * Math.random();
//            this.scene.addChild( test );
//            this.tests.push( test );
//        }
    },

    // _______________________________________________________________________________________ Setup

	setupTiledQuad: function() {

		var s = LIGHTS.TerrainMap.size,
			v1 = s / 2,
			u0 = LIGHTS.TerrainMap.uvOffset,
			u1 = 1 - LIGHTS.TerrainMap.uvOffset,
			v0 = (0.5 - LIGHTS.TerrainMap.uvOffset) * v1,
			quad, combined;

		// Center
		combined = new THREE.PlaneGeometry( s, s );
		this.setQuadUVs( combined, u0, u0, u0, u1, u1, u1, u1, u0 );

		// Left
		quad = new THREE.PlaneGeometry( s, s );
		this.setQuadVertices( quad, v0, v1, v0, -v1, v1, -v1, v1, v1 );
		this.setQuadUVs( quad, 0, u0, 0, u1, u0, u1, u0, u0 );
		GeometryUtils.merge( combined, quad );

		// Right
		quad = new THREE.PlaneGeometry( s, s );
		this.setQuadVertices( quad, -v1, v1, -v1, -v1, -v0, -v1, -v0, v1 );
		this.setQuadUVs( quad, u1, u0, u1, u1, 1, u1, 1, u0 );
		GeometryUtils.merge( combined, quad );

		// Top
		quad = new THREE.PlaneGeometry( s, s );
		this.setQuadVertices( quad, -v1, v1, -v1, v0, v1, v0, v1, v1 );
		this.setQuadUVs( quad, u0, u1, u0, 1, u1, 1, u1, u1 );
		GeometryUtils.merge( combined, quad );

		// Bottom
		quad = new THREE.PlaneGeometry( s, s );
		this.setQuadVertices( quad, -v1, -v0, -v1, -v1, v1, -v1, v1, -v0 );
		this.setQuadUVs( quad, u0, 0, u0, u0, u1, u0, u1, 0 );
		GeometryUtils.merge( combined, quad );

		// Top Left
		quad = new THREE.PlaneGeometry( s, s );
		this.setQuadVertices( quad, v0, v1, v0, v0, v1, v0, v1, v1 );
		this.setQuadUVs( quad, 0, u1, 0, 1, u0, 1, u0, u1 );
		GeometryUtils.merge( combined, quad );

		// Top Right
		quad = new THREE.PlaneGeometry( s, s );
		this.setQuadVertices( quad, -v1, v1, -v1, v0, -v0, v0, -v0, v1 );
		this.setQuadUVs( quad, u1, u1, u1, 1, 1, 1, 1, u1 );
		GeometryUtils.merge( combined, quad );

		// Bottom Left
		quad = new THREE.PlaneGeometry( s, s );
		this.setQuadVertices( quad, v0, -v0, v0, -v1, v1, -v1, v1, -v0 );
		this.setQuadUVs( quad, 0, 0, 0, u0, u0, u0, u0, 0 );
		GeometryUtils.merge( combined, quad );

		// Bottom Right
		quad = new THREE.PlaneGeometry( s, s );
		this.setQuadVertices( quad, -v1, -v0, -v1, -v1, -v0, -v1, -v0, -v0 );
		this.setQuadUVs( quad, u1, 0, u1, u0, 1, u0, 1, 0 );
		GeometryUtils.merge( combined, quad );

		// Add to scene
        this.postScene.addObject( new THREE.Mesh( combined, this.screenMaterial ) );
	},
/*
    setupTiledQuads: function() {

        var v1 = LIGHTS.TerrainMap.size / 2,
            u0 = LIGHTS.TerrainMap.uvOffset,
            u1 = 1 - LIGHTS.TerrainMap.uvOffset,
            v0 = (0.5 - LIGHTS.TerrainMap.uvOffset) * v1,
            quad;

        // Center
        quad = this.createQuad();
        this.setQuadUVs( quad, u0, u0, u0, u1, u1, u1, u1, u0 );

        // Left
        quad = this.createQuad();
        this.setQuadVertices( quad, v0, v1, v0, -v1, v1, -v1, v1, v1 );
        this.setQuadUVs( quad, 0, u0, 0, u1, u0, u1, u0, u0 );

        // Right
        quad = this.createQuad();
        this.setQuadVertices( quad, -v1, v1, -v1, -v1, -v0, -v1, -v0, v1 );
        this.setQuadUVs( quad, u1, u0, u1, u1, 1, u1, 1, u0 );

        // Top
        quad = this.createQuad();
        this.setQuadVertices( quad, -v1, v1, -v1, v0, v1, v0, v1, v1 );
        this.setQuadUVs( quad, u0, u1, u0, 1, u1, 1, u1, u1 );

        // Bottom
        quad = this.createQuad();
        this.setQuadVertices( quad, -v1, -v0, -v1, -v1, v1, -v1, v1, -v0 );
        this.setQuadUVs( quad, u0, 0, u0, u0, u1, u0, u1, 0 );

        // Top Left
        quad = this.createQuad();
        this.setQuadVertices( quad, v0, v1, v0, v0, v1, v0, v1, v1 );
        this.setQuadUVs( quad, 0, u1, 0, 1, u0, 1, u0, u1 );

        // Top Right
        quad = this.createQuad();
        this.setQuadVertices( quad, -v1, v1, -v1, v0, -v0, v0, -v0, v1 );
        this.setQuadUVs( quad, u1, u1, u1, 1, 1, 1, 1, u1 );

        // Bottom Left
        quad = this.createQuad();
        this.setQuadVertices( quad, v0, -v0, v0, -v1, v1, -v1, v1, -v0 );
        this.setQuadUVs( quad, 0, 0, 0, u0, u0, u0, u0, 0 );

        // Bottom Right
        quad = this.createQuad();
        this.setQuadVertices( quad, -v1, -v0, -v1, -v1, -v0, -v1, -v0, -v0 );
        this.setQuadUVs( quad, u1, 0, u1, u0, 1, u0, 1, 0 );
    },

    createQuad: function() {

        var screenQuad = new THREE.Mesh( new THREE.PlaneGeometry( LIGHTS.TerrainMap.size, LIGHTS.TerrainMap.size ), this.screenMaterial );
        this.postScene.addObject( screenQuad );

        return screenQuad;
    },
*/
    setQuadVertices: function( quad, x0, y0, x1, y1, x2, y2, x3, y3 ) {

        var geo = (quad instanceof THREE.Mesh)? quad.geometry : quad;
	        vertices = geo.vertices,
            face = geo.faces[0],
            a = vertices[ face.a ].position,
            b = vertices[ face.b ].position,
            c = vertices[ face.c ].position,
            d = vertices[ face.d ].position;

        a.x = x0;
        a.y = y0;
        b.x = x1;
        b.y = y1;
        c.x = x2;
        c.y = y2;
        d.x = x3;
        d.y = y3;
    },

    setQuadUVs: function( quad, u0, v0, u1, v1, u2, v2, u3, v3 ) {

	    var geo = (quad instanceof THREE.Mesh)? quad.geometry : quad;
		    uvs = geo.faceVertexUvs[ 0 ][ 0 ];

        uvs[ 0 ].u = u0;
        uvs[ 0 ].v = v0;
        uvs[ 1 ].u = u1;
        uvs[ 1 ].v = v1;
        uvs[ 2 ].u = u2;
        uvs[ 2 ].v = v2;
        uvs[ 3 ].u = u3;
        uvs[ 3 ].v = v3;
    },

   // _______________________________________________________________________________________ Update

    update: function() {

	    if( this.post ) {

	        // Render scene
	        this.renderer.render( this.scene, this.camera, this.postTexture, true );

			// Postprocessing
	        this.texturedMaterial.uniforms.opacity.value = this.opacity;
	        this.texturedMaterial.uniforms.subtract.value = this.subtract;
			this.renderer.render( this.postScene, this.postCamera, this.combinedTexture, true );

			// Render canvas
			this.renderer.render( this.combinedScene, this.postCamera, this.canvasTexture, true );

			// Render glows
		    this.renderer.render( this.glowScene, this.camera, this.texture, true );
	    }
	    else {

	        // Render scene
		    this.renderer.render( this.scene, this.camera, this.texture, true );
	    }
    },

    clear: function( color ) {

	    if( color === undefined ) color = 0x000000;

	    this.combinedColor.materials[ 0 ].color.setHex( color );
	    this.combinedColor.visible = true;
	    this.combinedQuad.visible = false;

        this.renderer.render( this.combinedScene, this.postCamera, this.canvasTexture, true );

	    this.combinedColor.visible = false;
	    this.combinedQuad.visible = true;
    }
};

/**
 * @author mr.doob / http://mrdoob.com/
 * based on http://papervision3d.googlecode.com/svn/trunk/as3/trunk/src/org/papervision3d/objects/primitives/Plane.as
 */

LIGHTS.TerrainPlane = function( size, resolution, height, image ) {

	THREE.Geometry.call( this );

	this.resolution = resolution;
	this.segmentSize = size / resolution;

    var ix, iy, x, y,
    sizeHalf = size / 2,
    resolution1 = resolution + 1,
    segmentSize = this.segmentSize,
    vertex, vertexPosition, a, b, c, d, heightMap;

    heightMap = createHeightMap( resolution, height, image );

    this.grid = [];
    this.vertexGrid = [];
	this.uvGrid = [];
	this.indexGrid = [];
	this.heightGrid = [];

    // Vertices
    for( ix = 0; ix <= resolution; ix++ ) {

        x = ix * segmentSize - sizeHalf;
        this.grid[ ix ] = [];
        this.vertexGrid[ ix ] = [];
	    this.indexGrid[ ix ] = [];
	    this.heightGrid[ ix ] = [];

        for( iy = 0; iy <= resolution; iy++ ) {

            y = iy * segmentSize - sizeHalf;
            vertexPosition = new THREE.Vector3( x, heightMap[ ix ][ iy ], y );
            vertex = new THREE.Vertex( vertexPosition );

            this.grid[ ix ][ iy ] = vertexPosition;
            this.vertexGrid[ ix ][ iy ] = vertex;
            this.indexGrid[ ix ][ iy ] = this.vertices.length;
	        this.heightGrid[ ix ][ iy ] = vertexPosition.y;

	        this.vertices.push( vertex );
		}
	}

	// UVs
	for( ix = 0; ix <= resolution; ix++ ) {

		this.uvGrid[ ix ] = [];

	    for( iy = 0; iy <= resolution; iy++ )
			this.uvGrid[ ix ][ iy ] = new THREE.UV( iy / resolution, ix / resolution );
	}

    // Faces
    for( ix = 0; ix < resolution; ix++ ) {

        for( iy = 0; iy < resolution; iy++ ) {

			a = ix + resolution1 * iy;
            b = ( ix + 1 ) + resolution1 * iy;
			c = ( ix + 1 ) + resolution1 * ( iy + 1 );
            d = ix + resolution1 * ( iy + 1 );

			this.faces.push( new THREE.Face4( a, b, c, d ) );
			this.faceVertexUvs[ 0 ].push( [
				this.uvGrid[ ix     ][ iy     ],
				this.uvGrid[ ix + 1 ][ iy     ],
				this.uvGrid[ ix + 1 ][ iy + 1 ],
				this.uvGrid[ ix     ][ iy + 1 ]
            ] );
		}
	}

	this.computeCentroids();
	this.computeFaceNormals();
    this.computeVertexNormals();

    this.vertexNormals = THREE.MeshUtils.getVertexNormals( this );

    // _______________________________________________________________________________________ Create Height Maps

    function createHeightMap( resolution, height, image ) {

        // ImageData
        var heightMap = [],
            imageCanvas = document.createElement( 'canvas' ),
            imageContext = imageCanvas.getContext( '2d' ),
            imageData, x, y, ix, iy, blurRadius, blurBuffer, blurAcc, bx, by;

        imageContext.drawImage( image, 0, 0 );
        imageData = imageContext.getImageData( 0, 0, resolution, resolution ).data;

        // Height map
        for( x = 0; x <= resolution; x++ )
            heightMap[ x ] = [];

        // Interior
        for( x = 0; x <= resolution; x++ ) {

            ix = (x < resolution)? x : 0;

            for( y = 0; y <= resolution; y++ ) {

                iy = (y < resolution)? y : 0;
                heightMap[ x ][ y ] = imageData[ (ix + iy * resolution) * 4 ];
            }
        }

        // Blur
        blurRadius = 2;
        blurBuffer = [];

        for( x = 0; x <= resolution; x++ )
            blurBuffer[ x ] = heightMap[ x ].slice( 0 );

        for( x = 0; x <= resolution; x++ ) {

            for( y = 0; y <= resolution; y++ ) {

                blurAcc = 0;

                for( by = -blurRadius; by <= blurRadius; by++ ) {

                    for( bx = -blurRadius; bx <= blurRadius; bx++ ) {

                        ix = x + bx;
                        iy = y + by;

                        if( ix < 0 )
                            ix += resolution;
                        else if( ix > resolution )
                            ix -= resolution;

                        if( iy < 0 )
                            iy += resolution;
                        else if( iy > resolution )
                            iy -= resolution;

                        blurAcc += blurBuffer[ ix ][ iy ];
                    }
                }

                heightMap[ x ][ y ] = blurAcc / ((blurRadius * 2 + 1) * (blurRadius * 2 + 1));
            }
        }

        // Scale
        for( x = 0; x <= resolution; x++ )
            for( y = 0; y <= resolution; y++ )
                heightMap[ x ][ y ] = height * ((heightMap[ x ][ y ] - 128) / 255);

        return heightMap;
    }
};

LIGHTS.TerrainPlane.prototype = new THREE.Geometry();
LIGHTS.TerrainPlane.prototype.constructor = LIGHTS.TerrainPlane;

// _______________________________________________________________________________________ Public

LIGHTS.TerrainPlane.prototype.displaceVertex = function( x, y, radius, height ) {

	var radius2 = radius * radius,
		diameter = radius * 2,
		resolution = this.resolution,
		grid = this.grid,
		ix, iy, dx2, dy2, gx, gy, gridX, gridX0, h;

	// Vertices
	for( ix = 0; ix < diameter; ix++ ) {

		dx2 = (ix - radius) * (ix - radius);
		gx = (resolution + x + ix - radius) % resolution;
		gridX = grid[ gx ];

		for( iy = 0; iy < diameter; iy++ ) {

			dy2 = (iy - radius) * (iy - radius);
			gy = (resolution + y + iy - radius) % resolution;
			h = Math.max( 0, 1 - ((dx2 + dy2) / radius2) );

			if( h > 0 )
				gridX[ gy ].y += height * (Math.sin( rad180 * h - rad90 ) + 1) * 0.5;
		}
	}

	// Fix tiled border
	gridX = grid[ resolution ];
	gridX0 = grid[ 0 ];

	for( iy = 0; iy <= resolution; iy++ )
		gridX[ iy ].y = gridX0[ iy ].y;

	for( ix = 0; ix < resolution; ix++ )
		grid[ ix ][ resolution ].y = grid[ ix ][ 0 ].y;

	// Dirty
	this.__dirtyVertices = true;
};

LIGHTS.TerrainPlane.prototype.tileBorders = function() {

	var resolution = this.resolution,
		grid = this.grid,
		ix, iy, dx2, dy2, gx, gy, gridX, gridX0, h;

	// Fix tiled border
	gridX = grid[ resolution ];
	gridX0 = grid[ 0 ];

	for( iy = 0; iy <= resolution; iy++ )
		gridX[ iy ].y = gridX0[ iy ].y;

	for( ix = 0; ix < resolution; ix++ )
		grid[ ix ][ resolution ].y = grid[ ix ][ 0 ].y;

	// Dirty
	this.__dirtyVertices = true;
};

LIGHTS.TerrainPlane.prototype.resetVertices = function() {

	for( x = 0; x <= this.resolution; x++ )
	    for( y = 0; y <= this.resolution; y++ )
		    this.grid[ x ][ y ].y = this.heightGrid[ x ][ y ];

	// Dirty
	this.__dirtyVertices = true;

	this.computeCentroids();
	this.computeFaceNormals();
    this.computeVertexNormals();
};
/**
 * Created by JetBrains WebStorm.
 * User: C4RL05
 * Date: 01/08/2011
 * Time: 09:37
 * To change this template use File | Settings | File Templates.
 */

LIGHTS.TileManager = function( director ) {

	this.initialize( director );
};

LIGHTS.TileManager.prototype = {

	estimatedTileCount: 16,

    // _______________________________________________________________________________________ Vars

    containers:         [],
    containerTable:     {},
    containerPool:      [],

    managers:           [],

    // _______________________________________________________________________________________ Setup

	initialize: function( director ) {

        this.director = director;
        this.terrain = director.terrain;
        this.scene = director.view.scene;

        // Stars
        this.stars = new LIGHTS.StarManager( director );
        this.managers.push( this.stars );

        // TerrainDots
        this.terrainDots = new LIGHTS.TerrainDotsManager( director );
        this.managers.push( this.terrainDots );

        // TerrainMesh
        this.terrainMesh = new LIGHTS.TerrainMeshManager( director );
        this.managers.push( this.terrainMesh );

        // Balls
        this.balls = new LIGHTS.BallsManager( director );
        this.managers.push( this.balls );

        // Cannons
        this.cannons = new LIGHTS.CannonManager( director );
        this.managers.push( this.cannons );

        // Tubes
//        this.tubes = new LIGHTS.TubeManager( director, this.terrainMesh.terrainMap.texture );
//        this.managers.push( this.tubes );

		// Containers
		for( var i = 0; i < this.estimatedTileCount; i++ )
			this.containerPool.push( this.createTileContainer() );

		this.ready = false;
	},

    createTileContainer: function() {

        var container = new THREE.Object3D();
        this.containers.push( container );

	    var tiles = [];

	    container.balls = new LIGHTS.BallsTile( this.balls, container );
	    tiles.push( container.balls );

	    container.stars = new LIGHTS.StarTile( this.stars, container );
	    tiles.push( container.stars );

        tiles.push( new LIGHTS.TerrainDotsTile( this.terrainDots ) );
        tiles.push( new LIGHTS.TerrainMeshTile( this.terrainMesh ) );
        tiles.push( new LIGHTS.CannonsTile( this.cannons ) );
//        tiles.push( new LIGHTS.TubesTile( this.tubes ) );
	    container.tiles = tiles;

	    this.scene.addChild( container );

        return container;
    },

    // _______________________________________________________________________________________ Public

    update: function() {

        var managers = this.managers,
	        container, containerId, manager, i, il,
            removed = 0, added = 0, terrainCount = 0, containerCount = 0;

        // Remove containers
        for( containerId in this.containerTable ) {

            if( this.terrain.tileIdSet[ containerId ] != true ) {

                container = this.containerTable[ containerId ];
                delete this.containerTable[ containerId ];

                this.containerPool.push( container );
                THREE.SceneUtils.showHierarchy( container, false );
	            container.visible = false;
                removed++;
            }
            else containerCount++;
        }

        // Add containers
        for( containerId in this.terrain.tileIdSet ) {

            if( this.containerTable[ containerId ] === undefined ) {

                if( this.containerPool.length > 0 ) {

	                container = this.containerPool.pop();
	                container.visible = true;
                }
                else {

	                container = this.createTileContainer();
	                console.log( "createTileContainer", this.containers.length );
                }

                this.terrain.selectTileById( containerId );
                container.position.copy( this.terrain.selectedTile.position );
	            this.updateTiles( container );

                this.containerTable[ containerId ] = container;
                added++;
                containerCount++;
            }
            terrainCount++;
        }

//        if( removed > 0 || added > 0 )
//            console.log( "removed:" + removed + " added:" + added + " terrain:" + terrainCount + " container:" + containerCount );

        // Update
        for( i = 0, il = managers.length; i < il; i++ ) {

	        manager = this.managers[ i ];

	        if( manager.active )
	        	console.log("updating managers: " + i);
		        manager.update();
        }
    },

    apply: function() {

        for( var i in this.containerTable )
            this.updateTiles( this.containerTable[ i ] );
    },

    // _______________________________________________________________________________________ Private

    updateTiles: function( container ) {

        var i, j, tile, active, child;

        for( i = 0; i < container.tiles.length; i++ ) {

            tile = container.tiles[ i ];
            active = tile.manager.active;

            for( j = 0; j < tile.children.length; j++ ) {

                child = tile.children[ j ];

	            if( child.interactive ) {

		            if( active && child.active ) {

//			            child.visible = true;

		                if( child.parent !== container )
		                    THREE.MeshUtils.addChild( this.scene, container, child );
		            }
		            else {

//			            child.visible = false;
		                if( child.parent === container )
		                    THREE.MeshUtils.removeChild( this.scene, container, child );
		            }
	            }
	            else {

		            if( active ) {

//		                if( child.parent !== container )
//		                    console.log( child.name );

		                if( child.parent !== container )
		                    THREE.MeshUtils.addChild( this.scene, container, child );

			            child.visible = true;
		            }
		            else {

		                if( child.parent === container )
		                    THREE.MeshUtils.removeChild( this.scene, container, child );

			            child.visible = false;
		            }
	            }
            }
        }

	    container.balls.updateTile();
	    container.stars.updateTile();
    }
};
/**
 * Created by JetBrains WebStorm.
 * User: C4RL05
 * Date: 06/08/2011
 * Time: 10:01
 * To change this template use File | Settings | File Templates.
 */

// ___________________________________________________________________________________________ TileBall

LIGHTS.Ball = function( manager, container, index, groupIndex ) {

	this.initialize( manager, container, index, groupIndex );
};

LIGHTS.Ball.prototype = {

	testMode:               false,

	groupSelectAdd:         [ [ 0, 0, 1 ], [ 0, 1, 0 ], [ 0, 0, 1 ], [ 1, 0, 0 ], [ 1, 0, 0 ], [ 0, 1, 0 ] ],
	selectAddIntensity:     0.7,

	// _______________________________________________________________________________________ Constructor

	initialize: function( manager, container, index, groupIndex ) {

		this.manager = manager;
		this.container = container;

		// Behaviour
		this.behaviour = manager.behaviours[ index ];
		this.behaviour.balls.push( this );

		// Ball
		this.geometries = manager.geometries,
		this.terrainDisplacement = manager.director.terrain.displacement;
		this.scene = manager.director.view.scene;
		this.children = [];
		this.visible = false;
		this.state = 0;
		this.interactive = false;
		this.selected = false;
		this.unselected = false;
		this.mouseOver = false;
		this.selectGrow = false;
		this.selectMultiply = false;
		this.selectAdditive = false;
		this.selectedPhase = 0;
		this.alpha = 0;

		this.ballSize = LIGHTS.BallGeometries.prototype.ballSize;
		this.ballOffset = LIGHTS.BallGeometries.prototype.ballSize * 0.86;
		this.stemLength = LIGHTS.BallGeometries.prototype.stemLength;

		var	geometries = this.geometries,
			colorIndex = this.behaviour.colorIndex,
			i, mesh, geometry;

		// Spheres
		this.colorIndex = colorIndex;
		geometry = geometries.sphereGeometries[ colorIndex ];
		this.sphereGeometry = geometry;
		this.sphereMaterial = geometries.createSphereMaterial( groupIndex );
		this.addR = this.sphereMaterial.addR;
		this.addG = this.sphereMaterial.addG;
		this.addB = this.sphereMaterial.addB;
		mesh = new THREE.Mesh( geometry, this.sphereMaterial );
//		mesh.dynamic = true;
		mesh.useQuaternion = true;
		mesh.interactive = true;
		mesh.active = false;
		this.ball = mesh;
		this.children.push( mesh );

		this.selectAddR = this.groupSelectAdd[ colorIndex ][ 0 ] * this.selectAddIntensity;
		this.selectAddG = this.groupSelectAdd[ colorIndex ][ 1 ] * this.selectAddIntensity;
		this.selectAddB = this.groupSelectAdd[ colorIndex ][ 2 ] * this.selectAddIntensity;
		this.selectAdd = 0;

		// REMOVE
		// REMOVE
		// REMOVE
		// REMOVE
		// REMOVE
		// REMOVE
		// REMOVE
		// Stem
//		mesh = new THREE.Mesh( geometries.stemGeometry, geometries.stemMaterial );
//		mesh.useQuaternion = true;
//		mesh.interactive = true;
//		mesh.active = false;
//		this.stem = mesh;
//		this.children.push( mesh );

		// Balloon
		geometry = geometries.balloonGeometries[ colorIndex ];
		mesh = new THREE.Mesh( geometry, this.sphereMaterial );
		mesh.useQuaternion = true;
		mesh.interactive = true;
		mesh.active = false;
		this.balloon = mesh;
		this.children.push( mesh );

		// Rotation
		this.rotation = new THREE.Quaternion();
		this.rotation.setFromEuler( new THREE.Vector3( 0, 0, 5 ) );

		// Scale
		this.scale = this.behaviour.scale;
		this.grow = this.growTarget = 0;

		// Colliders
		this.colliderRoot = new THREE.SphereCollider( new THREE.Vector3(), 0 );
		this.colliderRoot.mesh = this.ball;
		this.colliderRoot.ball = this;
		manager.mouseOverCollisions.colliders.push( this.colliderRoot );

		this.colliderBall = new THREE.SphereCollider( new THREE.Vector3(), 0 );
		this.colliderBall.mesh = this.ball;
		this.colliderBall.ball = this;
		manager.mouseOverCollisions.colliders.push( this.colliderBall );

		this.colliderBall.other = this.colliderRoot;
		this.colliderRoot.other = this.colliderBall;
		this.colliderBall.enabled = true;

		this.colliderClick = new THREE.SphereCollider( new THREE.Vector3(), 0 );
		this.colliderClick.mesh = this.balloon;
		this.colliderClick.ball = this;
		manager.clickCollisions.colliders.push( this.colliderClick );

		// State
		this.setState( this.state );

		if( this.testMode ) {

			this.trident = new THREE.Trident();
			this.trident.scale.x = this.trident.scale.y = this.trident.scale.z = 0.4;
			manager.director.view.scene.addChild( this.trident );
		}

//		this.colliderHelper = new THREE.Mesh( new THREE.SphereGeometry( 16, 10, 10 ), new THREE.MeshBasicMaterial( { wireframe: true, color:0xff0000, depthTest: false}));
//		this.colliderHelper.position = this.colliderClick.center;
//		manager.director.view.scene.addChild( this.colliderHelper );
	},

    // _______________________________________________________________________________________ State

	setState: function( state ) {

		switch( state ) {

			case 0:
				this.interactive = this.selected = this.unselected = false;

				this.mouseOver = false;
				this.selectGrow = false;
				this.selectMultiply = false;
				this.selectAdditive = false;
				this.grow = this.growTarget = 0;

				this.ball.active = true;
				this.balloon.active = false;

				this.colliderRoot.enabled = false;
				break;

			case 1:
				this.ball.active = true;

				if( this.selected )
					this.unselect( true );

				this.colliderRoot.enabled = true;

				var ballScale = this.balloon.scale;
				ballScale.x = ballScale.y = ballScale.z = this.behaviour.scale;
				break;

			case 2:
//				this.ball.active = false;

//				this.stem.active = this.stem.visible = true;

//				if( this.stem.parent !== this.container )
//				    THREE.MeshUtils.addChild( this.scene, this.container, this.stem );

				this.balloon.active = this.balloon.visible = true;

				if( this.balloon.parent !== this.container )
				    THREE.MeshUtils.addChild( this.scene, this.container, this.balloon );

				this.colliderRoot.enabled = false;
				break;

			case 3:
				if( this.selected )
					this.unselect();

//				this.balloon.active = true;
				this.colliderRoot.enabled = false;
				break;

			case 4:
				if( this.selected )
					this.unselect();

//				this.balloon.active = true;
				this.colliderClick.radiusSq = this.colliderClick.radius = 0;
				break;
		}

		this.state = state;
	},

	select: function() {

		if( this.unselected && this.selectedPhase != LIGHTS.Music.phase.index )
			return;

		this.interactive = this.selected = true;
		this.unselected = false;

		this.selectedPhase = LIGHTS.Music.phase.index;
		this.scale = this.behaviour.scale;

		switch( LIGHTS.Music.phase.index ) {

		    case 1:
		    case 2:
				this.selected = false;
		        break;

			case 3:
			case 4:
			case 5:
			case 6:
			case 8:
				this.selectGrow = true;
				this.growTarget = 1;

				this.setRotation();
				this.setScale();
				this.selectAdditive = true;
				break;

			case 7:
				this.selectMultiply = true;
				this.behaviour.multiply = 1;
				break;

			case 9:
			case 10:
			case 11:
			case 12:
			case 13:
			case 14:
			case 15:
			case 17:
			case 18:
			case 19:
			case 20:
			case 21:
				if( this.state == 0 ) {

					this.selectGrow = true;
					this.growTarget = 1;

					this.setRotation();
					this.setScale();
				}
				else {

					this.selectGrow = false;
				}

				this.selectAdditive = true;
				break;
		}
	},

	unselect: function( force ) {

//		console.log( "unselect", force, this.selectedPhase, LIGHTS.Music.phase.index);

		this.unselected = true;

		switch( this.selectedPhase ) {

			case 3:
			case 4:
			case 5:
				if( force ) {

					this.interactive = this.unselected = this.selectAdditive = false;
					this.addR.value = this.selectAddR;
					this.addG.value = this.selectAddG;
					this.addB.value = this.selectAddB;
					this.selectAdd = 1;
				}

				this.selected = false;
				break;

			case 6:
				if( force )
					this.selected = false;
				else
					this.selected = (this.grow <= 0.99);
				break;

			case 7:
				if( force ) {
					this.interactive = this.unselected = this.selectMultiply = false;
					this.behaviour.multiply = 1;
					this.sphereMaterial.multiply.value = 1.0;
				}
				else {
					this.behaviour.multiply = 0;
				}

				this.selected = false;
				break;

			case 8:
			case 9:
			case 10:
			case 11:
			case 12:
			case 13:
			case 14:
			case 15:
			case 17:
			case 18:
			case 19:
			case 20:
			case 21:
				if( this.state == 0 ) {

					this.selected = force? false : (this.grow <= 0.99);
				}
				else if( force ) {

					this.interactive = this.unselected = this.selectAdditive = false;
					this.addR.value =
					this.addG.value =
					this.addB.value = 0;
					this.selectAdd = 0;
				}

				this.selected = false;
				break;
		}
	},

    // _______________________________________________________________________________________ Update

	update: function() {

		var deltaTime = LIGHTS.deltaTime,
			behaviour = this.behaviour,
			easing;

		// Visible
		if( this.visible && this.container.visible ) {

			this.ball.visible = this.ball.active;
			this.balloon.visible = this.balloon.active;
		}
		else {

			this.ball.visible =
			this.balloon.visible = false;
		}

		// Additive
		if( this.selectAdditive ) {

			if( this.selected ) {

				easing = deltaTime * 10;
				this.addR.value -= (this.addR.value - this.selectAddR) * easing;
				this.addG.value -= (this.addG.value - this.selectAddG) * easing;
				this.addB.value -= (this.addB.value - this.selectAddB) * easing;
				this.selectAdd -= (this.selectAdd - 1) * easing;
			}
			else if( this.unselected ) {

				easing = deltaTime * 10;
				this.addR.value -= this.addR.value * easing;
				this.addG.value -= this.addG.value * easing;
				this.addB.value -= this.addB.value * easing;
				this.selectAdd -= this.selectAdd * easing;

				if( this.selectAdd < 0.01 ) {

					this.addR.value =
					this.addG.value =
					this.addB.value = 0;
					this.selectAdd = 0;
					this.selectAdditive = false;

					if( ! this.selectGrow )
						 this.interactive = this.unselected = false;
				}
			}
		}

		// Spikes
//		var updateVertices = false;
//
//		if( this.selected && this.alpha < 0.99 ) {
//
//			this.alpha -= (this.alpha - 1) * deltaTime * 5;
//			updateVertices = true;
//		}
//		else if( this.alpha > 0 ) {
//
//			this.alpha -= (this.alpha - 0) * deltaTime * 10;
//
//			if( this.alpha < 0.01 )
//				this.alpha = 0;
//
//			updateVertices = true;
//		}
//
//		if( updateVertices )
//			this.geometries.tweenSphereSpikes( this.ball.geometry, this.alpha );

		// State
		switch( this.state ) {

			case 0:
				if( this.selectGrow ) {

					if( this.selected ) {

						// Grow
						this.grow -= (this.grow - 0.3) * deltaTime * 4;
						this.scale -= (this.scale - behaviour.rootScale * 1.5) * deltaTime * 4;

						if( this.grow > 0.29 && this.unselected )
							this.selected = false;
					}
					else if( this.unselected ) {

						// Grow
						this.grow -= (this.grow - 0) * deltaTime * 4;
						this.scale -= (this.scale - behaviour.scale) * deltaTime * 12;

						if( this.grow < 0.01 ) {

							this.interactive = this.unselected = this.selectGrow = false;
							this.scale = behaviour.scale;
						}
					}

					this.setPosition( this.grow * this.stemLength * this.scale );
					this.setScale();

					// Displacement
//					if( this.terrainDisplacement.active )
//						this.setRotation();
				}
				else if( this.selectMultiply ) {

					if( this.selected ) {

						if( this.sphereMaterial.multiply.value < 1 ) {

							this.sphereMaterial.multiply.value -= (this.sphereMaterial.multiply.value - 1) * deltaTime * 10;

							if( this.sphereMaterial.multiply.value > 0.99 )
								this.sphereMaterial.multiply.value = 1;
						}
					}
					else if( this.unselected ) {

						this.sphereMaterial.multiply.value -= (this.sphereMaterial.multiply.value - 0) * deltaTime * 10;

						if( this.sphereMaterial.multiply.value < 0.01 ) {

							this.sphereMaterial.multiply.value = 0;
							this.interactive = this.unselected = this.selectMultiply = false;
						}
					}
				}
				break;

			case 1:

				if( this.selectGrow ) {

					this.grow -= (this.grow - behaviour.grow) * deltaTime * 4;
					this.scale -= (this.scale - behaviour.scale) * deltaTime * 8;

					if( Math.abs( this.grow - behaviour.grow ) < 0.01 ) {

						this.interactive = this.unselected = this.selectGrow = false;
						this.grow = behaviour.grow;
						this.scale = behaviour.scale;
					}

					this.setPosition( this.grow * this.stemLength * this.scale );
					this.setScale();
				}
				break;

			case 2:
				// Grow
//				if( this.ball.parent !== null && this.ball.parent !== undefined ) {
//
//					if( behaviour.scale == 0.01 ) {
//
//						this.ball.active = this.ball.visible = false;
//
//						if( this.ball.parent === this.container )
//							THREE.MeshUtils.removeChild( this.scene, this.container, this.ball );
//					}
//				}

				// Launch ball
				if( this.balloon.active ) {

					this.balloon.position.copy( behaviour.ballPosition );
					this.ball.position.copy( behaviour.ballPosition );
					this.balloon.quaternion.multiplySelf( this.rotation );
				}
				break;

			case 3:
				this.sphereMaterial.multiply.value -= this.sphereMaterial.multiply.value * deltaTime * 2;

				if( this.sphereMaterial.multiply.value < 0.01 ) {

					this.balloon.active = this.balloon.visible = false;

					if( this.balloon.parent === this.container )
						THREE.MeshUtils.removeChild( this.scene, this.container, this.balloon );

					this.colliderClick.radiusSq = this.colliderClick.radius = 0;
				}
				break;

			case 4:
				var ballScale = this.balloon.scale;
				ballScale.x = Math.max( 0.001, ballScale.x - deltaTime * 8 );
				ballScale.y = ballScale.z = ballScale.x;
				break;
		}

		// Colliders
		var root = behaviour.root,
			scale = Math.max( this.scale, behaviour.scale );

		this.colliderRoot.center.x = root.x + this.container.position.x;
		this.colliderRoot.center.y = root.y + this.container.position.y;
		this.colliderRoot.center.z = root.z + this.container.position.z;

		this.colliderBall.center.x = this.ball.position.x + this.container.position.x;
		this.colliderBall.center.y = this.ball.position.y + this.container.position.y;
		this.colliderBall.center.z = this.ball.position.z + this.container.position.z;

		this.colliderRoot.radius = this.colliderBall.radius = scale * this.ballSize * phi * 2;
		this.colliderRoot.radiusSq = this.colliderBall.radiusSq = this.colliderBall.radius * this.colliderBall.radius;

		if( this.state < 2 ) {

			this.colliderClick.center.x = this.colliderBall.center.x;
			this.colliderClick.center.y = this.colliderBall.center.y;
			this.colliderClick.center.z = this.colliderBall.center.z;

			this.colliderClick.radius = scale * this.ballSize;
			this.colliderClick.radiusSq = this.colliderClick.radius * this.colliderClick.radius;
		}
		else {

			this.colliderClick.center.x = this.balloon.position.x + this.container.position.x;
			this.colliderClick.center.y = this.balloon.position.y + this.container.position.y;
			this.colliderClick.center.z = this.balloon.position.z + this.container.position.z;
		}

//		this.colliderHelper.scale.x = this.colliderHelper.scale.y = this.colliderHelper.scale.z = scale;

		// Test mode
		if( this.testMode ) {

			this.trident.position.add( this.ball.position, this.container.position );

			if( this.selected ) {

				this.trident.rotation.x = -rad90;
				this.trident.rotation.z = 0;
			}
			else if( this.unselected ) {

				this.trident.rotation.x = 0;
				this.trident.rotation.z = rad90;
			}
			else {

				this.trident.rotation.x = 0;
				this.trident.rotation.z = 0;
			}
		}
	},

	removeSphere: function() {

		this.ball.active = this.ball.visible = false;

		if( this.ball.parent === this.container )
			THREE.MeshUtils.removeChild( this.scene, this.container, this.ball );
	},


    // _______________________________________________________________________________________ Transform

	setPosition: function( scaleMult ) {

		var root = this.behaviour.root,
			normal = this.behaviour.normal,
			pX, pY, pZ, pos;

		pX = root.x + normal.x * scaleMult;
		pY = root.y + normal.y * scaleMult;
		pZ = root.z + normal.z * scaleMult;

		pos = this.ball.position;
		pos.x = pX;
		pos.y = pY;
		pos.z = pZ;

		if( this.balloon.active ) {

			pos = this.balloon.position;
			pos.x = pX;
			pos.y = pY;
			pos.z = pZ;
		}
	},

	setRotation: function() {

		var behaviour = this.behaviour,
			from = behaviour.up,
			to = behaviour.normal,
			q = behaviour.q,
			h = behaviour.h;

        h.add( from, to );
        h.normalize();

		q.w = from.dot( h );
        q.x = from.y * h.z - from.z * h.y;
        q.y = from.z * h.x - from.x * h.z;
        q.z = from.x * h.y - from.y * h.x;

		this.ball.quaternion.copy( q );

		if( this.balloon.active )
			this.balloon.quaternion.copy( q );
	},

	setScale: function() {

		var scale = this.scale,
			objectScale = this.ball.scale;

		objectScale.x =	objectScale.y =	objectScale.z = scale;

		if( this.balloon.active ) {

			objectScale = this.balloon.scale;
			objectScale.x =	objectScale.y = objectScale.z = scale;
		}
	}
};

/**
 * Created by JetBrains WebStorm.
 * User: Apple
 * Date: 04/09/2011
 * Time: 14:03
 * To change this template use File | Settings | File Templates.
 */

LIGHTS.BallBehaviour = function( manager, index ) {

	this.initialize( manager, index );
};

LIGHTS.BallBehaviour.prototype = {

	ballFat:                0.5,

	up:                     new THREE.Vector3( 0, 1, 0 ),
	h:                      new THREE.Vector3(),
	q:                      new THREE.Quaternion(),

	initialize: function( manager, index ) {

		this.index = index;
		this.groupIndex = index % 2;

		var terrain = manager.director.terrain;

		this.root = terrain.randomVertex.position;
		this.normal = terrain.randomNormal;
		this.terrainDisplacement = terrain.displacement;

		this.state = 0;
//		this.visible = true;
		this.visible = false;

		this.position = new THREE.Vector3();
		this.ballPosition = new THREE.Vector3();

		this.scale = this.rootScale = Math.random() * 0.5 + 0.25;
		this.scaleDown = 0;//-this.ballOffset * this.rootScale;

		this.fatActive = false;
		this.fat = this.fatTarget = 0;
		this.fatEase = Math.random() * 12 + 4;

		this.grow = this.growTarget = 0;

		this.stemLength = LIGHTS.BallGeometries.prototype.stemLength;
		this.colorIndex = this.groupIndex * 3 + Math.floor( Math.random() * 3 );

		if( LIGHTS.BallGeometries.prototype.groupBehaviours[ this.groupIndex ] === undefined )
			LIGHTS.BallGeometries.prototype.groupBehaviours[ this.groupIndex ] = this;

		this.additive = 0;
		this.multyiply = 0;
		this.balls = [];
	},

    // _______________________________________________________________________________________ State

	setState: function( state ) {

		var balls = this.balls,
			i, il;

		for( i = 0, il = balls.length; i < il; i++ )
			balls[ i ].setState( state );

		switch( state ) {

			case 0:
				this.fatActive = false;
				this.growActive = false;
				this.fat = this.fatTarget = 0;
				this.grow = this.growTarget = 0;
				this.additive = 1;

				this.scale = this.rootScale;
				this.setPosition( this.scaleDown );
				this.setRotation();
				this.setScale();
				break;

			case 1:
				this.growActive = true;
				this.growTarget = 1;
				this.setRotation();
				this.setScale();
				break;

			case 2:
				this.ballPosition.copy( this.position );
				this.height = this.position.y + Math.random() * 50 + 25;
				this.ease = Math.random() * 0.2 + 0.2;
				this.growTarget = 0;
				break;

			case 3:
			case 4:
				break;
		}

		this.state = state;
	},

    // _______________________________________________________________________________________ Update

	update: function() {

		var deltaTime = LIGHTS.deltaTime;

		var balls = this.balls,
			i, il, ball;

		for( i = 0, il = balls.length; i < il; i++ )
			console.log("updating balls: " + i);
			balls[ i ].update();

		// State
		switch( this.state ) {

			case 0:
				// Fat
				if( this.fatActive ) {

					this.fat -= (this.fat - this.fatTarget) * deltaTime * this.fatEase;

					if( this.fatTarget == 1 )
						this.fat = Math.min( this.fat, this.fatTarget );
					else if( this.fatTarget == 0 )
						this.fat = Math.max( this.fat, this.fatTarget );

					this.scale = this.rootScale * (1 + this.fat * this.ballFat);
					this.setScale();
				}

				// Displacement
				if( this.terrainDisplacement.active ) {

					this.setPosition( this.scaleDown );
					this.setRotation();
				}
				break;

			case 1:

				// Grow
				this.grow -= (this.grow - this.growTarget) * deltaTime * 2.5;

				if( this.growTarget == 1 )
					this.grow = Math.min( this.grow, this.growTarget );
				else if( this.growTarget == 0 )
					this.grow = Math.max( this.grow, this.growTarget );

				this.setPosition( this.grow * this.stemLength * this.scale );

				// Displacement
				if( this.terrainDisplacement.active )
					this.setRotation();
				break;

			case 2:
				// Grow
				this.scale -= this.scale * deltaTime * 8;

				if( this.scale < 0.05 )
					this.scale = 0.01;

				this.setScale();

//				this.setPosition( this.grow * this.stemLength * this.scale, true );

				// Launch ball
				this.ballPosition.y -= (this.position.y - this.height) * deltaTime * this.ease;
				break;

			case 3:
			case 4:
				break;
		}
	},

    // _______________________________________________________________________________________ Transform

	setPosition: function( scaleMult ) {

		var balls = this.balls,
			p = this.position,
			normal = this.normal,
			root = this.root,
			pX, pY, pZ, ball, pos, i, il;

		pX = p.x = root.x + normal.x * scaleMult;
		pY = p.y = root.y + normal.y * scaleMult;
		pZ = p.z = root.z + normal.z * scaleMult;

		for( i = 0, il = balls.length; i < il; i++ ) {

			ball = balls[ i ];

			if( ! ball.selectGrow ) {

				pos = ball.ball.position;
				pos.x = pX;
				pos.y = pY;
				pos.z = pZ;
			}
		}
	},

	setRotation: function() {

		var balls = this.balls,
			from = this.up,
			to = this.normal,
			q = this.q,
			h = this.h,
			i, il, ball;

        h.add( from, to );
        h.normalize();

		q.w = from.dot( h );
        q.x = from.y * h.z - from.z * h.y;
        q.y = from.z * h.x - from.x * h.z;
        q.z = from.x * h.y - from.y * h.x;

		for( i = 0, il = balls.length; i < il; i++ ) {

			ball = balls[ i ];

			ball.ball.quaternion.copy( q );
		}
	},

	setScale: function() {

		var balls = this.balls,
			scale = this.scale,
			i, il, ball, objectScale;

		for( i = 0, il = balls.length; i < il; i++ ) {

			ball = balls[ i ];

			if( ! ball.selectGrow ) {

				objectScale = ball.ball.scale;
				objectScale.x =	objectScale.y =	objectScale.z = scale;
			}
		}
	}
}

/**
 * Created by JetBrains WebStorm.
 * User: Apple
 * Date: 02/09/2011
 * Time: 17:49
 * To change this template use File | Settings | File Templates.
 */

LIGHTS.BallExplosions = function( manager, container, index, groupIndex ) {

	this.initialize( manager );
};

LIGHTS.BallExplosions.prototype = {

	explosionCount:     16,
	explosionPool:      [],
	explosions:         [],

	particleMaps:       [ 'plasmaRed', 'plasmaYellow', 'plasmaGreen', 'plasmaCyan', 'plasmaBlue', 'plasmaMagenta', 'plasmaWhite' ],
	ballColorTable:     [ [ 1, 0 ], [ 5, 0 ], [ 1, 2 ], [ 3, 2 ], [ 3, 4 ], [ 5, 4 ] ],


	// _______________________________________________________________________________________ Constructor

	initialize: function( manager ) {

		this.scene = manager.director.view.scene;

		var material, texture, i, il;

		// Materials
		this.materials = [];

		for( i = 0, il = this.particleMaps.length; i < il; i++ ) {

			texture = new THREE.Texture( LIGHTS.images[ this.particleMaps[ i ] ] );
			texture.needsUpdate = true;

			material = new THREE.ParticleBasicMaterial({
				vertexColors: true,
				size: 16,
				map: texture,
				blending: THREE.AdditiveBlending,
				transparent: true
			});

			this.materials.push( material );
		}

		// Explosions
		for( i = 0, il = this.explosionCount; i < il; i++ ) {

			explosion = new LIGHTS.BallExplosion( material );
			this.explosionPool.push( explosion );
			this.explosions.push( explosion );
		}
	},

	launchExplosion: function( ball ) {

		var explosion = this.explosionPool.pop();

		if( explosion !== undefined ) {

			THREE.MeshUtils.addChild( this.scene, this.scene, explosion.particleSystem );
			explosion.particleSystem.visible = true;

			var materialIndex = 6;

			if( LIGHTS.Music.phase.index > 2 )
				materialIndex = this.ballColorTable[ ball.colorIndex ][ Math.floor( Math.random() * 2 ) ];

			explosion.particleSystem.materials[ 0 ] = this.materials[ materialIndex ];
			explosion.launch( ball );
		}
	},

	update: function() {

		var explosions = this.explosions,
			i, il, explosion;

		// Update
		for( i = 0, il = explosions.length; i < il; i++ ) {

			explosion = explosions[ i ];
			console.log("updating explosions: " + i);
			if( explosion.active )
				explosion.update();
		}

		// Remove finished
		for( i = 0, il = explosions.length; i < il; i++ ) {

			explosion = explosions[ i ];

			if( explosion.active && explosion.life < 0 ) {

				explosion.particleSystem.visible = explosion.active = false;
				THREE.MeshUtils.removeChild( this.scene, this.scene, explosion.particleSystem );
				this.explosionPool.push( explosion );
			}
		}
	}
};

LIGHTS.BallExplosion = function( material ) {

	this.initialize( material );
};

LIGHTS.BallExplosion.prototype = {

	particleCount:      512,
	gravityStream:      -256,
	gravityExplosion:   0,

	// _______________________________________________________________________________________ Constructor

	initialize: function( material ) {

		var i, il, particle, colors;

		this.particleGeometry = new THREE.Geometry();
		this.particles = [];
		colors = this.particleGeometry.colors = [];

		for( i = 0, il = this.particleCount; i < il; i++ ) {

			particle = new THREE.Vector3();
			particle.x = Math.random() * 32 - 16;
			particle.y = Math.random() * 32 - 16;
			particle.z = Math.random() * 32 - 16;

			particle.velocity = new THREE.Vector3();
			particle.color = new THREE.Color( 0x000000 );

		    this.particles.push( particle );
		    this.particleGeometry.vertices.push( new THREE.Vertex( particle ) );
		    colors.push( particle.color );
		}

		this.particleSystem = new THREE.ParticleSystem( this.particleGeometry, material );
		this.particleSystem.sortParticles = false;
		this.particleSystem.dynamic = true;
		this.particleSystem.visible = false;
//		this.position = this.particleSystem.position;

		this.active = false;
	},

	launch: function( ball ) {

		this.ball = ball;

		if( ball.state > 3 )
			return;

		var particles = this.particles,
			colors = this.colors,
			isFlying = (ball.state >= 2),
			i, il, u, a, r, particle, color, velocity, speed, speedY;

		if( isFlying )
			ball.setState( 4 );

		for( i = 0, il = particles.length; i < il; i++ ) {

			particle = particles[ i ];

			if( isFlying ) {

				u = Math.random() * 2 - 1;
				speed = speedY = Math.random() * 96 + 64;
				particle.life = Math.random() * 0.2 + 0.2;
				particle.delay = Math.random() * 0.1 + 0.08;
			}
			else {

				u = Math.random() * 0.5 + 0.5;
				speedY = Math.random() * 256 + 128;
				speed = Math.random() * 64 + 64;
				particle.delay = Math.random() * 0.5;
			}

			a = Math.random() * rad360;
			r = Math.sqrt( 1 - u * u );

			velocity = particle.velocity;
			velocity.x = Math.cos( a ) * r * speed;
			velocity.y = u * speedY;
			velocity.z = Math.sin( a ) * r * speed;

			if( ! isFlying )
				ball.ball.quaternion.multiplyVector3( velocity );

			particle.drag = Math.random() * 0.01 + 0.005;
			particle.color.r = particle.color.g = particle.color.b = 0;
			particle.intensity = Math.random() * 0.3 + 0.7;
			particle.launch = false;
		}

		this.life = 2;
		this.active = true;
	},

	update: function() {

		var deltaTime = LIGHTS.deltaTime,
			particleGeometry = this.particleGeometry,
			particles = this.particles,
			ball = this.ball,
			isFlying = (ball.state >= 2),
			gravity = (isFlying? this.gravityExplosion : this.gravityStream) * deltaTime,
			ballPos = isFlying? ball.balloon.position : ball.ball.position,
			containerPos = ball.container.position,
			ballNormal = ball.behaviour.normal,
			ballRadius = isFlying? 0 : ball.scale * ball.ballSize - 2.5,
			pX = ballPos.x + containerPos.x + ballRadius * ballNormal.x,
			pY = ballPos.y + containerPos.y + ballRadius * ballNormal.y,
			pZ = ballPos.z + containerPos.z + ballRadius * ballNormal.z,
			i, il, particle, velocity, color;

		for( i = 0, il = particles.length; i < il; i++ ) {

			particle = particles[ i ];

			if( particle.delay < 0 ) {

				velocity = particle.velocity;
				particle.x += velocity.x * deltaTime;
				particle.y += velocity.y * deltaTime;
				particle.z += velocity.z * deltaTime;
				velocity.y += gravity;

				drag = 1 - particle.drag * deltaTime;
				velocity.x *= drag;
				velocity.y *= drag;
				velocity.z *= drag;

				if( particle.launch ) {

					color = particle.color;
					color.r = color.g = color.b = particle.intensity;
					particleGeometry.__dirtyColors = true;

					particle.launch = false;
				}

				if( isFlying ) {

					particle.life -= deltaTime;

					if( particle.life < 0 ) {

						if( particle.life > -0.25 ) {

							color = particle.color;
							color.r = particle.intensity * (1 + particle.life * 4);
							color.g = color.b = color.r;
							particleGeometry.__dirtyColors = true;
						}
						else {

							color = particle.color;
							color.r = color.g = color.b = 0;
							particleGeometry.__dirtyColors = true;
						}
					}
				}
				else if( velocity.y < 0 ) {

					color = particle.color;
					color.r = color.g = color.b = Math.min( 1, -particle.intensity * 10 / velocity.y );
					particleGeometry.__dirtyColors = true;
				}
			}
			else {

				particle.delay -= deltaTime;

				if( particle.delay < 0 ) {

					particle.x = pX;
					particle.y = pY;
					particle.z = pZ;

					particle.launch = true;
				}
			}
		}

		particleGeometry.__dirtyVertices = true;
		this.life -= deltaTime;
	}
};
/**
 * Created by JetBrains WebStorm.
 * User: C4RL05
 * Date: 14/08/2011
 * Time: 09:32
 * To change this template use File | Settings | File Templates.
 */

LIGHTS.BallGeometries = function( director ) {

	this.initialize( director );
};

LIGHTS.BallGeometries.prototype = {

	ballSize:               16,

	stemWidth:              0.05,

	stemRadius:             2,
	stemLength:             48,
	stemCapHeight:          2,
	stemReflectivity:       0.4,

	sphereColors:           [ [ 0xFFFF00, 0xFF0000 ],
							  [ 0xFF00FF, 0xFF0000 ],
							  [ 0xFFFF00, 0x00FF00 ],
							  [ 0x00FFFF, 0x00FF00 ],
							  [ 0x00FFFF, 0x0000FF ],
							  [ 0xFF00FF, 0x0000FF ] ],

	spotColors:             [ 0xFF6060,
							  0xFF6060,
							  0x60FF60,
							  0x60FF60,
							  0x6060FF,
							  0x6060FF ],

	groupBehaviours:        [],

    // _______________________________________________________________________________________ Constructor

	initialize: function( director ) {

		this.director = director;

		this.createSphereGeometries();
		this.createBalloonGeometries();
		this.createStemGeometry();
	},

    // _______________________________________________________________________________________ Sphere

	createSphereGeometries: function() {

		// Geometries
		this.sphereGeometries = [];

		var geometry, colors, material, shader, uniforms, i, il, v;

		for( i = 0, il = this.sphereColors.length; i < il; i++ ) {

//			geometry = new LIGHTS.SphereGeometry( this.ballSize, 16, 12 );
			geometry = this.createDropGeometry();
//			geometry = this.createStemGeometry();
//			this.createSphereSpikes( geometry );
			colors = this.sphereColors[ i ];
			THREE.MeshUtils.createVertexColorGradient( geometry, [ colors[ 0 ], colors[ 1 ] ], 0.6667 );
			this.sphereGeometries.push( geometry );
		}

		// Shader
		this.sphereShader = {

			uniforms: THREE.UniformsUtils.merge( [

				THREE.UniformsLib[ "common" ],
				THREE.UniformsLib[ "fog" ],
				{ "addR" : { type: "f", value: 0.0 } },
				{ "addG" : { type: "f", value: 0.0 } },
				{ "addB" : { type: "f", value: 0.0 } },
				{ "multiply" : { type: "f", value: 1.0 } }
			] ),

			fragmentShader: [

				"uniform float addR;",
				"uniform float addG;",
				"uniform float addB;",
				"uniform float multiply;",

				THREE.ShaderChunk[ "color_pars_fragment" ],
				THREE.ShaderChunk[ "fog_pars_fragment" ],

				"void main() {",

					"gl_FragColor = vec4( vColor * multiply, 1.0 );",
					"gl_FragColor.r = min( gl_FragColor.r + addR, 1.0 );",
					"gl_FragColor.g = min( gl_FragColor.g + addG, 1.0 );",
					"gl_FragColor.b = min( gl_FragColor.b + addB, 1.0 );",

					THREE.ShaderChunk[ "fog_fragment" ],
				"}"
			].join("\n"),

			vertexShader: [

				THREE.ShaderChunk[ "color_pars_vertex" ],

				"void main() {",

					"vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",

					THREE.ShaderChunk[ "color_vertex" ],
					THREE.ShaderChunk[ "default_vertex" ],
				"}"
			].join("\n")
		};

		this.sphereMaterials = [];
		this.sphereMaterialGroups = [];

		this.groupAdditives = [ 0.0, 0.0 ];
		this.groupMultiplies = [ 1.0, 1.0 ];
	},

	createBalloonGeometries: function() {

		// Geometries
		this.balloonGeometries = [];

		var geometry, colors, i, il;

		for( i = 0, il = this.sphereColors.length; i < il; i++ ) {

			geometry = new LIGHTS.SphereGeometry( this.ballSize, 16, 12 );
			colors = this.sphereColors[ i ];
			THREE.MeshUtils.createVertexColorGradient( geometry, [ colors[ 0 ], colors[ 1 ] ] );
			this.balloonGeometries.push( geometry );
		}
	},

/*
	createSphereGeometry: function() {

		var colors = this.sphereColors[ Math.floor( Math.random() * this.sphereColors.length) ],
			geometry, colors, material, shader, uniforms, i, il, v;

		geometry = new LIGHTS.SphereGeometry( this.ballSize, 12, 12 );
		this.createSphereSpikes( geometry );
		THREE.MeshUtils.createVertexColorGradient( geometry, [ colors[ 0 ], colors[ 1 ] ] );

		return geometry;
	},
*/

	createDropGeometry: function() {

		var segmentsAroundY = 16,
			refYs = [ -45, -30.168032, -23.313184, -17.65832, -14.0680352, -11.2017072, -7.888, -4.0291056, 0.112, 4.2531056, 8.112, 11.4257088, 13.9684064, 15.5668128 ],
			refRs = [ 1.81821399749878, 2.402843307774461, 3.7592494738495223, 6.7234277501566355, 9.351939279986453, 11.548022675641983, 13.9635861231426, 15.482072410492423, 15.999999947561278, 15.454813063676234, 13.856406445413263, 11.31370807962314, 7.999999973780639, 4.141104984053141 ],
			positions = [],
			i, il, pos, radius, angle, j, cos, sin;

		var geometry = new LIGHTS.CapsuleGeometry( 1, 1, 1, segmentsAroundY, refYs, true, 15, 1, false ), // 0.0340742
			vertices = geometry.vertices;

		v = 0;

		for( i = 0, il = refRs.length; i < il; i++ ) {

			radius = refRs[ i ];

			for( j = 0; j < segmentsAroundY; j++ ) {

				pos = vertices[ v++ ].position;

				angle = Math.atan2( pos.z, pos.x );
				cos = Math.cos( angle );
				sin = Math.sin( angle );
				pos.x = radius * cos;
				pos.z = radius * Math.sin( angle );
				pos.cos = cos;
				pos.sin = sin;

				positions.push( pos );
			}
		}

		geometry.positions = positions;

		return geometry;
	},

//	refDropRs: [ 1.8369775289023125, 1.81821399749878, 2.402843307774461, 3.7592494738495223, 6.7234277501566355, 9.351939279986453, 11.548022675641983, 13.9635861231426, 15.482072410492423, 15.999999947561278, 15.454813063676234, 13.856406445413263, 11.31370807962314, 7.999999973780639, 4.141104984053141 ],
	refDropRs: [ 1, 2.402843307774461, 3.7592494738495223, 6.7234277501566355, 9.351939279986453, 11.548022675641983, 13.9635861231426, 15.482072410492423, 15.999999947561278, 15.454813063676234, 13.856406445413263, 11.31370807962314, 7.999999973780639, 4.141104984053141 ],
	refGrowRs: [],

	updateDrops: function( grow ) {

		var segmentsAroundY = 16,
			ballSize = this.ballSize,
			refDropRs = this.refDropRs,
			refGrowRs = this.refGrowRs,
			useBehaviour =  (grow === undefined),
			i, il, j, g, s, sl, v, pos, radius, angle, alpha, behaviour;


		for( g = 0; g < 2; g++ ) {

			behaviour = this.groupBehaviours[ g ];

			if( useBehaviour )
				alpha = 1 - (Math.sin( Math.min( 1, behaviour.grow * 1.1 ) * rad90 - rad90 ) + 1);
			else
				alpha = 1 - (Math.sin( Math.min( 1, grow ) * rad90 - rad90 ) + 1);

//			alpha = Math.sin( (1 - Math.min( 1, behaviour.grow * 1.08 )) * rad90 );

			for( i = 0; i < 9; i++ )
				refGrowRs[ i ] = refDropRs[ i ] - (refDropRs[ i ] - ballSize) * alpha;

			if( ! useBehaviour || behaviour.growTarget == 1 ) {

				for( s = g * 3, sl = (g + 1) * 3; s < sl; s++ ) {

					geometry = this.sphereGeometries[ s ];
					positions = geometry.positions,
					v = 0;

					for( i = 0, il = refGrowRs.length; i < il; i++ ) {

						radius = refGrowRs[ i ];

						for( j = 0; j < segmentsAroundY; j++ ) {

							pos = positions[ v++ ];
							pos.x = radius * pos.cos;
							pos.z = radius * pos.sin;
						}
					}

					geometry.__dirtyVertices = true;
				}
			}
		}
	},

	createSphereSpikes: function( geometry ) {

		var vertices = geometry.vertices,
			grid = geometry.grid,
			spikesOn = [],
			spikesOff = [],
			gridX, spike, i, il, j, jl;

		geometry.spikesOff = spikesOff;
		geometry.spikesOn = spikesOn;

		for( i = 0, il = vertices.length; i < il; i++ ) {

			spikesOff.push( vertices[ i ].position.clone() );
			spikesOn.push( vertices[ i ].position.clone() );
		}

		for( i = 0, il = grid.length; i < il; i += 2 ) {

			gridX = grid[ i ];

			if( gridX[ 0 ] != gridX[ 1 ] ) {

				for( j = 0, jl = gridX.length; j < jl; j += 2 ) {

					spike = spikesOn[ gridX[ j ] ];
					spike.multiplyScalar( phi + Math.random() );
				}
			}
			else {

				spike = spikesOn[ gridX[ 0 ] ];
				spike.multiplyScalar( phi + Math.random() );
			}
		}
	},

	tweenSphereSpikes: function( geometry, alpha ) {

		var vertices = geometry.vertices,
			spikesOn = geometry.spikesOn,
			spikesOff = geometry.spikesOff,
			alphaMinus = 1 - alpha,
			vertexPos, spikeOn, spikeOff, i, il;

		for( i = 0, il = vertices.length; i < il; i++ ) {

			vertexPos = vertices[ i ].position;
			spikeOn = spikesOn[ i ];
			spikeOff = spikesOff[ i ];

			vertexPos.x = spikeOn.x * alpha + spikeOff.x * alphaMinus;
			vertexPos.y = spikeOn.y * alpha + spikeOff.y * alphaMinus;
			vertexPos.z = spikeOn.z * alpha + spikeOff.z * alphaMinus;
		}

		geometry.__dirtyVertices = true;
	},

	createSphereMaterial: function( groupIndex ) {

		uniforms = THREE.UniformsUtils.clone( this.sphereShader.uniforms );

		var material = new THREE.MeshShaderMaterial( {

//			wireframe: true,
			fog: this.director.view.scene.fog,
			vertexColors: THREE.VertexColors,
			uniforms: uniforms,
			vertexShader: this.sphereShader.vertexShader,
			fragmentShader: this.sphereShader.fragmentShader
		} );

		material.addR = uniforms["addR"];
		material.addG = uniforms["addG"];
		material.addB = uniforms["addB"];
		material.multiply = uniforms["multiply"];
		material.addR.value = 0;
		material.addG.value = 0;
		material.addB.value = 0;
		material.multiply.value = this.groupMultiplies[ groupIndex ];

//		this.director.materialCache.addMaterial( material );

		if( this.sphereMaterialGroups[ groupIndex ] === undefined )
			this.sphereMaterialGroups[ groupIndex ] = [];

		this.sphereMaterialGroups[ groupIndex ].push( material );
		this.sphereMaterials.push( material );

		return material;
	},

	setSphereMultiplyAdditive: function( multiply, additive, group ) {

		var isGroup = (group !== undefined),
			materials = isGroup? this.sphereMaterialGroups[ group ] : this.sphereMaterials,
			material, i, il;

		for( i = 0, il = materials.length; i < il; i++ ) {

			material = materials[ i ];
			material.addR.value = additive;
			material.addG.value = additive;
			material.addB.value = additive;
			material.multiply.value = multiply;
		}

		if( isGroup ) {

			this.groupMultiplies[ group ] = multiply;
			this.groupAdditives[ group ] = additive;
		}
		else {

			this.groupMultiplies[ 0 ] = this.groupMultiplies[ 1 ] = multiply;
			this.groupAdditives[ 0 ] = this.groupAdditives[ 1 ] = additive;
		}
	},

	setSphereMultiply: function( multiply, group ) {

		var isGroup = (group !== undefined),
			materials = isGroup? this.sphereMaterialGroups[ group ] : this.sphereMaterials,
			i, il;

		for( i = 0, il = materials.length; i < il; i++ )
			materials[ i ].multiply.value = multiply;

		if( isGroup )
			this.groupMultiplies[ group ] = multiply;
		else
			this.groupMultiplies[ 0 ] = this.groupMultiplies[ 1 ] = multiply;
	},

	setSphereAdditive: function( additive, group ) {

		var isGroup = (group !== undefined),
			materials = isGroup? this.sphereMaterialGroups[ group ] : this.sphereMaterials,
			i, il, material;

		for( i = 0, il = materials.length; i < il; i++ ) {

			material = materials[ i ];
			material.addR.value = additive;
			material.addG.value = additive;
			material.addB.value = additive;
		}

		if( isGroup )
			this.groupAdditives[ group ] = additive;
		else
			this.groupAdditives[ 0 ] = this.groupAdditives[ 1 ] = additive;
	},

	setSphereBlend: function( blend, group ) {

		var isGroup = (group !== undefined),
			materials = isGroup? this.sphereMaterialGroups[ group ] : this.sphereMaterials,
			i, il;

		for( i = 0, il = materials.length; i < il; i++ ) {

			materials[ i ].blending = blend? THREE.AdditiveBlending : THREE.NormalBlending;
			materials[ i ].transparent = blend;
		}
	},

    // _______________________________________________________________________________________ Stem

	createStemGeometry: function() {
/*
		var segmentsAroundY = 16,
			refYs = [ -4.24158, -2.686576, -1.885502, -1.457074, -1.103645, -0.8792522 ],
			refRs = [ 0.06822220584883634, 0.0669877629933408, 0.10545021761674084, 0.194687465384837, 0.3494873056313777, 0.5333295288212063 ],
			i, il, pos, radius, angle, j;

		for( i = 0, il = refRs.length; i < il; i++ )
			refRs[ i ] -= ( refRs[ i ] - 1 ) * this.stemWidth;

		for( i = 0, il = refYs.length; i < il; i++ )
			refYs[ i ] *= this.ballSize;

		for( i = 0, il = refRs.length; i < il; i++ )
			refRs[ i ] *= this.ballSize;

		this.stemGeometry = new LIGHTS.CapsuleGeometry( 1, 1, 1, segmentsAroundY, refYs, true, -4, 1, false );
		var vertices = this.stemGeometry.vertices;

		v = 0;

		for( i = 0, il = refRs.length; i < il; i++ ) {

			radius = refRs[ i ];

			for( j = 0; j < segmentsAroundY; j++ ) {

				pos = vertices[ v++ ].position;

				angle = Math.atan2( pos.z, pos.x );
				pos.x = radius * Math.cos( angle );
				pos.z = radius * Math.sin( angle );
			}
		}
*/
		this.stemGeometry = new LIGHTS.CapsuleGeometry( this.stemRadius, this.stemRadius, this.stemLength, 8, [ 0, 1 ], true, this.stemCapHeight, 1, false );
		this.moveVertexY( this.stemGeometry.vertices, -(this.ballSize * 0.97 + this.stemLength) );

		// Material
		this.stemMaterial = new THREE.MeshBasicMaterial( { color: 0xFFFFFF } );
	},

	createStemGeometryTube: function() {

		var stemHeights = [ 0, 0.5, 1 ];

		// Geometry
		this.stemGeometry = new LIGHTS.CapsuleGeometry( this.stemRadius, this.stemRadius, this.stemLength, 12, stemHeights, true, this.stemCapHeight, 2, false );
		THREE.MeshUtils.createVertexColorGradient( this.stemGeometry, [ 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x808080 ] );
		this.moveVertexY( this.stemGeometry.vertices, -(this.ballSize * 0.97 + this.stemLength) );

		// Materials
		this.stemMaterials = [];

//		var envMap = new THREE.Texture( [
//
//			LIGHTS.images.envMapLeft,
//			LIGHTS.images.envMapRight,
//			LIGHTS.images.envMapTop,
//			LIGHTS.images.envMapBottom,
//			LIGHTS.images.envMapFront,
//			LIGHTS.images.envMapBack
//		] );
//
//		envMap.needsUpdate = true;

		for( i = 0; i < this.sphereColors.length; i++ ) {

			material = new THREE.MeshBasicMaterial( {

				vertexColors:   THREE.VertexColors,
//				envMap:         envMap,
//				reflectivity:   this.stemReflectivity,
//				combine:        THREE.MultiplyOperation,
//				shading:        THREE.SmoothShading
//				color:          0xFFFFFF
//				map:            texture,
//				blending:       THREE.AdditiveBlending,
//				transparent:    true
			} );

			this.stemMaterials.push( material );
			this.director.materialCache.addMaterial( material );
		}

		this.resetStemColors();
	},

	createStemGeometry_Spot: function() {

		var stemHeights = [ 0, 0.5, 1 ];

		// Geometry
//		this.stemGeometry = new LIGHTS.CapsuleGeometry( this.stemRadius, this.stemRadius, this.stemLength, 12, stemHeights, true, 2, this.stemCapHeight, false );
		this.stemGeometry = new LIGHTS.SpotGeometry( this.stemRadius, this.stemRadius, this.stemLength );
//		THREE.MeshUtils.createVertexColorGradient( this.stemGeometry, [ 0x000000, 0x000000, 0x000000, 0x000000, 0x000000, 0x808080 ] );
		this.moveVertexY( this.stemGeometry.vertices, -(this.ballSize * 0.97 + this.stemLength) );


		// Materials
		var texture = new THREE.Texture( LIGHTS.images.spotLine );
		texture.needsUpdate = true;

		// Materials
		this.stemMaterials = [];

//		var envMap = new THREE.Texture( [
//
//			LIGHTS.images.envMapLeft,
//			LIGHTS.images.envMapRight,
//			LIGHTS.images.envMapTop,
//			LIGHTS.images.envMapBottom,
//			LIGHTS.images.envMapFront,
//			LIGHTS.images.envMapBack
//		] );
//
//		envMap.needsUpdate = true;

		for( i = 0; i < this.sphereColors.length; i++ ) {

			material = new THREE.MeshBasicMaterial( {

//				vertexColors:   THREE.VertexColors,
//				envMap:         envMap,
//				reflectivity:   this.stemReflectivity,
//				combine:        THREE.MultiplyOperation,
//				shading:        THREE.SmoothShading,
				color:          0xFFFFFF,
				map:            texture,
				blending:       THREE.AdditiveBlending,
				transparent:    true
			} );

			this.stemMaterials.push( material );
			this.director.materialCache.addMaterial( material );
		}

		this.resetStemColors();
	},

	setStemColors: function( color ) {

		var materials = this.stemMaterials,
			i, il;

		for( i = 0, il = materials.length; i < il; i++ )
			materials[ i ].color.setHex( color );

		this.stemColors = color;
	},

	resetStemColors: function() {

		if( this.stemColors !== null ) {

			var materials = this.stemMaterials,
				colors = this.spotColors,
				i, il;

			for( i = 0, il = materials.length; i < il; i++ )
				materials[ i ].color.setHex( colors[ i ] );

			this.stemColors = null;
		}
	},

	setStemReflection: function( reflectivity ) {

		var materials = this.stemMaterials,
			i, il;

		for( i = 0, il = materials.length; i < il; i++ )
			materials[ i ].reflectivity = reflectivity;
	},

	resetStemReflection: function() {

		var materials = this.stemMaterials,
			reflectivity = this.stemReflectivity,
			i, il;

		for( i = 0, il = materials.length; i < il; i++ )
			materials[ i ].reflectivity = reflectivity;
	},

    // _______________________________________________________________________________________ Private

	moveVertexY: function( vertices, dy ) {

		for( var v = 0; v < vertices.length; v++ )
			vertices[ v ].position.y += dy;
	}
};


/**
 * Created by JetBrains WebStorm.
 * User: C4RL05
 * Date: 01/08/2011
 * Time: 15:52
 * To change this template use File | Settings | File Templates.
 */

LIGHTS.BallsManager = function( director ) {

	this.initialize( director );
};

LIGHTS.BallsManager.prototype = {

    // _______________________________________________________________________________________ Vars

    ballsPerTile:           40,
    releaseVelocity:        5,
    gravity:                -4096,

    active:                 false,

    tiles:                  [],
    balls:                  [],
	behaviours:             [],
	visibleGroups:          [],
	cameraTilePosition:     new THREE.Vector3(),

    beats:                  0,

    // _______________________________________________________________________________________ Constructor

	initialize: function( director ) {

        this.director = director;

		this.geometries = new LIGHTS.BallGeometries( director );

		var terrain = director.terrain,
			i, il;

 		// Ball positions
		terrain.selectCenterTile();

		for( i = 0, il = this.ballsPerTile; i < il; i++ ) {

			terrain.selectTerrainRandomVertex( true, 3, 3 );
			this.behaviours.push( new LIGHTS.BallBehaviour( this, i ) );
		}

		this.volume = 0;
		this.nextBeat = 0;

		this.mouse = new THREE.Vector3( 0, 0, 0.5 );
		this.projector = new THREE.Projector();
		this.camera = director.view.camera;
		this.ray = new THREE.Ray( this.camera.position, this.mouse );

		this.explosions = new LIGHTS.BallExplosions( this );

		this.mouseOverCollisions = new THREE.CollisionSystem();
		this.clickCollisions = new THREE.CollisionSystem();

		this.state = 0;
	},

    // _______________________________________________________________________________________ Events

    launch: function() {

	    var geo = this.geometries;

        switch( LIGHTS.Music.phase.index ) {

	        case 0:
		        this.beats = 1;
		        this.resetState( 0 );
		        this.setSphereMultiplyAdditive( 0.0, 0.0 );
		        break;

            case 1:
//	            geo.updateDrops( 0.8 );
	            geo.setSphereBlend( false );
	            this.setSphereMultiplyAdditive( 0.0, 1.0, 0 );
                this.showGroup( 0, true );
                this.showGroup( 1, false );
                break;

            case 2:
	            this.setSphereMultiplyAdditive( 0.0, 1.0, 1 );
                this.showGroup( 1, true );
                break;

            case 3: // C1
		        this.setSphereMultiplyAdditive( 1.0, 1.0 );
//	            geo.setStemColors( 0xFFFFFF );
	            this.activateFat( true );
	            this.setFat( phi, 1 );
	            this.nextBeat = 1;
	            break;

            case 4:
	        case 6:
		        this.setSphereAdditive( 1.0 );
		        this.setFat( phi, 1 );
		        this.nextBeat = 1;
                break;

	        case 5:
		        this.changeFat();
		        this.nextBeat = 2;
                break;

	        case 7: // B2
		        this.unselect();
		        this.setSphereMultiply( 0.0 );
		        this.activateFat( false );
                break;

	        case 8:
		        this.unselect();
		        this.setSphereMultiplyAdditive( 1.0, 1.0 );
		        this.nextBeat = 1;
                break;

	        case 9:
				this.beats = 0;
		        this.unselect();
		        this.setState( 1, true );
//		        this.activateGrow( true );
		        this.setGrow( 0, 0 );
		        this.setGrow( 1, 1 );
	            break;

	        case 10:
	            this.beats = 1;
	            break;

	        case 11: // C2
		        this.setSphereAdditive( 1.0 );
//		        geo.setStemColors( 0x000000 );
//		        this.activateFat( true );
//		        this.setFat( phi, 1 );
//		        this.setState( 2, false, 1 );
		        this.setState( 2, true );
		        this.nextBeat = 1;
	            break;

	        case 13:
		        this.setState( 3, true );
                break;

	        case 15: // D1
	            break;

	        case 16: // S!
//		        geo.updateDrops( 0.8 );

//		        this.setSphereMultiplyAdditive( 0.0, 0.0 );
//		        geo.setStemColors( 0x000000 );
//		        geo.setStemReflection( 0 );
//		        this.setState( 3, false, 1 );
                break;

	        case 17: // C3
		        this.resetState( 0 );
		        this.activateFat( true );
		        this.setFat( phi, 1 );
		        geo.setSphereBlend( false );
		        this.setSphereMultiplyAdditive( 1.0, 1.0 );
//		        geo.setStemColors( 0xFFFFFF );
//		        geo.resetStemReflection();
		        this.setRotation();
		        this.nextBeat = 1;
                break;

	        case 18:
		        this.setSphereMultiplyAdditive( 1.0, 1.0 );
//		        geo.setStemColors( 0xFFFFFF );
		        this.unselect();
		        this.setState( 1, true );
		        this.setGrow( 0, 1 );
		        this.setGrow( 1, 0 );
		        this.nextBeat = 1;
	            break;

	        case 19:
	        case 20:
		        this.setSphereMultiplyAdditive( 1.0, 1.0 );
//		        geo.setStemColors( 0xFFFFFF );
		        this.changeGrow();
		        this.beats = 0;
		        this.nextBeat = 1;
	            break;

	        case 21: // D2
		        this.setSphereMultiplyAdditive( 1.0, 1.0 );
//		        geo.setStemColors( 0x000000 );
		        this.setState( 2, true );
		        this.nextBeat = 1;
                break;

	        case 22: // A2
		        this.setState( 3, true );
//		        this.setSphereMultiply( 0.0 );
	            break;
        }
    },

    beat: function() {

	    var geo = this.geometries;

        switch( LIGHTS.Music.phase.index ) {

            case 1:
	            if( this.beats % 2 == 0 )
		            this.setSphereAdditive( 1.0, 0 );
	            else
		            this.setSphereAdditive( 0.0, 0 );
//		            this.selectBallsAdditive( 0 );
                break;

            case 2:
	            if( this.beats % 2 == 0 ) {

		            this.setSphereAdditive( 1.0, 0 );
		            this.setSphereAdditive( 0.0, 1 );
//		            geo.setSphereAdditive( 1.0, 0 );
//		            this.selectBallsAdditive( 1 );
	            }
	            else {

		            this.setSphereAdditive( 0.0, 0 );
		            this.setSphereAdditive( 1.0, 1 );
//		            this.selectBallsAdditive( 0 );
//		            geo.setSphereAdditive( 1.0, 1 );
	            }
	            break;

	        case 3:
	        case 4:
	        case 6:
		        if( this.nextBeat == 0 ) {

			        this.changeFat();
		        }
		        else {

			        this.setFat( 0, 1 );
			        this.setFat( 1, 0.5 );
			        this.setSphereAdditive( 0.0 );
//			        geo.resetStemColors();
			        this.nextBeat--;
		        }
		        break;

	        case 5:
		        if( this.nextBeat == 0 ) {

			        this.changeFat();
		        }
		        else if( this.nextBeat == 1 ) {

			        this.setFat( 0, 1 );
			        this.setFat( 1, 0.5 );
			        this.setSphereAdditive( 0.0 );
//			        geo.resetStemColors();
			        this.nextBeat--;
		        }
		        else {

			        this.setFat( phi, 1 );
			        this.setSphereAdditive( 1.0 );
//			        geo.setStemColors( 0xFFFFFF );
			        this.nextBeat--;
		        }
			    break;

	        case 8:
		        if( this.nextBeat == 1 ) {

			        this.setSphereAdditive( 0.0 );
			        this.nextBeat--;
		        }
				break;

	        case 9:
				if( this.beats > 1 && this.beats % 2 == 0 )
					this.changeGrow();
		        break;

	        case 10:
		        if( this.beats == 15 ) {

			        this.setGrow( 1, 0 );
			        this.setGrow( 1, 1 );
		        }
		        else if( this.beats < 16 && this.beats % 2 == 1 ) {

			        this.changeGrow();
		        }
	            break;

		    case 11:
			    if( this.nextBeat == 1 ) {

				    this.setSphereAdditive( 0.0 );
				    this.removeSpheres();
				    geo.setSphereBlend( true );
				    this.nextBeat--;
			    }
			    break;

//	        case 13:
//		        if( this.nextBeat == 0 ) {
//
//			        this.changeFat();
//		        }
//		        else if( this.nextBeat == 1 ) {
//
//			        this.setFat( 0, 1 );
//			        this.setFat( 1, 0.5 );
//			        this.nextBeat--;
//		        }
//		        else {
//
//			        this.setFat( phi, 1 );
//			        geo.setSphereAdditive( 1.0 );
//			        geo.setStemColors( 0xFFFFFF );
//			        this.nextBeat--;
//		        }
//			    break;

		    case 17:
			    if( this.nextBeat == 0 ) {

				    this.changeFat();
			    }
			    else {

				    this.setFat( 0, 1 );
				    this.setFat( 1, 0.5 );
				    this.setSphereAdditive( 0.0 );
//				    geo.resetStemColors();
				    this.nextBeat--;
			    }
		        break;

	        case 18:
	        case 19:
		        if( this.nextBeat == 1 ) {

			        this.setSphereAdditive( 0.0 );
//			        geo.resetStemColors();

			        this.nextBeat--;
		        }

		        if( this.beats % 2 == 1 )
		            this.changeGrow();
	            break;

		    case 20:
			    if( this.nextBeat == 1 ) {

				    this.setSphereAdditive( 0.0 );
//				    geo.resetStemColors();

				    this.nextBeat--;
			    }

			    if( this.beats == 13 ) {

				    this.setGrow( 1, 0 );
				    this.setGrow( 1, 1 );
			    }
			    else if( this.beats < 14 && this.beats % 2 == 1 ) {

				    this.changeGrow();
			    }
		        break;

		    case 21:
			    if( this.nextBeat == 1 ) {

				    this.setSphereAdditive( 0.0 );
				    geo.setSphereBlend( true );
//				    geo.resetStemColors();

				    this.nextBeat--;
			    }
				break;

//	        case 19:
//		        this.changeFat();
//
//		        if( this.beats % 2 == 0 )
//		            this.changeGrow();
//	            break;

        }
        this.beats++;
    },

    // _______________________________________________________________________________________ Update

//    update: function() {
//
//	    // Update tiles
//	    var tiles = this.tiles,
//		    il = tiles.length,
//		    i;
//
//	    for( i = 0; i < il; i++ )
//		    tiles[ i ].update();
//
//	    this.explosions.update();
//    },

    update: function() {

	    var behaviours = this.behaviours,
		    i, il;

	    for( i = 0, il = behaviours.length; i < il; i++ )
	        behaviours[ i ].update();

	    this.explosions.update();

//	    if( this.state == 1 )
//	        this.geometries.updateDrops();
    },

	raycast: function() {

	    var origin = this.ray.origin,
	        mouse = this.mouse,
	        balls = this.balls,
	        ball, colliders, collider, other, i, il;

		mouse.x = LIGHTS.Input.mouseX;
		mouse.y = -LIGHTS.Input.mouseY;
		mouse.z = 0.5;

	    this.projector.unprojectVector( mouse, this.camera );

		mouse.x -= origin.x;
		mouse.y -= origin.y;
		mouse.z -= origin.z;
		mouse.normalize();

		// Rollover
	    colliders = this.mouseOverCollisions.rayCastAll( this.ray );

		for( i = 0, il = balls.length; i < il; i++ )
			balls[ i ].mouseOver = false;

		for( i = 0, il = colliders.length; i < il; i++ ) {

			collider = colliders[ i ];

			if( collider != null && collider.enabled ) {

				other = colliders.indexOf( collider.other );

				if( other != -1 )
					colliders[ other ] = null;

				ball = collider.ball;
				ball.mouseOver = true;

				if( ball.ball.visible && ! ball.selected && ! ball.unselected )
					ball.select();
			}
		}

		for( i = 0, il = balls.length; i < il; i++ ) {

			ball = balls[ i ];

			if( ball.selected && ! ball.mouseOver )
				ball.unselect( false );
		}

		// Click
		if( LIGHTS.Input.mouseClick ) {

			LIGHTS.Input.mouseClick = false;
			collider = this.clickCollisions.rayCastNearest( this.ray );

			if( collider !== null && (collider.ball.ball.visible || collider.ball.balloon.visible) )
					this.explosions.launchExplosion( collider.ball );
		}
	},

	unselect: function() {

	    var balls = this.balls,
	        ball, i, il;

		for( i = 0, il = balls.length; i < il; i++ ) {

			ball = balls[ i ];

			if( ball.selected || ball.unselected )
				ball.unselect( true );
		}
	},


    // _______________________________________________________________________________________ Private

    showGroup: function( groupIndex, visible ) {

        var tiles = this.tiles,
		    behaviours = this.behaviours,
	        i, il, j, jl, group, child;

	    for( i = 0, il = tiles.length; i < il; i++ ) {

		    group = tiles[ i ].groups[ groupIndex ];

		    for( j = 0, jl = group.length; j < jl; j++ )
				group[ j ].visible = visible;
        }

	    for( i = 0, il = behaviours.length; i < il; i++ )
	        if( behaviours[ i ].groupIndex == groupIndex )
		        behaviours[ i ].visible = visible;

	    this.visibleGroups[ groupIndex ] = visible;
    },

	setState: function( state, force, ratio ) {

		var behaviours = this.behaviours,
			prevState = state - 1,
			i, il, behaviour;

		for( i = 0, il = behaviours.length; i < il; i++ ) {

			behaviour = behaviours[ i ];

			if( behaviour.state < state && (force || (behaviour.state == prevState && Math.random() < ratio) ) )
				behaviour.setState( state );
		}

		this.state = state;
	},

	resetState: function( state ) {

		var behaviours = this.behaviours,
			i, il;

		for( i = 0, il = behaviours.length; i < il; i++ )
			behaviours[ i ].setState( state );
	},

	setRotation: function() {

		var balls = this.balls,
			il = balls.length,
			i;

		for( i = 0; i < il; i++ )
			balls[ i ].setRotation();
	},

	removeSpheres: function() {

		var balls = this.balls,
			il = balls.length,
			i;

		for( i = 0; i < il; i++ )
			balls[ i ].removeSphere();
	},

	selectBallsAdditive: function( group ) {

		var tiles = this.tiles,
			groupBalls, ball, i, il, j, jl;

		for( i = 0, il = tiles.length; i < il; i++ ) {

			groupBalls = tiles[ i ].groups[ group ];

			for( j = 0, jl = groupBalls.length; j < jl; j++ ) {

				ball = groupBalls[ j ];
				ball.sphereMaterial.additive.value = ball.selectAdditive? 1.0 : 0.0;
			}
		}
	},

	setSphereAdditive: function( additive, group ) {

		var behaviours = this.behaviours,
			notGroup = (group === undefined),
			i, il;

		for( i = 0, il = behaviours.length; i < il; i++ )
			if( notGroup || behaviours[ i ].groupIndex == group )
		        behaviours[ i ].additive = additive;

		this.geometries.setSphereAdditive( additive, group );
	},

	setSphereMultiplyAdditive: function( multiply, additive, group ) {

		var behaviours = this.behaviours,
			notGroup = (group === undefined),
			i, il, behaviour;

		for( i = 0, il = behaviours.length; i < il; i++ ) {

			behaviour = behaviours[ i ];

			if( notGroup || behaviours[ i ].groupIndex == group ) {

				behaviour.additive = additive;
				behaviour.multiply = multiply;
			}
		}

		this.geometries.setSphereMultiplyAdditive( multiply, additive, group );
	},

	setSphereMultiply: function( multiply, group ) {

		var behaviours = this.behaviours,
			notGroup = (group === undefined),
			i, il;

		for( i = 0, il = behaviours.length; i < il; i++ )
			if( notGroup || behaviours[ i ].groupIndex == group )
		        behaviours[ i ].multiply = multiply;

		this.geometries.setSphereMultiply( multiply, group );
	},

    // _______________________________________________________________________________________ Fat

	activateFat: function( ok ) {

		var behaviours = this.behaviours,
			i, il;

		for( i = 0, il = behaviours.length; i < il; i++ )
			behaviours[ i ].fatActive = ok;
	},

	changeFat: function() {

		var behaviours = this.behaviours,
			i, il, behaviour;

		for( i = 0, il = behaviours.length; i < il; i++ ) {

			behaviour = behaviours[ i ];

			if( behaviour.state == 0 )
				behaviour.fatTarget = 1 - behaviour.fatTarget;
		}
	},

	setFat: function( fat, ratio ) {

		var behaviours = this.behaviours,
			i, il, behaviour;

		for( i = 0, il = behaviours.length; i < il; i++ ) {

			behaviour = behaviours[ i ];

			if( behaviour.state == 0 && Math.random() < ratio )
				behaviour.fatTarget = fat;
		}
	},

    // _______________________________________________________________________________________ Grow

	activateGrow: function( ok ) {

		var behaviours = this.behaviours,
			i, il, behaviour;

		for( i = 0, il = behaviours.length; i < il; i++ ) {

			behaviour = behaviours[ i ];
			behaviour.growActive = ok;
//			behaviour.growTarget = ( Math.random() > 0.5 )? 1 : 0;
		}
	},

	changeGrow: function() {

		var behaviours = this.behaviours,
			i, il, behaviour;

		for( i = 0, il = behaviours.length; i < il; i++ ) {

			behaviour = behaviours[ i ];

			if( behaviour.state > 0 )
				behaviour.growTarget = 1 - behaviour.growTarget;
		}
	},

	setGrow: function( grow, groupIndex ) {

		var behaviours = this.behaviours,
			i, il, behaviour;

		for( i = 0, il = behaviours.length; i < il; i++ ) {

			behaviour = behaviours[ i ];

			if( behaviours[ i ].groupIndex == groupIndex )
				behaviour.growTarget = grow;
		}
	}
};



// ___________________________________________________________________________________________ Tile

LIGHTS.BallsTile = function( manager, container ) {

	this.initialize( manager, container );
};

LIGHTS.BallsTile.prototype = {

    // _______________________________________________________________________________________ Constructor

	initialize: function( manager, container ) {

        this.manager = manager;
		this.containerPosition = container.position;
		this.cameraPosition = manager.director.view.camera.position;

        this.children = [];
        this.balls = [];
		this.groups = [ [], [] ];

        var i, j, child, ball, visible, groupIndex;

        for( i = 0; i < manager.ballsPerTile; i++ ) {

	        groupIndex = i % 2;
	        ball = new LIGHTS.Ball( manager, container, i, groupIndex );

	        for( j = 0; j < ball.children.length; j++ )
				this.children.push( ball.children[ j ] );

	        // Save
	        this.groups[ groupIndex ].push( ball );
	        this.balls.push( ball );
	        manager.balls.push( ball );
        }

		// Update new groups
		for( i = 0; i < this.groups.length; i++ ) {

			group = this.groups[ i ];
			visible = manager.visibleGroups[ i ];

			for( j = 0; j < group.length; j++ ) {

				ball = group[ j ];
				ball.visible = visible;

//				ball.setState( this.ballState );
//				ball.ballGrow = this.ballGrow;
//				ball.ballFat = this.ballFat;
			}
		}

		// Debug
		// this.children.push( new THREE.Mesh( new THREE.SphereGeometry( 80, 12, 10 ), new THREE.MeshBasicMaterial( { color: 0xFFFF00, wireframe: true } )) );

        manager.tiles.push( this );
    },

    // _______________________________________________________________________________________ Update

//    update: function() {
//
//	    var balls = this.balls,
//		    i, il;
//
//		for( i = 0, il = balls.length; i < il; i++ )
//			balls[ i ].update();
//    },

	updateTile: function() {

	    var balls = this.balls,
		    ball, i, il;

//		for( i = 0, il = balls.length; i < il; i++ ) {
//
//			ball = balls[ i ];
//
//			if( ball.selected )
//				ball.unselect();
//		}
    }
};
/**
 * Created by JetBrains WebStorm.
 * User: C4RL05
 * Date: 20/08/2011
 * Time: 10:22
 * To change this template use File | Settings | File Templates.
 */

/**
 * @author mr.doob / http://mrdoob.com/
 * based on http://papervision3d.googlecode.com/svn/trunk/as3/trunk/src/org/papervision3d/objects/primitives/Sphere.as
 */

LIGHTS.SphereGeometry = function ( radius, segmentsWidth, segmentsHeight ) {

	THREE.Geometry.call( this );

	var radius = radius || 50,
	gridX = segmentsWidth || 8,
	gridY = segmentsHeight || 6;

	var i, j, pi = Math.PI;
	var iHor = Math.max( 3, gridX );
	var iVer = Math.max( 2, gridY );
	var aVtc = [];
	this.grid = aVtc;

	for ( j = 0; j < ( iVer + 1 ) ; j++ ) {

		var fRad1 = j / iVer;
		var fZ = radius * Math.cos( fRad1 * pi );
		var fRds = radius * Math.sin( fRad1 * pi );
		var aRow = [];
		var oVtx = 0;

		for ( i = 0; i < iHor; i++ ) {

			var fRad2 = 2 * i / iHor;
			var fX = fRds * Math.sin( fRad2 * pi );
			var fY = fRds * Math.cos( fRad2 * pi );

			if ( !( ( j == 0 || j == iVer ) && i > 0 ) ) {

				oVtx = this.vertices.push( new THREE.Vertex( new THREE.Vector3( fY, fZ, fX ) ) ) - 1;

			}

			aRow.push( oVtx );

		}

		aVtc.push( aRow );

	}

	var n1, n2, n3, iVerNum = aVtc.length;

	for ( j = 0; j < iVerNum; j++ ) {

		var iHorNum = aVtc[ j ].length;

		if ( j > 0 ) {

			for ( i = 0; i < iHorNum; i++ ) {

				var bEnd = i == ( iHorNum - 1 );
				var aP1 = aVtc[ j ][ bEnd ? 0 : i + 1 ];
				var aP2 = aVtc[ j ][ ( bEnd ? iHorNum - 1 : i ) ];
				var aP3 = aVtc[ j - 1 ][ ( bEnd ? iHorNum - 1 : i ) ];
				var aP4 = aVtc[ j - 1 ][ bEnd ? 0 : i + 1 ];

				var fJ0 = j / ( iVerNum - 1 );
				var fJ1 = ( j - 1 ) / ( iVerNum - 1 );
				var fI0 = ( i + 1 ) / iHorNum;
				var fI1 = i / iHorNum;

				var aP1uv = new THREE.UV( 1 - fI0, fJ0 );
				var aP2uv = new THREE.UV( 1 - fI1, fJ0 );
				var aP3uv = new THREE.UV( 1 - fI1, fJ1 );
				var aP4uv = new THREE.UV( 1 - fI0, fJ1 );

				if ( j < ( aVtc.length - 1 ) ) {

					n1 = this.vertices[ aP1 ].position.clone();
					n2 = this.vertices[ aP2 ].position.clone();
					n3 = this.vertices[ aP3 ].position.clone();
					n1.normalize();
					n2.normalize();
					n3.normalize();

					this.faces.push( new THREE.Face3( aP1, aP2, aP3, [ new THREE.Vector3( n1.x, n1.y, n1.z ), new THREE.Vector3( n2.x, n2.y, n2.z ), new THREE.Vector3( n3.x, n3.y, n3.z ) ] ) );

					this.faceVertexUvs[ 0 ].push( [ aP1uv, aP2uv, aP3uv ] );

				}

				if ( j > 1 ) {

					n1 = this.vertices[aP1].position.clone();
					n2 = this.vertices[aP3].position.clone();
					n3 = this.vertices[aP4].position.clone();
					n1.normalize();
					n2.normalize();
					n3.normalize();

					this.faces.push( new THREE.Face3( aP1, aP3, aP4, [ new THREE.Vector3( n1.x, n1.y, n1.z ), new THREE.Vector3( n2.x, n2.y, n2.z ), new THREE.Vector3( n3.x, n3.y, n3.z ) ] ) );

					this.faceVertexUvs[ 0 ].push( [ aP1uv, aP3uv, aP4uv ] );

				}

			}
		}
	}

	this.computeCentroids();
	this.computeFaceNormals();
	this.computeVertexNormals();

	this.boundingSphere = { radius: radius };

};

LIGHTS.SphereGeometry.prototype = new THREE.Geometry();
LIGHTS.SphereGeometry.prototype.constructor = LIGHTS.SphereGeometry;

/**
 * Created by JetBrains WebStorm.
 * User: C4RL05
 * Date: 15/08/2011
 * Time: 09:21
 * To change this template use File | Settings | File Templates.
 */

LIGHTS.CannonManager = function( director ) {

	this.initialize( director );
};

LIGHTS.CannonManager.prototype = {

    // _______________________________________________________________________________________ Vars

    countPerTile:           8,
	cannonRadius:           8,

	spotColors:             [ 0xFF4040,
							  0x40FF40,
							  0x4040FF,
							  0xFFFF40,
							  0x40FFFF,
							  0xFF40FF ],

    active:                 false,

    tiles:                  [],
	cannons:                [],
	spots:                  [],
	positions:              [],
	normals:                [],

    // _______________________________________________________________________________________ Constructor

	initialize: function( director ) {

        this.director = director;

		var terrain = director.terrain,
			cannonColor = new THREE.Color( 0x000000 ),
			whiteColor = new THREE.Color( 0xFFFFFF ),
			i, il, faces, material;

		// Geometry
		this.cannonGeometry = new LIGHTS.CapsuleGeometry( this.cannonRadius, this.cannonRadius, this.cannonRadius, 16, [ 0, 1 ], true, this.cannonRadius, 3, true, this.cannonRadius, 4 );
		faces = this.cannonGeometry.faces;

		for( i = 0, il = faces.length; i < il; i++ )
			faces[ i ].color = cannonColor;

		for( i = 16 * 3, il = 16 * 4; i < il; i++ )
			faces[ i ].color = whiteColor;

		// Materials
		var envMap = new THREE.Texture( [

			LIGHTS.images.envMapLeftRight,
			LIGHTS.images.envMapLeftRight,
			LIGHTS.images.envMapTop,
			LIGHTS.images.envMapBottom,
			LIGHTS.images.envMapFrontBack,
			LIGHTS.images.envMapFrontBack
		] );

		envMap.needsUpdate = true;

		this.cannonMaterial = new THREE.MeshBasicMaterial( {

			color:          0xFFFFFF,
			vertexColors:   THREE.FaceColors,
			envMap:         envMap,
			reflectivity:   0.4,
			combine:        THREE.MultiplyOperation,
			shading:        THREE.SmoothShading
		} );

		director.materialCache.addMaterial( this.cannonMaterial );

		// Spot
		this.spotGeometry = new LIGHTS.SpotGeometry( this.cannonRadius * 1.5, this.cannonRadius * 3, 192 );
//		THREE.MeshUtils.createVertexColorGradient( this.spotGeometry, [ 0xFFFFFF, 0x000000 ] );
		this.moveVertexY( this.spotGeometry.vertices, this.cannonRadius );

		this.spotMaterials = [];

		var texture = new THREE.Texture( LIGHTS.images.spot );
		texture.needsUpdate = true;

		for( i = 0, il = this.spotColors.length; i < il; i++ ) {

			material = new THREE.MeshBasicMaterial( {

//				wireframe:      true,
				map:            texture,
				color:          this.spotColors[ i ],
				blending:       THREE.AdditiveBlending,
				transparent:    true
			} );

			this.spotMaterials.push( material );
			director.materialCache.addMaterial( material );
		}

 		// Cannon positions
		terrain.selectCenterTile();

		for( i = 0, il = this.countPerTile; i < il; i++ ) {

			terrain.selectTerrainRandomVertex( true, 3 );
			this.positions.push( terrain.randomVertex.position );
			this.normals.push( terrain.randomNormal );
		}
	},

    // _______________________________________________________________________________________ Events

    launch: function() {

	    var geo = this.geometries;

        switch( LIGHTS.Music.phase.index ) {

	        case 17: // C3
				this.resetSpotMaterials();
		        this.cannonMaterial.color.setHex( 0xFFFFFF );
		        this.cannonMaterial.reflectivity = 0.4;
		        this.rotationActive = false;
                break;

	        case 19: // D2
		        this.rotationActive = true;
		        this.rotationTime = 0;
                break;

	        case 22: // A2
		        this.cannonMaterial.reflectivity = 0;
	            break;
        }
    },

	resetSpotMaterials: function() {

		var materials = this.spotMaterials,
			colors = this.spotColors,
			i, il;

		for( i = 0, il = materials.length; i < il; i++ )
			materials[ i ].color.setHex( colors[ i ] );
	},

	fadeMaterials: function() {

		var materials = this.spotMaterials,
			dark = 1 - LIGHTS.deltaTime * 8,
			i, il, color;

		for( i = 0, il = materials.length; i < il; i++ ) {

			color = materials[ i ].color;
			color.r *= dark;
			color.g *= dark;
			color.b *= dark;
		}

		color = this.cannonMaterial.color;
		color.r *= dark;
		color.g *= dark;
		color.b *= dark;
	},

	// _______________________________________________________________________________________ Update

	update: function() {

		if( this.rotationActive ) {

			this.rotationTime += LIGHTS.deltaTime;

			var tiles = this.tiles,
				il = tiles.length,
				i;

			for( i = 0; i < il; i++ )
				tiles[ i ].update();

			if( LIGHTS.time >= 208 )
				this.fadeMaterials();
		}
	},

	// _______________________________________________________________________________________ Private

	moveVertexY: function( vertices, dy ) {

		for( var v = 0; v < vertices.length; v++ )
			vertices[ v ].position.y += dy;
	}
};

// ___________________________________________________________________________________________ Tile

LIGHTS.CannonsTile = function( manager ) {

	this.initialize( manager );
};

LIGHTS.CannonsTile.prototype = {

    // _______________________________________________________________________________________ Constructor

	initialize: function( manager ) {

        this.manager = manager;
//		this.containerPosition = container.position;

        this.children = [];
        this.cannons = [];
        this.spots = [];
		this.groups = [ [], [] ];

        var i, j, child, mesh, visible, groupIndex, rotX, leftRight;

        for( i = 0; i < manager.countPerTile; i++ ) {

	        leftRight = (Math.random() > 0.5);
	        rotX = leftRight? rad45 : -rad45;
	        mesh = new THREE.Mesh( manager.cannonGeometry, manager.cannonMaterial );
	        mesh.position = manager.positions[ i ];
	        mesh.rotation.x = rotX;
	        this.children.push( mesh );
	        this.cannons.push( mesh );
	        manager.cannons.push( mesh );

	        mesh.offset = leftRight? rad90 : -rad90;
	        mesh.freq = Math.random() + 0.5;
	        mesh.rotX = rotX;

	        mesh = new THREE.Mesh( manager.spotGeometry, manager.spotMaterials[ Math.floor( Math.random() * manager.spotMaterials.length ) ] );
	        mesh.doubleSided = true;
	        mesh.position = manager.positions[ i ];
	        mesh.rotation.x = rotX;
	        this.children.push( mesh );
	        this.spots.push( mesh );
	        manager.spots.push( mesh );
        }

        manager.tiles.push( this );
    },

    // _______________________________________________________________________________________ Update

    update: function() {

	    var cannons = this.cannons,
		    spots = this.spots,
		    rotationTime = this.manager.rotationTime,
		    rotX, i, il, cannon;

		for( i = 0, il = cannons.length; i < il; i++ ) {

			cannon = cannons[ i ];
			rotX = Math.sin( cannon.offset + rotationTime * cannon.freq ) * rad45;

			cannon.rotation.x = rotX;
			spots[ i ].rotation.x = rotX;
		}
    }
};

/**
 * Created by JetBrains WebStorm.
 * User: C4RL05
 * Date: 26/08/2011
 * Time: 14:44
 * To change this template use File | Settings | File Templates.
 */

LIGHTS.StarManager = function( director ) {

	this.initialize( director );
};

LIGHTS.StarManager.prototype = {

    // _______________________________________________________________________________________ Group

    active:                 false,

	tiles:                  [],

	particleCount:          256,
	particleSize:           4,
	arpKeys:                [ [ 0, 0.255, 0.38, 0.63, 0.75 ], [ 0, 0.125, 0.38, 0.50, 0.75 ] ],

    // _______________________________________________________________________________________ Constructor

	initialize: function( director ) {

		this.director = director;
		this.tileSize = director.terrain.tileSize;

		var p, pl, star, material;

		// Geometry
		this.particles = new THREE.Geometry();
		this.particles.colors = [];
		this.stars = [];

		// Materials
		material = new THREE.ParticleBasicMaterial({
			vertexColors: true,
			size: this.particleSize,
//                map: this.getCircleTexture( 32 ),
			map: LIGHTS.TextureUtils.getCircleTexture( 32 ),
//                map: THREE.ImageUtils.loadTexture( "images/BluePlasmaBall.png" ),
			blending: THREE.AdditiveBlending,
			transparent: true
		});

		for( p = 0, pl = this.particleCount * LIGHTS.TileManager.prototype.estimatedTileCount; p < pl; p++ ) {

		    star = new LIGHTS.Star();
		    star.position = new THREE.Vector3( 999999, 0, 999999 );
		    star.color = new THREE.Color( 0x000000 );

//			star.colorR = (Math.random() * 0.5 + 0.5) * 1;
//			star.colorG = (Math.random() * 0.5 + 0.5) * 1;
//			star.colorB = (Math.random() * 0.5 + 0.5) * 1;

		    this.stars.push( star );

		    this.particles.vertices.push( new THREE.Vertex( star.position ) );
		    this.particles.colors.push( star.color );
		}

		this.particleSystem = new THREE.ParticleSystem( this.particles, material );
		this.particleSystem.sortParticles = false;
		this.particleSystem.dynamic = true;

		this.director.view.scene.addChild( this.particleSystem );
	},

	launch: function() {

	    switch( LIGHTS.Music.phase.index ) {

	        case 0:
		        this.particleSystem.visible = true;
		        this.beats = 0;
		        this.arpTimes = this.arpKeys[ 0 ];
		        this.nextArpIndex = 0;
		        this.nextArpTime = this.arpTimes[ 0 ];
		        break;

		    case 22: // A2
		        this.particleSystem.visible = false;
		        break;
	    }
	},

	beat: function() {

		this.arpTimes = this.arpKeys[ this.beats++ % 2 ];
		this.nextArpIndex = 0;
		this.nextArpTime = this.arpTimes[ 0 ];
	},

	update: function() {

		var stars = this.stars,
			deltaTime = LIGHTS.deltaTime,
			star, brightness, i, il;

		for( i = 0, il = stars.length; i < il; i++ ) {

		    star = this.stars[ i ];

			star.life += deltaTime;

			brightness = (star.life * 2) % 2;

			if( brightness > 1 )
			    brightness = 1 - (brightness - 1);

			star.color.r =
			star.color.g =
			star.color.b = (Math.sin( brightness * rad90 - rad90 ) + 1) * 4;
		}

		this.particles.__dirtyColors = true;
	},

	updateKeys: function() {

		var isKey = (LIGHTS.time > this.nextArpTime);

		if( isKey ) {

			this.nextArpIndex++;

			if( this.nextArpIndex >= this.arpTimes.length ) {

				this.beats++;
				this.arpTimes = this.arpKeys[ Math.floor( (this.beats % 4) / 2 ) ];
				this.nextArpTime = Math.floor( LIGHTS.time + 1 ) + this.arpTimes[ 0 ];
				this.nextArpIndex = 0;
			}
			else {

				this.nextArpTime = Math.floor( LIGHTS.time ) + this.arpTimes[ this.nextArpIndex ];
			}
		}

		var stars = this.stars,
			deltaTime = LIGHTS.deltaTime,
			keyIndex = this.nextArpIndex,
			star, starLife, brightness, i, il;

		for( i = 0, il = stars.length; i < il; i++ ) {

		    star = this.stars[ i ];

		    star.life += deltaTime;
			starLife = star.life;

		    if( starLife < star.fadeIn )
		        brightness = starLife / star.fadeIn;
		    else if( starLife > star.fadeOut )
		        brightness = 1 - (starLife - star.fadeOut) / star.fadeOutTime;

		    if( starLife > star.lifeTime ) {

		        brightness = 0;
		        star.life = 0;
		        star.lifeTime = Math.random() * 1 + 0.5;
		        star.fadeIn = (Math.random() * 0.5 + 0.5) * star.lifeTime;
		        star.fadeOut = (Math.random() * 0.5 + 0.5) * (star.lifeTime - star.fadeIn);
		        star.fadeOutTime = star.lifeTime - star.fadeOut;
		    }

			if( isKey && star.key == keyIndex ) {

				star.color.r =
				star.color.g =
				star.color.b = 8;
//				star.color.r = star.colorR;
//				star.color.g = star.colorG;
//				star.color.b = star.colorB;
			}
			else {

//				star.color.r =
//				star.color.g =
//				star.color.b = 0;
				star.color.r *= 0.95;
				star.color.g *= 0.95;
				star.color.b *= 0.95;
			}


//			star.color.r = star.color.g = star.color.b = brightness;
		}

		this.particles.__dirtyColors = true;
	}
};

// ___________________________________________________________________________________________ Tile

LIGHTS.StarTile = function( manager, container ) {

	this.initialize( manager, container );
};

LIGHTS.StarTile.prototype = {

    // _______________________________________________________________________________________ Constructor

	initialize: function( manager, container ) {

        this.manager = manager;
		this.container = container;

		this.particles = manager.particles;
		this.stars = manager.stars;

        this.children = [];
		this.index = manager.tiles.length;

		this.tilePositionX = null;
		this.tilePositionZ = null;

		manager.tiles.push( this );
	},

    // _______________________________________________________________________________________ Update

    update: function() {

    },

    // _______________________________________________________________________________________ Update

    updateTile: function() {

	    var tilePosX = this.container.position.x,
		    tilePosZ = this.container.position.z;

	    if( this.tilePositionX != tilePosX || this.tilePositionZ != tilePosZ ) {

		    var stars = this.manager.stars,
			    tileSize = this.manager.tileSize,
			    particleCount = this.manager.particleCount,
			    i, il;

			for( i = this.index * particleCount, il = (this.index + 1) * particleCount; i < il; i++ ) {

				star = stars[ i ];
				star.position.x = tilePosX + (Math.random() - 0.5) * tileSize;
				star.position.y = Math.random() * 150 + 80;
				star.position.z = tilePosZ + (Math.random() - 0.5) * tileSize;
			}

			this.particles.__dirtyVertices = true;

		    this.tilePositionX = tilePosX;
		    this.tilePositionZ = tilePosZ;
	    }
    }
};

// _______________________________________________________________________________________ STAR

LIGHTS.Star = function() {

	this.initialize();
};

LIGHTS.Star.prototype = {

    // _______________________________________________________________________________________ Constructor

	initialize: function() {

        this.position = null;
        this.color = null;
//		this.colorR = 0;
//		this.colorG = 0;
//		this.colorB = 0;
        this.life = Math.random() * 4;
        this.lifeTime = 0;
        this.fadeIn = 0;
        this.fadeOut = 0;
		this.key = Math.floor( Math.random() * 4 );

		if( this.key == 3 )
			this.key = 4;
		else if( this.key == 1 && Math.random() > 0.5 )
			this.key = 3;
    }
};

/**
 * Created by JetBrains WebStorm.
 * User: C4RL05
 * Date: 20/08/2011
 * Time: 17:20
 * To change this template use File | Settings | File Templates.
 */

LIGHTS.TerrainDotAvatars = function( manager ) {

	this.initialize( manager );
};

LIGHTS.TerrainDotAvatars.prototype = {

	avatarCount:    9,

    // _______________________________________________________________________________________ Constructor

	initialize: function( manager ) {

		this.manager = manager;
		this.player = manager.director.player;

		this.avatars = [];

		var ellieCount = 0,
			userCount = 0,
			sizeX, sizeY, avatarImage, i, il;

		for( i = 0, il = this.avatarCount; i < il; i++ ) {

			sizeX = (i % 3 == 1)? 22 : 21;
			sizeY = (Math.floor( i / 3 ) == 1)? 22 : 21;
			sizeX = sizeY = 22;

			if( i % 2 == 0 )
				avatarImage = LIGHTS.images[ 'ellieAvatar' + ellieCount++ ];
			else
				avatarImage = LIGHTS.images[ 'avatar' + userCount++ ];

			avatar = new LIGHTS.TerrainDotAvatar( avatarImage, sizeX, sizeY );
			avatar.index = i;
			this.avatars.push( avatar );
		}
	}
};

// ___________________________________________________________________________________________ TerrainDotsWord

LIGHTS.TerrainDotAvatar = function( image, sizeX, sizeY ) {

	this.initialize( image, sizeX, sizeY );
};

LIGHTS.TerrainDotAvatar.prototype = {

	opacity:    2,

    // _______________________________________________________________________________________ Constructor

	initialize: function( image, sizeX, sizeY ) {

        // ImageData
        var imageCanvas = document.createElement( 'canvas' ),
            imageContext = imageCanvas.getContext( '2d' ),
            opacity = this.opacity, // Wipe
//            opacity = this.opacity / 255, // Fade
            imageData, colorsX, x, y, i, r, g, b;

        imageContext.drawImage( image, 0, 0, sizeX, sizeY );
        imageData = imageContext.getImageData( 0, 0, sizeX, sizeY ).data;

		this.width = sizeX;
		this.height = sizeY;

		// Dots
		this.colors = [];

		for( x = 0; x < sizeX; x++ ) {

			colorsX = [];

			for( y = 0; y < sizeY; y++ ) {

				i = (x + y * sizeX) * 4;

				// Wipe
				r = Math.floor( imageData[ i++ ] * opacity );
				g = Math.floor( imageData[ i++ ] * opacity );
				b = Math.floor( imageData[ i++ ] * opacity );
//				colorsX.push( (r << 16) + (g << 8) + b );
				colorsX.push( [ r / 255, g / 255, b / 255 ] );

				// Fade
//				r = imageData[ i++ ] * opacity;
//				g = imageData[ i++ ] * opacity;
//				b = imageData[ i++ ] * opacity;
//				colorsX.push( [ r, g, b ] );
			}

			this.colors.push( colorsX );
		}
	}
};

/*
//returns a function that calculates lanczos weight
function lanczosCreate(lobes){
  return function(x){
    if (x > lobes)
      return 0;
    x *= Math.PI;
    if (Math.abs(x) < 1e-16)
      return 1
    var xx = x / lobes;
    return Math.sin(x) * Math.sin(xx) / x / xx;
  }
}

//elem: canvas element, img: image element, sx: scaled width, lobes: kernel radius
function thumbnailer(elem, img, sx, lobes){
    this.canvas = elem;
    elem.width = img.width;
    elem.height = img.height;
    elem.style.display = "none";
    this.ctx = elem.getContext("2d");
    this.ctx.drawImage(img, 0, 0);
    this.img = img;
    this.src = this.ctx.getImageData(0, 0, img.width, img.height);
    this.dest = {
        width: sx,
        height: Math.round(img.height * sx / img.width),
    };
    this.dest.data = new Array(this.dest.width * this.dest.height * 3);
    this.lanczos = lanczosCreate(lobes);
    this.ratio = img.width / sx;
    this.rcp_ratio = 2 / this.ratio;
    this.range2 = Math.ceil(this.ratio * lobes / 2);
    this.cacheLanc = {};
    this.center = {};
    this.icenter = {};
    setTimeout(this.process1, 0, this, 0);
}

/*
thumbnailer.prototype.process1 = function(self, u){
    self.center.x = (u + 0.5) * self.ratio;
    self.icenter.x = Math.floor(self.center.x);
    for (var v = 0; v < self.dest.height; v++) {
        self.center.y = (v + 0.5) * self.ratio;
        self.icenter.y = Math.floor(self.center.y);
        var a, r, g, b;
        a = r = g = b = 0;
        for (var i = self.icenter.x - self.range2; i <= self.icenter.x + self.range2; i++) {
            if (i < 0 || i >= self.src.width)
                continue;
            var f_x = Math.floor(1000 * Math.abs(i - self.center.x));
            if (!self.cacheLanc[f_x])
                self.cacheLanc[f_x] = {};
            for (var j = self.icenter.y - self.range2; j <= self.icenter.y + self.range2; j++) {
                if (j < 0 || j >= self.src.height)
                    continue;
                var f_y = Math.floor(1000 * Math.abs(j - self.center.y));
                if (self.cacheLanc[f_x][f_y] == undefined)
                    self.cacheLanc[f_x][f_y] = self.lanczos(Math.sqrt(Math.pow(f_x * self.rcp_ratio, 2) + Math.pow(f_y * self.rcp_ratio, 2)) / 1000);
                weight = self.cacheLanc[f_x][f_y];
                if (weight > 0) {
                    var idx = (j * self.src.width + i) * 4;
                    a += weight;
                    r += weight * self.src.data[idx];
                    g += weight * self.src.data[idx + 1];
                    b += weight * self.src.data[idx + 2];
                }
            }
        }
        var idx = (v * self.dest.width + u) * 3;
        self.dest.data[idx] = r / a;
        self.dest.data[idx + 1] = g / a;
        self.dest.data[idx + 2] = b / a;
    }

    if (++u < self.dest.width)
        setTimeout(self.process1, 0, self, u);
    else
        setTimeout(self.process2, 0, self);
};

thumbnailer.prototype.process2 = function(self){
    self.canvas.width = self.dest.width;
    self.canvas.height = self.dest.height;
    self.ctx.drawImage(self.img, 0, 0);
    self.src = self.ctx.getImageData(0, 0, self.dest.width, self.dest.height);
    var idx, idx2;
    for (var i = 0; i < self.dest.width; i++) {
        for (var j = 0; j < self.dest.height; j++) {
            idx = (j * self.dest.width + i) * 3;
            idx2 = (j * self.dest.width + i) * 4;
            self.src.data[idx2] = self.dest.data[idx];
            self.src.data[idx2 + 1] = self.dest.data[idx + 1];
            self.src.data[idx2 + 2] = self.dest.data[idx + 2];
        }
    }
    self.ctx.putImageData(self.src, 0, 0);
    self.canvas.style.display = "block";
};
*/
/**
 * Created by JetBrains WebStorm.
 * User: C4RL05
 * Date: 01/08/2011
 * Time: 11:19
 * To change this template use File | Settings | File Templates.
 */

LIGHTS.TerrainDotsManager = function( director ) {

	this.initialize( director );
};

LIGHTS.TerrainDotsManager.prototype = {

    // _______________________________________________________________________________________ Group

    active:         false,

    beats:          0,
    grid:           [],
	tiles:          [],
	circles:        [],

    brightColor:    new THREE.Color( 0xFFFFFF ),
    darkColor:      new THREE.Color( 0x000000 ),
    debugColor:     new THREE.Color( 0xFF0000 ),

	activeMult:     1, //0.35,

	avatarOrder:    [ [0, 4], 8, 2, 6, 1, 5, [3, 7] ],
	avatarPosX:     [ 0, 22, 44,  0, 22, 44,  0, 22, 44 ],
	avatarPosY:     [ 0,  0,  0, 22, 22, 22, 44, 44, 44 ],

	rgbColors:      [ [ 1, 0, 0 ], [ 0, 1, 0 ], [ 0, 0, 1 ], [ 1, 1, 0 ], [ 0, 1, 1 ], [ 1, 0, 1 ] ],
/*
	arpKeys:        [ 0, 0.255, 0.38, 0.63, 0.75,
					  1, 1.255, 1.38, 1.63, 1.75,
					  2, 2.125, 2.38, 2.50, 2.75,
					  3, 3.125, 3.38, 3.50, 3.75,
					  4, 4.255, 4.38, 4.63, 4.75,
					  5, 5.255, 5.38, 5.63, 5.75,
					  6, 6.125, 6.38, 6.50, 6.75,
					  7, 7.125, 7.38, 7.50, 7.75 ],
*/
	arpKeys:        [     0, 0.375, 0.750,
					  1.000, 1.375, 1.750,
					  2.125, 2.500, 2.750,
					  3.125, 3.500, 3.750,
					  4.000, 4.375, 4.750,
					  5.000, 5.375, 5.750,
					  6.125, 6.500, 6.750,
					  7.125, 7.500, 7.750 ],

    // _______________________________________________________________________________________ Constructor

    initialize: function( director ) {

	    this.director = director;
	    this.terrainPlane = director.terrain.terrainPlane;
	    this.displacement = director.terrain.displacement;

        // Geometry
	    var x, y, i, dot, pv, tv;

        this.geometry = new THREE.Geometry(),
        this.geometry.colors = [];
	    this.terrainVertices = [];
	    this.particleVertices = [];
	    this.dots = [];
	    this.avatar = null;

        for( x = 0, i = 0; x < LIGHTS.Terrain.prototype.mapResolution; x++ ) {

            this.grid[ x ] = [];

            for( y = 0; y < LIGHTS.Terrain.prototype.mapResolution; y++ ) {

                this.grid[ x ][ y ] = i++;
	            tv = director.terrain.terrainPlane.vertexGrid[ x ][ y ];
	            pv = new THREE.Vertex( tv.position.clone() );
                this.terrainVertices.push( tv );
                this.particleVertices.push( pv );
                this.geometry.colors.push( new THREE.Color( 0x00FFFF ) );

	            dot = new LIGHTS.TerrainDot( pv.position );
	            dot.index = i - 1;
	            this.dots.push( dot );
            }
        }

	    this.geometry.vertices = this.terrainVertices;

	    texture = new THREE.Texture( LIGHTS.images.terrainDot );
	    texture.needsUpdate = true;

        // Material
        this.material = new THREE.ParticleBasicMaterial( {
            vertexColors: true,
            size: 20,
            color: 0xC0C0C0,
//            color: 0xFFFFFF,
//            map: THREE.ImageUtils.loadTexture( "images/cyan_plasma_ball.png" ),
//            map: THREE.ImageUtils.loadTexture( "images/small_plasma_ball.png" ),
//            map: THREE.ImageUtils.loadTexture( "images/plasma_ball.png" ),
//            map: THREE.ImageUtils.loadTexture( "images/particle.png" ),
//          map: LIGHTS.Utils.getCircleTexture( 32 ),
	        map: texture,
            blending: THREE.AdditiveBlending,
            transparent: true
        } );

        this.beatTime = 0.1;
		this.allPainted = 1;

	    for( i = 0; i < 6; i++ )
	        this.circles.push( new LIGHTS.TerrainCircle( i ) );

//	    this.setupWords();
    },

    // _______________________________________________________________________________________ Events

    launch: function() {

        switch( LIGHTS.Music.phase.index ) {

            case 0:
				this.beats = 1;
	            this.material.color.setHex( 0xC0C0C0 );
	            this.material.size = 20;
	            this.resetDots();
	            this.paintAll( 0, true );
	            this.geometry.vertices = this.terrainVertices;
	            this.dirtyVertices = true;
	            break;

	        case 1:
	        case 2:
		        this.paintCircles( 16, true );
				break;

            case 3:
	            this.paintAll( 2, true );
	            break;

            case 4:
            case 6:
            case 12:
	            this.paintAll( 1, true );
	            break;

            case 5:
	            this.resetParticles();
	            this.setupWords();
	            this.launchWords();
	            this.geometry.vertices = this.particleVertices;
	            this.dirtyVertices = true;
	            this.nextBeat = 1;
                break;

	        case 7:
	            this.paintAll( 0 );
	            break;

		    case 11:
			    this.resetDots();
			    this.material.size = 32;
			    this.paintAll( 1, true );
			    this.geometry.vertices = this.terrainVertices;
			    this.dirtyVertices = true;
			    break;

            case 13:
	            this.setupAvatars();
	            this.launchAvatars();
	            this.paintAll( 1, true );
                break;

		    case 15: // D1
			    this.material.size = 20;
			    this.resetDots();
			    this.paintAll( 0, true );
			    this.paintCircles( 192 );
		        break;

	        case 16: // S!
		        this.material.size = 20;
		        this.paintAll( 1, true );
		        break;

	        case 17: // C3
		        this.material.color.setHex( 0xFFFFFF );
		        this.paintAll( 0, true );
		        this.paintCircles( 128 );
		        break;

	        case 18: // C3b
	        case 19: // C3c
	        case 20: // C3d
		        this.paintAll( 0, true );
		        this.paintCircles( 128 );
		        break;

	        case 21:
		        this.resetParticles();
		        this.paintAll( 1, true );
//		        this.geometry.vertices = this.terrainVertices;
//		        this.dirtyVertices = true;
		        this.beats = 0;
	            break;

	        case 22:
		        this.paintAll( 0, true );
		        this.paintCircles( 128 );
		        this.setupMoveUp();
		        this.geometry.vertices = this.particleVertices;
		        this.dirtyVertices = true;
	            break;
        }
    },

    beat: function() {

        switch( LIGHTS.Music.phase.index ) {

            case 1:
		        if( this.beats % 2 == 0 )
		            this.paintCircles( 16, true );
		        break;

	        case 2:
				this.paintCircles( 12, true );
		        break;

            case 3:
	        case 4:
	        case 6:
		        this.paintCircles( 32 );
		        break;

	        case 5:
		        if( this.nextBeat == 0 ) {

			        this.paintCircles( 32 );
		        }
		        else {

			        this.paintAll( 1, true );
			        this.nextBeat--;
		        }
	            break;

		    case 11:
	        case 12:
		        this.paintCircles( 8 );
                break;

	        case 13:
	        case 14:
		        if( this.beats % 2 == 0 )
			        this.launchAvatar();
				break;

            case 15:
                break;

            case 17:
            case 18:
            case 19:
            case 20:
                break;

	        case 21:
		        var beats21 = [ 12, 14 ];

	            if( this.beats % 2 == 1 || beats21.indexOf( this.beats ) != -1 ) {

		            this.paintAll( 0, true );
		            this.paintCircles( 128 );
	            }
                break;
        }
        this.beats++;
    },

    // _______________________________________________________________________________________ Update

    update: function() {

		this.geometry.__dirtyVertices = this.dirtyVertices || this.terrainPlane.__dirtyVertices;
	    this.dirtyVertices = false;

	    switch( LIGHTS.Music.phase.index ) {

		    case 0:
			    this.paintDarker( true, false, 4 );
			    this.updateMovingCircles();
			    break;

		    case 1:
		    case 2:
			    this.paintDarker( true, false, 3 );
			    break;

		    case 3:
		    case 4:
		        this.paintDarker( true, false, 1 );
		        break;

	        case 5:
	        case 6:
			    this.moveToWords();
		        this.paintDarker( false, true, 0.5 );
		        break;

		    case 7:
		        this.explodeWords();
		        break;

		    case 11:
		    case 12:
		        this.paintDarker( true, false, 0.5 );
		        break;

	        case 13:
	        case 14:
		        this.paintDarker( false, false, 0.5 );
		        this.updateAvatar();
	            break;

	        case 15:
	            break;

		    case 17:
		    case 18:
		    case 19:
		    case 20:
		        this.paintDarker( true, false, 0.5 );
		        break;

		    case 21:
		        this.paintDarker( true, false, 4 );
		        break;

		    case 22:
		        this.moveUp();
		        break;
	    }
    },

    // _______________________________________________________________________________________ Private

    // _______________________________________________________________________________________ Canvas

	paintAll: function( grey, force ) {

		var colors = this.geometry.colors,
			dots = this.dots,
		    il = dots.length,
		    i, dot, color;

		for( i = 0; i < il; i++ ) {

			dot = dots[ i ];

			if( force || ! dot.isActive ) {

				color = colors[ dot.index ];
				color.r = color.g = color.b = grey;
			}
		}

		this.allPainted = grey;
	    this.geometry.__dirtyColors = true;
	},

	paintDarker: function( force, blend, darkness ) {

		var colors = this.geometry.colors,
			activeMult = this.activeMult,
			dots = this.dots,
		    il = dots.length,
			dark = 1 - darkness * LIGHTS.deltaTime,
		    i, dot, color, active;

		for( i = 0; i < il; i++ ) {

			dot = dots[ i ];
			active = dot.isActive;

			if( force || ! active ) {

				color = colors[ dot.index ];
				color.r *= dark;
				color.g *= dark;
				color.b *= dark;
			}
			else if( blend ) {

				color = colors[ dot.index ];

				if( color.r > activeMult )
					color.r *= dark;

				if( color.g > activeMult )
					color.g *= dark;

				if( color.b > activeMult )
					color.b *= dark;
			}
		}

	    this.geometry.__dirtyColors = true;
	},

	paintCircles: function( count, isWhite ) {

        var colors = this.geometry.colors,
            res = LIGHTS.Terrain.prototype.mapResolution,
            isColor = (isWhite === undefined || isWhite === false),
            dots = this.dots,
            grid = this.grid,
            activeMult = this.activeMult,
            radius, radius2, centerX, centerY, rgb, colorR, colorG, colorB, colorRi, colorGi, colorBi,
            i, il, x, y, xl, yl, dx, dy, gridX, color, index, dot;

		if( isWhite )
			colorR = colorG = colorB = 2;

		for( i = 0; i < count; i++ ) {

			radius = Math.random() * 4 + 4;
			radius2 = radius * radius;
			radius = Math.floor( radius );
			centerX = Math.floor( Math.random() * res );
			centerY = Math.floor( Math.random() * res );

			if( isColor ) {

				rgb = this.rgbColors[ Math.floor( Math.random() * this.rgbColors.length ) ];
				colorR = rgb[ 0 ];
				colorG = rgb[ 1 ];
				colorB = rgb[ 2 ];
				colorRi = Math.min( colorR + 0.5, 1 ) * activeMult;
				colorGi = Math.min( colorG + 0.5, 1 ) * activeMult;
				colorBi = Math.min( colorB + 0.5, 1 ) * activeMult;
			}

			for( x = centerX - radius, xl = centerX + radius; x <= xl; x++ ) {

				if( x >= 0 )
					gridX = grid[ x % res ];
				else
					gridX = grid[ (x + Math.ceil( -x / res ) * res ) % res ];

				dx = (centerX - x) * (centerX - x);

				for( y = centerY - radius, yl = centerY + radius; y <= yl; y++ ) {

					dy = (centerY - y) * (centerY - y);

					if( dx + dy <= radius2 ) {

						if( y >= 0 )
							index = gridX[ y % res ];
						else
							index = gridX[ (y + Math.ceil( -y / res ) * res ) % res ];

						color = colors[ index ];
						dot = dots[ index ];

						if( dot.isActive ) {

							color.r = colorRi;
							color.g = colorGi;
							color.b = colorBi;
						}
						else {

							color.r += colorR;
							color.g += colorG;
							color.b += colorB;
						}
					}
				}
			}
		}

		this.allPainted = null;
        this.geometry.__dirtyColors = true;
    },

	updateMovingCircles: function() {

        var deltaTime = LIGHTS.deltaTime,
			colors = this.geometry.colors,
            circles = this.circles,
            res = LIGHTS.Terrain.prototype.mapResolution,
            grid = this.grid,
            grey, circle, radius, radius2, centerX, centerY, dist2,
            i, il, x, y, xl, yl, dx, dy, gridX, color, index;

		for( i = 0, il = circles.length; i < il; i++ ) {

			circle = circles[ i ];

			if( circle.delay < 0 ) {

				radius = Math.ceil( circle.radius );
				radius2 = circle.radius * circle.radius;
				centerX = circle.posX;
				centerY = circle.posY;
				grey = circle.grey;

				for( x = centerX - radius, xl = centerX + radius; x <= xl; x++ ) {

				    if( x >= 0 )
					    gridX = grid[ x % res ];
				    else
					    gridX = grid[ (x + Math.ceil( -x / res ) * res ) % res ];

					dx = (centerX - x) * (centerX - x);

					for( y = centerY - radius, yl = centerY + radius; y <= yl; y++ ) {

						dy = (centerY - y) * (centerY - y);
						dist2 = radius2 - (dx + dy);

						if( dist2 >= 0 /*&& dist2 <= 4*/ ) {

							if( y >= 0 )
								index = gridX[ y % res ];
							else
								index = gridX[ (y + Math.ceil( -y / res ) * res ) % res ];

							color = colors[ index ];

							color.r += grey;
							color.g += grey;
							color.b += grey;
						}
					}
				}

				circle.radius += deltaTime * circle.speed;
				circle.grey -= deltaTime * circle.fade;

				if( circle.grey <= 0 )
					circle.reset( 0 );
			}
			else {

				circle.delay -= deltaTime;
			}
		}

		this.allPainted = null;
        this.geometry.__dirtyColors = true;
    },

    // _______________________________________________________________________________________ Avatars

	setupAvatars: function() {

		var dots = this.dots,
			grid = this.grid,
			posX = this.avatarPosX,
			posY = this.avatarPosY,
			dotAvatars = new LIGHTS.TerrainDotAvatars( this ),
			avatars = dotAvatars.avatars,
			avatar, colors, colorsX, gridX, dot, avatarDots, avatarDotsX, avatarColor, dotColor,
			i, il, x, y, w, h, dx, dy;

		this.avatars = avatars;

	    for( i = 0, il = avatars.length; i < il; i++ ) {

		    avatar = avatars[ i ];
		    colors = avatar.colors;
		    w = avatar.width;
		    h = avatar.height;
		    dx = posX[ i ];
		    dy = posY[ i ];

			avatarDots = [];

		    for( x = 0; x < w; x++ ) {

			    colorsX = colors[ x ];
			    gridX = grid[ x + dx ];
			    avatarDotsX = [];

			    for( y = 0; y < h; y++ ) {

			        dot = dots[ gridX[ y + dy ] ];
//				    dot.avatarColor = colorsX[ y ]; // Fade
				    dotColor = dot.avatarColor = new THREE.Color( 0x000000 ); // Wipe
				    avatarColor = colorsX[ y ];
				    dotColor.r = avatarColor[ 0 ];
				    dotColor.g = avatarColor[ 1 ];
				    dotColor.b = avatarColor[ 2 ];
				    avatarDotsX.push( dot );
			    }

			    avatarDots.push( avatarDotsX );
		    }

		    avatar.dots = avatarDots;
	    }
	},

	launchAvatars: function() {

		var dots = this.dots,
			avatars = this.avatars,
			posX = this.avatarPosX,
			posY = this.avatarPosY,
			avatarDots, color,
		    i, il, x, xl, y, yl, w, h, w1, h1;

		// Deactivate
		for( i = 0, il = dots.length; i < il; i++ )
			dots[ i ].isActive = false;

		// Rotate to camera
//		for( i = 0, il = avatars.length; i < il; i++ ) {
//
//			avatar = avatars[ i ];
//			avatarDots = avatar.dots;
//			w = avatar.width;
//			h = avatar.height;
//			w1 = w - 1;
//			h1 = h - 1;
//
//			for( x = 0; x < w; x++ ) {
//
//				for( y = 0; y < h; y++ ) {
//
//					avatarDots[ x ][ y ].currentAvatarColor = avatarDots[ y ][ w1 - x ].avatarColor;
//				}
//
//				avatarDots.push( avatarDotsX );
//			}
//		}

		this.avatarNext = 0;
	},

	launchAvatar: function() {

		if( this.avatarNext > -1 ) {

			if( this.avatarNext < this.avatarOrder.length ) {

				if( this.avatarOrder[ this.avatarNext ] instanceof Array )
					this.avatar = null;
				else
					this.avatar = this.avatars[ this.avatarOrder[ this.avatarNext ] ];

				this.avatarNext++;
				this.avatarLine = 0;
			}
			else {

				this.avatarNext = -1;
			}
		}
	},

	updateAvatar: function() {

		if( this.avatarNext > 0 ) {

			if( this.avatarLine !== null ) {

				var colors = this.geometry.colors,
					isMulti = (this.avatar === null),
					lines = Math.ceil( LIGHTS.deltaTime * 30 ),
				    a, al, il, i, j, jl, dot, dotLine, color, avatarColor;

				for( a = 0, al = isMulti? 2 : 1; a < al; a++ ) {

					dots = isMulti? this.avatars[ this.avatarOrder[ this.avatarNext - 1 ][ a ] ].dots : this.avatar.dots;

					for( j = this.avatarLine, jl = Math.min( dots.length, this.avatarLine + lines ); j < jl; j++ ) {

						dotLine = dots[ j ];

						for( i = 0, il = dotLine.length; i < il; i++ ) {

							dot = dotLine[ i ];
							dot.isActive = true;
							color = colors[ dot.index ];
							avatarColor = dot.avatarColor;

							color.r = avatarColor.r;
							color.g = avatarColor.g;
							color.b = avatarColor.b;
						}
					}
				}

				this.geometry.__dirtyColors = true;

				this.avatarLine += lines;

				if( this.avatarLine >= dots.length )
					this.avatarLine = null;
			}
		}
	},

	updateAvatarFade: function() {

		if( this.avatarNext > 0 ) {

			var colors = this.geometry.colors,
				avatar = this.avatar,
				dots = avatar.dots,
				height = avatar.height,
				ease = LIGHTS.deltaTime * 2,
			    x, xl, yl, y, dot, dotLine, color, avatarColor;

			for( x = 0, xl = avatar.width; x < xl; x++ ) {

				dotLine = dots[ x ];

				for( y = 0, yl = height; y < yl; y++ ) {

					dot = dotLine[ y ];
					dot.isActive = true;
					color = colors[ dot.index ];
					avatarColor = dot.avatarColor;

					color.r -= (color.r - avatarColor[ 0 ]) * ease;
					color.g -= (color.g - avatarColor[ 1 ]) * ease;
					color.b -= (color.b - avatarColor[ 2 ]) * ease;
				}
			}

			this.geometry.__dirtyColors = true;

			this.avatarTime -= LIGHTS.deltaTime;

			if( this.avatarTime < 0 )
				this.launchAvatar();
		}
	},

    // _______________________________________________________________________________________ Words

	setupWords: function() {

		var i, j, wordDots, tries, u, a, r, speed;

	    this.text = new LIGHTS.TerrainDotsText( this );

	    for( i = 0; i < this.text.words.length; i++ ) {

		    wordDots = this.text.words[ i ].dots;

		    for( j = 0; j < wordDots.length; j++ ) {

				// Find available dot
			    tries = 1000;

				do {

					dot = this.dots[ Math.floor( Math.random() * this.dots.length ) ];

				} while( --tries > 0 && dot.isText );

			    if( dot.isText ) {

				    console.log( "ERROR: LIGHTS.TerrainDotsManager.setupWords: Dot without text not found!" );
				}
			    else {

				    dot.isText = true;
				    dot.delay = i + 0.2 + Math.random() * 0.5;
					dot.wordPosition = wordDots[ j ];

				    u = Math.random() * 2 - 1;
					a = Math.random() * rad360;
					r = Math.sqrt( 1 - u * u );
				    speed = Math.random() * 96 + 64;

				    dot.velocity.x = Math.cos( a ) * r * speed;
				    dot.velocity.y = u * speed;
				    dot.velocity.z = Math.sin( a ) * r * speed;
			    }
		    }
	    }
	},

	launchWords: function() {

		var dots = this.dots,
		    il = dots.length,
		    i, dot;

		for( i = 0; i < il; i++ ) {

			dot = dots[ i ];

			if( dot.isText ) {

				dot.isActive = true;
				dot.ease = 2.5 + Math.random();
			}
		}
	},

	moveToWords: function() {

		this.text.update();

	    var deltaTime = LIGHTS.deltaTime,
	        dots = this.dots,
	        il = dots.length,
	        i, dot, ease, position, wordPosition;

	    for( i = 0; i < il; i++ ) {

		    dot = dots[ i ];

		    if( dot.isText ) {

			    if( dot.delay < 0 ) {

				    position = dot.position;
			        wordPosition = dot.wordPosition;
				    ease = deltaTime * dot.ease;

				    position.x -= (position.x - wordPosition.x) * ease;
				    position.y -= (position.y - wordPosition.y) * ease;
				    position.z -= (position.z - wordPosition.z) * ease;

				    dot.ease -= (dot.ease - 10) * ease * 0.1;
			    }
			    else
			        dot.delay -= deltaTime;
		    }
	    }

	    this.dirtyVertices = true;
    },

	explodeWords: function() {

	    var deltaTime = LIGHTS.deltaTime,
		    colors = this.geometry.colors,
	        dots = this.dots,
	        il = dots.length,
	        dark = 1 - deltaTime * 2,
	        i, dot, ease, position, velocity, drag, color;

	    for( i = 0; i < il; i++ ) {

		    dot = dots[ i ];

		    if( dot.isText ) {

				position = dot.position;
				velocity = dot.velocity;

				position.x += velocity.x * deltaTime;
				position.y += velocity.y * deltaTime;
				position.z += velocity.z * deltaTime;

				drag = 1 - dot.drag * deltaTime;
				velocity.x *= drag;
				velocity.y *= drag;
				velocity.z *= drag;

				color = colors[ dot.index ];
				color.r *= dark;
				color.g *= dark;
				color.b *= dark;
		    }
	    }

	    this.dirtyVertices = true;
		this.geometry.__dirtyColors = true;
    },

	resetDots: function() {

		var dots = this.dots,
		    il = dots.length,
		    i, dot;

		for( i = 0; i < il; i++ )
			dots[ i ].reset();
	},

    // _______________________________________________________________________________________ Particles

	updateTerrainParticles: function() {

		var terrainVertices = this.terrainVertices,
			dots = this.dots,
		    il = dots.length,
		    i, dot, position, terrainPosition;

		for( i = 0; i < il; i++ ) {

			dot = dots[ i ];

			if( ! dot.isText && ! dot.isAvatar ) {

				position = dot.position;
				terrainPosition = terrainVertices[ i ].position;

				position.x = terrainPosition.x;
				position.y = terrainPosition.y;
				position.z = terrainPosition.z;
			}
		}
	},

	resetParticles: function() {

		var terrainVertices = this.terrainVertices,
			particleVertices = this.particleVertices,
			dots = this.dots,
		    il = dots.length,
		    particlePosition, terrainPosition, i;

		for( i = 0; i < il; i++ ) {

			position = particleVertices[ i ].position;
			terrainPosition = terrainVertices[ i ].position;

			position.x = terrainPosition.x;
			position.y = terrainPosition.y;
			position.z = terrainPosition.z;

			dots[ i ].reset();
		}
	},

    // _______________________________________________________________________________________ Private

    showDebug: function() {

        var colors = this.geometry.colors,
            res = LIGHTS.Terrain.prototype.mapResolution,
            grid = this.grid,
            debugColor = this.debugColor,
            x, y, gridX;

        for( x = 0; x < res; x++ ) {

            gridX = grid[ x ];

            for( y = 0; y < res; y++ )
                colors[ gridX[ y ] ] = debugColor;
        }

        this.geometry.__dirtyColors = true;
    },

    show: function( visible ) {

		var tiles = this.tiles,
			i, il;

		for( i = 0, il = tiles.length; i < il; i++ )
			tiles[ i ].particleSystem.visible = visible;
    },
/*
    showStripeX: function( advance ) {

        var colors = this.geometry.colors,
            res = LIGHTS.Terrain.prototype.mapResolution,
            grid = this.grid,
            step = advance? this.beats % 8 : 0,
            brightColor = this.brightColor,
            darkColor = this.darkColor,
            x, y, gridX, color;

        for( x = 0; x < res; x++ ) {

            gridX = grid[ x ];
            color = ((x+step) % 8 >= 4)? brightColor : darkColor;

            for( y = 0; y < res; y++ )
                colors[ gridX[ y ] ] = color;
        }

        this.geometry.__dirtyColors = true;
    },

	showStripeY: function( advance ) {

	    var colors = this.geometry.colors,
	        res = LIGHTS.Terrain.prototype.mapResolution,
	        grid = this.grid,
		    step = advance? this.beats % 8 : 0,
	        brightColor = this.brightColor,
	        darkColor = this.darkColor,
	        x, y, color;

	    for( y = 0; y < res; y++ ) {

	        color = ((y+step) % 8 >= 4)? brightColor : darkColor;

	        for( x = 0; x < res; x++ )
	            colors[ grid[ x ][ y ] ] = color;
	    }

	    this.geometry.__dirtyColors = true;
	},
*/
	setupMoveUp: function() {

	    var dots = this.dots,
		    colors = this.geometry.colors,
	        arpKeys = this.arpKeys,
	        arpKeyCount = arpKeys.length,
	        i, il, dot, dotColor, color;

	    for( i = 0, il = dots.length; i < il; i++ ) {

		    dot = dots[ i ];
			dot.position.y = 0;

		    dot.delay = arpKeys[ Math.floor( Math.random() * arpKeyCount ) ];
		    dot.height = Math.random() * 150 + 50;
		    dot.ease = 2 + Math.random();

		    dotColor = dot.color;
			color = colors[ i ];
		    dotColor.r = color.r;
		    dotColor.g = color.g;
		    dotColor.b = color.b;
	    }

		this.geometry.__dirtyColors = true;
    },

    moveUp: function() {

	    var deltaTime = LIGHTS.deltaTime,
	        dots = this.dots,
	        terrainVertices = this.terrainVertices,
	        colors = this.geometry.colors,
	        i, il, dot, dotColor, intensity, color;

	    for( i = 0, il = dots.length; i < il; i++ ) {

		    dot = dots[ i ];

		    if( dot.delay < 0 ) {

			    dot.position.y -= (dot.position.y - dot.height) * deltaTime * dot.ease;
			    dotColor = dot.color;
			    color = colors[ i ];
			    intensity = 1 - (dot.position.y / dot.height);
			    color.r = dotColor.r * intensity;
			    color.g = dotColor.g * intensity;
			    color.b = dotColor.b * intensity;
		    }
		    else {

			    dot.position.y = terrainVertices[ i ].position.y;
			    dot.delay -= deltaTime;
		    }
	    }

	    this.geometry.__dirtyColors = true;
	    this.dirtyVertices = true;
    }
};

// ___________________________________________________________________________________________ Dot

LIGHTS.TerrainDot = function( pos ) {

	this.initialize( pos );
};

LIGHTS.TerrainDot.prototype = {

    // _______________________________________________________________________________________ Constructor

	initialize: function( pos ) {

		this.position = pos;
		this.delay = 0;
		this.avatarColor = null;
		this.color = new THREE.Color();
		this.index = null;
		this.velocity = new THREE.Vector3();
		this.drag = Math.random() * 0.01 + 0.005;

		this.reset();
	},

	reset: function() {

		this.isText = false;
		this.isAvatar = false;
		this.isActive = false;
	}
};

// ___________________________________________________________________________________________ Dot

LIGHTS.TerrainCircle = function( index ) {

	this.initialize( index );
};

LIGHTS.TerrainCircle.prototype = {

    // _______________________________________________________________________________________ Constructor

	initialize: function( index ) {

		this.index = index;

		this.reset( index );
	},

	reset: function( delay ) {

		this.active = false;
		this.posX = Math.floor( Math.random() * LIGHTS.Terrain.prototype.mapResolution );
		this.posY = Math.floor( Math.random() * LIGHTS.Terrain.prototype.mapResolution );
		this.radius = 0;
		this.grey = 1.2;
		this.delay = delay;
		this.speed = Math.random() * 25 + 5;
		this.fade = 2;
	}
};

// ___________________________________________________________________________________________ Tile

LIGHTS.TerrainDotsTile = function( manager ) {

	this.initialize( manager );
};

LIGHTS.TerrainDotsTile.prototype = {

    // _______________________________________________________________________________________ Constructor

	initialize: function( manager ) {

        this.manager = manager;

        this.children = [];

        this.particleSystem = new THREE.ParticleSystem( manager.geometry, manager.material );
        this.particleSystem.sortParticles = false;
        this.particleSystem.position.y = 3;
        this.children.push( this.particleSystem );

		manager.tiles.push( this );
    },

    // _______________________________________________________________________________________ Update

    update: function() {

    }
};
/**
 * Created by JetBrains WebStorm.
 * User: C4RL05
 * Date: 12/08/2011
 * Time: 10:12
 * To change this template use File | Settings | File Templates.
 */

LIGHTS.TerrainDotsText = function( manager ) {

	this.initialize( manager );
};

LIGHTS.TerrainDotsText.prototype = {

	textScale:      phi,

    // _______________________________________________________________________________________ Constructor

	initialize: function( manager ) {

		this.manager = manager;
		this.player = manager.director.player;

		this.words = [];

		var size = LIGHTS.Terrain.prototype.tileSize,
			s1 = size * (1/3 - 0.5),
			s2 = size * (2/3 - 0.5),
			s3 = size * 0.5,
			positions = [],
			position, word, i;

		positions.push( [ s1,  80, s1 ] );
		positions.push( [ s1,  90, s2 ] );
		positions.push( [ s1, 100, s3 ] );

		positions.push( [ s2, 120, s1 ] );
		positions.push( [ s2, 130, s2 ] );
		positions.push( [ s2, 140, s3 ] );

		positions.push( [ s3, 150, s1 ] );
		positions.push( [ s3, 160, s2 ] );
		positions.push( [ s3, 170, s3 ] );

		for( i = 0; i < LIGHTS.tweets.length; i++ ) {

			pos = positions[ i ];
			position = new THREE.Vector3( pos[ 0 ], pos[ 1 ], pos[ 2 ] );
			word = new LIGHTS.TerrainDotsWord( '@' + LIGHTS.tweets[ i ], position );
			this.words.push( word );
		}
	},

    // _______________________________________________________________________________________ Update

	update: function() {

		var words = this.words,
			il = words.length,
			angle = this.player.angle,
			i;

		for( i = 0; i < il; i++ )
			words[ i ].update( angle );
	}
};

// ___________________________________________________________________________________________ TerrainDotsWord

LIGHTS.TerrainDotsWord = function( word, position ) {

	this.initialize( word, position );
};

LIGHTS.TerrainDotsWord.prototype = {

    // _______________________________________________________________________________________ Constructor

	initialize: function( word, position ) {

		this.word = word;
		this.position = position;
		this.rotation = Math.random() * rad360;
		this.scale = LIGHTS.TerrainDotsText.prototype.textScale;
		this.rotationSpeed = Math.random() * 0.1 + 0.1;
		this.rotationSpeed *= (Math.random() > 0.5)? 1 : -1;
		this.floatFreq = Math.random() * 5 + 5;
		this.floatAmp = Math.random() * 5 + 5;

		// Dots
		this.pixels = [];
		this.dots = [];

		var x = 0,
			i, j, fontChar, dot, w2, xoffset, yoffset;

		for( i = 0; i < word.length; i++ ) {

			fontChar = LIGHTS.DotsFont.font[ word.charCodeAt( i ) ];
			xoffset = fontChar.xoffset;
			yoffset = fontChar.yoffset;

			if( fontChar !== undefined ) {

				pixels = fontChar.pixels;

				for( j = 0; j < pixels.length; j++ ) {

					pixel = pixels[ j ];
					this.pixels.push( [ pixel[ 0 ] + xoffset + x, pixel[ 1 ] + yoffset ] );
					this.dots.push( new THREE.Vector3() );
				}

				x += fontChar.xadvance;
			}
			else {

				console.log( "ERROR: LIGHTS.TerrainDotsWord: Char not found in font!" );
			}
		}

		this.width = x;

		// Center
		w2 = x / 2;

		for( i = 0; i < this.pixels.length; i++ )
			this.pixels[ i ][ 0 ] -= w2;
	},

    // _______________________________________________________________________________________ Update

	update: function( angle ) {

		var pixels = this.pixels,
			dots = this.dots,
			posX = this.position.x,
			posY = this.position.y,
			posZ = this.position.z,
			scaleX = this.scale,
			scaleY = this.scale,
			s = Math.sin( this.rotation ),
			c = Math.cos( this.rotation ),
			il = pixels.length,
			dy = Math.sin( ((LIGHTS.time % this.floatFreq) / this.floatFreq) * rad360 ) * this.floatAmp,
			i, px, py, pz, pixel, dot;

		// sin( rotation - angle )
		if( s * Math.cos( angle ) - c * Math.sin( angle ) < 0 )
			scaleX = -scaleX;

		for( i = 0; i < il; i++ ) {

			pixel = pixels[ i ];
			px = pixel[ 0 ] * scaleX * s;
			py = pixel[ 1 ] * scaleY;
			pz = pixel[ 0 ] * scaleX * c;

			dot = dots[ i ];
			dot.x = posX + px;
			dot.y = posY - py + dy;
			dot.z = posZ + pz;
		}

		this.rotation += this.rotationSpeed * LIGHTS.deltaTime;
	},

	toString: function() {

		var pixels = this.pixels,
			dots = this.dots,
			posX = this.position.x,
			posY = this.position.y,
			posZ = this.position.z,
			scale = this.scale,
			matrix = [],
			output = '',
			w2 = this.width / 2,
			il = pixels.length,
			i, px, py, pixel;

		for( i = 0; i < il; i++ ) {

			pixel = pixels[ i ];
			px = pixel[ 0 ] + w2;
			py = pixel[ 1 ];

			if( matrix[ py ] === undefined )
				matrix[ py ] = [];

			matrix[ py ][ px ] = true;
		}

		for( py = 0; py < matrix.length; py++ ) {

			if( matrix[ py ] !== undefined )
				for( px = 0; px < matrix[ py ].length; px++ )
					output += (matrix[ py ][ px ] == true)? 'X' : ' ';

			output += '\n';
		}

		return output;
	}
};
/**
 * Created by JetBrains WebStorm.
 * User: C4RL05
 * Date: 01/08/2011
 * Time: 13:45
 * To change this template use File | Settings | File Templates.
 */

LIGHTS.TerrainMeshManager = function( director ) {

	this.initialize( director );
};

LIGHTS.TerrainMeshManager.prototype = {

    // _______________________________________________________________________________________ Group

    active:         false,

	colors:         [ 0xFFFF00, 0x00FFFF, 0xFF00FF, 0xFF0000, 0x00FF00, 0x0000FF ],

    beats:          0,

    // _______________________________________________________________________________________ Constructor

	initialize: function( director ) {

		this.director = director;

        this.geometry = director.terrain.terrainPlane;

        this.terrainMap = new LIGHTS.TerrainMap( director.view.renderer );
		this.terrainMap.texture.wrapS = this.terrainMap.texture.wrapT = THREE.RepeatWrapping;

//		var texture = new THREE.Texture( LIGHTS.images.lines );
//		texture.needsUpdate = true;


//		texture = new THREE.Texture( LIGHTS.images.candy );
//		texture.needsUpdate = true;
//		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
//		texture.repeat.x = texture.repeat.y = 4;


//        texture.magFilter = THREE.LinearMipMapLinearFilter;
//        texture.minFilter = THREE.LinearMipMapLinearFilter;

		var envMap = new THREE.Texture( [

			LIGHTS.images.envMapLeftRight,
			LIGHTS.images.envMapLeftRight,
			LIGHTS.images.envMapTop,
			LIGHTS.images.envMapBottom,
			LIGHTS.images.envMapFrontBack,
			LIGHTS.images.envMapFrontBack
		] );

		envMap.needsUpdate = true;

		this.material = new THREE.MeshBasicMaterial( {
			color: 0x000000,
			map: this.terrainMap.texture,
//			map: texture,
			envMap: envMap,
			reflectivity: 1,
			combine: THREE.MultiplyOperation,
			shading: THREE.SmoothShading
		} );

		director.materialCache.addMaterial( this.material );

        this.mapDots = new LIGHTS.MapDots( this.terrainMap );
        this.mapLines = new LIGHTS.MapLines( this.terrainMap );
        this.mapCircles = new LIGHTS.MapCircles( this.terrainMap );
        this.mapGlows = new LIGHTS.MapGlows( this.terrainMap );
//        this.mapAvatars = new LIGHTS.MapAvatars( this.terrainMap );
	},

    // _______________________________________________________________________________________ Public

    launch: function() {

        switch( LIGHTS.Music.phase.index ) {

	        case 0:
				break;

            case 1:
	            this.mapGlows.launch( this.director.tileManager.balls );
	            this.material.color.setHex( 0xFFFFFF );
                this.material.reflectivity = 0;
	            this.terrainMap.clear();
	            this.terrainMap.update();
	            break;

	        case 2:
		        this.material.reflectivity = 0.2;
		        break;

	        case 3:
		        break;

            case 7:
		        this.material.reflectivity = 0;
	            this.material.color.setHex( 0xFFFFFF );
	            break;

            case 8:
		        this.material.reflectivity = 0.15;
	            break;

	        case 11:
	        case 21:
		        this.material.reflectivity = 0.2;
		        this.mapGlows.update();
				break;

	        case 13:
				this.mapLines.clear();
//	            this.terrainMap.opacity = 0.97;
//	            this.terrainMap.subtract = 0.005;
//		        this.material.reflectivity = 0.2;
//		        this.material.color.setHex( 0x000000 );
		        break;

	        case 14:
		        this.dotCount = 1;
	            break;

	        case 15:
//		        this.mapDots.drawDots( 64 );
//		        this.mapDots.update();
//		        this.terrainMap.update();

		        this.terrainMap.clear( 0x808080 );
//		        this.material.color.setHex( 0xFFFFFF );
//		        this.material.reflectivity = 0.8;
		        this.material.reflectivity = 0.3;
//
//		        this.mapLines.clear();
//
//		        for( var i = 0; i < 9; i++ )
//		            this.mapAvatars.drawAvatar( i );
//
//		        this.terrainMap.post = false;
//		        this.terrainMap.clear();
//		        this.terrainMap.update();
		        break;

	        case 16:
		        this.material.reflectivity = 0;
                this.material.color.setHex( 0x000000 );
//		        this.mapAvatars.clear();
		        this.terrainMap.post = true;
                this.terrainMap.clear();
                this.terrainMap.update();
                break;

            case 17:
	            this.material.reflectivity = 0.3;
	            this.material.color.setHex( 0xFFFFFF );
	            this.mapDots.clear();
	            this.mapCircles.launch();
	            this.terrainMap.update();
//	            this.terrainMap.opacity = 0.98;
//	            this.terrainMap.subtract = 0.005;
//		        this.mapDots.drawDots( 64 );
                break;

	        case 22: // A2
		        this.material.reflectivity = 0;
		        this.mapCircles.clear();

//		        this.material.color.setHex( 0x000000 );
//		        this.terrainMap.clear();
//		        this.terrainMap.update();
	            break;
        }
    },

    beat: function() {

        switch( LIGHTS.Music.phase.index ) {

			case 7:
				this.mapLines.drawLines( 4 );
				break;

			case 8:
				this.mapLines.drawLines( 8 );
				break;

			case 9:
				this.mapLines.drawLines( 16 );
				break;

			case 10:
				this.mapLines.drawLines( 24 );
				break;

			case 11:
			case 12:
//				this.mapLines.rotLines();
				this.mapLines.drawLines( 8 );
				break;

	        case 13:
		        break;

	        case 14:
		        this.mapDots.drawDots( this.dotCount );

		        if( this.beats % 8 == 0 && this.dotCount < 24 )
		            this.dotCount++;
		        break;

	        case 15:
		        this.mapDots.drawDots( this.dotCount );

		        if( this.dotCount < 16 )
		            this.dotCount += 2;

/*
		        if( this.beats % 2 == 0 ) {
			        this.mapColor.setColor( this.colors[ this.beats % this.colors.length ] );
			        this.material.color.setHex( 0xFFFFFF );
			        this.material.reflectivity = 0.8;
		        }
		        else {

			        this.material.color.setHex( 0x000000 );
			        this.material.reflectivity = 0.8;
//			        this.material.reflectivity = 0.8;
		        }
*/
		        break;

			case 17:
	        case 18:
	        case 19:
	        case 20:
	        case 21:
//				this.mapCircles.drawCircles( 32 );
//				this.mapDots.drawDots( 16 );
//				this.mapLines.drawLines( 16 );
				break;
		}

		this.beats++;
    },

    // _______________________________________________________________________________________ Update

    update: function() {

        switch( LIGHTS.Music.phase.index ) {
// REVIEW GLOWS
	        case 1:
	        case 2:
	        case 3:
	        case 4:
	        case 5:
	        case 6:
		        this.mapGlows.update();
		        this.terrainMap.update();
		        break;

            case 7:
	        case 8:
	        case 9:
	        case 10:
		        this.mapLines.update();
				this.mapGlows.update();
		        this.terrainMap.update();
		        break;

		    case 11:
		    case 12:
		    case 16:
                this.mapLines.update();
                this.terrainMap.update();
                break;

	        case 13:
		        this.terrainMap.update();
		        this.material.reflectivity -= this.material.reflectivity * LIGHTS.deltaTime;
		        break;

	        case 14:
	        case 15:
		        this.mapDots.update();
		        this.terrainMap.update();
		        break;

	        case 17:
	        case 18:
	        case 19:
	        case 20:
		        this.mapGlows.update();
                this.mapCircles.update();
                this.terrainMap.update();
                break;

	        case 21:
                this.mapCircles.update();
                this.terrainMap.update();
                break;

	        case 22:
                this.terrainMap.update();
                break;
        }
    },

	animateUVs: function() {

		var uvs = this.geometry.uvGrid;

		for( var i = 0; i < uvs.length; i++ ) {

			var dv = (Math.random() - 0.5) * 0.005;

			for( var j = 0; j < uvs[ i ].length; j++ ) {

				uvs[ j ][ i ].v += dv;
			}

		}

		this.geometry.__dirtyUvs = true;
	}
};

// ___________________________________________________________________________________________ Tile

LIGHTS.TerrainMeshTile = function( manager ) {

	this.initialize( manager );
};

LIGHTS.TerrainMeshTile.prototype = {

    // _______________________________________________________________________________________ Constructor

	initialize: function( manager ) {

        this.manager = manager;

        this.children = [];

        var mesh = new THREE.Mesh( manager.geometry, manager.material );
		mesh.dynamic = true;
        this.children.push( mesh );
	},

    // _______________________________________________________________________________________ Update

    update: function() {

    }
};
/**
 * Created by JetBrains WebStorm.
 * User: C4RL05
 * Date: 11/08/2011
 * Time: 19:01
 * To change this template use File | Settings | File Templates.
 */

LIGHTS.BitmapFont = function( fnt, png ) {

	this.initialize( fnt, png );
};

LIGHTS.BitmapFont.prototype = {

    // _______________________________________________________________________________________ Constructor

	initialize: function( fnt, png ) {

		var canvas = document.createElement( "canvas" );
		canvas.width = png.width;
		canvas.height = png.height;
		var context = canvas.getContext("2d");
		context.drawImage( png, 0, 0 );
		var imageData = context.getImageData( 0, 0, canvas.width, canvas.height ).data;

		var lines = fnt.split( '\n' ),
			lineCount = lines.length,
			dataWidth = png.width,
			id, x, y, width, height, xoffset, yoffset, xadvance, letter,
			words, l;

		this.font = [];

		for( l = 0; l < lineCount; l++ ) {

			words = lines[ l ].split( ' ' );

			if( words[ 0 ] == 'char' ) {

				id = parseInt( words[ 1 ].split( '=' )[ 1 ] );
				x = parseInt( words[ 2 ].split( '=' )[ 1 ] );
				y = parseInt( words[ 3 ].split( '=' )[ 1 ] );
				width = parseInt( words[ 4 ].split( '=' )[ 1 ] );
				height = parseInt( words[ 5 ].split( '=' )[ 1 ] );
				xoffset = parseInt( words[ 6 ].split( '=' )[ 1 ] );
				yoffset = parseInt( words[ 7 ].split( '=' )[ 1 ] );
				xadvance = parseInt( words[ 8 ].split( '=' )[ 1 ] );
				letter = words[ 11 ].split( '=' )[ 1 ].charAt( 1 );

				this.font[ id ] = new LIGHTS.FontChar( imageData, dataWidth, id, x, y, width, height, xoffset, yoffset, xadvance, letter );
			}
		}
	}
};

LIGHTS.FontChar = function( data, dataWidth, id, x, y, width, height, xoffset, yoffset, xadvance, letter ) {

	this.id = id;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.xoffset = xoffset;
	this.yoffset = yoffset;
	this.xadvance = xadvance;
	this.letter = letter;

	// Pixels
	this.pixels = [];

	var xl = x + width,
		yl = y + height,
		xi, yi;

	for( xi = 0; xi < width; xi++ ) {

		for( yi = 0; yi < height; yi++ )
			if( data[ ((x + xi) + ((y + yi) * dataWidth)) * 4 ] > 64 )
				this.pixels.push( [ xi, yi ] );
	}
};

/**
 * Created by JetBrains WebStorm.
 * User: C4RL05
 * Date: 09/08/2011
 * Time: 10:05
 * To change this template use File | Settings | File Templates.
 */

LIGHTS.Input = function() {

	this.initialize();
};

LIGHTS.Input.mouseX = 0;
LIGHTS.Input.mouseY = 0;
LIGHTS.Input.mouseDown = false;
LIGHTS.Input.mouseClick = false;

LIGHTS.Input.keyUp = false;
LIGHTS.Input.keyDown = false;
LIGHTS.Input.keyRight = false;
LIGHTS.Input.keyLeft = false;
LIGHTS.Input.keySpace = false;
LIGHTS.Input.keyReturn = false;

LIGHTS.Input.prototype = {

    // _______________________________________________________________________________________ Constructor

	initialize: function() {

        window.addEventListener( 'keydown', bind( this, this.onKeyDown ), false );
        window.addEventListener( 'keyup',   bind( this, this.onKeyUp ), false );

		this.domElement = document;
        this.domElement.addEventListener( 'mousemove', bind( this, this.onMouseMove ), false );
        this.domElement.addEventListener( 'mousedown', bind( this, this.onMouseDown ), false );
        this.domElement.addEventListener( 'mouseup',   bind( this, this.onMouseUp ), false );
	},

    // _______________________________________________________________________________________ Events

	onMouseMove: function( event ) {

		event.preventDefault();

		var domElement = this.domElement,
		isDom = (domElement != document),
		containerOffsetX = isDom? domElement.offsetLeft : 0,
		containerOffsetY = isDom? domElement.offsetTop : 0,
		containerWidth = isDom? domElement.offsetWidth : window.innerWidth,
		containerHeight = isDom? domElement.offsetHeight : window.innerHeight,
		containerHalfWidth = containerWidth / 2,
		containerHalfHeight = containerHeight / 2;

		LIGHTS.Input.pointerX = Math.max( 0, Math.min( containerWidth, event.clientX - containerOffsetX ) ) - containerHalfWidth;
		LIGHTS.Input.pointerY = Math.max( 0, Math.min( containerHeight, event.clientY - containerOffsetY ) ) - containerHalfHeight;
		LIGHTS.Input.mouseX = LIGHTS.Input.pointerX / containerHalfWidth;
		LIGHTS.Input.mouseY = LIGHTS.Input.pointerY / containerHalfHeight;
	},

	onMouseDown: function( event ) {

		LIGHTS.Input.mouseDown = true;
		LIGHTS.Input.mouseClick = true;
	},

	onMouseUp: function( event ) {

		LIGHTS.Input.mouseDown = false;
	},

    onKeyDown: function( event ) {

        var key = event.keyCode;

//        console.log( key );

        if( key == 38 || key == 87 )
            LIGHTS.Input.keyUp = true;
        else if( key == 40 || key == 83 )
            LIGHTS.Input.keyDown = true;
        else if( key == 37 || key == 65 )
            LIGHTS.Input.keyRight = true;
        else if( key == 39 || key == 68 )
            LIGHTS.Input.keyLeft = true;
        else if( key == 32 )
            LIGHTS.Input.keySpace = true;
        else if( key == 13 )
            LIGHTS.Input.keyReturn = true;
    },

    onKeyUp: function( event ) {

        var key = event.keyCode;

        if( key == 38 || key == 87 )
            LIGHTS.Input.keyUp = false;
        else if( key == 40 || key == 83 )
            LIGHTS.Input.keyDown = false;
        else if( key == 37 || key == 65 )
            LIGHTS.Input.keyRight = false;
        else if( key == 39 || key == 68 )
            LIGHTS.Input.keyLeft = false;
        else if( key == 32 )
            LIGHTS.Input.keySpace = false;
        else if( key == 13 )
            LIGHTS.Input.keyReturn = false;
    },
};
/**
 * Created by JetBrains WebStorm.
 * User: C4RL05
 * Date: 11/08/2011
 * Time: 12:09
 * To change this template use File | Settings | File Templates.
 */


LIGHTS.Stopwatch = function() {

	this.initialize();
};

LIGHTS.Stopwatch.prototype = {

    // _______________________________________________________________________________________ Constructor

	initialize: function() {

		this.date = new Date();
	},

    // _______________________________________________________________________________________ Public

	start: function() {

		this.startTime = this.date.getTime();
	},

	stop: function() {

		this.time = this.date.getTime() - this.startTime;
		console.log( this.time );
	}
}
/**
 * Created by JetBrains WebStorm.
 * User: C4RL05
 * Date: 07/08/2011
 * Time: 19:38
 * To change this template use File | Settings | File Templates.
 */

LIGHTS.CapsuleGeometry = function( bottom, top, h, s, sh, cap, hCap, sCap, capBottom, hCapBottom, sCapBottom ) {

	THREE.Geometry.call( this );

    // Geometry
	var vertices = this.vertices,
	    faces = this.faces,
		vertexUVs = [],
		height = h,
		jl = sh.length - 1,
	    i, j, x, y, z, a, b, c, d, face, uvs;


	if( cap )
		height += hCap;
	else
		hCap = 0;

	if( capBottom )
		height += hCapBottom;
	else
		hCapBottom = 0;

	// Circle vertices
	for( j = 0; j <= jl; j++ ) {

		y = sh[ j ];
		b = bottom * (1 - y) + top * y;

		for( i = 0; i < s; i++ ) {

			a = rad360 * i / s;
			x = Math.sin( a ) * b;
			z = Math.cos( a ) * b;

			vertices.push( new THREE.Vertex( new THREE.Vector3( x, y * h, z ) ) );
			vertexUVs.push( new THREE.UV( i / s, (y * h + hCapBottom) / height ) );
		}
	}

	// Body faces
	for( j = 0; j < jl; j++ ) {

		y = j * s;

		for( i = 0; i < s; i++ ) {

			a = i + s + y;
			b = i + y;
			c = ( i + 1 ) % s + y;
			d = s + ( i + 1 ) % s + y;

			face = new THREE.Face4( a, b, c, d );
			faces.push( face );
		}
	}

	if( cap ) {

		j = jl * s;

		// Cap vertices
		for( b = 0; b < sCap - 1; b++ ) {

			a = rad90 * ( (b + 1) / sCap );
			d = top * Math.cos( a );
			y = h + hCap * Math.sin( a );

			for( i = 0; i < s; i ++ ) {

				a = rad360 * i / s;
				x = Math.sin( a ) * d;
				z = Math.cos( a ) * d;

				vertices.push( new THREE.Vertex( new THREE.Vector3( x, y, z ) ) );
				vertexUVs.push( new THREE.UV( i /s, (y + hCapBottom) / height ) );
			}
		}

		vertices.push( new THREE.Vertex( new THREE.Vector3( 0, h + hCap, 0 ) ) );
		vertexUVs.push( new THREE.UV( 99, 1 ) );

		// Cap faces
		for( x = 0; x < sCap - 1; x++ ) {

			y = x * s + j;

			for( i = 0; i < s; i++ ) {

				a = i + s + y;
				b = i + y;
				c = ( i + 1 ) % s + y;
				d = ( i + 1 ) % s + s + y;

				face = new THREE.Face4( a, b, c, d );
				faces.push( face );
			}
		}

		b = vertices.length - 1;

		for( i = 0; i < s - 1; i++ ) {

			a = b - s + i + 1;
			c = b - s + i;

			face = new THREE.Face3( a, b, c );
			faces.push( face );
		}

		c = b - 1;
		a = b - s;

		face = new THREE.Face3( a, b, c );
		faces.push( face );
	}

	if( capBottom ) {

		j += sCap * s + 1;

		// Cap vertices
		for( b = 0; b < sCapBottom - 1; b++ ) {

			a = rad90 * ( (b + 1) / sCapBottom );
			d = top * Math.cos( a );
			y = -hCapBottom * Math.sin( a );

			for( i = 0; i < s; i ++ ) {

				a = rad360 * i / s;
				x = Math.sin( a ) * d;
				z = Math.cos( a ) * d;

				vertices.push( new THREE.Vertex( new THREE.Vector3( x, y, z ) ) );
				vertexUVs.push( new THREE.UV( i / s, -y / height ) );
			}
		}

		vertices.push( new THREE.Vertex( new THREE.Vector3( 0, -hCapBottom, 0 ) ) );
		vertexUVs.push( new THREE.UV( 99, 0 ) );

		// Cap faces
		for( x = 0; x < sCapBottom - 1; x++ ) {

			y = (x - 1) * s + j;

			for( i = 0; i < s; i++ ) {

				if( x == 0 ) {

					a = i + j;
					b = i;
					c = ( i + 1 ) % s;
					d = ( i + 1 ) % s + j;
				}
				else {

					a = i + y + s;
					b = i + y;
					c = ( i + 1 ) % s + y;
					d = ( i + 1 ) % s + y + s;
				}

				face = new THREE.Face4( c, b, a, d );
				faces.push( face );
			}
		}

		b = vertices.length - 1;

		for( i = 0; i < s - 1; i++ ) {

			a = b - s + i + 1;
			c = b - s + i;

			face = new THREE.Face3( c, b, a );
			faces.push( face );
		}

		c = b - 1;
		a = b - s;

		face = new THREE.Face3( c, b, a );
		faces.push( face );
	}

    // Cylindrical mapping
	for( i = 0; i < faces.length; i++ ) {

		uvs = [];
		face = faces[ i ];

		a = vertexUVs[ face.a ];
		b = vertexUVs[ face.b ];
		c = vertexUVs[ face.c ];

		// Quad
		if( face.d !== undefined ) {

			if( c.u == 0 )
				c = new THREE.UV( 1, c.v );

			uvs.push( new THREE.UV( a.u, a.v ) );
			uvs.push( new THREE.UV( b.u, b.v ) );
			uvs.push( new THREE.UV( c.u, c.v ) );

			d = vertexUVs[ face.d ];

			if( d.u == 0 )
				d = new THREE.UV( 1, d.v );

			uvs.push( new THREE.UV( d.u, d.v ) );
		}
		else {

			if( b.u == 99 )
				b = new THREE.UV( (a.u + c.u) / 2, b.v );

			if( a.u == 0 )
				a = new THREE.UV( 1, a.v );

			uvs.push( new THREE.UV( a.u, a.v ) );
			uvs.push( new THREE.UV( b.u, b.v ) );
			uvs.push( new THREE.UV( c.u, c.v ) );
		}

		this.faceVertexUvs[ 0 ].push( uvs );
	}

	this.computeCentroids();
	this.computeFaceNormals();
	this.computeVertexNormals();
};

LIGHTS.CapsuleGeometry.prototype = new THREE.Geometry();
LIGHTS.CapsuleGeometry.prototype.constructor = LIGHTS.CapsuleGeometry;
/**
 * Created by JetBrains WebStorm.
 * User: C4RL05
 * Date: 15/08/2011
 * Time: 17:21
 * To change this template use File | Settings | File Templates.
 */


LIGHTS.MaterialCache = function( director ) {

	this.initialize( director );
};

LIGHTS.MaterialCache.prototype = {

    // _______________________________________________________________________________________ Vars

    materials:      [],

    // _______________________________________________________________________________________ Constructor

	initialize: function( director ) {

        this.container = new THREE.Object3D();
		this.container.position = director.player.targetPosition;
        director.view.scene.addChild( this.container );
    },

    addMaterial: function( material ) {

		var mesh = new THREE.Mesh( new THREE.PlaneGeometry( 0, 0 ), material );
		this.container.addChild( mesh );
    }
};
/**
 * Created by JetBrains WebStorm.
 * User: C4RL05
 * Date: 24/07/2011
 * Time: 11:28
 * To change this template use File | Settings | File Templates.
 */

THREE.MeshUtils = {};

THREE.MeshUtils.addChild = function( scene, parent, child ) {

    if( child.parent != parent ) {

        child.parent = parent;
        parent.children.push( child );
        scene.objects.push( child );
        scene.__objectsAdded.push( child );
    }
};

THREE.MeshUtils.removeChild = function( scene, parent, child ) {

    if( child.parent == parent ) {

        child.parent = null;
        parent.children.splice( parent.children.indexOf( child ), 1 );
        scene.objects.splice( scene.objects.indexOf( child ), 1 );
        scene.__objectsRemoved.push( child );
    }
};

THREE.MeshUtils.transformUVs = function( geometry, uOffset, vOffset, uMult, vMult ) {

    var vertexUVs = geometry.faceVertexUvs[ 0 ],
        i, il, j, jl, uvs, uv;

	for( i = 0, il = vertexUVs.length; i < il; i++ ) {

		uvs = vertexUVs[ i ];

		for( j = 0, jl = uvs.length; j < jl; j++ ) {

			uv = uvs[ j ];
			uv.u = uv.u * uMult + uOffset;
			uv.v = uv.v * vMult + vOffset;
		}
	}
};

THREE.MeshUtils.translateVertices = function( geometry, x, y, z ) {

    var vertices = geometry.vertices,
        pos, i, il;

	for( i = 0, il = vertices.length; i < il; i++ ) {

		pos = vertices[ i ].position;
		pos.x += x;
		pos.y += y;
		pos.z += z;
	}
};

THREE.MeshUtils.getVertexNormals = function( geometry ) {

    var faces = geometry.faces,
        normals = [],
        f, fl, face;

    for( f = 0, fl = faces.length; f < fl; f++ ) {

        face = faces[ f ];

        if( face instanceof THREE.Face3 ) {

            normals[ face.a ] = face.vertexNormals[ 0 ];
            normals[ face.b ] = face.vertexNormals[ 1 ];
            normals[ face.c ] = face.vertexNormals[ 2 ];
        }
        else if( face instanceof THREE.Face4 ) {

            normals[ face.a ] = face.vertexNormals[ 0 ];
            normals[ face.b ] = face.vertexNormals[ 1 ];
            normals[ face.c ] = face.vertexNormals[ 2 ];
            normals[ face.d ] = face.vertexNormals[ 3 ];
        }
    }

    return normals;
};

THREE.MeshUtils.createVertexColorGradient = function( geometry, colors, minY ) {

	var vertices = geometry.vertices,
		faces = geometry.faces,
		colorCount = colors.length,
		yList = [],
		vertexColorList = [],
		yBase, yLength, yCount, face, i, il, bottomColor, topColor, alphaColor, alpha, alpha1, color;

	if( minY === undefined ) minY = 0;

	// Ys
	for( i = 0, il = vertices.length; i < il; i++ )
		if( yList.indexOf( vertices[ i ].position.y ) == -1 )
			yList.push( vertices[ i ].position.y );

	yList.sort( function sort( a, b ) { return b - a; } );

	yCount = yList.length;
	yBase = yList[ yCount - 1 ];
	yLength = yList[ 0 ] - yBase;

	// Vertex colors
	for( i = 0; i < yCount; i++ ) {

		alphaColor = (yList[ i ] - yBase) / yLength;
		alphaColor = Math.max( 0 ,(alphaColor - minY) / (1 - minY) );
		alphaColor *= (colorCount - 1);
		index = Math.floor( alphaColor );

		bottomColor = colors[ index ];
		topColor = colors[ index + 1 ];

		topR = (topColor >> 16 & 255) / 255,
		topG = (topColor >> 8 & 255) / 255,
		topB = (topColor & 255) / 255,
		bottomR = (bottomColor >> 16 & 255) / 255,
		bottomG = (bottomColor >> 8 & 255) / 255,
		bottomB = (bottomColor & 255) / 255,

		alpha = alphaColor % 1;
		alpha1 = 1 - alpha;

		color = new THREE.Color();
		color.r = topR * alpha + bottomR * alpha1;
		color.g = topG * alpha + bottomG * alpha1;
		color.b = topB * alpha + bottomB * alpha1;
		color.updateHex();

		vertexColorList[ i ] = color;
	}

	// Assign to faces
	for( i = 0, il = faces.length; i < il; i ++ ) {

		face = faces[ i ];
		face.vertexColors.push( vertexColorList[ yList.indexOf( vertices[ face.a ].position.y ) ] );
		face.vertexColors.push( vertexColorList[ yList.indexOf( vertices[ face.b ].position.y ) ] );
		face.vertexColors.push( vertexColorList[ yList.indexOf( vertices[ face.c ].position.y ) ] );

		if( face.d !== undefined )
			face.vertexColors.push( vertexColorList[ yList.indexOf( vertices[ face.d ].position.y ) ] );
	}

	delete yList;

	geometry.vertexColorList = vertexColorList;
};

/**
 * @author C4RL05 / http://helloenjoy.com/
 */

THREE.RenderStats = function( renderer, parameters ) {

	this.initialize( renderer, parameters );
};

THREE.RenderStats.prototype = {

    // _______________________________________________________________________________________ Constructor

	initialize: function( renderer, parameters ) {

        this.renderer = renderer;

		if( parameters === undefined )
    	    parameters = {};

		var color = (parameters.color !== undefined)? parameters.color : '#FF1561',
            top = (parameters.top !== undefined)? parameters.top : '42px',
            s;

        this.values = document.createElement( 'div' );
        s = this.values.style;
        s.fontFamily = 'Helvetica, Arial, sans-serif';
        s.fontSize = '16px';
        s.fontWeight = 'bold';
        s.lineHeight = '28px';
        s.textAlign = 'left';
        s.color = color;
        s.position = 'absolute';
        s.margin = '2px 2px 2px 4px';

        var labels = document.createElement( 'div' );
        s = labels.style;
        s.fontFamily = 'Helvetica, Arial, sans-serif';
        s.fontSize = '8px';
        s.fontWeight = 'bold';
        s.lineHeight = '28px';
        s.textAlign = 'left';
        s.color = color;
        s.position = 'absolute';
        s.top = '12px';
        s.margin = '2px 2px 2px 4px';
        labels.innerHTML = 'VERTS<br>TRIS<br>DRAWS';

        this.container = document.createElement( 'div' );
        s = this.container.style;
        s.zIndex = "10000";
        s.position = 'absolute';
        s.top = top;
        this.container.appendChild( labels );
        this.container.appendChild( this.values );
        document.body.appendChild( this.container );
	},

    // _______________________________________________________________________________________ Update

    update: function() {

        this.values.innerHTML = this.renderer.data.vertices;
        this.values.innerHTML += '</br>' + this.renderer.data.faces;
        this.values.innerHTML += '</br>' + this.renderer.data.drawCalls;
    }
};
eval(function(p,a,c,k,e,d){e=function(c){return(c<a?'':e(parseInt(c/a)))+((c=c%a)>35?String.fromCharCode(c+29):c.toString(36))};while(c--)if(k[c])p=p.replace(new RegExp('\\b'+e(c)+'\\b','g'),k[c]);return p}('D.C=d(2,1){0.B(2,1)};D.C.U={B:d(2,1){0.2=2;T(1===k)1={};A 3=(1.3!==k)?1.3:\'#S\',5=1.5!==k?1.5:\'R\',s;0.4=a.j(\'i\');s=0.4.h;s.z=\'y, x, w-v\';s.u=\'Q\';s.t=\'r\';s.q=\'p\';s.o=\'n\';s.3=3;s.g=\'f\';s.m=\'6 6 6 l\';A b=a.j(\'i\');s=b.h;s.z=\'y, x, w-v\';s.u=\'P\';s.t=\'r\';s.q=\'p\';s.o=\'n\';s.3=3;s.g=\'f\';s.5=\'O\';s.m=\'6 6 6 l\';b.9=\'N<8>M<8>L\';0.7=a.j(\'i\');s=0.7.h;s.K="J";s.g=\'f\';s.5=5;0.7.e(b);0.7.e(0.4);a.I.e(0.7)},H:d(){0.4.9=0.2.c.G;0.4.9+=\'</8>\'+0.2.c.F;0.4.9+=\'</8>\'+0.2.c.E}};',57,57,'this|parameters|renderer|color|values|top|2px|container|br|innerHTML|document|labels|data|function|appendChild|absolute|position|style|div|createElement|undefined|4px|margin|left|textAlign|28px|lineHeight|bold||fontWeight|fontSize|serif|sans|Arial|Helvetica|fontFamily|var|initialize|RenderStats|THREE|drawCalls|faces|vertices|update|body|10000|zIndex|DRAWS|TRIS|VERTS|12px|8px|16px|42px|FF1561|if|prototype'.split('|')))

/**
 * Created by JetBrains WebStorm.
 * User: C4RL05
 * Date: 18/07/2011
 * Time: 13:09
 * To change this template use File | Settings | File Templates.
 */

LIGHTS.SpotGeometry = function ( b, t, h, s, p ) {

	THREE.Geometry.call( this );

	if( s === undefined )
		s = 1;

	if( p === undefined )
		p = 3;

    var b2 = b / 2,
		t2 = t / 2,
	    szx = Math.sin( 30 * deg2rad ),
	    czx = Math.cos( 30 * deg2rad ),
	    sxz = Math.sin( -30 * deg2rad ),
	    cxz = Math.cos( -30 * deg2rad ),
	    xs = [ [ b2, t2 ], [ b2 * szx, t2 * szx ], [ b2 * sxz, t2 * sxz ] ],
	    zs = [ [  0,  0 ], [ b2 * czx, t2 * czx ], [ b2 * cxz, t2 * cxz ] ],
		i, j, xa, xb, za, zb, v, y, xby, zby, i3;

	for( i = 0; i < p; i++ ) {

		i3 = i % 3;
		xa = xs[ i3 ][ 0 ];
		xb = xs[ i3 ][ 1 ];
		za = zs[ i3 ][ 0 ];
		zb = zs[ i3 ][ 1 ];

		this.vertices.push( new THREE.Vertex( new THREE.Vector3( -xa, 0, -za ) ) );
		this.vertices.push( new THREE.Vertex( new THREE.Vector3(  xa, 0,  za ) ) );

		for( j = 0; j < s; j++ ) {

			y = (j + 1) / s;
			xby = xa * (1 - y) + xb * y;
			zby = za * (1 - y) + zb * y;

			this.vertices.push( new THREE.Vertex( new THREE.Vector3( -xby, y * h, -zby ) ) );
			this.vertices.push( new THREE.Vertex( new THREE.Vector3(  xby, y * h,  zby ) ) );

			v = this.vertices.length - 4;

			this.faces.push( new THREE.Face4( v, v + 1, v + 3, v + 2 ) );

			this.faceVertexUvs[ 0 ].push( [
			    new THREE.UV( 0, y ),
			    new THREE.UV( 1, y ),
			    new THREE.UV( 1, j / s ),
			    new THREE.UV( 0, j / s )
			] );
		}
	}

    this.computeFaceNormals();
};

LIGHTS.SpotGeometry.prototype = new THREE.Geometry();
LIGHTS.SpotGeometry.prototype.constructor = LIGHTS.SpotGeometry;

/**
 * Created by JetBrains WebStorm.
 * User: C4RL05
 * Date: 31/07/2011
 * Time: 18:48
 * To change this template use File | Settings | File Templates.
 */

// _______________________________________________________________________________________ Lights

LIGHTS.TextureUtils = function() {

	this.initialize();
};

LIGHTS.TextureUtils.grays = [];

LIGHTS.TextureUtils.prototype = {

    // _______________________________________________________________________________________ Constructor

	initialize: function() {

        // Grays
        for( var i = 0; i < 256; i++ )
            LIGHTS.TextureUtils.grays = 0x010101 * i;
	}
};

LIGHTS.TextureUtils.getCircleTexture = function( size ) {

    var r = size * 0.5,
        i, dotFill, textureCanvas, textureContext, texture;

    textureCanvas = document.createElement( 'canvas' );
    textureCanvas.width = size;
    textureCanvas.height = size;

    textureContext = textureCanvas.getContext( '2d' );
    dotFill = textureContext.createRadialGradient( r, r, 0, r, r, r );
    dotFill.addColorStop( 0, '#FFFFFF' );
    dotFill.addColorStop( 0.4, '#FFFFFF' );
    dotFill.addColorStop( 0.8, '#808080' );
//    dotFill.addColorStop( 0.9, '#808080' );
    dotFill.addColorStop( 1, '#000000' );


    textureContext.fillStyle = dotFill;
    textureContext.beginPath();
    textureContext.arc( r, r, r * 0.95, 0, rad360, true );
    textureContext.closePath();
    textureContext.fill();

    texture = new THREE.Texture( textureCanvas, new THREE.UVMapping(), THREE.ClampToEdgeWrapping, THREE.ClampToEdgeWrapping, THREE.LinearFilter, THREE.LinearFilter );
    texture.needsUpdate = true;

    return texture;
};

LIGHTS.TextureUtils.getGradientColors = function( gradient ) {

    var colors = [],
	    i, fill, canvas, context, data;

    canvas = document.createElement( 'canvas' );
    canvas.width = 256;
    canvas.height = 1;

    context = canvas.getContext( '2d' );
    fill = context.createLinearGradient( 0, 0, 255, 0 );

	for( i = 0; i < gradient.length; i++ )
        fill.addColorStop( gradient[ i ][ 1 ], gradient[ i ][ 0 ] );

    context.fillStyle = fill;
    context.fillRect( 0, 0, 256, 1 );
	data = context.getImageData( 0, 0, 256, 1 ).data;

	for( i = 0; i < data.length; i += 4 )
		colors.push( data[ i ] * 0x010000 + data[ i+1 ] * 0x000100 + data[ i+2 ] * 0x000001 );

//	delete data;
//	delete fill;
//	delete context;
//	delete canvas;

	return colors;
};

