# 📊 Integracja z Google Sheets - Instrukcja krok po kroku

## KROK 1: Przygotowanie Google Sheets

### 1.1 Utwórz nowy arkusz
1. Wejdź na https://sheets.google.com
2. Kliknij "+ Pusty arkusz"
3. Nazwij arkusz: **"Ewidencja Przebiegu Samochodów"**

### 1.2 Utwórz strukturę arkusza

Stwórz **3 zakładki** (dodaj nowe arkusze u dołu):

#### **Zakładka 1: "Wpisy"**
Ustaw nagłówki w pierwszym wierszu:
```
A1: ID
B1: Pracownik
C1: Samochód
D1: Data
E1: Start (km)
F1: Koniec (km)
G1: Przebieg (km)
H1: Data dodania
```

#### **Zakładka 2: "Archiwum"**
Ustaw nagłówki w pierwszym wierszu:
```
A1: ID
B1: Pracownik
C1: Samochód
D1: Data
E1: Start (km)
F1: Koniec (km)
G1: Przebieg (km)
H1: Data archiwizacji
```

#### **Zakładka 3: "Podsumowania"**
Ustaw nagłówki w pierwszym wierszu:
```
A1: Miesiąc
B1: Pracownik
C1: Samochód
D1: Suma przebiegu (km)
E1: Liczba wpisów
```

---

## KROK 2: Stworzenie Google Apps Script

### 2.1 Otwórz edytor skryptów
1. W Google Sheets kliknij **Rozszerzenia** → **Apps Script**
2. Usuń domyślny kod

### 2.2 Wklej poniższy kod:

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const action = data.action;
    
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    
    switch(action) {
      case 'addEntry':
        return addEntry(ss, data);
      case 'getEntries':
        return getEntries(ss);
      case 'deleteEntry':
        return deleteEntry(ss, data);
      case 'archiveEntries':
        return archiveEntries(ss, data);
      case 'getArchive':
        return getArchive(ss);
      case 'restoreArchive':
        return restoreArchive(ss);
      default:
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          message: 'Nieznana akcja'
        })).setMimeType(ContentService.MimeType.JSON);
    }
  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  const action = e.parameter.action;
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (action === 'getEntries') {
    return getEntries(ss);
  } else if (action === 'getArchive') {
    return getArchive(ss);
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    success: false,
    message: 'Użyj POST do zapisu danych'
  })).setMimeType(ContentService.MimeType.JSON);
}

// Dodanie wpisu
function addEntry(ss, data) {
  const sheet = ss.getSheetByName('Wpisy');
  const entry = data.entry;
  
  sheet.appendRow([
    entry.id,
    entry.vehicle,
    entry.date,
    entry.start,
    entry.end,
    entry.przebieg,
    new Date().toISOString()
  ]);
  
  updateSummaries(ss);
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'Wpis dodany'
  })).setMimeType(ContentService.MimeType.JSON);
}

// Pobieranie wpisów
function getEntries(ss) {
  const sheet = ss.getSheetByName('Wpisy');
  const data = sheet.getDataRange().getValues();
  const entries = [];
  
  for (let i = 1; i < data.length; i++) {
    entries.push({
      id: data[i][0],
      vehicle: data[i][1],
      date: data[i][2],
      start: data[i][3],
      end: data[i][4],
      przebieg: data[i][5]
    });
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    entries: entries
  })).setMimeType(ContentService.MimeType.JSON);
}

// Usuwanie wpisu
function deleteEntry(ss, data) {
  const sheet = ss.getSheetByName('Wpisy');
  const id = data.id;
  const allData = sheet.getDataRange().getValues();
  
  for (let i = 1; i < allData.length; i++) {
    if (allData[i][0] == id) {
      sheet.deleteRow(i + 1);
      break;
    }
  }
  
  updateSummaries(ss);
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'Wpis usunięty'
  })).setMimeType(ContentService.MimeType.JSON);
}

// Archiwizacja wpisów
function archiveEntries(ss, data) {
  const wpisySheet = ss.getSheetByName('Wpisy');
  const archiveSheet = ss.getSheetByName('Archiwum');
  const dateFrom = data.dateFrom;
  const dateTo = data.dateTo;
  
  const allData = wpisySheet.getDataRange().getValues();
  let movedCount = 0;
  
  // Przenieś wpisy do archiwum (od końca, żeby nie zaburzyć indeksów)
  for (let i = allData.length - 1; i >= 1; i--) {
    const entryDate = allData[i][2];
    
    if (entryDate >= dateFrom && entryDate <= dateTo) {
      // Dodaj do archiwum
      archiveSheet.appendRow([
        allData[i][0], // ID
        allData[i][1], // Samochód
        allData[i][2], // Data
        allData[i][3], // Start
        allData[i][4], // Koniec
        allData[i][5], // Przebieg
        new Date().toISOString() // Data archiwizacji
      ]);
      
      // Usuń z wpisów
      wpisySheet.deleteRow(i + 1);
      movedCount++;
    }
  }
  
  updateSummaries(ss);
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: `Przeniesiono ${movedCount} wpisów`,
    movedCount: movedCount
  })).setMimeType(ContentService.MimeType.JSON);
}

