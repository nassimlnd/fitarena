#!/usr/bin/env node

const BASE_URL = 'http://localhost:3333';
let authToken = '';
let gymOwnerToken = '';
let testIds = {};

// Helper function to make HTTP requests
async function makeRequest(method, path, data = null, token = null) {
  try {
    const options = {
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      }
    };

    if (data && method !== 'GET') {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(`${BASE_URL}/api${path}`, options);
    
    let responseData;
    try {
      responseData = await response.json();
    } catch (e) {
      responseData = await response.text();
    }

    return { status: response.status, data: responseData };
  } catch (error) {
    throw new Error(`Request failed: ${error.message}`);
  }
}

// Test functions
async function testAuth() {
  console.log('\n🔐 Testing Authentication...');
  
  // Register regular user
  console.log('  → Registering user...');
  const registerUser = await makeRequest('POST', '/register', {
    fullName: 'Test User',
    email: 'test@example.com',
    password: 'password123'
  });
  console.log(`    Status: ${registerUser.status}`);
  if (registerUser.status !== 201) {
    console.log(`    Error: ${JSON.stringify(registerUser.data)}`);
  }

  // Register gym owner
  console.log('  → Registering gym owner...');
  const registerGymOwner = await makeRequest('POST', '/register', {
    fullName: 'Gym Owner',
    email: 'gymowner@example.com',
    password: 'password123',
    role: 'gymOwner'
  });
  console.log(`    Status: ${registerGymOwner.status}`);

  // Login user
  console.log('  → Logging in user...');
  const loginUser = await makeRequest('POST', '/login', {
    email: 'test@example.com',
    password: 'password123'
  });
  console.log(`    Status: ${loginUser.status}`);
  if (loginUser.data.accessToken) {
    authToken = loginUser.data.accessToken;
    console.log('    ✅ User authenticated');
  }

  // Login gym owner
  console.log('  → Logging in gym owner...');
  const loginGymOwner = await makeRequest('POST', '/login', {
    email: 'gymowner@example.com',
    password: 'password123'
  });
  console.log(`    Status: ${loginGymOwner.status}`);
  if (loginGymOwner.data.accessToken) {
    gymOwnerToken = loginGymOwner.data.accessToken;
    console.log('    ✅ Gym owner authenticated');
  }
}

async function testGyms() {
  console.log('\n🏋️ Testing Gym Management...');
  
  // Create gym
  console.log('  → Creating gym...');
  const createGym = await makeRequest('POST', '/gym', {
    name: 'Test Gym',
    contact: 'contact@testgym.com',
    description: 'A test gym for testing purposes'
  }, gymOwnerToken);
  console.log(`    Status: ${createGym.status}`);
  if (createGym.data.id) {
    testIds.gymId = createGym.data.id;
    console.log('    ✅ Gym created');
  }

  // List gyms
  console.log('  → Listing gyms...');
  const listGyms = await makeRequest('GET', '/gyms');
  console.log(`    Status: ${listGyms.status} - Found ${listGyms.data.length || 0} gyms`);
}

async function testChallengeClients() {
  console.log('\n🎯 Testing User Challenges...');
  
  // Create challenge client
  console.log('  → Creating user challenge...');
  const createChallenge = await makeRequest('POST', '/challenge_clients', {
    name: 'Test Challenge',
    description: 'This is a test challenge for users',
    objectives: 'Complete 100 push-ups',
    recommendedExercises: 'Push-ups, planks',
    duration: 7,
    difficulty: 'medium',
    type: 'strength',
    isPublic: true
  }, authToken);
  console.log(`    Status: ${createChallenge.status}`);
  if (createChallenge.data.id) {
    testIds.challengeClientId = createChallenge.data.id;
    console.log('    ✅ User challenge created');
  }

  // List challenge clients
  console.log('  → Listing user challenges...');
  const listChallenges = await makeRequest('GET', '/challenge_clients');
  console.log(`    Status: ${listChallenges.status} - Found ${listChallenges.data.length || 0} challenges`);

  // Get specific challenge
  if (testIds.challengeClientId) {
    console.log('  → Getting specific challenge...');
    const getChallenge = await makeRequest('GET', `/challenge_clients/${testIds.challengeClientId}`);
    console.log(`    Status: ${getChallenge.status}`);
  }

  // Test filtering
  console.log('  → Testing challenge filtering...');
  const filterChallenges = await makeRequest('GET', '/challenge_clients?difficulty=medium&type=strength');
  console.log(`    Status: ${filterChallenges.status} - Filtered results: ${filterChallenges.data.length || 0}`);
}

async function testTrainingSessions() {
  console.log('\n📊 Testing Training Sessions...');
  
  if (!testIds.challengeClientId) {
    console.log('    ⚠️ Skipping - no challenge available');
    return;
  }

  // Create training session
  console.log('  → Creating training session...');
  const createSession = await makeRequest('POST', '/training_sessions', {
    challengeId: testIds.challengeClientId,
    date: new Date().toISOString().split('T')[0],
    duration: 30,
    caloriesBurned: 200,
    metrics: { pushups: 50, planks: 10 }
  }, authToken);
  console.log(`    Status: ${createSession.status}`);
  if (createSession.data.id) {
    testIds.sessionId = createSession.data.id;
    console.log('    ✅ Training session created');
  }

  // List training sessions
  console.log('  → Listing training sessions...');
  const listSessions = await makeRequest('GET', '/training_sessions', null, authToken);
  console.log(`    Status: ${listSessions.status} - Found ${listSessions.data.length || 0} sessions`);

  // Get training stats
  console.log('  → Getting training stats...');
  const getStats = await makeRequest('GET', '/training_stats', null, authToken);
  console.log(`    Status: ${getStats.status}`);
  if (getStats.data) {
    console.log(`    📈 Total sessions: ${getStats.data.total_sessions || 0}`);
    console.log(`    🔥 Total calories: ${getStats.data.total_calories || 0}`);
  }
}

