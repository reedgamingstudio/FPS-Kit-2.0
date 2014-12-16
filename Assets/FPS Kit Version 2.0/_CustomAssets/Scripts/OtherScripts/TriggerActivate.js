//NSdesignGames @ 2012
//FPS Kit | Version 2.0

#pragma strict

var guiStyle : GUISkin;
var weaps : GameObject;
var teleportPoint : Transform;
var mm : MainMenu;

private var inside : boolean;

function OnTriggerEnter(weapon : Collider){
	//Detect if we on pickable weapon
	if(weapon.gameObject.tag == "Player"){
		inside = true;
	}
}

function OnTriggerExit(weapon : Collider){
	if(weapon.gameObject.tag == "Player"){
		inside = false;
	}
}

function Update(){
	if(inside){
		if(Input.GetKeyDown(KeyCode.F)){
			GameObject.FindWithTag("Player").transform.position = teleportPoint.position;
			GameObject.FindWithTag("Player").transform.rotation = teleportPoint.rotation;
			inside = false;
			weaps.SetActiveRecursively(true);
			mm.finishedGame = true;
			RenderSettings.fog = false;
			Destroy(gameObject);
		}
	}
}

function OnGUI(){
	if(!inside)
		return;
	GUI.skin = guiStyle;
	GUI.color.a = 0.9;
	GUI.depth = -10;
	var text : String = "Press ´F´ for MORE GUNS!        ";
	var rect : Rect = Rect (Screen.width/2 - text.Length*9/2,Screen.height/2 - 25,text.Length*9,50);
	GUI.Box (rect, text);
}