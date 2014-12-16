// ----------------------------------------------------------------------------
// <copyright file="PhotonView.cs" company="Exit Games GmbH">
//   PhotonNetwork Framework for Unity - Copyright (C) 2011 Exit Games GmbH
// </copyright>
// <summary>
//   
// </summary>
// <author>developer@exitgames.com</author>
// ----------------------------------------------------------------------------
using UnityEngine;
using System.Collections;

public enum ViewSynchronization { Off, ReliableDeltaCompressed, Unreliable }
public enum OnSerializeTransform { OnlyPosition, OnlyRotation, OnlyScale, PositionAndRotation, All }
public enum OnSerializeRigidBody { OnlyVelocity, OnlyAngularVelocity, All }

/// <summary>
/// PUN's NetworkView replacement class for networking. Use it like a NetworkView.
/// </summary>
/// \ingroup publicApi
[AddComponentMenu("Miscellaneous/Photon View")]
public class PhotonView : Photon.MonoBehaviour
{
    //Save scene ID in serializable INT (only changable via Editor)
    [SerializeField]
    private int sceneViewID = 0;

    [SerializeField]
    private PhotonViewID ID = new PhotonViewID(0, null);

    public Component observed;
    public ViewSynchronization synchronization;
    public int group = 0;
    public short prefix = -1;

    /// <summary>
    /// This is the instantiationData that was passed when calling PhotonNetwork.Instantiate* (if that was used to spawn this prefab)
    /// </summary>
    public object[] instantiationData = null;
    
    /// <summary>
    /// For internal use only, don't use
    /// </summary>
    protected internal object[] lastOnSerializeDataSent = null;
    
    /// <summary>
    /// For internal use only, don't use
    /// </summary>
    protected internal object[] lastOnSerializeDataReceived = null; 
    
    public OnSerializeTransform onSerializeTransformOption = OnSerializeTransform.PositionAndRotation;
    
    public OnSerializeRigidBody onSerializeRigidBodyOption = OnSerializeRigidBody.All;
    
    private bool registeredPhotonView = false;

    public PhotonViewID viewID
    {
        get
        {
            if (!this.ranSetup)
            {
                this.Setup();
            }

            if (this.ID.ID < 1 && this.sceneViewID > 0)
            {   
                // Load the correct scene ID
                this.ID = new PhotonViewID(this.sceneViewID, null);
            }

            return this.ID;
        }

        set
        {
            if (!this.ranSetup)
            {
                this.Setup();
            }

            if (this.registeredPhotonView && PhotonNetwork.networkingPeer != null)
            {
                PhotonNetwork.networkingPeer.RemovePhotonView(this, true);
            }

            this.ID = value;
            if (PhotonNetwork.networkingPeer != null)
            {
                PhotonNetwork.networkingPeer.RegisterPhotonView(this);
                this.registeredPhotonView = true;
            }
        }
    }

    public override string ToString()
    {
        return string.Format("View {0} on {1} {2}", this.ID.ID, this.gameObject.name, (this.isSceneView) ? "(scene)" : string.Empty);
    }

    public bool isSceneView
    {
        get
        {
            return (this.sceneViewID > 0) // Baked in the scene via editor
                || (this.ID.owner == null && this.ID.ID > 0 && this.ID.ID < PhotonNetwork.MAX_VIEW_IDS); //Spawned via InstantiateSceneobject
        }
    }

    public PhotonPlayer owner
    {
        get
        {
            if (!this.ranSetup)
            {
                this.Setup();
            }

            return this.viewID.owner;
        }
    }

    /// <summary>
    /// Is this photonView mine?
    /// True in case the owner matches the local PhotonPlayer
    /// ALSO true if this is a scene photonview on the Master client
    /// </summary>
    public bool isMine
    {
        get
        {
            if (!this.ranSetup)
            {
                this.Setup();
            }

            return (this.owner == PhotonNetwork.player) || (this.isSceneView && PhotonNetwork.isMasterClient);
        }
    }

#if UNITY_EDITOR

    public void SetSceneID(int newID)
    {
        sceneViewID = newID;
    }

    public int GetSceneID()
    {
        return sceneViewID;
    }

#endif

    /// <summary>Called by Unity on start of the application and does a setup the PhotonView.</summary>
    public void Awake()
    {
        this.Setup();
    }

    private bool ranSetup = false;

    private void Setup()
    {
        if (!Application.isPlaying)
        {
            return;
        }

        if (this.ranSetup)
        {
            return;
        }
        
        this.ranSetup = true;

        if (this.isSceneView)
        {
            bool result = PhotonNetwork.networkingPeer.PhotonViewSetup_FindMatchingRoot(gameObject);
            if (result)
            {
                // This instantiated prefab needs to be corrected as it's incorrectly reported as a sceneview.
                // It is wrongly reported as isSceneView because a scene-prefab changes have been applied to the project prefab
                // The scene's prefab viewID is therefore saved to the project prefab. This workaround fixes all problems
                this.sceneViewID = 0;
            }
            else
            {
                if (this.sceneViewID < 1)
                {
                    Debug.LogError("SceneView " + sceneViewID);
                }

                ID = new PhotonViewID(this.sceneViewID, null);
                this.registeredPhotonView = true;
                PhotonNetwork.networkingPeer.RegisterPhotonView(this);
            }
        }
        else
        {
            bool res = PhotonNetwork.networkingPeer.PhotonViewSetup_FindMatchingRoot(gameObject);
            if (!res)
            {
                if (PhotonNetwork.logLevel != PhotonLogLevel.ErrorsOnly)
                {
                    Debug.LogWarning("Warning: Did not find the root of a PhotonView. This is only OK if you used GameObject.Instantiate to instantiate this prefab. Object: " + this.name);
                }
            }
        }
    }

    void OnDestroy()
    {
        PhotonNetwork.networkingPeer.RemovePhotonView(this, true);
    }

    public void RPC(string methodName, PhotonTargets target, params object[] parameters)
    {
        PhotonNetwork.RPC(this, methodName, target, parameters);
    }

    public void RPC(string methodName, PhotonPlayer targetPlayer, params object[] parameters)
    {
        PhotonNetwork.RPC(this, methodName, targetPlayer, parameters);
    }

    public static PhotonView Get(Component component)
    {
        return component.GetComponent<PhotonView>();
    }

    public static PhotonView Get(GameObject gameObj)
    {
        return gameObj.GetComponent<PhotonView>();
    }

    public static PhotonView Find(int viewID)
    {
        return PhotonNetwork.networkingPeer.GetPhotonView(viewID);
    }
}