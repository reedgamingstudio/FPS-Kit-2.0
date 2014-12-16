//This script is used to catch fire messages from WeaponScript.js
//Then pass those messages to WeaponSync.cs
//Should be attached to every wepaon with WeaponScript.js

#pragma strict

var thirdPersonWeapon : GameObject;
private var weapScript : WeaponScript;

function Awake(){
	weapScript = gameObject.GetComponent.<WeaponScript>();
}

function Fire(){
	if(thirdPersonWeapon.active == false){
		thirdPersonWeapon.active = true;
	}
	if(weapScript.GunType == weapScript.gunType.MACHINE_GUN){
		thirdPersonWeapon.SendMessage("syncMachineGun", weapScript.errorAngle);
	}
	if(weapScript.GunType == weapScript.gunType.SHOTGUN){
		thirdPersonWeapon.SendMessage("syncShotGun", weapScript.ShotGun.fractions);
	}
	if(weapScript.GunType == weapScript.gunType.GRENADE_LAUNCHER){
		thirdPersonWeapon.SendMessage("syncGrenadeLauncher", weapScript.grenadeLauncher.initialSpeed);
	}
	if(weapScript.GunType == weapScript.gunType.KNIFE){
		thirdPersonWeapon.SendMessage("syncKnife");
	}
}