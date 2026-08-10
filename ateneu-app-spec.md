# 📋 Ateneu Events — Specificație Proiect

> Aplicație web pentru gestionarea evenimentelor echipei tehnice de la Ateneu

---

## Cuprins

1. [Context și scop](#context-și-scop)
2. [Roluri](#roluri)
3. [Flux de autentificare](#flux-de-autentificare)
4. [Schema de date](#schema-de-date)
5. [Fluxuri funcționale](#fluxuri-funcționale)
6. [Stack tehnic](#stack-tehnic)
7. [Securitate](#securitate)
8. [Hosting](#hosting)
9. [Scalabilitate viitoare](#scalabilitate-viitoare)

---

## Context și scop

Aplicație web internă pentru echipa tehnică de la Ateneu (inițial **Sunet**, extensibilă pe viitor la **Lumini** și alte echipe).

Adminul creează evenimente (nume, dată, oră, locație, descriere, echipamente necesare), membrii sunt notificați automat pe email, și confirmă sau declină prezența direct din aplicație.

| | |
|---|---|
| **Scară inițială** | 5-6 utilizatori |
| **Design** | Responsive — membri pe telefon, admin pe laptop |
| **Tip proiect** | Portofoliu + uz real |

---

## Roluri

### `super_admin`
Cont creat manual, o singură dată, printr-un script de seed (nu prin înregistrare). Generează coduri de invitație de tip `admin` pentru echipe noi sau existente.

### `admin`
Unul per echipă. Generează coduri de invitație de tip `member` pentru propria echipă. Creează, editează și șterge (soft delete) evenimente pentru echipa lui.

### `member`
Confirmă/declină prezența la evenimente. Poate solicita altui membru să-i preia locul dacă nu poate participa.

---

## Flux de autentificare

**1. Înregistrare** (o singură dată per persoană)
- Utilizatorul primește un cod de invitație (de la `super_admin` pentru admini, de la `admin` pentru membri, specific unei echipe)
- Intră pe `/join`, completează: cod + nume + email + parolă
- Codul devine `used`, nu mai poate fi refolosit

**2. Login** (de fiecare dată după)
- Email + parolă pe `/login`
- Backend-ul recunoaște rolul din baza de date
- Frontend redirecționează automat: `/admin` sau `/` (dashboard membru)

**3. Cont super_admin**
- Creat separat, printr-un script de seed
- Credențialele se citesc din `.env`, niciodată hardcodate în cod

---

## Schema de date

```
Team
├── id
└── name

User
├── id
├── name
├── email          (unic)
├── passwordHash
├── role           (super_admin / admin / member)
├── teamId
└── createdAt

InvitationCode
├── id
├── code           (unic)
├── role           (admin / member)
├── teamId
├── used           (bool)
├── usedByUserId
└── createdAt

Event
├── id
├── title
├── date
├── time
├── location
├── description
├── equipmentNeeded
├── teamId
├── createdByUserId
├── status         (upcoming / expired / cancelled)
└── deletedAt      (soft delete)

EventAttendance
├── id
├── eventId
├── userId
├── status         (pending / confirmed / declined)
└── markedBy       (self / admin)

SwapRequest
├── id
├── eventId
├── fromUserId
├── toUserId
├── status         (pending / accepted / declined)
├── createdAt
└── respondedAt
```

---

## Fluxuri funcționale

### Evenimente
- Admin **creează** eveniment → toți membrii echipei primesc email cu detaliile
- Admin **editează** eveniment → toți membrii primesc email nou, marcat ca actualizare
- Admin **șterge** eveniment → soft delete, rămâne în bază, nu mai apare în listă
- **Job automat (cron)** mută evenimentele trecute în status `expired`, vizibile în istoric

### Prezență
- Membrul vede evenimentele viitoare, apasă **„Vin"** sau **„Nu vin"**
- Adminul poate corecta manual statusul cuiva (`markedBy: admin`)

### Swap (schimb de loc)
1. Membrul care nu mai poate participa alege **un** alt membru anume și-l solicită
2. Persoana solicitată primește email: *„[Nume] te-a rugat să vii în locul lui la [Eveniment]"*
3. Acceptă sau refuză din aplicație
4. Dacă acceptă → devine `confirmed`, adminul primește email cu schimbarea

> Fără capacitate limitată de locuri — orice număr de membri poate confirma prezența, e strict informativ.

---

## Stack tehnic

### Backend
- **NestJS** (ultima versiune stabilă)
- **Prisma ORM**
- **PostgreSQL**
- **Passport + JWT** (autentificare)
- **bcrypt** (hash parole)
- **Resend** (email-uri automate)
- **@nestjs/throttler** (rate limiting pe login)
- **class-validator / class-transformer** (validare input server-side)

### Frontend
- **Angular 19+** (standalone components, Signals)
- **Tailwind CSS**
- **Angular Router** cu route guards pe rol (admin/member)

### Bază de date
- **PostgreSQL** găzduit pe **Neon** (free tier, fără expirare)

### Organizare cod
- **Monorepo** — `backend/` și `frontend/` în același repo Git

---

## Securitate

- ✅ Parole hash-uite cu **bcrypt**, niciodată stocate în clar
- ✅ Toate secretele (parole, connection strings, API keys) în `.env`, exclus din Git
- ✅ **HTTPS** automat prin platformele de hosting
- ✅ **Rate limiting** pe login, împotriva atacurilor brute-force
- ✅ **Validare input** pe server (nu doar frontend)
- ✅ Protecție **XSS** implicită prin Angular (fără `innerHTML`/`bypassSecurityTrust*` manual)

---

## Hosting

*(etapă ulterioară, după ce aplicația e funcțională local)*

| Componentă | Platformă | Notă |
|---|---|---|
| Backend | Render (free) | Adoarme după 15 min inactivitate |
| Frontend | Vercel (free) | — |
| Bază de date | Neon (free) | Permanent, fără expirare |
| Keep-alive | cron-job.org / Cloudflare Workers | Ping la 10-14 min, ca backend-ul să nu adoarmă |

---

## Scalabilitate viitoare

- [ ] Echipa de **Lumini** (și posibil altele) — structura de `Team` există deja, doar se generează cod nou de admin
- [ ] **Export Excel** cu istoric prezență per membru/eveniment
- [ ] Roluri suplimentare de editare în cadrul unei echipe (nu doar un singur admin)

---

*Ultima actualizare: pornire proiect — stack fixat pe NestJS + Prisma + PostgreSQL + Angular 19*
