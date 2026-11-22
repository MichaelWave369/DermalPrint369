# DermalPrint369 / MercyInk Studio

Human-supervised tattoo safety workflow and design simulation from PHI369 Labs.

**Live studio:** https://michaelwave369.github.io/DermalPrint369/

> CONCEPT RESEARCH ONLY. The software does **not** control a tattoo machine, power needles, sense skin, certify sterile materials, validate depth, or authorize real procedures. All consumable identifiers and session receipts are **fictional simulation fixtures**.

## What works in v0.1

- **Overview:** research thesis and human-centered design laws.
- **Design studio:** three synthetic dot-pattern generators, density and scale controls, permitted flat-zone selection, and export of a .dermal JSON manifest.
- **Session simulator:** intake, separate artist/client approvals, fictional cartridge verification, dry-run acknowledgment, virtual dot-progress simulation, pause/resume, motion fault injection, abort and audit trail.
- **Receipt export:** machine-readable demonstration receipt JSON, explicitly marked as simulated.
- **Material ledger:** fictional ink/cartridge identifiers with a transparent list of evidence missing before physical use.
- **Safety architecture:** ten design laws and hazards with clearly marked evidence status.
- **Roadmap:** traceability first; synthetic/bench validation before any potential supervised work.

## Run locally

This release is intentionally a zero-build static React application. Open from any local HTTP server:

    python -m http.server 8080

Then visit http://localhost:8080. Internet access is required to load React from esm.sh and fonts from Google Fonts. No database or authentication is used. The app never uploads client or body data. No real-client data entry is supported.

## Data models

Design downloads use the .dermal extension with JSON contents, schema 'dermalprint369.design.v0.1'. Receipts use schema 'dermalprint369.session_receipt.v0.1'. These are concept schemas, not production standards or validated cryptographic receipts. Do not rely on them as medical, legal or sterilization records.

## Source

Implemented from *DermalPrint369 / MercyInk Studio — Master Product + Safety Architecture Spec v0.1*, dated June 4, 2026, prepared by PHI369 Labs / Michael Hughes + Ori. Research stages in the source: SafeInk kit, guided pen, flat-zone MicroDot, clinical/PMU assist, and a separately gated ink lab.

## Guardrails for future contributors

1. Never add live robot/motor/needle controls to the public demonstration.
2. Keep all demo data explicitly fictional. Never imply a sample lot is sterile or regulatory-compliant.
3. No real-human pilots without independent multidisciplinary review, operator training, legal/regulatory counsel, insurance and laboratory validation.
4. Never market tattoo pigment as healthy, non-toxic, hypoallergenic, painless, or risk-free without suitable evidence.
5. Keep artist authority and exact client consent central. Client stop must remain available in any eventual validated physical system.
6. Maintain local-first privacy; avoid collecting or transmitting body photos or sensitive history.

## Roadmap

- [x] v0.1 interactive static React safety/workflow simulator
- [ ] Formal JSON Schema and deterministic design hashing
- [ ] Simulation unit and fault-injection tests
- [ ] Accessibility review and keyboard-only walkthrough
- [ ] Independent regulatory, ink chemistry, artist and product-safety consultations
- [ ] Separated, reviewed bench-hardware proof of concept

## Licensing

MIT, subject to third-party asset and library licenses. No permission for unsafe human use is implied by the software license.
