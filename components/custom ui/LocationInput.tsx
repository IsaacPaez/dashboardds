"use client";

import React, { useEffect, useRef, useState } from "react";

interface LocationInputProps {
  onPlaceSelect: (address: string) => void;
  defaultValue?: string;
  className?: string; // Permitir clases personalizadas
}

const LocationInput: React.FC<LocationInputProps> = ({
  onPlaceSelect,
  defaultValue,
  className,
}) => {
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState(defaultValue || "");

  useEffect(() => {
    // Verificar si la API de Google Maps y la librería de places están cargadas
    if (!window.google || !window.google.maps || !window.google.maps.places) {
      console.error("Google Maps Places API not loaded");
      return;
    }

    // Instanciar el Web Component
    // @ts-ignore - PlaceAutocompleteElement es nuevo y puede no estar en los tipos aún
    const autocompleteElement = new google.maps.places.PlaceAutocompleteElement();

    // Referencia al elemento DOM real que crea el web component (para estilos)
    // Nota: El web component en sí mismo es el input.
    
    // Configurar estilos y atributos
    // Tailwind classes applied via classList or wrapping div
    autocompleteElement.classList.add("w-full", "h-10", "rounded-md", "border", "border-input", "bg-background", "px-3", "py-2", "text-sm", "ring-offset-background", "file:border-0", "file:bg-transparent", "file:text-sm", "file:font-medium", "placeholder:text-muted-foreground", "focus-visible:outline-none", "focus-visible:ring-2", "focus-visible:ring-ring", "focus-visible:ring-offset-2", "disabled:cursor-not-allowed", "disabled:opacity-50");
    
    // Forzar estilos inline para asegurar compatibilidad con temas y overriding de Shadow DOM si fuera posible (limitado)
    // La clave es usar las variables CSS expuestas por el componente de Google
    // --gmp-px-color-surface: Fondo del dropdown
    // --gmp-px-color-on-surface: Texto
    autocompleteElement.style.setProperty("--gmp-px-color-surface", "#ffffff");
    autocompleteElement.style.setProperty("--gmp-px-color-on-surface", "#000000");
    autocompleteElement.style.setProperty("--gmp-px-color-on-surface-variant", "#555555"); // Placeholder o texto secundario
    autocompleteElement.style.setProperty("color-scheme", "light"); // Forzar modo claro
    
    // Listener para el evento de selección
    autocompleteElement.addEventListener("gmp-placeselect", (event: any) => {
      const place = event.place;
      if (place && place.formatted_address) {
        onPlaceSelect(place.formatted_address);
        setInputValue(place.formatted_address);
      }
    });

    // Añadir al DOM
    if (inputContainerRef.current) {
        inputContainerRef.current.innerHTML = ""; // Limpiar contenedor
        inputContainerRef.current.appendChild(autocompleteElement);
    }
    
    // Intentar setear valor inicial si existe (No siempre soportado directamente por la API pública en modo controlado, 
    // pero podemos intentar o dejar que el usuario escriba). 
    // Actualmente el componente no expone una propiedad "value" simple para escritura bidireccional perfecta en los tipos.

    return () => {
      // Cleanup si fuera necesario
      if (inputContainerRef.current) {
        inputContainerRef.current.innerHTML = "";
      }
    };
  }, [onPlaceSelect]);

  return (
    <div className={`w-full ${className}`}>
        {/* Contenedor para el Web Component */}
        <div ref={inputContainerRef} className="places-input-container" />
        
        <style jsx global>{`
            /* Estilos globales para asegurar que el popup se vea bien */
            gmp-place-autocomplete {
                --gmp-px-color-surface: #ffffff;
                --gmp-px-color-on-surface: #000000;
                color-scheme: light;
            }
            .places-input-container input {
                /* Intentar heredar estilos si el web component expone shadow styling o partes */
                width: 100%;
            }
        `}</style>
    </div>
  );
};

export default LocationInput;
