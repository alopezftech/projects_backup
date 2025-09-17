import sys
import datetime
import pandas as pd

try:
    df = pd.DataFrame({'a': [1, 2], 'b': [3, 4]})
    print(f"DataFrame generado:\n{df}")
    raise ValueError("Simulando un error después de usar pandas")
except Exception as e:
    print(f"Error simulado a las {datetime.datetime.now()} - {e}", file=sys.stderr)
    sys.exit(1)
