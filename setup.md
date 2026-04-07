Improve the existing React (Vite + Tailwind) frontend for "HelpHive" by fixing state management, user flow, and interaction logic. Do NOT rebuild from scratch. Refactor and extend the current code.

---

## CORE FIXES REQUIRED

1. FIX USER DATA PERSISTENCE

* Ensure login/signup data is stored in global state (Context/Zustand) AND localStorage
* On app reload, restore user session from localStorage
* Profile page must display actual logged-in user details (not static/mock data)
* Allow profile editing (update state + localStorage)

---

2. CORRECT HELP FLOW (VERY IMPORTANT)

Current issue:
Clicking "Offer Help" directly opens chat → this is WRONG

Correct flow:

Step 1: User A sets status = "NEED HELP"
Step 2: Nearby users (User B, C, etc.) see request in feed

Step 3: User B clicks "Offer Help"
→ This should SEND a help request (not open chat)

Step 4: User A receives incoming requests list:

* Show list of users offering help
* Each item:

  * Name
  * Distance (mock)
  * Accept / Reject buttons

Step 5:

* If User A ACCEPTS one request:

  * Status changes to "HELPING"
  * Only THEN enable chat between User A and accepted user
* Reject others

---

3. ADD REQUEST MANAGEMENT SYSTEM (FRONTEND STATE)

Create a request system in global state:

Each request object:

* id
* requesterId (person needing help)
* helperId (person offering help)
* status (pending / accepted / rejected)

Features:

* Store all requests in global state
* Show:

  * Sent requests (for helper)
  * Received requests (for requester)

---

4. IMPROVE CHAT LOGIC

* Chat should ONLY open AFTER request is accepted
* Prevent chat access if request is not accepted
* Store active chat user in state
* Simulate real-time feel using state updates (no backend yet)

---

5. STATUS SYNCHRONIZATION

* Status must reflect correctly:

  * NEED HELP → Red
  * HELPING → Green
  * OFF → Grey

* When request is accepted:

  * Requester → becomes HELPING
  * Helper → becomes HELPING

---

6. FEED IMPROVEMENTS

* Show only relevant actions:

  * If user is NEED HELP → others see "Offer Help"
  * If user is HELPING → disable interaction
* Do NOT allow self-interaction

---

7. UI ADDITIONS

Add new sections:

A. "Incoming Requests" panel (for users needing help)
B. "Sent Requests" panel (for helpers)

Each request card:

* User name
* Status
* Accept / Reject (only for receiver)

---

8. CLEAN STATE STRUCTURE

Global state should include:

* currentUser
* users (mock list)
* status
* location
* requests (array)
* activeChatUser

---

9. IMPORTANT RULES

* Do not use backend yet
* Do not use Socket.IO yet
* Simulate all flows using frontend state
* Keep logic realistic and scalable for backend integration

---

OUTPUT EXPECTATION

* Refactored React frontend code
* Proper request → accept → chat flow
* Persistent user profile
* Clean modular components
* Working interaction logic (no shortcuts)

If response is long, generate in parts:

1. State management fixes
2. Request system
3. Chat restrictions

---
