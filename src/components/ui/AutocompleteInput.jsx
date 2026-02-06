import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown } from 'lucide-react';

/**
 * AutocompleteInput - Input con autocompletado
 * @param {string[]} options - Lista de opciones para autocompletar
 * @param {string} value - Valor actual
 * @param {function} onChange - Callback cuando cambia el valor
 * @param {string} placeholder - Placeholder del input
 * @param {string} label - Label del input
 */
export const AutocompleteInput = ({ options = [], value, onChange, placeholder, label }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filteredOptions, setFilteredOptions] = useState([]);
    const [highlightedIndex, setHighlightedIndex] = useState(0);
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);

    // Filtrar opciones cuando cambia el valor
    useEffect(() => {
        if (!value) {
            setFilteredOptions(options.slice(0, 10));
            return;
        }

        const lowerValue = value.toLowerCase();
        const filtered = options
            .filter(option => option.toLowerCase().includes(lowerValue))
            .slice(0, 10);

        setFilteredOptions(filtered);
        setHighlightedIndex(0);
    }, [value, options]);

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleKeyDown = (e) => {
        if (!isOpen) {
            if (e.key === 'ArrowDown' || e.key === 'Enter') {
                setIsOpen(true);
                e.preventDefault();
            }
            return;
        }

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(prev =>
                    prev < filteredOptions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
                break;
            case 'Enter':
                e.preventDefault();
                if (filteredOptions[highlightedIndex]) {
                    onChange(filteredOptions[highlightedIndex]);
                    setIsOpen(false);
                }
                break;
            case 'Escape':
                setIsOpen(false);
                break;
        }
    };

    const handleSelect = (option) => {
        onChange(option);
        setIsOpen(false);
        inputRef.current?.focus();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}

            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </div>

            {/* Dropdown */}
            {isOpen && filteredOptions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {filteredOptions.map((option, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handleSelect(option)}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-primary-50 transition-colors ${index === highlightedIndex ? 'bg-primary-50' : ''
                                }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            )}

            {/* No results */}
            {isOpen && filteredOptions.length === 0 && value && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-sm text-gray-500 text-center">
                    No se encontraron resultados
                </div>
            )}
        </div>
    );
};
