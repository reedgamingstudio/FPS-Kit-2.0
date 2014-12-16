//NSdesignGames @ 2012
//FPS Kit | Version 2.0 + Multiplayer

//Use this script to controll thrird person animation

#pragma strict

import System.Collections.Generic;

//@script ExecuteInEditMode
//Use this gameObject to send messages to AnimationSync.cs
var animationSyncHelper : GameObject;
var animationForHands : GameObject;
//This gameObject.name will tell AnimationSync.cs which third person weapon is active now
var activeWeapon : GameObject;
enum Action{Stand, Crouch, Prone}
var action : Action;

class animations{
	//Edit pose
	//var poseAnimation : AnimationClip;
	//Idle animations
	var jumpPose : AnimationClip;
	var stayIdle : AnimationClip;
	var crouchIdle : AnimationClip;
	var proneIdle : AnimationClip;
	//Walk Animations
	var walkFront : AnimationClip;
	var walkBack : AnimationClip;
	var walkLeft : AnimationClip;
	var walkRight : AnimationClip;
	var walkAnimationsSpeed : float = 1;
	//Run animations
	var runFront : AnimationClip;
	var runAnimationsSpeed : float = 1;
	//Crouch animations
	var crouchFront : AnimationClip;
	var crouchLeft : AnimationClip;
	var crouchRight : AnimationClip;
	var crouchBack : AnimationClip;
	var crouchAnimationsSpeed : float = 1;
	//Prone Animations
	var proneFront : AnimationClip;
	var proneLeft : AnimationClip;
	var proneRight : AnimationClip;
	var proneBack : AnimationClip;
	var proneAnimationsSpeed : float = 1;
	//Weapon animations
	var pistolIdle : AnimationClip;
	var knifeIdle : AnimationClip;
	var gunIdle : AnimationClip;
	/*var fire : AnimationClip;
	var reload : AnimationClip;*/
}

var Animations : animations;

var twoHandedWeapons : List.<WeaponScript>;
var pistols : List.<WeaponScript>;
var knivesNades : List.<WeaponScript>;

private var fpsController : FPScontroller;
private var weapManager : WeaponManager;

function Start () {
	fpsController = GameObject.FindWithTag("Player").GetComponent.<FPScontroller>();
	configureAnimations();
	weapManager = GameObject.FindWithTag("WeaponManager").GetComponent.<WeaponManager>();
	//Play pose in the Editor
	/*if(poseAnimation){
    	var state : AnimationState = animation[pistolIdle.name];
	    state.enabled = true;
	    state.weight = 1;
	    state.normalizedTime = 0;
	
	    animation.Sample();
	}*/
	if(weapManager){
		ThirdPersonWeaponControl();
	}
}

function Update () {
	activeWeapon.name = weapManager.SelectedWeapon.weaponName;
	if(!fpsController.crouch && !fpsController.prone){
		action = Action.Stand;
	}
	else if(fpsController.crouch && !fpsController.prone){
		action = Action.Crouch;
	}
	else if(!fpsController.crouch && fpsController.prone){
		action = Action.Prone;
	}
	
	if(action == Action.Stand){
		if(fpsController.grounded){
			if(fpsController.Walking && !fpsController.Running){
				if( Input.GetKey(KeyCode.W)){
					animation.CrossFade(Animations.walkFront.name, 0.2);
					//Send animation name (needed for multiplayer)
					animationSyncHelper.name = Animations.walkFront.name;
				}
				else if(Input.GetKey(KeyCode.A) && !Input.GetKey(KeyCode.S)){
					animation.CrossFade(Animations.walkLeft.name, 0.2);
					//Send animation name (needed for multiplayer)
					animationSyncHelper.name = Animations.walkLeft.name;
				}
				else if( Input.GetKey(KeyCode.D) && !Input.GetKey(KeyCode.S)){
					animation.CrossFade(Animations.walkRight.name, 0.2);
					//Send animation name (needed for multiplayer)
					animationSyncHelper.name = Animations.walkRight.name;
				}
				else if(Input.GetKey(KeyCode.S)){
					animation.CrossFade(Animations.walkBack.name, 0.2);
					//Send animation name (needed for multiplayer)
					animationSyncHelper.name = Animations.walkBack.name;
				}
			}
			else if(fpsController.Walking && fpsController.Running){
				if( Input.GetKey(KeyCode.W) ){
					animation.CrossFade(Animations.runFront.name, 0.2);
					//Send animation name (needed for multiplayer)
					animationSyncHelper.name = Animations.runFront.name;
				}
			}
			if(!fpsController.Walking){
				animation.CrossFade(Animations.stayIdle.name, 0.2);
				//Send animation name (needed for multiplayer)
				animationSyncHelper.name = Animations.stayIdle.name;
			}
		}else{
				animation.CrossFade(Animations.jumpPose.name, 0.2);
				//Send animation name (needed for multiplayer)
				animationSyncHelper.name = Animations.jumpPose.name;
		}
	}
	if(action == Action.Crouch){
		if(fpsController.Walking ){
			if( Input.GetKey(KeyCode.W) ){
				animation.CrossFade(Animations.crouchFront.name, 0.2);
				//Send animation name (needed for multiplayer)
				animationSyncHelper.name = Animations.crouchFront.name;
			}
			else if(Input.GetKey(KeyCode.A) && !Input.GetKey(KeyCode.S)){
				animation.CrossFade(Animations.crouchLeft.name, 0.2);
				//Send animation name (needed for multiplayer)
				animationSyncHelper.name = Animations.crouchLeft.name;
			}
			else if( Input.GetKey(KeyCode.D) && !Input.GetKey(KeyCode.S)){
				animation.CrossFade(Animations.crouchRight.name, 0.2);
				//Send animation name (needed for multiplayer)
				animationSyncHelper.name = Animations.crouchRight.name;
			}
			else if(Input.GetKey(KeyCode.S)){
				animation.CrossFade(Animations.crouchBack.name, 0.2);
				//Send animation name (needed for multiplayer)
				animationSyncHelper.name = Animations.crouchBack.name;
			}
		}else{
			animation.CrossFade(Animations.crouchIdle.name, 0.2);
			//Send animation name (needed for multiplayer)
			animationSyncHelper.name = Animations.crouchIdle.name;
		}
	}
	if(action == Action.Prone){
		if(fpsController.Walking ){
			if( Input.GetKey(KeyCode.W) ){
				animation.CrossFade(Animations.proneFront.name, 0.2);
				//Send animation name (needed for multiplayer)
				animationSyncHelper.name = Animations.proneFront.name;
			}
			else if(Input.GetKey(KeyCode.A) && !Input.GetKey(KeyCode.S)){
				animation.CrossFade(Animations.proneLeft.name, 0.2);
				//Send animation name (needed for multiplayer)
				animationSyncHelper.name = Animations.proneLeft.name;
			}
			else if( Input.GetKey(KeyCode.D) && !Input.GetKey(KeyCode.S)){
				animation.CrossFade(Animations.proneRight.name, 0.2);
				//Send animation name (needed for multiplayer)
				animationSyncHelper.name = Animations.proneRight.name;
			}
			else if(Input.GetKey(KeyCode.S)){
				animation.CrossFade(Animations.proneBack.name, 0.2);
				//Send animation name (needed for multiplayer)
				animationSyncHelper.name = Animations.proneBack.name;
			}
		}else{
			animation.CrossFade(Animations.proneIdle.name, 0.2);
			//Send animation name (needed for multiplayer)
			animationSyncHelper.name = Animations.proneIdle.name;
		}
	}
	ThirdPersonWeaponControl();
}

