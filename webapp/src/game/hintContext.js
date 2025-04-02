const contextMap = {
    "Geografia": "Genera una pista en español sobre la respuesta correcta sin revelar directamente la respuesta. Describe su bandera o donde esta posicionado",
    "Cultura": "Da algun hecho importante de este monumento, donde esta colocado o cuando se hizo. Sin decir el monumento, a modo de pista." ,
    "Personajes": "Genera una pista en español sobre la respuesta correcta sin revelarla directamente. Da algun hecho importante de este personaje, y haz un juego de palabras con su apellido",
    "default": "Genera una pista en español sobre la respuesta correcta sin revelarla directamente. Da un juego de palabras con la respuesta correcta."
  };
  
  /**
   * Obtiene el contexto según el tipo de pregunta.
   * @param {string} tipo - El tipo de pregunta (clave del hashmap).
   * @returns {string} - El contexto asociado o el contexto por defecto.
   */
  export function getContext(tipo) {
    return contextMap[tipo] || contextMap["default"];
  }
  
  export default contextMap;
  