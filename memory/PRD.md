# Bagmar Jewellers — PRD

## Original problem statement
Luxury jewellery CATALOGUE website (NOT ecommerce — WhatsApp "Enquire" buttons, no cart) for Bagmar Jewellers, Sadar Bazar, Bolarum, Secunderabad · +91 90301 28008 · 10 AM–9 PM. Pull existing project from GitHub and continue improving; keep Firebase as-is (client-side), work on frontend only.

## Architecture
- React (CRA + craco) frontend + Firebase (Firestore, Email/Password Auth, client uploads). Serverless.
- The /backend (FastAPI/Mongo) folder is RETIRED reference code, unused.
- Data (products, categories, gold rates, hero slides) lives in Firestore with mock fallback in src/data/catalogue.js.
- Firebase config in frontend/.env (REACT_APP_FIREBASE_*).
- Repo: github.com/swayammassey/bagmar-jewellers · Live: bagmar-jewellers.vercel.app

## Design system
- Ivory #FAF9F6 + gold #C5A059 + wine #722F37. Fonts: Marcellus + Jost (+ Cormorant/Cinzel accents in build).
- Motifs: hairline gold frames, Roman-numeral watermarks, editorial marquees, gold-sweep buttons, wine gold-rate ticker.
- Motion: framer-motion (scroll reveals, masked hero reveal, 3D tilt) + lenis smooth scroll.

## Pages
- / (hero carousel, category mosaic, featured strip, trust bar, heritage + chapters, instagram grid, visit us w/ map)
- /collections/:slug, /product/:id, /admin/login, /admin (dashboard CRUD)

## Done (2026-06)
- Pulled full repo into this Emergent environment, wired frontend/.env with Firebase config, installed deps (firebase, lenis), running via supervisor.
- Verified home, collections, product, admin login all render with live Firestore data.

## Backlog / next
- P1: Award-worthy motion polish pass (stronger hero kinetic moment, section parallax, micro-interactions).
- P2: Enquiry analytics (log WhatsApp taps), featured reorder in admin, testimonials strip, store-info editor.
- P2: Image storage decision (Firebase Blaze vs Cloudinary), live gold-rate API, real Instagram links, custom domain.
