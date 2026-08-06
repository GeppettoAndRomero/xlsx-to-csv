import type { ToolContent } from './types';

export const es: ToolContent = {
  htmlLang: 'es',

  meta: {
    title: 'Convertir XLSX a CSV — un archivo por hoja | runlocally',
    description:
      'Convierte libros XLSX, XLSM o XLS en archivos CSV UTF-8 desde el navegador. Cada hoja se guarda por separado y, si hay varias, se descargan en un ZIP.',
    ogTitle: 'Convertir XLSX a CSV — una hoja por archivo',
    ogDescription:
      'Convierte cada hoja de un libro de Excel en un CSV UTF-8 desde el navegador. El archivo no se sube.',
  },

  hero: {
    h1: 'Convertir XLSX a CSV',
    tagline:
      'Crea un CSV UTF-8 por cada hoja de un libro de Excel. El procesamiento se realiza en el navegador.',
  },

  intro: {
    h2: 'Separar un libro de Excel en archivos CSV',
    paras: [
      'Un libro de Excel puede contener varias hojas, mientras que cada CSV representa una sola tabla. Esta herramienta lee archivos .xlsx, .xlsm y el formato antiguo .xls, y genera un CSV independiente por hoja.',
      'Si el libro solo tiene una hoja, se descarga el CSV directamente. Cuando hay dos o más, todos los CSV se agrupan en un ZIP cuyo nombre procede del libro original. Los caracteres que no se pueden usar en nombres de archivo habituales se sustituyen en los nombres derivados de las hojas.',
    ],
  },

  privacy: {
    h2: 'El libro se procesa en tu dispositivo',
    lead: 'La lectura del libro, la conversión a CSV y la creación del ZIP se ejecutan en el navegador:',
    points: [
      'El libro seleccionado no se envía a un servidor de conversión.',
      'La página está formada por archivos estáticos y no dispone de un servidor para procesar libros.',
      'El código fuente está disponible con licencia MIT.',
      'Cuando el navegador ha guardado los recursos necesarios, la conversión puede ejecutarse sin conexión.',
    ],
    note: 'Puedes consultar el panel Red del navegador durante la conversión; ninguna solicitud contiene el libro.',
    sourceLinkText: 'Ver el código fuente.',
  },

  howto: {
    h2: 'Cómo usarlo',
    steps: [
      {
        h3: 'Selecciona un libro',
        p: 'Elige un archivo .xlsx, .xlsm o .xls, o suéltalo en la página.',
      },
      {
        h3: 'Revisa el resultado de cada hoja',
        p: 'Al terminar, se muestran el nombre del CSV y el número de filas correspondiente a cada hoja.',
      },
      {
        h3: 'Guarda los archivos',
        p: 'Una sola hoja se descarga como CSV. Si hay varias, se agrupan en un ZIP cuyo nombre termina en «-sheets.zip».',
      },
    ],
  },

  faqHeading: 'Preguntas frecuentes',
  faq: [
    {
      q: '¿Se sube mi libro de Excel?',
      a: 'No. El código del navegador lee y convierte el libro. Esta herramienta no tiene un servidor dedicado al procesamiento de archivos.',
    },
    {
      q: '¿Qué formatos de Excel se admiten?',
      a: 'Se admiten .xlsx, .xlsm con macros y el formato binario antiguo .xls. Es posible que los libros cifrados o protegidos con contraseña no se puedan leer.',
    },
    {
      q: '¿Qué ocurre si el libro tiene varias hojas?',
      a: 'Cada hoja se convierte en un CSV independiente. Dos o más hojas se descargan en un ZIP; si solo hay una, el navegador descarga directamente el CSV.',
    },
    {
      q: '¿Qué codificación se utiliza?',
      a: 'Los CSV usan UTF-8 con marca de orden de bytes (BOM). Esta marca ayuda a que Excel reconozca el texto UTF-8, incluidos acentos, japonés y otros sistemas de escritura.',
    },
    {
      q: '¿Cómo se tratan las fórmulas?',
      a: 'El conversor usa el resultado de la fórmula guardado en el libro. No vuelve a calcular las fórmulas, por lo que un resultado almacenado ausente o desactualizado seguirá igual en el CSV.',
    },
    {
      q: '¿Se conservan el formato, los gráficos, las imágenes o las macros?',
      a: 'No. CSV almacena el contenido de las celdas en filas y columnas. El formato, los gráficos, las imágenes incrustadas, las fórmulas en sí, las macros y otras funciones del libro no forman parte de la salida.',
    },
    {
      q: '¿Funciona sin conexión?',
      a: 'Sí, una vez que el navegador ha guardado la página y los recursos necesarios para la conversión. También se puede instalar como PWA.',
    },
  ],

  footer: {
    openSourceLabel: 'Código abierto (MIT)',
    partOf: 'forma parte de',
    brandTail: '— pequeñas herramientas que se ejecutan localmente en tu dispositivo.',
    colophon:
      'Desarrollado y mantenido por Geppetto. Parte del código y del texto se crea con asistencia de IA; el responsable revisa el resultado.',
    securityText: 'Seguridad',
  },

  related: {
    h2: 'Herramientas relacionadas',
    blogLinkText: 'Leer las notas técnicas',
  },
};
