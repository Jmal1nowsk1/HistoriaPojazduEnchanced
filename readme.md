# HistoriaPojazduEnchanced - program do znajdywania daty pierwszej rejestracji pojazdu.

Automatyczne sprawdzanie daty pierwszej rejestracji pojazdu w bazie CEPIK na podstawie numeru VIN i numeru rejestracyjnego.

---

## Instalacja

```bash
git clone https://github.com/Jmal1nowsk1/HistoriaPojazduEnchanced
cd cepiK-date-finder
npm install
npx playwright install
```

---

## Użycie

```bash
node index.js
```

Wprowadź dane, gdy pojawią się pytania w terminalu:

- Podaj VIN: `[numer VIN]`
- Podaj numer rejestracyjny: `[numer rejestracyjny]`
- Podaj rok rejestracji: `[rok]`

Skrypt sprawdzi wszystkie możliwe daty w tym roku i wyświetli wynik w konsoli.  
Po znalezieniu daty otworzy przeglądarkę z wypełnionym formularzem.

---

## Funkcje

- Generuje wszystkie dni w roku (najpierw sprawdza dni robocze, potem weekendy)
- Automatyczne sprawdzanie w CEPIK
- Wyświetlanie postępu w konsoli
- Otwieranie przeglądarki z poprawną datą po znalezieniu wyniku

---

## Uwagi

CEPIK limutuje ilość zapytań - domyślnie program sprawdza 1 datę na 3 sekundy

---

## Testowe gruzy do sprawdzania działania programu

- `W0L0SBF08X4368013 | KR141CC` (spodziewana data 27.07.1999)
- `VSSZZZ6KZ2R078863 | SMI41210` (spodziewana data 30.10.2001)