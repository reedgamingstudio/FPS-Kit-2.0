//NSdesignGames @ 2012
//FPS Kit | Version 2.0

#pragma strict
//This script is used to control main weapon animations
//Should be attached to the object that contain weapon/hand animation
var Idle : String = "Idle";
var Reload : String = "Reload";
var Shoot : String = "Fire";
var TakeIn : String = "TakeIn";
var TakeOut : String = "TakeOut";
var FireAnimationSpeed : float = 1;
var TakeInOutSpeed : float = 1;
	
private var PlayThis : String;

private var motor : FPScontroller;
private var player : GameObject;

function Awake () {
	animation.Play(Idle);
	animation.wrapMode = WrapMode.Once;
}

function Fire(){
	animation.Rewind(Shoot);
	animation[Shoot].speed = FireAnimationSpeed;
	animation.Play(Shoot);
}

function Reloading(reloadTime : float) {
	animation.Stop(Reload);
	animation[Reload].speed = (animation[Reload].clip.length/reloadTime);
	animation.Rewind(Reload);
	animation.Play(Reload);
}

function takeIn(){
	animation.Rewind(TakeIn);
	animation[TakeIn].speed = TakeInOutSpeed;
	animation[TakeIn].time = 0;
	animation.Play(TakeIn);
}

function takeOut(){
	animation.Rewind(TakeOut);
	animation[TakeOut].speed = TakeInOutSpeed;
	animation[TakeOut].time = 0;
	animation.Play(TakeOut);
}

@script AddComponentMenu ("FPS system/Weapon System/WeaponAnimation")