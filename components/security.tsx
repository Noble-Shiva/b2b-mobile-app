import React, { useState } from 'react';
import { Modal, TouchableOpacity, ScrollView, View, StyleSheet, Dimensions, Platform } from 'react-native';
import { X } from 'lucide-react-native';
import { Text, Button } from '@/components/ui';
import { useSelector } from 'react-redux';
import { selectIsDark } from '@/store/themeSlice';
import { commonStyles, getTheme } from '@/utils/theme';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Content constants
const TERMS_CONTENT = `Last updated: ${new Date().toLocaleDateString()}

1. Acceptance of Terms
By accessing and using Srotas platform, you accept and agree to be bound by the terms and provision of this agreement.

2. Business Account
- This platform is exclusively for registered businesses
- All information provided must be accurate and up-to-date
- You are responsible for maintaining account confidentiality

3. Product Information
- All products listed are for wholesale/retail purposes
- Minimum order quantities (MOQ) apply to all products
- Prices are subject to change without notice

4. Orders and Payment
- All orders are subject to product availability
- Payment terms are Net 30 days unless otherwise specified
- Late payments may incur additional charges

5. Delivery and Shipping
- Delivery times are estimates and not guaranteed
- Risk of loss passes to buyer upon delivery
- Damaged goods must be reported within 24 hours

6. Returns and Refunds
- Returns accepted within 30 days of delivery
- Products must be in original condition
- Return shipping costs borne by buyer unless product defect

7. Intellectual Property
- All content on this platform is proprietary
- Unauthorized use or reproduction is prohibited
- Trademarks and logos are property of respective owners

8. Limitation of Liability
- AyurCentral is not liable for indirect damages
- Maximum liability limited to order value
- Force majeure events exclude liability

9. Termination
- Either party may terminate with 30 days notice
- Immediate termination for breach of terms
- Outstanding obligations survive termination

10. Governing Law
These terms are governed by the laws of India and subject to jurisdiction of Mumbai courts.

For questions regarding these terms, please contact our legal team at legal@ayurcentral.com`;

const PRIVACY_POLICY_CONTENT = `Last updated: ${new Date().toLocaleDateString()}

1. Information We Collect
We collect information you provide directly to us, such as:
- Business registration details
- Contact information
- Order and transaction history
- Payment information
- Communication preferences

2. How We Use Your Information
- Process and fulfill your orders
- Provide customer support
- Send business communications
- Improve our services
- Comply with legal obligations

3. Information Sharing
We may share your information with:
- Service providers and vendors
- Payment processors
- Shipping companies
- Legal authorities when required

4. Data Security
- We implement industry-standard security measures
- Data is encrypted during transmission
- Access is restricted to authorized personnel
- Regular security audits are conducted

5. Your Rights
You have the right to:
- Access your personal information
- Correct inaccurate data
- Delete your account
- Opt-out of marketing communications
- Data portability

6. Cookies and Tracking
- We use cookies to improve user experience
- Third-party analytics tools may be used
- You can control cookie preferences in your browser

7. Data Retention
- Account data retained while account is active
- Transaction records kept for legal compliance
- Marketing data removed upon opt-out

8. International Transfers
- Data may be transferred outside India
- Appropriate safeguards are in place
- EU users have additional protections under GDPR

9. Children's Privacy
This platform is not intended for users under 18 years of age.

10. Updates to Policy
We may update this policy from time to time. Continued use constitutes acceptance of changes.

Contact Information:
For privacy inquiries: privacy@ayurcentral.com
Data Protection Officer: dpo@ayurcentral.com`;

const HELP_CENTER_CONTENT = `Welcome to Srotas Help Center! Here you'll find answers to common questions and guidance on using our platform.

Getting Started
Q: How do I place my first order?
A: Browse our catalog, add items to cart, and proceed to checkout. Make sure your business registration is complete.

Q: What are the minimum order quantities?
A: MOQ varies by product and is displayed on each product page. Contact our sales team for bulk pricing.

Q: How do I track my order?
A: Use the order tracking feature in your account or contact customer support with your order number.

Account Management
Q: How do I update my business information?
A: Go to Profile > Edit Profile to update your business details and contact information.

Q: Can I have multiple users on one account?
A: Yes, contact our support team to set up additional user accounts for your business.

Payment & Billing
Q: What payment methods do you accept?
A: We accept bank transfers, cheques, and approved credit terms for verified businesses.

Q: How do I set up credit terms?
A: Contact our sales team with your business documentation to apply for credit terms.

Shipping & Delivery
Q: What are your delivery areas?
A: We deliver pan-India. Delivery times vary by location and product availability.

Q: How are shipping costs calculated?
A: Shipping costs are based on weight, volume, and destination. Free shipping available on orders above ₹5,000.

Returns & Refunds
Q: What is your return policy?
A: Returns accepted within 30 days for unopened products in original packaging.

Q: How do I initiate a return?
A: Contact customer support or use the return request feature in your order history.

Technical Support
Q: I'm having trouble with the website/app?
A: Clear your browser cache or update the app. If issues persist, contact technical support.

Contact Information:
Customer Support: support@ayurcentral.com
Phone: 1800-XXX-XXXX (Mon-Sat, 9 AM - 6 PM)
WhatsApp: +91-XXXXX-XXXXX`;

