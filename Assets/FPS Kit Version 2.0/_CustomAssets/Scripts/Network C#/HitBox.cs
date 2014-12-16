//This script will be attached automatically to every hit box
//It will receive damage and transmit it to PlayerDamage.cs

using UnityEngine;
using System.Collections;

public class HitBox : MonoBehaviour {
	
	public float maxDamage;
	public PlayerDamage playerDamage;

	void ApplyDamage(float damage){
		//So we receive bullet damage and also add other damage value we have configured in PlayerDamage.cs
		playerDamage.totalDamage(damage + maxDamage);
	}
}
