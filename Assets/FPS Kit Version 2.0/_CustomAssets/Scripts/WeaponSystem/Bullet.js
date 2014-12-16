#pragma strict
import System.Collections.Generic;

var speed : int = 500;
var life : float = 3;
var damage : int = 20;
var impactForce : int = 10;
var impactHoles : boolean = true;
//Does bullet do any damage to target?
var doDamage : boolean = false;
//Impact prefab name corresponds a tag it should hit
var impactObjects : List.<GameObject>;


private var velocity : Vector3;
private var newPos : Vector3;
private var oldPos : Vector3;
private var hasHit : boolean = false;

function Start () {
	newPos = transform.position;
	oldPos = newPos;
	velocity = speed * transform.forward;

	// schedule for destruction if bullet never hits anything
	Destroy( gameObject, life );
}

function Update () {
	if( hasHit )
		return;
	// assume we move all the way
	newPos += velocity * Time.deltaTime;
	// Check if we hit anything on the way
	var direction : Vector3 = newPos - oldPos;
	var distance : float = direction.magnitude;

	if (distance > 0) {
		var hit : RaycastHit;

		if (Physics.Raycast(oldPos, direction, hit, distance)) {
			// adjust new position
			newPos = hit.point;
			// notify hit
			hasHit = true;
			var rotation : Quaternion = Quaternion.FromToRotation(Vector3.up, hit.normal);
			
			//Apply force if we hit rigidbody
			if (hit.rigidbody){
				hit.rigidbody.AddForce( transform.forward * impactForce, ForceMode.Impulse );
			}
		
//////////////////////////////////////////////////////////////////HIT SURFACES/////////////////////////////////////////////////////////////
			if(impactHoles){
				//var impact : GameObject;
				for(var i : int = 0; i<impactObjects.Count; i++){
					if(hit.transform.tag == impactObjects[i].name){
						Instantiate(impactObjects[i], hit.point, rotation);
					}
				}
			}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
			//We cant hit ourselfs
			if(hit.transform.tag != "Player" && doDamage){
				hit.transform.SendMessageUpwards("ApplyDamage", damage, SendMessageOptions.DontRequireReceiver);
			}
		
			Destroy (gameObject, 1);
		}
	}

	oldPos = transform.position;
	transform.position = newPos;
}

@script AddComponentMenu ("FPS system/Weapon System/Bullet Controller")