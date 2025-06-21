#!/bin/bash
# Скрипт для періодичної реіндексації таблиць в базі даних PostgreSQL

# Виходити з помилкою, якщо будь-яка команда завершиться невдало
set -e 

# --- Налаштування ---
DB_USER="postgres"
DB_NAME="ezoteric"
LOG_FILE="/var/log/reindex_db.log"

# Таблиці, для яких потрібно виконати REINDEX. Додавайте нові за потреби.
TABLES_TO_REINDEX=(
  "ezo_article"
  "ezo_tests"
  "ezo_article_views"
  "ezo_test_views"
  "ezo_tags"
)
# ------------------

# Функція для логування з часовою міткою
log() {
  echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> "$LOG_FILE"
}

log "======= Початок завдання реіндексації ======="

for table in "${TABLES_TO_REINDEX[@]}"; do
  log "Починаю реіндексацію для таблиці: $table"
  
  # Виконуємо REINDEX CONCURRENTLY, щоб не блокувати таблицю
  if psql -U "$DB_USER" -d "$DB_NAME" -c "REINDEX TABLE CONCURRENTLY $table;" &>> "$LOG_FILE"; then
    log "Успішно завершено реіндексацію для: $table"
  else
    log "ПОМИЛКА під час реіндексації таблиці: $table. Див. деталі вище."
    # set -e зупинить скрипт тут
  fi
done

log "======= Завдання реіндексації успішно завершено ======="
echo "" >> "$LOG_FILE" # Додаємо порожній рядок для кращої читабельності логів