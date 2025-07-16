import { StyleSheet } from "react-native"
export default StyleSheet.create({
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoImage: {
    width: 120,
    height: 120,
  },
  welcomeContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1A1D29",
    marginBottom: 10,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 22,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1A1D29",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    paddingHorizontal: 16,
    height: 56,
  },
  inputContainerFocused: {
    borderColor: "#4A90E2",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#1A1D29",
  },
  eyeIcon: {
    padding: 4,
  },
  forgotContainer: {
    alignItems: "flex-end",
    marginBottom: 30,
  },
  forgotButton: {
    padding: 4,
  },
  forgotText: {
    fontSize: 14,
    color: "#4A90E2",
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#4A90E2",
    borderRadius: 12,
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  loginButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 8,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    margin: 20,
    borderRadius: 20,
    padding: 25,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1A1D29",
    textAlign: "center",
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 22,
  },
  modalInput: {
    backgroundColor: "#F9FAFB",
    borderColor: "#E5E7EB",
    borderWidth: 1,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    marginBottom: 15,
  },
  // OTP Styles
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  otpBox: {
    width: 50,
    height: 50,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1D29",
    backgroundColor: "#FFFFFF",
  },
  otpBoxFocused: {
    borderColor: "#4A90E2",
  },
  resendButton: {
    alignItems: "center",
    marginBottom: 20,
  },
  resendText: {
    fontSize: 14,
    color: "#4A90E2",
    fontWeight: "500",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
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
  submitButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    backgroundColor: "#4A90E2",
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#9CA3AF",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});