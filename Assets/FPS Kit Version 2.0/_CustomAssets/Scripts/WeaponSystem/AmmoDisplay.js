//NSdesignGames @ 2012
//FPS Kit | Version 2.0

#pragma strict
//@script ExecuteInEditMode
var guiStyle : GUISkin;
var display : boolean = true;
private var bulletsLeft : int;
private var clips : int;
private var weaponscript : WeaponScript;
private var weaponManager : WeaponManager;

private var currentWeapon : WeaponScript;
private var color : float;


function Awake () {
	weaponManager = gameObject.FindWithTag("WeaponManager").GetComponent.<WeaponManager>();
}

function Update(){
	if(weaponManager.SelectedWeapon)
		weaponscript = weaponManager.SelectedWeapon.GetComponent.<WeaponScript>();
	if(!weaponscript)
		return;
	if(weaponscript.GunType == weaponscript.gunType.MACHINE_GUN){
		bulletsLeft = weaponscript.machineGun.bulletsLeft;
		clips = weaponscript.machineGun.clips;
	}
	
	if(weaponscript.GunType == weaponscript.gunType.SHOTGUN){
		bulletsLeft = weaponscript.ShotGun.bulletsLeft;
		clips = weaponscript.ShotGun.clips;
	}
	
	if(weaponscript.GunType == weaponscript.gunType.GRENADE_LAUNCHER){
		clips = weaponscript.grenadeLauncher.ammoCount;
	}
	
	if(currentWeapon != weaponManager.SelectedWeapon){
		color = Mathf.Lerp(color, 0.3, Time.deltaTime*20);
		if(color < 0.32){
			currentWeapon = weaponManager.SelectedWeapon;
		}
	}
}

function OnGUI (){
	if(!display)
		return;
	GUI.skin = guiStyle;
	GUI.color.a = 0.9;
	var rect : Rect = Rect (Screen.width - 110,Screen.height - 55,100,45);
	if(weaponscript){
		if(weaponscript.GunType != weaponscript.gunType.KNIFE){
			if(weaponscript.GunType == weaponscript.gunType.GRENADE_LAUNCHER){ 
				GUI.Box (rect, clips.ToString());
			}else{
				GUI.Box (rect, bulletsLeft + " | " + clips);
			}
		}else{
			GUI.Box (rect, "∞");
		}
	}
	
	//SHow weapon list (Smoothly fade In/Out)
	if(weaponManager){
		GUILayout.BeginArea (Rect (0,0,Screen.width,30));
			GUILayout.BeginHorizontal();
			for(var i : int = 0; i < weaponManager.allWeapons.Count; i++){
				if(weaponManager.allWeapons[i] == currentWeapon && currentWeapon == weaponManager.SelectedWeapon ){
					color = Mathf.Lerp(color, 0.9, Time.deltaTime*20);
					GUI.color.a= color;
				}else{
					GUI.color.a = 0.3;
				}
				GUILayout.Box(	weaponManager.allWeapons[i].weaponName,  GUILayout.Height(30));
			}
			GUILayout.EndHorizontal();
		GUILayout.EndArea();
	}
}
