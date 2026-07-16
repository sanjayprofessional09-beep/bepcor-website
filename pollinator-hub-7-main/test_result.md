#====================================================================================================
# START - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================

# THIS SECTION CONTAINS CRITICAL TESTING INSTRUCTIONS FOR BOTH AGENTS
# BOTH MAIN_AGENT AND TESTING_AGENT MUST PRESERVE THIS ENTIRE BLOCK

# Communication Protocol:
# If the `testing_agent` is available, main agent should delegate all testing tasks to it.
#
# You have access to a file called `test_result.md`. This file contains the complete testing state
# and history, and is the primary means of communication between main and the testing agent.
#
# Main and testing agents must follow this exact format to maintain testing data. 
# The testing data must be entered in yaml format Below is the data structure:
# 
## user_problem_statement: {problem_statement}
## backend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.py"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## frontend:
##   - task: "Task name"
##     implemented: true
##     working: true  # or false or "NA"
##     file: "file_path.js"
##     stuck_count: 0
##     priority: "high"  # or "medium" or "low"
##     needs_retesting: false
##     status_history:
##         -working: true  # or false or "NA"
##         -agent: "main"  # or "testing" or "user"
##         -comment: "Detailed comment about status"
##
## metadata:
##   created_by: "main_agent"
##   version: "1.0"
##   test_sequence: 0
##   run_ui: false
##
## test_plan:
##   current_focus:
##     - "Task name 1"
##     - "Task name 2"
##   stuck_tasks:
##     - "Task name with persistent issues"
##   test_all: false
##   test_priority: "high_first"  # or "sequential" or "stuck_first"
##
## agent_communication:
##     -agent: "main"  # or "testing" or "user"
##     -message: "Communication message between agents"

# Protocol Guidelines for Main agent
#
# 1. Update Test Result File Before Testing:
#    - Main agent must always update the `test_result.md` file before calling the testing agent
#    - Add implementation details to the status_history
#    - Set `needs_retesting` to true for tasks that need testing
#    - Update the `test_plan` section to guide testing priorities
#    - Add a message to `agent_communication` explaining what you've done
#
# 2. Incorporate User Feedback:
#    - When a user provides feedback that something is or isn't working, add this information to the relevant task's status_history
#    - Update the working status based on user feedback
#    - If a user reports an issue with a task that was marked as working, increment the stuck_count
#    - Whenever user reports issue in the app, if we have testing agent and task_result.md file so find the appropriate task for that and append in status_history of that task to contain the user concern and problem as well 
#
# 3. Track Stuck Tasks:
#    - Monitor which tasks have high stuck_count values or where you are fixing same issue again and again, analyze that when you read task_result.md
#    - For persistent issues, use websearch tool to find solutions
#    - Pay special attention to tasks in the stuck_tasks list
#    - When you fix an issue with a stuck task, don't reset the stuck_count until the testing agent confirms it's working
#
# 4. Provide Context to Testing Agent:
#    - When calling the testing agent, provide clear instructions about:
#      - Which tasks need testing (reference the test_plan)
#      - Any authentication details or configuration needed
#      - Specific test scenarios to focus on
#      - Any known issues or edge cases to verify
#
# 5. Call the testing agent with specific instructions referring to test_result.md
#
# IMPORTANT: Main agent must ALWAYS update test_result.md BEFORE calling the testing agent, as it relies on this file to understand what to test next.

#====================================================================================================
# END - Testing Protocol - DO NOT EDIT OR REMOVE THIS SECTION
#====================================================================================================



#====================================================================================================
# Testing Data - Main Agent and testing sub agent both should log testing data below this section
#====================================================================================================

user_problem_statement: |
  Build a BEPCoR (Be-Ecoliteracy Pollinator Conservation and Research Foundation) NGO website inspired by
  pollinator.org, xerces.org, planetbee.org, dhan.org, baif.org.in. Tagline "Conservation of Living Planet".
  Includes Home, About, Pollinators, Programs, Get Involved, Resources, Contact pages.
  Backend needed for: newsletter subscribe, donations (records only, no payment gateway), volunteer
  applications, contact messages, and blog posts (Field Journal).

