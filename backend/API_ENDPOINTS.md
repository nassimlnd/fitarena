# 🏋️ FitArena API Endpoints

## 🔐 Authentication

- `POST /api/login` - User login
- `POST /api/register` - User registration

## 👤 User Management (Admin)

- `GET /api/admin/users` - List all users (with role filter)
- `GET /api/admin/users/:id` - Get user details
- `PUT /api/admin/users/:id/role` - Update user role
- `POST /api/admin/users/:id/activate` - Activate user
- `POST /api/admin/users/:id/deactivate` - Deactivate user
- `DELETE /api/admin/users/:id` - Delete user

## 🏢 Gym Management

### Public

- `GET /api/gyms` - List approved gyms

### Gym Owner

- `POST /api/gym` - Create gym (requires gym owner role)
- `PUT /api/gym/:id` - Update gym

### Admin

- `GET /api/admin/gyms` - List all gyms (with status filter)
- `GET /api/admin/gyms/pending` - List pending gyms
- `GET /api/admin/gyms/:id` - Get gym details
- `POST /api/admin/gyms/:id/approve` - Approve gym
- `POST /api/admin/gyms/:id/reject` - Reject gym
- `DELETE /api/admin/gyms/:id` - Delete gym

## 🏋️ Exercise Management

### Public API

- `GET /api/exercises` - List exercises (with search, muscle, pagination)
- `GET /api/exercises/:id` - Get exercise details
- `GET /api/exercises/search` - Advanced exercise search
- `GET /api/exercises/muscles` - Get all muscle groups
- `GET /api/exercises/muscle/:muscle` - Get exercises by muscle group

### Admin

- `GET /api/admin/exercises` - List all exercises
- `POST /api/admin/exercises` - Create exercise
- `GET /api/admin/exercises/:id` - Get exercise details
- `PUT /api/admin/exercises/:id` - Update exercise
- `DELETE /api/admin/exercises/:id` - Delete exercise

## 🎯 Challenge Management

### Challenge Exploration (Public)

- `GET /api/challenges/explore/user` - Explore user challenges (with filters)
- `GET /api/challenges/explore/gym` - Explore gym challenges
- `GET /api/challenges/explore/:id` - Get challenge details
- `GET /api/challenges/trending` - Get trending challenges
- `GET /api/challenges/search` - Search challenges across all types

### Challenge Exploration (Authenticated)

- `GET /api/challenges/recommended` - Get personalized recommendations

### Challenge Participation (Authenticated)

- `POST /api/challenges/:id/start` - Start participating in challenge
- `POST /api/challenges/:id/claim` - Claim completed challenge
- `GET /api/challenges/my-participations` - Get user's challenge participations
- `GET /api/challenges/my-stats` - Get user's challenge statistics

### User Challenges (Authenticated)

- `GET /api/challenge_clients` - List user challenges
- `GET /api/challenge_clients/:id` - Get user challenge details
- `POST /api/challenge_clients` - Create user challenge
- `PUT /api/challenge_clients/:id` - Update user challenge
- `DELETE /api/challenge_clients/:id` - Delete user challenge

### Gym Challenges (Gym Owner)

- `GET /api/gym_challenges` - List gym challenges
- `GET /api/gym_challenges/:id` - Get gym challenge details
- `POST /api/gym_challenges` - Create gym challenge
- `PUT /api/gym_challenges/:id` - Update gym challenge
- `DELETE /api/gym_challenges/:id` - Delete gym challenge

## 👥 Group Challenges (Authenticated)

- `POST /api/group_challenges` - Create group challenge
- `POST /api/group_challenges/:id/join` - Join group challenge
- `GET /api/group_challenges` - List user's group challenges

## 📧 Challenge Invitations (Authenticated)

- `POST /api/challenge_invitations` - Send challenge invitation
- `GET /api/challenge_invitations/sent` - Get sent invitations
- `GET /api/challenge_invitations/received` - Get received invitations
- `POST /api/challenge_invitations/:id/respond` - Respond to invitation

## 🏃 Training Sessions (Authenticated)

- `POST /api/training_sessions` - Create training session
- `GET /api/training_sessions` - List user's training sessions
- `GET /api/training_stats` - Get training statistics

## 🏆 Leaderboard

- `GET /api/leaderboard` - Global leaderboard
- `GET /api/leaderboard/my-rank` - User's rank (authenticated)

## 🎮 Gamification (Authenticated)

- `GET /api/gamification/dashboard` - Gamification dashboard
- `GET /api/gamification/badges` - Available badges
- `GET /api/gamification/my-badges` - User's badges
- `GET /api/gamification/rewards` - Available rewards
- `GET /api/gamification/my-rewards` - User's rewards
- `POST /api/gamification/rewards/:id/claim` - Claim reward

## 🏅 Badge Management (Admin)

- `GET /api/admin/badges` - List all badges
- `POST /api/admin/badges` - Create badge
- `GET /api/admin/badges/:id` - Get badge details
- `PUT /api/admin/badges/:id` - Update badge
- `DELETE /api/admin/badges/:id` - Delete badge
- `POST /api/admin/badges/award` - Award badge to user
- `GET /api/admin/users/:userId/badges` - Get user's badges

## 🎁 Reward Management (Admin)

- `GET /api/admin/rewards` - List all rewards
- `POST /api/admin/rewards` - Create reward
- `GET /api/admin/rewards/:id` - Get reward details
- `PUT /api/admin/rewards/:id` - Update reward
- `DELETE /api/admin/rewards/:id` - Delete reward
- `GET /api/admin/users/:userId/rewards` - Get user's rewards
- `POST /api/admin/rewards/deactivate` - Deactivate user reward

## 📋 Query Parameters

### Pagination

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

### Filters

- `search` - Text search
- `status` - Filter by status
- `role` - Filter by user role
- `difficulty` - Filter by challenge difficulty
- `type` - Filter by type
- `muscle` - Filter by muscle group

### Challenge Exploration Filters

- `difficulty` - easy, medium, hard
- `type` - Challenge type
- `minDuration` - Minimum duration in days
- `maxDuration` - Maximum duration in days
- `search` - Text search in name/description

## 🔒 Authentication Requirements

- **Public**: No authentication required
- **Authenticated**: Requires valid access token
- **Gym Owner**: Requires gym owner role
- **Admin**: Requires admin role

## 📝 Response Format

All endpoints return JSON with consistent structure:

### Success Response

```json
{
  "data": [...],
  "message": "Success message",
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### Error Response

```json
{
  "message": "Error description",
  "code": "ERROR_CODE",
  "errors": [...] // Validation errors if applicable
}
```
