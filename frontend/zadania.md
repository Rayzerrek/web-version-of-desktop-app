* **opis przykladowego kodu:** Ustawienie elementów jeden pod drugim.

**Lekcja 3: Align Items**

  * **typ lekcji: ćwiczenie:**
  * **Tytuł lekcji:** Centrowanie pionowe
  * **Opis:** Wyrównanie elementów wzdłuż osi poprzecznej.
  * **Nagroda xp:** 10
  * **Instrukcja zadania:** Dodaj `align-items: center;` do stylu kontenera, aby wyśrodkować tekst pionowo.
  * **Kod startowy:** \`\`\`html

&lt;div class=&quot;container&quot;&gt;
  &lt;span&gt;Centrum&lt;/span&gt;
&lt;/div&gt;
&lt;style&gt;
.container {
  display: flex;
  height: 200px;
}
&lt;/style&gt;
Rozwiazanie: ```css .container { display: flex; height: 200px; align-items: center; }

* **Przykladowy kod:** `align-items: flex-start;`
* **Opis przykladowego kodu:** Wyrównuje elementy do góry kontenera.
* **Wskazowka:** Oś pionowa to align-items.
* **Oczekiwany wynik:** Vertical Center

**Lekcja 4: Quiz: Oś główna**

  * **typ lekcji: quiz:**
  * **Pytanie:** Która właściwość CSS odpowiada za wyrównanie elementów na osi głównej?
  * **odpowiedzi:** \* `align-items`
      * `justify-content` (Poprawna)
      * `flex-direction`
  * **Wyjaśnienie:** Justify-content steruje rozkładem elementów wzdłuż osi głównej (domyślnie poziomej).

**Lekcja 5: Zawijanie elementów**

  * **typ lekcji: ćwiczenie:**
  * **Tytuł lekcji:** Flex Wrap
  * **Opis:** Co zrobić, gdy elementy nie mieszczą się w jednej linii?
  * **Nagroda xp:** 10
  * **Instrukcja zadania:** Dodaj właściwość `flex-wrap: wrap;` do kontenera.
  * **Kod startowy:** \`\`\`html

&lt;div class=&quot;wrapper&quot;&gt;
  &lt;div class=&quot;item&quot;&gt;&lt;/div&gt;&lt;div class=&quot;item&quot;&gt;&lt;/div&gt;
&lt;/div&gt;
&lt;style&gt;
.wrapper {
  display: flex;
  width: 100px;
}
&lt;/style&gt;
Rozwiazanie: ```css .wrapper { display: flex; width: 100px; flex-wrap: wrap; }

* **Wskazowka:** Użyj słowa wrap.
* **Oczekiwany wynik:** Wrapped

**Lekcja 6: Quiz: Wyświetlanie**

  * **typ lekcji: quiz:**
  * **Pytanie:** Jaką wartość musi mieć właściwość `display`, aby aktywować Flexbox?
  * **odpowiedzi:** \* `block`
      * `inline`
      * `flex` (Poprawna)
  * **Wyjaśnienie:** Tylko `display: flex` lub `inline-flex` inicjuje kontekst elastycznego pudełka.

-----

## 3\. Kurs: Logika JavaScript

**Język:** Javascript | **Opis:** Naucz się podejmować decyzje w kodzie za pomocą instrukcji warunkowych. | **Poziom:** Poczatkujacy | **Szacowany czas (h):** 12 | **Kolor:** \#f7df1e

### Moduł: Instrukcje Sterujące

**Opis:** Bloki if oraz else.

**Lekcja 1: Warunek IF**

  * **typ lekcji: ćwiczenie:**
  * **Tytuł lekcji:** Podstawowy IF
  * **Opis:** Sprawdź, czy liczba spełnia warunek.
  * **Nagroda xp:** 10
  * **Instrukcja zadania:** Napisz instrukcję `if`, która sprawdzi czy `x` jest większe od 5. Jeśli tak, wypisz "OK".
  * **Kod startowy:** `let x = 10;`
  * **Rozwiazanie:** `if (x > 5) { console.log("OK"); }`
  * **Przykladowy kod:** `if (2 > 1) { }`
  * **Opis przykladowego kodu:** Składnia instrukcji warunkowej.
  * **Wskazowka:** Pamiętaj o nawiasach okrągłych.
  * **Oczekiwany wynik:** OK

