# Confirm & Ship

Build a polished, responsive SaaS web application prototype called Confirm.tn for Tunisian e-commerce merchants who sell using Cash on Delivery.

The purpose of the product is to help merchants reduce failed deliveries and returned COD orders by:

- confirming orders automatically

- tracking customer history

- calculating an order risk score

- showing high-risk orders before shipment

- simulating WhatsApp confirmation conversations

- showing useful operational analytics

This is an MVP for customer validation, so prioritize clarity, realism, and presentation quality over complex backend logic.

Tech stack

Use:

- React / Next.js

- TypeScript

- Tailwind CSS

- shadcn/ui

- Supabase for authentication and database if backend functionality is needed

The app must be responsive and look professional on both desktop and mobile.

Do not build a mobile app.

Product style

Create a clean modern B2B SaaS dashboard.

Visual direction:

- professional

- simple

- trustworthy

- fintech/logistics SaaS feeling

- spacious dashboard

- clear status indicators

- minimal unnecessary decoration

Use green for successful/low-risk states, orange for medium risk, and red for high risk.

Main currency: TND / DT

Primary language of the dashboard: French

Use Tunisian names, cities, addresses and realistic example orders.

The simulated WhatsApp messages can use Tunisian Arabic written in Arabic script mixed naturally with French words such as "commande", "taille", and "livraison".

---

Authentication

Create:

Login page

Fields:

- Email

- Mot de passe

Buttons:

- Se connecter

- Créer un compte

Include a demo login shortcut:

Voir la démo

The demo should open directly into the dashboard without requiring real registration.

---

Main application layout

Desktop:

- left sidebar

- top navigation

- main content area

Mobile:

- collapsible navigation

Sidebar menu:

- Tableau de bord

- Commandes

- Clients

- Confirmations

- Risques

- Livraisons

- Analytics

- Paramètres

At the bottom show:

Fashion Store TN

Plan: Growth

---

Dashboard

Create a strong dashboard homepage.

Header:

Bonjour, Ahmed 👋

Subtitle:

Voici les performances de vos commandes aujourd'hui.

Add date selector:

Aujourd'hui / 7 derniers jours / 30 jours

KPI cards

Display:

Commandes aujourd'hui

147

+12% vs hier

Confirmées

112

76.2%

En attente

19

Annulées

16

Commandes à risque élevé

8

Valeur des commandes

12 840 DT

---

Main performance section

Create a chart titled:

Commandes des 7 derniers jours

Show:

- commandes reçues

- confirmées

- livrées

- retournées

Use realistic sample data.

---

Estimated savings card

Add a prominent card:

Impact estimé de Confirm.tn

420 DT économisés ce mois-ci

Supporting information:

- 14 expéditions à risque évitées

- 39 commandes récupérées après confirmation

- Taux de confirmation: 76.2%

Add a small disclaimer:

Estimation basée sur les commandes analysées.

---

Recent orders table

Title:

Commandes récentes

Columns:

- Commande

- Client

- Gouvernorat

- Montant

- Confirmation

- Risque

- Livraison

- Actions

Example data:

Order #1245

Ahmed Ben Salah

Tunis

89 DT

Confirmée

Risk 14 – Faible

Expédiée

Order #1246

Mariem Trabelsi

Sousse

145 DT

En attente

Risk 51 – Moyen

En attente

Order #1247

Mohamed Gharbi

Sfax

239 DT

Non confirmée

Risk 82 – Élevé

Bloquée

Order #1248

Sarra Jlassi

Nabeul

69 DT

Confirmée

Risk 8 – Faible

Livrée

Order #1249

Yassine Mansour

Ariana

189 DT

Confirmée

Risk 37 – Moyen

En préparation

Add filters:

- Toutes

- À risque élevé

- En attente

- Confirmées

- Retournées

Add search by:

- client

- téléphone

- order number

---

Orders page

Create a full orders management page.

Header:

Commandes

Buttons:

Importer CSV

Ajouter une commande

Allow filters by:

- date

- confirmation status

- risk level

- delivery status

- governorate

Clicking an order opens a detailed drawer or page.

---

Order detail

For order #1247 show:

Commande #1247

Client:

Mohamed Gharbi

Phone:

+216 22 845 671

Location:

