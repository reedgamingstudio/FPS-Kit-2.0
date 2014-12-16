//This script is used for next cases:
//For example you pick RPG and shoot till last rocket
//what this script do is deactivate rocked mesh, so it create and illusion
//of having no ammo
//Same for grenade and grenade launcher

import System.Collections.Generic;

#pragma strict

//Mesh that need to be deactivate while player have no ammo
//For ex. Rocker, Grenade etc.
var objectsToDeactivate : List.<GameObject>;
//This need to be attached to the same object as WeaponScript
private var weapScript : WeaponScript;

function Start () {
	weapScript = gameObject.GetComponent.<WeaponScript>();
}

function Update () {
	//We make it work only with grenade launcher gun types
	if(weapScript.GunType == weapScript.gunType.GRENADE_LAUNCHER){
		for(var i = 0; i < objectsToDeactivate.Count; i++){
			if(weapScript.grenadeLauncher.ammoCount == 0){
				objectsToDeactivate[i].SetActiveRecursively(false);
			}else{
				objectsToDeactivate[i].SetActiveRecursively(true);
			}
		}
	}
}