**Lekcja 2: Quiz: Operatory porównania**

  * **typ lekcji: quiz:**
  * **Pytanie:** Który operator oznacza "równe" (wartość i typ) w JS?
  * **odpowiedzi:** \* `==`
      * `===` (Poprawna)
      * `!=`
  * **Wyjaśnienie:** Operator `===` to ścisła równość, zalecana w JS.

**Lekcja 3: Teoria: Else i Else if**

  * **typ lekcji: teoria:**
  * **Tytuł lekcji:** Rozbudowane warunki
  * **Nagroda xp:** 10
  * **Tresc lekcji:** Jeśli pierwszy warunek nie jest spełniony, możemy użyć `else` dla wszystkich pozostałych przypadków lub `else if` dla kolejnego konkretnego warunku.
  * **przykladowy kod:** `if (x > 0) { } else { }`
  * **opis przykladowego kodu:** Przykład użycia alternatywy.

**Lekcja 4: Ćwiczenie: Else**

  * **typ lekcji: ćwiczenie:**
  * **Tytuł lekcji:** Obsługa błędu
  * **Opis:** Wyświetl komunikat, gdy warunek nie jest spełniony.
  * **Nagroda xp:** 10
  * **Instrukcja zadania:** Jeśli `x` jest mniejsze od 0, wypisz "Błąd", w przeciwnym razie (`else`) wypisz "Sukces".
  * **Kod startowy:** `let x = 5;`
  * **Rozwiazanie:** `if (x < 0) { console.log("Błąd"); } else { console.log("Sukces"); }`
  * **Wskazowka:** Użyj bloku else {}.
  * **Oczekiwany wynik:** Sukces

**Lekcja 5: Operatory logiczne**

  * **typ lekcji: ćwiczenie:**
  * **Tytuł lekcji:** Operator AND
  * **Opis:** Sprawdzanie dwóch warunków naraz.
  * **Nagroda xp:** 10
  * **Instrukcja zadania:** Napisz warunek sprawdzający czy `wiek` jest większy od 18 ORAZ `maZgode` jest równe `true`.
  * **Kod startowy:** `let wiek = 20; let maZgode = true;`
  * **Rozwiazanie:** `if (wiek > 18 && maZgode === true) { console.log("OK"); }`
  * **Wskazowka:** Użyj symbolu &&.
  * **Oczekiwany wynik:** OK

**Lekcja 6: Quiz: Negacja**

  * **typ lekcji: quiz:**
  * **Pytanie:** Jakim symbolem w JS zaprzeczamy warunek (NOT)?
  * **odpowiedzi:** \* `NOT`
      * `!` (Poprawna)
      * `~`
  * **Wyjaśnienie:** Wykrzyknik `!` odwraca wartość logiczną zmiennej.

-----

## 4\. Kurs: TypeScript - Interfejsy

**Język:** Typescript | **Opis:** Wprowadzenie do silnego typowania i interfejsów. | **Poziom:** Sredniozaawansowany | **Szacowany czas (h):** 15 | **Kolor:** \#3178c6

### Moduł: Typowanie obiektów

**Opis:** Tworzenie szablonów danych.

**Lekcja 1: Interface User**

  * **typ lekcji: ćwiczenie:**
  * **Tytuł lekcji:** Twój pierwszy interfejs
  * **Opis:** Zdefiniuj strukturę użytkownika.
  * **Nagroda xp:** 10
  * **Instrukcja zadania:** Stwórz `interface User` z polem `id` typu `number`.
  * **Kod startowy:** `interface User { }`
  * **Rozwiazanie:** `interface User { id: number; }`
  * **Przykladowy kod:** `interface Car { brand: string; }`
  * **Opis przykladowego kodu:** Definicja prostego interfejsu.
  * **Wskazowka:** Pamiętaj o średniku po typie.
  * **Oczekiwany wynik:** Success