async function testInvitations() {
  console.log('\n📩 Testing Challenge Invitations...');
  
  if (!testIds.challengeClientId) {
    console.log('    ⚠️ Skipping - no challenge available');
    return;
  }

  // Create challenge invitation (simulating inviting user ID 2)
  console.log('  → Creating challenge invitation...');
  const createInvitation = await makeRequest('POST', '/challenge_invitations', {
    inviteeId: 2,
    challengeId: testIds.challengeClientId
  }, authToken);
  console.log(`    Status: ${createInvitation.status}`);
  if (createInvitation.data.id) {
    testIds.invitationId = createInvitation.data.id;
    console.log('    ✅ Invitation created');
  }

  // List invitations
  console.log('  → Listing invitations...');
  const listInvitations = await makeRequest('GET', '/challenge_invitations', null, authToken);
  console.log(`    Status: ${listInvitations.status} - Found ${listInvitations.data.length || 0} invitations`);
}

async function testGroupChallenges() {
  console.log('\n👥 Testing Group Challenges...');
  
  if (!testIds.challengeClientId) {
    console.log('    ⚠️ Skipping - no challenge available');
    return;
  }

  // Create group challenge
  console.log('  → Creating group challenge...');
  const createGroup = await makeRequest('POST', '/group_challenges', {
    challengeId: testIds.challengeClientId,
    groupName: 'Test Fitness Group'
  }, authToken);
  console.log(`    Status: ${createGroup.status}`);
  if (createGroup.data.id) {
    testIds.groupId = createGroup.data.id;
    console.log('    ✅ Group challenge created');
  }

  // List group challenges
  console.log('  → Listing group challenges...');
  const listGroups = await makeRequest('GET', '/group_challenges', null, authToken);
  console.log(`    Status: ${listGroups.status} - Found ${listGroups.data.length || 0} groups`);
}

async function testLeaderboard() {
  console.log('\n🏆 Testing Leaderboard...');
  
  console.log('  → Getting leaderboard...');
  const getLeaderboard = await makeRequest('GET', `/leaderboard?challengeId=${testIds.challengeClientId}`);
  console.log(`    Status: ${getLeaderboard.status}`);
}

async function testAdminRoutes() {
  console.log('\n🔑 Testing Admin Routes (should fail without admin role)...');
  
  // Try to access admin exercises (should fail)
  console.log('  → Trying to access admin exercises...');
  const adminExercises = await makeRequest('GET', '/admin/exercises', null, authToken);
  console.log(`    Status: ${adminExercises.status} (Expected: 401)`);

  // Try to create exercise (should fail)
  console.log('  → Trying to create exercise...');
  const createExercise = await makeRequest('POST', '/admin/exercises', {
    name: 'Test Exercise',
    description: 'A test exercise',
    muscles: ['chest', 'arms']
  }, authToken);
  console.log(`    Status: ${createExercise.status} (Expected: 401)`);
}

async function testValidation() {
  console.log('\n✅ Testing Input Validation...');
  
  // Test invalid challenge creation
  console.log('  → Testing invalid challenge data...');
  const invalidChallenge = await makeRequest('POST', '/challenge_clients', {
    title: 'A', // Too short
    description: 'Short', // Too short
    duration: -1, // Invalid
    difficulty: 'invalid' // Invalid enum
  }, authToken);
  console.log(`    Status: ${invalidChallenge.status} (Expected: 422)`);

  // Test invalid gym creation
  console.log('  → Testing invalid gym data...');
  const invalidGym = await makeRequest('POST', '/gym', {
    name: 'A', // Too short
    contact: 'bad' // Too short
  }, gymOwnerToken);
  console.log(`    Status: ${invalidGym.status} (Expected: 422)`);
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting FitArena API Tests...');
  console.log('📡 Testing against: http://localhost:3333');
  
  try {
    await testAuth();
    await testGyms();
    await testChallengeClients();
    await testTrainingSessions();
    await testInvitations();
    await testGroupChallenges();
    await testLeaderboard();
    await testAdminRoutes();
    await testValidation();
    
    console.log('\n✅ All tests completed!');
    console.log('\n📋 Test Summary:');
    console.log(`  - Auth tokens: ${authToken ? '✅' : '❌'} User, ${gymOwnerToken ? '✅' : '❌'} Gym Owner`);
    console.log(`  - Test IDs created: ${Object.keys(testIds).length}`);
    console.log(`  - Gym ID: ${testIds.gymId || 'N/A'}`);
    console.log(`  - Challenge ID: ${testIds.challengeClientId || 'N/A'}`);
    console.log(`  - Session ID: ${testIds.sessionId || 'N/A'}`);
    console.log(`  - Group ID: ${testIds.groupId || 'N/A'}`);
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Check if server is running
async function checkServer() {
  console.log('🔍 Checking if server is running...');
  try {
    const response = await fetch(`${BASE_URL}/`);
    console.log(`Server response: ${response.status}`);
    if (response.status === 200) {
      console.log('✅ Server is running');
      return true;
    } else {
      console.log(`❌ Server responded with status: ${response.status}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Server is not running. Please start the server with: npm run dev');
    console.error('   Make sure the server is running on http://localhost:3333');
    console.error('   Error:', error.message);
    return false;
  }
}

// Run the tests
(async () => {
  console.log('🚀 Starting test script...');
  if (await checkServer()) {
    await runTests();
  } else {
    console.log('❌ Exiting due to server check failure');
  }
})();