const ABOUT_US_CONTENT = `About AyurCentral

Our Story
AyurCentral was founded with a vision to bridge the gap between traditional Ayurvedic wisdom and modern business needs. We are India's leading B2B marketplace for authentic Ayurvedic and herbal products.

Our Mission
To empower businesses with access to high-quality Ayurvedic products while supporting traditional manufacturers and promoting holistic wellness across communities.

What We Offer
- Extensive catalog of certified Ayurvedic products
- Direct sourcing from verified manufacturers
- Competitive wholesale pricing
- Reliable supply chain and logistics
- Quality assurance and compliance support

Our Network
- 500+ verified suppliers and manufacturers
- 10,000+ SKUs across various categories
- Serving 5,000+ businesses nationwide
- ISO certified quality standards

Key Categories
- Ayurvedic Medicines & Formulations
- Herbal Supplements & Nutraceuticals
- Personal Care & Cosmetics
- Food & Beverages
- Raw Materials & Ingredients

Quality Commitment
All our products undergo rigorous quality checks and comply with:
- AYUSH Ministry guidelines
- WHO-GMP standards
- FSSAI regulations
- ISO quality certifications

Our Values
- Authenticity: Only genuine Ayurvedic products
- Transparency: Clear product information and pricing
- Reliability: Consistent quality and timely delivery
- Innovation: Modern solutions for traditional products
- Sustainability: Supporting eco-friendly practices

Leadership Team
Our experienced leadership combines deep industry knowledge with modern business expertise to drive innovation in the Ayurvedic marketplace.

Certifications & Compliance
- AYUSH Licensed
- ISO 9001:2015 Certified
- FSSAI Approved
- GMP Compliant

Contact Information:
Head Office: Mumbai, Maharashtra
Email: info@ayurcentral.com
Phone: +91-XXXX-XXXXXX
Website: www.ayurcentral.com

Connect With Us:
LinkedIn: AyurCentral
Twitter: @AyurCentral
Instagram: @ayurcentral_official`;

export type SecurityModalType = 'terms' | 'privacy' | 'help' | 'about' | null;

interface SecurityModalProps {
  children: (openModal: (type: SecurityModalType) => void) => React.ReactNode;
}

export default function SecurityModal({ children }: SecurityModalProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<SecurityModalType>(null);
  const isDark = useSelector(selectIsDark);
  const theme = getTheme(isDark);

  const openModal = (type: SecurityModalType) => {
    setModalType(type);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalType(null);
  };

  const getModalContent = () => {
    switch (modalType) {
      case 'terms':
        return {
          title: 'Terms and Conditions',
          content: TERMS_CONTENT
        };
      case 'privacy':
        return {
          title: 'Privacy Policy',
          content: PRIVACY_POLICY_CONTENT
        };
      case 'help':
        return {
          title: 'Help Center',
          content: HELP_CENTER_CONTENT
        };
      case 'about':
        return {
          title: 'About Us',
          content: ABOUT_US_CONTENT
        };
      default:
        return { title: '', content: '' };
    }
  };

  const modalContent = getModalContent();

  return (
    <>
      {children(openModal)}
      
      {/* Modal for all security content */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: theme.background.secondary }]}>
            <View style={[styles.modalHeader, { borderBottomColor: theme.border.light }]}>
              <Text variant="h3" weight="semibold" style={styles.modalTitle}>
                {modalContent.title}
              </Text>
              <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
                <X size={24} color={theme.icon.primary} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={true}>
              <Text variant="body-sm" style={styles.modalText}>
                {modalContent.content}
              </Text>
            </ScrollView>
            <View style={[styles.modalFooter, { borderTopColor: theme.border.light }]}>
              <Button
                variant="primary"
                onPress={closeModal}
                style={styles.closeModalButton}
              >
                Close
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 50 : 25, // Account for status bar
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    fontFamily: commonStyles.typography.fontFamily.medium,
  },
  modalTitle: {
    flex: 1,
    fontFamily: commonStyles.typography.fontFamily.medium,
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    padding: 16,
  },
  modalText: {
    lineHeight: 22,
    fontFamily: commonStyles.typography.fontFamily.medium,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    fontFamily: commonStyles.typography.fontFamily.medium,
  },
  closeModalButton: {
    width: '100%',
  },
}); 