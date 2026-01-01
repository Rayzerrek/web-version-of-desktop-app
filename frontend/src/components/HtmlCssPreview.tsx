interface HtmlCssPreviewProps {
  html: string;
  css?: string;
  js?: string;
}

export default function HtmlCssPreview({
  html = "",
  css = "",
  js = "",
}: HtmlCssPreviewProps) {
  const documentContent = `
        <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
        <style>
            ${css}
        </style>
    </head>
    <body>
        ${html}

        <script>
            // Przechwytywanie błędów i wysyłanie ich do konsoli nadrzędnej
            window.onerror = function(message, source, lineno, colno, error) {
                console.error("DOM Script Error:", message);
                return false;
            };

            try {
                ${js}
            } catch (err) {
                console.error("Execution Error:", err.message);
            }
        </script>
    </body>
    </html>
    `;

  return (
    <iframe
      title="HTML CSS JS Preview"
      sandbox="allow-scripts allow-same-origin"
      style={{ width: "100%", height: "100%", border: "none" }}
      srcDoc={documentContent}
    />
  );
}