**Lekcja 2: Teoria: Pola opcjonalne**

  * **typ lekcji: teoria:**
  * **Tytuł lekcji:** Opcjonalność w TS
  * **Nagroda xp:** 10
  * **Tresc lekcji:** Nie każde pole w obiekcie musi być wymagane. Używamy znaku `?` po nazwie pola, aby uczynić je opcjonalnym.
  * **przykladowy kod:** `interface User { name: string; age?: number; }`
  * **opis przykladowego kodu:** Tutaj age nie jest obowiązkowe.

**Lekcja 3: Ćwiczenie: Opcjonalne pola**

  * **typ lekcji: ćwiczenie:**
  * **Tytuł lekcji:** Profil pracownika
  * **Opis:** Dodaj opcjonalne dane.
  * **Nagroda xp:** 10
  * **Instrukcja zadania:** W interfejsie `Employee` dodaj pole `email` jako string, ale oznacz je jako opcjonalne.
  * **Kod startowy:** `interface Employee { name: string; }`
  * **Rozwiazanie:** `interface Employee { name: string; email?: string; }`
  * **Wskazowka:** Użyj znaku ?.
  * **Oczekiwany wynik:** Success

**Lekcja 4: Quiz: Zalety TS**

  * **typ lekcji: quiz:**
  * **Pytanie:** Główną zaletą TypeScript jest:\*\*
  * **odpowiedzi:** \* Szybsze działanie w przeglądarce
      * Wykrywanie błędów w czasie pisania kodu (Poprawna)
      * Skracanie kodu HTML
  * **Wyjaśnienie:** TS pozwala wyłapać błędy typów zanim kod zostanie uruchomiony.

**Lekcja 5: Interface Readonly**

  * **typ lekcji: ćwiczenie:**
  * **Tytuł lekcji:** Stałe pola
  * **Opis:** Zabezpiecz pole przed zmianą.
  * **Nagroda xp:** 10
  * **Instrukcja zadania:** W interfejsie `Config` dodaj pole `apiKey` typu string, które będzie tylko do odczytu (`readonly`).
  * **Kod startowy:** `interface Config { }`
  * **Rozwiazanie:** `interface Config { readonly apiKey: string; }`
  * **Wskazowka:** Użyj słowa kluczowego readonly.
  * **Oczekiwany wynik:** Success

**Lekcja 6: Quiz: Składnia**

  * **typ lekcji: quiz:**
  * **Pytanie:** Jakiego słowa kluczowego używamy do stworzenia interfejsu?
  * **odpowiedzi:** \* `struct`
      * `interface` (Poprawna)
      * `contract`
  * **Wyjaśnienie:** W TypeScript używamy słowa `interface`.

-----

## 5\. Kurs: HTML5 Semantyka

**Język:** HTML | **Opis:** Struktura nowoczesnych i dostępnych stron. | **Poziom:** Poczatkujacy | **Szacowany czas (h):** 4 | **Kolor:** \#e34c26

### Moduł: Tagi sekcji

**Opis:** Main, Header, Footer.

**Lekcja 1: Nagłówek H1**

  * **typ lekcji: ćwiczenie:**
  * **Tytuł lekcji:** Najważniejszy tytuł
  * **Opis:** Każda strona powinna mieć jeden nagłówek H1.
  * **Nagroda xp:** 10
  * **Instrukcja zadania:** Wstaw tag `<h1>` z tekstem "Hej" wewnątrz body.
  * **Kod startowy:** `<body> </body>`
  * **Rozwiazanie:** `<body> <h1>Hej</h1> </body>`
  * **Przykladowy kod:** `<h1>Tytuł</h1>`
  * **Opis przykladowego kodu:** Użycie głównego nagłówka.
  * **Wskazowka:** Pamiętaj o tagu zamykającym.
  * **Oczekiwany wynik:** Hej

**Lekcja 2: Teoria: Tagi semantyczne**

  * **typ lekcji: teoria:**
  * **Tytuł lekcji:** Dlaczego semantyka?
  * **Nagroda xp:** 10
  * **Tresc lekcji:** Tagi takie jak `<header>`, `<footer>` czy `<nav>` mówią przeglądarce i robotom Google, co znajduje się w danej sekcji strony.
  * **przykladowy kod:** `<nav>Menu</nav>`
  * **opis przykladowego kodu:** Tag dla nawigacji.

