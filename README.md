# IntlConnect @CMU

## 📌 Overview
The **LINE-Based "IntlConnect @CMU"** is designed to help **international students** at **Chiang Mai University (CMU)** stay informed with notification updates. It provides **weather forecasts, air quality index alerts, and CMU news/events** in **English** via LINE, ensuring accessibility and engagement.

## 🚀 Features
### 🔹 For International Students
- 📢 **Updated notifications** for weather, AQI, and CMU news/events.
- 🌍 **English-language updates** to overcome language barriers.
- 📲 **LINE integration** for easy access and engagement.
- 🔔 **Scheduled alerts** (weather: daily, AQI: three times a day at 6:00, 12:00, and 18:00).

### 🔹 For Admins
- 🛠️ **Admin dashboard** for managing notifications.
- 🔄 **Manual alerts** for event announcements and urgent news.
- ⚙️ **Toggle notifications on/off** as needed.

## Getting Started

## Prerequisites
Before running the project, ensure you have the following installed:

- [Bun](https://bun.sh/)
- [PostgreSQL Server](https://www.postgresql.org/)

## Environment Setup

1. Copy the `.env` template:
   ```sh
   cp template.env .env
   ```
2. Open `.env` and update the following variables:
   ```env
   DATABASE_URL=postgres://username:password@localhost:5432/database
   AQI_TOKEN=
   WEATHER_TOKEN=
   ```
   Replace `username`, `password`, and `database` with your actual PostgreSQL credentials.
   AQI Token
   WEATHER Token
   ```

## Development Setup

For local development without Docker:

1. Install dependencies:
   ```sh
   bun install
   ```
2. Start the development server:
   ```sh
   bun start
   ```

## Troubleshooting

- **Database Connection Issues**: Ensure PostgreSQL is running and the `DATABASE_URL` in `.env` is correctly set.
- **Bun Issues**: If `bun install` fails, try updating Bun using:
  ```sh
  bun upgrade
  ```

---