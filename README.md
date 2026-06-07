# 🃏 Card Draw Probability Calculator

**เครื่องคำนวณความน่าจะเป็นในการจั่วการ์ด**

A bilingual (Thai / English) web-based calculator for computing the probability of drawing specific card combinations from a deck, using the **Multivariate Hypergeometric Distribution**.

---

## 🌐 Language / ภาษา

The interface supports **Thai (ไทย)** and **English (EN)**.  
Toggle the language using the **`EN` / `ไทย`** button in the top-right corner.  
Your preference is saved automatically.

รองรับภาษา **ไทย** และ **English** — กดปุ่ม **`EN` / `ไทย`** ที่มุมขวาบนเพื่อเปลี่ยนภาษา

---

## ✨ Features / ฟีเจอร์

| Feature | รายละเอียด |
|---|---|
| 🌐 Bilingual UI (TH / EN) | อินเตอร์เฟซสองภาษา พร้อมสลับทันที |
| ➕ Multiple card types | เพิ่มชนิดการ์ดได้ไม่จำกัด |
| 🔢 Comparison operators | เลือกเงื่อนไข `<` `<=` `>=` `>` ต่อการ์ดแต่ละชนิด |
| 📊 Probability graph | กราฟแบบโต้ตอบ เลือกตัวแปรแกน X ได้ |
| 🌙 Dark / Light mode | สลับธีมสว่าง/มืด พร้อม OS auto-detect |
| ⚡ Fast math engine | คำนวณด้วย log-space arithmetic รองรับ deck ขนาดใหญ่ |
| 💾 Persistent settings | จำภาษาและธีมที่เลือกไว้ใน localStorage |

---

## 🔢 Comparison Operators / ตัวดำเนินการเปรียบเทียบ

Each card type supports four operators, letting you precisely express your draw condition:

| Operator | Meaning (EN) | ความหมาย (TH) | Example |
|:---:|---|---|---|
| `<` | Draw **fewer than** N cards of this type | จั่วการ์ดชนิดนี้ **น้อยกว่า** N ใบ | `< 2` → ได้ 0 หรือ 1 ใบ |
| `<=` | Draw **at most** N cards of this type | จั่วการ์ดชนิดนี้ **ไม่เกิน** N ใบ | `<= 2` → ได้ 0, 1 หรือ 2 ใบ |
| `>=` | Draw **at least** N cards of this type | จั่วการ์ดชนิดนี้ **อย่างน้อย** N ใบ | `>= 2` → ได้ 2 ใบขึ้นไป |
| `>` | Draw **more than** N cards of this type | จั่วการ์ดชนิดนี้ **มากกว่า** N ใบ | `> 1` → ได้ 2 ใบขึ้นไป |

> **Note:** All conditions across card types must be satisfied **simultaneously**.  
> The graph updates to reflect whichever operator is currently selected.

> **หมายเหตุ:** เงื่อนไขทุกชนิดการ์ดต้องเป็นจริงพร้อมกัน และกราฟจะสะท้อนตัวดำเนินการที่เลือกอยู่เสมอ

---

## 📐 Math Background / หลักการทางคณิตศาสตร์

The calculator uses the **Multivariate Hypergeometric Distribution**:

$$P = \frac{\sum \prod_{i} \binom{K_i}{x_i} \cdot \binom{R}{n - \sum x_i}}{\binom{N}{n}}$$

**Variables:**

| Symbol | Description |
|:---:|---|
| `N` | Total cards in the deck |
| `n` | Number of cards drawn |
| `Kᵢ` | Number of cards of type `i` in the deck |
| `xᵢ` | Number of cards of type `i` drawn (determined by operator & threshold) |
| `R` | Remaining cards not in any specified type |

To handle large factorials without overflow, all computations use **log-space arithmetic** (summing log-factorials instead of multiplying large integers).

---

## 🚀 Usage / วิธีใช้งาน

### 1. Set up the deck / ตั้งค่ากอง
- Enter the **total number of cards** in your deck (e.g. 40)
- Enter how many cards you will **draw** (e.g. 5 = opening hand)

### 2. Add card types / เพิ่มชนิดการ์ด
- Click **"+ เพิ่มชนิด"** / **"+ Add Type"**
- For each type, specify:
  - **Name** — a label for the card group
  - **In Deck** — how many copies are in the deck
  - **Operator + Threshold** — the draw condition (e.g. `>= 1` means "at least 1")

### 3. Calculate / คำนวณ
- Click **"คำนวณความน่าจะเป็น"** / **"Calculate Probability"**
- Results show: probability %, decimal, progress bar, odds ratio, and full condition summary

### 4. Graph / กราฟ
- Select an **X-axis variable** (e.g. "Cards to Draw")
- Set the range and click **"สร้างกราฟ"** / **"Generate Graph"**
- The graph reflects the current operators and thresholds of all card types

---

## 📁 File Structure / โครงสร้างไฟล์

```
├── index.html   — Main HTML structure with data-i18n attributes
├── app.js       — All logic: math engine, i18n, rendering, chart
├── style.css    — Design tokens, layout, components, dark/light themes
└── README.md    — This file
```

### Key sections in `app.js`

| Section | Description |
|---|---|
| `I18N` | All UI strings for Thai and English |
| `tr(key, ...args)` | Translation helper function |
| `calculateProbability()` | Core math with per-type operator support |
| `renderCardTypes()` | Dynamic card type form with operator selector |
| `validate()` | Input validation with operator-aware rules |
| `generateGraph()` | Sweeps a variable and plots probability curve |
| `renderChart()` | Chart.js integration with theme-aware colors |
| `applyLanguage()` | Switches all UI text to the target language |

---

## 🌙 Themes / ธีม

| Mode | Detection |
|---|---|
| **Auto** | Follows OS `prefers-color-scheme` |
| **Light** | Forced via toggle, saved to `localStorage` |
| **Dark** | Forced via toggle, saved to `localStorage` |

---

## ⚙️ Requirements / ความต้องการของระบบ

- Any modern browser (Chrome, Firefox, Safari, Edge)
- Internet connection (for Google Fonts + Chart.js CDN)
- **No build step required** — open `index.html` directly

ไม่ต้องติดตั้งอะไรเพิ่มเติม เปิดไฟล์ `index.html` ผ่าน browser ได้เลย

---

## 📄 License

Free to use and modify for personal and educational purposes.