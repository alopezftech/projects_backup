import customtkinter as ctk
import tkinter as tk
from tkinter import filedialog, messagebox
import pandas as pd
from facebook_business.api import FacebookAdsApi
from facebook_business.adobjects.adaccount import AdAccount
from facebook_business.adobjects.user import User
import requests
import time
import unicodedata
import sys
import os


# Listas de ejemplo (puedes rellenarlas luego)
# Mostrar solo una opción para el usuario, ordenada alfabéticamente
lista_paises_usuario = sorted([
    "Afganistán",
    "Albania",
    "Alemania",
    "Andorra",
    "Angola",
    "Antigua y Barbuda",
    "Arabia Saudí",
    "Argelia",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaiyán",
    "Bahamas",
    "Bahréin",
    "Bangladesh",
    "Barbados",
    "Bélgica",
    "Belice",
    "Benín",
    "Bután",
    "Bielorrusia",
    "Birmania",
    "Bolivia",
    "Bosnia y Herzegovina",
    "Botsuana",
    "Brasil",
    "Brunéi",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Camboya",
    "Camerún",
    "Canadá",
    "Chad",
    "Chile",
    "China",
    "Chipre",
    "Ciudad del Vaticano",
    "Colombia",
    "Comoras",
    "Corea del Norte",
    "Corea del Sur",
    "Costa de Marfil",
    "Costa Rica",
    "Croacia",
    "Cuba",
    "Dinamarca",
    "Dominica",
    "Ecuador",
    "Egipto",
    "El Salvador",
    "Emiratos Árabes Unidos",
    "Eritrea",
    "Eslovaquia",
    "Eslovenia",
    "España",
    "Estados Unidos",
    "Estonia",
    "Etiopía",
    "Filipinas",
    "Finlandia",
    "Fiyi",
    "Francia",
    "Gabón",
    "Gambia",
    "Georgia",
    "Ghana",
    "Gibraltar",
    "Granada",
    "Grecia",
    "Guatemala",
    "Guinea",
    "Guinea Ecuatorial",
    "Guinea-Bissau",
    "Guyana",
    "Haití",
    "Honduras",
    "Hong Kong",
    "Hungría",
    "India",
    "Indonesia",
    "Irak",
    "Irán",
    "Irlanda",
    "Isla de Man",
    "Islandia",
    "Islas Marshall",
    "Islas Salomón",
    "Israel",
    "Italia",
    "Jamaica",
    "Japón",
    "Jordania",
    "Kazajistán",
    "Kenia",
    "Kirguistán",
    "Kiribati",
    "Kosovo",
    "Kuwait",
    "Laos",
    "Lesoto",
    "Letonia",
    "Líbano",
    "Liberia",
    "Libia",
    "Liechtenstein",
    "Lituania",
    "Luxemburgo",
    "Macedonia del Norte",
    "Madagascar",
    "Malasia",
    "Malaui",
    "Maldivas",
    "Malí",
    "Malta",
    "Marruecos",
    "Mauricio",
    "Mauritania",
    "México",
    "Micronesia",
    "Moldavia",
    "Mónaco",
    "Mongolia",
    "Montenegro",
    "Mozambique",
    "Namibia",
    "Nauru",
    "Nepal",
    "Nicaragua",
    "Níger",
    "Nigeria",
    "Noruega",
    "Nueva Zelanda",
    "Omán",
    "Países Bajos",
    "Pakistán",
    "Palaos",
    "Palestina",
    "Panamá",
    "Papúa Nueva Guinea",
    "Paraguay",
    "Perú",
    "Polonia",
    "Portugal",
    "Puerto Rico",
    "Catar",
    "Reino Unido",
    "República Centroafricana",
    "República Checa",
    "República del Congo",
    "República Democrática del Congo",
    "República Dominicana",
    "Ruanda",
    "Rumania",
    "Rusia",
    "Samoa",
    "San Cristóbal y Nieves",
    "San Marino",
    "San Vicente y las Granadinas",
    "Santa Lucía",
    "Santo Tomé y Príncipe",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leona",
    "Singapur",
    "Siria",
    "Somalia",
    "Sri Lanka",
    "Sudáfrica",
    "Sudán",
    "Sudán del Sur",
    "Suecia",
    "Suiza",
    "Surinam",
    "Suazilandia",
    "Tailandia",
    "Taiwán",
    "Tanzania",
    "Tayikistán",
    "Timor Oriental",
    "Togo",
    "Tonga",
    "Trinidad y Tobago",
    "Túnez",
    "Turkmenistán",
    "Turquía",
    "Tuvalu",
    "Ucrania",
    "Uganda",
    "Uruguay",
    "Uzbekistán",
    "Vanuatu",
    "Venezuela",
    "Vietnam",
    "Yemen",
    "Yibuti",
    "Zambia",
    "Zimbabue",
])
lista_facultades = sorted([
    "Medicina",
    "Ingeniería",
    "Escuela de Negocios",
    "Educación",
    "Psicología",
    "Veterinaria",
    "Odontología",
    "Fisioterapia",
    "Humanidades",
    "Enfermería",
    "Informática",
    "Diseño",
    "Ciencias del Deporte",
    "Nutrición",
    "Farmacia",
    "Periodismo y Comunicación",
    "Videojuegos",
    "Derecho",
    "Inteligencia Artificial",
    "Escuela de Idiomas"
])

