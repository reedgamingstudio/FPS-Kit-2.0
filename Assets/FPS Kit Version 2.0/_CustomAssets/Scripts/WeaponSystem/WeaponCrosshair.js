//NSdesignGames @ 2012
//FPS Kit | Version 2.0

#pragma strict

var crosshairTexture : Texture2D;
var length : float = 15;
var width : float =1;
//Crosshair responce to player action
var dynamicCrosshair : boolean = true;
var crosshairResponce : float = 60;
var defaultDistance : float = 40;
var smooth : float = 0.3;
private var crosshair : boolean = true;
private var textu : Texture;
private var lineStyle : GUIStyle;
private var distance : float;
private var currentDistance : float;
private var motor : FPScontroller;
private var weaponManager : WeaponManager;
private var weaponScript : WeaponScript;

function Awake () {
	lineStyle = GUIStyle();
	lineStyle.normal.background = crosshairTexture;
	motor = gameObject.FindWithTag("Player").GetComponent.<FPScontroller>();
	weaponManager = gameObject.FindWithTag("WeaponManager").GetComponent.<WeaponManager>();
}

function Update(){
	if(weaponManager){
		if(weaponManager.SelectedWeapon)
			weaponScript = weaponManager.SelectedWeapon.GetComponent.<WeaponScript>();
	}
	
	if(Time.timeScale < 0.01)
		return;
		
	if(dynamicCrosshair){
		var fireInput = Input.GetMouseButtonDown(0);
		//Dynamic crosshair***
		if(weaponScript && (fireInput || weaponScript.fire)){
			//Single weapons crosshair responce
			if(weaponScript.singleFire){
				if(fireInput && weaponScript.canFire && !weaponScript.isReload && !weaponScript.noBullets){
					if(distance < crosshairResponce*4){
						distance = distance + crosshairResponce;
					}
				}else{
					distance = Mathf.Lerp(distance, defaultDistance, Time.deltaTime/smooth);
				}
			}else{
			//Automatic weapons crosshair responce
				if(weaponScript.fire && !weaponScript.noBullets){
					currentDistance = crosshairResponce*2;
				}else{
					currentDistance = defaultDistance;	
				}
				distance = Mathf.Lerp(distance, currentDistance, Time.deltaTime/smooth);
			}
		}else{
			if(motor.Walking){
				currentDistance = crosshairResponce+motor.movement.velocity.magnitude*2;
			}else{
				currentDistance = defaultDistance;
			}
			distance = Mathf.Lerp(distance, currentDistance, Time.deltaTime/smooth);
		}
	}else{
		distance = defaultDistance;
	}
	
	if(weaponScript)
		if(weaponScript.aimed){
			crosshair = false;
		}else{
			crosshair = true;
		}
}

function OnGUI () {
	if(!(distance > (Screen.height/2)) && crosshair){
	
		GUI.Box(Rect((Screen.width - distance)/2 - length, (Screen.height - width)/2, length, width), textu, lineStyle);
		GUI.Box(Rect((Screen.width + distance)/2, (Screen.height- width)/2, length, width), textu, lineStyle);
	
		GUI.Box(Rect((Screen.width - width)/2, (Screen.height - distance)/2 - length, width, length), textu, lineStyle);
		GUI.Box(Rect((Screen.width - width)/2, (Screen.height + distance)/2, width, length), textu, lineStyle);
	}
}

