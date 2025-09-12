# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React TypeScript application for creating landing page briefings through conversational AI chat using Anthropic's Claude API. The system collects branding information and content requirements through 8 specific questions, then generates a comprehensive briefing that gets sent to Make.com.

## Technology Stack

- **Frontend:** React 18 + TypeScript
- **Styling:** TailwindCSS with CSS variables for dynamic branding
- **AI Integration:** Anthropic Claude API
- **HTTP Client:** Axios
- **Animations:** Framer Motion (optional)
- **Deployment:** Vercel/Netlify

## Architecture

### Planned File Structure
```
src/
├── components/
│   ├── Chat.tsx           // Main chat interface
│   ├── Message.tsx        // Individual message bubbles
│   ├── TypingIndicator.tsx // "AI is typing..." indicator
│   └── BriefingPreview.tsx // Final briefing preview with client branding
├── hooks/
│   └── useChat.ts         // Core chat logic and state management
├── services/
│   └── api.ts             // Claude API calls and Make.com webhook
├── types.ts               // TypeScript interfaces
├── constants.ts           // System prompts and configuration
└── App.tsx               // Root component
```

## Key Technical Requirements

### Dynamic Branding System
The application updates its appearance based on client branding input:
- CSS variables are updated in real-time (`--color-client-primary`, `--color-client-secondary`, `--font-client`)
- Default colors: `#3B82F6` (primary) and `#1E40AF` (secondary)
- Client branding is applied to chat interface and briefing preview

### Chat Flow
The system asks exactly 8 questions in sequence:
1. BRANDING: Company name and brand colors
2. IDENTITY: What the company does
3. VALUE PROPOSITION: Specific measurable promise
4. PROBLEMS: 3 main problems solved
5. SOLUTION: How problems are resolved
6. SOCIAL PROOF: Testimonials/case studies
7. OFFER: Product/service details and pricing
8. CALL TO ACTION: Desired client action

### Data Structure
The main `BriefingData` interface includes both branding and content:
- Branding: company name, logo, colors, font
- Content: value proposition, problems, solution, testimonials, offer, CTA

### API Integration
- Claude API for conversational chat
- Make.com webhook for final briefing submission
- Payload includes both branding and content data in structured JSON format

## Development Notes

### Styling Approach
- Use TailwindCSS classes with CSS variable fallbacks
- Implement `.client-primary`, `.client-secondary`, and `.client-font` utility classes
- Ensure responsive design (mobile: full screen, desktop: max 800px width)

### State Management
- Primary state handled through `useChat` custom hook
- Track current conversation step, loading states, and completion status
- Messages stored as array with role, content, and timestamp

### Error Handling
- Implement fallbacks for API failures
- Handle file upload errors for logo functionality
- Provide clear user feedback during API calls

## System Prompt
The AI assistant follows a strict conversational pattern asking one question at a time, maintaining a friendly tone while collecting specific briefing information. After question 8, it generates a final markdown-formatted briefing.

## External Integrations
- **Claude API:** Requires Anthropic API key for chat functionality
- **Make.com:** Webhook endpoint for briefing submission
- **File Upload:** Optional logo upload with base64 encoding for webhook payload