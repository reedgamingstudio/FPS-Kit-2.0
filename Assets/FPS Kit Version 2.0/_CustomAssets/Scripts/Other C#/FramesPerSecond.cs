using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class FramesPerSecond : MonoBehaviour {
	
	//GUI
	public GUISkin guiStyle;
	
	public float updateInterval = 0.5f;
	private float accum = 0.0f;
	private int frames = 0;
	private float timeleft;
	public string fps;
	
	// Use this for initialization
	void Start () {
		timeleft = updateInterval;
	}
	
	// Update is called once per frame
	void Update () {
		timeleft -= Time.deltaTime;
		accum += Time.timeScale/Time.deltaTime;
		++frames;
		
		// Interval ended - update GUI text and start new interval
		if( timeleft <= 0.0 ) {
			// display two fractional digits (f2 format)
			fps = "" + (accum/frames).ToString("f2");
			timeleft = updateInterval;
			accum = 0.0f;
			frames = 0;
		}
	}
	
	void OnGUI () {
		GUI.skin = guiStyle;
	//	GUI.Label(new Rect (Screen.width-75, 5, 70, 20), "FPS " + fps);
		GUI.Label(new Rect (Screen.width-70, 35, 60, 30), fps);
	}
}