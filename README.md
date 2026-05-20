# Upmind — Strategic Consulting for Startups

A modern, professional consulting website built with **Next.js 16**, **Tailwind CSS 4**, **Framer Motion**, and **shadcn/ui**.

![Upmind Screenshot](public/images/hero.jpg)

## ✨ Features

- 🎨 Dark green + lime green professional color scheme
- 📱 Fully responsive (mobile, tablet, desktop)
- 🎬 Smooth scroll animations with Framer Motion
- 🔄 Interactive carousels (How We Work, Testimonials)
- 🧭 Sticky navbar with scroll effect
- 🖼️ Optimized AI-generated images
- 🔤 Plus Jakarta Sans + Inter professional font pairing
- ♿ Accessible (semantic HTML, ARIA labels, keyboard navigation)

## 📂 Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Main page (all sections)
│   └── globals.css         # Global styles & Tailwind
├── components/
│   ├── Navbar.tsx          # Fixed navigation bar
│   ├── Hero.tsx            # Hero section with CTA
│   ├── Stats.tsx           # Statistics section
│   ├── Partners.tsx        # Partner logos
│   ├── About.tsx           # About section with performance card
│   ├── Services.tsx        # Three service cards
│   ├── HowWeWork.tsx       # Step carousel with image
│   ├── Testimonials.tsx    # Quote carousel
│   ├── Pricing.tsx         # Two pricing plans
│   ├── Blog.tsx            # Blog article cards
│   ├── CTASection.tsx      # Final call-to-action
│   └── Footer.tsx          # Multi-column footer
└── components/ui/          # shadcn/ui components
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun
- npm, yarn, or bun

### Install & Run

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/upmind.git
cd upmind

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🌐 Deploy to Vercel (Recommended)

### One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/upmind)

### Manual Deploy

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → Sign in with GitHub
3. Click **"New Project"** → Import your repo
4. Vercel auto-detects Next.js → Click **Deploy**
5. Your site is live at `upmind.vercel.app` 🎉

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **Next.js 16** | React framework with App Router |
| **TypeScript 5** | Type-safe development |
| **Tailwind CSS 4** | Utility-first styling |
| **shadcn/ui** | UI component library |
| **Framer Motion** | Scroll & entrance animations |
| **Lucide React** | Icon library |
| **Plus Jakarta Sans** | Heading font (Google Fonts) |
| **Inter** | Body font (Google Fonts) |

## 📝 Customization

### Change Colors
Edit the color values in `src/app/globals.css` and throughout the components:
- `#1A2E1A` — Dark green (backgrounds)
- `#7CFC00` — Lime green (accents, buttons)
- `#0F1F0F` — Very dark green (footer)

### Change Content
Edit the text content directly in each component file under `src/components/`.

### Replace Images
Replace images in the `public/images/` directory:
- `hero.jpg` — Hero section background
- `howwework.jpg` — How We Work section
- `forest-cta.jpg` — CTA section background
- `blog1.jpg`, `blog2.jpg`, `blog3.jpg` — Blog cards
- `testimonial1.jpg` — Testimonial avatar

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ using Next.js + Tailwind CSS