// Pobieranie archiwum
function getArchive(ss) {
  const sheet = ss.getSheetByName('Archiwum');
  const data = sheet.getDataRange().getValues();
  const entries = [];
  
  for (let i = 1; i < data.length; i++) {
    entries.push({
      id: data[i][0],
      vehicle: data[i][1],
      date: data[i][2],
      start: data[i][3],
      end: data[i][4],
      przebieg: data[i][5]
    });
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    entries: entries
  })).setMimeType(ContentService.MimeType.JSON);
}

// Przywracanie z archiwum
function restoreArchive(ss) {
  const wpisySheet = ss.getSheetByName('Wpisy');
  const archiveSheet = ss.getSheetByName('Archiwum');
  
  const archiveData = archiveSheet.getDataRange().getValues();
  
  // Przenieś wszystko z archiwum do wpisów
  for (let i = 1; i < archiveData.length; i++) {
    wpisySheet.appendRow([
      archiveData[i][0],
      archiveData[i][1],
      archiveData[i][2],
      archiveData[i][3],
      archiveData[i][4],
      archiveData[i][5],
      new Date().toISOString()
    ]);
  }
  
  // Wyczyść archiwum (zostaw nagłówki)
  if (archiveData.length > 1) {
    archiveSheet.deleteRows(2, archiveData.length - 1);
  }
  
  updateSummaries(ss);
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    message: 'Archiwum przywrócone'
  })).setMimeType(ContentService.MimeType.JSON);
}

// Aktualizacja podsumowań
function updateSummaries(ss) {
  const wpisySheet = ss.getSheetByName('Wpisy');
  const summarySheet = ss.getSheetByName('Podsumowania');
  
  const data = wpisySheet.getDataRange().getValues();
  const summaries = {};
  
  // Oblicz podsumowania
  for (let i = 1; i < data.length; i++) {
    const vehicle = data[i][1];
    const date = data[i][2];
    const przebieg = data[i][5];
    const month = date.toString().substring(0, 7); // YYYY-MM
    
    const key = `${month}_${vehicle}`;
    
    if (!summaries[key]) {
      summaries[key] = {
        month: month,
        vehicle: vehicle,
        total: 0,
        count: 0
      };
    }
    
    summaries[key].total += Number(przebieg);
    summaries[key].count += 1;
  }
  
  // Wyczyść stare podsumowania
  summarySheet.clear();
  summarySheet.appendRow(['Miesiąc', 'Samochód', 'Suma przebiegu (km)', 'Liczba wpisów']);
  
  // Zapisz nowe podsumowania
  for (const key in summaries) {
    const s = summaries[key];
    summarySheet.appendRow([s.month, s.vehicle, s.total, s.count]);
  }
}
```

### 2.3 Zapisz i wdróż skrypt

1. Kliknij **💾 Zapisz** (Ctrl+S)
2. Nazwij projekt: **"Ewidencja API"**
3. Kliknij **Wdróż** → **Nowe wdrożenie**
4. Kliknij ikonę ⚙️ obok "Wybierz typ"
5. Wybierz **Aplikacja internetowa**
6. Ustaw:
   - **Opis**: "API Ewidencji"
   - **Wykonaj jako**: Ja
   - **Kto ma dostęp**: Każdy
7. Kliknij **Wdróż**
8. **SKOPIUJ URL WDROŻENIA** - będzie potrzebny w kodzie aplikacji!
   (Wygląda tak: `https://script.google.com/macros/s/.../exec`)

### 2.4 Nadaj uprawnienia

1. Po kliknięciu "Wdróż" pojawi się prośba o autoryzację
2. Kliknij **Zezwól na dostęp**
3. Wybierz swoje konto Google
4. Kliknij **Zaawansowane** → **Przejdź do Ewidencja API**
5. Kliknij **Zezwól**

---

## KROK 3: Zaktualizuj kod aplikacji

Teraz musisz zaktualizować plik `index.html` - dodaj URL swojego skryptu Google Apps Script.

W zaktualizowanym kodzie (który za chwilę przygotuję) znajdziesz linię:
```javascript
const GOOGLE_SCRIPT_URL = 'WKLEJ_TUTAJ_URL_SWOJEGO_SKRYPTU';
```

Zamień `WKLEJ_TUTAJ_URL_SWOJEGO_SKRYPTU` na URL skopiowany w kroku 2.3.

---

## ✅ GOTOWE!

Po tych krokach aplikacja będzie:
- ✅ Zapisywać wszystkie wpisy do Google Sheets
- ✅ Synchronizować dane między urządzeniami
- ✅ Archiwizować dane w osobnej zakładce
- ✅ Automatycznie aktualizować podsumowania
- ✅ Umożliwiać edycję danych bezpośrednio w Sheets

---

## 🔄 Tryb działania

**LOKALNY (bez internetu):**
- Dane zapisywane w localStorage
- Pełna funkcjonalność offline

**ONLINE (z internetem):**
- Dane synchronizowane z Google Sheets
- Automatyczny backup w chmurze
- Dostęp z każdego urządzenia

---

## 📝 UWAGA!

Po każdej zmianie w Apps Script musisz:
1. Zapisać zmiany (Ctrl+S)
2. Kliknij **Wdróż** → **Zarządzaj wdrożeniami**
3. Kliknij ✏️ przy aktualnym wdrożeniu
4. Zmień wersję na **Nowe wdrożenie**
5. Zapisz

Teraz przygotuję zaktualizowany kod aplikacji!