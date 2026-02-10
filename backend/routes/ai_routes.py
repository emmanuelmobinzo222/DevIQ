from fastapi import APIRouter, HTTPException, Depends
from models import ChatRequest, ChatResponse
from dependencies import get_current_user, check_subscription_limits
from datetime import datetime
import uuid
import os

router = APIRouter(prefix="/ai", tags=["ai"])

async def get_db():
    from server import db
    return db

@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest, authorization: str = Depends(lambda: None)):
    user = await get_current_user(authorization)
    check_subscription_limits(user, 'use_ai')
    db = await get_db()
    
    # Get project context
    project = await db.projects.find_one({"_id": request.projectId, "userId": user["_id"]})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Get conversation history
    conversation = await db.conversations.find_one({"projectId": request.projectId})
    if not conversation:
        conversation_id = str(uuid.uuid4())
        conversation = {
            "_id": conversation_id,
            "projectId": request.projectId,
            "userId": user["_id"],
            "messages": [],
            "createdAt": datetime.utcnow()
        }
        await db.conversations.insert_one(conversation)
    
    # Add user message
    user_message = {
        "role": "user",
        "content": request.message,
        "timestamp": datetime.utcnow()
    }
    
    # Generate AI response (mock implementation - integrate with OpenAI/Anthropic in production)
    ai_response = generate_ai_response(request.message, project, conversation.get("messages", []))
    
    assistant_message = {
        "role": "assistant",
        "content": ai_response["message"],
        "timestamp": datetime.utcnow()
    }
    
    # Update conversation
    await db.conversations.update_one(
        {"_id": conversation["_id"]},
        {"$push": {"messages": {"$each": [user_message, assistant_message]}}}
    )
    
    # Update project code if generated
    if ai_response.get("code"):
        await db.projects.update_one(
            {"_id": request.projectId},
            {"$set": {"code": ai_response["code"], "updatedAt": datetime.utcnow()}}
        )
    
    # Deduct AI credits
    await db.users.update_one(
        {"_id": user["_id"]},
        {"$inc": {"aiCredits": -1}}
    )
    
    return ChatResponse(
        message=ai_response["message"],
        code=ai_response.get("code"),
        suggestions=ai_response.get("suggestions")
    )

@router.get("/conversation/{project_id}")
async def get_conversation(project_id: str, authorization: str = Depends(lambda: None)):
    user = await get_current_user(authorization)
    db = await get_db()
    
    conversation = await db.conversations.find_one({"projectId": project_id, "userId": user["_id"]})
    if not conversation:
        return {"messages": []}
    
    return {"messages": conversation.get("messages", [])}

def generate_ai_response(message: str, project: dict, history: list) -> dict:
    """
    Mock AI response generator
    In production, integrate with:
    - OpenAI GPT-4
    - Anthropic Claude
    - Or other LLM providers
    """
    
    message_lower = message.lower()
    
    # App creation patterns
    if any(word in message_lower for word in ['create', 'build', 'make', 'new app']):
        if 'login' in message_lower or 'auth' in message_lower:
            return {
                "message": "I'll help you create a login screen. I'm generating the authentication flow with email/password login, social login options, and forgot password functionality.",
                "code": {
                    "screens": {
                        "LoginScreen.js": generate_login_screen_code(project.get('platform'))
                    },
                    "components": {
                        "AuthButton.js": generate_auth_button_code()
                    }
                },
                "suggestions": [
                    "Add biometric authentication",
                    "Implement social login (Google, Facebook)",
                    "Add email verification"
                ]
            }
        elif 'dashboard' in message_lower or 'home' in message_lower:
            return {
                "message": "Creating a beautiful dashboard with navigation, stats cards, and quick actions. The layout is responsive and follows modern design patterns.",
                "code": {
                    "screens": {
                        "DashboardScreen.js": generate_dashboard_code(project.get('platform'))
                    }
                },
                "suggestions": [
                    "Add charts and analytics",
                    "Implement real-time updates",
                    "Add customizable widgets"
                ]
            }
    
    # Styling and UI
    elif any(word in message_lower for word in ['style', 'color', 'theme', 'design']):
        return {
            "message": "I can help you customize the app's appearance. What would you like to change? Colors, fonts, spacing, or the overall theme?",
            "suggestions": [
                "Apply dark mode",
                "Change primary color scheme",
                "Customize fonts and typography",
                "Add animations"
            ]
        }
    
    # Features
    elif 'feature' in message_lower or 'functionality' in message_lower:
        return {
            "message": "I can add various features to your app. Some popular options include: user authentication, data storage, push notifications, in-app purchases, real-time chat, or API integration. What would you like to add?",
            "suggestions": [
                "Add push notifications",
                "Implement data persistence",
                "Add image upload",
                "Integrate payment gateway"
            ]
        }
    
    # Export/Build
    elif 'export' in message_lower or 'download' in message_lower or 'build' in message_lower:
        return {
            "message": "Your app is ready for export! I can generate production-ready code for both iOS and Android. The export will include all source files, assets, and build configurations.",
            "suggestions": [
                "Export for iOS",
                "Export for Android",
                "Export both platforms",
                "Generate APK/IPA files"
            ]
        }
    
    # Default helpful response
    else:
        return {
            "message": f"I understand you want to work on your {project.get('appType', 'app')}. I can help you with:\n\n1. Creating new screens and components\n2. Styling and theming\n3. Adding features and functionality\n4. Debugging and optimization\n5. Exporting your app\n\nWhat would you like to do next?",
            "suggestions": [
                "Create a new screen",
                "Add authentication",
                "Customize the theme",
                "Export the app"
            ]
        }

def generate_login_screen_code(platform: str) -> str:
    return '''import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Implement login logic
    console.log('Login:', email, password);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
      
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.link}>Don't have an account? Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1a4d8f',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 20,
    textAlign: 'center',
    color: '#1a4d8f',
    fontSize: 16,
  },
});'''

def generate_auth_button_code() -> str:
    return '''import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

export default function AuthButton({ title, onPress, variant = 'primary' }) {
  return (
    <TouchableOpacity 
      style={[styles.button, variant === 'secondary' && styles.buttonSecondary]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, variant === 'secondary' && styles.buttonTextSecondary]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#1a4d8f',
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#1a4d8f',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttonTextSecondary: {
    color: '#1a4d8f',
  },
});'''

def generate_dashboard_code(platform: str) -> str:
    return '''import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function DashboardScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Welcome back!</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>24</Text>
          <Text style={styles.statLabel}>Total Items</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Active</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>Create New</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionText}>View All</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#1a4d8f',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a4d8f',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  actionButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  actionText: {
    fontSize: 16,
    color: '#1a4d8f',
    fontWeight: '600',
  },
});'''
