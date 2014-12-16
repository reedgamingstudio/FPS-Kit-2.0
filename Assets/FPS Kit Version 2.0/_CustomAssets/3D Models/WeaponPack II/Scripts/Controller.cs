using UnityEngine;
using System.Collections;

public class Controller : MonoBehaviour {
	
	public enum Type {M79, M67, RPG, Bomb}
	public Type type;
	public Transform missile;
	public Transform FirePoint;
	public float switchTime;
	public float animSpeed = 1;
	public float fireRate = 0.1f;
	float nextFire = 0;
	
	// Use this for initialization
	void Awake () {
		if(type != Type.M67 && type != Type.Bomb){
			animation["Fire"].wrapMode = WrapMode.Once;
			animation["Reload"].wrapMode = WrapMode.Once;
			animation["Idle"].wrapMode = WrapMode.Once;
		}else{
			if(type == Type.M67){
				animation["Throw"].wrapMode = WrapMode.Once;
				animation["Idle"].wrapMode = WrapMode.Once;
			}
		}
		
		animation["TakeIn"].wrapMode = WrapMode.Once;
		animation["TakeOut"].wrapMode = WrapMode.Once;

		//animation.Play("Idle");
	}
	
	// Update is called once per frame
	void Update () {
		if(Input.GetKeyDown(KeyCode.R)){
			if(type != Type.M67 && type != Type.Bomb){
				RifleReload();
			}else{
				if(type == Type.M67	){
					animation.Play ("Idle");
				}
			}
		}
		
		if(Input.GetMouseButtonDown(0)&&Time.time > nextFire && type != Type.Bomb){
			nextFire = Time.time + fireRate;
			if(type != Type.M67 && type != Type.Bomb){
				animation.Rewind("Fire");
				animation.CrossFade("Fire");
				animation["Fire"].speed = animSpeed;
				if(type == Type.RPG){
					Instantiate(missile, FirePoint.position, Quaternion.identity);
				}
				if(type == Type.M79){
					Rigidbody temp;
					temp = Instantiate(missile.rigidbody, FirePoint.position, Quaternion.identity) as Rigidbody;
					temp.velocity = FirePoint.TransformDirection(Vector3.forward*60);
				}
			}else{
				animation.Rewind("Throw");
				animation.CrossFade("Throw");
				animation["Throw"].speed = animSpeed;
				StartCoroutine(delayThrow(animSpeed/2));
			}
		}
		if( type == Type.Bomb){
			if(Input.GetMouseButton(0)){
				animation.CrossFadeQueued("Coding");	
			}
		}
	}
	
	IEnumerator delayThrow(float timer){
		yield return new WaitForSeconds(timer);
		Rigidbody temp;
		temp = Instantiate(missile.rigidbody, FirePoint.position, Quaternion.identity) as Rigidbody;
		temp.velocity = FirePoint.TransformDirection(Vector3.forward*60);
	}
	
	void RifleReload(){
		AnimationState newReload = animation.CrossFadeQueued("Reload");
		newReload.speed = animSpeed;
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
