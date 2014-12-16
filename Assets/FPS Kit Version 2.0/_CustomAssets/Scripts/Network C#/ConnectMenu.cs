//NSdesignGames @ 2012
//FPS Kit | Version 2.0 + Multiplayer

//Implementation of Photon Networking system

using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class ConnectMenu : Photon.MonoBehaviour  {
	
	public GUISkin guiSKin;
	//Use this for loading splash screen
	public Texture2D blackScreen;
	string newRoomName;
	
	[HideInInspector]
	public string playerName;
	public GUIStyle labelStyle;
	
	[HideInInspector]
	public bool connectingToRoom = false;
	RoomMultiplayerMenu pmn;
	MultiplayerChat mc;
	RoomInfo[] allRooms;
	Vector2 scroll;
	//Fade black screen
	[HideInInspector]
	public float fadeValue = new float();
	[HideInInspector]
	public int fadeDir;
	
	// Use this for initialization
	void Start () {
		transform.GetChild(0).gameObject.camera.farClipPlane = 1;
		//Connect to Photon Cloud
		/*if(!PhotonNetwork.connected)
			PhotonNetwork.ConnectUsingSettings("v1.0");*/
		
		allRooms = PhotonNetwork.GetRoomList();
		newRoomName = "Room Name " + Random.Range(111, 999);
		playerName = "Player " + Random.Range(111, 999);
		pmn = GetComponent<RoomMultiplayerMenu>();
		mc = GetComponent<MultiplayerChat>();
		pmn.enabled = false;
		mc.enabled = false;
	}
	
	void Update(){
		//Try to reconnect every 3 seconds
		float updateRate = 3;
		float nextUpdateTime = 0;
		//Do not try connect every frame, but using small intervals (To avoid lag while failed to connect)
		if(!PhotonNetwork.connected){
			if (Time.time - updateRate > nextUpdateTime){
				nextUpdateTime = Time.time - Time.deltaTime;
			}
			// Keep firing until we used up the fire time
			while(nextUpdateTime < Time.time){
				PhotonNetwork.ConnectUsingSettings("v2.4");
				nextUpdateTime += updateRate;
			}
		}
		
		//FInd all existing rooms
		if(PhotonNetwork.connected && allRooms.Length != PhotonNetwork.GetRoomList().Length){
			allRooms = PhotonNetwork.GetRoomList();
		}
	}
	
	// Update is called once per frame
	void OnGUI () {
		GUI.skin = guiSKin;
		
		fadeScreen();
		
		GUI.color = Color.white;
		GUI.depth = -2;
		//If we havnt connected to Photon Cloud do not allow player to join/create room 
		if(!PhotonNetwork.connected){
			GUI.Box (new Rect(Screen.width/2 - 75, Screen.height/2 - 15, 150, 30), "Connecting...");
			GUI.enabled = false;	
		}else{
			GUI.enabled = true;
		}
		if(PhotonNetwork.room != null && PhotonNetwork.connected) 
			return; 
		GUI.Window (0, new Rect (Screen.width/2 - 250, Screen.height/2 - 150, 500, 300), connectMenu, "FPS Kit 2.0 | Multiplayer Test v2.4");
	}
	
	void connectMenu(int id){
		GUILayout.Space (10);
		/*GUILayout.BeginHorizontal();
			GUILayout.FlexibleSpace();
			if(GUILayout.Button("Refresh")){
				allRooms = PhotonNetwork.GetRoomList();
			}
		GUILayout.EndHorizontal();*/
		
		//DIsplay all available rooms
		//Join selected room
		scroll = GUILayout.BeginScrollView(scroll, GUILayout.Width(480), GUILayout.Height(200));{
			foreach(RoomInfo room in allRooms){
				if(allRooms.Length > 0){
					GUILayout.BeginHorizontal();
						GUILayout.Label(room.name);
						
						GUILayout.FlexibleSpace();
						//Player count
						GUILayout.Label(room.playerCount + "/" + room.maxPlayers);
						GUILayout.Space (100);
						if(GUILayout.Button("Join Room")){
							//Join a room
							PhotonNetwork.JoinRoom(room.name);
							PhotonNetwork.playerName = playerName;
							connectingToRoom = true;
						}
					GUILayout.EndHorizontal();
				}
			}
			if(allRooms.Length == 0){
				GUILayout.Label("No rooms created...");
			}
		GUILayout.EndScrollView();}
		
		//Choose player name
		GUILayout.BeginHorizontal();
			playerName = GUILayout.TextField (playerName, 15,  GUILayout.Width(345), GUILayout.Height(25));
			GUILayout.Label("< Player Name", labelStyle);
		GUILayout.EndHorizontal();
		
		//Create new room
		GUILayout.BeginHorizontal();
			newRoomName = GUILayout.TextField (newRoomName, 35,  GUILayout.Width(345), GUILayout.Height(25));
			GUILayout.FlexibleSpace();
			if(GUILayout.Button("Create Room")){
				//Create this room.
				PhotonNetwork.CreateRoom(newRoomName, true, true, 20);
				PhotonNetwork.playerName = playerName;
				// Fails if it already exists and calls: OnPhotonCreateGameFailed
				allRooms = PhotonNetwork.GetRoomList();
				connectingToRoom = true;
			}
		GUILayout.EndHorizontal();
		
		
	}
	
	void OnJoinedRoom(){
		print ("Joined room: " + newRoomName);
		connectingToRoom = false;
		transform.GetChild(0).gameObject.camera.farClipPlane = 600;
		pmn.enabled = true;
		mc.enabled = true;
		pmn.isPaused = true;
		connectingToRoom = false;
		this.enabled = false;
	}
	
	void fadeScreen(){
		if(connectingToRoom){
			fadeDir = 1;
			fadeValue += fadeDir * 15 * Time.deltaTime;	
			fadeValue = Mathf.Clamp01(fadeValue);	
		
			//GUI.color = Color.white;
			//GUI.Label(new Rect(Screen.width/2 - 75, Screen.height/2 - 15, 150, 30), "Loading...");
			GUI.color = new Color(1,1,1,fadeValue);
			GUI.DrawTexture(new Rect(0,0, Screen.width, Screen.height), blackScreen);	
		}
	}
	
	void OnJoinedLobby(){
		print ("Joined master server");
	}
	
	void OnLeftRoom(){
		transform.GetChild(0).gameObject.camera.farClipPlane = 1;
		allRooms = PhotonNetwork.GetRoomList();
		connectingToRoom = false;
	}
	
	void OnPhotonJoinRoomFailed(){
		print ("Failed on connecting to room");
		connectingToRoom = false;
	}
	
	void OnPhotonCreateRoomFailed(){
		print ("Failed on creating room");
		connectingToRoom = false;
	}
	
	void OnPhotonPlayerConnected(){
		print ("Player connected");	
	}
	
	//We just connected to Photon Cloud
	void OnConnectedToPhoton(){
		if(PhotonNetwork.room != null){
			PhotonNetwork.LeaveRoom();
		}
		connectingToRoom = false;

	}
	
	void OnDisconnectedFromPhoton(){	

	}
}
