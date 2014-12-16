// ----------------------------------------------------------------------------
// <copyright file="PhotonViewInspector.cs" company="Exit Games GmbH">
//   PhotonNetwork Framework for Unity - Copyright (C) 2011 Exit Games GmbH
// </copyright>
// <summary>
//   Custom inspector for the PhotonView component.
// </summary>
// <author>developer@exitgames.com</author>
// ----------------------------------------------------------------------------

using System;
using UnityEditor;
using UnityEngine;

[CustomEditor(typeof(PhotonView))]
public class PhotonViewInspector : Editor
{
    private bool doubleView = false;

    private static PhotonView lastView;

    private static GameObject GetPrefabParent(GameObject mp)
    {
        #if UNITY_2_6_1 || UNITY_2_6 || UNITY_3_0 || UNITY_3_0_0 || UNITY_3_1 || UNITY_3_2 || UNITY_3_3 || UNITY_3_4
        // Unity 3.4 and older use EditorUtility
        return (EditorUtility.GetPrefabParent(mp) as GameObject);
        #else
        // Unity 3.5 uses PrefabUtility
        return PrefabUtility.GetPrefabParent(mp) as GameObject;
        #endif
    }

    public override void OnInspectorGUI()
    {
        EditorGUIUtility.LookLikeInspector();
        EditorGUI.indentLevel = 1;

        PhotonView mp = (PhotonView)this.target;
        bool isProjectPrefab = EditorUtility.IsPersistent(mp.gameObject);

        if (!EditorApplication.isPlaying)
        {
            if (mp != lastView)
            {
                // First opening of this viewID
                if (!isProjectPrefab)
                {
                    if (!IsSceneViewIDFree(mp.viewID.ID, mp))
                    {
                        Debug.LogWarning("PhotonView: Wrong view ID(" + mp.viewID.ID + ") on " + mp.name + ", checking entire scene for fixes...");
                        VerifyAllSceneViews();
                    }
                }

                lastView = mp;
            }
        }

        SerializedObject sObj = new SerializedObject(mp);
        SerializedProperty sceneProp = sObj.FindProperty("sceneViewID");

        // SerializedProperty sceneProp2 = sObj.FindProperty("isSceneView");

        // FIX for an issue where a prefab(with photon view) is dragged to the scene and its changes APPLIED
        // This means that the scene assigns a ID, but this ID may not be saved to the prefab.
        // Unity's prefab AssetImporter doesn't seem to work (3.4), hence this nasty workaround.
        // Desired values:
        // scene = true true     proj = false false. Thus, error case=
        if (sceneProp.isInstantiatedPrefab && !sceneProp.prefabOverride)
        {
            // Fix the assignment
            // EDIT: THIS ISSUE HAS BEEN FIXED IN PHOTONVIEW.CS BY CHECKING FOR THE PhotonViewSetup_FindMatchingRoot in Setup();
            // #if !UNITY_3_5
            // sceneProp.prefabOverride = true;
            // #endif
            sObj.ApplyModifiedProperties();

            // FIX THE EDITOR PREFAB: set it to 0
            GameObject prefabParent = GetPrefabParent(mp.gameObject);
            if (prefabParent != null)
            {
                // find all PhotonViews on prefab, including those on inactive components to assign a PhotonViewId
                PhotonView[] views = prefabParent.transform.root.GetComponentsInChildren<PhotonView>(true) as PhotonView[];
                foreach (PhotonView viewX in views)
                {
                    MakeProjectView(viewX);
                }

                // ForceUpdate re-import for the prefab
                ForceAssetUpdate(mp.gameObject);
            }

            // Assign the desired scene IDs back (they were reset to 0 by applying)
            PhotonView[] views2 = mp.transform.root.GetComponentsInChildren<PhotonView>();
            foreach (PhotonView view in views2)
            {
                int wantedID = view.viewID.ID;
                view.SetSceneID(wantedID);
                EditorUtility.SetDirty(view);
            }
        }

        // Setup
        if (!isProjectPrefab)
        {
            if (mp.viewID.ID == 0)
            {
                SetViewID(mp, GetFreeSceneID(mp));
            }
        }
        else
        {
            if (mp.viewID.ID != 0 || mp.isSceneView)
            {
                // Correct the settings
                Debug.LogWarning("Correcting view ID on project prefab (should be unassigned, but it was " + mp.viewID.ID + ")");
                MakeProjectView(mp);
            }
        }

        // OWNER
        if (isProjectPrefab)
        {
            EditorGUILayout.LabelField("Owner:", "Set at runtime");
        }
        else if (mp.isSceneView)
        {
            EditorGUILayout.LabelField("Owner:", "Scene");
        }
        else if (mp.owner == null)
        {
            EditorGUILayout.LabelField("Owner:", "null, disconnected?");
        }
        else
        {
            EditorGUILayout.LabelField("Owner:", "[" + mp.owner.ID + "] " + mp.owner.name);
        }

        // View ID
        if (isProjectPrefab)
        {
            EditorGUILayout.LabelField("View ID", "Set at runtime");
        }
        else if (EditorApplication.isPlaying)
        {
            if (mp.owner != null)
            {
                EditorGUILayout.LabelField("View ID", "[" + mp.owner.ID + "] " + mp.viewID);
            }
            else
            {
                EditorGUILayout.LabelField("View ID", mp.viewID + string.Empty);
            }
        }
        else
        {
            int newID = EditorGUILayout.IntField("View ID", mp.viewID.ID);
            if (GUI.changed)
            {
                SetViewID(mp, newID);
            }

            if (this.doubleView)
            {
                GUI.color = Color.red;
                EditorGUILayout.LabelField("ERROR:", "Invalid view ID");
                GUI.color = Color.white;
            }

            if (GUI.changed)
            {
                this.ChangedSetting();
                this.doubleView = false;
                PhotonView[] photonViews = Resources.FindObjectsOfTypeAll(typeof(PhotonView)) as PhotonView[];
                foreach (PhotonView view in photonViews)
                {
                    if (view.isSceneView && view.viewID == mp.viewID && view != mp)
                    {
                        this.doubleView = true;
                        EditorUtility.DisplayDialog("Error", "There is already a viewID with ID=" + view.viewID, "OK");
                    }
                }
            }
        }

        // OBSERVING    
        EditorGUILayout.BeginHorizontal();

        // Using a lower version then 3.4? Remove the TRUE in the next line to fix an compile error
        string title = string.Empty;
        int firstOpen = 0;
        if (mp.observed != null)
        {
            firstOpen = mp.observed.ToString().IndexOf('(');
        }

        if (firstOpen > 0)
        {
            title = mp.observed.ToString().Substring(firstOpen - 1);
        }

        mp.observed = (Component)EditorGUILayout.ObjectField("Observe: " + title, mp.observed, typeof(Component), true);
        if (GUI.changed)
        {
            this.ChangedSetting();
            if (mp.observed != null)
            {
                mp.synchronization = ViewSynchronization.ReliableDeltaCompressed;
            }
            else
            {
                mp.synchronization = ViewSynchronization.Off;
            }
        }

        EditorGUILayout.EndHorizontal();

        if (mp.synchronization == ViewSynchronization.Off)
        {
            GUI.color = Color.grey;
        }

        mp.synchronization = (ViewSynchronization)EditorGUILayout.EnumPopup("Observe option:", mp.synchronization);
        if (GUI.changed)
        {
            this.ChangedSetting();
            if (mp.synchronization != ViewSynchronization.Off && mp.observed == null)
            {
                EditorUtility.DisplayDialog("Warning", "Setting the synchronization option only makes sense if you observe something.", "OK, I will fix it.");
            }
        }

        if (mp.observed != null)
        {
            Type type = mp.observed.GetType();
            if (type == typeof(Transform))
            {
                mp.onSerializeTransformOption = (OnSerializeTransform)EditorGUILayout.EnumPopup("Serialization:", mp.onSerializeTransformOption);
            }
            else if (type == typeof(Rigidbody))
            {
                mp.onSerializeRigidBodyOption = (OnSerializeRigidBody)EditorGUILayout.EnumPopup("Serialization:", mp.onSerializeRigidBodyOption);
            }
        }

        GUI.color = Color.white;
        EditorGUIUtility.LookLikeControls();
    }

