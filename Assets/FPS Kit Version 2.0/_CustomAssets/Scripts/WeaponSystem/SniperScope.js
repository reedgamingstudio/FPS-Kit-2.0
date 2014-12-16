//NSdesignGames @ 2012
//FPS Kit | Version 2.0

#pragma strict

var scopeTexture : Texture2D;
//When we aim, deactivate all visible Sniper parts (Hands, Gun etc.)
var objectsToDeactivate : GameObject[];

private var weapScript : WeaponScript;


function Awake () {
	weapScript = gameObject.GetComponent.<WeaponScript>();
}

function OnGUI () {
	if(weapScript.aimed){
		GUI.DrawTexture(Rect(Screen.width/2- (Screen.height*1.8)/2,Screen.height/2-Screen.height/2, Screen.height*1.8, Screen.height), scopeTexture);
		for(var i : int = 0; i<objectsToDeactivate.Length;i++){
			objectsToDeactivate[i].SetActiveRecursively(false);
		}
	}else{
		for(var a : int = 0; a<objectsToDeactivate.Length;a++){
			objectsToDeactivate[a].SetActiveRecursively(true);
		}
	}
}

@script AddComponentMenu ("FPS system/Weapon System/SniperScope")
