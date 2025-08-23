import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, useColorScheme, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Globe, Github, Check, CircleAlert as AlertCircle } from 'lucide-react-native';

export default function DeployScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  
  const [siteName, setSiteName] = useState('quickmart-app');
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStatus, setDeploymentStatus] = useState<'idle' | 'deploying' | 'success' | 'error'>('idle');
  const [deployUrl, setDeployUrl] = useState('');
  
  const handleDeploy = async () => {
    if (!siteName.trim()) {
      Alert.alert('Error', 'Please enter a site name');
      return;
    }
    
    try {
      setIsDeploying(true);
      setDeploymentStatus('deploying');
      
      // In a real app, this would be an API call to deploy the app
      // For demo purposes, we'll simulate a successful deployment after a delay
      setTimeout(() => {
        setDeploymentStatus('success');
        setDeployUrl(`https://${siteName.toLowerCase().replace(/\s+/g, '-')}.netlify.app`);
        setIsDeploying(false);
      }, 3000);
    } catch (error) {
      console.error('Deployment error:', error);
      setDeploymentStatus('error');
      setIsDeploying(false);
      Alert.alert('Deployment Failed', 'There was an error deploying your app. Please try again.');
    }
  };

  return (
    <View style={[styles.container, isDark && styles.containerDark]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      
      <View style={[styles.header, isDark && styles.headerDark]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={isDark ? '#FFFFFF' : '#333333'} />
        </TouchableOpacity>
        <Text style={[styles.title, isDark && styles.titleDark]}>Deploy App</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={[styles.card, isDark && styles.cardDark]}>
          <View style={styles.cardHeader}>
            <Globe size={24} color="#FF4500" />
            <Text style={[styles.cardTitle, isDark && styles.cardTitleDark]}>
              Deploy to Netlify
            </Text>
          </View>
          
          <Text style={[styles.description, isDark && styles.descriptionDark]}>
            Deploy your QuickMart app to Netlify to make it accessible online. Your app will be built and deployed with a public URL.
          </Text>
          
          <View style={styles.inputContainer}>
            <Text style={[styles.label, isDark && styles.labelDark]}>Site Name</Text>
            <TextInput
              style={[styles.input, isDark && styles.inputDark]}
              placeholder="Enter site name"
              placeholderTextColor={isDark ? '#888888' : '#999999'}
              value={siteName}
              onChangeText={setSiteName}
              editable={!isDeploying}
            />
            <Text style={[styles.helperText, isDark && styles.helperTextDark]}>
              Your site will be available at https://{siteName.toLowerCase().replace(/\s+/g, '-')}.netlify.app
            </Text>
          </View>
          
          {deploymentStatus === 'success' && (
            <View style={styles.successContainer}>
              <View style={styles.successIconContainer}>
                <Check size={24} color="#FFFFFF" />
              </View>
              <Text style={[styles.successTitle, isDark && styles.successTitleDark]}>
                Deployment Successful!
              </Text>
              <Text style={[styles.successText, isDark && styles.successTextDark]}>
                Your app is now live at:
              </Text>
              <TouchableOpacity 
                style={styles.urlContainer}
                onPress={() => {
                  // In a real app, this would open the URL in a browser
                  Alert.alert('Open URL', `Opening ${deployUrl}`);
                }}
              >
                <Text style={styles.url}>{deployUrl}</Text>
                <Globe size={16} color="#FF4500" />
              </TouchableOpacity>
            </View>
          )}
          
          {deploymentStatus === 'error' && (
            <View style={styles.errorContainer}>
              <View style={styles.errorIconContainer}>
                <AlertCircle size={24} color="#FFFFFF" />
              </View>
              <Text style={[styles.errorTitle, isDark && styles.errorTitleDark]}>
                Deployment Failed
              </Text>
              <Text style={[styles.errorText, isDark && styles.errorTextDark]}>
                There was an error deploying your app. Please check your connection and try again.
              </Text>
            </View>
          )}
          
          <TouchableOpacity
            style={[
              styles.deployButton,
              isDeploying && styles.deployButtonDisabled
            ]}
            onPress={handleDeploy}
            disabled={isDeploying || deploymentStatus === 'success'}
          >
            {deploymentStatus === 'deploying' ? (
              <Text style={styles.deployButtonText}>Deploying...</Text>
            ) : deploymentStatus === 'success' ? (
              <Text style={styles.deployButtonText}>Deployed Successfully</Text>
            ) : (
              <Text style={styles.deployButtonText}>Deploy to Netlify</Text>
            )}
          </TouchableOpacity>
        </View>
        
        <View style={[styles.card, isDark && styles.cardDark]}>
          <View style={styles.cardHeader}>
            <Github size={24} color="#FF4500" />
            <Text style={[styles.cardTitle, isDark && styles.cardTitleDark]}>
              Connect to GitHub
            </Text>
          </View>
          
          <Text style={[styles.description, isDark && styles.descriptionDark]}>
            Connect your app to a GitHub repository for continuous deployment. Any changes pushed to your repository will automatically be deployed.
          </Text>
          
          <TouchableOpacity
            style={styles.githubButton}
            onPress={() => {
              // In a real app, this would initiate GitHub OAuth flow
              Alert.alert('GitHub Integration', 'This would connect to GitHub in a real app.');
            }}
          >
            <Github size={20} color="#FFFFFF" />
            <Text style={styles.githubButtonText}>Connect to GitHub</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
  },
  containerDark: {
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  headerDark: {
    backgroundColor: '#1E1E1E',
    borderBottomColor: '#333333',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: '#333333',
  },
  titleDark: {
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardDark: {
    backgroundColor: '#1E1E1E',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333333',
    marginLeft: 12,
  },
  cardTitleDark: {
    color: '#FFFFFF',
  },
  description: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    marginBottom: 16,
    lineHeight: 20,
  },
  descriptionDark: {
    color: '#BBBBBB',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#333333',
    marginBottom: 8,
  },
  labelDark: {
    color: '#FFFFFF',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#333333',
    backgroundColor: '#F9F9F9',
  },
  inputDark: {
    borderColor: '#444444',
    backgroundColor: '#2A2A2A',
    color: '#FFFFFF',
  },
  helperText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    marginTop: 4,
  },
  helperTextDark: {
    color: '#BBBBBB',
  },
  deployButton: {
    height: 48,
    backgroundColor: '#FF4500',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deployButtonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  deployButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
  },
  githubButton: {
    height: 48,
    backgroundColor: '#333333',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  githubButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    marginLeft: 8,
  },
  successContainer: {
    alignItems: 'center',
    marginVertical: 16,
    padding: 16,
    backgroundColor: '#F0FFF4',
    borderRadius: 8,
  },
  successIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  successTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333333',
    marginBottom: 8,
  },
  successTitleDark: {
    color: '#FFFFFF',
  },
  successText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    marginBottom: 8,
  },
  successTextDark: {
    color: '#BBBBBB',
  },
  urlContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  url: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: '#FF4500',
    marginRight: 8,
  },
  errorContainer: {
    alignItems: 'center',
    marginVertical: 16,
    padding: 16,
    backgroundColor: '#FFF5F5',
    borderRadius: 8,
  },
  errorIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F44336',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  errorTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: '#333333',
    marginBottom: 8,
  },
  errorTitleDark: {
    color: '#FFFFFF',
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#666666',
    textAlign: 'center',
  },
  errorTextDark: {
    color: '#BBBBBB',
  },
});