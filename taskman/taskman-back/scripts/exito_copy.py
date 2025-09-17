import sys
import datetime
import requests

try:
    response = requests.get('https://api.github.com')
    print(f"Status code: {response.status_code}")
    print(f"Ejecución exitosa a las {datetime.datetime.now()}")
    sys.exit(0)
except Exception as e:
    print(f"Error en la petición: {e}", file=sys.stderr)
    sys.exit(1)