**Lekcja 3: Ćwiczenie: Main i Article**

  * **typ lekcji: ćwiczenie:**
  * **Tytuł lekcji:** Główna treść
  * **Opis:** Oznacz serce swojej strony.
  * **Nagroda xp:** 10
  * **Instrukcja zadania:** Umieść tag `<p>Treść</p>` wewnątrz tagu semantycznego `<main>`.
  * **Kod startowy:** `<body> </body>`
  * **Rozwiazanie:** `<body> <main><p>Treść</p></main> </body>`
  * **Wskazowka:** Użyj tagu &lt;main&gt;.
  * **Oczekiwany wynik:** Treść

**Lekcja 4: Quiz: Stopka**

  * **typ lekcji: quiz:**
  * **Pytanie:** Który tag najlepiej opisuje dolną sekcję strony (np. z prawami autorskimi)?
  * **odpowiedzi:** \* `<bottom>`
      * `<footer>` (Poprawna)
      * `<end>`
  * **Wyjaśnienie:** `<footer>` to standardowy tag semantyczny dla stopki.

**Lekcja 5: Ćwiczenie: Sekcja nawigacji**

  * **typ lekcji: ćwiczenie:**
  * **Tytuł lekcji:** Nawigacja
  * **Opis:** Dodaj menu do strony.
  * **Nagroda xp:** 10
  * **Instrukcja zadania:** Stwórz tag `<nav>`, a w nim umieść listę `<ul>` z jednym elementem `<li>Menu</li>`.
  * **Kod startowy:** \`\`
  * **Rozwiazanie:** `<nav><ul><li>Menu</li></ul></nav>`
  * **Wskazowka:** Nav to skrót od navigation.
  * **Oczekiwany wynik:** Menu

**Lekcja 6: Quiz: H1-H6**

  * **typ lekcji: quiz:**
  * **Pytanie:** Który nagłówek jest najmniejszy (ma najniższy priorytet)?
  * **odpowiedzi:** \* `<h1>`
      * `<h6>` (Poprawna)
      * `<h0>`
  * **Wyjaśnienie:** Skala nagłówków w HTML to od 1 (największy) do 6 (najmniejszy).

-----

## 6\. Kurs: Python Listy

**Język:** Python | **Opis:** Zarządzanie kolekcjami danych. | **Poziom:** Sredniozaawansowany | **Szacowany czas (h):** 10 | **Kolor:** \#FFD43B

### Moduł: Metody List

**Opis:** Append, Pop i inne.

**Lekcja 1: Metoda Append**

  * **typ lekcji: ćwiczenie:**
  * **Tytuł lekcji:** Dodawanie elementów
  * **Opis:** Rozszerz swoją listę o nowe dane.
  * **Nagroda xp:** 10
  * **Instrukcja zadania:** Dodaj liczbę `5` na koniec listy `l` używając metody `append`.
  * **Kod startowy:** `l = [1, 2, 3]`
  * **Rozwiazanie:** `l.append(5)`
  * **Przykladowy kod:** `moje.append("nowy")`
  * **Opis przykladowego kodu:** Dodanie elementu tekstowego.
  * **Wskazowka:** Użyj kropki: l.append().
  * **Oczekiwany wynik:** [1, 2, 3, 5]

**Lekcja 2: Teoria: Indeksowanie**

  * **typ lekcji: teoria:**
  * **Tytuł lekcji:** Gdzie jest mój element?
  * **Nagroda xp:** 10
  * **Tresc lekcji:** Elementy w listach są numerowane od zera. Pierwszy element to `lista[0]`.
  * **przykladowy kod:** `x = owoce[0]`
  * **opis przykladowego kodu:** Pobranie pierwszego elementu.

**Lekcja 3: Quiz: Pierwszy indeks**

  * **typ lekcji: quiz:**
  * **Pytanie:** Pod jakim indeksem znajduje się pierwszy element listy w Pythonie?
  * **odpowiedzi:** \* `1`
      * `0` (Poprawna)
      * `-1`
  * **Wyjaśnienie:** Programowanie w większości języków zaczyna liczenie od 0.

**Lekcja 4: Ćwiczenie: Usuwanie**

  * **typ lekcji: ćwiczenie:**
  * **Tytuł lekcji:** Metoda Pop
  * **Opis:** Usuń ostatni element z listy.
  * **Nagroda xp:** 10
  * **Instrukcja zadania:** Usuń ostatni element z listy `koszyk` używając metody `pop()`.
  * **Kod startowy:** `koszyk = ["chleb", "mleko"]`
  * **Rozwiazanie:** `koszyk.pop()`
  * **Wskazowka:** Metoda pop() nie wymaga argumentu, by usunąć ostatni element.
  * **Oczekiwany wynik:** ["chleb"]

**Lekcja 5: Ćwiczenie: Długość listy**

  * **typ lekcji: ćwiczenie:**
  * **Tytuł lekcji:** Funkcja Len
  * **Opis:** Sprawdź, ile elementów masz w kolekcji.
  * **Nagroda xp:** 10
  * **Instrukcja zadania:** Użyj funkcji `len()`, aby sprawdzić długość listy `miasta` i przypisz wynik do zmiennej `ile`.
  * **Kod startowy:** `miasta = ["Kraków", "Warszawa"]`
  * **Rozwiazanie:** `ile = len(miasta)`
  * **Wskazowka:** len to skrót od length.
  * **Oczekiwany wynik:** 2

**Lekcja 6: Quiz: Modyfikacja**

  * **typ lekcji: quiz:**
  * **Pytanie:** Czy listy w Pythonie są mutowalne (można zmieniać ich zawartość)?
  * **odpowiedzi:** \* Tak (Poprawna)
      * Nie
  * **Wyjaśnienie:** Listy można dowolnie modyfikować po ich stworzeniu.

-----

## 7\. Kurs: JS DOM Events

**Język:** Javascript | **Opis:** Interakcja użytkownika ze stroną WWW. | **Poziom:** Sredniozaawansowany | **Szacowany czas (h):** 10 | **Kolor:** \#F0DB4F

### Moduł: Obsługa zdarzeń

**Opis:** Click, Submit, Input.

**Lekcja 1: Click event**

  * **typ lekcji: ćwiczenie:**
  * **Tytuł lekcji:** Reakcja na klik
  * **Opis:** Spraw, by przycisk coś robił.
  * **Nagroda xp:** 10
  * **Instrukcja zadania:** Dodaj listener zdarzenia 'click' do obiektu `b`, który wywoła pustą funkcję strzałkową `() => {}`.
  * **Kod startowy:** `const b = document.querySelector('button');`
  * **Rozwiazanie:** `b.addEventListener('click', () => {})`
  * **Przykladowy kod:** `el.addEventListener('mouseover', callback)`
  * **Opis przykladowego kodu:** Zdarzenie najechania myszką.
  * **Wskazowka:** Pamiętaj o cudzysłowie dla 'click'.
  * **Oczekiwany wynik:** Active

**Lekcja 2: Teoria: bubbling**

  * **typ lekcji: teoria:**
  * **Tytuł lekcji:** Propagacja zdarzeń
  * **Nagroda xp:** 10
  * **Tresc lekcji:** Zdarzenia "bąbelkują" w górę drzewa DOM – od elementu klikniętego aż do samego dokumentu.
  * **przykladowy kod:** `e.stopPropagation()`
  * **opis przykladowego kodu:** Zatrzymanie dalszego bąbelkowania.

**Lekcja 3: Quiz: preventDefault**

  * **typ lekcji: quiz:**
  * **Pytanie:** Do czego służy metoda `e.preventDefault()`?
  * **odpowiedzi:** \* Do zatrzymania działania pętli
      * Do zablokowania domyślnej akcji przeglądarki (np. przeładowania strony) (Poprawna)
      * Do usunięcia elementu z DOM
  * **Wyjaśnienie:** Jest to kluczowe przy obsłudze formularzy, by strona się nie odświeżała.

**Lekcja 4: Ćwiczenie: Zmiana tekstu**

  * **typ lekcji: ćwiczenie:**
  * **Tytuł lekcji:** Dynamiczna zmiana
  * **Opis:** Zmień treść po kliknięciu.
  * **Nagroda xp:** 10
  * **Instrukcja zadania:** Wewnątrz listenera `click` przypisz do `b.textContent` wartość "Kliknięto".
  * **Kod startowy:** `b.addEventListener('click', () => { /* tu kod */ });`
  * **Rozwiazanie:** `b.addEventListener('click', () => { b.textContent = "Kliknięto"; });`
  * **Wskazowka:** Użyj właściwości textContent.
  * **Oczekiwany wynik:** Kliknięto

**Lekcja 5: Quiz: Typy zdarzeń**

  * **typ lekcji: quiz:**
  * **Pytanie:** Które zdarzenie najlepiej nadaje się do wykrywania zmian w polu tekstowym (input)?
  * **odpowiedzi:** \* `click`
      * `input` (Poprawna)
      * `load`
  * **Wyjaśnienie:** Zdarzenie `input` odpala się przy każdej zmianie wartości pola.

**Lekcja 6: Ćwiczenie: Formularz**

  * **typ lekcji: ćwiczenie:**
  * **Tytuł lekcji:** Submit
  * **Opis:** Przechwyć wysłanie formularza.
  * **Nagroda xp:** 10
  * **Instrukcja zadania:** Dodaj listener zdarzenia `'submit'` do zmiennej `form`.
  * **Kod startowy:** `const form = document.querySelector('form');`
  * **Rozwiazanie:** `form.addEventListener('submit', (e) => { e.preventDefault(); });`
  * **Wskazowka:** Zawsze blokuj domyślną akcję przy submit.
  * **Oczekiwany wynik:** Active

-----

## 8\. Kurs: Python Decorators

**Język:** Python | **Opis:** Zaawansowane techniki modyfikacji funkcji. | **Poziom:** Zaawansowany | **Szacowany czas (h):** 15 | **Kolor:** \#1e415e

### Moduł: Wrappers

**Opis:** Opakowywanie funkcji.

**Lekcja 1: Teoria Dekoratora**

  * **typ lekcji: teoria:**
  * **Tytuł lekcji:** Czym jest dekorator?
  * **Nagroda xp:** 10
  * **Tresc lekcji:** Dekoratory to funkcje, które przyjmują inną funkcję jako argument i zwracają jej zmodyfikowaną wersję. Używamy ich za pomocą symbolu `@`.
  * **przykladowy kod:** `@moj_dekorator`
  * **opis przykladowego kodu:** Składnia dekorowania funkcji.

**Lekcja 2: Quiz: Składnia**

  * **typ lekcji: quiz:**
  * **Pytanie:** Jakim znakiem w Pythonie oznaczamy dekorator?
  * **odpowiedzi:** \* `$`
      * `@` (Poprawna)
      * `&`
  * **Wyjaśnienie:** Symbol `@` (at) jest zarezerwowany dla dekoratorów.

**Lekcja 3: Ćwiczenie: Prosty dekorator**

  * **typ lekcji: ćwiczenie:**
  * **Tytuł lekcji:** Dekorowanie funkcji
  * **Opis:** Użyj gotowego dekoratora.
  * **Nagroda xp:** 10
  * **Instrukcja zadania:** Nad funkcją `hello()` dopisz dekorator `@debug`.
  * **Kod startowy:** `def hello(): return "Hej"`
  * **Rozwiazanie:** \`\`\`python
    @debug
    def hello(): return "Hej"

<!-- end list -->

Wskazowka: Dekorator piszemy w linii nad definicją funkcji.

Oczekiwany wynik: Success

Lekcja 4: Teoria: Funkcje jako obiekty

typ lekcji: teoria:

Tytuł lekcji: First-class functions

Nagroda xp: 10

Tresc lekcji: W Pythonie funkcje można przypisywać do zmiennych i przekazywać jako argumenty. Bez tego dekoratory by nie istniały.

przykladowy kod: f = print; f("Hej")

opis przykladowego kodu: Przypisanie funkcji print do zmiennej f.

Lekcja 5: Quiz: Zwracanie funkcji

typ lekcji: quiz:

Pytanie: Czy funkcja w Pythonie może zwrócić inną funkcję?

odpowiedzi: * Tak (Poprawna)

Nie

Wyjaśnienie: Tak, to podstawa tworzenia własnych dekoratorów.

Lekcja 6: Ćwiczenie: Logowanie

typ lekcji: ćwiczenie:

Tytuł lekcji: Logowanie wywołania

Opis: Użyj dekoratora @log.

Nagroda xp: 10

Instrukcja zadania: Zastosuj dekorator @log do funkcji oblicz().

Kod startowy: def oblicz(): return 2+2

Rozwiazanie: ```python @log def oblicz(): return 2+2


  * **Oczekiwany wynik:** Success

