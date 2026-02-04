/**
 * Test Script for Shift Assignment APIs
 * Tests all endpoints and business rules
 */

const API_BASE = 'http://localhost:3000/api/v1';

// Test user credentials (you may need to update these)
const TEST_ADMIN_TOKEN = process.env.ADMIN_TOKEN || '';
const TEST_USER_TOKEN = process.env.USER_TOKEN || '';

// Test data
let createdAssignmentId = null;
let testUserId = null;
let testShiftId = null;

/**
 * Helper function to make API calls
 */
async function apiCall(method, endpoint, body = null, token = TEST_ADMIN_TOKEN) {
    const headers = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
        method,
        headers,
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        const data = await response.json();
        return { status: response.status, data };
    } catch (error) {
        console.error('API Call Error:', error);
        return { status: 500, data: { error: error.message } };
    }
}

/**
 * Test 1: Create Shift Assignment
 */
async function testCreateShiftAssignment() {
    console.log('\n=== Test 1: Create Shift Assignment ===');

    const requestBody = {
        userId: testUserId,
        shiftId: testShiftId,
        date: '2026-02-10'
    };

    const result = await apiCall('POST', '/shift-assignments', requestBody);

    if (result.status === 201) {
        console.log('✅ PASS: Shift assignment created successfully');
        createdAssignmentId = result.data.data.id;
        console.log('Created Assignment ID:', createdAssignmentId);
    } else {
        console.log('❌ FAIL: Expected 201, got', result.status);
        console.log('Response:', result.data);
    }
}

/**
 * Test 2: Create Duplicate Assignment (should fail)
 */
async function testDuplicateAssignment() {
    console.log('\n=== Test 2: Duplicate Assignment Prevention ===');

    const requestBody = {
        userId: testUserId,
        shiftId: testShiftId,
        date: '2026-02-10'
    };

    const result = await apiCall('POST', '/shift-assignments', requestBody);

    if (result.status === 409) {
        console.log('✅ PASS: Duplicate assignment correctly rejected');
    } else {
        console.log('❌ FAIL: Expected 409, got', result.status);
        console.log('Response:', result.data);
    }
}

/**
 * Test 3: Get Shift Assignments (Admin)
 */
async function testGetShiftAssignments() {
    console.log('\n=== Test 3: Get Shift Assignments ===');

    const result = await apiCall('GET', '/shift-assignments?status=PENDING');

    if (result.status === 200) {
        console.log('✅ PASS: Fetched shift assignments successfully');
        console.log(`Found ${result.data.data.length} pending assignments`);
    } else {
        console.log('❌ FAIL: Expected 200, got', result.status);
        console.log('Response:', result.data);
    }
}

/**
 * Test 4: Get Assignments by Date
 */
async function testGetAssignmentsByDate() {
    console.log('\n=== Test 4: Get Assignments by Date ===');

    const result = await apiCall('GET', '/shift-assignments?date=2026-02-10');

    if (result.status === 200) {
        console.log('✅ PASS: Fetched assignments by date successfully');
        console.log(`Found ${result.data.data.length} assignments for date`);
    } else {
        console.log('❌ FAIL: Expected 200, got', result.status);
        console.log('Response:', result.data);
    }
}

/**
 * Test 5: Approve Shift Assignment
 */
async function testApproveAssignment() {
    console.log('\n=== Test 5: Approve Shift Assignment ===');

    if (!createdAssignmentId) {
        console.log('⚠️  SKIP: No assignment ID available');
        return;
    }

    const result = await apiCall('POST', `/shift-assignments/${createdAssignmentId}/approve`);

    if (result.status === 200) {
        console.log('✅ PASS: Assignment approved successfully');
        console.log('Status:', result.data.data.status);
    } else {
        console.log('❌ FAIL: Expected 200, got', result.status);
        console.log('Response:', result.data);
    }
}

/**
 * Test 6: Try to Approve Again (should fail)
 */
async function testDoubleApproval() {
    console.log('\n=== Test 6: Prevent Double Approval ===');

    if (!createdAssignmentId) {
        console.log('⚠️  SKIP: No assignment ID available');
        return;
    }

    const result = await apiCall('POST', `/shift-assignments/${createdAssignmentId}/approve`);

    if (result.status === 400) {
        console.log('✅ PASS: Double approval correctly prevented');
    } else {
        console.log('❌ FAIL: Expected 400, got', result.status);
        console.log('Response:', result.data);
    }
}

