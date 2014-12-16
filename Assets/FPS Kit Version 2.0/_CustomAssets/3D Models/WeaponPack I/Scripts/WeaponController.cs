using UnityEngine;
using System.Collections;

public class WeaponController : MonoBehaviour {
	
	public enum Type {Sniper, Rifle, Automatic, Knife}
	public Type type;
	
	public float animSpeed = 1;
	public float fireRate = 0.1f;
	float nextFire = 0;
	
	// Use this for initialization
	void Awake () {
		if(type == Type.Sniper){
			animation["Reload_1_3"].wrapMode = WrapMode.Once;
			animation["Reload_2_3"].wrapMode = WrapMode.Once;
			animation["Reload_3_3"].wrapMode = WrapMode.Once;
		}
		if(type == Type.Rifle){
			animation["Reload"].wrapMode = WrapMode.Once;	
		}
		animation["Fire"].wrapMode = WrapMode.Once;
		animation["Idle"].wrapMode = WrapMode.Once;
		animation["TakeIn"].wrapMode = WrapMode.Once;
		animation["TakeOut"].wrapMode = WrapMode.Once;
		//animation.Play("Idle");
	}
	
	// Update is called once per frame
	void Update () {
		if(Input.GetKeyDown(KeyCode.R)){
			if(type == Type.Sniper){
				SniperReload();
			}
			if(type == Type.Rifle || type == Type.Automatic){
				RifleReload();
			}
		}
		
		if(type != Type.Automatic){
			if(Input.GetMouseButtonDown(0)&&Time.time > nextFire){
				nextFire = Time.time + fireRate;
				animation.Rewind("Fire");
				AnimationState fire = animation.CrossFadeQueued("Fire");
				fire.speed = animSpeed;
			}
		}else{
			if(Input.GetMouseButton(0)&&Time.time > nextFire){
				nextFire = Time.time + fireRate;
				animation.Rewind("Fire");
				animation.CrossFade("Fire");
				animation["Fire"].speed = animSpeed;
			}
		}
	}
	
	void RifleReload(){
		AnimationState newReload = animation.CrossFadeQueued("Reload");
		newReload.speed = animSpeed;
	}
	
	void SniperReload(){
		AnimationState newReload1 = animation.CrossFadeQueued("Reload_1_3");
		newReload1.speed = animSpeed;
		//4 is number of bullets to reload
		for(int i = 0; i < 4; i++){
	 		AnimationState newReload2 = animation.CrossFadeQueued("Reload_2_3");
			newReload2.speed = animSpeed;
		}
		AnimationState newReload3 = animation.CrossFadeQueued("Reload_3_3");
		newReload3.speed = animSpeed;
	}
	
	void TakeIn(){
		animation.Play("TakeIn");
		animation["TakeIn"].speed = animSpeed;
	}
	
	void TakeOut(){
		animation.CrossFade("TakeOut");
		animation["TakeOut"].speed = animSpeed;
	}
}
