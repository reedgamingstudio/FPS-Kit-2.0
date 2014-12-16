//NSdesignGames @ 2012
//FPS Kit | Version 2.0

#pragma strict

//This script should be attached to an object whitch children are all player weapons
//Weapon -> "Player weapons"

var walkBobbingSpeed = 0.21;
var runBobbingSpeed = 0.35;
var idleBobbingSpeed = 0.1;
var bobbingAmount = 0.1; 
var smooth : float = 1;
private var midpoint : Vector3; 
private var player : GameObject;
private var timer = 0.0; 
private var bobbingSpeed : float; 
private var motor : FPScontroller;
private var BobbingAmount : float;

function Awake (){
	//Find player and FPScontroller script
	player = GameObject.FindWithTag("Player");
	motor = player.GetComponent(FPScontroller);
	midpoint = transform.localPosition;

}
 
 function FixedUpdate () { 
    var waveslice = 0.0;  
    var waveslice2 = 0.0;
    var currentPosition : Vector3;
    
    //This variables is used for slow motion effect (0.02 should be default fixed time value)
    var tempWalkSpeed : float;
    var tempRunSpeed : float;
    var tempIdleSpeed : float;
    
    if(Time.timeScale == 1){
    	if(tempWalkSpeed != walkBobbingSpeed || tempRunSpeed != runBobbingSpeed || tempIdleSpeed != idleBobbingSpeed){
			tempWalkSpeed = walkBobbingSpeed;
			tempRunSpeed = runBobbingSpeed;
			tempIdleSpeed = idleBobbingSpeed;
		}
	}else{
		tempWalkSpeed = walkBobbingSpeed*(Time.fixedDeltaTime/0.02);
		tempRunSpeed = runBobbingSpeed*(Time.fixedDeltaTime/0.02);
		tempIdleSpeed = idleBobbingSpeed*(Time.fixedDeltaTime/0.02);
	}

    /*
    if (!motor.Walking) { 
       timer = 0.0; 
    }else{ 
    */
       waveslice = Mathf.Sin(timer*2); 
       waveslice2 = Mathf.Sin(timer);
       timer = timer + bobbingSpeed; 
       if (timer > Mathf.PI * 2) { 
          timer = timer - (Mathf.PI * 2); 
       } 
    //} 
    if (waveslice != 0) { 
		var TranslateChange = waveslice * BobbingAmount; 
		var TranslateChange2 = waveslice2 * BobbingAmount;
		var TotalAxes = Mathf.Clamp (1.0, 0.0, 1.0); 
		var translateChange = TotalAxes * TranslateChange; 
		var translateChange2 = TotalAxes * TranslateChange2; 
		
		if(motor.grounded){
			//Player walk
			currentPosition.y = midpoint.y + translateChange;
			currentPosition.x = midpoint.x + translateChange2;
   		}
   		
    }else{
    	//Player not move
    	currentPosition = midpoint;
    } 
	//Walk/Run sway speed
	if (motor.Walking && !motor.Running && !motor.prone) {
		bobbingSpeed = tempWalkSpeed;
		BobbingAmount = bobbingAmount;
	}
	if(motor.Running) {
		bobbingSpeed = tempRunSpeed;
		BobbingAmount = bobbingAmount;
	}
	
	if(!motor.Running && !motor.Walking || motor.prone){
		bobbingSpeed = tempIdleSpeed;
		BobbingAmount = bobbingAmount*0.3;
		
	}
	
	var i : float;
	i += Time.deltaTime * smooth;

	transform.localPosition = Vector3.Lerp(transform.localPosition, currentPosition, i);

 }
 
@script AddComponentMenu ("FPS system/Character/FPS WalkSway")