-----

## 9\. Kurs: TS Generics

**Język:** Typescript | **Opis:** Pisanie elastycznego kodu wielokrotnego użytku. | **Poziom:** Zaawansowany | **Szacowany czas (h):** 12 | **Kolor:** \#007acc

### Moduł: Generic Types

**Opis:** Parametryzacja typów.

**Lekcja 1: Identity function**

  * **typ lekcji: ćwiczenie:**
  * **Tytuł lekcji:** Uniwersalna funkcja
  * **Opis:** Funkcja, która zwraca to, co dostała, ale zachowuje typ.
  * **Nagroda xp:** 10
  * **Instrukcja zadania:** Dokończ funkcję `id<T>`, aby przyjmowała argument `a` typu `T` i zwracała typ `T`.
  * **Kod startowy:** `function id<T>(a: ) : { return a; }`
  * **Rozwiazanie:** `function id<T>(a: T): T { return a; }`
  * **Przykladowy kod:** `const x = id<string>("Hej")`
  * **Opis przykladowego kodu:** Wywołanie funkcji generycznej dla stringa.
  * **Wskazowka:** Użyj litery T jako typu.
  * **Oczekiwany wynik:** OK

**Lekcja 2: Teoria: Dlaczego T?**

  * **typ lekcji: teoria:**
  * **Tytuł lekcji:** Konwencja nazewnictwa
  * **Nagroda xp:** 10
  * **Tresc lekcji:** `T` to standardowy skrót od "Type". Możesz użyć dowolnej nazwy, ale `T`, `U`, `V` są powszechnie akceptowane w świecie programowania.
  * **przykladowy kod:** `<ContentType>`
  * **opis przykladowego kodu:** Użycie bardziej opisowej nazwy typu generycznego.

