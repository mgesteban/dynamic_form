# Product Context: MiniForum

## Problem Statement
Event organizers often struggle with efficiently managing registrations for forum sessions where capacity is limited. Traditional approaches like email lists or general-purpose form tools don't provide real-time validation of available capacity or prevent over-booking.

## Solution Approach
MiniForum provides a specialized registration system that:
- Shows real-time availability of sessions
- Prevents registration once capacity is reached
- Maintains a single source of truth for session data
- Makes the registration process simple for attendees

## User Experience Goals
1. **For Organizers:**
   - Easy session creation and management
   - Clear visibility into registration numbers
   - Ability to modify session details when needed
   - Confidence that capacity limits will be enforced

2. **For Attendees:**
   - Straightforward registration process
   - Clear understanding of available sessions
   - Real-time feedback on successful registration
   - No possibility of registering for full sessions

## Key Workflows
1. **Session Creation:**
   - Organizers define session details (name, date, time, capacity)
   - System stores this in Supabase database
   - Sessions become available for registration

2. **Registration:**
   - Attendees view available sessions
   - System shows real-time capacity information
   - Attendees select desired session
   - System validates availability
   - System confirms registration

3. **Management:**
   - Organizers can view all sessions and registrations
   - Organizers can modify session details if needed
   - System maintains data integrity across changes

## Value Proposition
MiniForum eliminates the administrative overhead and errors associated with manual registration systems, providing both organizers and attendees with a reliable, real-time view of session availability and registration status.
