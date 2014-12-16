//NSdesignGames @ 2012
//FPS Kit | Version 2.0

#pragma strict
#pragma implicit
#pragma downcast

@System.Serializable

public class WeaponScript extends MonoBehaviour {
	//Booleans
	@HideInInspector
	var aimed : boolean;
	@HideInInspector
	var fire : boolean;
	@HideInInspector
	var canAim : boolean;
	@HideInInspector
	var isReload : boolean;
	@HideInInspector
	var noBullets : boolean;
	@HideInInspector
	var Recoil : boolean;
	@HideInInspector
	var canFire : boolean;
	@HideInInspector
	var singleFire : boolean;
	
	private var motor : FPScontroller;
	private var player : GameObject;
	private var controller : CharacterController;
	private var mouseLook : FPSMouseLook;
	
	//make walk sway amount smaller when player is aim 
	//or aim mode walk sway control
	private var walkSway : WalkSway;
	private var defaultBobbingAmount : float;
	private var managerObject : GameObject;
	
	enum gunType {MACHINE_GUN, GRENADE_LAUNCHER, SHOTGUN, KNIFE}
	var GunType : gunType;
	var FlashLight : boolean;
	
	//Use classes to make a group of variables
	
	var weaponName : String = "";
	
	//Aim variables
	class AimVariables {
		var aimPosition : Vector3 = Vector3.zero;
		var smoothTime : float = 5;
		var toFov : float = 45;
		var aimBobbingAmount : float;
		var playAnimation : boolean;
	}
	var Aim : AimVariables;
	private var defaultFov : float;
	private var defaultPosition : Vector3;
	private var currentFov : float;
	private var currentPosition : Vector3;
	
	var firePoint : Transform;
	
	//Shotgun variables
	class shotGun{
		var bullet : Transform;
		var fractions : int = 5;
		var errorAngle : float = 3;
		var fireRate : float = 1;
		var reloadTime : float = 2;
		var fireSound : AudioClip;
		var reloadSound : AudioClip;
		var bulletsPerClip : int = 40;
		var bulletsLeft : int;
		var clips : int = 15;
		var smoke : ParticleEmitter;
	}
	var ShotGun : shotGun;
	
	//Grenade launcher variables
	class GrenadeLauncher{
		var projectile : Rigidbody;
		var fireSound : AudioClip;
		var reloadSound : AudioClip;
		var initialSpeed = 20.0;
		//Delay shot (ex. greande throw)
		var shotDelay : float = 0;
		var waitBeforeReload = 0.5;
		var reloadTime = 0.5;
		var ammoCount = 20;
	}
	var grenadeLauncher : GrenadeLauncher;
	
	private var lastShot = -10.0;
	
	//Machine gun variables
	class MachineGun{
		var bullet : Transform;
		var muzzleFlash : GameObject;
		var fireSound : AudioClip;
		var reloadSound : AudioClip;
		var pointLight : Light;
		var fireRate = 0.05;
		var bulletsPerClip : int = 40;
		var clips : int = 15;
		var bulletsLeft : int;
		var reloadTime = 1.0;
		var NoAimErrorAngle = 3.0;
		var AimErrorAngle = 0.0;
	}
	var machineGun : MachineGun;
	@HideInInspector
	var errorAngle : float;
	private var nextFireTime = 0.0;
	
	//Knife variables
	class Knife{
		var bullet : Transform;
		var fireSound : AudioClip;
		var fireRate : float = 0.5;
		var delayTime : float = 0;
	}
	var knife : Knife;
	
	//Rotation realisn variables
	class RotationReal{
		var RotationAmplitude : float = 2;
		var smooth : float = 7;
	}
	var RotRealism : RotationReal;
	private var currentAnglex : float;
	private var currentAngley : float;
	
	//Smooth move variables
	class SmoothMov {
		var maxAmount = 0.5;
		var Smooth = 3.0;
	}
	var SmoothMovement : SmoothMov;
	private var DefaultPos : Vector3;
	
