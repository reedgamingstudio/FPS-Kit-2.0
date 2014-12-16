//NSdesignGames @ 2012
//FPS Kit | Version 2.0

#pragma strict
import System.Collections.Generic;
//This script should be attached to an object called Weapons (Which children are all player weapons)
//Weapons->Weapon1, Weapon2, Weapon3 etc.

var allWeapons : List.<WeaponScript>;
var SwitchTime = 0.5;
@HideInInspector
public var SelectedWeapon : WeaponScript;
//Weapon index (What weapon we should take in the beginning of game)
//By default its 0 - take first weapon
var index : int = 0;
var takeInAudio : AudioClip;

private var defaultPrimaryWeap : GameObject;
private var defaultSecondaryWeap : GameObject;

private var canSwitch : boolean;

function Awake(){
	for(var a : int = 0; a < transform.childCount;a++){
		transform.GetChild(a).gameObject.SetActiveRecursively(false);
	}
	for(var i : int; i < allWeapons.Count; i++){
		allWeapons[i].gameObject.SetActiveRecursively(false);
	}
	TakeFirstWeapon(allWeapons[index].gameObject);
}

function Update () {
	if(Time.timeScale < 0.01)
		return;
		
	SelectedWeapon = allWeapons[index];
	if(allWeapons.Count < 2)
		return;
	//Switch to next weapon
	if(Input.GetKeyDown("2") && canSwitch){
		if(index < allWeapons.Count-1){
			SwitchWeapons(allWeapons[index].gameObject, allWeapons[index+1].gameObject);
			index++;
		}else{
			SwitchWeapons(allWeapons[allWeapons.Count-1].gameObject, allWeapons[0].gameObject);
			index=0;
		}
	}
	
	//Switch to previous weapon
	if(Input.GetKeyDown("1") && canSwitch){
		if(index > 0){
			SwitchWeapons(allWeapons[index].gameObject, allWeapons[index-1].gameObject);
			index--;
		}else{
			SwitchWeapons(allWeapons[0].gameObject, allWeapons[allWeapons.Count-1].gameObject);
			index=allWeapons.Count-1;
		}
	}	
}

function TakeFirstWeapon(nextWeapon : GameObject){
	//Play take audio
	audio.clip = takeInAudio;
	audio.Play();
	
	nextWeapon.SetActiveRecursively(true);	
	nextWeapon.SendMessage("selectWeapon");
	canSwitch = true;
}

function SwitchWeapons(currentWeapon : GameObject, nextWeapon : GameObject){
	canSwitch = false;
	if(currentWeapon.active == true){
		currentWeapon.SendMessage("deselectWeapon");
	}
	yield WaitForSeconds(SwitchTime );
	//Play take audio
	audio.clip = takeInAudio;
	audio.Play();
	
	currentWeapon.SetActiveRecursively(false);
	nextWeapon.SetActiveRecursively(true);	
	nextWeapon.SendMessage("selectWeapon");
	canSwitch = true;
}

@script RequireComponent (AudioSource)
@script AddComponentMenu ("FPS system/Weapon System/WeaponManager")