/**
 * Test 7: Create Another Assignment for Rejection Test
 */
async function testCreateForRejection() {
    console.log('\n=== Test 7: Create Assignment for Rejection ===');

    const requestBody = {
        userId: testUserId,
        shiftId: testShiftId,
        date: '2026-02-11'
    };

    const result = await apiCall('POST', '/shift-assignments', requestBody);

    if (result.status === 201) {
        console.log('✅ PASS: Second assignment created');
        return result.data.data.id;
    } else {
        console.log('❌ FAIL: Expected 201, got', result.status);
        return null;
    }
}

/**
 * Test 8: Reject Shift Assignment
 */
async function testRejectAssignment(assignmentId) {
    console.log('\n=== Test 8: Reject Shift Assignment ===');

    if (!assignmentId) {
        console.log('⚠️  SKIP: No assignment ID available');
        return;
    }

    const requestBody = {
        reason: 'Invalid shift selection for this user'
    };

    const result = await apiCall('POST', `/shift-assignments/${assignmentId}/reject`, requestBody);

    if (result.status === 200) {
        console.log('✅ PASS: Assignment rejected successfully');
        console.log('Status:', result.data.data.status);
    } else {
        console.log('❌ FAIL: Expected 200, got', result.status);
        console.log('Response:', result.data);
    }
}

/**
 * Test 9: Remove Future Approved Assignment
 */
async function testRemoveAssignment() {
    console.log('\n=== Test 9: Remove Approved Assignment ===');

    if (!createdAssignmentId) {
        console.log('⚠️  SKIP: No assignment ID available');
        return;
    }

    const result = await apiCall('DELETE', `/shift-assignments/${createdAssignmentId}`);

    if (result.status === 200) {
        console.log('✅ PASS: Assignment removed successfully');
    } else {
        console.log('❌ FAIL: Expected 200, got', result.status);
        console.log('Response:', result.data);
    }
}

/**
 * Test 10: Unauthorized Access (Non-Admin)
 */
async function testUnauthorizedAccess() {
    console.log('\n=== Test 10: Unauthorized Access Prevention ===');

    const result = await apiCall('GET', '/shift-assignments', null, TEST_USER_TOKEN);

    if (result.status === 403) {
        console.log('✅ PASS: Non-admin correctly denied access');
    } else {
        console.log('⚠️  Note: Expected 403, got', result.status);
        console.log('Response:', result.data);
    }
}

/**
 * Setup: Get test user and shift IDs
 */
async function setup() {
    console.log('=== Setup: Getting Test Data ===');

    // Get first user
    const usersResult = await apiCall('GET', '/users');
    if (usersResult.status === 200 && usersResult.data.data.length > 0) {
        testUserId = usersResult.data.data[0].id;
        console.log('Test User ID:', testUserId);
    }

    // Get first shift
    const shiftsResult = await apiCall('GET', '/shifts');
    if (shiftsResult.status === 200 && shiftsResult.data.data.length > 0) {
        testShiftId = shiftsResult.data.data[0].id;
        console.log('Test Shift ID:', testShiftId);
    }

    if (!testUserId || !testShiftId) {
        console.log('❌ ERROR: Could not get test user or shift IDs');
        console.log('Please ensure users and shifts exist in the database');
        process.exit(1);
    }
}

/**
 * Main test runner
 */
async function runTests() {
    console.log('🚀 Starting Shift Assignment API Tests\n');
    console.log('Note: Make sure ADMIN_TOKEN is set in environment');

    if (!TEST_ADMIN_TOKEN) {
        console.log('⚠️  WARNING: No ADMIN_TOKEN found. Please set it:');
        console.log('export ADMIN_TOKEN="your_jwt_token_here"');
        console.log('\nGet token by logging in as admin user');
        return;
    }

    await setup();

    // Run all tests
    await testCreateShiftAssignment();
    await testDuplicateAssignment();
    await testGetShiftAssignments();
    await testGetAssignmentsByDate();
    await testApproveAssignment();
    await testDoubleApproval();

    const rejectionId = await testCreateForRejection();
    await testRejectAssignment(rejectionId);

    await testRemoveAssignment();

    if (TEST_USER_TOKEN) {
        await testUnauthorizedAccess();
    }

    console.log('\n✨ Test suite completed!\n');
}

// Run tests
runTests().catch(console.error);
