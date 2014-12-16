using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class MultiplayerChat : Photon.MonoBehaviour{
	
    public static MultiplayerChat SP;
	
	public struct ChatData { 
	    public string name { get; set; } 
	    public string text { get; set; }
		
	    public ChatData(string string1, string string2){
	       	name = string1; 
	        text = string2;
    	} 

	} 
	public List<ChatData> messages = new List<ChatData>(); 

    private int chatHeight = (int)300;
    private Vector2 scrollPos = Vector2.zero;
	[HideInInspector]
   	public string chatInput = "";
	[HideInInspector]
	public bool isChatting;
	public GUIStyle chatStyle;

    void Awake(){
        SP = this;
    }
	
	void Update(){
		if(Input.GetKey(KeyCode.T) && !isChatting){
			this.StopAllCoroutines();
			StartCoroutine(ereaseChat());
		}
		
		if(messages.Count > 12){
			messages.RemoveAt(0);
		}
	}
	
	IEnumerator ereaseChat(){
		yield return new WaitForSeconds(0.07f);	
		isChatting = true;
	}

    void OnGUI(){ 
        GUILayout.BeginArea(new Rect(5, Screen.height - chatHeight-50, Screen.width, chatHeight+10));
        
	        //Show scroll list of chat messages
	        scrollPos = GUILayout.BeginScrollView(scrollPos);
				GUI.color = Color.white;
	
				GUILayout.FlexibleSpace();
				
		        for (int i = 0; i < messages.Count; i++){
					GUILayout.BeginHorizontal();
						GUI.color = Color.green;
		            	GUILayout.Label(messages[i].name, chatStyle);
						GUILayout.Space(5);
						GUI.color = Color.white;
						GUILayout.Label(messages[i].text, chatStyle);
					GUILayout.EndHorizontal();
		        }
	        GUILayout.EndScrollView();
		GUILayout.EndArea();
		
		GUILayout.BeginArea(new Rect(5, Screen.height - 35, Screen.width, 30));
	      	if (Event.current.type == EventType.keyDown && Event.current.character == '\n'){   
				isChatting = false;
	           	SendChat(PhotonTargets.All);
			}
			
	        //Chat input
			if(isChatting){
				GUI.FocusControl("ChatField");
		        GUILayout.BeginHorizontal(); 
			        GUI.SetNextControlName("ChatField");
					GUI.color = Color.red;
					GUILayout.Label("Say: ", chatStyle);
					GUILayout.Space(5);
					GUI.color = Color.white;
			    	chatInput = GUILayout.TextField(chatInput, chatStyle, GUILayout.MinWidth(200));
		        GUILayout.EndHorizontal();
			}else{
	            GUI.FocusControl("");
			}
		GUILayout.EndArea();
        
    }

    public static void AddMessage(string name, string text){
        SP.messages.Add(new ChatData(name, text));
		//Message count limit
        if (SP.messages.Count > 13)
            SP.messages.RemoveAt(0);
    }


    [RPC]
    void SendChatMessage(string text, PhotonMessageInfo info){
        AddMessage("  " + info.sender + ": ", text);
    }

    void SendChat(PhotonTargets target){
        if (chatInput != ""){
			string tempChat =" " +  chatInput;
            photonView.RPC("SendChatMessage", target, tempChat);
            chatInput = "";
        }
    }

    void SendChat(PhotonPlayer target){
        if (chatInput != ""){
            chatInput = "[PM] " + chatInput;
            photonView.RPC("SendChatMessage", target, chatInput);
            chatInput = "";
        }
    }

    void OnLeftRoom(){
		messages.Clear();
        this.enabled = false;
    }

    void OnJoinedRoom(){
        this.enabled = true;
    }
    void OnCreatedRoom(){
        this.enabled = true;
    }
}
