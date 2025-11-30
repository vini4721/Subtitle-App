import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";

// Firebase service with graceful fallback to local storage
class FirebaseService {
  constructor() {
    this.isFirebaseEnabled = false;
    this.currentUser = null;
  }

  // Initialize Firebase (optional - falls back to local storage)
  async initialize() {
    try {
      // Check if Firebase is configured
      // If not, use local storage as fallback
      this.isFirebaseEnabled = false;
      console.log("Firebase not configured. Using local storage.");
      return true;
    } catch (error) {
      console.error("Firebase initialization error:", error);
      return false;
    }
  }

  // Authentication methods
  async signUp(email, password) {
    if (!this.isFirebaseEnabled) {
      // Mock authentication for demo
      const user = { uid: Date.now().toString(), email };
      await AsyncStorage.setItem("user", JSON.stringify(user));
      this.currentUser = user;
      return user;
    }
    // Real Firebase auth would go here
  }

  async signIn(email, password) {
    if (!this.isFirebaseEnabled) {
      // Check local storage
      const userStr = await AsyncStorage.getItem("user");
      if (userStr) {
        this.currentUser = JSON.parse(userStr);
        return this.currentUser;
      }
      // Auto-create demo user
      return this.signUp(email, password);
    }
    // Real Firebase auth would go here
  }

  async signOut() {
    if (!this.isFirebaseEnabled) {
      await AsyncStorage.removeItem("user");
      this.currentUser = null;
      return;
    }
    // Real Firebase auth would go here
  }

  async getCurrentUser() {
    if (!this.isFirebaseEnabled) {
      if (this.currentUser) return this.currentUser;
      const userStr = await AsyncStorage.getItem("user");
      if (userStr) {
        this.currentUser = JSON.parse(userStr);
        return this.currentUser;
      }
      return null;
    }
    // Real Firebase auth would go here
  }

  // Storage methods
  async uploadVideo(videoUri, fileName) {
    if (!this.isFirebaseEnabled) {
      // Use local file system
      const newPath = `${FileSystem.documentDirectory}videos/${fileName}`;
      await FileSystem.makeDirectoryAsync(
        `${FileSystem.documentDirectory}videos`,
        { intermediates: true }
      );
      await FileSystem.copyAsync({
        from: videoUri,
        to: newPath,
      });
      return newPath;
    }
    // Real Firebase Storage would go here
  }

  async downloadVideo(videoId) {
    if (!this.isFirebaseEnabled) {
      return `${FileSystem.documentDirectory}videos/${videoId}`;
    }
    // Real Firebase Storage would go here
  }

  // Project management
  async saveProject(project) {
    const user = await this.getCurrentUser();
    if (!user) throw new Error("User not authenticated");

    if (!this.isFirebaseEnabled) {
      // Save to local storage
      const projectsStr = await AsyncStorage.getItem("projects");
      const projects = projectsStr ? JSON.parse(projectsStr) : [];
      const newProject = {
        ...project,
        id: project.id || Date.now().toString(),
        userId: user.uid,
        createdAt: project.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const existingIndex = projects.findIndex((p) => p.id === newProject.id);
      if (existingIndex >= 0) {
        projects[existingIndex] = newProject;
      } else {
        projects.push(newProject);
      }

      await AsyncStorage.setItem("projects", JSON.stringify(projects));
      return newProject;
    }
    // Real Firebase Firestore would go here
  }

  async getProjects() {
    const user = await this.getCurrentUser();
    if (!user) return [];

    if (!this.isFirebaseEnabled) {
      const projectsStr = await AsyncStorage.getItem("projects");
      const allProjects = projectsStr ? JSON.parse(projectsStr) : [];
      return allProjects.filter((p) => p.userId === user.uid);
    }
    // Real Firebase Firestore would go here
  }

  async deleteProject(projectId) {
    if (!this.isFirebaseEnabled) {
      const projectsStr = await AsyncStorage.getItem("projects");
      const projects = projectsStr ? JSON.parse(projectsStr) : [];
      const filtered = projects.filter((p) => p.id !== projectId);
      await AsyncStorage.setItem("projects", JSON.stringify(filtered));
      return true;
    }
    // Real Firebase Firestore would go here
  }

  async getProject(projectId) {
    if (!this.isFirebaseEnabled) {
      const projectsStr = await AsyncStorage.getItem("projects");
      const projects = projectsStr ? JSON.parse(projectsStr) : [];
      return projects.find((p) => p.id === projectId);
    }
    // Real Firebase Firestore would go here
  }
}

export default new FirebaseService();