	//Camera Recoil effect NOTE : Be sure that is your player camera is tagged as "MainCamera"
	class cameraRecoil{
		var recoilPower : float = 0.5;
		var shakeAmount : float = 6;
		var smooth : float = 3;
	}
	var CameraRecoil : cameraRecoil;
	private var camDefaultRotation : Quaternion;
	private var camPos : Quaternion;
	
	//Awake function is always called before Start function
	function Awake(){
		//Find nesessary objects and scripts (Player, CharacterMotor script, and weapon projectile spawn points etc.)
		player = GameObject.FindWithTag("Player");
		motor = player.GetComponent(FPScontroller);
		controller = player.GetComponent(CharacterController);
		mouseLook = gameObject.FindWithTag("LookObject").GetComponent("FPSMouseLook");
	}
	
	function Start (){
		//Aim mode walk sway control
		managerObject = gameObject.FindWithTag("WeaponManager");
		walkSway = managerObject.GetComponent("WalkSway");
		defaultBobbingAmount = walkSway.bobbingAmount;
		
		//Camera recoil
		camDefaultRotation = camera.main.transform.localRotation;
		
		//Aim setup
		defaultFov = camera.main.fieldOfView;
		defaultPosition = transform.localPosition;
		
		//Call machineGun awake
		if(GunType == gunType.MACHINE_GUN){
			machineGunAwake();
		}
		//Call grenadelauncher awake
		if(GunType == gunType.GRENADE_LAUNCHER){
			grenadeLauncherAwake();
		}
		
		//Call shotgun Awake
		if(GunType == gunType.SHOTGUN){
			shotGunAwake();
		}
		
		//Call knife awake
		if(GunType == gunType.KNIFE){
			knifeAwake();
		}
	}
	
	function Update (){
		if(Time.timeScale < 0.01)
			return;
		Aiming();
		RotationRealism();
		SmoothMove();
		//PickUpUpdate();
		//input();
		if(Recoil){
			cameraRecoilDo();
		}
		//Call machine gun fixed update function
		if(GunType == gunType.MACHINE_GUN){
			machineGunFixedUpdate();
		}
		//Call grenade launcher fixed update function
		if(GunType == gunType.GRENADE_LAUNCHER){
			grenadeLauncherFixedUpdate();
		}
		
		//Call shotgun fixed update function
		if(GunType == gunType.SHOTGUN){
			shotGunFixedUpdate ();
		}
		if(motor.Running){
			aimed = false;
		}
	}
	
