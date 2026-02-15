import { LazyStore } from '@tauri-apps/plugin-store';
import { useEffect, useState } from 'react';

const store = new LazyStore('settings.json');

export function usePersistence<T>(key: string, defaultValue: T) {
    const [data, setData] = useState<T>(defaultValue);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const saved = await store.get<T>(key);
                if (saved !== null && saved !== undefined) {
                    setData(saved as T);
                }
            } catch (e) {
                console.error('Failed to load data:', e);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, [key]);

    const saveData = async (newData: T) => {
        setData(newData);
        try {
            await store.set(key, newData);
            await store.save();
        } catch (e) {
            console.error('Failed to save data:', e);
        }
    };

    return [data, saveData, loading] as const;
}