    private void ChangedSetting()
    {
        PhotonView mp = (PhotonView)this.target;
        if (!EditorApplication.isPlaying)
        {
            EditorUtility.SetDirty(mp);
        }
    }

    public static void MakeProjectView(PhotonView view)
    {
        view.viewID = new PhotonViewID(0, null);
        view.SetSceneID(0);
        EditorUtility.SetDirty(view);
    }

    private static void SetViewID(PhotonView mp, int ID)
    {
        ID = Mathf.Clamp(ID, 1, PhotonNetwork.MAX_VIEW_IDS - 1);

        if (!IsSceneViewIDFree(ID, mp))
        {
            ID = GetFreeSceneID(mp);
        }

        if (mp.viewID.ID != ID)
        {
            mp.viewID = new PhotonViewID(ID, null);
        }

        if (!EditorApplication.isPlaying)
        {
            mp.SetSceneID(mp.viewID.ID);
            ForceAssetUpdate(mp.gameObject);
        }

        EditorUtility.SetDirty(mp);
    }

    public static void ForceAssetUpdate(GameObject mp)
    {
        GameObject pPrefab = GetPrefabParent(mp);
        if (pPrefab != null)
        {
            pPrefab = pPrefab.transform.root.gameObject;
            string assetPath = AssetDatabase.GetAssetPath(pPrefab);
            if (assetPath == string.Empty)
            {
                Debug.LogError("No assetpath for " + pPrefab);
            }

            AssetDatabase.ImportAsset(assetPath, ImportAssetOptions.ForceUpdate);
        }
    }

