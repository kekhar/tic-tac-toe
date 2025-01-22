from http.server import SimpleHTTPRequestHandler, HTTPServer

class CustomHTTPRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        return super().end_headers()

if __name__ == "__main__":
    server_address = ("", 8000)
    httpd = HTTPServer(server_address, CustomHTTPRequestHandler)
    print("Сервер запущен на http://localhost:8000")
    httpd.serve_forever()
