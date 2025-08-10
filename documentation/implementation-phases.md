# Samesisters Implementation Phases

## Overview
Build order based on technical dependencies and architectural wisdom. Each phase creates the foundation for the next.

## Phase 0: Project Foundation
**Why First**: Set up the development environment and deployment pipeline before writing any feature code.

1. **Initial Setup**
   - Create GitHub repository
   - Initialize React + TypeScript + Vite project
   - Install core dependencies (Framer Motion)
   - Configure TypeScript strictly
   - Set up ESLint and Prettier

2. **Folder Structure**
   ```
   /src
     /components
       /cards
       /navigation
       /ui
     /data
     /hooks
     /types
     /utils
   /public
     /images
     /videos
   ```

3. **Deployment Pipeline**
   - Connect GitHub to Vercel
   - Configure domain (samesisters.com)
   - Test deployment with "Hello Samesisters"
   - Set up environment variables

4. **Development Standards**
   - Git commit conventions
   - Branch strategy (main + feature branches)
   - TypeScript interfaces location
   - Component file structure

**Critical Decision**: Get the pipeline working end-to-end before any real development.

### What You Need to Do:

1. **Create GitHub Repository**
   - Go to github.com/new
   - Name: "samesisters" 
   - Make it private initially
   - Don't initialize with README (we'll create everything)
   - Clone locally: `git clone https://github.com/YOUR_USERNAME/samesisters.git`