    private static int GetFreeSceneID(PhotonView targetView)
    {
        // No need for bit shifting as scene is "player 0".
        /* Hashtable takenIDs = new Hashtable();
         PhotonView[] views = (PhotonView[])GameObject.FindObjectsOfType(typeof(PhotonView));
         foreach (PhotonView view in views)
         {
             takenIDs[view.viewID] = view;
         }*/
        for (int i = 1; i < PhotonNetwork.MAX_VIEW_IDS; i++)
        {
            if (IsSceneViewIDFree(i, targetView))
            {
                return i;
            }
        }

        EditorUtility.DisplayDialog("Error", "You ran out of view ID's (" + PhotonNetwork.MAX_VIEW_IDS + "). Something is seriously wrong!", "OK");
        return 1;
    }

    private static bool IsSceneViewIDFree(int ID, PhotonView targetView)
    {
        if (ID <= 0)
        {
            return false;
        }

        PhotonView[] photonViews = Resources.FindObjectsOfTypeAll(typeof(PhotonView)) as PhotonView[];
        foreach (PhotonView view in photonViews)
        {
            if (!view.isSceneView)
            {
                continue;
            }

            if (view != targetView && view.viewID != null && view.viewID.ID == ID)
            {
                return false;
            }
        }

        return true;
    }

    public static int VerifyAllSceneViews()
    {
        int correctedViews = 0;
        PhotonView[] photonViews = Resources.FindObjectsOfTypeAll(typeof(PhotonView)) as PhotonView[];
        foreach (PhotonView view in photonViews)
        {
            if (!VerifySceneView(view))
            {
                correctedViews++;
            }
        }

        if (correctedViews > 0)
        {
            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh();
        }
        return correctedViews;
    }

    public static bool VerifySceneView(PhotonView view)
    {
        if (!EditorUtility.IsPersistent(view.gameObject) && !IsSceneViewIDFree(view.viewID.ID, view))
        {
            SetViewID(view, GetFreeSceneID(view));
            return false;
        }

        return true;
    }
}
