//EnableHelper used to interact between C# and JS
//Create empty game object and tag it "EnableHelper"
//When this object active, assigned scripts are enabled
//Once we deactivate this object, all script become disabled aswell
//Usefull for pausing game without changing timeScale

#pragma strict
import System.Collections.Generic;

var fpsController : FPScontroller;
var weaponManager : WeaponManager;
//Assign 2 mouse looks
var mouseLook1 : FPSMouseLook;
var mouseLook2 : FPSMouseLook;

private var enablerReferenceObject : GameObject;

function Start () {
	enablerReferenceObject = gameObject.FindWithTag("EnableHelper").gameObject;
}

function Update () {
	//Reference object is enabled, enable all assigned scripts
	if(enablerReferenceObject && enablerReferenceObject.active == true){
		if(fpsController.canControl == false){
			fpsController.canControl = true;
		}
		if(weaponManager.enabled == false && weaponManager.SelectedWeapon && weaponManager.SelectedWeapon.enabled == false){
			weaponManager.enabled = true;
			weaponManager.SelectedWeapon.enabled = true;
		}
		if(mouseLook1.enabled == false && mouseLook2.enabled == false){
			mouseLook1.enabled = true;
			mouseLook2.enabled = true;
		}
	}
	
	//Reference object is disabled, deactivate all assigned scripts
	if(!enablerReferenceObject || enablerReferenceObject.active == false){
		if(fpsController.canControl == true ){
			fpsController.canControl = false;
		}
		if(weaponManager.enabled == true && weaponManager.SelectedWeapon && weaponManager.SelectedWeapon.enabled == true){
			weaponManager.SelectedWeapon.enabled = false;
			weaponManager.enabled = false;
		}
		if(mouseLook1.enabled == true && mouseLook2.enabled == true){
			mouseLook1.enabled = false;
			mouseLook2.enabled = false;
		}
	}
	
	if(!enablerReferenceObject && gameObject.FindWithTag("EnableHelper").gameObject != null){
		enablerReferenceObject = gameObject.FindWithTag("EnableHelper").gameObject;
	}
}