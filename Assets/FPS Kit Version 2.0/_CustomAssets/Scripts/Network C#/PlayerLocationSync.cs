//NSdesignGames @ 2012
//FPS Kit | Version 2.0 + Multiplayer

//Implementation of Photon Networking system
//Remote and local player setup
//Player position sync over Network

using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class PlayerLocationSync : Photon.MonoBehaviour {
	
	//Temporary variable
	[HideInInspector]
	public string playerName;
	//This is target fro HeadLookControllerc.cs
	public Transform lookTarget;
	public List<GameObject> remoteObjectsToDeactivate;
	public List<MonoBehaviour> remoteScriptsToDeactivate;
	public List<GameObject> localObjectsToDeactivate;

	public List<MonoBehaviour> localScriptsToDeactivate;
	
	CharacterController cc;
	
	// Use this for initialization
	void Start () {
		cc = GetComponent<CharacterController>();
		if(!photonView.isMine){
			for(int i = 0; i<remoteObjectsToDeactivate.Count;i++){
				remoteObjectsToDeactivate[i].SetActiveRecursively(false);	
			}
			for(int a = 0; a<remoteScriptsToDeactivate.Count;a++){
				//remoteScriptsToDeactivate[a].enabled = false;
				Destroy(remoteScriptsToDeactivate[a]);
			}
			//gameObject.layer = 0;
			gameObject.tag = "Remote";
			if(lookTarget.gameObject.active == false){
				lookTarget.gameObject.active = true;	
			}
		}else{
			for(int b = 0; b<localObjectsToDeactivate.Count;b++){
				localObjectsToDeactivate[b].SetActiveRecursively(false);	
			}
			for(int c = 0; c<localScriptsToDeactivate.Count;c++){
				//localScriptsToDeactivate[c].enabled = false;
				Destroy(localScriptsToDeactivate[c]);
			}
		}
	}
	
	//Smooth player movement
 	void OnPhotonSerializeView(PhotonStream stream, PhotonMessageInfo info){
        if (stream.isWriting){
            //We own this player: send the others our data
           // stream.SendNext((int)controllerScript._characterState);
            stream.SendNext(transform.position);
            stream.SendNext(transform.rotation);
			if(cc){
				stream.SendNext(cc.center);
				stream.SendNext(cc.height);
			}
			stream.SendNext(gameObject.name);
			stream.SendNext(lookTarget.position);
			stream.SendNext(lookTarget.rotation);
        }else{
            //Network player, receive data
            //controllerScript._characterState = (CharacterState)(int)stream.ReceiveNext();
            correctPlayerPos = (Vector3)stream.ReceiveNext();
            correctPlayerRot = (Quaternion)stream.ReceiveNext();
         	capsulePos = (Vector3)stream.ReceiveNext();
            capsuleScale = (float)stream.ReceiveNext();
			PlayerName = (string)stream.ReceiveNext();
			lookTargetPos = (Vector3)stream.ReceiveNext();
		 	lookTargetRot = (Quaternion)stream.ReceiveNext();
        }
    }

    private Vector3 correctPlayerPos = new Vector3(0, -100, 0); //We lerp towards this
    private Quaternion correctPlayerRot = Quaternion.identity; //We lerp towards this
  	private Vector3 capsulePos = Vector3.zero; //We lerp towards this
    private float capsuleScale = 0; //We lerp towards this
	private string PlayerName = "";
	private Vector3 lookTargetPos = Vector3.zero;
	private Quaternion lookTargetRot = Quaternion.identity;

    void Update(){
        if (!photonView.isMine){
            //Update remote player (smooth this, this looks good, at the cost of some accuracy)
            transform.position = Vector3.Lerp(transform.position, correctPlayerPos, Time.deltaTime * 8);
            transform.rotation = Quaternion.Lerp(transform.rotation, correctPlayerRot, Time.deltaTime * 8);
			lookTarget.position = Vector3.Lerp(lookTarget.position, lookTargetPos, Time.deltaTime * 8);
			lookTarget.rotation = lookTargetRot;
			
			if(cc.height != capsulePos.y && cc.height != capsuleScale){
	         	cc.center = capsulePos;
	            cc.height = capsuleScale;
			}
			if(gameObject.name != PlayerName){
				gameObject.name = PlayerName;
			}
        }
    }
	
	public void ReDeactivatePlayerObjects(){
		if(photonView.isMine){
			for(int b = 0; b<localObjectsToDeactivate.Count;b++){
				localObjectsToDeactivate[b].SetActiveRecursively(false);	
			}
			for(int c = 0; c<localScriptsToDeactivate.Count;c++){
				//localScriptsToDeactivate[c].enabled = false;
				Destroy(localScriptsToDeactivate[c]);
			}
		}
	}
}
