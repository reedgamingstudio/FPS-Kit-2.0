using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class WeaponSwitcher : MonoBehaviour {
	
	public GUISkin guiStyle;
	public List<GameObject> weapons;
	public float switchTime = 1;
	int weapIndex = 0;

	// Use this for initialization
	void Start () {
		//Deactivate all weapons before start
		for(int i = 0; i < weapons.Count; i ++){
			weapons[i].SetActiveRecursively(false);	
		}
		weapons[weapIndex].SetActiveRecursively(true);
		weapons[weapIndex].SendMessage("TakeIn");
	}
	
	// Update is called once per frame
	void Update () {
		//Previous weapon
		if(Input.GetKeyDown(KeyCode.Alpha1)){
			StartCoroutine(prevWeap(switchTime));
		}
		//Next weapon
		if(Input.GetKeyDown(KeyCode.Alpha2)){
			StartCoroutine(nextWeap(switchTime));
		}
	}
	
	public IEnumerator prevWeap(float timer){
		weapons[weapIndex].SendMessage("TakeOut");
		yield return new WaitForSeconds(timer);
		if(weapIndex > 0){
			weapons[weapIndex].SetActiveRecursively(false);
			weapIndex--;
			weapons[weapIndex].SetActiveRecursively(true);
		}else{
			weapons[weapIndex].SetActiveRecursively(false);
			weapIndex = weapons.Count-1;
			weapons[weapIndex].SetActiveRecursively(true);
		}
		weapons[weapIndex].SendMessage("TakeIn");
	}
	
	public IEnumerator nextWeap(float timer){
		weapons[weapIndex].SendMessage("TakeOut");
		yield return new WaitForSeconds(timer);
		if(weapIndex < weapons.Count-1){
			weapons[weapIndex].SetActiveRecursively(false);
			weapIndex++;
			weapons[weapIndex].SetActiveRecursively(true);
		}else{
			weapons[weapIndex].SetActiveRecursively(false);
			weapIndex = 0;
			weapons[weapIndex].SetActiveRecursively(true);
		}
		weapons[weapIndex].SendMessage("TakeIn");
	}
	
	void OnGUI(){
		GUI.skin = guiStyle;
		GUI.Label(new Rect(5, 5, 500, 20), "[ " + (weapIndex+1).ToString() + " / " + weapons.Count + " ]" + " : " + weapons[weapIndex].name);
		GUI.Label(new Rect(Screen.width-205, 5, 500, 20), "1 - Previous Weapon");
		GUI.Label(new Rect(Screen.width-205, 25, 500, 20), "2 - Next Weapon");
		GUI.Label(new Rect(Screen.width-205, 45, 500, 20), "LMB - Play Fire Animation");
		GUI.Label(new Rect(Screen.width-205, 65, 500, 20), "R - Play Reload Animation");
	}
}
