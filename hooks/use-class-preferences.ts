"use client";

import { useEffect, useState } from "react";

export type ViewMode = "grid" | "list";
export type SortOption = "name" | "schedule" | "enrollment" | "recent";

interface ClassPreferences {
    viewMode: ViewMode;
    sortBy: SortOption;
    showArchived: boolean;
    compactMode: boolean;
}

const DEFAULT_PREFERENCES: ClassPreferences = {
    viewMode: "grid",
    sortBy: "recent",
    showArchived: false,
    compactMode: false,
};

const STORAGE_KEY = "faculty-classes-preferences-v1";

export function useClassPreferences() {
    const [preferences, setPreferences] = useState<ClassPreferences>(DEFAULT_PREFERENCES);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load preferences from local storage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved) {
                const parsed = JSON.parse(saved);
                setPreferences({ ...DEFAULT_PREFERENCES, ...parsed });
            } else {
                // If no saved preference, try to determine smart defaults
                // e.g. mobile might default to list view? 
                // For now sticking to grid as default but this is where smart logic goes
                if (window.innerWidth < 640) {
                    setPreferences(prev => ({ ...prev, viewMode: "list" }));
                }
            }
        } catch (error) {
            console.error("Failed to load class preferences:", error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // Save preferences whenever they change
    useEffect(() => {
        if (!isLoaded) return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
        } catch (error) {
            console.error("Failed to save class preferences:", error);
        }
    }, [preferences, isLoaded]);

    const updatePreference = <K extends keyof ClassPreferences>(
        key: K,
        value: ClassPreferences[K]
    ) => {
        setPreferences((prev) => ({ ...prev, [key]: value }));
    };

    return {
        preferences,
        updatePreference,
        isLoaded,
    };
}
