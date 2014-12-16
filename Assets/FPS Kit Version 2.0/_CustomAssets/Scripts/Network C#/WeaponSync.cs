//NSdesignGames @ 2012
//FPS Kit | Version 2.0 + Multiplayer

//This script is used to controll third person weapons over network
// It receives messages from WeaponScript and make effect that remote player is shooting for others

using UnityEngine;
using System.Collections;
using System.Collections.Generic;

[RequireComponent (typeof (AudioSource))]
[RequireComponent (typeof (PhotonView))]

public class WeaponSync : Photon.MonoBehaviour {
	//We have 4 possible types of weapons (MACHINE_GUN, GRENADE_LAUNCHER, SHOTGUN, KNIFE)
	//So we will have 4 functions to receive message from each of those types
	
	public Transform firePoint;
	//Assign this if we synchronize MACHINE_GUN or SHOTGUN or KNIFE
	public GameObject bullet;
	public Renderer muzzleFlash;
	//Assign this if we synchronize GRENADE_LAUNCHER
	public Rigidbody projectile;
	
	public AudioClip fireAudio;
	
	public Collider ignoreCollider;
	
	//MACHINE GUN type weapons sync
	void syncMachineGun(float errorAngle){
		photonView.RPC("machineGunShot", PhotonTargets.Others, errorAngle);	
	}
	
	[RPC]
	IEnumerator machineGunShot(float errorAngle){
		Quaternion oldRotation = firePoint.rotation;
		firePoint.rotation = Quaternion.Euler(Random.insideUnitSphere * errorAngle) * firePoint.rotation;
		Instantiate (bullet, firePoint.position, firePoint.rotation);
		firePoint.rotation = oldRotation;
		//Play fire sound 
		audio.clip = fireAudio;
		audio.Play();
		//Muzzle flash
		if(muzzleFlash){
			muzzleFlash.renderer.enabled = true;
			yield return new WaitForSeconds(0.04f);
			muzzleFlash.renderer.enabled = false;
		}
	}
	
	//SHOTGUN type weapons sync
	void syncShotGun(int fractions){
		photonView.RPC("shotGunShot", PhotonTargets.Others, fractions);	
	}
	
	[RPC]
	IEnumerator shotGunShot(int fractions){
		for (int i = 0;i < fractions; i++) {
			Quaternion oldRotation = firePoint.rotation;
			firePoint.rotation = Quaternion.Euler(Random.insideUnitSphere * 3) * firePoint.rotation;
			Instantiate (bullet, firePoint.position, firePoint.rotation);
			firePoint.rotation = oldRotation;
		}
		//Play fire sound 
		audio.clip = fireAudio;
		audio.Play();
		//Muzzle flash
		if(muzzleFlash){
			muzzleFlash.renderer.enabled = true;
			yield return new WaitForSeconds(0.04f);
			muzzleFlash.renderer.enabled = false;
		}
	}
	
	//GRENADE LAUNCHER type weapon sync
	void syncGrenadeLauncher(float initialSpeed){
		photonView.RPC("grenadeLauncherShot", PhotonTargets.Others, initialSpeed);	
	}
	
	[RPC]
	void grenadeLauncherShot(float initialSpeed){
		// create a new projectile, use the same position and rotation as the Launcher.
		Rigidbody instantiatedProjectile = Instantiate(projectile, firePoint.position, firePoint.rotation) as Rigidbody;
		// Give it an initial forward velocity. The direction is along the z-axis of the missile launcher's transform.
		//instantiatedProjectile.velocity = transform.TransformDirection(new Vector3 (initialSpeed, 0, 0));
		instantiatedProjectile.AddForce(instantiatedProjectile.transform.forward * initialSpeed*50);
		// Ignore collisions between the missile and the character controller
		foreach(Collider c in transform.root.GetComponentsInChildren<Collider>())
			Physics.IgnoreCollision(instantiatedProjectile.collider, c);
		
		audio.clip = fireAudio;
		audio.Play();
	}
	
	void syncKnife(){
		photonView.RPC("knifeOneHit", PhotonTargets.Others);	
	}
	
	[RPC]
	void knifeOneHit(){
		audio.clip = fireAudio;
		audio.Play();
	}
	
	void Awake(){
		if(muzzleFlash){
			muzzleFlash.renderer.enabled = false;	
		}
		audio.playOnAwake = false;
		ignoreCollider = transform.root.collider;
	}
	
	void Update(){
		if(photonView.isMine){
			gameObject.active = true;
			if(gameObject.renderer != null){
				gameObject.renderer.enabled = false;
			}else{
				Renderer[] renderers = GetComponentsInChildren<Renderer>();
				foreach(Renderer r in renderers){
					r.enabled = false;	
				}
			}
		}else{
			if(firePoint){
				firePoint.gameObject.active = true;
			}
		}
	}
}
