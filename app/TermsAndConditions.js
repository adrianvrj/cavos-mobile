import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");
const scale = (size) => (width / 375) * size;
const verticalScale = (size) => (height / 812) * size;
const moderateScale = (size, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export default function TermsAndConditions() {
  const navigation = useNavigation();
  const [accepted, setAccepted] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleAccept = () => {
    if (accepted) {
      navigation.replace("Invitation");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Enhanced Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <View style={styles.backButtonInner}>
            <Icon name="arrow-back" size={22} color="#EAE5DC" />
          </View>
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.headerTitle}>Terms & Conditions</Text>
          <Text style={styles.headerSubtitle}>Please read carefully</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.contentContainer}>
          {/* Welcome section */}
          <View style={styles.welcomeSection}>
            <View style={styles.iconContainer}>
              <Icon name="document-text-outline" size={32} color="#EAE5DC" />
            </View>
            <Text style={styles.welcomeTitle}>Cavos Terms of Service</Text>
            <Text style={styles.lastUpdated}>
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </Text>
          </View>

          {/* Enhanced sections */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionNumber}>
                <Text style={styles.sectionNumberText}>1</Text>
              </View>
              <Text style={styles.sectionTitle}>Acceptance of Terms</Text>
            </View>
            <Text style={styles.sectionText}>
              By accessing and using the Cavos mobile application ("App"), you
              accept and agree to be bound by the terms and provision of this
              agreement. If you do not agree to abide by the above, please do
              not use this service.
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionNumber}>
                <Text style={styles.sectionNumberText}>2</Text>
              </View>
              <Text style={styles.sectionTitle}>Description of Service</Text>
            </View>
            <Text style={styles.sectionText}>
              Cavos is a mobile application that provides cryptocurrency wallet
              services, including but not limited to Bitcoin transactions,
              investment opportunities, and digital asset management. The App
              operates on the Starknet blockchain network.
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionNumber}>
                <Text style={styles.sectionNumberText}>3</Text>
              </View>
              <Text style={styles.sectionTitle}>User Responsibilities</Text>
            </View>
            <Text style={styles.sectionText}>
              You are responsible for maintaining the confidentiality of your
              account credentials, including your PIN and wallet information.
              You agree to accept responsibility for all activities that occur
              under your account.
            </Text>
          </View>

          <View style={[styles.section, styles.warningSection]}>
            <View style={styles.sectionHeader}>
              <View style={[styles.sectionNumber, styles.warningNumber]}>
                <Icon name="warning-outline" size={16} color="#FF6B6B" />
              </View>
              <Text style={[styles.sectionTitle, styles.warningTitle]}>
                Cryptocurrency Risks
              </Text>
            </View>
            <Text style={styles.sectionText}>
              Cryptocurrency investments carry significant risks, including but
              not limited to market volatility, regulatory changes, and
              potential loss of funds. You acknowledge that you understand these
              risks and that the value of your investments may fluctuate.
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionNumber}>
                <Text style={styles.sectionNumberText}>5</Text>
              </View>
              <Text style={styles.sectionTitle}>Security</Text>
            </View>
            <Text style={styles.sectionText}>
              While we implement security measures to protect your information
              and assets, no method of transmission over the internet or
              electronic storage is 100% secure. You are responsible for taking
              appropriate security precautions.
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionNumber}>
                <Text style={styles.sectionNumberText}>6</Text>
              </View>
              <Text style={styles.sectionTitle}>Prohibited Activities</Text>
            </View>
            <Text style={styles.sectionText}>
              You agree not to use the App for any unlawful purpose or to
              solicit others to perform unlawful acts. You may not use the App
              to transmit viruses, malware, or any other malicious code.
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionNumber}>
                <Text style={styles.sectionNumberText}>7</Text>
              </View>
              <Text style={styles.sectionTitle}>Privacy Policy</Text>
            </View>
            <Text style={styles.sectionText}>
              Your privacy is important to us. Please review our Privacy Policy,
              which also governs your use of the App, to understand our
              practices regarding the collection and use of your information.
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionNumber}>
                <Text style={styles.sectionNumberText}>8</Text>
              </View>
              <Text style={styles.sectionTitle}>Limitation of Liability</Text>
            </View>
            <Text style={styles.sectionText}>
              In no event shall Cavos, its directors, employees, partners,
              agents, suppliers, or affiliates be liable for any indirect,
              incidental, special, consequential, or punitive damages, including
              without limitation, loss of profits, data, use, goodwill, or other
              intangible losses.
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionNumber}>
                <Text style={styles.sectionNumberText}>9</Text>
              </View>
              <Text style={styles.sectionTitle}>Changes to Terms</Text>
            </View>
            <Text style={styles.sectionText}>
              We reserve the right to modify these terms at any time. We will
              notify users of any material changes by updating the "Last
              updated" date at the top of these terms. Your continued use of the
              App after such modifications constitutes acceptance of the updated
              terms.
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionNumber}>
                <Text style={styles.sectionNumberText}>10</Text>
              </View>
              <Text style={styles.sectionTitle}>Contact Information</Text>
            </View>
            <Text style={styles.sectionText}>
              If you have any questions about these Terms and Conditions, please
              contact us through the App or at our support channels.
            </Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionNumber}>
                <Text style={styles.sectionNumberText}>11</Text>
              </View>
              <Text style={styles.sectionTitle}>Governing Law</Text>
            </View>
            <Text style={styles.sectionText}>
              These terms shall be governed by and construed in accordance with
              the laws of the jurisdiction in which Cavos operates, without
              regard to its conflict of law provisions.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Enhanced bottom section */}
      <View style={styles.bottomContainer}>
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            onPress={() => setAccepted(!accepted)}
            style={[styles.checkbox, accepted && styles.checkboxAccepted]}
            activeOpacity={0.7}
          >
            {accepted && <Icon name="checkmark" size={16} color="#11110E" />}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setAccepted(!accepted)}
            style={styles.checkboxTextContainer}
            activeOpacity={0.7}
          >
            <Text style={styles.checkboxText}>
              I accept the Terms and Conditions
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.acceptButton, accepted && styles.acceptButtonEnabled]}
          disabled={!accepted}
          onPress={handleAccept}
          activeOpacity={accepted ? 0.8 : 1}
        >
          <Text
            style={[
              styles.acceptButtonText,
              accepted && styles.acceptButtonTextEnabled,
            ]}
          >
            Accept and Continue
          </Text>
          <Icon
            name="arrow-forward"
            size={18}
            color={accepted ? "#11110E" : "#666"}
            style={styles.acceptButtonIcon}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: moderateScale(20),
    paddingVertical: verticalScale(20),
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A27",
    backgroundColor: "#0A0A08",
  },
  backButton: {
    padding: moderateScale(4),
  },
  backButtonInner: {
    width: moderateScale(36),
    height: moderateScale(36),
    borderRadius: moderateScale(18),
    backgroundColor: "#1A1A17",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#2A2A27",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    color: "#EAE5DC",
    fontSize: moderateScale(20),
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  headerSubtitle: {
    color: "#888",
    fontSize: moderateScale(12),
    marginTop: verticalScale(2),
    fontWeight: "400",
  },
  placeholder: {
    width: moderateScale(36),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: moderateScale(20),
    paddingVertical: verticalScale(20),
    paddingBottom: verticalScale(20),
  },
  contentContainer: {
    flex: 1,
  },
  welcomeSection: {
    alignItems: "center",
    marginBottom: verticalScale(30),
    paddingVertical: verticalScale(20),
    backgroundColor: "#0F0F0C",
    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderColor: "#2A2A27",
  },
  iconContainer: {
    width: moderateScale(64),
    height: moderateScale(64),
    borderRadius: moderateScale(32),
    backgroundColor: "#1A1A17",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(16),
    borderWidth: 1,
    borderColor: "#2A2A27",
  },
  welcomeTitle: {
    color: "#EAE5DC",
    fontSize: moderateScale(24),
    fontWeight: "700",
    textAlign: "center",
    marginBottom: verticalScale(8),
    letterSpacing: 0.5,
  },
  lastUpdated: {
    color: "#888",
    fontSize: moderateScale(13),
    textAlign: "center",
    fontWeight: "400",
  },
  section: {
    marginBottom: verticalScale(20),
    backgroundColor: "#111110",
    borderRadius: moderateScale(16),
    borderWidth: 1,
    borderColor: "#2A2A27",
    padding: moderateScale(20),
  },
  warningSection: {
    borderColor: "#3A2A27",
    backgroundColor: "#1A1110",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(16),
  },
  sectionNumber: {
    width: moderateScale(28),
    height: moderateScale(28),
    borderRadius: moderateScale(14),
    backgroundColor: "#2A2A27",
    alignItems: "center",
    justifyContent: "center",
    marginRight: moderateScale(12),
    borderWidth: 1,
    borderColor: "#3A3A37",
  },
  warningNumber: {
    backgroundColor: "#2A1A1A",
    borderColor: "#3A2A27",
  },
  sectionNumberText: {
    color: "#EAE5DC",
    fontSize: moderateScale(14),
    fontWeight: "600",
  },
  sectionTitle: {
    color: "#EAE5DC",
    fontSize: moderateScale(18),
    fontWeight: "600",
    letterSpacing: 0.3,
    flex: 1,
  },
  warningTitle: {
    color: "#FFB3B3",
  },
  sectionText: {
    color: "#CCCCCC",
    fontSize: moderateScale(15),
    lineHeight: moderateScale(24),
    textAlign: "justify",
    fontWeight: "400",
  },
  bottomContainer: {
    backgroundColor: "#0A0A08",
    paddingHorizontal: moderateScale(20),
    paddingVertical: verticalScale(20),
    borderTopWidth: 1,
    borderTopColor: "#2A2A27",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(20),
  },
  checkbox: {
    width: moderateScale(24),
    height: moderateScale(24),
    borderWidth: 2,
    borderColor: "#2A2A27",
    backgroundColor: "transparent",
    borderRadius: moderateScale(6),
    alignItems: "center",
    justifyContent: "center",
    marginRight: moderateScale(12),
  },
  checkboxAccepted: {
    backgroundColor: "#EAE5DC",
    borderColor: "#EAE5DC",
  },
  checkboxTextContainer: {
    flex: 1,
  },
  checkboxText: {
    color: "#EAE5DC",
    fontSize: moderateScale(16),
    fontWeight: "500",
  },
  acceptButton: {
    backgroundColor: "#1A1A17",
    paddingVertical: verticalScale(16),
    paddingHorizontal: moderateScale(24),
    borderRadius: moderateScale(12),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#2A2A27",
  },
  acceptButtonEnabled: {
    backgroundColor: "#EAE5DC",
    borderColor: "#EAE5DC",
  },
  acceptButtonText: {
    color: "#666",
    fontWeight: "600",
    fontSize: moderateScale(17),
    letterSpacing: 0.3,
  },
  acceptButtonTextEnabled: {
    color: "#11110E",
  },
  acceptButtonIcon: {
    marginLeft: moderateScale(8),
  },
});
