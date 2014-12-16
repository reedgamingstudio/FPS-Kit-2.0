//NSdesignGames @ 2012
//FPS Kit | Version 2.0

#pragma strict
//Attach this script to a ladder object, add collider to it and mark "trigger"
//and dont forget to tag it "Ladder"
//make 2 GameObjects rename them to LadderTop and LadderBottom 
//and place relative in bottom and top of ladder
//Assign that objects on ladderBottom and ladderTop variables
var ladderBottom : GameObject;
var ladderTop : GameObject;

private var climbDirection : Vector3 = Vector3.zero;

function Start () {
	climbDirection = ladderTop.transform.position -  ladderBottom.transform.position;
}

function ClimbDirection () {
	return climbDirection;
}

@script AddComponentMenu("FPS system/Ladder System/Attach to Ladder")