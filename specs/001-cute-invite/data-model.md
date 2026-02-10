# Data Model: Cute Invitation Website

**Feature**: 001-cute-invite  
**Date**: February 9, 2026  
**Referenced By**: [plan.md](plan.md)

## Entities & Attributes

### Invitation

Represents a single created invitation instance with all personalization data.

```
Invitation {
  id: string (UUID)                  // Unique identifier for this invitation
  recipientName: string              // Who is receiving the invitation
  senderName: string                 // Who is sending the invitation
  gifUrl: string                     // URL to background GIF
  imageUrl?: string                  // Optional: URL to featured image
  createdAt: ISO8601DateTime         // When invitation was created
  expiresAt: ISO8601DateTime         // Expiration date (30 days after creation)
  status: "active" | "expired"       // Current state
}
```

**Constraints**:
- `recipientName`: Required, 1-100 characters, no null/empty
- `senderName`: Required, 1-100 characters, no null/empty
- `gifUrl`: Required, valid URL to GIF file (MIME type: image/gif), max 10MB
- `imageUrl`: Optional, valid URL to image (JPEG/PNG/WebP), max 5MB
- `createdAt`: ISO8601 timestamp, auto-set to current time
- `expiresAt`: ISO8601 timestamp, calculated as `createdAt + 30 days`
- `id`: Generated as `sha256(recipientName + senderName + createdAt)`

**State Transitions**:
- Created → Active (immediately)
- Active → Expired (after 30 days)

---

### RecipientResponse

Represents a recipient's answer to an invitation.

```
RecipientResponse {
  id: string (UUID)                  // Unique identifier for this response
  invitationId: string               // Foreign key to Invitation
  response: "yes"                    // Only "yes" is valid (no is unclickable)
  respondedAt: ISO8601DateTime       // When recipient clicked "Yes"
  userAgent: string                  // Browser user agent info
  viewport: {
    width: number,
    height: number
  }
}
```

**Constraints**:
- `invitationId`: Required, must reference valid Invitation
- `response`: Always "yes" (design ensures "no" cannot be clicked)
- `respondedAt`: ISO8601 timestamp, auto-set to current time when response submitted
- `userAgent`: Captured from browser for analytics/debugging (optional)
- `viewport`: Captured for UX analytics (device type inference)

**Uniqueness**: Only one response per invitation allowed (subsequent clicks on "Yes" either ignored or logged as duplicate)

---

## Data Storage Strategy

### Primary Storage: Browser-Side Encoding

**Invitation Creation Flow**:
1. Sender fills form (recipientName, senderName, gifUrl, imageUrl)
2. App generates `invitationId` via deterministic hash
3. App creates Base64-encoded JSON containing Invitation data
4. App generates shareable URL: `https://my-invite.com/?id=base64encodedData`
5. Sender copies/shares the URL

**Invitation Display Flow**:
1. Recipient opens URL with `?id=base64encodedData`
2. App decodes Base64 to retrieve Invitation data
3. App displays personalized invitation
4. Recipient clicks "Yes"
5. App generates RecipientResponse object
6. App stores response in localStorage (key: `responses_${invitationId}`)

### Optional: Persistent Storage (Future Enhancement)

**localStorage Structure** (key-value):
```
// Sender-side (for invitation history)
key: "invitations_sent"
value: [ { id, recipientName, senderName, createdAt, link }, ... ]

// Recipient-side (for response confirmation)
key: "responses_${invitationId}"
value: { id, invitationId, response, respondedAt, userAgent, viewport }
```

**Alternative**: Server-side storage via simple JSON API (out of current scope; static-first approach)

---

## Validation Rules

### Invitation Validation

**At Creation**:
- `recipientName` is non-empty and <100 chars
- `senderName` is non-empty and <100 chars
- `gifUrl` is valid URL
- `gifUrl` resolves to valid image/gif MIME type
- `gifUrl` file size <10MB (if checkable)
- `imageUrl` (if provided) is valid URL and MIME type image/jpeg, image/png, or image/webp
- `imageUrl` file size <5MB (if checkable)

**At Display**:
- URL parameter `?id=` is valid Base64
- Decoded JSON matches Invitation schema
- `expiresAt` > current time (show error if expired)
- GIF and image URLs are still accessible (show fallback if broken)

### RecipientResponse Validation

**At Submission**:
- `invitationId` corresponds to valid Invitation
- Invitation status is "active" (not expired)
- Response is "yes" (always true by design)
- `respondedAt` is reasonable (not in future, not before invitationCreatedAt)

---

## Entity Relationships

```
┌─────────────────┐
│   Invitation    │
├─────────────────┤
│ id (PK)         │
│ recipientName   │
│ senderName      │
│ gifUrl          │
│ imageUrl?       │
│ createdAt       │
│ expiresAt       │
│ status          │
└────────┬────────┘
         │ 1..n
         │
         │
┌────────▼─────────────────┐
│  RecipientResponse       │
├─────────────────────────┤
│ id (PK)                 │
│ invitationId (FK)       │
│ response                │
│ respondedAt             │
│ userAgent?              │
│ viewport?               │
└─────────────────────────┘
```

**Relationship**: One Invitation → Many RecipientResponses (typically 0-1 in practice, as only "Yes" is clickable)

---

## Data Privacy & Retention

**Data Retention**:
- Active invitations: Stored in URL/localStorage indefinitely until manually deleted
- Responses: Retained for 90 days, then purged (GDPR compliance consideration)

**Privacy Considerations**:
- No authentication; sender name and recipient name are public (anyone with link can view)
- GIF/image URLs are external (not stored in system); ensure senders only link publicly shareable media
- UserAgent and viewport data optional; only collected if sender/app chooses
- No email addresses or contact info stored

**Data Deletion**:
- Manual deletion: Sender can delete from localStorage
- Automatic expiration: Invitations expire after 30 days (link returns 404)
- Response deletion: Recipient can clear localStorage to remove response record