**Lekcja 3: Quiz: Generyki**

  * **typ lekcji: quiz:**
  * **Pytanie:** Co dają nam typy generyczne?
  * **odpowiedzi:** \* Sprawiają, że kod działa szybciej
      * Pozwalają tworzyć komponenty pracujące z różnymi typami przy zachowaniu bezpieczeństwa (Poprawna)
      * Pozwalają pisać kod bez żadnych typów
  * **Wyjaśnienie:** Generyki to "szablony" dla typów.

**Lekcja 4: Ćwiczenie: Generyczny Interface**

  * **typ lekcji: ćwiczenie:**
  * **Tytuł lekcji:** Pudełko na dane
  * **Opis:** Stwórz interfejs, który może trzymać dowolny typ.
  * **Nagroda xp:** 10
  * **Instrukcja zadania:** Stwórz `interface Box<T>` z polem `content` typu `T`.
  * **Kod startowy:** `interface Box`
  * **Rozwiazanie:** `interface Box<T> { content: T; }`
  * **Wskazowka:** Pamiętaj o nawiasach ostrych \<\>.
  * **Oczekiwany wynik:** Success

**Lekcja 5: Quiz: Tablice generyczne**

  * **typ lekcji: quiz:**
  * **Pytanie:** Jak inaczej zapisać typ `string[]` używając generyków?
  * **odpowiedzi:** \* `Array<string>` (Poprawna)
      * `List<string>`
      * `<string>Array`
  * **Wyjaśnienie:** `Array<T>` to wbudowany typ generyczny w TS.

