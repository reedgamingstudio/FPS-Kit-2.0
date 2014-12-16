//NSdesignGames @ 2012
//FPS Kit | Version 2.0

#pragma strict
//This script is used to control main weapon animations
//Should be attached to the object that contain weapon/hand animation
//Note this is Modifired version of WeaponAnimation.js and its adapted to work with per bullet reload animation
var Idle : String = "Idle";
var ReloadBegin : String = "Reload_1_3";
var ReloadMiddle : String = "Reload_2_3";
var ReloadEnd: String = "Reload_3_3";
var Shoot : String = "Fire";
var TakeIn : String = "TakeIn";
var TakeOut : String = "TakeOut";
var FireAnimationSpeed : float = 1;
var TakeInOutSpeed : float = 1;
var ReloadMiddleRepeat : float = 4;
	
private var PlayThis : String;

private var motor : FPScontroller;
private var player : GameObject;

function Awake () {
	animation.Play(Idle);
	animation[Idle].wrapMode = WrapMode.Once;
	animation[ReloadBegin].wrapMode = WrapMode.Once;
	animation[ReloadMiddle].wrapMode = WrapMode.Once;
	animation[ReloadEnd].wrapMode = WrapMode.Once;
	animation[Shoot].wrapMode = WrapMode.Once;
	animation[TakeIn].wrapMode = WrapMode.Once;
	animation[TakeOut].wrapMode = WrapMode.Once;
}

function Fire(){
	animation.Rewind(Shoot);
	animation[Shoot].speed = FireAnimationSpeed;
	animation.Play(Shoot);
}

function Reloading(reloadTime : float) {
	var totalLength = animation[ReloadBegin].clip.length + animation[ReloadMiddle].clip.length*ReloadMiddleRepeat + animation[ReloadEnd].clip.length;
	
	var newReload1 : AnimationState = animation.CrossFadeQueued(ReloadBegin);
	newReload1.speed = (totalLength/reloadTime)/2;
	//4 is number of bullets to reload
	for(var i : int = 0; i < ReloadMiddleRepeat; i++){
 		var newReload2 : AnimationState = animation.CrossFadeQueued(ReloadMiddle);
		newReload2.speed = (totalLength/reloadTime)/1.4;
	}
	var newReload3 : AnimationState = animation.CrossFadeQueued(ReloadEnd);
	newReload3.speed = (totalLength/reloadTime)/2;
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

@script AddComponentMenu ("FPS system/Weapon System/SniperAnimation")