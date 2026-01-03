# 🎮 RPG Life Planner

**Transform your life into a tactical RPG with weighted quest scoring and cyberpunk aesthetics.**

A gamified task management dashboard designed for the "Neural Alchemist" — built to track quests, manage subtasks, and level up your real-world stats (Intelligence, Wealth, Strength) through a strategic quest completion system.

[![License: MIT](https://img.shields.io/badge/License-MIT-cyan.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-purple.svg)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-Powered-emerald.svg)](https://supabase.com/)

---

## ✨ Features

### 🎯 **Quest Management**
- **Weighted Decision Matrix**: Assign custom weights (0-20) to Intelligence, Wealth, and Strength for each quest
- **Dynamic Ranking System**: Quests automatically ranked as LEGENDARY (16+ pts), EPIC (11-15 pts), or COMMON (0-10 pts)
- **5x5 Bingo Board**: Visual grid displaying your top 25 highest-impact quests
- **Subtask Tracking**: Break down quests into actionable tasks with completion tracking
- **Progress Visualization**: Real-time completion percentages and progress bars

### 📅 **Deadline & Progress Tracking**
- **Quest Deadlines**: Set due dates with smart countdown displays
- **Next Deadline Widget**: Always know what's coming up next with color-coded urgency
- **Bingo Progress Metrics**: Track overall completion percentage across all active quests

### 🎨 **Cyberpunk UI/UX**
- **Neural Alchemist Theme**: Deep slate backgrounds with cyan, emerald, and purple accents
- **Tactical RPG Aesthetics**: Hexagon grids, chamfered frames, and holographic effects
- **Animated Stat Bars**: Dynamic progress indicators with gradient fills
- **Responsive Design**: Optimized for desktop and mobile viewing

### 📊 **Character Profile**
- **Live Stats Display**: Track your INT, WLT, and STR attributes
- **Level System**: Gain XP by completing quests
- **Profile Badge**: Showcase your Neural Alchemist identity

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | Frontend framework with hooks and modern patterns |
| **Vite** | Lightning-fast build tool and dev server |
| **Tailwind CSS** | Utility-first styling with custom cyberpunk theme |
| **Supabase** | PostgreSQL database with real-time capabilities |
| **Lucide React** | Beautiful icon library for UI elements |

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account ([sign up free](https://supabase.com))
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/maercaestro/rpg-planner.git
cd rpg-planner
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Get your Supabase credentials:**
- Go to [Supabase Dashboard](https://app.supabase.com)
- Select your project
- Navigate to Settings → API
- Copy `Project URL` and `anon/public key`

### 4. Database Setup

Run the following SQL migrations in your Supabase SQL Editor (in order):

**a) Create Tables:**
```sql
-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  username TEXT,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  stats JSONB DEFAULT '{"INT": 0, "WLT": 0, "STR": 0}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quests table
CREATE TABLE quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  deadline DATE,
  gives_int BOOLEAN DEFAULT false,
  gives_wlt BOOLEAN DEFAULT false,
  gives_str BOOLEAN DEFAULT false,
  weight_int INTEGER DEFAULT 0,
  weight_wlt INTEGER DEFAULT 0,
  weight_str INTEGER DEFAULT 0,
  score INTEGER DEFAULT 0,
  rank TEXT DEFAULT 'COMMON',
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Quest tasks table
CREATE TABLE quest_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quest_id UUID REFERENCES quests(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**b) Insert Fixed User Profile:**
```sql
INSERT INTO profiles (id, user_id, username, level, xp, stats)
VALUES (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000000',
  'Abu Huzaifah',
  14,
  0,
  '{"INT": 92, "WLT": 68, "STR": 75}'::jsonb
);
```

**c) Create Complete Quest Function:**
```sql
CREATE OR REPLACE FUNCTION complete_quest(quest_id UUID, user_id UUID)
RETURNS JSON AS $$
DECLARE
  quest_record RECORD;
  profile_record RECORD;
  new_stats JSONB;
BEGIN
  -- Get quest details
  SELECT * INTO quest_record FROM quests WHERE id = quest_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Quest not found');
  END IF;

  -- Get profile
  SELECT * INTO profile_record FROM profiles WHERE profiles.user_id = complete_quest.user_id;

  -- Calculate new stats
  new_stats := profile_record.stats;
  new_stats := jsonb_set(new_stats, '{INT}', ((new_stats->>'INT')::int + quest_record.weight_int)::text::jsonb);
  new_stats := jsonb_set(new_stats, '{WLT}', ((new_stats->>'WLT')::int + quest_record.weight_wlt)::text::jsonb);
  new_stats := jsonb_set(new_stats, '{STR}', ((new_stats->>'STR')::int + quest_record.weight_str)::text::jsonb);

  -- Update profile
  UPDATE profiles 
  SET stats = new_stats,
      xp = xp + quest_record.score
  WHERE profiles.user_id = complete_quest.user_id;

  -- Mark quest as completed
  UPDATE quests SET is_completed = true WHERE id = quest_id;

  RETURN json_build_object('success', true, 'new_stats', new_stats);
END;
$$ LANGUAGE plpgsql;
```

**d) Disable Row Level Security (for personal use):**
```sql
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE quests DISABLE ROW LEVEL SECURITY;
ALTER TABLE quest_tasks DISABLE ROW LEVEL SECURITY;
```

### 5. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to see your dashboard.

---

## 📦 Deployment (Vercel)

### 1. Push to GitHub
Your repository is already at: `https://github.com/maercaestro/rpg-planner.git`

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import `rpg-planner` repository
4. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add **Environment Variables**:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_key
   ```
6. Click **"Deploy"**

Your app will be live at `https://rpg-planner.vercel.app` (or your custom domain).

---

## 🎯 Usage Guide

### Creating a Quest
1. Click **"+ ADD QUEST"** button
2. Enter quest title and optional description
3. Set deadline (optional)
4. Adjust stat weight sliders (0-20 points each):
   - **INT**: Learning, skills, knowledge-based tasks
   - **WLT**: Income, investments, financial goals
   - **STR**: Health, fitness, physical challenges
5. View live impact score and rank
6. Click **"CREATE QUEST"**

### Managing Subtasks
1. Click any quest card on the Bingo Board
2. Add subtasks with **"+ ADD TASK"**
3. Check off tasks as you complete them
4. Track progress with the visual progress bar

### Completing Quests
1. Click the circle button on a quest card
2. Your profile stats automatically update
3. XP is awarded based on quest score

---

## 🗂️ Project Structure

```
rpg-planner/
├── src/
│   ├── components/
│   │   ├── Layout.jsx          # Main wrapper with hexagon grid background
│   │   ├── Header.jsx           # Top navigation bar
│   │   ├── ProfileCard.jsx      # Character stats and level display
│   │   ├── QuestStats.jsx       # Deadline and bingo progress widgets
│   │   ├── QuestBoard.jsx       # Quest management container
│   │   ├── AddQuestForm.jsx     # Quest creation modal
│   │   ├── BingoBoard.jsx       # 5x5 quest grid display
│   │   └── QuestDetail.jsx      # Quest editing and subtask management
│   ├── assets/
│   │   └── character-badge.png  # Profile portrait
│   ├── supabaseClient.js        # Supabase initialization
│   ├── App.jsx                  # Root component
│   ├── main.jsx                 # App entry point
│   └── index.css                # Global styles
├── supabase/
│   ├── complete_quest.sql       # RPC function for quest completion
│   ├── add_quest_tasks.sql      # Migration for subtasks table
│   └── add_deadline_column.sql  # Migration for deadline field
├── public/                       # Static assets
├── .env.example                 # Environment variables template
├── package.json
└── README.md
```

---

## 🔮 Future Roadmap

- [ ] **Real-time Stat Sync**: Connect ProfileCard to live database updates
- [ ] **Achievement System**: Unlock badges for milestones
- [ ] **Daily Goals**: Track streaks and daily objectives
- [ ] **Quest Categories**: Organize quests by life domains
- [ ] **Data Export**: Download quest history as JSON/CSV
- [ ] **Multi-user Support**: Authentication and user isolation (if expanding commercially)
- [ ] **Mobile App**: React Native companion app
- [ ] **AI Quest Suggestions**: LLM-powered quest generation based on goals

---

## 📄 License

This project is licensed under the **MIT License** - see below for details:

```
MIT License

Copyright (c) 2026 Abu Huzaifah

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🤝 Contributing

Currently, this is a **personal-use project**. However, if you have ideas or find bugs, feel free to:
- Open an issue on GitHub
- Fork the repo and submit a pull request

If there's commercial interest in expanding to a multi-user platform, contributions will be more formally managed.

---

## 💡 Acknowledgments

- **Design Inspiration**: Cyberpunk 2077, Tactical RPGs, Neural Interface Aesthetics
- **Built by**: Abu Huzaifah (Neural Alchemist, LVL 14)
- **Stack**: React + Vite + Supabase + Tailwind CSS

---

## 📞 Support

For issues or questions:
- **GitHub Issues**: [rpg-planner/issues](https://github.com/maercaestro/rpg-planner/issues)
- **Email**: [research@ahead-huzaifah.com]

---

**⚡ Level up your life, one quest at a time. ⚡**