**Lekcja 6: Ćwiczenie: Wiele typów**

  * **typ lekcji: ćwiczenie:**
  * **Tytuł lekcji:** Para klucz-wartość
  * **Opis:** Użyj dwóch typów generycznych.
  * **Nagroda xp:** 10
  * **Instrukcja zadania:** Zdefiniuj interfejs `Pair<K, V>` z polami `key: K` oraz `value: V`.
  * **Kod startowy:** `interface Pair`
  * **Rozwiazanie:** `interface Pair<K, V> { key: K; value: V; }`
  * **Wskazowka:** Oddziel parametry przecinkiem wewnątrz \<\>.
  * **Oczekiwany wynik:** Success

-----

## 10\. Kurs: HTML/CSS Formularze

**Język:** HTML | CSS | **Opis:** Tworzenie i stylowanie profesjonalnych formularzy. | **Poziom:** Poczatkujacy | **Szacowany czas (h):** 6 | **Kolor:** \#ff5722

### Moduł: Inputs

**Opis:** Pola tekstowe i przyciski.

**Lekcja 1: Input Text**

  * **typ lekcji: ćwiczenie:**
  * **Tytuł lekcji:** Pole tekstowe
  * **Opis:** Podstawowy element zbierania danych.
  * **Nagroda xp:** 10
  * **Instrukcja zadania:** Stwórz element `input` o typie `text` wewnątrz tagu `<form>`.
  * **Kod startowy:** `<form> </form>`
  * **Rozwiazanie:** `<form> <input type="text"> </form>`
  * **Przykladowy kod:** `<input type="password">`
  * **Opis przykladowego kodu:** Pole na hasło (ukrywa znaki).
  * **Wskazowka:** Atrybut type jest kluczowy.
  * **Oczekiwany wynik:** Input Created

