import sys
import datetime
import pandas as pd
import os
from dotenv import load_dotenv


try:
    # Cargar variables desde el archivo indicado por ENV_SCRIPTS_FILE o .env-scripts por defecto
    env_file = os.environ.get('ENV_SCRIPTS_FILE', '.env-scripts-test')
    # Obtener el path absoluto de /taskman-back
    backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    env_path = os.path.join(backend_dir, env_file)
    print('Intentando cargar:', env_path)
    load_dotenv(dotenv_path=env_path)
    print('Contenido .env:')
    try:
        with open(env_path, 'r') as f:
            print(f.read())
    except Exception as e:
        print(f"No se pudo leer el archivo: {e}")
    print('DB_HOST:', os.getenv('DB_HOST'))
    df = pd.DataFrame({'a': [1, 2], 'b': [3, 4]})
    print(f"DataFrame generado:\n{df}")
    raise ValueError(f"DB_Host: {os.getenv('DB_HOST')}.")
except Exception as e:
    print(f"Error simulado a las {datetime.datetime.now()} - {e}", file=sys.stderr)
    sys.exit(1)
