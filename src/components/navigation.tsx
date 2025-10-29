// This file now delegates to the new modular navigation system
// The original monolithic navigation.tsx has been refactored into multiple files
// for better maintainability and code organization

export { default as Navigation } from './navigation/Navigation'

// Sobald die Dateien existieren, sauber (ohne Wildcard) freischalten:
// export { NavigationItem } from './navigation/NavigationItem'
// export { OverflowNavigation } from './navigation/OverflowNavigation'
