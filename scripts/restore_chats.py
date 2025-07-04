#!/usr/bin/env python3
"""
Script para restaurar y organizar chats de Cursor desde la base de datos del workspace
SIN usar Claude Dev para evitar crashes
"""

import json
import os
from datetime import datetime
from pathlib import Path

def process_cursor_chats():
    # Leer los datos extraídos
    with open('/tmp/cursor_chats_raw.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    print(f"🔍 ANÁLISIS DE CHATS CURSOR - PROYECTO COOMUNITY")
    print(f"=" * 60)
    print(f"📊 Total de elementos: {len(data)}")
    
    # Crear directorio para chats restaurados
    output_dir = Path("docs/restored-chats")
    output_dir.mkdir(exist_ok=True)
    
    # Contadores
    conversations = []
    user_messages = 0
    assistant_messages = 0
    
    # Procesar cada elemento
    for i, item in enumerate(data):
        if isinstance(item, dict) and 'text' in item:
            command_type = item.get('commandType', 'unknown')
            text = item.get('text', '')
            
            # Mapear tipos numéricos a strings
            if isinstance(command_type, int):
                if command_type == 4:
                    command_type_str = 'assistant'
                    assistant_messages += 1
                    msg_type = "🤖 ASSISTANT"
                elif command_type == 3:
                    command_type_str = 'user'
                    user_messages += 1
                    msg_type = "👤 USER"
                else:
                    command_type_str = f'type_{command_type}'
                    msg_type = f"❓ TYPE_{command_type}"
            else:
                # Para strings (casos legacy)
                command_type_str = str(command_type)
                if command_type == 'user':
                    user_messages += 1
                    msg_type = "👤 USER"
                elif command_type == 'assistant':
                    assistant_messages += 1
                    msg_type = "🤖 ASSISTANT"
                else:
                    msg_type = f"❓ {command_type}"
            
            conversations.append({
                'index': i,
                'type': command_type_str,
                'text': text,
                'length': len(text),
                'preview': text[:150] + "..." if len(text) > 150 else text
            })
    
    # Estadísticas
    print(f"👤 Mensajes de usuario: {user_messages}")
    print(f"🤖 Mensajes del asistente: {assistant_messages}")
    print(f"📝 Total procesados: {len(conversations)}")
    
    # Crear archivo de resumen
    summary_file = output_dir / "chat_summary.md"
    with open(summary_file, 'w', encoding='utf-8') as f:
        f.write(f"# 📋 RESUMEN DE CHATS RESTAURADOS - PROYECTO COOMUNITY\n\n")
        f.write(f"**Fecha de restauración:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
        f.write(f"## 📊 Estadísticas\n\n")
        f.write(f"- **Total de elementos:** {len(data)}\n")
        f.write(f"- **Mensajes de usuario:** {user_messages}\n")
        f.write(f"- **Mensajes del asistente:** {assistant_messages}\n")
        f.write(f"- **Conversaciones procesadas:** {len(conversations)}\n\n")
        
        f.write(f"## 🗂️ Índice de Conversaciones\n\n")
        for conv in conversations:
            msg_type = "👤" if conv['type'] == 'user' else "🤖" if conv['type'] == 'assistant' else "❓"
            f.write(f"{conv['index']:3d}. {msg_type} **{conv['type'].upper()}** ({conv['length']} chars)\n")
            f.write(f"     _{conv['preview']}_\n\n")
    
    # Crear archivos individuales para conversaciones largas (>1000 caracteres)
    long_conversations = [c for c in conversations if c['length'] > 1000]
    
    for conv in long_conversations[:10]:  # Primeras 10 conversaciones largas
        filename = f"conversation_{conv['index']:03d}_{conv['type']}.md"
        filepath = output_dir / filename
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(f"# Conversación #{conv['index']} - {conv['type'].upper()}\n\n")
            f.write(f"**Tipo:** {conv['type']}\n")
            f.write(f"**Longitud:** {conv['length']} caracteres\n")
            f.write(f"**Fecha de extracción:** {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            f.write(f"---\n\n")
            f.write(conv['text'])
    
    # Crear archivo consolidado con todas las conversaciones
    all_chats_file = output_dir / "all_chats_consolidated.json"
    with open(all_chats_file, 'w', encoding='utf-8') as f:
        json.dump(conversations, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ RESTAURACIÓN COMPLETADA")
    print(f"📁 Archivos creados en: {output_dir}")
    print(f"📄 Resumen: {summary_file}")
    print(f"📊 Datos consolidados: {all_chats_file}")
    print(f"📝 Conversaciones largas: {len(long_conversations)} archivos")
    
    return output_dir, len(conversations)

if __name__ == "__main__":
    try:
        output_dir, total = process_cursor_chats()
        print(f"\n🎉 ¡{total} conversaciones restauradas exitosamente!")
        print(f"🚫 Sin usar Claude Dev (evitando crashes)")
    except Exception as e:
        print(f"❌ Error: {e}") 