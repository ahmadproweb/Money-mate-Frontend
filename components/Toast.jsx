import { useState, useEffect } from "react"
import { View, Text, Animated, Dimensions } from "react-native"
import { Ionicons } from "@expo/vector-icons"

const { width } = Dimensions.get("window")

export const Toast = ({ visible, message, type = "success", duration = 3000, onHide }) => {
  const [fadeAnim] = useState(new Animated.Value(0))
  const [slideAnim] = useState(new Animated.Value(-100))

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()

      // Auto hide after duration
      const timer = setTimeout(() => {
        hideToast()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [visible])

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide && onHide()
    })
  }

  const getToastStyle = () => {
    switch (type) {
      case "success":
        return {
          backgroundColor: "#10B981",
          borderColor: "#059669",
        }
      case "error":
        return {
          backgroundColor: "#EF4444",
          borderColor: "#DC2626",
        }
      case "warning":
        return {
          backgroundColor: "#F59E0B",
          borderColor: "#D97706",
        }
      case "info":
        return {
          backgroundColor: "#3B82F6",
          borderColor: "#2563EB",
        }
      default:
        return {
          backgroundColor: "#10B981",
          borderColor: "#059669",
        }
    }
  }

  const getIcon = () => {
    switch (type) {
      case "success":
        return "checkmark-circle"
      case "error":
        return "close-circle"
      case "warning":
        return "warning"
      case "info":
        return "information-circle"
      default:
        return "checkmark-circle"
    }
  }

  if (!visible) return null

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        getToastStyle(),
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <View style={styles.toastContent}>
        <Ionicons name={getIcon()} size={24} color="#FFFFFF" style={styles.toastIcon} />
        <Text style={styles.toastText}>{message}</Text>
      </View>
    </Animated.View>
  )
}

const styles = {
  toastContainer: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 9999,
  },
  toastContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  toastIcon: {
    marginRight: 12,
  },
  toastText: {
    flex: 1,
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFF",
  },
}
