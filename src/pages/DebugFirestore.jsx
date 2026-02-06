import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import Navbar from '../components/Navbar';

export default function DebugFirestore() {
    const [data, setData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setError(null);
                const collections = ['movies', 'theatres', 'showtimes', 'seats'];
                const result = {};
                
                for (const col of collections) {
                    const snapshot = await getDocs(collection(db, col));
                    result[col] = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                }
                
                setData(result);
            } catch (err) {
                console.error("Error fetching data:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Firestore Debug</h1>
                
                {loading && <p className="text-xl">Loading...</p>}
                
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        <p className="font-bold">Error:</p>
                        <p>{error}</p>
                        <p className="text-sm mt-2">Check Firestore rules in Firebase Console</p>
                    </div>
                )}
                
                {!loading && !error && (
                    <div className="space-y-6">
                        {Object.entries(data).map(([collection, docs]) => (
                            <div key={collection} className="bg-white rounded-lg shadow p-6">
                                <h2 className="text-xl font-bold mb-4 capitalize">
                                    {collection} ({docs.length})
                                </h2>
                                {docs.length === 0 ? (
                                    <p className="text-gray-500">No documents found</p>
                                ) : (
                                    <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-60 text-sm">
                                        {JSON.stringify(docs, null, 2)}
                                    </pre>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
