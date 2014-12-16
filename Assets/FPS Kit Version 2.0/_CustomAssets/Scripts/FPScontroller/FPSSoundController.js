//NSdesignGames @ 2012
//FPS Kit | Version 2.0

#pragma strict

var walkSounds : AudioClip[];
var walkStepLength = 0.45;
var runStepLenght = 0.38;
var crouchStepLenght = 0.38;

private var controller : CharacterController;
private var motor : FPScontroller;
private var lastStep= -10.0;
private var StepLenght : float;

function Awake(){
	StepLenght = walkStepLength;
	controller = GetComponent(CharacterController);
	motor = GetComponent(FPScontroller);
}

function FixedUpdate(){
	//Check when player walk or run to play footstep sounds with different speed
	if(motor.prone)
		return;
	if(motor.Walking && motor.grounded && !motor.crouch){
		PlayStepSounds();
		StepLenght = walkStepLength;
	}
	if(motor.Running && motor.grounded){
		PlayStepSounds();
		StepLenght = runStepLenght;
	}
	if(motor.Walking && motor.crouch && motor.grounded){
		PlayStepSounds();
		StepLenght = crouchStepLenght;
	}
}


function PlayStepSounds(){
	if (Time.time > StepLenght + lastStep){
		audio.clip = walkSounds[Random.Range(0, walkSounds.length)];
		audio.Play();
		lastStep = Time.time;
	}
}

@script RequireComponent (AudioSource)