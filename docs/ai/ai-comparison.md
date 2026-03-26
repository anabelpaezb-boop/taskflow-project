# Comparativa entre asistentes de IA

En esta sección comparo el uso de dos asistentes de inteligencia artificial: **ChatGPT** y **Claude**. El objetivo es analizar cómo ayudan en tareas de programación, explicaciones técnicas y generación de código.

---

# Explicación de conceptos técnicos

Se pidió a ambos asistentes que explicaran algunos conceptos de JavaScript para comparar claridad y profundidad.

## Concepto 1: Closures

Prompt utilizado:

Explica qué es un closure en JavaScript con un ejemplo sencillo.

Resultado:

- **ChatGPT** dio una explicación estructurada, explicando primero el concepto y después mostrando un ejemplo de código.
- **Claude** dio una explicación más breve pero también clara.

Conclusión:

Ambos asistentes fueron útiles, aunque ChatGPT ofreció ejemplos más detallados.

---

## Concepto 2: Event Loop

Prompt utilizado:

Explica cómo funciona el event loop en JavaScript.

Resultado:

- ChatGPT explicó el funcionamiento del call stack, la cola de tareas y el event loop paso a paso.
- Claude explicó el concepto de manera más resumida.

Conclusión:

ChatGPT resultó más útil para entender el flujo completo de ejecución.

---

## Concepto 3: DOM

Prompt utilizado:

¿Qué es el DOM y cómo interactúa JavaScript con él?

Resultado:

- Ambos asistentes explicaron que el DOM es una representación del HTML que permite manipular la página desde JavaScript.
- ChatGPT proporcionó ejemplos de manipulación del DOM con `querySelector`.

Conclusión:

Ambos asistentes ofrecieron explicaciones claras.

---

# Detección de errores en funciones

Se crearon funciones con errores intencionales para ver si los asistentes detectaban el problema.

## Ejemplo 1

// ```javascript
function suma(a, b) {
  return a - b;
}

Encuentra el error en esta función.
Resultado:
Ambos asistentes detectaron que se estaba restando en lugar de sumar.

---

## Generación de código a partir de una descripción

También se pidió a los asistentes generar funciones a partir de una descripción.

- Prompt:
Crea una función que filtre un array de tareas y devuelva solo las completadas.

- Resultado:
Ambos asistentes generaron código correcto utilizando filter.

- Otro prompt:
Crea una función que cuente cuántas tareas están completadas.

- Resultado:
Ambos generaron funciones utilizando array.filter() y length.

--- 

## Uso de IA para mejorar el proyecto

Durante el desarrollo del proyecto TaskFlow / GoingFly, se pidió ayuda a la IA para:

- Sugerir mejoras para la aplicación.
- Proponer nuevas funcionalidades.
- Mejorar la estructura del código.

Algunas ideas sugeridas por la IA fueron:

- Añadir edición de tareas.
- Añadir barra de progreso.
- Crear filtros para las tareas.
- Añadir animaciones al crear tareas.
- Generar días dinámicos según la duración del viaje.

Estas ideas ayudaron a ampliar el proyecto y hacerlo más completo.

---

## Conclusión

Los asistentes de inteligencia artificial resultan herramientas muy útiles para el desarrollo.

Permiten:

- Entender conceptos técnicos.
- Detectar errores en código.
- Generar funciones rápidamente.
- Proponer mejoras en un proyecto.

Sin embargo, es importante revisar siempre el código generado para asegurarse de que funciona correctamente y se adapta al proyecto.

------------------------------------------------------------------------------------------------
# Comparativa ChatGPT vs Claude

Le pedí a ambos asistentes explicaciones sobre conceptos como el DOM, closures y event loop.

ChatGPT:
- Explicaciones claras y con ejemplos prácticos
- Mejor para principiantes

Claude:
- Más detallado
- Más técnico en algunos casos

También probé a introducir errores en funciones JavaScript.
Ambos detectaron errores, pero ChatGPT fue más directo.

Conclusión:
ChatGPT es más útil para desarrollo práctico.