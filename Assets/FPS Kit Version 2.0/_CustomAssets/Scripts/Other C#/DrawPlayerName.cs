//NSdesignGames @ 2012
//FPS Kit | Version 2.0 + Multiplayer

//This script is used for multiplayer, for displaying other players name
//It should be enable for every player but not for our

using UnityEngine;
using System.Collections;
using System;

public class DrawPlayerName : MonoBehaviour {
	
	public GUISkin guiSKin;
	public Transform positionDisplay;
	//Use this ti display player current hp
	public Texture2D hpLine;
	string playerName;
	
	
	//Find player damage which attached to the same game object as this script
	//We need to this to display player hp line under name
	PlayerDamage pd;
	
	
	void Awake(){
		pd = gameObject.GetComponent<PlayerDamage>();
		if(!positionDisplay){
			positionDisplay = transform;
		}
	}
	
	void Update(){
		playerName = gameObject.name;
	}

	void OnGUI(){
		GUI.skin = guiSKin;
		GUI.depth = 2;
		float offset = new float();
		
		GUI.color = new Color(0.1f,0.9f,0.5f,1);
		if(Camera.main){
			Vector3 screenPos = Camera.main.WorldToScreenPoint(positionDisplay.position);
			if((float)(screenPos.z*3) < 50){
				offset = screenPos.z*3;	
			}else{
				offset = 50;	
			}
			
			if(screenPos.z >0){
				//Display player name
				GUI.Label(new Rect(screenPos.x-100, Screen.height-screenPos.y-5-offset, 200, 30), playerName);
				//Display player health (hp)
				if(pd.currentHp > 60){
					GUI.color = Color.green;
				}else{
					if(pd.currentHp > 30){
						GUI.color = Color.yellow;
					}else{
						GUI.color = Color.red;	
					}
				}
				//Background box 
				GUI.Box(new Rect(screenPos.x-pd.hp/2, Screen.height-screenPos.y+25-offset, pd.hp, 5), "");
				//Player hp
				GUI.DrawTexture(new Rect(screenPos.x-pd.hp/2, Screen.height-screenPos.y+25-offset, pd.currentHp, 5), hpLine, ScaleMode.StretchToFill);
			}
		}
	}
}
