//NSdesignGames @ 2012
//FPS Kit | Version 2.0 + Multiplayer

//This script is used to controll player health

using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class PlayerDamage : Photon.MonoBehaviour {
	
	public GUISkin guiSKin;
	//Player health
	public float hp = 100;
	public GameObject ragdoll;
	public Texture2D bloodyScreen;
	public Texture2D hitMarkTexture;
	//Hitboxes and damage properties for each
	[System.Serializable]
	public class HitBoxes { 
	    public Collider box /*{ get; set; } */;
	    public float damage /*{ get; set; }*/;
		
	    public HitBoxes(Collider box1, float damage1){
			box = box1;
			damage = damage1;
    	} 

	} 
	public List<HitBoxes> hitBoxes = new List<HitBoxes>(); 
	
	[HideInInspector]
	public float currentHp;
	Quaternion camRot;
	Quaternion camDefaultRotation;
	//Fade hit mark
	float fadeValue;
	//Fade bloody screen
	float fadeValueB;
	
	void Awake(){
		camDefaultRotation = Camera.main.transform.localRotation;
		currentHp = hp;
		if(!photonView.isMine){
			for(int i = 0; i < hitBoxes.Count;i++){
				hitBoxes[i].box.gameObject.AddComponent<HitBox>();
				hitBoxes[i].box.gameObject.GetComponent<HitBox>().maxDamage = hitBoxes[i].damage;
				hitBoxes[i].box.gameObject.GetComponent<HitBox>().playerDamage = this;
				hitBoxes[i].box.isTrigger = true;
			}
		}else{
			for(int a = 0; a < hitBoxes.Count;a++){
				//We dont need our hit boxes, destroy them
				Destroy (hitBoxes[a].box.collider);
			}
			hitBoxes.Clear();
		}
	}
	
	public void totalDamage(float damage){
		fadeValue = 2;
	 	photonView.RPC("doDamage", PhotonTargets.All, damage);
		if(weKilled){
			//Send death notification message to script WhoKilledWho.cs
			GameObject.FindWithTag("Network").SendMessage("AddKillNotification", gameObject.name, SendMessageOptions.DontRequireReceiver);
		}
	}
	
	bool weKilled;
	
	[RPC]
	void doDamage(float damage){
		if(weKilled)
			return;
		if(currentHp > 0 && photonView.isMine){
			this.StopAllCoroutines();
		 	StartCoroutine(doCameraShake());
		}
		
		fadeValueB = 2;

		currentHp -= damage;
		
		//We got killed
		if(currentHp < 0){
			GameObject temp;
			temp = Instantiate(ragdoll, transform.position, transform.rotation) as GameObject;
			
			gameObject.SetActiveRecursively(false);
			gameObject.active = true;
			
			if(photonView.isMine){
				print ("We got killed");
				
				foreach(PhotonView p in transform.GetComponentsInChildren<PhotonView>()){
					PhotonNetwork.RemoveRPCs(p);
				}
				temp.SendMessage("RespawnAfter");

				StartCoroutine(photonDestroy());
			}else{
				temp.SendMessage("clearCamera");	
			}
			currentHp = 0;
			weKilled = true;
		}
	}
	
	IEnumerator photonDestroy(){
		yield return new WaitForSeconds(0.1f);	
		PhotonNetwork.Destroy(gameObject);
	}
	
	void OnGUI(){
		//Display HP for our player only
		if(photonView.isMine){
			GUI.skin = guiSKin;
			GUI.color = new Color(1,1,1,0.9f);
			GUI.depth = 10;
			GUI.color = new Color(1,1,1,fadeValueB);
			GUI.DrawTexture(new Rect(0, 0, Screen.width, Screen.height), bloodyScreen, ScaleMode.StretchToFill );
			GUI.color = new Color(1,1,1,0.9f);
			//Display player hp
			GUI.Box (new Rect (Screen.width - 220,Screen.height - 55,100,45), "HP | " + (int)currentHp);
		}else{
			GUI.color = new Color(1,1,1, fadeValue);
			GUI.DrawTexture(new Rect(Screen.width/2 - 13, Screen.height/2 - 13, 26, 26), hitMarkTexture, ScaleMode.StretchToFill );	
		}
	}
	
	IEnumerator doCameraShake(){
		//Change shake amount here (Currently its 10)
		camRot = Quaternion.Euler (Random.Range(-10, 10), Random.Range(-10, 10), 0);
		yield return new WaitForSeconds(0.1f);
		camRot = camDefaultRotation;
	}
	
	void Update(){
		fadeValue = Mathf.Lerp(fadeValue, 0, Time.deltaTime*2);	
		fadeValueB = Mathf.Lerp(fadeValueB, 0, Time.deltaTime*2);
		//Do camera shake effect
		if(Camera.main)
			Camera.main.transform.localRotation = Quaternion.Slerp(Camera.main.transform.localRotation, camRot, Time.deltaTime * 15); 
	}
}
