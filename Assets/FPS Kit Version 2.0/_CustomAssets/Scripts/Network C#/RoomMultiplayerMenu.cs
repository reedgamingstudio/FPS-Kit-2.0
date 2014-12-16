//NSdesignGames @ 2012
//FPS Kit | Version 2.0 + Multiplayer

using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class RoomMultiplayerMenu : Photon.MonoBehaviour {

	public GUISkin guiSkin;
	public GameObject playerPrefab;
	public List<Transform> spawnPoints;
	public GUIStyle style;
	
	
	[HideInInspector]
	public bool isPaused;
	GameObject enableHelper;
	
	ConnectMenu cm;
	bool playerList;
	Resolution[] resolutions;
	string[] QualityNames;
	int resolutionIndex = 3;
	Vector2 scroll;
	Vector2 scroll2;
	Vector2 scroll3;
	
	//Our player spawned
	GameObject Player;
	
	// Use this for initialization
	void Start () {
		cm = GetComponent<ConnectMenu>();
		isPaused = true;
		resolutions = Screen.resolutions;
		resolutionIndex = (resolutions.Length-1)/2;
		QualityNames = QualitySettings.names;
		playerList = true;
		enableHelper = GameObject.FindWithTag("EnableHelper").gameObject;
	}
	
	// Update is called once per frame
	void Update () {
		
		if(Input.GetKeyDown(KeyCode.Tab) && Player){
			isPaused = !isPaused;
		}
		/*if(!Player){
			isPaused = true;	
		}*/
		
		if(Input.GetKeyDown(KeyCode.P)){
			Screen.fullScreen = !Screen.fullScreen;
			if(!Screen.fullScreen){
				Screen.SetResolution(resolutions[resolutionIndex].width, resolutions[resolutionIndex].height, true);
			}
		}
		
		if(isPaused){
			if(enableHelper.active == true){
				enableHelper.active = false;
			}	
			Screen.lockCursor = false;
		}else{
			if(enableHelper.active == false){
				enableHelper.active = true;
			}
			Screen.lockCursor = true;
		}
	}
	
		
	void OnGUI(){
	 	GUI.Label(new Rect(Screen.width-190, Screen.height-80, 190, 20), " Tab - pause menu", style);
		if(!isPaused)
			return;
		GUI.skin = guiSkin;
		
		GUI.color = new Color(1, 1, 1, 0.7f);
	   
	    if(isPaused){
	    	GUI.Window (0, new Rect (Screen.width/2 - 250, Screen.height/2 - 150, 500, 300), MainMenu, "Pause Menu | Room: " + PhotonNetwork.room.name);
	    	GUI.Window (1, new Rect (Screen.width/2-240, Screen.height/2 - 95, 150, 100), Resolutions, "Resolution");
	    	GUI.Window (2, new Rect (Screen.width/2-85, Screen.height/2 - 95, 150, 100), QualityWindow, "Quality");
	    }
	
	}
	
	void MainMenu (int windowID) {  
		GUILayout.Space (10); 
		GUILayout.BeginHorizontal();
			GUILayout.Box(resolutions[resolutionIndex].width + " x " +  resolutions[resolutionIndex].height, GUILayout.Width(150), GUILayout.Height(25));
			
			GUILayout.Box(QualityNames[QualitySettings.GetQualityLevel ()],   GUILayout.Width(150), GUILayout.Height(25));
		
		
	 	GUILayout.Space (15); 
			GUILayout.BeginVertical();
				if(!Player){
					if(GUILayout.Button("Spawn")){
						isPaused = false;
						SpawnPlayer();
					}
				}else{
					if(GUILayout.Button("Resume")){
						isPaused = false;
					}
				}
				if(GUILayout.Button("Leave Room")){
					LeaveRoom();
				}
			GUILayout.EndVertical();
	    GUILayout.EndHorizontal();
	    
		GUILayout.Space (55);
		
	    //GUILayout.Label("Objective: Have fun :D");
		GUILayout.BeginHorizontal();
			if(playerList){
				GUI.color = new Color(0, 20, 0, 0.6f);
			}else{
				GUI.color = Color.white;
			}
			if(GUILayout.Button("Player List", GUILayout.Width(150), GUILayout.Height(25))){
				playerList = true;
			}
			if(!playerList){
				GUI.color = new Color(0, 20, 0, 0.6f);
			}else{
				GUI.color = Color.white;
			}
			if(GUILayout.Button("Controls", GUILayout.Width(150), GUILayout.Height(25))){
				playerList = false;
			}
		GUILayout.EndHorizontal();
				
	    GUILayout.Space (5);
	    GUI.color = Color.white;
	    scroll3 = GUILayout.BeginScrollView(scroll3, GUILayout.Width(480), GUILayout.Height(100));
			if(!playerList){
				//Show controls
		    	GUI.color = new Color(20, 20,0, 0.6f);
			    GUILayout.Label("Tab - Pause Menu"); 
			    GUILayout.Label("P - Fullscreen"); 
				GUILayout.Label("T - Chat / Enter - send"); 
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
			}else{
				//Show player list***
				GUI.color = new Color(1,1,1,0.8f);
				foreach(PhotonPlayer player in PhotonNetwork.playerList){
					if(PhotonNetwork.player.name == player.name){
						GUI.color = Color.yellow;
					}else{
						GUI.color = Color.white;
					}
					GUILayout.BeginHorizontal("box");{
						GUILayout.Label(player.name, style);
						if(PhotonNetwork.player.name == player.name){
							GUILayout.FlexibleSpace();
							GUILayout.Label("Ping: " + PhotonNetwork.GetPing().ToString(), style);
						}
						
					GUILayout.EndHorizontal();}
				}
			}
	    GUILayout.EndScrollView();
	}
	
	void  Resolutions( int windowID){
		GUI.BringWindowToFront(windowID);
		GUILayout.Space (10);
		scroll = GUILayout.BeginScrollView(scroll, GUILayout.Width(140), GUILayout.Height(65));
		GUILayout.BeginVertical();
			for(int a = 0; a < resolutions.Length; a++){
				if(resolutions[a].width == Screen.width && resolutions[a].height == Screen.height){
					GUI.color = new Color(0, 20, 20, 0.6f);
				}else{
					GUI.color = new Color(20, 20, 20, 0.6f);
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
	
	void QualityWindow(int windowID){
		GUI.BringWindowToFront(windowID);
		GUILayout.Space (10);
		scroll2 = GUILayout.BeginScrollView(scroll2, GUILayout.Width(140), GUILayout.Height(65));
		GUILayout.BeginVertical();
		 	for (var i = 0; i < QualityNames.Length; i++){
		 		if(QualityNames[i] == QualityNames[QualitySettings.GetQualityLevel ()]){
		 			GUI.color = new Color(0, 20, 20, 0.6f);
		 		}else{
		 			GUI.color = new Color(20, 20, 20, 0.6f);
		 		}
		        if (GUILayout.Button (QualityNames[i]))
		            QualitySettings.SetQualityLevel (i, true);
	    	}
		GUILayout.EndVertical();
		GUILayout.EndScrollView();
	}
	
	void SpawnPlayer(){
		if(Player){
			Destroy(Player);	
		}
		enableHelper.active = true;
		//Spawn our player
		int temp;
		temp = Random.Range(0, spawnPoints.Count);
		Player = PhotonNetwork.Instantiate(playerPrefab.name, spawnPoints[temp].position, spawnPoints[temp].rotation, 0);
		Player.name = cm.playerName;
		transform.GetChild(0).gameObject.active = false;
	}
	
	void LeaveRoom(){
		if(PhotonNetwork.connected){
			PhotonNetwork.RemoveAllBufferedMessages();
			PhotonNetwork.RemoveRPCs();
			cm.enabled = true;
			cm.connectingToRoom = true;
			cm.fadeDir = -1;
			PhotonNetwork.LeaveRoom();
			this.enabled = false;
			transform.GetChild(0).gameObject.active = true;
			isPaused = false;
			Player = null;
		}
	}
	
	void OnDisconnectedFromPhoton(){	
		print ("Disconnected from Photon");
		//Something wrong with connection - go to main menu
		cm.enabled = true;
		cm.fadeDir = -1;
		transform.GetChild(0).gameObject.active = true;
		isPaused = false;
		Player = null;
		this.enabled = false;
	}
}
