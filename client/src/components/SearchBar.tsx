import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface SearchBarProps {
  onSearch?: (query: string) => void
  placeholder?: string
}

export default function SearchBar({ onSearch, placeholder = 'ابحث عن عطور...' }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const navigate = useNavigate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)

    if (value.length > 2) {
      // Mock suggestions - replace with API call
      const mockSuggestions = [
        'عطر أود برفيوم',
        'عطر أود تواليت',
        'بخور سعودي',
        'عطور الرجال'
      ].filter(s => s.includes(value))

      setSuggestions(mockSuggestions)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleSearch = (searchQuery: string = query) => {
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery)
      } else {
        navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
      }
      setQuery('')
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    handleSearch(suggestion)
  }

  return (
    <div className="relative w-full max-w-2xl">
      <div className="flex items-center bg-white rounded-lg border border-gray-300 overflow-hidden">
        <MagnifyingGlassIcon className="w-5 h-5 mx-3 text-gray-400" />

        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          placeholder={placeholder}
          className="flex-1 px-3 py-2 outline-none text-sm"
        />

        {query && (
          <button
            onClick={() => {
              setQuery('')
              setSuggestions([])
            }}
            className="px-3 text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        )}

        <button
          onClick={() => handleSearch()}
          className="bg-primary text-secondary px-4 py-2 hover:bg-accent transition font-semibold"
        >
          بحث
        </button>
      </div>

      {/* Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-right px-4 py-2 hover:bg-gray-100 transition flex items-center space-x-2 text-sm"
            >
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 ml-2" />
              <span>{suggestion}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
