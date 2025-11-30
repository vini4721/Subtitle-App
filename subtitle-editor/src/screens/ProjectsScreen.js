import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import FirebaseService from "../services/FirebaseService";

const { width: screenWidth } = Dimensions.get("window");

const ProjectsScreen = ({ navigation }) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const userProjects = await FirebaseService.getProjects();
      setProjects(userProjects);
    } catch (error) {
      console.error("Error loading projects:", error);
      Alert.alert("Error", "Failed to load projects");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadProjects();
  };

  const handleOpenProject = async (project) => {
    try {
      navigation.navigate("SubtitleEditor", {
        videoUri: project.videoUri,
        subtitles: project.subtitles,
      });
    } catch (error) {
      Alert.alert("Error", "Failed to open project");
    }
  };

  const handleDeleteProject = (projectId) => {
    Alert.alert(
      "Delete Project",
      "Are you sure you want to delete this project?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await FirebaseService.deleteProject(projectId);
              loadProjects();
              Alert.alert("Success", "Project deleted");
            } catch (error) {
              Alert.alert("Error", "Failed to delete project");
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const renderProjectItem = ({ item }) => (
    <TouchableOpacity
      style={styles.projectCard}
      onPress={() => handleOpenProject(item)}
    >
      <View style={styles.projectHeader}>
        <Ionicons name="videocam" size={24} color="#4C1D95" />
        <View style={styles.projectInfo}>
          <Text style={styles.projectName}>{item.name}</Text>
          <Text style={styles.projectDate}>{formatDate(item.createdAt)}</Text>
        </View>
        <TouchableOpacity onPress={() => handleDeleteProject(item.id)}>
          <Ionicons name="trash-outline" size={24} color="#DC2626" />
        </TouchableOpacity>
      </View>

      <View style={styles.projectStats}>
        <View style={styles.stat}>
          <Ionicons name="text-outline" size={16} color="#6B7280" />
          <Text style={styles.statText}>
            {item.subtitles?.length || 0} subtitles
          </Text>
        </View>
        <View style={styles.stat}>
          <Ionicons name="time-outline" size={16} color="#6B7280" />
          <Text style={styles.statText}>
            Last updated: {formatDate(item.updatedAt || item.createdAt)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading projects...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Projects</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="add-circle" size={32} color="#4C1D95" />
        </TouchableOpacity>
      </View>

      {projects.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="folder-open-outline" size={64} color="#D1D5DB" />
          <Text style={styles.emptyTitle}>No Projects Yet</Text>
          <Text style={styles.emptyText}>
            Start by creating your first video project
          </Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.createButtonText}>Create Project</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={projects}
          renderItem={renderProjectItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1F2937",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    padding: 16,
  },
  projectCard: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  projectHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  projectInfo: {
    flex: 1,
    marginLeft: 12,
  },
  projectName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 4,
  },
  projectDate: {
    fontSize: 12,
    color: "#6B7280",
  },
  projectStats: {
    flexDirection: "row",
    gap: 16,
  },
  stat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: "#6B7280",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1F2937",
    marginTop: 16,
  },
  emptyText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 8,
    textAlign: "center",
  },
  createButton: {
    backgroundColor: "#4C1D95",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 24,
  },
  createButtonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProjectsScreen;
