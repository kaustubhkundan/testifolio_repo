import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const widgetUrl = `/api/widget?${searchParams.toString()}`

  const js = `
    (function() {
      // Create iframe
      const iframe = document.createElement('iframe');
      iframe.src = "${widgetUrl}";
      iframe.style.width = '100%';
      iframe.style.border = 'none';
      iframe.style.overflow = 'hidden';
      iframe.scrolling = 'no';
      iframe.frameBorder = '0';
      iframe.allowTransparency = 'true';
      iframe.title = 'Testifolio Testimonials Widget';
      
      // Set initial height
      iframe.style.height = '600px';
      
      // Listen for resize messages from iframe
      window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'resize') {
          iframe.style.height = event.data.height + 'px';
        }
      });
      
      // Find container and append iframe
      const container = document.getElementById('testifolio-widget');
      if (container) {
        container.appendChild(iframe);
      } else {
        console.error('Testifolio Widget: Container element not found. Please add <div id="testifolio-widget"></div> to your page.');
      }
    })();
  `

  return new NextResponse(js, {
    headers: {
      "Content-Type": "application/javascript",
    },
  })
}
