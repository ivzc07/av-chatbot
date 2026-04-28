#!/usr/bin/env python3
"""Formatea una Google Sheet como CRM para un nuevo cliente de AuxoVelari.

La SA no puede crear sheets (solo editar), así que el instalador:
  1. Crea una Google Sheet vacía en Drive (30 segundos)
  2. La comparte con la service account como Editor
  3. Ejecuta este script con el ID de la sheet

Uso:
    python3 create-client-sheet.py <SHEET_ID> "Nombre del Negocio"

Ejemplo:
    python3 create-client-sheet.py 1a2b3c4d5e6f "Restaurante El Faro"
"""

import sys, json, os
from google.oauth2 import service_account
from googleapiclient.discovery import build

DEFAULT_CREDS = "/opt/data/auxovelari/credentials/credentials.json"

# ── colores del formato condicional ──
GREEN = {"red": 0.776, "green": 0.929, "blue": 0.776}
AMBER = {"red": 1.0,   "green": 0.949, "blue": 0.698}
GRAY  = {"red": 0.847, "green": 0.847, "blue": 0.847}

CRM_HEADERS = [
    "Fecha y Hora", "Nombre Visitante", "Contacto Visitante",
    "Resumen Conversación", "Estado del Lead", "Temas Preguntados",
    "Confianza Chatbot", "Session ID"
]

KB_ROWS = [
    ("Nombre", ""),
    ("Dirección", ""),
    ("Teléfono", ""),
    ("Email", ""),
    ("Horario", ""),
    ("Especialidades", ""),
    ("Precios", ""),
    ("Reservas", ""),
    ("Telegram Token", ""),
    ("Telegram Chat ID", ""),
]


def formatear(sheet_id, nombre_cliente, creds_path):
    creds = service_account.Credentials.from_service_account_file(
        creds_path, scopes=["https://www.googleapis.com/auth/spreadsheets"]
    )
    sheets = build("sheets", "v4", credentials=creds)

    # renombrar Sheet1 → CRM
    meta = sheets.spreadsheets().get(spreadsheetId=sheet_id).execute()
    sheet1_id = meta["sheets"][0]["properties"]["sheetId"]
    sheets.spreadsheets().batchUpdate(spreadsheetId=sheet_id, body={
        "requests": [{"updateSheetProperties": {
            "properties": {"sheetId": sheet1_id, "title": "CRM"}, "fields": "title"
        }}]
    }).execute()

    # escribir panel + headers
    sheets.spreadsheets().values().batchUpdate(spreadsheetId=sheet_id, body={
        "valueInputOption": "USER_ENTERED",
        "data": [
            {"range": "CRM!A1",     "values": [["📊 RESUMEN CRM"]]},
            {"range": "CRM!A2",     "values": [[
                '=CONTARA(H4:H)', '', 'Leads captados:',
                '=CONTAR.SI(E4:E;"Lead caliente")', 'Tasa conversión:',
                '=SI(A2>0;D2/A2;0)'
            ]]},
            {"range": "CRM!A3:H3",  "values": [CRM_HEADERS]},
        ]
    }).execute()

    # formato condicional + fijar fila 3 + ordenar
    rules = [
        ("Rebote",  GRAY),
        ("Consulta", AMBER),
        ("Lead caliente", GREEN),
    ]
    requests = []
    for i, (texto, color) in enumerate(rules):
        requests.append({"addConditionalFormatRule": {"rule": {
            "ranges": [{"sheetId": sheet1_id, "startRowIndex": 3, "endRowIndex": 1000,
                         "startColumnIndex": 4, "endColumnIndex": 5}],
            "booleanRule": {
                "condition": {"type": "TEXT_EQ", "values": [{"userEnteredValue": texto}]},
                "format": {"backgroundColor": color}
            }
        }, "index": i}})

    requests.append({"updateSheetProperties": {
        "properties": {"sheetId": sheet1_id, "gridProperties": {"frozenRowCount": 3}},
        "fields": "gridProperties.frozenRowCount"
    }})
    requests.append({"sortRange": {
        "range": {"sheetId": sheet1_id, "startRowIndex": 3, "endRowIndex": 1000,
                   "startColumnIndex": 0, "endColumnIndex": 8},
        "sortSpecs": [{"dimensionIndex": 0, "sortOrder": "DESCENDING"}]
    }})
    sheets.spreadsheets().batchUpdate(spreadsheetId=sheet_id, body={"requests": requests}).execute()

    # crear pestaña Conocimiento
    kb = sheets.spreadsheets().batchUpdate(spreadsheetId=sheet_id, body={
        "requests": [{"addSheet": {"properties": {
            "title": "Conocimiento", "gridProperties": {"frozenRowCount": 1}
        }}}]
    }).execute()

    # escribir KB
    kb_values = [["Tema", "Contenido"]]
    for tema, contenido in KB_ROWS:
        kb_values.append([tema, contenido])
    sheets.spreadsheets().values().batchUpdate(spreadsheetId=sheet_id, body={
        "valueInputOption": "USER_ENTERED",
        "data": [{"range": "Conocimiento!A1", "values": kb_values}]
    }).execute()

    print(f"✅ Sheet formateada: {nombre_cliente}")
    print(f"   ID:  {sheet_id}")
    print(f"   URL: https://docs.google.com/spreadsheets/d/{sheet_id}")
    print()
    print("📝  Siguientes pasos:")
    print("   1. Rellena los datos del negocio en la pestaña Conocimiento")
    print("   2. Pega el Sheet ID en el workflow de n8n (nodos Google Sheets)")


def main():
    if len(sys.argv) < 3:
        print("Uso: python3 create-client-sheet.py <SHEET_ID> \"Nombre del Negocio\"")
        print("      python3 create-client-sheet.py <SHEET_ID> \"Nombre del Negocio\" --creds ruta/creds.json")
        sys.exit(1)

    sheet_id = sys.argv[1]
    nombre = sys.argv[2]
    creds_path = DEFAULT_CREDS

    # parse opcional --creds
    for i, arg in enumerate(sys.argv):
        if arg == "--creds" and i + 1 < len(sys.argv):
            creds_path = sys.argv[i + 1]

    if not os.path.exists(creds_path):
        print(f"❌ Credenciales no encontradas: {creds_path}")
        sys.exit(1)

    formatear(sheet_id, nombre, creds_path)


if __name__ == "__main__":
    main()
