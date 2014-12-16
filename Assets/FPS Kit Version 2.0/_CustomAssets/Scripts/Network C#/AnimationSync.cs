//NSdesignGames @ 2012
//FPS Kit | Version 2.0 + Multiplayer

//This script is used to synchronize character animation over Network

using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class AnimationSync : Photon.MonoBehaviour {
	
	//GameObject which contain all third person weapons
	public Transform thirdPersonWeapons;
	//Assign following Armature bones for separated animation blending
	public Transform shoulderR;
	public Transform shoulderL;
	//Use this object to receive animations that were sent from CharacterAnimation.js
	public GameObject animationSyncHelper;
	public GameObject animationForHands;
	//This gameObject.name tell which third person weapon is active now
	public GameObject activeWeapon;
	
	public HeadLookController headLookController;
	
	//We store animation names that were give MixedTransform
	//So we add Mixed Transform only once for each needed animation
	List<string> mixedAnimations = new List<string>();
	
	
	string MovementAnimation;
	//Copy received blended animation
	string currentBlendedAnimation; 
	string currentWeaponName; 
		
    private string currentAnimation = ""; 
	private string blendedAnimation = ""; 
	private string prevWeap = "";
	
	// Use this for initialization
	void Start () {
	 	if (photonView.isMine){
			Destroy(headLookController);
		}
	}
	
	//Synchronize player animation
 	void OnPhotonSerializeView(PhotonStream stream, PhotonMessageInfo info){
        if (stream.isWriting){
            //We own this player: send the others our data
            stream.SendNext(animationSyncHelper.name);
			stream.SendNext(animationForHands.name);
			stream.SendNext(activeWeapon.name);
        }else{
            //Network player, receive data
            currentAnimation = (string)stream.ReceiveNext();
			blendedAnimation = (string)stream.ReceiveNext();
			currentWeaponName = (string)stream.ReceiveNext();
        }
    }

    void Update(){
        if (!photonView.isMine){
			//Base movement animations
			if(MovementAnimation != currentAnimation){
				//animation.Stop();
				MovementAnimation = currentAnimation;
			}
			if(animation[MovementAnimation] != null){
				animation[MovementAnimation].layer = 1;
				animation[MovementAnimation].wrapMode = WrapMode.Loop;
				animation.CrossFade(MovementAnimation);
			}
			
			//Blended weapon animations (Pistol Idle, Knife Idle etc.)
			//If blended animation == "Null" mean that we dont need mixing animation at the moment, so disable them
			if(currentBlendedAnimation != blendedAnimation){
				currentBlendedAnimation = blendedAnimation;
				if(!mixedAnimations.Contains(currentBlendedAnimation) && currentBlendedAnimation != "Null" && animation[currentBlendedAnimation] != null){
			   		animation[currentBlendedAnimation].layer = 4;
					animation[currentBlendedAnimation].wrapMode = WrapMode.Loop;
					animation[currentBlendedAnimation].AddMixingTransform(shoulderR);
					animation[currentBlendedAnimation].AddMixingTransform(shoulderL);	
					mixedAnimations.Add (currentBlendedAnimation);
				}
			}
			if(currentBlendedAnimation != "Null" && animation[currentBlendedAnimation] != null){
				animation.Play(currentBlendedAnimation); 
			}
			
			//Change third person weapon 
			if(prevWeap != currentWeaponName){
				for(int i = 0; i < thirdPersonWeapons.childCount; i++){
					if(thirdPersonWeapons.GetChild(i).name != currentWeaponName){
						thirdPersonWeapons.GetChild(i).gameObject.SetActiveRecursively(false);
					}else{
						thirdPersonWeapons.GetChild(i).gameObject.SetActiveRecursively(true);
					}
				}
				prevWeap = currentWeaponName;
			}
        }
    }
}