function ThirdPersonWeaponControl(){
	if(action != Action.Prone){
		if(twoHandedWeapons.Contains(weapManager.SelectedWeapon)){
			animationForHands.name = Animations.gunIdle.name;
		}
		else if(pistols.Contains(weapManager.SelectedWeapon)){
			animationForHands.name = Animations.pistolIdle.name;
		}
		else if(knivesNades.Contains(weapManager.SelectedWeapon)){
			animationForHands.name = Animations.knifeIdle.name;
		}
	}else{
		animationForHands.name = "Null";
	}
}

function configureAnimations(){
	//Set animations Wrap Mode and Speed
	if(Animations.stayIdle){
		animation[Animations.stayIdle.name].wrapMode = WrapMode.Loop;
	}
	if(Animations.crouchIdle){
		animation[Animations.crouchIdle.name].wrapMode = WrapMode.Loop;
	}
	if(Animations.proneIdle){
		animation[Animations.proneIdle.name].wrapMode = WrapMode.Loop;
	}
	if(Animations.walkFront){
		animation[Animations.walkFront.name].wrapMode = WrapMode.Loop;
		animation[Animations.walkFront.name].speed = Animations.walkAnimationsSpeed;
	}
	if(Animations.walkBack){
		animation[Animations.walkBack.name].wrapMode = WrapMode.Loop;
		animation[Animations.walkBack.name].speed = Animations.walkAnimationsSpeed;
	}
	if(Animations.walkLeft){
		animation[Animations.walkLeft.name].wrapMode = WrapMode.Loop;
		animation[Animations.walkLeft.name].speed = Animations.walkAnimationsSpeed;
	}
	if(Animations.walkRight){
		animation[Animations.walkRight.name].wrapMode = WrapMode.Loop;
		animation[Animations.walkRight.name].speed = Animations.walkAnimationsSpeed;
	}
	if(Animations.runFront){
		animation[Animations.runFront.name].wrapMode = WrapMode.Loop;
		animation[Animations.runFront.name].speed = Animations.runAnimationsSpeed;
	}
	if(Animations.crouchFront){
		animation[Animations.crouchFront.name].wrapMode = WrapMode.Loop;
		animation[Animations.crouchFront.name].speed = Animations.crouchAnimationsSpeed;
	}
	if(Animations.crouchLeft){
		animation[Animations.crouchLeft.name].wrapMode = WrapMode.Loop;
		animation[Animations.crouchLeft.name].speed = Animations.crouchAnimationsSpeed;
	}
	if(Animations.crouchRight){
		animation[Animations.crouchRight.name].wrapMode = WrapMode.Loop;
		animation[Animations.crouchRight.name].speed = Animations.crouchAnimationsSpeed;
	}
	if(Animations.crouchBack){
		animation[Animations.crouchBack.name].wrapMode = WrapMode.Loop;
		animation[Animations.crouchBack.name].speed = Animations.crouchAnimationsSpeed;
	}
	if(Animations.proneFront){
		animation[Animations.proneFront.name].wrapMode = WrapMode.Loop;
		animation[Animations.proneFront.name].speed = Animations.proneAnimationsSpeed;
	}
	if(Animations.proneLeft){
		animation[Animations.proneLeft.name].wrapMode = WrapMode.Loop;
		animation[Animations.proneLeft.name].speed = Animations.proneAnimationsSpeed;
	}
	if(Animations.proneRight){
		animation[Animations.proneRight.name].wrapMode = WrapMode.Loop;
		animation[Animations.proneRight.name].speed = Animations.proneAnimationsSpeed;
	}
	if(Animations.proneBack){
		animation[Animations.proneBack.name].wrapMode = WrapMode.Loop;
		animation[Animations.proneBack.name].speed = Animations.proneAnimationsSpeed;
	}
}