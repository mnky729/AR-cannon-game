# AR cannon game

## AR cannon game for CS404 project 2 by
1. Kanokluk Supthamrong 6280563
2. Chada Kengradomying 6481236

## Project consists of
- assets : cannon and sounds assets
- components : all components registered
- index.html

### Assets

There are 3d cannon models which are the blue and the green one, including cannon mount, cannon barrel model. and the rest of the files are background music, firing sound, and countdown sound assets.

### Components

***Collision check***
It is used to detect collisions between a cannon ball entity in a 3D scene whether it hits the enemy cannon or not

The schema defines the configuration properties for this component:

**targetSelector** : A CSS selector string (default is .target) to specify the targets to check for collisions.
**threshold** : A numerical value (default is 0.5) representing the distance threshold to consider as a collision.

The ***tick*** method is called on every frame (approx. 60 times per second). It handles the collision detection logic.
The ***this.el*** refers to the entity that the component is attached to which is a cannon ball. While all entities matching the ***targetSelector*** are selected, and their positions in world space are calculated in distance between the ball and the target.

If the calculated distance is less than or equal to the threshold, the following actions occur:
1. **'hit' Event**: The target entity emits a custom event named hit, which can be used to trigger other actions like health deduction.
2. **Hide the Ball** : The visible attribute of the ball entity is set to false, making it invisible while not firing phase.

***Hit Feedback***

This A-Frame component, named hit-feedback, is designed to provide visual feedback when an entity it is attached to receives a hit event which the entity this component is attached to is initially set to be invisible by setting its visible attribute to *false*. The Showing Feedback method when called, it sets the visible attribute to true, making the feedback element appear in the scene. Then, a *setTimeout* hide the entity after a delay of 1 second.

***Countdown Manager***

This A-Frame component implements a countdown-driven game mechanic where two teams (Green and Blue) take turns firing cannon balls at targets.

The purpose of this component:
1) A countdown timer for each team's turn.
2) Cannon ball firing mechanics.
3) Collision detection to determine if a cannonball hits a target.
4) Pausing and resuming the game based on the visibility of AR markers.

The *init* method sets up the initial state and retrieves references to various elements in the scene:

a. State Variables

*isGreenTurn*: Tracks whether it is the Green team's turn (true) or the Blue team's turn (false).
*countdown*: Starts at 5 seconds for each turn.
*isRunning*: Tracks whether the game is currently running.
*hasStarted*: Indicates if the countdown has ever started.
*timer*: Stores the interval timer for the countdown.

b. DOM Element References

Text elements (greenText, blueText) to display the countdown.
Cannonballs (greenBall, blueBall) and cannons (greenCannon, blueCannon).
Targets (greenTarget, blueTarget).
UI elements (pauseText) and background sound (backgroundSound).

c. Marker Event Listeners

The component listens for *markerFound* and *markerLost* events from AR markers (greenMarker and blueMarker) to pause or resume the game.

***Health System***

The *health-system* component tracks an entity's health, deducts health when the entity is "hit," and handles game-over scenarios when health reaches zero. It also provides visual feedback for health changes and game state.

- health : An integer representing the starting health of the entity where the total default health starts at 3.

The component listens for two key events:
- hit Event: Deducts health and shows visual feedback when the entity is hit.
- game-over Event: Displays a game-over message when health reaches zero.

When the entity is "hit":

1) Decrease the health value by 1.
2) Update the healthText to reflect the new health value.
3) If health reaches 0, emit a game-over event.


***Sound Manager***

The sound-manager component adds sound effects to enhance the user experience in a 3D or AR scene. The purpose of this component is :

- Plays background music continuously in a loop.
- Plays a cannon firing sound effect when a cannon-fired event is emitted.

### Index.html

This HTML file is creating an AR-based Cannon Game using A-Frame and AR.js. It combines visual elements, assets, and custom JavaScript components to build an interactive game where two players (green and blue) take turns firing cannonballs at each other. 

*Dependencies*
> A-Frame: A framework for building 3D/AR/VR experiences.
> AR.js: Enables augmented reality features in the browser using markers and webcam input.

Two players (Green and Blue) interact with physical markers (barcodes) where each player has a cannon that fires balls at a target. Players can see a countdown timer before firing, fire a ball from their cannon, get hit feedback when the ball hits their target, track their health and see a game-over message when their health depletes.

*Components in Use*

a. hit-feedback.js
- Displays a red plane when a target is hit for visual feedback.

b. health-system.js
- Tracks the health of each cannon (starts at 3).
- Deducts health when the cannon is hit.
- Displays a "You Won!" or "You Lost!" message when health reaches 0.

c. sound-manager.js
- Plays background music continuously.
- Plays the cannon-firing sound when a ball is launched.

d. countdown-manager.js
- Manages the turn-based countdown for the game.
- Alternates turns between Green and Blue players.
- Fires a ball when the countdown reaches 0.

*Key Interactions*

a. Starting the Game
- The game starts when one or both markers are detected.
- Countdown begins for the respective player.

b. Cannon Firing
- When the countdown reaches 0, the cannon fires a ball.
- The ball travels in a parabolic arc toward the target.
- If the ball collides with the target:
- A "hit" event is emitted.
- Health is deducted.

c. Pausing
- If both markers are not visible (e.g., markers are removed from view), the game pauses:
- The countdown stops.
- The background music pauses.
- A "PAUSED" text is displayed.

d. Game Over
- If a player’s health reaches 0:
- Their health text displays "You Won!" or "You Lost!" depending on the player.