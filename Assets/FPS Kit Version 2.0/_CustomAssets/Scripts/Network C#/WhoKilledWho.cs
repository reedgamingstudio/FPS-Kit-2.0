//NSdesignGames @ 2012
//FPS Kit | Version 2.0 + Multiplayer

//This script is used to show on screen who kileld who
//Script should be attached to object with tag "Network"

using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class WhoKilledWho : Photon.MonoBehaviour {
	
	public GUISkin guiSkin;
	
	public struct WhoKillWho { 
		//Name of the player who killed other player
	    public string killer { get; set; } 
		//Name of the player who got killed
	    public string killed { get; set; }
		
	    public WhoKillWho(string string1, string string2){
	       	killer = string1; 
	        killed = string2;
    	} 

	} 
	public List<WhoKillWho> whoKillWho = new List<WhoKillWho>();
	
	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
	
	}
	
	void OnGUI(){
		GUI.skin = guiSkin;
        GUILayout.BeginArea(new Rect(Screen.width/2, 60, Screen.width/2, 400));
        //Show kill notificatin list
			foreach(WhoKillWho wkw in whoKillWho){
				GUILayout.BeginHorizontal();
					GUILayout.FlexibleSpace();
					//Green
					GUI.color = new Color(0, 1, 0, 0.65f);
					GUILayout.Label(wkw.killer);
					GUILayout.Space(5);
					//White
					GUI.color = new Color(1, 1, 1, 0.65f);
					GUILayout.Label("killed");
					GUILayout.Space(5);
					//Red
					GUI.color = new Color(1, 0, 0, 0.65f);
					GUILayout.Label(wkw.killed);
					GUILayout.Space(10);
				GUILayout.EndHorizontal();
			}
		GUILayout.EndArea();
	}
	
	//Receive message and update List
	void AddKillNotification(string killed){
		photonView.RPC("networkAddMessage", PhotonTargets.All, PhotonNetwork.playerName, killed);
	}
	
	[RPC]
	void networkAddMessage(string killer, string killed){
		whoKillWho.Add(new WhoKillWho(killer, killed));
		//Message count limit
        if (whoKillWho.Count > 5)
            whoKillWho.RemoveAt(0);
	}
	
    void OnLeftRoom(){
		whoKillWho.Clear();
        this.enabled = false;
    }

    void OnJoinedRoom(){
        this.enabled = true;
    }
    void OnCreatedRoom(){
        this.enabled = true;
    }
}