backend:
  - task: "Root health endpoint GET /api/"
    implemented: true
    working: true
    file: "backend/server.py"
    stuck_count: 0
    priority: "low"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Returns {service, status:'ok'}"
      - working: true
        agent: "testing"
        comment: "✅ PASSED - Returns correct structure {service:'BEPCoR API', status:'ok'}. Tested via https://pollinator-hub-7.preview.emergentagent.com/api/"

  - task: "Newsletter subscribe POST /api/newsletter/subscribe"
    implemented: true
    working: true
    file: "backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Accepts {email}. 201 on success, 409 if already exists. EmailStr validation."
      - working: true
        agent: "testing"
        comment: "✅ PASSED - All validations working: (1) Valid email returns 201 with UUID id, email, subscribed_at in ISO format. (2) Duplicate email correctly returns 409. (3) Invalid email format correctly returns 422. No MongoDB _id in responses."

  - task: "Donations POST /api/donations and GET /api/donations"
    implemented: true
    working: true
    file: "backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Records only, no payment gateway. Body {name,email,phone?,amount,tier?}. amount must be > 0 and <= 10000000."
      - working: true
        agent: "testing"
        comment: "✅ PASSED - All validations working: (1) Valid donation returns 201 with UUID id, created_at in ISO format. (2) amount=0 correctly returns 422. (3) amount=-100 correctly returns 422. (4) Invalid email correctly returns 422. (5) Missing name correctly returns 422. (6) GET /api/donations returns array with valid structure, no MongoDB _id."

  - task: "Volunteers POST /api/volunteers and GET /api/volunteers"
    implemented: true
    working: true
    file: "backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Body {name,email,interest,message?}."
      - working: true
        agent: "testing"
        comment: "✅ PASSED - All validations working: (1) Valid volunteer application returns 201 with UUID id, created_at in ISO format. (2) Missing interest field correctly returns 422. (3) GET /api/volunteers returns array with valid structure, no MongoDB _id."

  - task: "Contact POST /api/contact and GET /api/contact"
    implemented: true
    working: true
    file: "backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Body {name,email,subject?,message}. Message max 4000 chars."
      - working: true
        agent: "testing"
        comment: "✅ PASSED - All validations working: (1) Valid contact message returns 201 with UUID id, created_at in ISO format. (2) Missing message field correctly returns 422. (3) Message >4000 chars correctly returns 422. (4) GET /api/contact returns array with valid structure, no MongoDB _id."

  - task: "Posts GET /api/posts and GET /api/posts/{slug}"
    implemented: true
    working: true
    file: "backend/server.py"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "6 posts seeded on startup if collection empty. Supports ?category=&q= filters. 404 on missing slug."
      - working: true
        agent: "testing"
        comment: "✅ PASSED - All features working: (1) GET /api/posts returns 6 seeded posts with UUID id, ISO datetime, no MongoDB _id. (2) ?category=Pollinators correctly filters to 1 Pollinators post. (3) ?category=All returns all 6 posts (treats 'All' as no filter). (4) ?q=bees correctly searches and returns posts with 'bees' in title/excerpt including 'Why native bees matter'. (5) GET /api/posts/why-native-bees-matter returns correct post. (6) GET /api/posts/pollinator-garden-guide returns correct post. (7) Unknown slug correctly returns 404."

frontend:
  - task: "Overall UI - Code-quality refactor verification"
    implemented: true
    working: true
    file: "frontend/src/*"
    stuck_count: 0
    priority: "high"
    needs_retesting: false
    status_history:
      - working: "NA"
        agent: "main"
        comment: "Frontend built with 7 pages: Home, About, Pollinators, Programs, Get Involved, Resources, Contact. Forms wired to backend via /app/frontend/src/lib/api.js."
      - working: true
        agent: "testing"
        comment: |
          ✅ COMPREHENSIVE SMOKE TEST PASSED - Code-quality refactor successful!
          
          Verified all pages and interactions after array-index keys were replaced with stable identifiers:
          
          1. Home page (/) - ✅ ALL WORKING
             - Hero section with 3 rotating slides ✓
             - Slide dot buttons (3) all clickable ✓
             - Stats bar with animated counting (4 stats) ✓
             - Mission section with 4 pillar cards ✓
             - Pollinators preview with 4 dark cards (Insects, Birds, Mammals, Abiotic) ✓
             - Programs section with 6+ program cards, first is WMPPC ✓
             - Testimonials section with 3 quote cards ✓
             - Donation strip with 4 amount tiers (₹1,000, ₹2,500, ₹5,000, ₹25,000) ✓
             - Partners marquee scrolling ✓
             - Footer newsletter form submission successful ✓
          
          2. Navigation - ✅ ALL WORKING
             - All header links working: Home, About, Pollinators, Programs, Get Involved, Resources, Contact ✓
             - No blank pages, no navigation errors ✓
          
          3. Pollinators page (/pollinators) - ✅ WORKING
             - 4 sections displayed (Insects, Birds, Mammals, Abiotic) ✓
             - Detail cards showing (12+ cards across all sections) ✓
             - Insects section has cards for Bees, Butterflies, Moths, Beetles, Flies, Wasps & Ants ✓
          
          4. Programs page (/programs) - ✅ WORKING
             - Initial display shows 7 programs ✓
             - 'Livelihoods' filter reduces to 2 programs ✓
             - 'All' filter resets to 7 programs ✓
             - Filter functionality working correctly ✓
          
          5. Get Involved page (/get-involved) - ✅ ALL WORKING
             - Donate tab active by default ✓
             - 4 donation tier tiles displayed and clickable ✓
             - Donate form submission successful (Test User, test@example.com) ✓
             - Volunteer tab working, form submission successful (Vol User, vol@example.com) ✓
             - Partner tab showing 4 partner-type cards ✓
          
          6. Resources page (/resources) - ✅ ALL WORKING
             - 7 blog posts loaded from backend (6+ required) ✓
             - Featured post displayed ✓
             - Search functionality working (search for 'bees') ✓
             - Category filters working (Pollinators filter applied) ✓
             - 'All' category reset working ✓
          
          7. Contact page (/contact) - ✅ WORKING
             - Contact form submission successful (Contact Test, contact@example.com, Hello, Testing the form) ✓
             - Success toast displayed ✓
          
          8. Console errors check - ✅ CLEAN
             - Total console logs: 13
             - Error logs: 0 ✓
             - React key warnings: 0 ✓
             - No "each child in a list should have a unique key" errors ✓
             - No uncaught errors ✓
          
          CONCLUSION: Code-quality refactor (array-index keys → stable identifiers) is SUCCESSFUL. All interactions work correctly, no React key warnings, no console errors. Website is production-ready.

