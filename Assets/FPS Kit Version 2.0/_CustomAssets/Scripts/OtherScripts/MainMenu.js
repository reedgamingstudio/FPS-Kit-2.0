//NSdesignGames @ 2012
//FPS Kit | Version 2.0

#pragma strict
import System.Collections.Generic;

var guiStyle : GUISkin;
var objective : String;
var showTime : boolean = true;

@HideInInspector
var finishedGame : boolean;
private var weaponManager : WeaponManager;
private var startGame : boolean = true;
private var timer : float;
private var mainMenu : boolean;
private var resolutions : Resolution[];
private var QualityNames : String[];
private var resolutionIndex : int = 3;
private var scroll : Vector2;
private var scroll2 : Vector2;
private var scroll3 : Vector2;
private var niceTime : String;

function Start () {
	weaponManager = GameObject.FindWithTag("WeaponManager").GetComponent.<WeaponManager>();
	mainMenu = true;
	Invoke("Pause", 0.01);
	resolutions = Screen.resolutions;
	resolutionIndex = (resolutions.Length-1)/2;
	QualityNames = QualitySettings.names;
}

function Update () {
	if(startGame && weaponManager.SelectedWeapon){
		weaponManager.SelectedWeapon.gameObject.SetActiveRecursively(false);
	}
	if(!startGame){
		if(!finishedGame){
			timer += Time.deltaTime;
		}
		
		if(Input.GetKeyDown(KeyCode.Tab)){
			mainMenu = !mainMenu;
			Pause();
		}
		
		if(!mainMenu){
			Screen.lockCursor = true;
		}
	}
	
	if(Input.GetKeyDown(KeyCode.P)){
		Screen.fullScreen = !Screen.fullScreen;
		if(!Screen.fullScreen){
			Screen.SetResolution(resolutions[resolutionIndex].width, resolutions[resolutionIndex].height, true);
		}
	}
}

function OnGUI(){
	GUI.skin = guiStyle;
	
	GUI.color.a = 0.7;
	//Timer
    var minutes : int = Mathf.FloorToInt(timer / 60F);
 	var seconds : int = Mathf.FloorToInt(timer - minutes * 60);
 	niceTime = String.Format("{0:0}:{1:00}", minutes, seconds);
 	if(showTime){
		if(!finishedGame){
		    GUI.Box(new Rect(Screen.width/2 - 50,40,100,30), niceTime);
	   	}else{
	   		GUI.Box(new Rect(Screen.width/2 - 100,40,200,30), "Your Time | " + niceTime);
	   	}
   }
    
    if(mainMenu){
    	GUI.Window (0, Rect (Screen.width/2 - 250, Screen.height/2 - 150, 500, 300), MainMenu, "Main Menu");
    	GUI.Window (1, Rect (Screen.width/2-240, Screen.height/2 - 100, 150, 100), Resolutions, "Resolution");
    	GUI.Window (2, Rect (Screen.width/2-85, Screen.height/2 - 100, 150, 100), QualityWindow, "Quality");
    }

}

function MainMenu (windowID : int) {  
	GUILayout.Space (10); 
	GUILayout.BeginHorizontal();
		GUILayout.Box(resolutions[resolutionIndex].width + " x " +  resolutions[resolutionIndex].height, GUILayout.Width(150), GUILayout.Height(20));
		
		GUILayout.Box(QualityNames[QualitySettings.GetQualityLevel ()],   GUILayout.Width(150), GUILayout.Height(20));
	
	
 	GUILayout.Space (15); 
    if(startGame){
    	if(GUILayout.Button("Start Game", GUILayout.Width(150), GUILayout.Height(30))){
    		startGame = false;
    		mainMenu = false;
    		Pause();
    		weaponManager.SelectedWeapon.gameObject.SetActiveRecursively(true);
    		weaponManager.TakeFirstWeapon(weaponManager.SelectedWeapon.gameObject);
    	}
    }else{
    	GUILayout.BeginVertical();
	  	if(GUILayout.Button("Restart Game", GUILayout.Width(150), GUILayout.Height(30))){
	  		Time.timeScale = 1;
			Application.LoadLevel(0);
    	}
    	GUILayout.EndVertical();
    }
    GUILayout.EndHorizontal();
    
	GUILayout.Space (90);
	GUI.color = Color(0, 20, 0, 0.6);
	if(!finishedGame){
    	//GUILayout.Label("Objective: Find secret room using less time"); 
    	GUILayout.Label(objective);
    }else{
    	GUILayout.Label("Objective: Completed with time: " + niceTime + " min");
    }
    GUILayout.Space (5);
    GUI.color = Color.white;
    scroll3 = GUILayout.BeginScrollView(scroll3, GUILayout.Width(480), GUILayout.Height(115));
    	GUI.color = Color(20, 20,0, 0.6);
	    GUILayout.Label("Tab - Main Menu"); 
	    GUILayout.Label("Q - slow motion");
	    GUILayout.Label("P - Fullscreen"); 
	    GUILayout.Label("C - crouch");
	    GUILayout.Label("Left Ctrl - prone"); 
	    GUILayout.Label("LMB - fire"); 
	    GUILayout.Label("RMB - aim");
	    GUILayout.Label("F - weapon pick up");
	    GUILayout.Label("R - reload");
	    GUILayout.Label("Left Shift - run");
	    GUILayout.Label("Space - jump");
	    GUILayout.Label("1/2 - weapon change");
	    GUILayout.Label("While selected STW-25 press G for flashlight");
    GUILayout.EndScrollView();
}

function Resolutions(windowID : int){
	GUI.BringWindowToFront(windowID);
	scroll = GUILayout.BeginScrollView(scroll, GUILayout.Width(140), GUILayout.Height(75));
	GUILayout.BeginVertical();
		for(var a : int; a < resolutions.Length; a++){
			if(resolutions[a].width == Screen.width && resolutions[a].height == Screen.height){
				GUI.color = Color(0, 20, 20, 0.6);
			}else{
				GUI.color = Color(20, 20, 20, 0.6);
			}
			if(GUILayout.Button(resolutions[a].width + " x " + resolutions[a].height)){
				resolutionIndex = a;
				if(Screen.fullScreen){
					Screen.SetResolution (resolutions[resolutionIndex].width,resolutions[resolutionIndex].height, true);	
				}
			}
		}
	GUILayout.EndVertical();
	GUILayout.EndScrollView();
}

function QualityWindow(windowID : int){
	GUI.BringWindowToFront(windowID);
	scroll2 = GUILayout.BeginScrollView(scroll2, GUILayout.Width(140), GUILayout.Height(75));
	GUILayout.BeginVertical();
	 	for (var i = 0; i < QualityNames.Length; i++){
	 		if(QualityNames[i] == QualityNames[QualitySettings.GetQualityLevel ()]){
	 			GUI.color = Color(0, 20, 20, 0.6);
	 		}else{
	 			GUI.color = Color(20, 20, 20, 0.6);
	 		}
	        if (GUILayout.Button (QualityNames[i]))
	            QualitySettings.SetQualityLevel (i, true);
    	}
	GUILayout.EndVertical();
	GUILayout.EndScrollView();
}

function Pause(){
	if(mainMenu){
		Time.timeScale = 0.0001;
		Screen.lockCursor = false;
	}else{
		Time.timeScale = 1;
		Screen.lockCursor = true;
	}
}