//NSdesignGames @ 2012
//FPS Kit | Version 2.0

#pragma strict

enum RotationAxes{ MouseXAndY, MouseX, MouseY }
var axes = RotationAxes.MouseXAndY;
var sensitivity : float = 4;
var aimSensitivity : float = 2;

@HideInInspector
var sensitivityX : float = 15;
@HideInInspector
var sensitivityY : float = 15;
private var minimumX : float = -360;
private var maximumX : float = 360;

var minimumY : float = -80;
var maximumY : float = 80;

private var rotationY : float = 0;

//Find WeaponManager script to know when selected weapon is aimed or not
private var weapManager : WeaponManager;
private var weapScript : WeaponScript;
	
//Added for sniper scope
@HideInInspector
public var currentSensitivity : float;

function Awake (){
	weapManager = gameObject.FindWithTag("WeaponManager").GetComponent.<WeaponManager>();
}

function Update (){
	if(Time.timeScale < 0.01)
		return;
	if (axes == RotationAxes.MouseXAndY){
		var rotationX : float = transform.localEulerAngles.y + Input.GetAxis("Mouse X") * sensitivityX;
			
		rotationY += Input.GetAxis("Mouse Y") * sensitivityY;
		rotationY = Mathf.Clamp (rotationY, minimumY, maximumY);
			
		transform.localEulerAngles = new Vector3(-rotationY, rotationX, 0);
	}
	else if (axes == RotationAxes.MouseX){
		transform.Rotate(0, Input.GetAxis("Mouse X") * sensitivityX, 0);
	}else{
		rotationY += Input.GetAxis("Mouse Y") * sensitivityY;
		rotationY = Mathf.Clamp (rotationY, minimumY, maximumY);
	
		transform.localEulerAngles = new Vector3(-rotationY, transform.localEulerAngles.y, 0);
	}
	
	//Find current selected weapon script
	if(weapManager.SelectedWeapon){
		weapScript = weapManager.SelectedWeapon.GetComponent.<WeaponScript>();
	}
	//Check if weapon aimed or not
	if(weapScript && weapScript.aimed){
		currentSensitivity = aimSensitivity;
	}else{
		currentSensitivity = sensitivity;
	}
	sensitivityX = currentSensitivity;
	sensitivityY = currentSensitivity;
}

function Recoil(amount : float){
	rotationY += amount;
}

@script AddComponentMenu ("FPS system/Character/FPS MouseLook")