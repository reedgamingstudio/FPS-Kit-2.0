//NSdesignGames @ 2012
//FPS Kit | Version 2.0

#pragma strict

import System.Collections.Generic;
//This script is used to pick up available weapons
//SHould be attached to GameObject with CharacterCOntroller component
var guiStyle : GUISkin;

enum PickUpStyle {Replace, Add};
var pickUpStyle : PickUpStyle;
//When player pick weapon he have alredy add (BulletsPerClip*pickAmmoMultiply) amount of bullets
var pickAmmoMultiply : int = 1;
//If wepon have more then (BulletsPerClip*reserveAmmoLimit) bullets, dont auto pick it
var reserveAmmoLimit : int = 3;
var throwForce : float = 500;
var spawnObject : Transform;
//Display actions properties
private var actionsToDisplay : int = 5;
private var messageTimeOut : float = 5;

//Wepon models to throw
var weapons : List.<GameObject>;
//All available weapons (assign all existing weapons)
var playerWeapons : List.<WeaponScript>;
//Player actions ti be displayed
@HideInInspector
var actionsList : List.<String>;
@HideInInspector
var timer : List.<float>;

private var weapName : String;
private var weaponToThrow : GameObject;
private var newWeapon : WeaponScript;
private var WeaponToPick : GameObject;
private var weapManager : WeaponManager;
//GUI Color fade
private var color: float;
private var text : String;

private var controller : CharacterController;
private var prevHeight : float;

function Awake () {
	weapManager = gameObject.FindWithTag("WeaponManager").GetComponent.<WeaponManager>();
	controller = GetComponent (CharacterController);
	prevHeight = controller.height;
}

function Update () {
	//Update weapon to pick status, incase trigger miss somthing
	if(prevHeight != controller.height){
		WeaponToPick = null;
		prevHeight = controller.height;
	}
	if(WeaponToPick){
		for(var a : int = 0; a < playerWeapons.Count; a++){
			if(playerWeapons[a].weaponName == WeaponToPick.name){
				newWeapon = playerWeapons[a];
			}
		}
		
		for(var i : int = 0; i<weapons.Count;i++){
			if(weapons[i].name == weapManager.SelectedWeapon.weaponName){
				weaponToThrow = weapons[i];
			}
		}
		
		if(weapManager.allWeapons.Contains(newWeapon)){
			if(newWeapon.GunType == newWeapon.GunType.MACHINE_GUN){
				if(newWeapon.machineGun.clips < newWeapon.machineGun.bulletsPerClip*reserveAmmoLimit){
					newWeapon.machineGun.clips += newWeapon.machineGun.bulletsPerClip*pickAmmoMultiply;
					Destroy(WeaponToPick);
					//Register Action
					actionsList.Add(("Picked ammo for | " + newWeapon.weaponName).ToString());
		       		timer.Add(messageTimeOut);
				}else{
					text = "Full Ammo    ";
				}
			}
			if(newWeapon.GunType == newWeapon.GunType.GRENADE_LAUNCHER){
				if(newWeapon.grenadeLauncher.ammoCount < reserveAmmoLimit){
					newWeapon.grenadeLauncher.ammoCount += pickAmmoMultiply;
					Destroy(WeaponToPick);
					//Register Action
					actionsList.Add(("Picked ammo for | " + newWeapon.weaponName).ToString());
		       		timer.Add(messageTimeOut);
				}else{
					text = "Full Ammo    ";
				}
			}
			if(newWeapon.GunType == newWeapon.GunType.SHOTGUN){
				if(newWeapon.ShotGun.clips < newWeapon.ShotGun.bulletsPerClip * reserveAmmoLimit){
					newWeapon.ShotGun.clips += newWeapon.ShotGun.bulletsPerClip*pickAmmoMultiply;
					Destroy(WeaponToPick);
					//Register Action
					actionsList.Add(("Picked ammo for | " + newWeapon.weaponName).ToString());
		       		timer.Add(messageTimeOut);
				}else{
					text = "Full Ammo    ";
				}
			}
		}
		
		//Press F key to pick up weapon
		if(Input.GetKeyDown(KeyCode.F)){
			if(pickUpStyle == PickUpStyle.Replace){
				if(weapManager.allWeapons.Contains(newWeapon))
					return;
				//Throw current weapon
		        var clone : GameObject;        
		        clone = Instantiate(weaponToThrow, spawnObject.position, spawnObject.rotation);
		        clone.name = weaponToThrow.name;
		        //Add force when we throw weapon
		       	clone.rigidbody.AddForce (-spawnObject.transform.up * throwForce);
				weapManager.SwitchWeapons(weapManager.allWeapons[weapManager.index].gameObject, newWeapon.gameObject);
		        weapManager.allWeapons[weapManager.index] = newWeapon;
		        Destroy(WeaponToPick);
		        //Register Action
		        actionsList.Add(("Picked | " + newWeapon.weaponName).ToString());
		        timer.Add(messageTimeOut);
			}
			if(pickUpStyle == PickUpStyle.Add){
				if(weapManager.allWeapons.Contains(newWeapon))
					return;
				weapManager.allWeapons.Add(newWeapon);
				weapManager.SwitchWeapons(weapManager.SelectedWeapon.gameObject, weapManager.allWeapons[weapManager.allWeapons.Count-1].gameObject);
				weapManager.index = weapManager.allWeapons.Count-1;
		        Destroy(WeaponToPick);
		        //Register Action
		        actionsList.Add(("Picked | " + newWeapon.weaponName).ToString());
		        timer.Add(messageTimeOut);
			}
		}
	}
	
	//Remove actions
	if(timer.Count > 0){
		for(var b : int = 0; b < timer.Count; b ++){
			timer[b]-= Time.deltaTime;
			if(timer[b]<0){
				timer.Remove(timer[b]);
				actionsList.Remove(actionsList[b]);
			}
		}
		
		if(timer.Count > actionsToDisplay &&  actionsList.Count > actionsToDisplay){
			timer.Remove(timer[0]);
			actionsList.Remove(actionsList[0]);
		}
	}
}

function OnTriggerStay(weapon : Collider){
	//Detect if we on pickable weapon
	if(weapon.gameObject.tag == "PickUp"){
		WeaponToPick = weapon.gameObject;
	}
}

function OnTriggerExit(weapon : Collider){
	if(weapon.gameObject.tag == "PickUp"){
		WeaponToPick = null;
	}
}

function OnGUI(){
	GUI.skin = guiStyle;
	if(WeaponToPick){
		weapName = WeaponToPick.name;
		color = Mathf.Lerp(color, 0.9, Time.deltaTime*10);
	}else{
		color = Mathf.Lerp(color, 0, Time.deltaTime*10);
	}
	
	GUI.color.a = color;
	
	if(!weapManager.allWeapons.Contains(newWeapon)){
		text = "Press `F` to pick  |  " + weapName;
	}
	var rect : Rect = Rect (Screen.width/2 - text.Length*10/2,Screen.height - 105,text.Length*10,45);
	GUI.Box (rect, text );
	
	GUI.color.a = 0.6;
	//Display actions
	GUILayout.BeginArea(Rect (10,Screen.height - (actionsList.Count*33)-10, 300 ,Screen.height));
		GUILayout.BeginVertical();
		for(var i : int = 0; i < actionsList.Count; i++){
			GUILayout.Box(actionsList[i], GUILayout.Width(300), GUILayout.Height(30));
		}
		GUILayout.EndVertical();
	GUILayout.EndArea();
}

@script AddComponentMenu ("FPS system/Weapon System/WeaponPickUp")