**Lekcja 2: Teoria: Etykiety**

  * **typ lekcji: teoria:**
  * **Tytuł lekcji:** Tag Label
  * **Nagroda xp:** 10
  * **Tresc lekcji:** Zawsze łącz `input` z tagiem `<label>`. Poprawia to dostępność i pozwala kliknąć w tekst, by zaznaczyć pole.
  * **przykladowy kod:** `<label for="imie">Imię:</label><input id="imie">`
  * **opis przykladowego kodu:** Powiązanie etykiety z polem przez atrybut ID.

**Lekcja 3: Quiz: Typy pól**

  * **typ lekcji: quiz:**
  * **Pytanie:** Który typ pola (type) najlepiej nadaje się do wpisania adresu e-mail?
  * **odpowiedzi:** \* `text`
      * `email` (Poprawna)
      * `url`
  * **Wyjaśnienie:** `type="email"` włącza automatyczną walidację formatu adresu.

**Lekcja 4: Ćwiczenie: Przycisk wysyłania**

  * **typ lekcji: ćwiczenie:**
  * **Tytuł lekcji:** Submit Button
  * **Opis:** Pozwól użytkownikowi wysłać formularz.
  * **Nagroda xp:** 10
  * **Instrukcja zadania:** Dodaj `button` z atrybutem `type="submit"` i tekstem "Wyślij".
  * **Kod startowy:** `<form> </form>`
  * **Rozwiazanie:** `<form> <button type="submit">Wyślij</button> </form>`
  * **Wskazowka:** Button domyślnie ma typ submit wewnątrz form, ale warto to określić.
  * **Oczekiwany wynik:** Wyślij

**Lekcja 5: Ćwiczenie: Stylowanie inputów**

  * **typ lekcji: ćwiczenie:**
  * **Tytuł lekcji:** Ładne obramowanie
  * **Opis:** Użyj CSS, by formularz wyglądał lepiej.
  * **Nagroda xp:** 10
  * **Instrukcja zadania:** Wewnątrz `<style>` dodaj dla `input` obramowanie `2px solid red`.
  * **Kod startowy:** \`\`\`html

&lt;input type=&quot;text&quot;&gt;
&lt;style&gt;
input {
  /* Tutaj kod */
}
&lt;/style&gt;
```
* **Rozwiazanie:** ```css
input {
  border: 2px solid red;
}
```
* **Wskazowka:** Selektor to po prostu nazwa tagu: input.
* **Oczekiwany wynik:** Red Border

**Lekcja 6: Quiz: Metoda formularza**

  * **typ lekcji: quiz:**
  * **Pytanie:** Który atrybut tagu `<form>` określa, czy dane mają być wysłane jako GET czy POST?
  * **odpowiedzi:** \* `action`
      * `method` (Poprawna)
      * `type`
  * **Wyjaśnienie:** Atrybut `method` decyduje o protokole przesyłania danych.

-----

Możesz teraz skopiować te dane do swojej bazy. Czy potrzebujesz rozbudować któryś z tych modu
