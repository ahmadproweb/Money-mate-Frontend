import { StyleSheet } from "react-native"

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFBFC",
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#6B46C1",
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: "#E3F2FD",
  },
  section: {
    backgroundColor: "#FFFFFF",
    margin: 20,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1D29",
    padding: 20,
    paddingBottom: 10,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1A1D29",
  },
  settingSubtitle: {
    fontSize: 14,
    color: "#6B7280",
  },
  arrowText: {
    fontSize: 20,
    color: "#9CA3AF",
    fontWeight: "300",
  },
  dangerSection: {
    margin: 20,
    marginTop: 0,
  },
  logoutButton: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#EF4444",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  logoutText: {
    color: "#EF4444",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    padding: 20,
    paddingBottom: 100,
  },
  footerText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 5,
  },
  footerSubtext: {
    fontSize: 12,
    color: "#9CA3AF",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    margin: 20,
    borderRadius: 20,
    padding: 25,
    width: "90%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1A1D29",
    marginBottom: 15,
  },
  modalInput: {
    backgroundColor: "#F9FAFB",
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
    width: "100%",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#6B7280",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#4A90E2",
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  passwordInputContainer: {
  flexDirection: "row",
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#D1D5DB",
  borderRadius: 10,
  paddingHorizontal: 12,
  paddingVertical: 10,
  marginBottom: 15,
},

passwordInput: {
  flex: 1,
  fontSize: 16,
  color: "#111827",
},
  devContainer: {
    alignItems: 'center',
  },

  devText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 15,
  },

  iconRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 14,
  },

  icon: {
    marginHorizontal: 6,
  },
})