	//////////////////////////////////////////////////INPUT//////////////////////////////////////////////////////////////////////
	function LateUpdate(){
		if(Time.timeScale < 0.01)
			return;
		//1.Aim input 
		if(Input.GetButtonDown("Fire2") && canAim && !motor.Running){
			aimed = !aimed;
		}
		//2.Fire input 
		//Automatic fire input
		if(Input.GetButton("Fire1") && canFire && !singleFire){
			fire = true;
		}else{
			fire = false;
		}
		//Single fire iputs
		if(GunType == gunType.MACHINE_GUN){
			//Single fire input for machine gun mode
			if(Input.GetButtonDown("Fire1") && canFire && !isReload && singleFire){
				machineGunFire();
			}else{
				machineGunStopFire ();
			}
		}
		
		if(GunType == gunType.GRENADE_LAUNCHER){
			//Single fire input for grenade launcher mode
			if(Input.GetButtonDown("Fire1") && canFire && !isReload && singleFire){
				grenadeLauncherFIre();
			}
		}
		
		if(GunType == gunType.SHOTGUN){
			//Single fire input for shotgun mode
			if(Input.GetButtonDown("Fire1") && canFire && !isReload && singleFire){
				shotGunFire ();
			}	
		}
		
		if(GunType == gunType.KNIFE){
			if(Input.GetButtonDown("Fire1") && canFire && !isReload && singleFire){
				knifeOneShot();
			}
		}
		
		//3.Reload input
		if(Input.GetKeyDown("r") && !isReload && machineGun.clips > 0){
			if(GunType == gunType.MACHINE_GUN && machineGun.bulletsLeft != machineGun.bulletsPerClip){
				machineGunReload();
			}
			if(GunType == gunType.SHOTGUN && ShotGun.bulletsLeft != ShotGun.bulletsPerClip){
				shotGunReload();
			}
		}
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	function firePointSetup(){
		//Make fire point be directly to center of screen, to avoid out of crosshair fire bug
		var tempPos : Vector3 = Camera.main.ScreenToWorldPoint( Vector3(Screen.width/2, Screen.height/2, Camera.main.nearClipPlane));
  	 	firePoint.position = tempPos;
	}
	
	///////////////////////////////////////////////MACHINE GUN FUNCTIONS///////////////////////////////////////////////////////
	function machineGunAwake(){
		machineGun.bulletsLeft = machineGun.bulletsPerClip;
		//Deactivate muzzleFlash if we didnt
		if(machineGun.muzzleFlash){
			machineGun.muzzleFlash.active = false;
		}
		canAim = true;
		canFire = true;
	}
	
	function machineGunFixedUpdate (){
		//Machine gun fire
		if(fire && !isReload){
			machineGunFire();
		}else{
			machineGunStopFire();
			if(machineGun.muzzleFlash){
				machineGun.muzzleFlash.active = false;
			}
		}
	
		if(isReload){
			//motor.canRun = false;
			canAim = false;
		}
	}
	
	function machineGunFire (){
		if (machineGun.bulletsLeft == 0)
			return;
	
		// If there is more than one bullet between the last and this frame
		// Reset the nextFireTime
		if (Time.time - machineGun.fireRate > nextFireTime){
			nextFireTime = Time.time - Time.deltaTime;
		}
		// Keep firing until we used up the fire time
		while( nextFireTime < Time.time && machineGun.bulletsLeft != 0)
		{
			machineGunOneShot();
			nextFireTime += machineGun.fireRate;
		}
		//motor.canRun = false;
	
	}
	
	function machineGunStopFire (){
		motor.canRun = true;
	}
	
	function machineGunOneShot () {
			if(!aimed){
				//Before fire, move aim point to right position
				firePointSetup();
			}
			var oldRotation = firePoint.rotation;
			firePoint.rotation =  Quaternion.Euler(Random.insideUnitSphere * errorAngle) * transform.rotation;
			var instantiatedProjectile;
			if(!aimed){
				instantiatedProjectile = Instantiate (machineGun.bullet, firePoint.position, firePoint.rotation);
			}else{
				var pos : Vector3 = Camera.main.ScreenToWorldPoint( Vector3(Screen.width/2, Screen.height/2, Camera.main.nearClipPlane));
				instantiatedProjectile = Instantiate (machineGun.bullet, pos, firePoint.rotation);
			}
			firePoint.rotation = oldRotation;
			lastShot = Time.time;
			machineGun.bulletsLeft--;
			//Play fire sound attached to a Weapon object
			audio.clip = machineGun.fireSound;
			audio.Play();
			//Do a light effect when shoot
			machineGunMuzzleFlash();
			//Send message to weapon animation script
			if(aimed && Aim.playAnimation){
				BroadcastMessage ("Fire", SendMessageOptions.DontRequireReceiver);
			}
			if(!aimed){
				BroadcastMessage ("Fire", SendMessageOptions.DontRequireReceiver);
			}
			if(Recoil){
				mouseLook.Recoil(CameraRecoil.recoilPower);
				machineGunCameraRecoil();
			}
	
		// Reload gun in reload Time
		if(machineGun.clips > 0)			
		if (machineGun.bulletsLeft == 0){
			noBullets = true;
			yield WaitForSeconds(1);
			if(!isReload){
				machineGunReload();
			}
		}
	}
	
	function machineGunMuzzleFlash(){
		
		if(machineGun.muzzleFlash){
			machineGun.muzzleFlash.transform.localRotation = Quaternion.AngleAxis(Random.Range(0, 359), Vector3.left);
			machineGun.muzzleFlash.active = true;
		}
		if(machineGun.pointLight){
			machineGun.pointLight.enabled = true;
		}
		yield WaitForSeconds(0.04);
		if(machineGun.muzzleFlash){
			machineGun.muzzleFlash.active = false;
		}
		if(machineGun.pointLight){
			machineGun.pointLight.enabled = false;
		}
	}
	
	function machineGunReload () {
		isReload = true;
		aimed = false;
		canAim = false;
		BroadcastMessage ("Reloading", machineGun.reloadTime, SendMessageOptions.DontRequireReceiver);
		//Play reload sound
		audio.clip = machineGun.reloadSound;
		audio.Play();
		// Wait for reload time first - then add more bullets!
		yield WaitForSeconds(machineGun.reloadTime);
	
		// We have a clip left reload
		if (machineGun.clips > 0)
		{
		var difference = machineGun.bulletsPerClip-machineGun.bulletsLeft;
			if(machineGun.clips > difference ){
				machineGun.clips = machineGun.clips - difference;
				machineGun.bulletsLeft = machineGun.bulletsLeft + difference;
			}else{
				machineGun.bulletsLeft = machineGun.bulletsLeft + machineGun.clips;
				machineGun.clips = 0;
			}
			noBullets = false;
			isReload = false;
			canAim = true;
			motor.canRun = true;
		}
	}
	
	function machineGunCameraRecoil(){
		camPos = Quaternion.Euler (Random.Range(0, -CameraRecoil.shakeAmount), Random.Range(-CameraRecoil.shakeAmount, CameraRecoil.shakeAmount), 0);
		yield WaitForSeconds(0.05);
		camPos = camDefaultRotation;
	}
	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	/////////////////////////////////////////////////////////GRENADE LAUNCHER FUNCTIONS////////////////////////////////////////////
	function grenadeLauncherAwake(){
		canAim = true;
		canFire = true;
	}
	
	function grenadeLauncherFixedUpdate (){
		//GrenadeLauncher fire
		if(fire && !isReload){
			grenadeLauncherFIre();
			//motor.canRun = false;
		}else{
			motor.canRun = true;
		}
	}
	
	function grenadeLauncherFIre (){
		// Did the time exceed the reload time?
		if (grenadeLauncher.ammoCount == 0 || !canFire)
			return;
	
		// If there is more than one bullet between the last and this frame
		// Reset the nextFireTime
		if (Time.time - grenadeLauncher.reloadTime > nextFireTime){
			nextFireTime = Time.time - Time.deltaTime;
		}
		// Keep firing until we used up the fire time
		while( nextFireTime < Time.time && grenadeLauncher.ammoCount > 0)
		{
			grenadeLauncherOneShot();
			nextFireTime += grenadeLauncher.reloadTime;
		}
		//motor.canRun = false;
	
	}
	
	function grenadeLauncherOneShot (){
		if(grenadeLauncher.shotDelay > 0){
			//Send message to weapon animation script
			if(aimed && Aim.playAnimation){
				BroadcastMessage ("Fire", SendMessageOptions.DontRequireReceiver);
			}
			if(!aimed){
				BroadcastMessage ("Fire", SendMessageOptions.DontRequireReceiver);
			}
			if(Recoil){
				mouseLook.Recoil(CameraRecoil.recoilPower);
				grenadeLauncherCameraRecoil();
			}
			grenadeLauncherReload();
			yield WaitForSeconds(grenadeLauncher.shotDelay);
		}
		// create a new projectile, use the same position and rotation as the Launcher.
		var instantiatedProjectile  = Instantiate(grenadeLauncher.projectile, firePoint.position, firePoint.rotation); 
		// Give it an initial forward velocity. The direction is along the z-axis of the missile launcher's transform.
		instantiatedProjectile.velocity = transform.TransformDirection(Vector3 (0, 0, grenadeLauncher.initialSpeed));
		
		// Ignore collisions between the missile and the character controller
		var c : Collider;
		for(c in transform.root.GetComponentsInChildren(Collider))
			Physics.IgnoreCollision(instantiatedProjectile.collider, c);
		
		lastShot = Time.time;
		grenadeLauncher.ammoCount--;
		audio.clip = grenadeLauncher.fireSound;
		audio.Play();
		if(grenadeLauncher.shotDelay == 0){
			//Send message to weapon animation script
			if(aimed && Aim.playAnimation){
				BroadcastMessage ("Fire", SendMessageOptions.DontRequireReceiver);
			}
			if(!aimed){
				BroadcastMessage ("Fire", SendMessageOptions.DontRequireReceiver);
			}
			if(Recoil){
				mouseLook.Recoil(CameraRecoil.recoilPower);
				grenadeLauncherCameraRecoil();
			}
			if(grenadeLauncher.ammoCount > 0){
				grenadeLauncherReload();
			}
		}
	}
	
	function grenadeLauncherReload(){
		isReload = true;
		yield WaitForSeconds(grenadeLauncher.waitBeforeReload);
		aimed = false;
		BroadcastMessage ("Reloading", grenadeLauncher.reloadTime, SendMessageOptions.DontRequireReceiver);
		//Play reload sound
		audio.clip = grenadeLauncher.reloadSound;
		audio.Play();
		yield WaitForSeconds(grenadeLauncher.reloadTime);
		isReload = false;
	}
	
	function grenadeLauncherCameraRecoil(){
		camPos = Quaternion.Euler (Random.Range(-CameraRecoil.shakeAmount*1.5, -CameraRecoil.shakeAmount), Random.Range(CameraRecoil.shakeAmount/3, CameraRecoil.shakeAmount/2), 0);
		yield WaitForSeconds(0.1);
		camPos = camDefaultRotation;
	}
	/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	
	//////////////////////////////////////////////////SHOTGUN FUNCTIONS/////////////////////////////////////////////////////////
	function shotGunAwake(){
		ShotGun.bulletsLeft = ShotGun.bulletsPerClip;
		if(ShotGun.smoke){
			ShotGun.smoke.emit = false;
		}
		canAim = true;
		canFire = true;
	}
	
	function shotGunFixedUpdate (){
		if(fire && !isReload){
			shotGunFire();
		}else{
			shotGunStopFire();
		}	
		
		if(isReload){
			//motor.canRun = false;
			canAim = false;
		}
	}
	
	function shotGunFire (){
		if (ShotGun.bulletsLeft == 0)
			return;
	
		// If there is more than one bullet between the last and this frame
		// Reset the nextFireTime
		if (Time.time - ShotGun.fireRate > nextFireTime)
			nextFireTime = Time.time - Time.deltaTime;
		
		// Keep firing until we used up the fire time
		while( nextFireTime < Time.time && ShotGun.bulletsLeft != 0)
		{
			shotGunOneShot();
			nextFireTime += ShotGun.fireRate;
		}
		//motor.canRun = false;
	}
	
	function shotGunStopFire (){
		motor.canRun = true;
	}
	
	function shotGunOneShot () {
		//Before fire, move aim point to right position
		firePointSetup();
		var oldRotation = firePoint.rotation;
		for (var i : int = 0;i < ShotGun.fractions; i++) {
			firePoint.rotation =  Quaternion.Euler(Random.insideUnitSphere * ShotGun.errorAngle) * transform.rotation;
			var instantiatedProjectile = Instantiate (ShotGun.bullet, firePoint.position, firePoint.rotation);
		}
			firePoint.rotation = oldRotation;
			lastShot = Time.time;	
			//Play fire sound attached to a Weapon object
			audio.clip = ShotGun.fireSound;
			audio.Play();
			ShotGun.bulletsLeft--;
			//Send message to weapon animation script
			if(aimed && Aim.playAnimation){
				BroadcastMessage ("Fire", SendMessageOptions.DontRequireReceiver);
			}
			if(!aimed){
				BroadcastMessage ("Fire", SendMessageOptions.DontRequireReceiver);
			}
			shotGunSmokeEffect();
			if(Recoil){
				shotGunCameraRecoil();
				mouseLook.Recoil(CameraRecoil.recoilPower);
			}
	
		// Reload gun in reload Time	
		if(ShotGun.clips > 0)	
		if (ShotGun.bulletsLeft == 0){
			noBullets = true;
			yield WaitForSeconds(1);
			if(!isReload){
				shotGunReload();
			}
		}
	}
	
	function shotGunReload () {
		isReload = true;
		aimed = false;
		BroadcastMessage ("Reloading", ShotGun.reloadTime, SendMessageOptions.DontRequireReceiver);
		//Play reload sound
		audio.clip = ShotGun.reloadSound;
		audio.Play();
		// Wait for reload time first - then add more bullets!
		yield WaitForSeconds(ShotGun.reloadTime);
	
		// We have a clip left reload
		if (ShotGun.clips > 0){
		var difference = ShotGun.bulletsPerClip-ShotGun.bulletsLeft;
			if(ShotGun.clips > difference ){
				ShotGun.clips = ShotGun.clips - difference;
				ShotGun.bulletsLeft = ShotGun.bulletsLeft + difference;
			}else{
				ShotGun.bulletsLeft = ShotGun.bulletsLeft + ShotGun.clips;
				ShotGun.clips = 0;
			}
			noBullets = false;
			isReload = false;
			canAim = true;
			motor.canRun = true;
		}
	}
	
	function shotGunSmokeEffect(){
		if(!ShotGun.smoke)
			return;
		ShotGun.smoke.emit = true;
		yield WaitForSeconds(0.3);
		ShotGun.smoke.emit = false;	
	}
	
	function shotGunCameraRecoil(){
		camPos = Quaternion.Euler (Random.Range(-CameraRecoil.shakeAmount*1.5, -CameraRecoil.shakeAmount), Random.Range(CameraRecoil.shakeAmount/3, CameraRecoil.shakeAmount/2), 0);
		yield WaitForSeconds(0.1);
		camPos = camDefaultRotation;
	}
	//////////////////////////////////////////////////////////////////////////////////////////////////
	
	/////////////////////////////////////////////////KNIFE FUNCTIONS///////////////////////////////////
	function knifeAwake(){
		canAim = false;
		canFire = true;
	}
	
	function knifeOneShot () {
		if (Time.time > knife.fireRate + lastShot){
			//Before fire, move aim point to right position
			firePointSetup();
			//Play fire sound attached to a Weapon object
			audio.clip = knife.fireSound;
			audio.Play();
			BroadcastMessage ("Fire", SendMessageOptions.DontRequireReceiver);
			
			yield WaitForSeconds(knife.delayTime);
			
			var instantiatedProjectile = Instantiate (knife.bullet, firePoint.position, firePoint.rotation);
			lastShot = Time.time;	
		}
	}
	/////////////////////////////////////////////////////////////////////////////////////////////////
	
	////////////////////////////////////////////////AIM FUNCTIONS////////////////////////////////////
	function Aiming(){
		//Change camera FOV and weapon transform to aim values
		if(aimed && !motor.Running){
		 	currentPosition = Aim.aimPosition;
			currentFov = Aim.toFov;
			errorAngle = machineGun.AimErrorAngle;
			walkSway.bobbingAmount = Aim.aimBobbingAmount;
			//mouseLook.sensitivityX = mouseLook.defaultSensitivityX/1.1;
			//mouseLook.sensitivityY = mouseLook.defaultSensitivityY/1.1;
		} else {
			currentPosition = defaultPosition;
			currentFov = defaultFov;
			errorAngle = machineGun.NoAimErrorAngle;
			walkSway.bobbingAmount = defaultBobbingAmount;
			//mouseLook.sensitivityX = mouseLook.defaultSensitivityX;
			//mouseLook.sensitivityY = mouseLook.defaultSensitivityY;
		}
		//Change weapon position and camera FOV when player aim or no aim
		transform.localPosition = Vector3.Lerp(transform.localPosition, currentPosition, Time.deltaTime/Aim.smoothTime);
		camera.main.fieldOfView = Mathf.Lerp(camera.main.fieldOfView, currentFov, Time.deltaTime/Aim.smoothTime);
	}
	/////////////////////////////////////////////////////////////////////////////////////////////////
	function cameraRecoilDo(){
		camera.main.transform.localRotation = Quaternion.Slerp(camera.main.transform.localRotation, camPos, Time.deltaTime * CameraRecoil.smooth); 
	}
	
	function RotationRealism (){
		//ROTATION REALISM  
		var Xinput=Input.GetAxis("Mouse X");
		var Yinput=Input.GetAxis("Mouse Y");
		var currentAngley : float;
		var currentAnglex : float;
	
		if(Mathf.Abs(Xinput)>0.1){ 
			if(Xinput < 0.1){ 
				//Left
				currentAngley = -RotRealism.RotationAmplitude * Mathf.Abs(Xinput);	
			} 
			else if(Xinput > 0.1){ 
				//Right; 
				currentAngley = RotRealism.RotationAmplitude *  Mathf.Abs(Xinput);
			} 
		} else { 
			//Center
			currentAngley = 0;
		} 
		
		if(Mathf.Abs(Yinput)>0.1){ 
			if(Yinput < 0.1){ 
				//Down
				currentAnglex = RotRealism.RotationAmplitude * Mathf.Abs(Yinput);
			} 
			else if(Yinput > 0.1){ 
				//Up
				currentAnglex = -RotRealism.RotationAmplitude *  Mathf.Abs(Yinput);		
			} 
		} else { 
			//Center
			currentAnglex = 0;
		} 
		
		var target = Quaternion.Euler (currentAnglex, currentAngley, 0);
		transform.localRotation = Quaternion.Slerp(transform.localRotation, target, Time.deltaTime * RotRealism.smooth);
	}
	
	function SmoothMove (){
		//var MoveOnX : float = -Input.GetAxis("Horizontal");
		var MoveOnY = controller.velocity.y;
		var m : float;
		var MoveOnZ : float = -Input.GetAxis("Vertical");
		/*
		if (MoveOnX > SmoothMovement.maxAmount)
		MoveOnX = SmoothMovement.maxAmount;
		
		if (MoveOnX < -SmoothMovement.maxAmount)
		MoveOnX = -SmoothMovement.maxAmount;
		*/
		if(MoveOnY > SmoothMovement.maxAmount+1)
		m = -SmoothMovement.maxAmount;
		
		if(MoveOnY < -SmoothMovement.maxAmount-1)
		m = SmoothMovement.maxAmount;
		
		if (MoveOnZ> SmoothMovement.maxAmount)
		MoveOnZ = SmoothMovement.maxAmount;
		
		if (MoveOnZ < -SmoothMovement.maxAmount)
		MoveOnZ = -SmoothMovement.maxAmount;
		
		//var NewGunPos = new Vector3 (defaultPosition.x+ MoveOnX, defaultPosition.y + m, defaultPosition.z+ MoveOnZ);
		var NewGunPos = new Vector3 (transform.localPosition.x, transform.localPosition.y + m, transform.localPosition.z + MoveOnZ);
		transform.localPosition = Vector3.Lerp (transform.localPosition, NewGunPos, Time.deltaTime * SmoothMovement.Smooth);
	}
	
	function selectWeapon(){
		canFire = true;
		if(GunType != gunType.KNIFE){
			canAim = true;
		}
		aimed = false;
		BroadcastMessage ("takeIn");
	}
	
	function deselectWeapon(){
		aimed = false;
		isReload = false;
		canFire = false;
		canAim = false;
		isReload = false;
		BroadcastMessage ("takeOut");
	}
}

@script RequireComponent (AudioSource)
@script AddComponentMenu ("FPS system/Weapon System/WeaponScript")