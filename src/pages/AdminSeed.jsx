import { useState } from 'react';
import { seedFirestore, clearFirestore, resetFirestore } from '../seed/seedData';
import Navbar from '../components/Navbar';
import { db } from '../config/firebase';
import { getDocs, collection } from 'firebase/firestore';

export default function AdminSeed() {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [logs, setLogs] = useState([]);

    const addLog = (message) => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
    };

    const handleCheckConnection = async () => {
        setLoading(true);
        setLogs([]);
        addLog('Checking Firebase connection...');
        try {
            const snapshot = await getDocs(collection(db, 'movies'));
            addLog(`✅ Connection successful! Movies in database: ${snapshot.size}`);
            setResult({ connected: true, movieCount: snapshot.size });
        } catch (error) {
            addLog(`❌ Connection failed: ${error.message}`);
            setResult({ connected: false, error: error.message });
        }
        setLoading(false);
    };

    const handleSeed = async () => {
        setLoading(true);
        setLogs([]);
        addLog('Starting seed process...');
        try {
            const res = await seedFirestore();
            addLog('✅ Seed completed successfully!');
            setResult(res);
        } catch (error) {
            addLog(`❌ Seed failed: ${error.message}`);
            setResult({ error: error.message });
        }
        setLoading(false);
    };

    const handleClear = async () => {
        setLoading(true);
        setLogs([]);
        addLog('Starting clear process...');
        try {
            const res = await clearFirestore();
            addLog('✅ Clear completed successfully!');
            setResult(res);
        } catch (error) {
            addLog(`❌ Clear failed: ${error.message}`);
            setResult({ error: error.message });
        }
        setLoading(false);
    };

    const handleReset = async () => {
        setLoading(true);
        setLogs([]);
        addLog('Starting reset process...');
        try {
            await resetFirestore();
            addLog('✅ Reset completed successfully!');
            setResult({ message: 'Reset completed!' });
        } catch (error) {
            addLog(`❌ Reset failed: ${error.message}`);
            setResult({ error: error.message });
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Firebase Firestore Seed</h1>
                
                <div className="bg-white rounded-lg shadow p-6 max-w-4xl">
                    <p className="mb-6 text-gray-600">
                        Use the buttons below to seed or clear data from your Firestore database.
                        <br />
                        <span className="text-sm text-gray-500">
                            Make sure Firestore is enabled in your Firebase Console → Firestore Database
                        </span>
                    </p>

                    <div className="flex flex-wrap gap-4 mb-6">
                        <button
                            onClick={handleCheckConnection}
                            disabled={loading}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                        >
                            {loading ? 'Loading...' : 'Check Connection'}
                        </button>

                        <button
                            onClick={handleSeed}
                            disabled={loading}
                            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                        >
                            {loading ? 'Loading...' : 'Seed Data'}
                        </button>

                        <button
                            onClick={handleClear}
                            disabled={loading}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                        >
                            {loading ? 'Loading...' : 'Clear All Data'}
                        </button>

                        <button
                            onClick={handleReset}
                            disabled={loading}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                        >
                            {loading ? 'Loading...' : 'Reset (Clear + Seed)'}
                        </button>
                    </div>

                    {logs.length > 0 && (
                        <div className="mb-6 p-4 bg-gray-900 rounded">
                            <h3 className="text-green-400 font-bold mb-2">Console Logs:</h3>
                            <pre className="text-green-300 text-sm overflow-auto max-h-64">
                                {logs.join('\n')}
                            </pre>
                        </div>
                    )}

                    {result && (
                        <div className={`p-4 rounded ${result.error ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            <h3 className="font-bold mb-2">
                                {result.error ? '❌ Error' : '✅ Success'}
                            </h3>
                            {result.error ? (
                                <p>{result.error}</p>
                            ) : result.connected ? (
                                <p>Connected to Firestore. Movies in database: {result.movieCount}</p>
                            ) : (
                                <pre className="overflow-auto">
                                    {JSON.stringify(result, null, 2)}
                                </pre>
                            )}
                        </div>
                    )}

                    <div className="mt-6 p-4 bg-gray-100 rounded">
                        <h3 className="font-bold mb-2">What will be seeded:</h3>
                        <ul className="list-disc list-inside text-gray-700">
                            <li>12 Movies (Avengers, John Wick, Spider-Man, etc.)</li>
                            <li>3 Theatres (Grand Cinema, City Plex, IMAX Arena)</li>
                            <li>12 Showtimes (linking movies to theatres)</li>
                            <li>1080 Seats (90 seats per showtime × 12 showtimes)</li>
                        </ul>
                    </div>

                    <div className="mt-4 p-4 bg-yellow-100 rounded">
                        <h3 className="font-bold mb-2 text-yellow-800">Troubleshooting:</h3>
                        <ul className="list-disc list-inside text-yellow-800 text-sm">
                            <li>Make sure Firestore Database is enabled in Firebase Console</li>
                            <li>Check that your .env file has correct Firebase credentials</li>
                            <li>Ensure Firestore rules allow write access (for testing, use test mode)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
