import type { ToolContent } from './types';

export const de: ToolContent = {
  htmlLang: 'de',

  meta: {
    title: 'XLSX in CSV umwandeln — eine CSV pro Blatt | runlocally',
    description:
      'Wandle XLSX-, XLSM- und XLS-Arbeitsmappen im Browser in UTF-8-CSV-Dateien um. Jedes Tabellenblatt wird separat ausgegeben, mehrere Blätter als ZIP.',
    ogTitle: 'XLSX in CSV umwandeln — nach Blättern getrennt',
    ogDescription:
      'Wandle jedes Tabellenblatt einer Excel-Arbeitsmappe im Browser in eine UTF-8-CSV-Datei um. Die Datei wird nicht hochgeladen.',
  },

  hero: {
    h1: 'XLSX in CSV umwandeln',
    tagline:
      'Erstelle für jedes Blatt einer Excel-Arbeitsmappe eine UTF-8-CSV-Datei. Die Verarbeitung erfolgt im Browser.',
  },

  intro: {
    h2: 'Excel-Arbeitsmappen in einzelne CSV-Dateien aufteilen',
    paras: [
      'Eine Excel-Arbeitsmappe kann mehrere Tabellenblätter enthalten, eine CSV-Datei bildet dagegen jeweils eine Tabelle ab. Dieses Werkzeug liest .xlsx-, .xlsm- und ältere .xls-Dateien und erzeugt für jedes Blatt eine eigene CSV-Datei.',
      'Bei nur einem Blatt wird die CSV direkt heruntergeladen. Ab zwei Blättern werden alle CSV-Dateien in einer ZIP-Datei zusammengefasst, deren Name von der Arbeitsmappe abgeleitet ist. Zeichen, die in gängigen Dateinamen nicht zulässig sind, werden in den Blattnamen ersetzt.',
    ],
  },

  privacy: {
    h2: 'Die Arbeitsmappe bleibt auf deinem Gerät',
    lead: 'Das Lesen der Arbeitsmappe, die CSV-Umwandlung und das Erstellen der ZIP-Datei laufen im Browser:',
    points: [
      'Die ausgewählte Arbeitsmappe wird nicht an einen Umwandlungsserver gesendet.',
      'Die Seite besteht aus statischen Dateien und besitzt keinen Server-Endpunkt zur Dateiverarbeitung.',
      'Der Quellcode ist unter der MIT-Lizenz verfügbar.',
      'Sobald die benötigten Anwendungsdaten im Browser-Cache liegen, ist die Umwandlung auch ohne Netzwerkverbindung möglich.',
    ],
    note: 'Im Netzwerk-Bereich der Browserwerkzeuge lässt sich während der Umwandlung prüfen, dass keine Anfrage die Arbeitsmappe enthält.',
    sourceLinkText: 'Quellcode ansehen.',
  },

  howto: {
    h2: 'So funktioniert es',
    steps: [
      {
        h3: 'Eine Arbeitsmappe auswählen',
        p: 'Wähle eine .xlsx-, .xlsm- oder .xls-Datei aus oder lege sie auf der Seite ab.',
      },
      {
        h3: 'Ergebnis je Blatt prüfen',
        p: 'Nach der Umwandlung werden der CSV-Dateiname und die Zeilenzahl für jedes Tabellenblatt angezeigt.',
      },
      {
        h3: 'Ausgabe speichern',
        p: 'Ein einzelnes Blatt wird als CSV heruntergeladen. Mehrere Blätter werden in einer ZIP-Datei mit der Endung „-sheets.zip“ zusammengefasst.',
      },
    ],
  },

  faqHeading: 'Häufige Fragen',
  faq: [
    {
      q: 'Wird meine Excel-Arbeitsmappe hochgeladen?',
      a: 'Nein. Code im Browser liest die Arbeitsmappe und wandelt sie um. Dieses Werkzeug besitzt keinen Server zur Dateiverarbeitung.',
    },
    {
      q: 'Welche Excel-Formate werden unterstützt?',
      a: 'Unterstützt werden .xlsx, .xlsm mit Makros sowie das ältere binäre .xls-Format. Kennwortgeschützte oder verschlüsselte Arbeitsmappen lassen sich möglicherweise nicht lesen.',
    },
    {
      q: 'Was geschieht bei mehreren Tabellenblättern?',
      a: 'Jedes Blatt wird zu einer eigenen CSV-Datei. Ab zwei Blättern enthält der Download eine ZIP-Datei; bei einem Blatt wird die CSV direkt heruntergeladen.',
    },
    {
      q: 'Welche Zeichenkodierung wird verwendet?',
      a: 'Die CSV-Dateien verwenden UTF-8 mit Byte Order Mark (BOM). Dadurch kann Excel UTF-8-Text mit Umlauten, japanischen Zeichen und anderen Schriftsystemen erkennen.',
    },
    {
      q: 'Wie werden Formeln behandelt?',
      a: 'Verwendet wird das in der Arbeitsmappe gespeicherte Formelergebnis. Formeln werden nicht neu berechnet. Ein fehlender oder veralteter gespeicherter Wert bleibt daher auch in der CSV fehlend oder veraltet.',
    },
    {
      q: 'Bleiben Formatierungen, Diagramme, Bilder oder Makros erhalten?',
      a: 'Nein. CSV enthält Zellinhalte in Zeilen und Spalten. Formatierungen, Diagramme, eingebettete Bilder, die Formeln selbst, Makros und weitere Arbeitsmappenfunktionen sind nicht Teil der Ausgabe.',
    },
    {
      q: 'Funktioniert das Werkzeug offline?',
      a: 'Ja, nachdem der Browser die Seite und die benötigten Umwandlungsdaten gespeichert hat. Es kann außerdem als PWA installiert werden.',
    },
  ],

  footer: {
    openSourceLabel: 'Open Source (MIT)',
    partOf: 'Teil von',
    brandTail: '— kleine Werkzeuge, die lokal auf deinem Gerät laufen.',
    colophon:
      'Entwickelt und gepflegt von Geppetto. Bei Teilen von Code und Text kommt KI-Unterstützung zum Einsatz; die Ergebnisse werden vom Maintainer geprüft.',
    securityText: 'Sicherheit',
  },
};