# Mapeo de selección a valores internos
mapeo_paises = {
    "Estados Unidos": ["Estados Unidos", "Estados Unidos de América"],
    "Catar": ["Catar", "Qatar"],
    "Arabia Saudí": ["Arabia Saudí", "Arabia Saudita"],
    "República Democrática del Congo": ["República Democrática del Congo", "R.D. del Congo"],
    # ...puedes agregar más casos similares si lo necesitas...
}

class App(ctk.CTk):
    def __init__(self):
        super().__init__()
        self.title("Filtro Meta")
        def resource_path(relative_path):
            if hasattr(sys, '_MEIPASS'):
                return os.path.join(sys._MEIPASS, relative_path)
            return os.path.join(os.path.abspath("."), relative_path)
        self.iconbitmap(resource_path("icon.ico"))
        self.geometry("900x600")

        ctk.set_appearance_mode("System")
        ctk.set_default_color_theme("blue")


        self.boton_cargar_csv = ctk.CTkButton(self, text="Cargar CSV", command=self.cargar_csv)
        self.boton_cargar_csv.pack(pady=(10,0))

        self.seleccionados_paises = set()
        self.seleccionados_facultades = set()

        self.frame_listas = ctk.CTkFrame(self)
        self.frame_listas.pack(pady=20, padx=40, fill=tk.X)

        # Buscador de países con botón X
        self.frame_busca_pais = ctk.CTkFrame(self.frame_listas, fg_color="transparent")
        self.frame_busca_pais.grid(row=0, column=0, padx=10, pady=(0,5), sticky="ew")
        self.entry_busca_pais = ctk.CTkEntry(self.frame_busca_pais, placeholder_text="Buscar país...")
        self.entry_busca_pais.pack(side="left", fill="x", expand=True)
        self.entry_busca_pais.bind("<KeyRelease>", self.filtra_paises)
        self.boton_clear_pais = ctk.CTkButton(self.frame_busca_pais, text="✕", width=30, command=self.clear_busca_pais)
        self.boton_clear_pais.pack(side="right", padx=(5,0))
        self.boton_clear_pais.pack_forget()

        # Buscador de facultades con botón X
        self.frame_busca_facultad = ctk.CTkFrame(self.frame_listas, fg_color="transparent")
        self.frame_busca_facultad.grid(row=0, column=1, padx=10, pady=(0,5), sticky="ew")
        self.entry_busca_facultad = ctk.CTkEntry(self.frame_busca_facultad, placeholder_text="Buscar facultad...")
        self.entry_busca_facultad.pack(side="left", fill="x", expand=True)
        self.entry_busca_facultad.bind("<KeyRelease>", self.filtra_facultades)
        self.boton_clear_facultad = ctk.CTkButton(self.frame_busca_facultad, text="✕", width=30, command=self.clear_busca_facultad)
        self.boton_clear_facultad.pack(side="right", padx=(5,0))
        self.boton_clear_facultad.pack_forget()

        # Listado de países
        self.listbox_paises = tk.Listbox(self.frame_listas, selectmode=tk.MULTIPLE, exportselection=0, height=8)
        self.listbox_paises.grid(row=1, column=0, padx=10, sticky="nsew")
        self.listbox_paises.bind('<<ListboxSelect>>', self.actualiza_seleccion_paises)
        self.actualiza_listbox(self.listbox_paises, lista_paises_usuario, self.seleccionados_paises)
        # Botón para borrar selección de países
        self.boton_borrar_paises = ctk.CTkButton(self.frame_listas, text="Borrar selección países", command=self.borrar_seleccion_paises)
        self.boton_borrar_paises.grid(row=2, column=0, pady=(5,0), padx=10, sticky="ew")

        # Listado de facultades
        self.listbox_facultades = tk.Listbox(self.frame_listas, selectmode=tk.MULTIPLE, exportselection=0, height=8)
        self.listbox_facultades.grid(row=1, column=1, padx=10, sticky="nsew")
        self.listbox_facultades.bind('<<ListboxSelect>>', self.actualiza_seleccion_facultades)
        self.actualiza_listbox(self.listbox_facultades, lista_facultades, self.seleccionados_facultades)
        # Botón para borrar selección de facultades
        self.boton_borrar_facultades = ctk.CTkButton(self.frame_listas, text="Borrar selección facultades", command=self.borrar_seleccion_facultades)
        self.boton_borrar_facultades.grid(row=2, column=1, pady=(5,0), padx=10, sticky="ew")

        self.frame_listas.columnconfigure(0, weight=1)
        self.frame_listas.columnconfigure(1, weight=1)

         # Botón para seleccionar todos los países
        self.boton_seleccionar_todos_paises = ctk.CTkButton(
            self.frame_listas, text="Seleccionar todos los países", command=self.seleccionar_todos_paises
        )
        self.boton_seleccionar_todos_paises.grid(row=3, column=0, pady=(5,0), padx=10, sticky="ew")

        # Botón para seleccionar todas las facultades
        self.boton_seleccionar_todas_facultades = ctk.CTkButton(
            self.frame_listas, text="Seleccionar todas las facultades", command=self.seleccionar_todas_facultades
        )
        self.boton_seleccionar_todas_facultades.grid(row=3, column=1, pady=(5,0), padx=10, sticky="ew")
        
        # Campos para máximo EUR y MXN
        self.frame_maximos = ctk.CTkFrame(self)
        self.frame_maximos.pack(pady=(10,0))
        self.label_max_eur = ctk.CTkLabel(self.frame_maximos, text="Máximo EUR:")
        self.label_max_eur.grid(row=0, column=0, padx=(0,5))
        self.entry_max_eur = ctk.CTkEntry(self.frame_maximos, width=80)
        self.entry_max_eur.grid(row=0, column=1, padx=(0,15))
        self.entry_max_eur.insert(0, "2")  # Valor por defecto
        self.label_max_mxn = ctk.CTkLabel(self.frame_maximos, text="Máximo MXN:")
        self.label_max_mxn.grid(row=0, column=2, padx=(0,5))
        self.entry_max_mxn = ctk.CTkEntry(self.frame_maximos, width=80)
        self.entry_max_mxn.grid(row=0, column=3)
        self.entry_max_mxn.insert(0, "41")  # Valor por defecto

        self.boton_filtrar = ctk.CTkButton(self, text="Filtrar y guardar XLSX", command=self.filtrar_guardar)
        self.boton_filtrar.pack(pady=30)

    def actualiza_listbox(self, listbox, elementos, seleccionados):
        listbox.delete(0, tk.END)
        for elem in elementos:
            listbox.insert(tk.END, elem)
        # Restaurar selección
        for idx, elem in enumerate(elementos):
            if elem in seleccionados:
                listbox.selection_set(idx)

    def actualiza_seleccion_paises(self, event=None):
        visibles = [self.listbox_paises.get(i) for i in range(self.listbox_paises.size())]
        seleccionados = [visibles[i] for i in self.listbox_paises.curselection()]
        # Mantener los seleccionados aunque no estén visibles
        self.seleccionados_paises.update(seleccionados)
        # Eliminar los que se deseleccionan
        for elem in visibles:
            if elem not in seleccionados and elem in self.seleccionados_paises:
                self.seleccionados_paises.remove(elem)

    def actualiza_seleccion_facultades(self, event=None):
        visibles = [self.listbox_facultades.get(i) for i in range(self.listbox_facultades.size())]
        seleccionados = [visibles[i] for i in self.listbox_facultades.curselection()]
        self.seleccionados_facultades.update(seleccionados)
        for elem in visibles:
            if elem not in seleccionados and elem in self.seleccionados_facultades:
                self.seleccionados_facultades.remove(elem)

    def filtra_paises(self, event=None):
        texto = self.entry_busca_pais.get().lower()
        self.boton_clear_pais.pack_forget() if not texto else self.boton_clear_pais.pack(side="right", padx=(5,0))
        filtrados = [p for p in lista_paises_usuario if texto in p.lower()]
        self.actualiza_listbox(self.listbox_paises, filtrados, self.seleccionados_paises)

    def filtra_facultades(self, event=None):
        texto = self.entry_busca_facultad.get().lower()
        self.boton_clear_facultad.pack_forget() if not texto else self.boton_clear_facultad.pack(side="right", padx=(5,0))
        filtrados = [f for f in lista_facultades if texto in f.lower()]
        self.actualiza_listbox(self.listbox_facultades, filtrados, self.seleccionados_facultades)

    def clear_busca_pais(self):
        self.entry_busca_pais.delete(0, tk.END)
        self.filtra_paises()

    def clear_busca_facultad(self):
        self.entry_busca_facultad.delete(0, tk.END)
        self.filtra_facultades()

    def normaliza(self, texto):
        if not isinstance(texto, str):
            return ""
        texto = texto.lower()
        texto = unicodedata.normalize('NFKD', texto)
        texto = ''.join([c for c in texto if not unicodedata.combining(c)])
        return texto.strip()

    def mejor_facultad(self, texto):
        texto_norm = self.normaliza(texto)
        mejor = None
        mejor_pos = len(texto_norm)
        for fac in lista_facultades:
            fac_norm = self.normaliza(fac)
            pos = texto_norm.find(fac_norm)
            if pos != -1 and pos < mejor_pos:
                mejor = fac
                mejor_pos = pos
        return mejor

    def extrae_pais_facultad(self, texto):
        texto_norm = self.normaliza(texto)
        pais_encontrado = None
        facultad_encontrada = None
        # Construir lista de países con equivalentes (priorizar nombres largos)
        paises_equivalentes = []
        for p in lista_paises_usuario:
            if p in mapeo_paises:
                paises_equivalentes.extend(mapeo_paises[p])
            else:
                paises_equivalentes.append(p)
        # Ordenar por longitud descendente para evitar confusiones (ej: República Dominicana vs Dominica)
        paises_equivalentes = sorted(paises_equivalentes, key=lambda x: -len(x))
        for p in paises_equivalentes:
            if self.normaliza(p) in texto_norm:
                pais_encontrado = p
                break
        # Buscar facultad (la que aparece primero)
        mejor = None
        mejor_pos = len(texto_norm)
        for fac in lista_facultades:
            fac_norm = self.normaliza(fac)
            pos = texto_norm.find(fac_norm)
            if pos != -1 and pos < mejor_pos:
                mejor = fac
                mejor_pos = pos
        facultad_encontrada = mejor
        return pais_encontrado, facultad_encontrada

    def cargar_csv(self):
        archivos = filedialog.askopenfilenames(filetypes=[("Archivos de datos", "*.csv;*.xlsx")])
        if archivos:
            nuevos_datos = []
            for archivo in archivos:
                try:
                    if archivo.lower().endswith('.csv'):
                        # Leer identificador como texto si existe
                        df = pd.read_csv(archivo, dtype={
                            'Identificador del conjunto de anuncios': str
                        })
                    elif archivo.lower().endswith('.xlsx'):
                        # Leer identificador como texto si existe
                        df = pd.read_excel(archivo, dtype={
                            'Identificador del conjunto de anuncios': str
                        })
                    else:
                        continue
                    if 'Nombre de la campaña' not in df.columns:
                        messagebox.showerror("Error", f"El archivo {archivo} no contiene la columna 'Nombre de la campaña'.")
                        continue
                    if 'Estado de la entrega' not in df.columns:
                        messagebox.showerror("Error", f"El archivo {archivo} no contiene la columna 'Estado de la entrega'.")
                        continue
                    if 'Importe gastado (EUR)' not in df.columns and 'Importe gastado (MXN)' not in df.columns:
                        messagebox.showerror("Error", f"El archivo {archivo} no contiene la columna 'Importe gastado (EUR)' ni 'Importe gastado (MXN)'.")
                        continue
                    if 'Clientes potenciales de Meta' not in df.columns and 'Clientes potenciales en Meta' not in df.columns and not any('Resultados' in col for col in df.columns):
                        messagebox.showerror("Error", f"El archivo {archivo} no contiene la columna 'Clientes potenciales de Meta', 'Clientes potenciales en Meta' ni ninguna columna con 'Resultados'.")
                        continue
                    if 'Identificador del conjunto de anuncios' not in df.columns:
                        messagebox.showwarning("Advertencia", f"El archivo {archivo} no contiene la columna 'Identificador del conjunto de anuncios'.")
                        continue
                    for _, row in df.iterrows():
                        nombre_camp = str(row['Nombre de la campaña'])
                        pais, facultad = self.extrae_pais_facultad(nombre_camp)
                        if pais and facultad:
                            registro = dict(row)
                            registro['pais'] = pais
                            registro['facultad'] = facultad
                            registro['nombre'] = nombre_camp
                            nuevos_datos.append(registro)
                except Exception as e:
                    messagebox.showerror("Error", f"No se pudo cargar {archivo}: {e}")
            if nuevos_datos:
                global datos
                datos = nuevos_datos
                messagebox.showinfo("Carga exitosa", f"Se cargaron {len(nuevos_datos)} registros de los archivos seleccionados.")
            else:
                messagebox.showwarning("Sin datos", "No se encontraron registros válidos en los archivos seleccionados.")

    def filtrar_guardar(self):
        seleccion_paises = list(self.seleccionados_paises)
        # Expandir selección según mapeo
        seleccion_paises_expandidos = []
        for p in seleccion_paises:
            if p in mapeo_paises:
                seleccion_paises_expandidos.extend(mapeo_paises[p])
            else:
                seleccion_paises_expandidos.append(p)
        seleccion_facultades = list(self.seleccionados_facultades)
        if not seleccion_paises_expandidos or not seleccion_facultades:
            messagebox.showwarning("Selección", "Debes seleccionar al menos un país y una facultad.")
            return
        # Leer los valores máximos de EUR y MXN, admitiendo coma o punto
        try:
            max_eur_str = self.entry_max_eur.get().replace(',', '.')
            max_eur = float(max_eur_str)
        except:
            max_eur = 2
        try:
            max_mxn_str = self.entry_max_mxn.get().replace(',', '.')
            max_mxn = float(max_mxn_str)
        except:
            max_mxn = 41
        filtrados = []
        for d in datos:
            pais_norm = self.normaliza(d['pais'])
            facultad_norm = self.normaliza(d['facultad'])
            print(f'Registro: pais={pais_norm}, facultad={facultad_norm}')
            match_pais = any(self.normaliza(p) == pais_norm for p in seleccion_paises_expandidos)
            match_facultad = any(self.normaliza(f) == facultad_norm for f in seleccion_facultades)
            # Filtros adicionales
            estado_ok = str(d.get('Estado de la entrega', '')).strip().lower() == 'active'
            # Buscar columna de clientes potenciales
            clientes_col = None
            for k in d.keys():
                k_norm = k.lower()
                if k_norm == 'clientes potenciales de meta' or k_norm == 'clientes potenciales en meta' or 'resultados' in k_norm:
                    clientes_col = k
                    break
            valor_clientes = d.get(clientes_col, 0)
            if pd.isna(valor_clientes) or str(valor_clientes).strip() in ['0', '0.0', '']:
                clientes_ok = True
            else:
                clientes_ok = False
            print(str(d.get('Clientes potenciales de Meta', '')))
            # Buscar columna de importe gastado
            importe_col = None
            for k in d.keys():
                if k.lower().startswith('importe gastado'):
                    importe_col = k
                    break
            importe_val = d.get(importe_col, 0)
            try:
                if importe_col:
                    if 'eur' in importe_col.lower():
                        importe_ok = float(importe_val) <= max_eur
                    elif 'mxn' in importe_col.lower():
                        importe_ok = float(importe_val) <= max_mxn
                    else:
                        importe_ok = float(importe_val) <= max_eur
                else:
                    importe_ok = False
            except:
                importe_ok = False
            if match_pais and match_facultad:
                print(f'Match: pais={match_pais}, facultad={match_facultad}')
                print(f'Importe: {importe_col}, Estado: {d.get("Estado de la entrega", "")}, Clientes: {d.get("Clientes potenciales de Meta", 0)}')
                print(f'Estado: {estado_ok}, Clientes: {clientes_ok}, Importe: {importe_ok}')
            if match_pais and match_facultad and estado_ok and clientes_ok and importe_ok:
                filtrados.append(d)
        if not filtrados:
            messagebox.showinfo("Sin resultados", "No se encontraron registros con los filtros seleccionados.")
            return
        salida = []
        for d in filtrados:
            # Unificar importe gastado
            importe_val = None
            for k in d.keys():
                if k.lower().startswith('importe gastado'):
                    v = d.get(k, None)
                    if v is not None and not pd.isna(v):
                        importe_val = v
                        break
            # Unificar clientes potenciales
            clientes_val = None
            for k in d.keys():
                k_norm = k.lower()
                if k_norm == 'clientes potenciales de meta' or k_norm == 'clientes potenciales en meta' or 'resultados' in k_norm:
                    v = d.get(k, None)
                    if v is not None and not pd.isna(v):
                        clientes_val = v
                        break
            # Ajuste identificador: convertir float a int y luego a str si aplica
            identificador = d.get('Identificador del conjunto de anuncios', '')
            if isinstance(identificador, float):
                if not pd.isna(identificador):
                    identificador = str(int(identificador))
                else:
                    identificador = ''
            else:
                identificador = str(identificador)
            salida.append({
                'Nombre de la campaña': d.get('Nombre de la campaña', ''),
                'Pais': d.get('pais', ''),
                'Facultad': d.get('facultad', ''),
                'Identificador del conjunto de anuncios': identificador,
                'Estado de la entrega': d.get('Estado de la entrega', ''),
                'Importe gastado': importe_val,
                'Clientes potenciales': clientes_val
            })
        df = pd.DataFrame(salida)
        archivo = filedialog.asksaveasfilename(defaultextension=".xlsx", filetypes=[("Excel files", "*.xlsx")])
        if archivo:
            # Forzar columna identificador como texto en Excel
            with pd.ExcelWriter(archivo, engine='xlsxwriter') as writer:
                df.to_excel(writer, index=False, sheet_name='Sheet1')
                workbook  = writer.book
                worksheet = writer.sheets['Sheet1']
                text_format = workbook.add_format({'num_format': '@'})
                col_idx = df.columns.get_loc('Identificador del conjunto de anuncios')
                worksheet.set_column(col_idx, col_idx, 25, text_format)
                # Formato tabla
                (max_row, max_col) = df.shape
                table_range = f'A1:{chr(65+max_col-1)}{max_row+1}'
                worksheet.add_table(table_range, {
                    'columns': [{'header': col} for col in df.columns],
                    'name': 'Filtrados',
                    'style': 'Table Style Medium 9'
                })
            messagebox.showinfo("Guardado", f"Archivo guardado en: {archivo}")


    def borrar_seleccion_paises(self):
        self.listbox_paises.selection_clear(0, tk.END)
        self.seleccionados_paises.clear()

    def borrar_seleccion_facultades(self):
        self.listbox_facultades.selection_clear(0, tk.END)
        self.seleccionados_facultades.clear()

    def seleccionar_todos_paises(self):
        visibles = [self.listbox_paises.get(i) for i in range(self.listbox_paises.size())]
        seleccionados = [visibles[i] for i in self.listbox_paises.curselection()]
        if len(seleccionados) == len(visibles) and len(visibles) > 0:
            # Si todos están seleccionados, deselecciona todos
            self.listbox_paises.selection_clear(0, tk.END)
            self.seleccionados_paises.clear()
        else:
            # Si no, selecciona todos
            self.listbox_paises.select_set(0, tk.END)
            self.seleccionados_paises.update(visibles)

    def seleccionar_todas_facultades(self):
        visibles = [self.listbox_facultades.get(i) for i in range(self.listbox_facultades.size())]
        seleccionados = [visibles[i] for i in self.listbox_facultades.curselection()]
        if len(seleccionados) == len(visibles) and len(visibles) > 0:
            self.listbox_facultades.selection_clear(0, tk.END)
            self.seleccionados_facultades.clear()
        else:
            self.listbox_facultades.select_set(0, tk.END)
            self.seleccionados_facultades.update(visibles)

if __name__ == "__main__":
    app = App()
    app.mainloop()
