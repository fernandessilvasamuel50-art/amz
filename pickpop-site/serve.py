"""Serve this existing static prototype on this computer only. No dependencies."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parent


class PreviewHandler(SimpleHTTPRequestHandler):
    def send_error(self, code, message=None, explain=None):
        if code != 404:
            return super().send_error(code, message, explain)
        page = (ROOT / '404.html').read_bytes()
        self.send_response(404)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Content-Length', str(len(page)))
        self.end_headers()
        if self.command != 'HEAD':
            self.wfile.write(page)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Preview PickPop locally without publishing.')
    parser.add_argument('--port', type=int, default=8080)
    args = parser.parse_args()
    try:
        with ThreadingHTTPServer(('127.0.0.1', args.port), partial(PreviewHandler, directory=str(ROOT))) as server:
            print(f'PickPop local preview: http://127.0.0.1:{args.port}', flush=True)
            print('Press Ctrl+C to stop. This does not publish the site.', flush=True)
            server.serve_forever()
    except KeyboardInterrupt:
        print('\nPreview stopped.')
    except OSError as error:
        parser.exit(1, f'Could not start preview: {error}. Try another --port.\n')
