//NSdesignGames @ 2012
//FPS Kit | Version 2.0

#pragma strict

var slowMotion : boolean;
//How much should we slow time 
//Recomended values from 0.2 to 0.9 
var guiSkin : GUISkin;
var slowTimeTo : float = 0.5;

@HideInInspector
var audios : AudioSource[];

function Start () {

}

function Update () {
	if(Time.timeScale < 0.01)
		return;
		
	if(Input.GetKeyDown(KeyCode.Q)){
		slowMotion = !slowMotion;
	}
	
	if(slowMotion){
       	audios = FindObjectsOfType(AudioSource) as AudioSource[];
        for (var i = 0; i < audios.Length; i++){
           audios[i].pitch = slowTimeTo;
        }
		Time.timeScale = slowTimeTo;
		Time.fixedDeltaTime = 0.005;
	}
	else if(!slowMotion && Time.deltaTime != 1){
	  	audios = FindObjectsOfType(AudioSource) as AudioSource[];
        for (var a = 0; a < audios.Length; a++){
           audios[a].pitch = 1;
        }
		Time.timeScale = 1;
		Time.fixedDeltaTime = 0.02;
	}
}

function OnGUI(){
	GUI.skin = guiSkin;
	GUI.color.a = 0.8;
	GUI.Box(Rect(Screen.width-205, 60, 200, 30), "Slow Mo: " + slowMotion.ToString());
}