2. **Set Up Vercel Account**
   - Sign up at vercel.com with your GitHub
   - Click "Add New Project"
   - Import your samesisters repo
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Deploy (it will fail - that's ok!)

3. **Buy/Connect Domain**
   - In Vercel dashboard → Settings → Domains
   - Add "samesisters.com"
   - Either:
     - Buy through Vercel ($20/year)
     - Or point existing domain nameservers to Vercel
   - Vercel provides the exact DNS settings

4. **Environment Variables** (for later)
   - In Vercel dashboard → Settings → Environment Variables
   - Add: `VITE_ADMIN_PASSWORD` = "your-secure-password"
   - This will be used in Phase 10





## Phase 1: Data Structure & Inventory
**Why First**: Define the data shape that everything will consume. This is the contract between frontend and future admin UI.

1. **JSON Schema Design**
   - pieces.json structure (images, story, pricing, tags, fabric types)
   - fabrics.json structure (video, caption, tags, type, yards, cost)
   - philosophy.json, filter.json, sachi-moments.json
   - TypeScript interfaces for all data types

2. **Sample Inventory**
   - 5-10 sample pieces with real data
   - 5-10 sample fabrics with videos
   - All philosophy cards
   - Sachi moment videos

3. **Asset Organization**
   - /public/videos structure
   - /public/images structure
   - Naming conventions
   - Git LFS setup if needed

**Critical Decision**: This structure is hard to change later. Get it right.

### What You Need to Do:

1. **Create Placeholder Images**
   - Create 10 piece images (1200x1600px)
   - Simple approach: Use Canva or Figma
   - Even solid colors with text work: "Midnight Conference Dress"
   - Save as: midnight-conference-1.jpg, midnight-conference-2.jpg, etc.
   - Place in: /public/images/pieces/

2. **Create/Find Video Files**
   - Fabric videos (5-10 seconds, looping):
     - Film actual fabric moving OR
     - Download free fabric videos from Pexels/Unsplash
     - Compress to <5MB each using HandBrake
   - Sachi videos (15-30 seconds):
     - Record on phone (vertical is fine)
     - Simple script: "Hi, I'm Sachi. I believe every piece should tell a story..."
     - Save as: sachi-inspiration.mp4, sachi-journey.mp4, etc.
   - Place in: /public/videos/

3. **Git LFS Setup** (for videos over 50MB)
   ```bash
   # In your repo:
   git lfs track "*.mp4"
   git lfs track "*.mov"
   git add .gitattributes
   git commit -m "Set up Git LFS for videos"
   ```

4. **Gather Real Content**
   - Philosophy statements (8-10 quotes)
   - Piece descriptions and stories
   - Fabric captions ("Found in Delhi market")
   - This can evolve, but having real text helps





## Phase 2: Core Card Architecture
**Why Next**: With data structure defined, build the atomic unit of the experience.

1. **Base Card Component**
   - Shared card wrapper with render props/composition
   - Card state management (default vs expanded)
   - 9:16 aspect ratio, ~80% viewport height
   - Animation hooks for Framer Motion
   - Consume TypeScript interfaces from Phase 1

2. **Swipe Gesture System**
   - Touch/mouse gesture detection
   - Keyboard navigation
   - Swipe threshold logic
   - Animation spring physics

3. **Single Card Type (Philosophy)**
   - Simplest card to implement
   - Tests the entire card system
   - No expansion state needed
   - Uses real data from philosophy.json

**Critical Decision**: Nail the swipe feel here. This is the core interaction.

### What You Need to Do:

1. **Test on Real Devices**
   - Open localhost on your phone
   - Test swipe gestures feel natural
   - Adjust spring physics if needed
   - I'll handle the code, you test the feel





## Phase 3: Deck Management & State
**Why Next**: Need the deck system before adding more card types or any filtering logic.

1. **Deck Data Structure**
   - Card queue management
   - Position tracking
   - Preloading next cards
   - Loading from JSON files

2. **localStorage Integration**
   - Session state persistence
   - Swipe history tracking
   - Collection management

3. **Basic Navigation**
   - Tab bar component
   - View switching (Swipe/Collection)
   - State preservation between views

**Critical Decision**: Get the state management right - this affects everything downstream.

### What You Need to Do:

1. **Browser Testing**
   - Test localStorage persistence
   - Clear cache and verify it handles empty state
   - Test in private/incognito mode
   - Let me know if any browser quirks appear





## Phase 4: All Card Types (No Expansion)
**Why Now**: With infrastructure solid, implement all card variants to ensure the architecture holds.

1. **Filter Cards**
   - First position in deck
   - Deck modification logic
   - Gender preference handling

2. **Piece Cards** (basic display only)
   - Image handling
   - Price display
   - Tags display (occasions/moods)
   - Basic info overlay
   - Uses pieces.json

3. **Fabric Story Cards**
   - Video loop implementation
   - Caption overlays
   - Performance optimization
   - Uses fabrics.json

4. **Sachi Moment Cards**
   - Video preview state
   - Play button overlay

**Critical Decision**: Each card type should be completely independent yet share common behavior.

### What You Need to Do:

1. **Create More Assets**
   - Filter card visuals (feminine/masculine silhouettes)
   - Can be abstract/artistic
   - Consistent visual style across all

2. **Video Optimization**
   - Ensure all videos are web-optimized
   - Target: <5MB per video
   - Use HandBrake or online compressor
   - Test they loop smoothly





## Phase 5: Collection View
**Why Before Expansion**: Complete the basic flow before adding complexity.

1. **Scrapbook Layout**
   - Card positioning algorithm
   - Rotation/angle calculations
   - Responsive grid

2. **Collection State Management**
   - Which cards to show
   - Maintain card references
   - Click to expand preparation

### What You Need to Do:

1. **Design Feedback**
   - Review the scrapbook layout
   - Decide on rotation angles (3-7 degrees?)
   - Approve shadow styles
   - Test on different screen sizes





## Phase 6: Card Expansion System
**Why Now**: With all cards implemented and collection working, add the expansion layer.

1. **Expansion Animation Framework**
   - Position tracking
   - Grow/shrink animations
   - Scroll management
   - Z-index handling

2. **Piece Card Expansion**
   - Image gallery
   - Tags displayed prominently
   - Scrollable content with story
   - Fabric selection UI
   - Price calculations
   - Size inputs

3. **Video Card Expansion**
   - Full-screen video
   - Audio playback
   - Pause/play controls

**Critical Decision**: Expansion must feel like the same card growing, not a modal.

### What You Need to Do:

1. **Gallery Images**
   - Create 3-5 images per piece
   - Different angles/details
   - Consistent editing style
   - Name systematically: piece-name-1.jpg, piece-name-2.jpg





## Phase 7: Fabric Compatibility System
**Why Separate**: This cross-cutting concern is easier to implement after all cards exist.

1. **Fabric Type System**
   - Use fabric types from JSON
   - Filter compatible fabrics
   - Handle empty states

2. **Dynamic Fabric Display**
   - Show only compatible fabrics
   - Update pricing
   - Visual feedback

### What You Need to Do:

1. **Define Fabric Types**
   - Finalize the list: silk, cotton, linen, wool, synthetic?
   - Ensure each piece has compatible types defined
   - Document any special rules





## Phase 8: Messaging Integration
**Why Near End**: External integrations are easier to add to a stable system.

1. **Message Formatting**
   - Gather all selections
   - Create readable message
   - Handle edge cases

2. **Clipboard & Deep Links**
   - Copy to clipboard
   - SMS/WhatsApp/Instagram links
   - Fallback behaviors

3. **"Text Sachi!" CTA**
   - Floating button
   - Tooltip system
   - Platform detection

### What You Need to Do:

1. **Set Up Messaging**
   - Get Sachi's phone number for SMS
   - Set up WhatsApp Business (optional)
   - Confirm Instagram handle
   - Test deep links work on your phone

2. **Write Message Templates**
   - Draft the auto-generated message format
   - Example: "Hi Sachi! I'm interested in the Midnight Conference dress in Delhi Blue Silk (Around $650). My height is 5'6" and I usually wear size M."
   - Keep it conversational





## Phase 9: Polish & Performance
**Why Before Admin**: Optimize the user experience before adding admin complexity.

1. **Loading States**
   - Video loading
   - Image optimization
   - Skeleton screens

2. **Error Handling**
   - Network failures
   - Missing data
   - Graceful degradation

3. **Mobile Refinements**
   - Touch target sizes
   - Gesture conflicts
   - Performance tuning

### What You Need to Do:

1. **Performance Testing**
   - Test on older phones
   - Check video loading times
   - Report any lag or jank
   - Test on slow internet

2. **Final Asset Review**
   - Ensure all images are optimized
   - Replace any placeholder content
   - Final copy editing





## Phase 10: Admin UI
**Why Last**: The main site should be perfect before adding content management.

1. **Admin Route & Auth**
   - Password protection
   - Admin layout
   - Navigation

2. **Fabric Management**
   - CRUD operations
   - Video upload
   - Modify existing JSON structure

3. **Piece Management**
   - Add/edit pieces with images
   - Manage custom tags (occasions, moods, moments)
   - Set pricing
   - Define compatible fabric types
   - Archive/duplicate pieces

4. **GitHub Integration**
   - Edge functions
   - Commit automation
   - Deploy triggers

### What You Need to Do:

1. **GitHub Personal Access Token**
   - Go to GitHub → Settings → Developer settings → Personal access tokens
   - Generate new token (classic)
   - Permissions: repo (all)
   - Copy token immediately
   - Add to Vercel env vars as `GITHUB_TOKEN`

2. **Test Admin Access**
   - Navigate to /sachi-admin
   - Use password from env vars
   - Test adding/editing content
   - Verify changes deploy automatically

3. **Train Sachi**
   - Quick video showing how to use admin
   - Write simple guide
   - Share password securely






## Architecture Wisdom

### Why This Order Makes Sense

1. **Data First**: Define the contract that both frontend and admin will use.

2. **Card System Second**: Everything is a card. Perfect this atomic unit.

3. **State Before Features**: Build robust state management before feature complexity.

4. **All Cards Before Any Expansion**: Ensure the base system handles all variants.

5. **User Flow Before Admin**: Complete the user experience end-to-end.

### What We're Avoiding

- Building cards without knowing data structure
- Creating admin UI without testing the data shape
- Adding expansion before we have all card types
- Optimizing before the full experience exists

### Key Insights

- **Data structure** comes first - it's the contract everything else depends on
- **Sample inventory** ensures we're building with real content constraints
- **Fabric compatibility** is intentionally late - it's easier after all pieces exist
- **Admin UI** modifies the same JSON structure we define upfront

This order ensures each phase has everything it needs from previous phases, with no forward dependencies or rework needed.

## Complete Setup Checklist - Do This First!

### 1. External Accounts & Services

**GitHub Setup**
```bash
# Create repo at github.com/new
# Name: samesisters (private initially)
# Don't initialize with README
# Clone it:
git clone https://github.com/YOUR_USERNAME/samesisters.git
cd samesisters
```

**Vercel Setup**
- Sign up at vercel.com with GitHub
- We'll connect the repo after initial commit

**Domain** (if you want samesisters.com)
- Buy through Vercel ($20/year) or
- Have existing domain ready to point to Vercel

### 2. Create All Assets Upfront

Create this folder structure in your project:
```
samesisters/
├── public/
│   ├── images/
│   │   ├── pieces/
│   │   │   ├── cassata/
│   │   │   │   ├── 1.jpg
│   │   │   │   ├── 2.jpg
│   │   │   │   ├── 3.jpg
│   │   │   │   ├── 4.jpg
│   │   │   │   └── 5.jpg
│   │   │   ├── love-all/
│   │   │   │   ├── 1.jpg
│   │   │   │   ├── 2.jpg
│   │   │   │   ├── 3.jpg
│   │   │   │   └── 4.jpg
│   │   │   ├── roja/
│   │   │   │   ├── 1.jpg
│   │   │   │   ├── 2.jpg
│   │   │   │   └── 3.jpg
│   │   │   ├── qameez/
│   │   │   │   ├── 1.jpg
│   │   │   │   ├── 2.jpg
│   │   │   │   └── 3.jpg
│   │   │   ├── indigo/
│   │   │   │   ├── 1.jpg
│   │   │   │   ├── 2.jpg
│   │   │   │   └── 3.jpg
│   │   │   └── ... (5-10 pieces total)
│   │   └── filters/
│   │       ├── feminine-silhouettes.jpg
│   │       └── masculine-cuts.jpg
│   └── videos/
│       ├── fabrics/
│       │   ├── delhi-silk-blue.mp4 (5-10 sec loops)
│       │   ├── jaipur-cotton.mp4
│       │   └── ... (5-10 fabric videos)
│       └── sachi/
│           ├── inspiration.mp4 (15 sec)
│           ├── journey.mp4 (25 sec)
│           ├── process.mp4 (30 sec)
│           └── ... (5 videos total)
└── (we'll create src/ and other files together)
```

### 3. Asset Creation Guide

**Piece Images** (1080x1920px - 9:16 aspect ratio)
- Use Canva/Figma or photos
- Consistent style/lighting
- Each piece gets its own folder
- Simple numbered names: 1.jpg, 2.jpg, 3.jpg
- 5-10 different pieces
- 3-5 images per piece

**Filter Images** (1080x1920px - 9:16 aspect ratio)
- Can be abstract/artistic
- Represent gender expression (feminine/masculine)
- High quality but can be simple

**Fabric Videos** (1080x1920 vertical preferred)
- 5-10 second loops
- Show fabric moving/draping
- Compress to <5MB using HandBrake
- Can download from Pexels if needed

**Sachi Videos** (1080x1920 vertical)
- Record on phone
- Simple scripts:
  - "Hi, I'm Sachi. I believe fashion should be personal..."
  - "I grew up in my mother's boutique..."
  - "Every fabric I choose has a story..."
- Natural lighting, authentic feel
- 15-30 seconds each

### 4. Content Writing

Create a document with:

**Philosophy Cards** (8-10 statements)
- "Fashion should come to me, not the other way around"
- "A piece feels more valuable when it's made just for me"
- "Small imperfections make a garment feel human"
- ... (write 5-7 more)

**Piece Information** (for each piece)
- Name: "Cassata" (or "Love All", "Roja", "Qameez", "Indigo")
- Story: 2-3 paragraphs about inspiration
- Tags: ["garden party", "when you're feeling creative", "for making an entrance"]
- Base Price: $500-1500 range
- Compatible Fabric Types: [silk, cotton, linen]
- Gender Category: feminine/masculine/both

Examples of tags (mix of occasions, moods, and moments):
- Occasions: garden party, gallery opening, cultural celebration, creative wedding guest
- Moods: when you're feeling bold, when you're feeling creative, when you want to stand out
- Moments: for making an entrance, intimate gathering vibes, festive but not formal

**Fabric Details** (for each fabric)
- Name: "Delhi Blue Silk"
- Caption: "Found in a 100-year-old shop"
- Tags: ["airy", "luminous", "drapes-well"]
- Type: silk
- Available Yards: 12


### 5. Technical Prep

**Git LFS** (if any video is >50MB)
```bash
# In your repo:
git lfs install
git lfs track "*.mp4"
git lfs track "*.mov"
git add .gitattributes
```

**Environment Variables** (save these)
```
VITE_ADMIN_PASSWORD=choose-a-secure-password
GITHUB_TOKEN=will-create-in-phase-10
```

**Contact Details**
- Sachi's phone: +1234567890
- WhatsApp: same or different?
- Instagram: @samesisters

### 6. Quick Quality Checklist

- [ ] All images are 1200x1600px (or at least same aspect ratio)
- [ ] All videos compressed to <5MB each
- [ ] Consistent visual style across assets
- [ ] Real content written (not lorem ipsum)
- [ ] Folder structure matches above exactly
- [ ] GitHub repo created and cloned
- [ ] Vercel account ready

### What We'll Build Together

Once you have all the above ready, we can start Phase 0 immediately. I'll handle:
- All code and configuration
- Component architecture  
- Animations and interactions
- Deployment setup
- Admin UI development

You just need to:
- Provide the assets and content
- Test on real devices
- Make design decisions when asked
- Handle external accounts

This way, we can move smoothly through all phases without stopping for asset creation!