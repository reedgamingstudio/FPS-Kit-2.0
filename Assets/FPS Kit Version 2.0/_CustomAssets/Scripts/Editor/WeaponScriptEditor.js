//NSdesignGames @ 2012
//FPS Kit | Version 2.0

@CustomEditor (WeaponScript)

class WeaponScriptEditor extends Editor {
	//var gunTipo = target.gunType.MACHINE_GUN;
	
	
	public function OnInspectorGUI () {
		
	 	var script = target as WeaponScript;
	 	var allowSceneObjects : boolean = !EditorUtility.IsPersistent(script);
	 	
	 	//Variable that allow assign scene objects *New*
		gunTipo = script.GunType;

 		script.GunType = EditorGUILayout.EnumPopup(" Gun Type:", script.GunType);
 		script.weaponName = EditorGUILayout.TextField(" Weapon Name:", script.weaponName);

 		if(script.GunType != script.gunType.KNIFE){
 			script.singleFire = EditorGUILayout.Toggle(" Single Fire:  ", script.singleFire);
 			script.Recoil = EditorGUILayout.Toggle(" Recoil:  ", script.Recoil);
 		}
 		
 		if(script.GunType != script.gunType.KNIFE){
 			EditorGUILayout.Space();
 			EditorGUILayout.LabelField("", "Aim properties", "button");
 			//Aim variables
 			script.Aim.aimPosition = EditorGUILayout.Vector3Field (" Aim Position:", script.Aim.aimPosition);
 			script.Aim.smoothTime = EditorGUILayout.Slider(" Aim Time:", script.Aim.smoothTime, 0, 1);
 			script.Aim.toFov = EditorGUILayout.IntSlider(" Aim Fov:", script.Aim.toFov, 5, 60);
 			script.Aim.aimBobbingAmount = EditorGUILayout.FloatField(" Aim Sway:", script.Aim.aimBobbingAmount );
 			script.Aim.playAnimation = EditorGUILayout.Toggle(" Play Animation:", script.Aim.playAnimation);
 		}

 		//Grenade launcher
 		if(script.GunType == script.gunType.GRENADE_LAUNCHER){
 			EditorGUILayout.Space();
 			EditorGUILayout.LabelField("", "Grenade launcher properties", "button");
 			script.firePoint = EditorGUILayout.ObjectField(" Fire Point:", script.firePoint, Transform, allowSceneObjects) as Transform;
 			script.grenadeLauncher.projectile = EditorGUILayout.ObjectField(" Projectile: ", script.grenadeLauncher.projectile, Rigidbody, allowSceneObjects) as Rigidbody;
 			script.grenadeLauncher.fireSound = EditorGUILayout.ObjectField(" Fire Sound: ", script.grenadeLauncher.fireSound, AudioClip, allowSceneObjects) as AudioClip;
 			script.grenadeLauncher.reloadSound = EditorGUILayout.ObjectField(" Reload Sound: ", script.grenadeLauncher.reloadSound, AudioClip, allowSceneObjects) as AudioClip;
 			script.grenadeLauncher.initialSpeed = EditorGUILayout.IntSlider(" Initial Speed:", script.grenadeLauncher.initialSpeed, 1, 80);
 			script.grenadeLauncher.shotDelay = EditorGUILayout.FloatField(" Shot Delay:", script.grenadeLauncher.shotDelay);
 			script.grenadeLauncher.waitBeforeReload = EditorGUILayout.FloatField(" Wait Before Reload:", script.grenadeLauncher.waitBeforeReload);
 			script.grenadeLauncher.reloadTime = EditorGUILayout.FloatField(" Reload Time:", script.grenadeLauncher.reloadTime);
 			script.grenadeLauncher.ammoCount = EditorGUILayout.IntSlider(" Ammo Count:", script.grenadeLauncher.ammoCount, 0, 999);
		}

		if(script.GunType == script.gunType.MACHINE_GUN){
			EditorGUILayout.Space();
 		//Machine gun
 			EditorGUILayout.LabelField("", "Machine gun properties", "button");
 			script.firePoint = EditorGUILayout.ObjectField(" Fire Point:", script.firePoint, Transform, allowSceneObjects) as Transform;
 			script.machineGun.bullet = EditorGUILayout.ObjectField(" Bullet: ", script.machineGun.bullet, Transform, allowSceneObjects) as Transform;
 			script.machineGun.muzzleFlash = EditorGUILayout.ObjectField(" Muzzle Flash:", script.machineGun.muzzleFlash, GameObject, allowSceneObjects) as GameObject;
 			script.machineGun.fireSound = EditorGUILayout.ObjectField(" Fire Sound: ", script.machineGun.fireSound, AudioClip, allowSceneObjects) as AudioClip;
 			script.machineGun.reloadSound = EditorGUILayout.ObjectField(" Reload Sound: ", script.machineGun.reloadSound, AudioClip, allowSceneObjects) as AudioClip;
 			script.machineGun.pointLight = EditorGUILayout.ObjectField(" Muzzle Light:", script.machineGun.pointLight, Light, allowSceneObjects) as Light;
 			script.machineGun.fireRate = EditorGUILayout.FloatField(" Fire Rate:  ", script.machineGun.fireRate);
 			script.machineGun.bulletsPerClip = EditorGUILayout.IntSlider( " Bullets Per Clip:", script.machineGun.bulletsPerClip, 0, 999);
 			script.machineGun.clips = EditorGUILayout.IntSlider( " Total Bullets:", script.machineGun.clips, 0, 999);
 			script.machineGun.bulletsLeft = EditorGUILayout.IntSlider( " Current Ammo:", script.machineGun.bulletsLeft, 0, script.machineGun.bulletsPerClip);
 			script.machineGun.reloadTime = EditorGUILayout.FloatField(" Reload Time:  ", script.machineGun.reloadTime);
 			script.machineGun.NoAimErrorAngle = EditorGUILayout.IntSlider( " No Aim Error Angle:", script.machineGun.NoAimErrorAngle, 0, 10);
 			script.machineGun.AimErrorAngle = EditorGUILayout.IntSlider( " Aim Error Angle:", script.machineGun.AimErrorAngle, 0, 3);
 		}
 		
 		if(script.GunType == script.gunType.SHOTGUN){
 			EditorGUILayout.Space();
 		//Shotgun
 			EditorGUILayout.LabelField("", "Shotgun properties", "button");
 			script.firePoint = EditorGUILayout.ObjectField(" Fire Point:", script.firePoint, Transform, allowSceneObjects) as Transform;
 			script.ShotGun.bullet = EditorGUILayout.ObjectField(" Bullet: ", script.ShotGun.bullet, Transform, allowSceneObjects) as Transform;
 			script.ShotGun.fireSound = EditorGUILayout.ObjectField(" Fire Sound: ", script.ShotGun.fireSound, AudioClip, allowSceneObjects) as AudioClip;
 			script.ShotGun.reloadSound = EditorGUILayout.ObjectField(" Reload Sound: ", script.ShotGun.reloadSound, AudioClip, allowSceneObjects) as AudioClip;
 			script.ShotGun.smoke = EditorGUILayout.ObjectField(" Smoke:", script.ShotGun.smoke, ParticleEmitter, allowSceneObjects) as ParticleEmitter;
 			script.ShotGun.fractions = EditorGUILayout.IntSlider( " Fractions:", script.ShotGun.fractions, 2, 8);
 			script.ShotGun.errorAngle = EditorGUILayout.IntSlider( " Error Angle:", script.ShotGun.errorAngle, 2, 10);
 			script.ShotGun.fireRate = EditorGUILayout.FloatField(" Fire Rate:  ", script.ShotGun.fireRate);
 			script.ShotGun.reloadTime = EditorGUILayout.FloatField(" Reload Time:  ", script.ShotGun.reloadTime);
 			script.ShotGun.bulletsPerClip = EditorGUILayout.IntSlider( " Bullets Per Clip:", script.ShotGun.bulletsPerClip, 0, 20);
 			script.ShotGun.bulletsLeft = EditorGUILayout.IntSlider( " Current Ammo:", script.ShotGun.bulletsLeft, 0, script.ShotGun.bulletsPerClip);
 			script.ShotGun.clips = EditorGUILayout.IntSlider( " Total Bullets:", script.ShotGun.clips, 0, 999);
 		}
 		
 		if(script.GunType == script.gunType.KNIFE){
 			EditorGUILayout.Space();
 		//Knife
 			EditorGUILayout.LabelField("", "Knife properties", "button");	
 			script.knife.bullet = EditorGUILayout.ObjectField(" Bullet: ", script.knife.bullet, Transform, allowSceneObjects) as Transform;
 			script.knife.fireSound = EditorGUILayout.ObjectField(" Fire Sound: ", script.knife.fireSound, AudioClip, allowSceneObjects) as AudioClip;
 			script.knife.fireRate = EditorGUILayout.FloatField(" Fire Rate:  ", script.knife.fireRate);
 			script.knife.delayTime = EditorGUILayout.FloatField(" Delay Time:  ", script.knife.delayTime);
 		}
 		
 		EditorGUILayout.Space();
 		EditorGUILayout.LabelField("", "Rotation realism", "button");
 		script.RotRealism.RotationAmplitude = EditorGUILayout.IntSlider( " Rotation Amplitude:", script.RotRealism.RotationAmplitude, 0, 8);
 		script.RotRealism.smooth = EditorGUILayout.IntSlider( " Smooth:", script.RotRealism.smooth, 0, 10);
 		
 		EditorGUILayout.Space();
 		EditorGUILayout.LabelField("", "Smooth move", "button");
 		script.SmoothMovement.Smooth = EditorGUILayout.IntSlider( " Smooth:", script.SmoothMovement.Smooth, 0, 10);
 		script.SmoothMovement.maxAmount = EditorGUILayout.Slider(" Move Responce:  ", script.SmoothMovement.maxAmount, 0, 1);
 		
 		if(script.Recoil == true){
 			EditorGUILayout.Space();
 			EditorGUILayout.LabelField("", "Main camera recoil effect", "button");
 			script.CameraRecoil.recoilPower = EditorGUILayout.FloatField(" Recoil Power:  ", script.CameraRecoil.recoilPower);
 			script.CameraRecoil.shakeAmount = EditorGUILayout.FloatField(" Shake Amount:  ", script.CameraRecoil.shakeAmount);
 			script.CameraRecoil.smooth = EditorGUILayout.IntSlider( " Smooth:", script.CameraRecoil.smooth, 0, 20);
 		}
     	if (GUI.changed){
            EditorUtility.SetDirty (script);
       	}

 	}
}