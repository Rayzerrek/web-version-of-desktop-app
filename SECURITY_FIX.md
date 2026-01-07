# Naprawa krytycznego problemu bezpieczeństwa - Wyciek sesji użytkowników

## Problem
Aplikacja miała **krytyczną lukę bezpieczeństwa**, gdzie sesje użytkowników mogły się "mieszać" - użytkownik mógł przypadkowo uzyskać dostęp do sesji innego użytkownika, włącznie z prawami admina.

## Przyczyna
1. **Singleton Supabase Client** - W `backend/supabase_client.py` używany był wzorzec Singleton, który tworzył **jedną współdzieloną instancję** klienta Supabase dla wszystkich requestów
2. **Współdzielony stan** - Kiedy klient Supabase przechowuje stan sesji (tokeny, user context), ten stan był dzielony między różnymi użytkownikami
3. **Race conditions** - Przy wielokrotnych requestach autoryzacyjnych mogły wystąpić sytuacje wyścigowe

## Naprawione pliki

### 1. `backend/supabase_client.py`
**PRZED:**
```python
class SupabaseClientSingleton:
    _instance: Optional[Client] = None  # ❌ Współdzielona instancja!
    
    @classmethod
    def get_client(cls) -> Client:
        if cls._instance is None:
            cls._instance = create_client(...)
        return cls._instance  # ❌ Ta sama instancja dla wszystkich!
```

**PO:**
```python
def get_supabase() -> Client:
    """Tworzy NOWĄ instancję dla każdego requesta"""
    return create_client(
        settings.supabase_url,
        settings.supabase_anon_key
    )  # ✅ Każdy request ma swoją izolowaną instancję
```

### 2. `frontend/src/hooks/useAuth.tsx`
**Dodane zabezpieczenia:**
- ✅ Blokada przed wielokrotnymi równoczesnymi sprawdzeniami stanu admina
- ✅ Resetowanie stanu admina przed nowym logowaniem
- ✅ Bezpieczna walidacja odpowiedzi z API (tylko `isAdmin === true`)

### 3. `frontend/src/utils/auth.ts`
**Ulepszone czyszczenie sesji:**
- ✅ Usuwanie wszystkich kluczy związanych z użytkownikiem z localStorage
- ✅ Czyszczenie cache'u stanu admina
- ✅ Zapobieganie wyciekowi danych między sesjami

## Co się zmieniło w działaniu

### Przed naprawą:
```
User A loguje się → Singleton client zapamiętuje sesję A
User B loguje się → Ten sam client, może "widzieć" część stanu A
User B sprawdza admin → Może dostać cached wynik z sesji A ❌
```

### Po naprawie:
```
User A loguje się → Nowy client tylko dla A
User B loguje się → Całkowicie nowy, izolowany client dla B
Każdy request ma swoją własną, izolowaną instancję ✅
```

## Jak przetestować naprawę

1. **Test izolacji sesji:**
   - Zaloguj się jako admin w jednej przeglądarce
   - Zaloguj się jako zwykły użytkownik w trybie incognito
   - Sprawdź czy zwykły użytkownik NIE ma dostępu do panelu admina

2. **Test czyszczenia sesji:**
   - Zaloguj się jako admin
   - Wyloguj się
   - Zaloguj się jako inny użytkownik
   - Sprawdź czy nowy użytkownik ma tylko swoje uprawnienia

3. **Test równoczesnych requestów:**
   - Otwórz aplikację w wielu kartach
   - Zaloguj się różnymi użytkownikami
   - Sprawdź czy każda karta ma poprawne uprawnienia

## Zalecenia na przyszłość

1. **Nigdy nie używaj Singleton dla klientów HTTP/API**, które obsługują autoryzację
2. **Zawsze twórz nowe instancje per request** w środowisku wieloużytkownikowym
3. **Testuj aplikację z wieloma równoczesnymi użytkownikami**
4. **Używaj narzędzi do analizy bezpieczeństwa** (np. OWASP ZAP, Burp Suite)
5. **Implementuj sesje po stronie serwera** zamiast polegać tylko na localStorage

## Monitoring

Po wdrożeniu tej naprawy warto monitorować:
- ✅ Czy nie ma nieautoryzowanych dostępów do endpointów adminowych
- ✅ Czy użytkownicy otrzymują poprawne role po zalogowaniu
- ✅ Czy logout skutecznie czyści wszystkie dane sesji

---

**Data naprawy:** 2026-01-07
**Priorytet:** 🔴 KRYTYCZNY
**Status:** ✅ NAPRAWIONE
