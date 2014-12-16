//NSdesignGames @ 2012
//FPS Kit | Version 2.0

#pragma strict

// The speed of the player up and down the ladder. Roughly equal to walking speed is a good starting point.
var climbSpeed = 6.0;
// In the range -1 to 1 where -1 == -90 deg, 1 = 90 deg, angle of view camera at which the user climbs down rather than up when moving with the forward key.
var climbDownThreshold = -0.4;

//Private vars
private var climbDirection : Vector3 = Vector3.zero;
private var lateralMove : Vector3 = Vector3.zero;
private var forwardMove : Vector3 = Vector3.zero;
private var ladderMovement : Vector3 = Vector3.zero;
private var currentLadder : Ladder = null;
private var latchedToLadder : boolean = false;
private var inLandingPad : boolean = false;
private var mainCamera : GameObject = null;
private var controller : CharacterController = null;
private var landingPads : ArrayList = null;
private var trigger : boolean = false;


function Start () {
	mainCamera = GameObject.FindWithTag("MainCamera");
	controller = GetComponent(CharacterController);
	landingPads = new ArrayList();
}

function OnTriggerEnter (other : Collider) {
	if(other.tag == "Ladder") {		
		LatchLadder(other.gameObject, other);
		trigger = true;
	}
}

function OnTriggerExit () {		

	//	UnlatchLadder();
//	print("WTF");
}

 //Connect the player to the ladder, and shunt FixedUpdate calls to the special ladder movment functions.
function LatchLadder (latchedLadder : GameObject, collisionWaypoint : Collider) {
	// typecast the latchedLadder as a Ladder object from GameObject
	currentLadder = latchedLadder.GetComponent(Ladder);
	latchedToLadder = true;
	
	// get the climb direction
	climbDirection = currentLadder.ClimbDirection();
	
	// let the other scripts know we are on the ladder now
	gameObject.SendMessage("OnLadder", null, SendMessageOptions.RequireReceiver);
}


//Shut off special ladder movement controls and return to normal movement operations.
function UnlatchLadder () {
	latchedToLadder = false;
	currentLadder = null;
	
	// let the other scripts know we are off the ladder now
	gameObject.SendMessage("OffLadder", ladderMovement, SendMessageOptions.RequireReceiver);
}


//Convert the player's normal forward and backward motion into up and down motion on the ladder.
function FixedUpdate () {
	if(!latchedToLadder)
		return;
		
	if(trigger){
		RaycastCheck ();
	}
	
	// If we jumpped, then revert back to the original behavior
	if (Input.GetButton("Jump")) {
		UnlatchLadder();
		//gameObject.SendMessage("FixedUpdate", null, SendMessageOptions.RequireReceiver);
		return;
	}
	
	// find the climbing direction
	var verticalMove = climbDirection.normalized;
	
	// convert forward motion to vertical motion
	verticalMove *= Input.GetAxis("Vertical");
	verticalMove *= (mainCamera.transform.forward.y > climbDownThreshold) ? 1 : -1;
	
	// find lateral component of motion
	if (inLandingPad) {
		lateralMove = new Vector3(Input.GetAxis("Horizontal"), 0, Input.GetAxis("Vertical"));
	} else {
		lateralMove = new Vector3(Input.GetAxis("Horizontal"), 0, 0);
	}
	lateralMove = transform.TransformDirection(lateralMove);
		
	// move
	ladderMovement = verticalMove + lateralMove;
	var flags = controller.Move(ladderMovement * climbSpeed * Time.deltaTime);
}

function RaycastCheck () {
    var hit : RaycastHit;
    var charContr : CharacterController = GetComponent(CharacterController);
    var p1 : Vector3 = transform.position + charContr.center + 
                Vector3.up * (-charContr.height*0.5);
    var p2 : Vector3 = p1 + Vector3.up * charContr.height;
    // Cast character controller shape 10 meters forward, to see if it is about to hit anything
    if (Physics.CapsuleCast (p1, p2, charContr.radius, transform.forward, hit, charContr.radius)) {
    
    }else{
    	UnlatchLadder();
    	trigger = false;
    }
}

@script RequireComponent(CharacterController)
@script AddComponentMenu("FPS system/Ladder System/Attach to Player")