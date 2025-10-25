# 🚗 Ewidencja Przebiegu Samochodów Służbowych

Aplikacja webowa PWA do zarządzania przebiegiem samochodów służbowych.

## ✨ Funkcje

- ✅ Dodawanie, edycja i usuwanie wpisów przebiegu
- 👤 Przypisanie wpisów do pracowników (pole: Nazwisko pracownika)
- 📊 Podsumowania miesięczne z podziałem na pracowników
- 💾 Archiwizacja danych z wyborem okresu
- ☁️ Synchronizacja z Google Sheets (opcjonalna)
- 📤 Eksport do CSV
- 📱 Działanie offline
- 🔒 Dane przechowywane lokalnie w przeglądarce

## 🚀 Instalacja na GitHub Pages

### Krok 1: Wgraj pliki na GitHub

1. Zaloguj się na GitHub.com
2. Kliknij "+" w prawym górnym rogu → "New repository"
3. Nazwa: `ewidencja-aut` (lub dowolna)
4. Zaznacz "Public"
5. Zaznacz "Add a README file"
6. Kliknij "Create repository"
7. Kliknij "Add file" → "Upload files"
8. Przeciągnij wszystkie pliki z tego folderu
9. Kliknij "Commit changes"

### Krok 2: Włącz GitHub Pages

1. Wejdź w **Settings** (zakładka na górze repozytorium)
2. Z lewej strony kliknij **Pages**
3. W sekcji "Source" wybierz branch **main**
4. Kliknij **Save**
5. Po chwili pojawi się link do Twojej aplikacji (np. `https://twoja-nazwa.github.io/ewidencja-aut`)

### Krok 3: Wygeneruj ikony

**Opcja A - Prosty sposób:**
- Wejdź na: https://www.favicon-generator.org/
- Wgraj logo firmy lub obrazek samochodu
- Pobierz wygenerowane ikony 192x192 i 512x512
- Zmień nazwy na `icon.png` i `icon-512.png`
- Wgraj je do repozytorium GitHub

**Opcja B - Użyj przykładowych ikon:**
- Stwórz prostą niebieską ikonę z inicjałami firmy
- Zapisz w dwóch rozmiarach: 192x192px i 512x512px
- Wgraj do repozytorium

## 📱 Instalacja aplikacji na urządzeniach

### Android (Chrome):
1. Otwórz link aplikacji w Chrome
2. Kliknij "Zainstaluj aplikację" (banner u dołu ekranu)
3. Gotowe! Ikona pojawi się na ekranie głównym

### iPhone/iPad (Safari):
1. Otwórz link w Safari
2. Kliknij przycisk "Udostępnij" (⬆️)
3. Wybierz "Dodaj do ekranu początkowego"
4. Kliknij "Dodaj"

### Windows 11 (Chrome/Edge):
1. Otwórz link w przeglądarce
2. Kliknij ikonę instalacji w pasku adresu
3. Lub: Menu (⋮) → "Zainstaluj aplikację"
4. Aplikacja pojawi się w Menu Start

## 📁 Struktura plików

```
ewidencja-aut/
├── index.html          # Główna aplikacja
├── manifest.json       # Konfiguracja PWA
├── service-worker.js   # Obsługa offline
├── icon.png            # Ikona 192x192px
├── icon-512.png        # Ikona 512x512px
└── README.md           # Ten plik
```

## 🔧 Technologie

- HTML5
- CSS3 (Responsive Design)
- Vanilla JavaScript
- PWA (Progressive Web App)
- LocalStorage API
- Service Worker

## 📝 Licencja

Wolne oprogramowanie - możesz używać i modyfikować według potrzeb.

## 🆘 Pomoc

Jeśli masz problemy z instalacją:
1. Upewnij się, że wszystkie pliki są w repozytorium
2. Sprawdź czy GitHub Pages jest włączony
3. Poczekaj 2-3 minuty na propagację zmian
4. Odśwież stronę z wyczyszczeniem cache (Ctrl+F5)

## 🎉 Gotowe!

Twoja aplikacja jest gotowa do użytku!