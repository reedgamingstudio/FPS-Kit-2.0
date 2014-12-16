// The reference to the explosion prefab
var explosion : GameObject;
var destroyDelay : float = 0;
var timeOut = 3.0;
var objectsToDestroy : GameObject[];


	var contact : ContactPoint;
	private var rotation : Quaternion;
// Kill the rocket after a while automatically
function Start () {
	if(destroyDelay > 0){
		Invoke("Kill", destroyDelay);
	}else{
		Invoke("Kill", timeOut);
	}
	
}

function FixedUpdate(){
	//Make projectile to look on direction of his trajectory
	transform.rotation = Quaternion.LookRotation(rigidbody.velocity);
}

function OnCollisionEnter (collision : Collision) {
	// Instantiate explosion at the impact point and rotate the explosion
	// so that the y-axis faces along the surface normal
	contact = collision.contacts[0];
	rotation = Quaternion.FromToRotation(Vector3.up, contact.normal);
   
   	if(destroyDelay > 0)
		return;
	// And kill our selves
	Kill ();    
}

function Kill (){
	Instantiate (explosion, transform.position, rotation);
	// Stop emitting particles in any children
	var emitter : ParticleEmitter= GetComponentInChildren(ParticleEmitter);
	if (emitter)
		emitter.emit = false;

	// Detach children - We do this to detach the trail rendererer which should be set up to auto destruct
	transform.DetachChildren();
		
	// Destroy the projectile
	Destroy(gameObject);
	//Destroy some other objects that assigned to array (if needed)
	if(objectsToDestroy.Length > 0){
		for(var i = 0; i < objectsToDestroy.Length; i++){
			Destroy(objectsToDestroy[i]);
		}
	}
}

@script RequireComponent (Rigidbody)