Sfax

Product:

Nike Air Max

Size:

42

Color:

Noir

Amount:

239 DT

Payment:

Cash on Delivery

Status:

En attente de confirmation

---

Risk section

Make the risk score visually prominent.

Score de risque

82 / 100

Badge:

RISQUE ÉLEVÉ

Show a visual progress bar or gauge.

Then show:

Pourquoi cette commande est risquée ?

- +30 : 2 commandes précédentes retournées

- +20 : aucune réponse au premier message WhatsApp

- +17 : adresse incomplète

- +15 : panier supérieur à la moyenne

Display recommendation:

Recommandation

«Contactez le client avant d'expédier cette commande.»

Buttons:

- Appeler le client

- Envoyer confirmation WhatsApp

- Bloquer l'expédition

---

Customer history

Inside the order page show:

Historique client

4 commandes

Stats:

- Livrées: 1

- Retournées: 2

- En cours: 1

- Valeur totale: 517 DT

Timeline:

05 Aug 2026

89 DT

Returned

17 Jul 2026

120 DT

Returned

01 Jul 2026

69 DT

Delivered

Current

239 DT

Pending

---

Customers page

Create a customer management table.

Columns:

- Client

- Téléphone

- Total commandes

- Livrées

- Retournées

- Taux de réussite

- Niveau de risque

Example:

Ahmed Ben Salah

+216 55 123 456

8 orders

7 delivered

1 returned

87.5%

Low

Mohamed Gharbi

+216 22 845 671

4 orders

1 delivered

2 returned

25%

High

Clicking a customer opens full history.

---

Simulated WhatsApp confirmation

Create a page called:

Confirmations

Show WhatsApp-style conversation cards.

Example conversation:

Confirm.tn:

"عسلامة محمد 👋

نحبوا نأكدوا الـcommande متاعك:

Nike Air Max

Taille 42

Noir

239 DT

العنوان: Sfax

تأكدلنا الطلب؟"

Buttons shown inside the simulated message:

✅ تأكيد

✏️ تعديل

❌ إلغاء

Then customer reply:

"اي اما نحب taille 43"

Show AI interpretation card:

Réponse comprise

Intent:

CONFIRMATION AVEC MODIFICATION

Detected change:

Taille:

42 → 43

Result:

Commande confirmée

Show button:

Appliquer la modification

Then update order automatically in the prototype.

---

Confirmations overview

Display stats:

Messages envoyés today:

147

Réponses:

121

Confirmations:

112

Modifications:

9

Annulations:

16

Average response time:

4m 32s

---

Risk page

Create:

Centre de risque

Cards:

Risque élevé

8 commandes

Risque moyen

31 commandes

Risque faible

108 commandes

Table specifically listing high-risk orders.

Columns:

- Order

- Client

- Risk

- Main reason

- Amount

- Action

Example:

#1247

Mohamed Gharbi

82

Multiple previous returns

239 DT

Review

#1255

Houssem Ayari

78

No confirmation + incomplete address

320 DT

Review

#1262

Imen Saidi

73

Previous return

189 DT

Review

---

Risk rules page

Under Risques, add a secondary tab:

Règles de scoring

Display editable rules:

Previous returned order:

+25

2+ returned orders:

+45

Incomplete address:

+15

No WhatsApp response:

+20

Order value > 3× average:

+10

3+ successful deliveries:

-20

Immediate confirmation:

-10

Show:

Score minimum: 0

Score maximum: 100

Risk categories:

0–30:

Faible

31–60:

Moyen

61–100:

Élevé

For the prototype, values can be simulated.

---

Delivery page

Create:

Livraisons

Statuses:

- À préparer

- Expédiée

- En transit

- Livrée

- Retournée

Display orders grouped by delivery status.

Show a courier field such as:

- Aramex

- Rapid Poste

- Mylerz

- Transporteur local

These are demo values only.

---

Analytics page

Create a useful analytics dashboard.

Charts:

Taux de confirmation

Taux de livraison

Taux de retour

Retours par gouvernorat

Use:

- Tunis

- Sfax

- Sousse

- Ariana

- Nabeul

- Ben Arous

- Bizerte

- Jendouba

Add:

Principales raisons des commandes risquées

Pie or bar chart:

- historique de retour

