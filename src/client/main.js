Endless.main = function() {
	include('Log');
	include('Static');
	include('Game');
	include('GameState');
	include('UserInterface');

	log.info("Initializing");
	
	// override our data root if we have it stored somewhere else
	static.setRoot("");
	resources.init();
	
	// Set the template data
	include('TemplateProvider').SetData(include('TemplateContent'));
	
	// Initialize components
	static.init();
    game.init();
    userInterface.init();

    // Set the update interval for the non-ui components
    var interval = 1000 / 60;
    setInterval(function() {
        onUpdate();
    }, interval);
    
    // Set the update for the ui, we use animation frame which usually is around 60 fps but is tied to refresh rate
    //  this is generally nicer than using setInterval for animations and UI
    requestAnimationFrame(onUIUpdate);
	
	function onUpdate() {
		gameState.gameTime.update();
	
	    Endless.resetFrame();
	    static.update(gameState.gameTime);
	    game.update(gameState.gameTime);
	};
	
	function onUIUpdate() {        	
		userInterface.update(gameState.gameTime);
	    
	    requestAnimationFrame(onUIUpdate);
	};
};

$(document).ready(function() {
	Endless.main();
});
