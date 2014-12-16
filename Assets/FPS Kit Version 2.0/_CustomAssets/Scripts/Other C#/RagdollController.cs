//NSdesignGames @ 2012
//FPS Kit | Version 2.0 + Multiplayer

using UnityEngine;
using System.Collections;

public class RagdollController : MonoBehaviour {
	
	public GUISkin guiSKin;
	public GameObject cam;
	//make rigidbody kinematic after
	//also it is used as Wait For respawn time
	public int timer;
	//Display timer gui or not
	bool gui;
	
	// Use this for initialization
	void Start () {
		StartCoroutine(sleepRigidbody());
	}
	
	void OnGUI(){
		if(gui && cam){
			GUI.skin = guiSKin;
			GUI.Label(new Rect(Screen.width/2-75, Screen.height/2-15, 150, 30), "Respawn in: " + timer);
		}
	}
	
	//Respawn in 3 seconds
	void RespawnAfter(){
		gui = true;
		InvokeRepeating("_respawnAfter", 1, 1);
	}
	
	void _respawnAfter () {
		timer --;
		if(timer == 0){
			clearCamera();
			GameObject.FindWithTag("Network").SendMessage("SpawnPlayer");
			Destroy (this);
		}
	}
	
	void clearCamera(){
		Destroy(cam);
	}
	
	IEnumerator sleepRigidbody(){
		//Make ragdoll kinematic
		yield return new WaitForSeconds(timer);
		foreach(Rigidbody c in transform.root.GetComponentsInChildren<Rigidbody>()){
			c.isKinematic = true;
		}
	}
}