- absence de réponse

- adresse incomplète

- panier inhabituel

- modifications fréquentes

---

Business impact section

Create a special analytics card:

Coût estimé des retours

Without Confirm.tn:

1 180 DT / mois

Estimated with Confirm.tn:

760 DT / mois

Potential savings:

420 DT / mois

This is demo data and should be marked clearly as estimated.

---

CSV import page

Create a simple import flow.

Button:

Importer un fichier CSV

Expected columns:

- customer_name

- phone

- product

- quantity

- amount

- address

- governorate

After upload show:

500 commandes détectées

487 valides

13 nécessitent une correction

Button:

Importer les commandes

This can be simulated in the MVP.

---

Settings

Create settings sections:

Entreprise

Name:

Fashion Store TN

Phone

Email

Logo

---

WhatsApp

Status:

Mode démo

Display:

"Pour cette version MVP, les conversations WhatsApp sont simulées."

Button:

Connecter WhatsApp Business

The button does not need real Meta integration yet.

---

Risk model

Toggle:

Calcul automatique du risque

Threshold:

Block shipment when risk exceeds:

75

---

Notifications

Toggle:

- High-risk order

- Customer cancellation

- Returned order

- No response after 30 min

---

Pricing page

Create a pricing page accessible from the user menu.

Starter

29 DT/month

- up to 100 orders

- order management

- confirmation dashboard

- basic risk scoring

Button:

Essayer

---

Growth

79 DT/month

- up to 500 orders

- WhatsApp automation

- customer history

- risk scoring

- analytics

Mark as:

Recommandé

---

Pro

149 DT/month

- up to 1,500 orders

- advanced risk rules

- delivery analytics

- priority support

- advanced reporting

---

Landing page

Also create a public landing page for Confirm.tn.

Hero:

Réduisez vos commandes COD retournées.

Subtitle:

Confirmez automatiquement vos commandes, détectez les commandes à risque et évitez les expéditions inutiles.

Primary CTA:

Voir la démo

Secondary CTA:

Essayer gratuitement

Three benefits:

Confirmez automatiquement

Vos commandes sont vérifiées avant expédition.

Détectez les risques

Identifiez les commandes qui ont le plus de chances d'être retournées.

Réduisez vos pertes

Évitez les coûts inutiles de livraison et de retour.

---

Landing page problem section

Title:

Chaque colis retourné vous coûte de l'argent.

Show a simple flow:

Commande reçue

→ Confirmation

→ Analyse du risque

→ Expédition

→ Livraison

Highlight:

Confirm.tn intervient avant l'expédition.

---

Demo simulation

The application should feel functional.

Allow these demo interactions:

- click an order

- change status

- send simulated WhatsApp confirmation

- simulate customer reply

- change product size

- mark order confirmed

- change risk score

- filter high-risk orders

- import fake CSV

- navigate between dashboards

Use local state or mock database data if needed.

Do not spend time integrating external APIs for the first version.

---

Demo data

Generate at least 40 realistic Tunisian orders.

Use realistic Tunisian names such as:

Ahmed Ben Salah

Mariem Trabelsi

Mohamed Gharbi

Sarra Jlassi

Yassine Mansour

Imen Saidi

Houssem Ayari

Rayen Chaabane

Amira Ben Amor

Aziz Bouzid

Use Tunisian governorates.

Order values should range approximately from:

35 DT to 450 DT

Include:

- successful customers

- first-time customers

- customers with previous returns

- high-risk customers

- cancelled orders

- delivered orders

---

UX requirements

Every risk status must be easy to understand.

Use:

🟢 Faible

🟠 Moyen

🔴 Élevé

Users should always understand why a score exists.

Never display only:

"Risk 82"

Always also display the reasons.

Make the application feel like a real SaaS product that could be demonstrated to an e-commerce merchant tomorrow.

---

Important MVP limitations

Do NOT implement yet:

- real WhatsApp API

- real courier integrations

- real machine learning

- voice calls

- mobile application

- complex billing

- advanced AI agents

Simulate these elements where required.

The objective is:

Build a visually convincing, interactive MVP that can be shown to Tunisian COD merchants to validate whether they are willing to use and pay for the product.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5485e21d-c662-40f4-9301-f95954fb00be).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