metadata:
  created_by: "main_agent"
  version: "1.0"
  test_sequence: 3
  run_ui: true

test_plan:
  current_focus: []
  stuck_tasks: []
  test_all: false
  test_priority: "high_first"

agent_communication:
  - agent: "main"
    message: |
      Please test all backend endpoints via the external REACT_APP_BACKEND_URL (see /app/frontend/.env).
      Key validations:
      - Newsletter: duplicate email returns 409.
      - Donation amount validation (>0, <=10000000). Invalid email should be rejected.
      - Posts: filter ?category=Pollinators returns only Pollinators posts; ?q=bees returns posts with 'bees' in title/excerpt.
      - Posts detail: GET /api/posts/why-native-bees-matter returns a post; unknown slug returns 404.
      - All list endpoints should return arrays.
      - IDs must be UUID strings, no MongoDB _id in responses.
  - agent: "testing"
    message: |
      ✅ ALL BACKEND TESTS PASSED (25/25)
      
      Comprehensive testing completed for all BEPCoR backend endpoints at https://pollinator-hub-7.preview.emergentagent.com/api
      
      Test Results Summary:
      1. Root health endpoint (GET /api/) - ✅ Working
      2. Newsletter subscribe (POST /api/newsletter/subscribe) - ✅ All validations working (201, 409 duplicate, 422 invalid)
      3. Donations (POST/GET /api/donations) - ✅ All validations working (201, 422 for invalid data, GET returns array)
      4. Volunteers (POST/GET /api/volunteers) - ✅ All validations working (201, 422 for missing fields, GET returns array)
      5. Contact (POST/GET /api/contact) - ✅ All validations working (201, 422 for invalid data, GET returns array)
      6. Posts list (GET /api/posts) - ✅ Returns 6 seeded posts, category filter, search query all working
      7. Posts detail (GET /api/posts/{slug}) - ✅ Valid slugs return posts, unknown slug returns 404
      
      All responses verified:
      - UUID 'id' fields (no MongoDB _id)
      - ISO datetime strings for timestamps
      - Proper HTTP status codes (201, 409, 422, 404)
      - All validation rules enforced correctly
      
      No issues found. Backend is production-ready.
  - agent: "testing"
    message: |
      ✅ FRONTEND SMOKE TEST COMPLETED - Code-quality refactor verification
      
      Ran comprehensive smoke tests across all 7 pages after code-quality refactor (array-index keys replaced with stable identifiers).
      
      ALL TESTS PASSED:
      - Home page: All sections working (hero slides, stats, mission, pollinators, programs, testimonials, donation strip, partners, newsletter)
      - Navigation: All 7 pages accessible without errors
      - Pollinators page: 4 sections with detail cards displayed correctly
      - Programs page: Filter functionality working (Livelihoods, All)
      - Get Involved page: All 3 tabs working (Donate, Volunteer, Partner), forms submitting successfully
      - Resources page: Blog posts loading (7 posts), search and category filters working
      - Contact page: Form submission working
      - Console: 0 React key warnings, 0 errors
      
      REFACTOR SUCCESSFUL - No issues found. Website is production-ready.
