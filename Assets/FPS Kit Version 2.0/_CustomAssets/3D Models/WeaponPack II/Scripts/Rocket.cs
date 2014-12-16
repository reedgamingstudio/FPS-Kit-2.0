using UnityEngine;
using System.Collections;

public class Rocket : MonoBehaviour {
	
	public float timeOut = 4.0f;
	
	// Use this for initialization
	void Start () {
		Destroy (gameObject, timeOut);
	}
	
	// Update is called once per frame
	void Update () {
		transform.Translate(new Vector3(0,0,1) * Time.deltaTime*150);
	}
}
